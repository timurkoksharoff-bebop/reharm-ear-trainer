# Flight 001 verification — 2026-09-07

## Automated checks

- `tools/check.mjs`: two exact source-verified book sequences matched to app.js;
  all 22 canonical interval arrays; 400 transposed phrases; true tonic gap and
  every chord tone retained; all 264 independent root/type pairs; exact m7/maj7
  and maj/6 grading; interval match/distractor rewards and three articulations;
  all required local asset and launcher paths.
- `tools/lifecycle.mjs`: actual game.js state machine in a Node VM with browser
  and audio API doubles. Tutorial/pause/resume; correct/wrong/repeated shots;
  both shield orders; full 24-hydra campaign and 12-hydra chromatic run; retries,
  saved results, drone collisions, bounded pressure, all four capsule outcomes,
  capsule freeze during listening and replay after pause.
- `node --check game/game.js`; root `tests/smoke.cjs` (239 progressions, spelling,
  Builder, storage, favorites, audio, scoring/reveal); `git diff --check`.

## In-app browser

Tested localhost with the current sustained synth and all four original bitmap
assets. Fresh reload and no-store responses prevent stale game assets.

- Start, audio unlock, I/V calibration and interval calibration advance normally.
  Buttons lock during cues and unlock afterward. No browser warning/error logs
  were captured. This checks Web Audio execution, not a physical audio recording.
- Correct I answer destroyed a hydra, awarded 325 points and spread fire, then
  spawned a labeled ♭3 capsule. Screenshot confirmed the capsule, dense moving
  micro-targets/terrain, weapon spread and the catch/avoid instruction panel.
- Pause during the capsule signal, resume and pointer-drag collection worked.
  The inspected capsule was a distractor: the game reported a fifth, deducted
  energy down to its zero floor and removed the spread boost. Correct catch,
  energy wrap/healing, avoidance and missed-target behavior are automated tests.
- Wrong root input, dodgeable response, health loss, game over and retry were
  checked in the browser during development. Automatic shots destroy drones but
  do not solve the musical encounter.
- Chromatic mode presents all 12 roots and 11 type buttons per arsenal tab.
  Switching to alterations exposes the remaining 11. No hidden-answer-dependent
  tab selection is used. The full arsenal was inspected at 390×844.
- 320×568: no horizontal overflow (body and viewport both 320 px), usable scrolling
  lesson overlay and cockpit. Pointer collection was exercised at this size.
  Desktop default viewport also inspected. Temporary viewport overrides reset.

## Preview and remaining work

The detached Python launcher returned HTTP 200 with Cache-Control: no-store at
`http://127.0.0.1:8127/game/`. It remains a Mac-hosted local preview, not a public
or always-available deployment. The phone URL requires the same LAN and awake Mac.

Not validated on physical iPhone/Safari hardware: output loudness/timbre, first
attack after idle, silent-mode behavior, touch latency and OS interruptions.
There is no screen-reader-playable Canvas mode, isolated offline PWA, broad
source-functional campaign, slash-bass gameplay or demonstrated long-term learning
transfer. Terrain top/bottom geometry is not perfectly seamless. These limitations
are documented rather than represented as finished features.
