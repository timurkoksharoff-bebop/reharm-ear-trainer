# RES / Resonance - Student notes and Teacher oxygen drill

Student automatically spawns only the user-confirmed labels 1, 3, 5, 7.
They use the same root-relative pitch and verdict functions as Teacher:
12, 16, 19, 23 semitones respectively, with no implicit remapping for chord
quality. Student keeps four supply vials: note contact sounds once and valid
notes earn the existing capped score bonus, with no O2 drain, damage or failure.
Applicant has no medallions. Teacher retains the full twelve-label pool and
all existing O2 rules below. Both note modes unlock after two fully solved
positions; pause freezes them and completed listening clears them.

Original chords, voicings and tempo are unchanged.
The fifth gauge is labelled O2 / Oxygen; H2O remains separate. Internal
resonance identifiers stay stable. Labels denote intervals above the chord
root (not the key tonic or slash bass). The sounding audio chord is used at
contact, not the chord at spawn time.

Source inspected visually: Reharmonization Techniques (2002), printed
pp. 29-30 (natural 11 / major-third conflict; altered dominant tensions and
context), pp. 98-99, Figs. 10.7-10.9 (available 9 and 13 in voicings),
pp. 125-128 (Dorian/Phrygian context).
Reference PDFs stay local and are never included in the public build.

This is an explicit game policy, not a universal jazz-harmony table.
All 12 pitch classes appear at the same overall spawn frequency as before.
Existing chord tones and explicitly written extensions are positive. Labels
b3 and #9 are always equivalent, as are other enharmonic aliases.
Ordinary dominant extensions b9, 9, #9, #11, b13, 13 are positive; natural
11 with a sounding major third is negative, major 7 above dominant 7 negative.
Major: 9/#11/13 positive, b9/11/b13 negative, b3/#9 neutral.
Minor: 9/11 positive, b9/b13/major 3 negative, unmarked 13 neutral.
Half-diminished: 9/11/b13 positive, b9/major 3/perfect 5 negative.
Sus: 9/13 and chord tones positive; b9 neutral, #11/b13 negative.
Other unclassified colours are neutral, never guessed to be wrong. Omitted
major third makes the natural-11 clash neutral. A chapter number alone does
not change the grading; advanced modal questions remain outside this drill.

An explicit tensionMode ('dorian', 'phrygian', 'lydian') can select its modal
palette. The program does not infer a mode merely from m7 or the key name.

Correct: +(42 / available tone count) O2 multiplied by the route drain scale.
Count the valid members of the same 12-label random pool using the same
voicing, tonic and modal context as collision grading. This equalizes expected
income at 3.5 O2 per random encounter before route scaling and boundary grace:
maj7 +6, m7 +7, dominant 7 +4.2, diminished seventh +10.5. A rare valid
tone compensates more; a dominant-heavy route does not get richer for free.
Imported m11/9/13/7#9/7#11/o use their existing minor, dominant or diminished
family; original notes, quality IDs and playback are untouched. Unrecognised
neutral-only harmony does not drain O2 while no valid catch can replenish it.
Clear conflict: -20 O2
without any long-route discount. Ambiguous: 0. Initial O2: 80.
Floating numbers show actual clamped changes, never nominal income at 100.
Avoid pickup: red ring/label, 1.8-second readable loss; all supplies and
collision events show their actual per-event changes without counting drift.
Automatic medallions begin only after two fully solved chords. They are 30%
smaller (35 instead of 50 drawing units), with correspondingly smaller collision
radii, and use side lanes (22-30% or 70-78% of screen width), leaving the centre
clear. Intervals gradually shorten from 8.4-10.8 seconds to 4.2-5.4 seconds
as the remaining chords are solved; at most four medallions are airborne.
O2 drains from the first actual chord, even before two answers unlock bubbles,
by 0.45 per active, audible second (27/minute on short routes).
Oxygen and spawn clocks use the flight's active elapsed clockDt, not its
50ms-capped physics step. FPS regression tests cover 2/5/10/15/30/60 frames
per second. Pause and completed listening freeze expenditure intentionally.
Passive drain of all supplies uses min(1, 100 / ((routeLength+1)*barSeconds)).
This preserves short-route pacing and leaves a first-lap reserve on long
standards. No scaling of impact damage, errors or ordinary life pickup rewards. No
immortality floor: more laps continue spending supplies.
Positive O2 pickup income uses the same duration scale, so discounted
long-route spending cannot be farmed with undiscounted rewards. Score points
for correct tones stay unchanged. No drain during pause, tonic reference or
after completion. Tests compare O2 loss to H2O with no pickups, perfect
maximum-frequency pickups and blind pickups across lengths 4 through 128.
Anime 05 also has a separate regression using its original eight chords,
32-second laps and 100 deterministic random medallion streams. It holds
unlock progress at two solved positions and collects every available valid
tone at the encounter chord for five laps. This checks balance, not human
reaction or flight skill; no restorative pickups are assumed.
The catalog audit covers all 184 bundled routes (107 book routes, 50 Jazz
Standards, 27 built-in/saved/embedded routes) using the real release catalogs
and mission normalization. Three active laps, first two solved positions by
8 seconds then one per 8 seconds, catching 75% of valid encounters at their
actual encounter chord; 100 seeded streams per route in release verification.
Restorative pickups, complete-state freezes and collision damage are excluded.
This is an O2 balance simulation, not a promise of human survival. Blind
expected income is lower whenever the chord has avoid tones; all-neutral
non-chord tones are not retroactively penalised just to make the test pass.
There is no extra penalty for passing a token. Zero has the same 3.5-second
rescue window as the other gauges. Wheel of Life also restores O2.
Within 180 ms of a chord boundary: neutral, still audible. A caught token
sounds once with a quiet, non-looping synthetic vibraphone-like tone.

Local score prototype: 100 per first revealed answer part, -25 per wrong
answer. Positive tone bonus 10, only once per position/pitch class, maximum
min(500,totalParts*10). Completion time bonus is totalParts*300 multiplied
by 1/(1+(activeSeconds/oneLapSeconds)^2). There is no early-time plateau;
finishing sooner always improves the unrounded time bonus.
Time and points freeze on completion.
Personal best records are device-local, keyed by route, mode and tonic.
This is not a secure online leaderboard; hints/automatic bass parts are
currently included in revealed parts and need separate tournament policy.
