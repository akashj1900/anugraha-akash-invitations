# Anugraha & Akash — Rudhra and Sihan invitations

Two complete Expo invitation projects, identical except for one fixed closing name:

| Folder | Closing rows |
| --- | --- |
| `editions/rudhra` | Best compliments from / **Rudhra** / three gold outline hearts |
| `editions/sihan` | Best compliments from / **Sihan** / three gold outline hearts |

There is no guest edition selector, URL switch, inter-edition link, or response tag.
The names are literals in each `src/wedding/edition.ts`. Each build always uses its
own name. The current development preview shows Rudhra; this archive contains both.

## Start here

1. Read `RUN_AND_PUBLISH.md` to run either edition and create two separate sites.
2. Read `GITHUB_AND_LARGE_FILES.md` before uploading the complete project.
3. Read `SHARED_RSVP.md` before allowing guest submissions from new site addresses.
4. Keep `ASSET_NOTICES.md`, `licenses/`, and `ASSET_MANIFEST.json` with the project.

## Included

- Both complete frontend source trees with package manifests, Yarn locks, Expo
  configuration, artwork, fonts, soundtrack and app icons.
- `original-media/`: exact original film and portrait, with byte sizes and SHA256.
  Both editions still use the existing hosted originals by default; this preserves
  arrival-only film loading and avoids an unnecessary media-host change.
- `backend/`: shared FastAPI/Mongo RSVP storage, durable spreadsheet delivery queue,
  reconciliation/retries and server-only diagnostics. The original shared API
  address is recorded in each safe frontend `.env.example` (not a credential).
- `google-apps-script/WeddingRSVPs.gs`: write-only bridge source, with its private
  spreadsheet ID removed and restored through Script Properties when needed.
- `SHA256SUMS.json`: checksums for every delivered file (apart from itself).

## Deliberately excluded

No working `.env` files, Mongo credentials, Apps Script URL/secret, Google account
credentials, user sessions, guest-response records, database dumps, test fixtures,
internal notes, repository history, dependency folders or build caches are included.
Private spreadsheet identifiers have also been removed from the handoff script.

**This is source and assets, not two already-published invitation links.** Uploading
files to GitHub does not start a website, API, Mongo database or Google connection.
The owner supplies the final addresses and publishes each edition separately.

## Shared responses stay shared

Both editions point to the **same existing RSVP service** by default. Keep it running
and authorize both new website origins in its CORS settings. Do not start a second
RSVP service or a second Apps Script deployment merely because there are two sites.
Neither edition adds a field, edition column, name tag or spreadsheet tab.

Existing saved guest data stays in the current private service; it is not in this
archive and must not be deleted or overwritten. The same **Wedding RSVPs** tab and
existing Restricted sharing remain the response view. The code is not fully offline:
guest RSVP needs a running API/Mongo/Google connection, maps open Google Maps, and
the film/portrait stream from their current asset host unless you intentionally
rehost the included exact originals later.

## Scope retained

Royal Letter opening and seal-tap song; responsive venue journey, swans and water;
serif numeral in 1 November 2026; full-frame muted looping film with top-right
controls and first-arrival loading; exact portrait with silent one-second fade;
the combined line “Chennai, Tamilnadu & Dombivli East, Maharashtra”; all event details,
maps, calendar information, image retry and reduced-motion behavior are retained.
No glitter, reveal chime, owner login or spreadsheet information appears to guests.

## Handoff verification

- Fresh ZIP extraction, locked Yarn dependency installation and production web
  export succeeded for **both** complete edition folders.
- Both exported sites were served separately for testing: fixed names could not
  be changed through URL parameters; centered closings passed at 280, 390 and 768
  pixels wide and landscape. Film metadata, top-right controls, original portrait's
  silent reveal, source assets and the unchanged location/date wording passed.
- Shared backend dependencies were installed in a fresh Python environment and
  all service modules imported without development-container-only packages.
- Archive file checksums, edition parity, original media hashes and absence of
  working private values were checked. No synthetic live RSVPs were submitted.

This does not verify future public origins before they exist, grant Google access,
or replace the owner's final phone review. New website origins must be allowlisted
on the shared API before browser RSVP submissions from those sites can work.