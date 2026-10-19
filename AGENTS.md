# Space Music League — project guidance

Before changing this project, read `PROJECT_CONTEXT.md`.

- This workspace is for the Space Music game project, including EAR YOGA. It is not the original Ear Reharm Trainer application.
- The current EAR YOGA editing source is `garden/source/`. `garden/` also contains the generated mobile PWA.
- `game/` contains the earlier game/planet prototypes and the shared standards importer/catalog used by the EAR YOGA builder. Do not delete or silently replace it.
- Keep the current approved visual design, Lotus icon, music, audio, and gameplay unless the user explicitly requests changes.
- Verify musical changes against the user's reference material. Do not invent or silently simplify progressions, voicings, slash basses, or spelling.
- Reference textbooks, credentials, and rejected art studies must not be added to public commits.
- Preserve the existing Git history, `ear-yoga-v1.36-checkpoint`, and the public GitHub Pages URL.
- This is an independent local clone of the existing repository, not a newly published GitHub repository. The sparse checkout intentionally hides the old Trainer files; their absence is not a deletion request.
- The original Trainer remains in `/Users/tim/Documents/Ear Reharm Trainer`. Do not edit it as part of game work.
- Rebuild into a fresh output directory, never directly into `garden/`; copy a verified build back only when preparing an actual release.
- Every published PWA release must increment the builder version and generated `CACHE_NAME` in `garden/service-worker.js`.
- Run the relevant music/game checks and a real browser/mobile/offline check before publication. Do not claim physical iPhone testing from desktop emulation.
- A new framework, native iOS migration, or App Store submission is not authorized merely by creating this workspace.
- Do not alter Codex's internal databases, chat history files, or application configuration to move chats. Use the supported project UI and tools.
