# Space Music League — game workspace

## Identity and scope

This is the dedicated local workspace for the Space Music game project. The currently shipping experience is **EAR YOGA**, branded **Space Music College** inside the game. The folder name Space Music League organizes development; it does not rename the shipped product or artwork.

The original **Ear Reharm Trainer** is a different application. Its existing folder and chats must not be deleted or renamed as a shortcut for separating the game.

## Canonical locations

- New game workspace: `/Users/tim/Documents/Space Music League`
- EAR YOGA source: `garden/source/`
- Generated EAR YOGA mobile PWA: `garden/`
- Earlier game and planet prototypes: `game/`
- Existing GitHub repository: `https://github.com/timurkoksharoff-bebop/reharm-ear-trainer`
- Published EAR YOGA: `https://timurkoksharoff-bebop.github.io/reharm-ear-trainer/garden/`
- Preserved baseline: tag `ear-yoga-v1.36-checkpoint`, commit `10cd4263c7f58ef6311e5b9e6e4d2c8850095dd5`
- Working branch for this separation: `codex/space-music-league-project`

The new folder has its own Git object store and is not a linked worktree dependent on the Trainer folder. It retains the original history and remote. The checkout deliberately exposes the game folders and this guidance, not the old Trainer UI. Sparse-checkout exclusions must not be staged as deletions.

No new GitHub repository was created. No production URL, published game file, or player data was changed by workspace separation. Future publication still needs an explicit release workflow targeting the existing `garden/` path. Do not force-push or casually merge a historical Trainer branch.

The root `AGENTS.md`, `PROJECT_CONTEXT.md`, and `README.md` on this workspace branch describe the game workspace. They are not a request to replace the original Trainer's guidance on the shared publication branch. When publishing game changes, review the exact paths and preserve the Trainer's documentation and other applications.

## Current baseline

EAR YOGA 1.36 is the released web/PWA baseline with the approved Lotus icon. It includes the current Teacher/Student behavior, chord-relative tones, oxygen resource, current sound balance, unified cover lettering, local progression tools and records, and desktop-only opt-in recording. Experimental icon concepts were rejected and are not release assets.

It is vanilla JavaScript ES modules, HTML/CSS, custom WebGL and Canvas rendering, and Web Audio. It is not React or React Native. Browser state uses localStorage and IndexedDB. There is no implemented account backend, cross-device save synchronization, or validated online tournament service.

The desktop recording feature exists, but the user-reported increasing audio/video drift has not been confirmed fixed. Do not treat the 1.36 checkpoint as proof that every known issue is resolved.

## Source and build

Edit the source in `garden/source/`, not just the generated bundle. The builder is:

```
node garden/source/tools/build-garden-standalone.mjs /absolute/path/to/fresh-output
```

It requires Node.js and `sharp`. The builder also imports `game/standards-catalog.mjs` and `game/importer.mjs`; copying only `garden/` loses these build dependencies. Preserve catalog harmony and exact voicings.

Build into a new directory so image processing never reads and overwrites the same asset. Compare and test the result before copying it into `garden/` for a release. Do not rebuild or bump the PWA just to reorganize project folders or chats.

Checks live in `garden/source/tools/`, including harmony, resonance, oxygen balance, scoring, responsive brand layout, mobile release, and offline/update checks. Browser checks require Playwright and Chrome. The old Trainer's `tests/smoke.cjs` is local-only in the original Trainer workspace; it is not tracked in this Git repository and is not part of this independent checkout.

## Preserved older folders

- `/Users/tim/Documents/Ear Reharm Trainer/tmp/garden-bilingual-work`: the previous release worktree. Its untracked art/old icons remain there; do not treat it as the future editing location once this new project is connected.
- `/Users/tim/Documents/Codex/Space Music College Garden Work`: an older 1.14 worktree, not the latest release. It has local changes in `garden/source/garden-flight.html` and `.css`; preserve them for later comparison, never overwrite the released baseline with them without review.
- `/Users/tim/Documents/Ear Reharm Trainer`: the original Trainer. Its separate unpublished header-navigation checkpoint is `32bbded` on `codex/checkpoint-trainer-2026-10-19`.

Nothing in those folders was deleted or moved during this setup. Old chats can contain absolute paths to them; consult this document before resuming edits.

## Codex project and chat connection

The dedicated folder must be added in the Codex desktop UI as a new **local project** named Space Music League, with this folder as primary. Keep the original Trainer project separate. Moving existing chats to a new source folder may require the user to move them in the sidebar to grant that access; changing only a sidebar section is not enough.

This setup does not by itself change the active chat's recorded working directory. Verify the local project and working directory after the user connects the folder. Keep chat history through supported moves, not by editing application databases or replacing session files.

## Future architecture

TypeScript modularization, isolated music/game rules, platform adapters, independent planet modules, and possible iOS packaging were discussed. No framework rewrite, Capacitor app, native audio migration, or App Store submission has been implemented or selected by this workspace setup. Preserve 1.36 as the comparison baseline while making future decisions separately.
