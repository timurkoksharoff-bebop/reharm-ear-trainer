# Modal timbre sources — 25 October 2026

Scope: optional voices for modal melodies in Captain mode. The main chord
synthesizer, catalog voicings, slash basses and existing default flute stay in
their existing paths. This document records asset provenance and technical
checks; it does not claim completed musical listening or physical iPhone QA.

## Selected sources

| Bank | Source and licence evidence | Included audio |
| --- | --- | --- |
| `wurli` | [Greg Sullivan's E-Pianos README](https://github.com/sfzinstruments/GregSullivan.E-Pianos/blob/8c3e581acda3594b553948ff0222d4f84a698376/README.md) and [full CC BY 3.0 licence](https://github.com/sfzinstruments/GregSullivan.E-Pianos/blob/8c3e581acda3594b553948ff0222d4f84a698376/LICENSE) | 12 Wurlitzer EP200 recordings: six roots in each of the original mp and f layers |
| `drawbar` | [FreePats primary page](https://freepats.zenvoid.org/Organ/electric-organ.html#DrawbarOrganEmulation) and `readme.txt` inside the [original archive](https://freepats.zenvoid.org/Organ/DrawbarOrganEmulation/DrawbarOrganEmulation-SFZ-20190712.tar.xz): CC0 1.0 | Three sampled setBfree software-organ roots: MIDI 60, 72, 84 |

Greg Sullivan is the electric-piano sample author; kinwie made the repository's
SFZ mapping. Roberto / FreePats made the organ samples and bank. The organ is
explicitly an emulation recording, not a hardware Hammond recording. The
Wurlitzer is not a Rhodes. No account, paid API or purchase was needed.

CC BY attribution, the full supplied legal code and the organ's original
readme accompany the runtime assets in `art/modal-audio/`. The attribution
describes the subset and FLAC-to-WAV preparation. No source textbook is included.

## Electric-piano map

C4 means MIDI 60. Layer 0 uses source mp; layer 1 uses source f. These are two
recorded dynamics, not two gain settings applied to one waveform. `tune` is the
original SFZ correction in cents and `gainDb` is the source region volume.

| WAV stem | Layer | MIDI | Tune | Gain dB | Original region |
| --- | ---: | ---: | ---: | ---: | --- |
| `wurli-ab3mp` | 0 | 56 | -8 | -5.3 | 54–59 |
| `wurli-db4mp` | 0 | 61 | 4 | -5.3 | 60–62 |
| `wurli-gb4mp` | 0 | 66 | 7 | -5.4 | 63–68 |
| `wurli-db5mp` | 0 | 73 | 3 | -5.4 | 72–74 |
| `wurli-g5mp` | 0 | 79 | -8 | -5.4 | 75–80 |
| `wurli-db6mp` | 0 | 85 | 6 | -5.6 | 81–89 |
| `wurli-ab3f` | 1 | 56 | -11 | -4.8 | 54–59 |
| `wurli-db4f` | 1 | 61 | -2 | -4.8 | 60–65 |
| `wurli-ab4f` | 1 | 68 | 0 | -5.0 | 66–71 |
| `wurli-db5f` | 1 | 73 | 3 | -6.0 | 72–77 |
| `wurli-g5f` | 1 | 79 | -7 | -5.9 | 78–80 |
| `wurli-db6f` | 1 | 85 | 0 | -5.9 | 81–89 |

The complete source SFZ contains additional keys and dynamics. This compact
subset deliberately uses nearest-root transposition; `sourceLo/sourceHi` are
provenance, not hard runtime limits. In particular, original mp keys 69–71 used
B4mp, which is absent from this subset. Original mp velocity range was 38–65;
f was 66–89. The audition player chooses how to map its own normalized velocity
to these two layers; it should not imply that every original layer is present.

## Organ loops

All three files have layer 0, tuning 0 and region gain 0 dB. Original SFZ uses
continuous loops and a 0.7-second amplitude release. Loop times in
`garden-modal-samples.mjs` are these exact source frame numbers divided by
44,100; the initial attack is retained.

| WAV | MIDI | Source region | Loop start frame | Loop end frame | File frames |
| --- | ---: | --- | ---: | ---: | ---: |
| `organ-c4.wav` | 60 | 58–61 | 38,804 | 186,172 | 186,188 |
| `organ-c5.wav` | 72 | 70–73 | 50,253 | 197,631 | 197,647 |
| `organ-c6.wav` | 84 | 82–85 | 58,367 | 189,951 | 189,967 |

## Format, size and verification

- Wurlitzer: 12 FLAC files decoded using `/usr/bin/afconvert -f WAVE -d LEI16`;
  44.1 kHz mono 16-bit PCM retained. No normalisation, trimming or resampling.
- All 12 decoded WAV PCM MD5s match the corresponding original FLAC STREAMINFO
  MD5. This checks the actual decoded audio, not only matching filenames.
- Organ: three original WAV files copied byte for byte from the archive.
- Runtime WAV copies match all 15 previously inspected QA SHA-256 hashes.
  Headers, frame counts and sample rates were read using Python's `wave` module.
- Wurlitzer WAVs: **1,847,422 bytes**; organ WAVs: **1,147,736 bytes**;
  total **2,995,158 bytes** (about 2.86 MiB), plus small licence/credit files.
- Decoded sample storage is about 6.0 MB as mono float32 before browser overhead;
  load voices on selection, reuse decoded buffers and avoid loading copies per note.

Original downloads, exact source SFZ files, per-file URLs, FLAC hashes, durations
and PCM comparisons are local in ignored `qa/modal-samples-research/`.
Runtime `art/modal-audio/SHA256SUMS.txt` accompanies the WAVs.

## Integration notes

The pure-data export is `GARDEN_MODAL_SAMPLE_BANKS` in
`garden-modal-samples.mjs`. Sample file paths begin `modal/`; the builder copies
the bank under `assets/echo-garden/samples/modal/`. Do not create a new
`source/assets/echo-garden` directory, which changes the builder's asset-root
fallback. Retain SFZ tuning and relative gains when sampling; balance the modal
voice below the main harmony using runtime gain. Instrument choice remains
independent of the phrase/arpeggio choice.

Browser decoding, mix balance, actual listening and offline/mobile packaging
remain the integrating agent's verification steps. No publication was performed
by this asset-preparation task.
