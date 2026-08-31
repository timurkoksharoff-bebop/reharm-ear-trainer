# Ear Reharm Trainer: Project Context

## Purpose

Ear Reharm Trainer is an ear-training application based on the chord
progressions in `Reharmonization Techniques`. Its scope is deliberately
narrow: chord progressions only. It does not reproduce the textbook melodies,
rhythmic figures, or complete arrangements.

The student hears a tonic reference followed by a progression and identifies
each chord either as a scale degree or as a chord symbol. The main pedagogical
goal is functional hearing: the default answer mode is scale degrees rather
than absolute chord names.

## Canonical Locations

- Local project root: `/Users/tim/Documents/Ear Reharm Trainer`
- Public repository:
  `https://github.com/timurkoksharoff-bebop/reharm-ear-trainer`
- Production PWA:
  `https://timurkoksharoff-bebop.github.io/reharm-ear-trainer/`
- Lite PWA:
  `https://timurkoksharoff-bebop.github.io/reharm-ear-trainer/lite/`
- Current local full cache version: `0.45`
- Current Lite cache version: `0.7`
- Main branch: `main`

This directory is the canonical working copy. Do not continue development in
the former nested copy under the large Tomaro/arranging task.

Experimental notation-editor work now lives separately in
`/Users/tim/Documents/Ear Reharm Arranger`. Do not add the Arranger workspace,
its script, or its stylesheet back to the public Trainer unless the user
explicitly decides to reunify the applications.

## Chapter Reward Artwork

The standalone reward study is `bear-rewards-preview.html`; it is not yet
wired into Quest chapter completion. The approved active order is:

1. triangle; 2. orchestral cymbals; 3. tuba; 4. harp; 5. bass guitar;
6. drum kit; 7. keytar; 8. upright bass; 9. flute; 10. violin;
11. electric guitar; 12. vibraphone; 13. saxophone; 14. trumpet;
15. balalaika; 16. musical saw.

Every reward is intentionally split into two parts: shared arrival `A`, where
the fixed green clearing remains while the neutral bear grows out of a point,
then authored instrument performance `B`. Do not redraw or bake the shared
arrival into the four approved performance poses. Wooden spoons are inactive
and preserved only as an archived source sheet so the study is not lost.
Each active reward also has a circular achievement medal showing its bear and
instrument.

## Reference Material

The `reference/` directory contains local-only study material:

- `Reharmonization-Techniques-2002-original.pdf`: original English textbook.
- `Reharmonization-Techniques-ru-chapters-01-16.pdf`: combined Russian
  working translation for Chapters 1-16.

These PDFs are intentionally ignored by Git. The repository is public, so
reference material must never be staged or pushed.

When adding or correcting a progression:

1. Verify the exact figure/exercise and printed page in the original PDF.
2. Preserve slash basses, chord quality, alterations, and progression length.
3. Record the chapter, figure/exercise, and printed page in the exercise
   metadata.
4. Do not infer missing harmony without explicitly marking the uncertainty.

## Current Product Behavior

- The shipping interface is English-only.
- `Quest` is the default learning path. Sixteen locally saved chapter gates
  mirror Chapters 1–16 of the textbook. Every chapter begins with its shortest
  available forms, develops through its mid-length examples, and ends with its
  longest routes before the next chapter unlocks. Each clear awards a
  one-to-three-star rank and XP. The allowed Quest misses scale with sequence
  length: 0 for 3–4 chords, 1 for 5–6, 2 for 7–8, 3 for 9–10, and 4 for
  12–14; the next miss resets only the current run.
  Auditioning a ready-made chord lowers the run score, while checking
  individual notes on the piano is allowed and recorded. `Practice` preserves
  the unrestricted chapter/exercise workflow, and `Builder` remains independent
  from both modes.
- Quest includes a low-contrast, flat-color bear that lives behind the interface
  rather than reading as a foreground illustration. It listens during playback,
  reacts briefly to correct and incorrect choices, rests after inactivity, and
  mirrors the success/failure state on the result card. Practice and Builder do
  not show this experimental character layer.
- First-time users see a concise visual `How to` tour that spotlights playback,
  answer entry, reveal/answer playback, navigation, favorites, statistics,
  keyboard, and settings. Completing or skipping it removes the temporary top-bar info
  button, and the tour remains replayable from Settings.
- Chapter, exercise, tempo, sound, and notation controls live in the top-right
  settings panel so the main screen opens directly on the listening grid.
- Short exercises keep the complete chord grid and primary action row within
  the first desktop viewport; longer grids may scroll.
- Chapters 1-16 can be selected separately.
- `All chapters · shuffle` shuffles the complete catalog without an immediate
  repeat.
- `Favorites` contains progressions marked with the heart button.
- Favorites are stored locally on each device and remain available offline.
  They are not synchronized between iPhone and Mac.
