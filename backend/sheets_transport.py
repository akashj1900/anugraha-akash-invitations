"""Private Apps Script client. No guest-visible configuration or read endpoint."""
import asyncio
import os
import re
from dataclasses import dataclass
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv

load_dotenv()


class DeliveryError(Exception):
    """Static, non-sensitive reason suitable for internal diagnostics only."""


@dataclass(frozen=True)
class SheetsConfig:
    url: str
    secret: str
    spreadsheet_id: str

    @classmethod
    def from_env(cls):
        url = os.getenv('SHEETS_SCRIPT_URL', '').strip()
        if not url:
            return None
        parsed = urlparse(url)
        secret = os.getenv('SHEETS_CONNECTION_SECRET', '')
        sheet = os.getenv('SHEETS_SPREADSHEET_ID', '')
        if (parsed.scheme != 'https' or parsed.netloc != 'script.google.com'
                or not re.fullmatch(r'/macros/s/[A-Za-z0-9_-]+/exec', parsed.path)
                or parsed.query or parsed.fragment or len(secret) < 32 or not sheet):
            raise DeliveryError('invalid_configuration')
        return cls(url, secret, sheet)


class SheetsTransport:
    def __init__(self, config: SheetsConfig, http: httpx.AsyncClient):
        self.config, self.http = config, http

    async def request(self, action: str, record: dict | None = None):
        payload = {'secret': self.config.secret, 'action': action, 'record': record}
        try:
            response = await asyncio.wait_for(
                self.http.post(self.config.url, json=payload, follow_redirects=False), 65)
            # ContentService redirects to a one-time Google URL. Never forward
            # the secret/body to a redirect, and never follow a Google login page.
            if response.status_code in {301, 302, 303}:
                location = response.headers.get('location', '')
                target = urlparse(location)
                if target.scheme != 'https' or target.netloc != 'script.googleusercontent.com':
                    raise DeliveryError('connection_access_required')
                response = await self.http.get(location, follow_redirects=False)
            if response.status_code != 200:
                raise DeliveryError('google_unavailable')
            body = response.json()
        except (httpx.RequestError, TimeoutError) as exc:
            raise DeliveryError('connection_interrupted') from exc
        except ValueError as exc:
            raise DeliveryError('invalid_google_response') from exc
        if not isinstance(body, dict) or body.get('ok') is not True:
            known = {'unauthorized', 'destination_missing', 'headers_changed', 'invalid_record', 'busy', 'delivery_failed'}
            code = body.get('code') if isinstance(body, dict) else None
            raise DeliveryError(code if code in known else 'invalid_google_response')
        if body.get('spreadsheet_id') != self.config.spreadsheet_id or body.get('protocol') != 1:
            raise DeliveryError('wrong_destination')
        if action == 'append' and (body.get('reference') != record['id']
                                   or body.get('result') not in {'appended', 'already_saved'}):
            raise DeliveryError('delivery_not_confirmed')
        return body