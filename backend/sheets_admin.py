"""Server-only diagnostics: python sheets_admin.py [status|check]. Not an API."""
import asyncio
import sys

import httpx

from database import client, db
from sheets_transport import DeliveryError, SheetsConfig, SheetsTransport


async def main():
    try:
        config = SheetsConfig.from_env()
        print('Connection:', 'configured' if config else 'awaiting owner setup')
        print('Queued:', await db.rsvps.count_documents({'sheet_delivery.state': {'$ne': 'sent'}, 'is_test': {'$ne': True}, 'exclude_from_sheet': {'$ne': True}}))
        print('Delivered:', await db.rsvps.count_documents({'sheet_delivery.state': 'sent'}))
        if sys.argv[1:] == ['check'] and config:
            async with httpx.AsyncClient(timeout=httpx.Timeout(50, connect=10)) as http:
                result = await SheetsTransport(config, http).request('check')
                print('Google connection verified. Destination tab:', result.get('tab_name'))
        elif sys.argv[1:] == ['check']:
            print('Not connected: no /exec URL has been supplied.')
    except DeliveryError as exc:
        print('Connection needs attention:', str(exc))
        raise SystemExit(1)
    finally:
        client.close()


if __name__ == '__main__':
    asyncio.run(main())