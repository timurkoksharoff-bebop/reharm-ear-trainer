# EAR YOGA — Grand Piano

**Salamander Grand Piano v3 — Yamaha C5**

Sample recordings: **Alexander Holm**. Retuned SFZ version: **Markus Fiedler**.
SFZ reconstruction/remapping: **kinwie**.

Source: [sfzinstruments/SalamanderGrandPiano](https://github.com/sfzinstruments/SalamanderGrandPiano/tree/3382bf9496bba2486f5ab0de55a264d1dfc38404),
commit `3382bf9496bba2486f5ab0de55a264d1dfc38404`.
Original collection: [Salamander Grand Piano v3](https://archive.org/details/SalamanderGrandPianoV3).
The [FreePats primary catalogue](https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html)
also identifies the piano and Alexander Holm's recordings.

Licence: [Creative Commons Attribution 3.0 Unported](https://creativecommons.org/licenses/by/3.0/).
The complete supplied legal code is included as `SALAMANDER_CC_BY_3_0.txt`.
See the source [README](https://github.com/sfzinstruments/SalamanderGrandPiano/blob/3382bf9496bba2486f5ab0de55a264d1dfc38404/README.md)
and [LICENSE](https://github.com/sfzinstruments/SalamanderGrandPiano/blob/3382bf9496bba2486f5ab0de55a264d1dfc38404/LICENSE).

## EAR YOGA adaptation

This compact bank is derived from that SFZ instrument. It contains 17 stereo
recordings across A0–C8 from **one recorded dynamic, v10** (original MIDI
velocity range 73–80). It is not the complete 16-layer original library.
Hammer/pedal noises and separate string-resonance release recordings are not
included. The player uses the nearest available sampled root for each note.

Original stereo 24-bit/48 kHz FLAC was converted to stereo 16-bit/44.1 kHz PCM
WAV with Apple's `afconvert`. To keep the mobile payload bounded, recordings
through F♯3 are capped at 10 seconds and C4–F♯5 at 9 seconds. Only truncated
tails receive a final 0.5-second raised-cosine fade. Naturally shorter high
notes remain at their original duration. The first eight seconds of each
converted recording are unchanged; no normalisation, compression, denoising,
new equalisation or artificial sustain loop was written into these files.

Original Retuned SFZ root pitches and cent corrections are retained as player
metadata. Playback gain, envelopes, key transposition and any leading-silence
handling belong to the player. Full source/runtime hashes and preparation
details are in `GRAND_PIANO_SAMPLE_MANIFEST.json`; exact WAV SHA-256 hashes are
also listed in `SHA256SUMS.txt`.

No endorsement by the original authors or instrument manufacturer is implied.
