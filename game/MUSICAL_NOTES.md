# Musical scope of Flight 001

`../app.js` remains the canonical exercise and chord-definition catalog. The game
has its own interface and sustained Web Audio synthesizer.

## Audited book material

Randy Felts, *Reharmonization Techniques* (Berklee Press, 2002), Chapter 1,
printed p. 9 (PDF p. 8 in the locally held original):

- Fig. 1.6: F6 – D−7 – B♭ – F6; I6 – VI−7 – IV – I6.
- Fig. 1.8: F6 – D−7 – C7sus4 – D−7; I6 – VI−7 – V7sus4 – VI−7.

Visually checked against the original on 2026-09-07 and matched to catalog IDs
`fig-1-6` / `fig-1-8`. The private PDF is in the canonical Documents project;
no scan, melody or reference PDF ships with this game.
`tools/check.mjs` checks both sequences and source metadata against `app.js`.

The third campaign sector plays all four chords of each figure, in order, with
unchanged quality and pitch-class content. Fig. 1.8 retains its VI−7 ending.
Key, register, synth colour and articulation stay constant within each phrase.
Inserted tonic references, equal event lengths and combat pauses are teaching
choices; they do not reproduce the printed melody or rhythm.

## Authored drills

The first two sectors use authored I/V and I/IV/V orientation patterns returning
to I. They are not reduced book excerpts. The cue starts with a major tonic block,
340 ms of true silence, then the target root. Available keys are C, D, E♭, F, G,
A and B♭; successive phrases cannot repeat a key. The initial register is fixed;
later phrases vary register and synth colour.

The separate chromatic mode generates independent root/type pairs, grouped four
at a time only to hold the listening reference steady. It does not claim harmonic
function or a book source for that order. Its 12 roots and 22 exact chord qualities
form 264 combinations. Each quality's interval array is checked against the
canonical QUALITY table, including compound extensions such as 9, ♯11 and ♭13.
No chord tones are discarded. The specific 7alt realization is the catalog's
0, 4, 6, 10, 13, not a claim that every altered dominant has that exact voicing.

Each chromatic pitch has one button spelling: I, ♭II, II, ♭III, III, IV, ♯IV, V,
♭VI, VI, ♭VII, VII. Tooltips show the common enharmonic alternatives. Isolated
pitch recognition cannot distinguish ♯I from ♭II; source-functional spelling is
preserved in the book records. Minor tonics, inversions and independent slash
bass are not generated or taught here.

## Exact symbols and two shields

The upper bank grades root degree; the lower bank grades exact chord quality.
Both banks are available concurrently, and either shield may be broken first.
An error never restores a broken shield. Major triad and 6 are distinct answers;
so are m7 and maj7. Labels use standard symbols rather than mood mnemonics:
`m7` = minor seventh, `maj7` = major seventh. The complete symbol appears after
both shields are destroyed and stays in the HUD until a new sector.

The type tutorial compares qualities over the same root. The small book set still
correlates VI with m7, so it cannot establish independent recognition by itself.
Chromatic mode removes that particular correlation by selecting root and type
independently, while preserving the exact catalog tone sets.

## Interval capsules

Authored capsules train ♭3 (three semitones), 3 (four) and 5 (seven). Their visible
label specifies the target, while the actual sound may contain a distractor
(three, four, five or seven semitones). Appearance does not reveal matching status.
The user catches or avoids them with the ship. Correct rewards are +20 ascending,
+30 descending, +40 simultaneous; a wrong catch costs 20 energy. This is a game
balance choice, not a universal ordering of perceptual difficulty. Misses and
correct avoidance are tracked separately and not counted as chord recognition.

The actual interval can be replayed; a distinct reference button plays the target
ascending. Two melodic notes last 700 ms each with 50 ms between them; simultaneous
notes sustain together for 1.35 s. The note pair has stable pitch and timbre.

## Audio and limits

A filtered sawtooth (or triangle) plus same-pitch sine provides the sustained synth
sound. No samples, detune, vibrato, soundtrack or pitched gunfire mask the cue.
User-gesture audio unlock and a near-silent warm-up support mobile browsers.
Pause/backgrounding cancels scheduled voices and UI callbacks. Resume replays the
whole interrupted signal. Hostile movement and attack timers freeze during sound.

Chord cues play tonic, isolated target root, then the full chord. Full chords vary
block, ascending and descending articulation and upper spacing without losing
pitch classes. Every arpeggio note sustains to the same chord end.

Next musical work: physical listening tests, adaptive root/type confusion matrices,
source-audited functional contexts beyond the two figures, inversions and slash
bass, and transfer tests in unfamiliar timbres/registers outside the game.
# Flight 002: listening library and rhythmic material

The Rock Tongue scheduler was audited across all 22 catalog qualities × 12 roots:
every chord member is scheduled, no tonic is inserted, and grading uses the same
quality ID. For comparison: maj = 0/4/7; maj7 = 0/4/7/11; 7 = 0/4/7/10.
The library uses this same sustained synth path. A UI defect that rebuilt answer
buttons each timer second was fixed; button identity now lasts for the encounter.

Twenty short rhythm studies are authored recognition examples, not recordings or
transcriptions of a source arrangement. Styles encompass many variants; these
examples teach the labeled pattern rather than exhaustively defining a genre.
Tumbao Bass and Montuno Keys are explicitly instrument parts and form their own
answer pool. Source context:

- [Vic Firth Groove Essentials](https://ae.vicfirth.com/education/groove-essentials/)
  and [Mambo](https://ae.vicfirth.com/education/groove-essentials/groove-essentials-41-mambo/).
- [Smithsonian Calypso lesson](https://folkways-media.si.edu/docs/lesson_plans/FLP10072_caribbean_calypso_beat.pdf):
  steady stepping pulse and syncopated strumming.
- [Smithsonian bell-pattern teaching](https://folkways.si.edu/braiding-rhythms-the-role-of-bell-patterns-in-west-african-and-afro-caribbean-music/tools-for-teaching/smithsonian).
- [Library of Congress: Daymé Arocena](https://www.loc.gov/item/2024697728/),
  Afro-Cuban and rumba clave educational context.
- [Berklee Time and Rhythm](https://online.berklee.edu/courses/time-and-rhythm-1):
  2:3, 3:2, 3:4 and 4:3 learning progression.

Polyrhythms are generated mathematically: A high rim hits and B low kick hits
divide an identical four-beat cycle evenly. Labels always mean high:low, so 3:2
and 2:3 are distinguishable. This is polyrhythm practice, not a claim to teach
complete vocal konnakol vocabulary. Ratios include 2:3, 3:2, 3:4, 4:3, 5:4, 4:5,
5:3, 3:5, 7:4 and 4:7. All examples use 110 BPM to avoid tempo-only answers.