- Favorites use a versioned record with stable exercise metadata and request
  persistent browser storage when supported, so normal PWA rebuilds and
  catalog-ID migrations do not discard them.
- The `Builder` workspace creates independent progressions of 2–20 chords by
  scale degree, accidental, quality, and optional slash bass. A textbook
  exercise can be copied into the Builder as a template, but the canonical
  catalog entry is never modified.
- Custom progressions can be named, transposed to a chosen key, reordered,
  previewed, saved locally, reopened, deleted, and launched in the normal
  Trainer. JSON export/import provides an explicit cross-device backup.
- Full and Lite editions use separate custom-progression storage keys. Custom
  progressions are device-local and work offline after the application has
  loaded successfully.
- Before every exercise, a tonic reference chord sounds first. It always
  remains a block chord, even when arpeggio mode is active, and a short true
  silence separates it from the progression.
- Two compact controls beside Play switch between block chords, ascending
  arpeggios, and descending arpeggios; the selected articulation is stored
  locally. Arpeggio notes are separated by up to 250 ms so chord tones can be
  identified individually, with automatic compression only when a very dense
  chord must remain inside its original tempo slot. Earlier tones keep
  sustaining as later tones enter, and the complete assembled chord is held
  for at least 450 ms before the next chord.
- Progressions with eight or more chords keep a full-sequence round Play button
  and add two compact numbered playback ranges; each half starts with its own
  tonic reference.
- During blind playback, the current position number is highlighted without
  revealing the correct chord row. After `Show answer`, the regular Play
  control automatically follows and highlights the sounding answer.
- On phone-sized screens, revealed-answer playback opens a full-screen chord
  display with a large current chord, its alternate notation, position, and a
  Stop control.
- Wrong choices turn red and remain unavailable; the student keeps trying
  until the correct chord is found.
- Correct choices turn blue.
- Completing all positions automatically advances to another random example.
- A compact left-arrow action returns to the previous sequence from the
  current session, restoring its chapter filter and transposed key.
- `Skip` advances without affecting statistics.
- `Show answer` reveals the solution.
- Every answer row can be pressed to audition that chord independently.
- Holding a chord label opens a grand-staff popover with the exact playback
  voicing without taking horizontal space from the label; bass-only, upright
  reinforcement, and independent slash basses are represented explicitly.
- Chord symbols and popover notes use functional root spelling plus
  quality-aware tertian spelling for every chord tone. Diminished sevenths
  therefore retain stacked thirds (for example `C♯–E–G–B♭`, not
  `C♯–E–G–A♯`). If a transposition would require a triple accidental, the
  entire chord is respelled to one readable enharmonic root instead of mixing
  incompatible note letters.
- The lower three-octave keyboard (C2–C5) is available for manual checking.
- Portrait mobile layout is primary; long progressions use progressively
  smaller, separated dots and always fit the answer matrix without horizontal
  scrolling.
- Installed PWAs request portrait orientation where the platform supports it.
  The web interface remains usable in landscape instead of covering the app
  with a rotation warning, and browser gesture zoom is suppressed.

## Audio Decisions

- Default sound: sampled grand piano.
- Alternative sounds: legato sampled piano, sampled piano reinforced by VSCO
  2 CE pizzicato upright bass, sampled Wurlitzer EP200 electric piano, soft
  synthesized organ, and a bass-only mode that plays each chord's actual
  lowest note.
- Default tempo: slow.
- Piano chords have a longer sustain so the harmony can be analyzed.
- On supported iOS versions, the PWA requests a playback audio session so an
  already-started progression can continue while another app is in front.
- A near-silent hardware warm-up and a short-lived reusable audio context
  protect the first audible attack after an idle period from mobile Web Audio
  wake-up glitches.
- True slash chords reinforce the independent bass in two octaves.
- The upright-bass reinforcement uses a short pizzicato envelope and a gentle
  low-pass filter so source-sample string noise does not read as percussion.
- The application uses Web Audio only while playing and does not capture MIDI.

## Visual Direction

- Keep the interface quiet, precise, and highly legible: thin outlines,
  restrained nature-derived colors, and serif display type with a neutral
  sans-serif for controls.
- The current blurred pastel atmosphere images are a temporary mood layer, not
  a final art direction. Do not add or iterate on imagery without a new
  explicit request.
- Exercise mood selection is deterministic and based on harmonic tension, so
  an exercise keeps the same background between renders.

## Source Layout

- `app.js`: exercise catalog, state, grading, randomization, favorites,
  Progression Builder, audio, piano keyboard, and rendering.
- `index.html`: application structure and controls.
- `styles.css`: desktop and mobile presentation.
- `samples/piano/`: local piano samples and their license.
- `service-worker.js`: PWA offline cache. Increment `CACHE_NAME` for every
  published application release.
