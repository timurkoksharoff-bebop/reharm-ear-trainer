# Space Music College — BUILD 078

- Repertoire: 200 jazz + 50 rock vocal melodies + 100 classical piano themes.
- Mixed level pools: 48 / 100 / 200 / 350 for Novice / Student / Master / Legend.
- Preflight genre preference (Mixed/Jazz/Rock/Classical) persists locally.
- Intelligence has a separate local success/error history, weighted practice,
  four starting themes per genre, gradual permanent unlocks and spaced returns.
  Adaptive selection: melody, rhythm, rudiment, guide, chord mini-game. Hydra
  root/type results are recorded; full route and base-interval weighting remains
  planned. Manual debrief retains its separate finite queue.
- Hydra hull needs four times the hits. Correct full chord destroys immediately;
  a single component no longer deletes 45% of hull.
- Browser check Chrome 390×844: persisted genre, library350, rock/classical/jazz
  excerpts, full playback and stop. All game/audio/expedition/lifecycle/repertoire/
  intelligence/level/library/debrief tests passed. tests/smoke.cjs absent.
- Source limitations: rock offsets are estimated; classical is a selected voice
  reduction, not full arrangement. 65 DCML adaptations are CC BY-NC-SA4.0; see
  MELODY_CATALOG_SOURCES.md before any commercial distribution.
- Rebuilt classic bundle and static output, service-worker bumped to0.78.
- macOS wrapper is not part of this PWA release.

Published: commit7839889, origin/main. Public mobile page and all three genre
playback paths verified in Chrome390×844. URL: /game/?release=078.
