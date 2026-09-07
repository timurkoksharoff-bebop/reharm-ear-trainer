# Ear Reharm Game — Flight 002

An isolated mobile arcade prototype on branch `codex/ear-reharm-game`. The Trainer
catalog, root entry point, approved art, PWA cache and macOS wrapper are unchanged.
The game builds as a standalone browser site. It does not install a service worker.

## Run

```sh
python3 game/serve.py --port 8127 --background
```

Open `http://127.0.0.1:8127/game/`. The launcher serves the repository from any
working directory, uses no-store responses and detaches from the terminal.
On the same Wi-Fi use `http://<Mac-LAN-IP>:8127/game/`.
No package installation, build, piano samples or external audio service is needed.

## Play

- Drag the ship across the field; automatic fire neutralizes drones.
- Listen to tonic I and the target. Choose the root degree to break the first shield.
- In chord modes, independently choose the exact type to break the second shield.
  Either order works. A wrong answer releases dodgeable fire.
- Labels on weapon batteries are actual symbols: maj, 6, m7, maj7, 7sus4, etc.
  Completed recognition displays the full symbol, such as IIIm7.
- After each hydra, hear an interval and collect its single matching number token.
  The former catch/avoid capsule scenario is no longer part of the flight.
- «Слушать» replays the current signal; the library offers labeled examples.
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

Original detailed scrolling terrain, ships, drones and modular enemy machines; collision,
aimed projectiles, beams, particles, adaptive formations, combos, shield restoration
and rapid five-lane spread fire. Flight 002 adds the activities below.
The sustained two-oscillator synth has stable pitch and no piano.
Listening freezes hostile movement and timers; pause/backgrounding cancels sound.
On very short screens the cockpit and lesson card scroll independently.

See [MUSICAL_NOTES.md](MUSICAL_NOTES.md), [DESIGN.md](DESIGN.md),
[QA.md](QA.md) and [art provenance](assets/PROVENANCE.md).

## Flight 002 additions

Four pilot difficulties, scrolling Moon/Mars art, brass instruments and compact
root/type tabs. Beginner and Student have no collidable terrain obstacles;
Magister and Herbie add moving rock corridors. Skip bypasses calibration.

Interval activities now require **one** brass number token, independent of direction:
minor third → ♭3, fifth → 5, minor seventh → ♭7, major seventh → 7.
Each field contains exactly one correct token (one of ♭5/♯4 for a tritone).
Any wrong pickup loses the attempt. Captured tokens shrink and emit particles.

Five fictional steampunk subject teachers approach from four edges. Neutralizing
them grants hints, rapid fire, cloak or shield. Six artifacts grant temporary
effects or interrupt the current cue immediately with guide-tone, chord-only or
rhythm recognition. Jazz Bass asks for chord member 3 or 7; the latter is the
minor seventh in its dominant-seventh cue. Correct Rock Tongue recognition fully
restores HP. Rhythm buttons have English names. Space repeats the current signal,
including when a musical answer button has keyboard focus.

The sound hangar contains all 22 chord qualities, interval labels, 20 rhythm
examples and 10 polyrhythm ratios. Chords share the exact flight audio path,
with optional arpeggios for comparison. Rhythm examples can loop; polyrhythm
layers can be heard separately. Tumbao and Montuno are marked as instrument parts.
Cymbal challenges open a frozen-flight room with a swaying cyborg quartet.
Recognizing the pattern returns to flight. Drum Machine appears from Student,
starting with 2:3, 3:2, 3:4 and 4:3; higher levels add fives and sevens.

Russian is the default with a device-local English toggle. Space repeats even
when an answer button retains focus. The generated classic-script bundle avoids
file-origin ES-module restrictions in Safari. HTTPS hosting is the phone path;
the local server remains useful for development only.

Build the standalone public asset bundle with `node game/tools/build.mjs`.
`tools/expedition-check.mjs` checks these additional mechanics.

## Checks

```sh
node game/tools/check.mjs
node game/tools/lifecycle.mjs
node game/tools/expedition-check.mjs
node game/tools/audio-check.mjs
node --check game/game.js
node tests/smoke.cjs
git diff --check
```

The existing ignored smoke test was copied unchanged from the canonical local
project. Game checks are tracked. Physical iPhone audio/touch/interruption testing
and novice difficulty playtests remain necessary. Long-term learning transfer is
an aim, not a demonstrated outcome.
