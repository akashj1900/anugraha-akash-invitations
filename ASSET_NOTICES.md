# Asset provenance, licenses and external dependencies

## Original invitation media and artwork

- The exact supplied wedding film and exact selected portrait are included in
  `original-media/` with source URLs, byte counts and SHA256 in `ASSET_MANIFEST.json`.
  They are not resized, trimmed, re-encoded, tinted, retouched or replaced.
- Each edition includes all current project artwork, original bundled soundtrack
  (`Mangalyam-Tantunanena.mp3`), water materials, historical scene assets, fonts and
  app icons. Copies are byte-identical. The image sequence/old artwork is retained
  for complete project custody, even where not used by the latest scene renderer.
- The portrait and many paper-diorama elements were supplied/generated during the
  invitation's creation. This archive does not establish third-party music, film,
  likeness or artwork redistribution rights. The owner must retain the permissions
  applicable to these assets; no blanket public-domain/open-source media license
  is asserted. Keep a private repository if wider media redistribution is not authorized.
- No new reveal chime or glitter assets are included. The reveal remains silent.

## Fonts and icons

Bundled font families: Cinzel; Cormorant Garamond (regular and italic); Great Vibes;
Noto Serif Devanagari (including the Latin serif numeral used by the date); Space
Mono (historical unused font). Their corresponding upstream SIL Open Font License
notices are included under `licenses/fonts/`, downloaded unmodified from the
Google Fonts project. The font files themselves are untouched. Keep the copyright,
reserved-name and OFL terms with any redistribution.

Ionicons are supplied by the installed `@react-native-vector-icons/ionicons`
dependency. Its installed license and relevant React/React Native/Expo dependency
notices are copied under `licenses/dependencies/`; the complete dependency licenses
remain available in each installed package. A `package.json` and Yarn lock are
included for each edition; third-party code remains under its own license.

The custom invitation source is provided for the owner's use. This document does
not grant rights the owner does not hold, transfer ownership, or relicense all
third-party code/media under a single invented license.

## Not offline / not account exports

- Dependency installation requires the package registry.
- Default runtime film/portrait require their existing asset-host URLs; exact
  backup bytes are included for deliberate rehosting without changing content.
- RSVP uses the shared FastAPI API and Mongo; Google Apps Script/Sheets uses the
  existing owner's authorization, secret and private sharing arrangement.
- Map actions open external Google Maps; calendar actions retain their existing
  event data and platform-specific behavior.
- No Google account, credentials, database contents or guest rows are included.

Do not confuse an archived original with an already configured media origin or a
running backend. Use the manifests to check that files remain byte-identical.