import logging
import asyncio
from contextlib import suppress
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from pymongo.errors import PyMongoError
from starlette.middleware.cors import CORSMiddleware

from database import client, db
from rsvps import router as rsvp_router
from sheets_worker import SheetsWorker
from handoff_download import router as handoff_router

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.rsvps.create_index([('timestamp', -1), ('id', -1)])
    await db.rsvps.create_index([('sheet_delivery.state', 1), ('sheet_delivery.next_attempt_at', 1)])
    worker = SheetsWorker(db)
    await worker.backfill()
    task = asyncio.create_task(worker.run())
    try:
        yield
    finally:
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task
        client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix='/api')


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get('/')
async def root():
    return {'message': 'Wedding invitation API'}


@api_router.post('/status', response_model=StatusCheck)
async def create_status_check(body: StatusCheckCreate):
    record = StatusCheck(**body.model_dump())
    await db.status_checks.insert_one(record.model_dump())
    return record


@api_router.get('/status', response_model=list[StatusCheck])
async def get_status_checks():
    return await db.status_checks.find({}, {'_id': 0}).to_list(1000)


@app.exception_handler(PyMongoError)
async def database_error(request: Request, exc: PyMongoError):
    logger.error('Database operation failed: %s', type(exc).__name__)
    return JSONResponse(status_code=503, content={'detail': 'Saving or loading is temporarily unavailable. Please try again.'})


@app.middleware('http')
async def private_no_cache(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith(('/api/auth', '/api/rsvp')):
        response.headers['Cache-Control'] = 'no-store'
    return response


app.include_router(api_router)
app.include_router(rsvp_router)
app.include_router(handoff_router)
app.add_middleware(CORSMiddleware,
                   allow_origins=[x.strip() for x in os.getenv('CORS_ORIGINS', '').split(',') if x.strip()],
                   allow_credentials=False, allow_methods=['GET', 'POST'],
                   allow_headers=['Content-Type'])