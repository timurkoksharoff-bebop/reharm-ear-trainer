# Project Guidance

Before changing this project, read `PROJECT_CONTEXT.md`.

- Treat `app.js` as the canonical exercise catalog and application logic.
- Use the PDFs in `reference/` to verify musical content. Do not invent or
  silently simplify chord progressions.
- Keep reference PDFs and deployment credentials out of Git.
- Preserve the public GitHub Pages URL and the existing Git history.
- Every PWA release must increment `CACHE_NAME` in `service-worker.js`.
- After changing web assets, update the resources inside
  `Reharm Ear Trainer.app` if the macOS wrapper is meant to ship the same
  version.
- Run `tests/smoke.cjs` and a browser check before publishing.
