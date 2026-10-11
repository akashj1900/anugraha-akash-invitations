# Run each edition and give it its own public link

## Requirements

- Node.js 22.13 or newer (the handoff was built with Node 24), Yarn Classic 1.22.22.
- Python 3.11+ only if running the optional shared backend yourself.
- Internet for dependency installation and currently hosted film/portrait.
- The commands below use a macOS/Linux terminal; on Windows, use a WSL terminal
  for the same commands. Keep the extracted folder structure and script permissions.
- The package's actual installed versions are authoritative: Expo 57, React Native
  0.86.3, React 19.2.3. Do not downgrade to a different Expo SDK.

## Run Rudhra locally

1. Extract the archive and open a terminal in `editions/rudhra`.
2. Copy `.env.example` to `.env` using your file manager/editor.
3. Leave `EXPO_PUBLIC_BACKEND_URL` pointing to the existing shared service.
   This is a public API base address, not the Apps Script URL. Do not append `/api`
   here—the app appends it itself. No Google/Mongo secret belongs in this file.
4. Install and start:

   ```sh
   chmod +x scripts/cmd-guard.js
   yarn install --frozen-lockfile
   yarn web
   ```

5. Open the local address printed by Expo. For a compatible mobile development
   client, `yarn start` provides the project's normal device workflow.

## Run Sihan locally

Repeat exactly the same steps in `editions/sihan`. Its source fixes the closing to
Sihan. If starting both at once, allow Expo to choose a different available port.
There is no runtime edition option; do not try query parameters or guest controls.

Local browsing works immediately after dependencies load. Browser RSVPs require
the local origin to be allowed by the shared API. Avoid sending synthetic RSVP
tests to the live service—the current response spreadsheet contains real guests.
Use a separate local test database with Google connection unset for test writes.

## Produce two separate website bundles

In **each** edition folder:

```sh
npx expo export --platform web --output-dir dist
```

- Choose `editions/rudhra` as the project root for the Rudhra site, and
  `editions/sihan` for the Sihan site.
- Use `yarn install --frozen-lockfile` as the dependency-install step, the command
  above as the web-build step, and `dist` as its output directory.
- If an upload or extraction removed executable permissions, restore them first
  with `chmod +x scripts/cmd-guard.js`. A build pipeline can run that command before
  Yarn as well. Do not remove dependencies or disable package scripts to work around it.
- Set the **same** `EXPO_PUBLIC_BACKEND_URL` for both builds. Public Expo environment
  values are compiled into the build: rebuild if that address changes.
- Publish each output directory as a separate HTTPS static site with its own root
  address. Serve `index.html` for unmatched application paths (SPA fallback), so
  `/owner` still returns to the public invitation. Do not host both under the same
  unconfigured path prefix. Keep all generated `_expo` assets and their filenames.
- Normal compiled JS/assets should have suitable MIME types; do not treat `dist`
  as an HTML-only folder. Loading a `file://` index directly is not equivalent to
  serving the site over HTTP/HTTPS.
- Record the two final origins. Add both to the existing backend's `CORS_ORIGINS`
  allowlist as described in `SHARED_RSVP.md`. This is necessary before RSVP from
  these newly published websites can work. Preserve existing origins as well.
- Never place the backend `.env`, Apps Script connection details, data exports or
  this private setup material inside a site's `dist` folder.

The site addresses are assigned when you complete these steps. This handoff has
not logged into an external account, created a domain, pushed a repository or
created two live websites on your behalf. A GitHub repository is not a running API.

## Review checklist for both links

- Check the single closing name and three centered hearts at narrow phone sizes.
- Confirm all other visible text, film and portrait match between editions.
- Tap the seal for sound; reveal the portrait without a new sound/effect.
- Film should first prepare when its section arrives, play once its frame is
  visible/ready, and remember manual pause. Keep the complete frame and normal speed.
- Open RSVP without submitting a fake live response; verify the connection/CORS
  with the backend maintainer. Make a real RSVP only when it is intended to remain.
- Check the shared API remains available; a static site alone cannot store RSVPs.

## Future mobile packages

Both source projects retain their existing Expo mobile configuration for development
and parity. This request is for two website editions. Store-ready native packages
would additionally need owner-selected unique app identifiers, signing credentials,
device testing and a separate release setup; none are included or claimed here.