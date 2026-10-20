# EAR YOGA 1.37 — desktop review

Branch: `codex/ear-yoga-desktop-1.37`, based on the existing web game and the
1.36 checkpoint. The rejected Godot experiment is in its own branch.

Requested changes:

- New user-selected orbital home screen, with live HTML controls, hover,
  press and keyboard feedback, RU/EN and the existing menu/tutorial actions.
- New selected spacecraft app icon, trimming the lateral golden tails only.
- Teacher: the musical sequence and the world run 20% faster. A chord lasts
  4 / 1.2 seconds. World animation, steering, pickups, hazards and O₂ use the
  same 1.2 multiplier. The score timer continues measuring actual seconds.
  Duration-based reserve normalization uses the unchanged virtual bar length,
  preserving the existing spending/reward balance per route lap.
- Applicant: Student movement, chord duration and pickup pace, while all four
  protected reserves stay at 100. The original three admission routes and
  answer rules remain in place. Teacher O₂ remains Teacher-only.
- Student: unchanged speed, music, resource/damage values and answer rules.

Music, catalogs, voicings, independent basses, samples, arrangements and the
actual flight artwork are the existing 1.36 sources. Only menu/icon assets are
new. Asset origins and final edit prompts are in `art/ASSET_NOTES.md`.

Build into a fresh output directory. Local review builds are under `qa/`;
`qa/ear-yoga-desktop-current` points to the current one. A local preview server
serves it at http://127.0.0.1:8138/. This was the initial desktop review stage; see the mobile publication authorization below.

Relevant checks: harmony, Teacher/Student, resources, scoring, oxygen balance;
the full Chrome release/offline regression; the Teacher/Student browser check;
orbital menu/branding layout, press feedback, RU/EN, pause and actual pacing.
The update check verifies that the new icon is generated from the approved
master and that a 1.36-to-1.37 service-worker update preserves test local data.
Browser mobile emulation is not physical iPhone testing.

The initial checks above preceded the final reference-sprite correction. That
correction is published at the user’s request without another browser QA round.
Do not resume a framework rewrite or change the public address.

## Mobile publication authorized — 20 October

The user explicitly asked to publish after the reference-fidelity correction,
without another browser QA round, for phone review in the morning. The original
reference now supplies the exact Russian lettering and control ornaments. Pearl
light sweeps and flowing caustics run continuously, with turquoise motion on the
selected mode. No additional physical phone or browser testing is claimed.
