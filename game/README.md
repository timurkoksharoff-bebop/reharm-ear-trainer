# Ear Reharm Game — Flight 001

An isolated mobile arcade prototype on branch `codex/ear-reharm-game`. The Trainer
catalog, root entry point, approved art, PWA cache and macOS wrapper are unchanged.
This version is local; it has not been published or packaged for offline use.

## Run

```sh
python3 game/serve.py --port 8127 --background
```

Open `http://127.0.0.1:8127/game/`. The launcher serves the repository from any
working directory, uses no-store responses and detaches from the terminal.
On the same Wi-Fi use `http://<Mac-LAN-IP>:8127/game/`.
No package installation, build, piano samples or external audio service is needed.

## Play

- Drag the ship in the lower half of the field; automatic fire destroys drones.
- Listen to tonic I and the target. Choose the root degree to break the first shield.
- In chord modes, independently choose the exact type to break the second shield.
  Either order works. A wrong answer releases dodgeable fire.
- Labels on weapon batteries are actual symbols: maj, 6, m7, maj7, 7sus4, etc.
  Completed recognition displays the full symbol, such as IIIm7.
- After a hydra, a labeled interval capsule flies down. Catch it only when its
  sound matches its label. Correct: +20 upward, +30 downward, +40 simultaneous.
  Wrong catch: −20 energy and reduced weapon power. Passing a capsule costs nothing.
- «Слушать» replays the actual signal. «Образец» plays the capsule's target interval.
- Arrows move; 1–4 choose the first four root pads; Q/W/E/R choose the first four
  type pads in the visible bank. Space replays; Escape pauses/resumes. All pads
  work by touch/mouse. WASD works before chord modes; W becomes a type weapon later.

The beginner campaign has three sectors of eight hydras. Calibration precedes each
sector, and the third uses two exact source-verified book figures. Five ship hits
return to base; the current sector can be retried.

«Все ступени и аккорды» opens a separate 12-hydra chromatic flight: every one of the
12 pitch roots can pair independently with any of 22 exact catalog qualities.
Two arsenal tabs hold ordinary chords and alterations. These are authored isolated
recognition signals, not an invented textbook progression. The 12 pitch buttons
use one spelling each, with enharmonic alternatives in tooltips.

Best score and separate root/type/interval counts are local to this browser under
`ear-reharm-game.v1`. Trainer storage remains separate.

## Visual and audio slice

Original detailed scrolling terrain, ship, drones and hydra sprites; collision,
aimed projectiles, beams, particles, adaptive formations, combos, shield restoration
and rapid five-lane spread fire. Interval recognition is the only collectible
energy source. The sustained two-oscillator synth has stable pitch and no piano.
Listening freezes hostile movement and timers; pause/backgrounding cancels sound.
On very short screens the cockpit and lesson card scroll independently.

See [MUSICAL_NOTES.md](MUSICAL_NOTES.md), [DESIGN.md](DESIGN.md),
[QA.md](QA.md) and [art provenance](assets/PROVENANCE.md).

## Checks

```sh
node game/tools/check.mjs
node game/tools/lifecycle.mjs
node --check game/game.js
node tests/smoke.cjs
git diff --check
```

The existing ignored smoke test was copied unchanged from the canonical local
project. Game checks are tracked. Physical iPhone audio/touch/interruption testing
and novice difficulty playtests remain necessary. Long-term learning transfer is
an aim, not a demonstrated outcome.
