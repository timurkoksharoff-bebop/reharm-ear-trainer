# Galactic Tour import

Source playlist: user supplied `Jazz 1460.html`; generated module stores titles,
authors, original key/style, and decoded chord-chart strings. Original HTML and
MusicXML files remain outside Git. `tools/standards-catalog.mjs <playlist>` rebuilds it.

Protocol references:
- https://www.irealpro.com/ireal-pro-custom-chord-chart-protocol/
- https://www.irealpro.com/developer-docs/
- https://github.com/pianosnake/ireal-reader/blob/master/unscramble.js
  (50-character permutation behavior checked against this implementation.)

The game uses chord events as targets, not a timed backing-track performance.
Original chart strings remain in the catalog. Accidentals, chord quality and
independent bass pitches transpose together; the canonical book data is untouched.
The preview currently uses readable flat pitch-class names (enharmonic spelling,
not guaranteed functional notation). Unknown qualities/form navigation block launch.

Quality checks:
`node game/tools/importer-check.mjs '/path/to/user/files'` compares the supplied
Autumn Leaves HTML and MusicXML: 32 measures, 34 chord events, including the two
measures with two chords. It also tests all 12 transpositions and independent bass.
The 1085 runnable / 375 diagnosed catalog count is parser coverage, not an audit
of the community charts against published scores. Melody Memory is unaffected.

Remaining: D.C./D.S./Coda, two-measure repeats, N.C. timing, complex XML forms,
additional qualities and contextual musician exercises. Import MXL only after an
explicit ZIP parser is added; never interpret MIDI/XML note pitches as invented chords.
