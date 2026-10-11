"""Durable Mongo-backed outbox, including pre-existing saved guest responses."""
import asyncio
import logging
import random
import uuid
from datetime import datetime, timedelta, timezone

import httpx
from pymongo import ReturnDocument

from sheets_transport import DeliveryError, SheetsConfig, SheetsTransport

logger = logging.getLogger(__name__)


class SheetsWorker:
    def __init__(self, database):
        self.db = database

    async def backfill(self):
        await self.db.rsvps.update_many(
            {'sheet_delivery': {'$exists': False}, 'is_test': {'$ne': True},
             'exclude_from_sheet': {'$ne': True}},
            {'$set': {'sheet_delivery': {'state': 'pending', 'attempts': 0,
                                       'next_attempt_at': datetime.now(timezone.utc)}}})

    async def claim(self):
        now = datetime.now(timezone.utc)
        return await self.db.rsvps.find_one_and_update(
            {'is_test': {'$ne': True}, 'exclude_from_sheet': {'$ne': True},
             'sheet_delivery.state': {'$ne': 'sent'}, '$and': [
                 {'$or': [{'sheet_delivery.next_attempt_at': {'$exists': False}},
                          {'sheet_delivery.next_attempt_at': {'$lte': now}}]},
                 {'$or': [{'sheet_delivery.lease_until': {'$exists': False}},
                          {'sheet_delivery.lease_until': {'$lte': now}}]},
             ]},
            {'$set': {'sheet_delivery.state': 'sending',
                      'sheet_delivery.lease_token': uuid.uuid4().hex,
                      'sheet_delivery.lease_until': now + timedelta(minutes=3)},
             '$inc': {'sheet_delivery.attempts': 1}},
            sort=[('timestamp', 1), ('id', 1)], projection={'_id': 0},
            return_document=ReturnDocument.AFTER)

    async def deliver_one(self, transport):
        doc = await self.claim()
        if not doc:
            return False
        delivery = doc['sheet_delivery']
        match = {'id': doc['id'], 'sheet_delivery.lease_token': delivery['lease_token']}
        record = {key: doc[key] for key in ('id', 'name', 'attendance', 'guest_count', 'note', 'timestamp') if key in doc}
        record.setdefault('note', '')
        timestamp = record['timestamp']
        if isinstance(timestamp, datetime):
            record['timestamp'] = timestamp.replace(tzinfo=timestamp.tzinfo or timezone.utc).isoformat()
        try:
            await transport.request('append', record)
            update = {'state': 'sent', 'delivered_at': datetime.now(timezone.utc), 'last_error': None}
        except DeliveryError as exc:
            delay = min(3600, 5 * 2 ** min(delivery['attempts'], 10)) + random.uniform(0, 5)
            update = {'state': 'retry', 'last_error': str(exc),
                      'next_attempt_at': datetime.now(timezone.utc) + timedelta(seconds=delay)}
            logger.warning('Spreadsheet delivery pending: %s', exc)
        await self.db.rsvps.update_one(match, {
            '$set': {f'sheet_delivery.{key}': value for key, value in update.items()},
            '$unset': {'sheet_delivery.lease_until': '', 'sheet_delivery.lease_token': ''},
        })
        return True

    async def run(self):
        try:
            config = SheetsConfig.from_env()
        except DeliveryError:
            logger.warning('Spreadsheet configuration needs repair; responses remain saved.')
            return
        if not config:
            logger.info('Spreadsheet connection awaits owner setup; responses remain queued.')
            return
        async with httpx.AsyncClient(timeout=httpx.Timeout(50, connect=10)) as http:
            transport = SheetsTransport(config, http)
            checked = False
            while True:
                try:
                    if not checked:
                        await transport.request('check')
                        checked = True
                    worked = await self.deliver_one(transport)
                    await asyncio.sleep(1 if worked else 5)
                except asyncio.CancelledError:
                    raise
                except Exception as exc:
                    # No request bodies, RSVP content, connection URL, or secret.
                    logger.warning('Spreadsheet queue paused (%s); saved responses retained.', type(exc).__name__)
                    await asyncio.sleep(30)