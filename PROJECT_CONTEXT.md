# Ear Reharm Trainer: Project Context

## Purpose

Ear Reharm Trainer is a Russian-language ear-training application based on
the chord progressions in `Reharmonization Techniques`. Its current scope is
deliberately narrow: chord progressions only. It does not reproduce melodies,
rhythmic figures, or complete arrangements from the book.

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
- Current published cache version: `0.14`
- Main branch: `main`

This directory is the canonical working copy. Do not continue development in
the former nested copy under the large Tomaro/arranging task.

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
- Before every exercise, a tonic reference chord sounds first.
- Progressions with eight or more chords keep a full-sequence round Play button
  and add two compact numbered playback ranges; each half starts with its own
  tonic reference.
- During blind playback, the current position number is highlighted without
  revealing the correct chord row. Review mode may highlight both.
- Wrong choices turn red and remain unavailable; the student keeps trying
  until the correct chord is found.
- Correct choices turn blue.
- Completing all positions automatically advances to another random example.
- `Skip` advances without affecting statistics.
- `Show answer` reveals the solution.
- `Review` replays the revealed progression while highlighting the sounding
  scale degree.
- Every answer row can be pressed to audition that chord independently.
- A discreet staff icon beside each chord opens a grand-staff popover with the
  exact playback voicing; bass-only, upright reinforcement, and independent
  slash basses are represented explicitly.
- The lower two-octave keyboard is available for manual checking.
- Portrait mobile layout is primary; long progressions use compact dots.

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

- `app.js`: exercise catalog, state, grading, randomization, favorites, audio,
  piano keyboard, and rendering.
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

- Production PWA `0.14` includes 239 progressions: 107 core examples and
  132 exercise-answer variants from printed pages 172–185.
- The current local release candidate uses cache `0.16`. Localhost previews
  unregister service workers automatically so iterative testing never mixes
  current HTML with stale cached JavaScript.
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