- `manifest.webmanifest` and `icon-*`: installation metadata and PWA icons.
- `tests/smoke.cjs`: local regression checks.
- `Reharm Ear Trainer.app`: offline macOS wrapper. It is local-only and ignored
  by Git.
- `README.md`: short user/developer overview.
- `tools/build-lite.cjs`: reproducibly creates the standalone Lite PWA.
- `lite/`: generated portable Lite build containing Chapters 1–4 only.

## Exercise Data Model

Each exercise has:

- a stable `id`;
- `chapter`;
- display `name`;
- source text containing chapter, figure/exercise, and printed page;
- `baseTonic`;
- `sequence`;
- generated answer `options`.

Each chord contains:

- functional degree label;
- chromatic offset from the exercise tonic;
- chord quality;
- optional enharmonic spelling preference;
- optional independent slash-bass offset.

The printed `#I` functions in core examples are source-verified and must not be
globally converted to `♭II`: Fig. 3.2 (printed p. 29), Fig. 3.7 (p. 31), Fig.
3.16 (p. 33), Exercise 5.1 (p. 50), Figs. 7.15/7.17 (pp. 69–70), Fig. 12.2
(p. 113), and Fig. 12.13 (p. 116). In Fig. 3.16 the printed `F#7` is an
extended-dominant link resolving to `B7`; the diminished examples use `#I°7`
as a leading-tone/rootless-dominant function resolving upward to II.

`app.js` is currently a single-file application. Keep changes focused unless
the catalog or UI becomes too large to maintain safely.

## Testing

Use the bundled Codex Node runtime when the system does not provide `node`:

```bash
/Users/tim/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
/Users/tim/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/smoke.cjs
git diff --check
```

For browser verification:

```bash
python3 -m http.server 8103
```

Then open `http://127.0.0.1:8103/` and verify at least:

1. playback and stop;
2. wrong/correct answer behavior;
3. random next exercise;
4. scale-degree and chord-symbol modes;
5. slash-bass audibility;
6. favorites across a page reload;
7. iPhone-width layout;
8. offline cache version.
9. Builder add/edit/reorder/save/reload/delete flow;
10. launching a saved progression in Trainer;
11. Lite Builder storage remains isolated from the full edition.

## Publishing

GitHub Pages deploys automatically after a push to `main`.

Before publishing:

1. Run the automated and browser checks.
2. Increment the cache version in `service-worker.js`.
3. Commit only application source and documentation.
4. Confirm that no files from `reference/` or `private/` are staged.
5. Push `main`.
6. Verify that the production `service-worker.js` returns the new cache
   version.

On an already installed iPhone PWA, the first launch may install the new
service worker while still showing old assets. Open the production URL in
Safari once, reload it, and reopen the home-screen application.

## macOS Wrapper

The macOS wrapper embeds a copy of the web application inside:

`Reharm Ear Trainer.app/Contents/Resources/`

When shipping a new Mac build, copy the current `index.html`, `styles.css`,
`app.js`, manifest, icons, service worker, and `samples/` into that Resources
directory, then ad-hoc sign and verify the application. The PWA is the primary
distribution target; do not assume the wrapper is current without checking its
embedded cache version.

## Current State and Known Constraints

- Local PWA `0.45` keeps the Quest bear study as a lightweight
  inline SVG, with no network or sample-loading dependency. Production remains
  on the previously published build until this version is explicitly pushed.
- Production PWA `0.35` includes 239 built-in progressions: 107 core examples and
  132 exercise-answer variants from printed pages 172–185.
- Release `0.33` adds the approved sage-green Bodoni application icon and makes
  the Builder editing state explicit: a selected chord can be updated or added
  as a new chord, and deleting it returns the composer to Add mode.
- Release `0.32` added the Progression Builder, audited
  functional/tertian note spelling, stable mobile viewport behavior, and
  ascending/descending arpeggio playback while retaining the same 239-item
  canonical catalog. User-created progressions live in a separate local
  library and are not counted as textbook content.
- The published standalone Trainer uses cache `0.35`. Localhost previews
  unregister service workers automatically so iterative testing never mixes
  current HTML with stale cached JavaScript.
- Lite `0.4` is built from the same interface, Builder, and
  audio engine, but its shipped
  catalog physically contains only Chapters 1–4. Its storage and cache names
  are isolated from the full Trainer.
- GitHub Pages and the repository are working.
- Favorites and statistics are device-local.
- The catalog is manually encoded from the book and still benefits from
  musical auditing against the original PDF.
- The application currently plays equal-duration block chords, not the printed
  melodic rhythm.
- The public build must remain usable offline after its first successful load.

## Product Direction

Likely future work:

- continue auditing all Chapter 1-16 progressions against the source;
- improve voicing and bass balance where listening tests expose ambiguity;
- expand progress statistics without compromising the quick practice flow;
- add curated practice sets while retaining the global randomizer;
- eventually package a more native iPhone version only after the PWA behavior
  is stable.
