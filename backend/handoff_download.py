"""Owner-requested, sanitized project download. No guest UI link or data export."""
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(prefix='/api/handoff')
ARCHIVE_NAME = 'anugraha-akash-two-invitations.zip'
ARCHIVE = Path(__file__).resolve().parent.parent / 'handoff' / 'dist' / ARCHIVE_NAME


@router.get('/project.zip', include_in_schema=False)
async def project_archive():
    # Only one fixed, allowlisted archive; no filesystem/path input from callers.
    if not ARCHIVE.is_file():
        raise HTTPException(404, 'Project archive is not available on this server.')
    return FileResponse(ARCHIVE, media_type='application/zip', filename=ARCHIVE_NAME,
                        headers={'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'})