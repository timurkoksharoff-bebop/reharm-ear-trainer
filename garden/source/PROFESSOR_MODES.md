# Professor — experimental chord/scale audition

The first three difficulty modes keep their existing harmony and audio. Professor
uses Teacher's root/quality/independent-bass answers and a pace 3% slower than Teacher (1.07 × 0.97 relative to Student), with compact
scale flight tags alongside the twelve single tensions and original oxygen rules. Guru is a reserved, disabled category.
Scale choices affect a separate NAV resource and bounded score extras; they do
not rewrite chord voicings, oxygen rules or proficiency ranks. Single tensions keep their
original bounded score and O₂ effects.
A compatible structural reading is feedback, not a universal stylistic judgment.
Professor best-route stars use ear-yoga-professor-route-stars.v1; original ratings
are not overwritten. The 4/2/5 hint ceilings apply to its chord answers too.

## Reference review

Primary local references reviewed visually (the user's scans have no text layer):

- Ron Miller, Modal Jazz Composition & Harmony vol.1: ch.II (diatonic
  construction), ch.V pp.32–33 (melodic-minor tetrachords, aliases and colours),
  ch.XII p.90 (harmonic-minor family), ch.XV p.116 (harmonic major).
- The Berklee Book of Jazz Harmony: introduction p.xi (chord tones, tensions and
  passing scale degrees), p.21 (Ionian fourth is melodic, not a held tension),
  ch.9 pp.184–186 (modal tonic and characteristic pitches vs momentary chord scales).

Cross-checks from the institutions' own teaching material:
- https://online.berklee.edu/takenote/jazz-improvisation-10-scales/
- https://pulse.berklee.edu/content/practice/pdfs/PR_All_Scales_Arp_Bass_Clef.pdf
- https://college.berklee.edu/courses/psij-341
- https://musictheory.pugetsound.edu/mt21c/HowToDetermineChord-ScaleRelationships.html

No scanned books, textbook music examples or recordings are release assets.
The code contains interval facts and our own conservative classification.
Miller's Mixolydian #4 = Lydian dominant; Phrygian natural6 = Dorian b2;
Aeolian b5 = Locrian natural2. Both names appear in the catalogue. Harmonic-major
aliases follow Miller. The complete formula is always shown in Settings, because
chromatically identical collections can have different degree spellings/functions.
Seven-note degree formulas retain their diatonic spelling (including double
flats); symmetric, pentatonic and bebop formulas have explicit degree labels.
Alt is shown in its seven-degree spelling; dominant-function enharmonic aliases
are explained by the full name and chord context rather than changing its MIDI.

## Catalogue and play

41 entries: major7, melodic-minor7, harmonic-minor7, harmonic-major7,
pentatonics6, blues2, symmetric3, eight-note bebop2. Melodic minor is the jazz
ascending form in both directions; previews alternate six broken contours within one octave, with short/long phrases fitted to the current chord window.
Pentatonics include major, minor, minor6, half-diminished, majorb6 and suspended.
The half–whole and whole–half diminished collections are distinct.
Bebop major and dominant contain intentional passing tones, so they stay neutral.
No unverified custom hybrids are presented as established named modes.

A label names a mode rooted on the chord root at *contact*, never the key tonic
or the slash bass. The preview is a soft flute-like pair of sine partials, one
shot, fitted to the remaining chord window. All scale voices stop when the next
chord starts, a new audition starts, on pause, or when the app backgrounds.
Contacts within180ms of the chord attack or with less than650ms left are neutral
and do not schedule an audition across the chord boundary. Passing a token is safe.
A maximum of3 scale tags is present, each with a name and degree formula; a mixed candidate pool includes
structurally compatible and exploratory choices. Settings can disable families.

## Classification limits

- Compatible: defining guide tones and written alterations are present. An Ionian
  fourth over a major third is explicitly marked as passing, not a forbidden scale.
- Contextual/neutral: unknown qualities; omitted defining notes (including sparse
  pentatonics); blues/bebop passing notes; explicit mode context; independent slash
  bass; or an actual voiced chord tone outside the collection. The ambiguous base interpretation is penalty-free.
- Contrasting: a clear replacement of the major/minor third. The focused exercise
  treats this as a NAV conflict, without claiming creative use is prohibited.

This is not yet a full functional harmonic analysis. It does not infer a key
modulation, resolution function, modal centre or every upper-structure pentatonic.
The original played chord, voicing and slash bass are never rewritten to fit a scale.


## Combined tension/scale drill — 1.56

For complete seven-note and symmetric collections, each explicitly caught
tension is compared with the scale pitch classes. A missing selected pitch is
a clear exercise conflict, even where slash-bass/function context makes the
broader chord-scale interpretation neutral. A natural9 against Phrygian points
to its flat9; natural11 against Lydian points to sharp11. Both choice orders work.
Written extensions are also checked. Sparse pentatonics, blues and bebop remain
contextual: mere omission or a passing tone is not penalised. This pitch-set
exercise rule is our game design, not a claim every outside note is forbidden
in improvised music. Enharmonic pitches compare by sound, retaining labels.

Selections belong only to the actual sounding chord onset and clear on a new
onset, including a new loop; no stale choice is carried to another harmony.
The same conflicting mode/pitch pair costs once per onset. NAV starts80,
compatible choices restore6 once per mode/onset, and clear conflicts cost15.
There is no passive NAV drain. Zero has3.5 seconds of recovery grace; the
Wheel of Life restores NAV and O₂. Boundary/paused/expired windows are safe.
The HUD explains the conflicting degree and its scale alternative without
covering the answer rails. The original Teacher slash-bass requirements stay.

## Contextual offers, pickup points and combos — 1.57

The name and formula are centred above a visible luminous pickup point. Text
is not a collider. Pickup checks the dot against the ship core, including its
relative path between frames, so fast crossings do not slip through.
Automatic scales unlock after ceil(route chord count/3) fully solved positions,
including independent bass. Single tensions keep their original two-chord gate.

Offers favour ordinary Ionian/Dorian/Mixolydian/Lydian/Aeolian vocabulary; recent
labels are softly downweighted rather than excluded. Jazz choices remain regular
and uncommon rotations remain possible. Every second offering prefers a compatible
base/jazz choice if one exists in the enabled families. Selection uses projected
arrival harmony from the actual mission deadline, bar length, cursor and hold
state. Manual jumps/movement can invalidate that forecast; only the actual sounding
chord at pickup is authoritative. A matching tension may accompany an eligible
scale, selected from the intersection of scale membership and existing valid O2
tones. No full function/modulation analysis is claimed.

These are game tiers, not a textbook ranking of musical value: foundation +6NAV
/+6points, jazz +9/+10, rare +12/+14, only for compatible choices. Wrong rare
choices keep the same penalty; neutral contexts receive no rarity reward.
Scale score is once per position/mode over the whole flight, even across loops.

Professor combos belong to one actual chord onset and require independent manual
core answers: Precise entry(chord+tension)=18, Inside harmony(chord+scale)=24,
Resonance(scale+matching pitch)=24, Full picture(all three)=48. Only the improvement
over that position's previous best is awarded. Errors/assists block the core-answer
combos; an unmatched pitch cannot earn Resonance. Tension/scale/combo extras share
the existing min(500,totalParts*10) cap; time and core answers remain primary.
They are local prototype feedback, not a verified online tournament rating.

Automatic arrival is shifted by at most0.8 seconds away from chord boundaries
when a deadline forecast supplies phase/remaining, with matching spawn-height
adjustment and a fresh harmony lookup before selection. User movement, jumps
and holds still make this advisory; every catch is checked again.


## Local adaptive workshop (1.59 prototype)

Local-only descriptive practice statistics, not a diagnosis or audio/AI assessment.
Stored under ear-yoga-professor-teacher.v1, independently of scores and ranks.
An actual mode/tension/manual-answer decision is recorded at most once per
outcome/item/chord/route-position per flight. Boundary events, contextual/neutral
scale judgments, ignored answers and assisted core answers are excluded. No
retroactive inference from old scores. Three recurring conflicts in at least two
route positions qualify for a compact review; three later successful decisions
with the same item/quality clear that recommendation. Raw repeated collisions
are not shown as an error total. The review is reachable from Professor settings
and its compact completion card.

Mastery requires at least eight recent graded choices, >=80% successful across
at least three route positions. Two mastered foundation modes gently increase
advanced weights; four and forty successful mode choices increase rare weights.
All enabled families remain possible; harmony/arrival eligibility and the regular
compatible-offer guarantee remain in place. The next unmastered topic gets a
small emphasis. These thresholds are provisional game pedagogy, not textbook
standards. Continued mistakes reduce novelty pressure without banning a mode.

Optional preflight lessons pick an unreviewed topic structurally relevant to at
least one route chord and respect selected families. Every existing catalogue
mode has a compact card with the degree formula, alternate names, a C-rooted
example, a chromatic keyboard showing chord/scale membership, separate chord,
scale and combined auditions. Examples are newly constructed minimal voicings,
not copied textbook examples and never rewrite route harmony. Lesson audio and
flight audio are mutually exclusive; closing resumes only an already-running
flight, or explicitly launches the selected route. Listening is not mastery.

Re-reviewed Miller printed p.32: melodic-minor family names and aliases; Berklee
printed p.21: distinction between melodic fourth and sustained tension11.
Phrygian dominant = Mixolydian b2 b6 follows identical interval collections.
Sparse, blues/bebop and functional/slash-bass cases remain contextual rather than
universal claims of correctness. No Hungarian-minor scale was silently invented
or added: cards cover the current verified41; extra scales need separate review.
