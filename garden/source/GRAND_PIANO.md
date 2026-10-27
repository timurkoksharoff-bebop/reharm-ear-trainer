# Main acoustic Grand Piano bank

The optional **Grand Piano · Salamander Yamaha C5** is a main chord instrument,
independent of the modal melody voice selector. Existing instruments retain
their own samples, settings and defaults.

## Primary sources and licence

- [Salamander Grand Piano v3 repository](https://github.com/sfzinstruments/SalamanderGrandPiano/tree/3382bf9496bba2486f5ab0de55a264d1dfc38404):
  recordings by Alexander Holm, Retuned version by Markus Fiedler, SFZ remapping
  by kinwie. Pinned commit `3382bf9496bba2486f5ab0de55a264d1dfc38404`,
  tree `77a68329fec9a01d1cdb965f02709bb188d1dbae`.
- [Original collection](https://archive.org/details/SalamanderGrandPianoV3) and
  [FreePats primary grand-piano catalogue](https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html)
  identify this as a Yamaha C5 recorded in stereo. The source collection has
  16 recorded dynamics; this mobile subset includes only one.
- [Repository licence](https://github.com/sfzinstruments/SalamanderGrandPiano/blob/3382bf9496bba2486f5ab0de55a264d1dfc38404/LICENSE):
  [CC BY 3.0 Unported](https://creativecommons.org/licenses/by/3.0/).
  Full legal code, attribution, adaptation notice and hashes accompany runtime
  samples in `samples/grand/`.

The smaller FreePats upright was considered but is not an acoustic grand.
FreePats YDP Grand is another attributed Yamaha recording source. Salamander
was selected for direct individual source files, clear provenance and broad
register coverage. This selection is not a claim that listening preference has
already been validated by the user.

## Compact mapping

One fixed **v10** layer, original velocity 73–80; 17 distinct stereo recordings.
C4 means MIDI 60. Nearest-root selection covers the full 88-key range with at
most three semitones of transposition between adjacent available roots.

| Source file | MIDI root | Retuned cents | Runtime seconds |
| --- | ---: | ---: | ---: |
| A0v10.flac | 21 | 10 | 10 |
| C1v10.flac | 24 | 13 | 10 |
| F#1v10.flac | 30 | -3 | 10 |
| C2v10.flac | 36 | -9 | 10 |
| F#2v10.flac | 42 | -7 | 10 |
| C3v10.flac | 48 | 0 | 10 |
| F#3v10.flac | 54 | -3 | 10 |
| C4v10.flac | 60 | -6 | 9 |
| F#4v10.flac | 66 | 0 | 9 |
| C5v10.flac | 72 | -8 | 9 |
| F#5v10.flac | 78 | -5 | 9 |
| C6v10.flac | 84 | -8 | 6.0688 |
| F#6v10.flac | 90 | -13 | 6.1578 |
| C7v10.flac | 96 | -17 | 4.5347 |
| F#7v10.flac | 102 | -27 | 4.7337 |
| A7v10.flac | 105 | -38 | 3.8621 |
| C8v10.flac | 108 | -38 | 3.7155 |

`Data/region.txt` assigns `pitch_keycenter` explicitly and a constant `tune`
macro to each region; `Data/tune_ret.txt` supplies those exact cent values.
There is no `pitch_keytrack` override, so standard semitone tracking applies.
There is no per-region volume opcode; data uses `gainDb: 0`. CC-controlled
global volume and velocity curves are not baked into sample PCM. The original
optional offset control defaults to zero; its per-region offsets are retained
as provenance in the manifest rather than silently applied during conversion.

The bank is a deliberate subset, not an execution of the complete SFZ program.
Original region limits (`sourceLo/sourceHi`) document source mapping; they do
not restrict nearest-root playback of this smaller bank. Pedal, release-noise
and separate resonance samples are not included. Runtime envelopes are owned
by the game's main instrument engine.

## Preparation and integrity

Original FLACs: **25,706,501 bytes**, stereo 24-bit/48 kHz. Each original matches
the exact pinned Git blob SHA-1 and has a recorded SHA-256. The source FLACs
have zeroed STREAMINFO PCM MD5 fields, so no original PCM-MD5 equality claim is
made. Original downloads and detailed conversion intermediates remain local in
ignored `qa/grand-piano-research/`.

Conversion: `/usr/bin/afconvert -f WAVE -d LEI16@44100 -r 127` preserves stereo
and uses the converter's highest sample-rate quality. Intermediate WAV headers
were checked to confirm stereo 16-bit/44.1 kHz. Tail caps are 10 seconds through
MIDI54 and 9 seconds above that; six treble recordings are already shorter and
remain untrimmed. Eleven capped recordings receive a 0.5-second raised-cosine
fade beginning at 9.5 or 8.5 seconds. No initial attack was cut from these files.

The first eight seconds of every runtime PCM file are byte-identical to its
converted intermediate (or the complete shorter recording). No normalisation,
compression, EQ, denoising or generated loop is applied. All WAV copies have
SHA-256 and PCM MD5 records. Prepared PCM peak is 0.5241 or lower with zero
full-scale/clipped values; this does not substitute for checking the runtime mix.

Runtime audio: **23,827,528 bytes**, about 22.73 MiB. Decoded stereo float32
buffers use approximately 47.65 MB before Web Audio/browser overhead. Reuse
decoded buffers and load this optional voice when selected; never decode a
new copy per chord/note.

Data export: `GARDEN_GRAND_PIANO_BANK` in `garden-grand-piano.mjs`. Source WAVs
and attribution are in `art/grand-piano/`; the builder maps them into
`assets/echo-garden/samples/grand/`. The visible sound source link must keep
`GRAND_PIANO_CREDITS.md` accessible. No private reference book, raw FLAC download
or rejected art study belongs to this bank.

Actual browser decoding, mix balance, mobile/offline loading and musical
listening are integration checks. No physical iPhone test or publication was
performed by this asset-preparation task.
