import uuid
from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel, ConfigDict, Field

from database import db

router = APIRouter(prefix='/api/rsvp')


class RSVPInput(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)
    name: str = Field(min_length=1, max_length=120)
    attendance: Literal['yes', 'no']
    guest_count: int = Field(ge=1, le=1000, strict=True)
    note: str = Field(default='', max_length=2000)


class RSVPRecord(RSVPInput):
    id: str
    timestamp: datetime


@router.post('', response_model=RSVPRecord, status_code=201)
async def save_rsvp(body: RSVPInput):
    record = RSVPRecord(**body.model_dump(), id=f'rsvp_{uuid.uuid4().hex}',
                        timestamp=datetime.now(timezone.utc))
    # Deliberately no unique name/device restriction: each submission is separate.
    # Receipt and delivery intent are committed together; Google is never on the
    # guest request's critical path. Metadata is not included in the public model.
    document = record.model_dump()
    document['sheet_delivery'] = {
        'state': 'pending', 'attempts': 0, 'next_attempt_at': record.timestamp,
    }
    await db.rsvps.insert_one(document)
    return record