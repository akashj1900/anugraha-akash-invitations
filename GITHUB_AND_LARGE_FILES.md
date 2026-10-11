# Keep the complete project in GitHub

## Owner-controlled upload

The platform's **Save to GitHub** action can connect the working project to your
repository. This handoff does not access your GitHub account or perform a push.
For the two-edition package, extract this archive and use your own GitHub workflow
(for example your desktop Git client) to add its contents to a repository you own.
Keep the directory structure; uploading a ZIP alone does not expose runnable source
folders or start either invitation. Prefer a private repository while reviewing
media rights and the contents you want to share.

Before upload, retain the supplied `.gitignore`, do not add `.env` files, and check
that only safe `.env.example` templates are present. Do not add guest records or
copy private values into screenshots, documentation or commit messages. Do not add
`node_modules`, `.expo`, `.metro-cache`, generated `dist` or Python environments.

## Original film: do not trim or re-encode

`original-media/InShot_20261009_141349784.mp4` is **34,742,103 bytes** (about 33.13 MiB).
It exceeds GitHub's **25 MiB per-file browser-upload limit**, but is below the
**100 MiB normal Git per-file limit**. The delivered film bytes are unchanged.

Ways to keep the exact file:

- Use your desktop Git client for the repository upload instead of the browser
  uploader. This file is below the ordinary Git hard limit.
- Use Git LFS if you want large binary storage separate from normal Git objects.
  Configure LFS before adding the film, retain its real local bytes, and verify any
  later clone/build retrieves the LFS object rather than publishing a pointer file.
  The supplied `.gitattributes.example` is optional; do not activate it without LFS.
- Alternatively attach the exact original as a repository release/download asset
  and retain the manifest/checksum. Do not silently omit it from your own full backup.

All individual included assets other than the film are below the browser limit.
The full archive itself is larger than the browser upload limit; **extract it**.
The included `ASSET_MANIFEST.json` records exact file sizes and SHA256 values;
`SHA256SUMS.json` covers the source files too.

The film and portrait remain on their existing hosted URLs in both apps by default.
GitHub/LFS storage of originals is a backup, not automatic streaming-video hosting.
If you move media hosting later, retain byte-identical files and support HTTPS,
`video/mp4` MIME and HTTP Range requests. Update both editions' source URI together.
Do not upload a compressed substitute or change the video aspect ratio/speed.

References:
- https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
- https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage

GitHub stores source. Read `RUN_AND_PUBLISH.md` for two static websites and
`SHARED_RSVP.md` for the independently running shared RSVP service.