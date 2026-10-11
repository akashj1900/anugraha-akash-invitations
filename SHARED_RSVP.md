# One shared RSVP service — leave the working connection in place

## Default: reuse the existing service

Both editions' safe `.env.example` files contain the same existing public API base
address. Keep that service running. **Do not create another backend, spreadsheet,
tab, script project or script deployment for the second edition.** The existing
Mongo database and private **Wedding RSVPs** tab remain authoritative. Identical
intentional guest submissions remain separate, as before.

No edition/name/source field is submitted: only `name`, `attendance` (`yes`/`no`),
`guest_count` (includes respondent), and optional `note`. Receipt is confirmed after
Mongo save, with Google delivery handled durably in the background. No auth is
needed for guests. The script reference column remains hidden and must be retained.

### Required after you know the two site addresses: CORS

The current API deliberately allows specific browser origins. Ask the person
maintaining that backend to add the two final **origins** (HTTPS scheme + hostname,
no path or trailing slash) to its private `CORS_ORIGINS` setting, preserving the
existing values. Multiple entries are comma-separated. Restart the backend after
changing that environment setting. Do not use a public wildcard as a shortcut.

The final addresses do not exist yet, so they cannot be added in advance by this
handoff. New-site RSVP is **not verified** until those origins are authorized and
the shared service is reachable. The frontend shows a retry message rather than
claiming success if the save fails.

For read-only connectivity, request `GET /api/` at the public backend base. Browser
CORS may be checked with an OPTIONS request to `/api/rsvp` for the site's Origin,
method POST and requested header Content-Type. This does not create a guest record.
Verify the response echoes that exact allowed Origin. Do not run live fake RSVP
submissions to test the two editions.

## Backend source is included for custody, not an automatic move

The shared backend requires Python 3.11+, MongoDB, and the currently authorized
Google Apps Script connection. Its runtime-only dependency list intentionally
excludes unrelated packages from the development container.

For isolated local development only:

1. Create a virtual environment and activate it.
2. From `backend`, install `pip install -r requirements-runtime.in`.
3. Copy `.env.example` to `.env`, use a **separate test Mongo database**, set explicit
   local CORS origins, and leave all Sheets connection values empty.
4. Choose the listening port via an environment variable and run:

   ```sh
   uvicorn server:app --host 0.0.0.0 --port "$PORT"
   ```

   On Windows PowerShell, use `$env:PORT` for the chosen port. The app's API prefix
   is `/api`; do not remove it. Point only your local test frontend to this service.

Guest-response exports, snapshots and working credentials are NOT in the archive.
Do not point a disposable test database at the live sheet. Never wipe or seed the
live database to make a local setup work.

## If you deliberately move the service later

This is a separate migration decision. Privately configure these values before
changing either website's API base address:

- `MONGO_URL`: secure Mongo connection URI; preserve/migrate existing records safely.
- `DB_NAME`: the correct retained database name, not a fresh empty name by accident.
- `CORS_ORIGINS`: both site origins plus any intended existing origins.
- `SHEETS_SCRIPT_URL`: existing authorized `/exec` URL, server-only.
- `SHEETS_CONNECTION_SECRET`: the matching Script Property secret, server-only.
- `SHEETS_SPREADSHEET_ID`: existing destination ID, server-only.

Use the existing script project's **RSVP_TAB_ID** and exact same connection to keep
the same tab and references. Do not redeploy the included script just to create the
two editions. The archived script's destination ID is intentionally externalized
to a private Script Property; to use this archived version in a future update, set
`RSVP_SPREADSHEET_ID` in that existing project and retain its `RSVP_TAB_ID` and
`RSVP_CONNECTION_SECRET` before publishing a new script version.

The script's web-app access remains Execute as Me / Anyone, but the spreadsheet
itself must remain **Restricted** with the existing two nominated human Editors.
The shared secret authorizes writes; anonymous GET never returns guest rows.
Permissions and account authorization remain with the owner, not with GitHub.
No service account is required. No private values belong in frontend variables.

Server-only diagnostics: `python sheets_admin.py status` and, when intentionally
configured, `python sheets_admin.py check`. A check can create a dedicated tab if
no remembered `RSVP_TAB_ID` exists; do not run it in a new script project against
the live sheet. Preserving the existing working service avoids this risk.

Moving source alone does not transfer credentials, guest data, Google permissions
or uptime. Keep the existing service active until any intentional migration has
been separately completed and verified.