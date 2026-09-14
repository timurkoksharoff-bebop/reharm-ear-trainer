# BUILD 077 — gameplay and mobile verification

The note-capture challenge now tests ordered chord spelling instead of crowd
avoidance. Up to four fixed note cubes and one slow drum share an open field;
the next required note always has a fixed target. Collected tones pay a partial
reward if a subsequent note is wrong. Color Hearing pays partial credit only
for a subset containing no incorrect tensions. Results wait for Continue.

The ground Hydra approaches with the planet and stops terrain scrolling on
arrival. Its body has local collision, individual guns burn out, and the hull
can be worn down with ordinary fire. Correct musical answers remain the faster,
more rewarding route. Defeat produces a bounded chain explosion and sound.
Note collection suspends combat and reintroduces the base safely afterwards.

Other changes: single initial spoken instruction; music-only repeats; female
system voice preference for Vibraphonist; ordinary practice-button taps play
the exact chord and show its actual MIDI voicing; Overdrive no longer stops
the current audio or clears an active challenge's targets.

## Checks before release

- Canonical music/route checks, audio scheduling, expedition, note spelling and
  layouts, lifecycle, debrief, melody levels, asset loader: passed.
- Chrome mobile viewport 390×844 through normal menu controls: note capture
  using pointer paths with two-second thinking pauses; full results and Continue.
  Examples completed: D–F♯–A; B♭–F guide tones; D♭–F–A♭♭–C♭–E♭♭ extended ALL.
  No direct game answer methods were invoked by the browser route tests.
- Ground encounter: terrain position unchanged after arrival; browser screenshot.
- Practice: one tap displays notes and plays the target with Synth and local
  Grand Piano samples; second tap on another option changes both. No page errors.
- This is desktop Chrome with a mobile viewport, not a physical iPhone test.
  Female voice quality depends on installed OS speech voices; subjective listening
  on the user's phone remains necessary. `tests/smoke.cjs` is absent in checkout.

## Deliberately deferred

The separate old-cube/old-cymbal 50/50 bonuses and SAY TITLE replacement remain
next. No new rock or classical melodies added here. The 50 rock / 100 classical
catalog expansion, genre preferences and Intelligence remain in RESUME_NEXT.md.

## Artwork provenance

Created with built-in imagegen, not CLI/API. Source directory:
`/Users/tim/.codex/generated_images/01a0792c-b9ca-7090-869c-f0fec66fb796/`.
Optimized 384px WebP game assets retain actual alpha. Original approved
numbered prototype remains in local design-concepts archive.

| Runtime asset | Generated source |
|---|---|
| note-cube.webp | exec-640b937f-a00c-4f6a-94f0-7a422f875e46.png |
| note-drum.webp | exec-a0fd89c2-e14d-4870-a0c7-38e6b0f29be5.png |
| turret-barrel.webp | exec-b8660507-9312-46c8-9cc3-32b4b2967e41.png |
| turret-base.webp | exec-c6d33665-ad42-4ebd-b61a-8af58241eb6d.png |
| turret-ruin.webp | exec-fa0bb84e-c4c0-4063-9ba4-2e7de404f74a.png |

Final prompt specifications: preserve approved brass cube/patina/rivets/light
and remove front glyph only; for the drum, a blank light brass cylinder in an
aged riveted cage with visible upper face; for guns, top-down orthographic
brass/gunmetal cannon pointed up, separate rotary foundation and scorched ruin.
All requested true alpha, no text/background. The two drum edits that baked in
a checkerboard were rejected and are not runtime assets. Exact game symbols
are rendered by code rather than trusting generated musical lettering.
