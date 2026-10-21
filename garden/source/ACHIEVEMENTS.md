# Harmony achievements — first four ranks

The user approved chakra colours/names as game proficiency milestones, a persistent
achievement cabinet, separate full-mandala awards, and three reserved upper ranks.
These are initial, visible game thresholds for later tuning from actual practice.
They are not a formal qualification or an online leaderboard.

| Rank | Distinct routes | Answer accuracy | Max laps | Keys | Teacher routes | Seventh routes | Extended Teacher routes | Independent-bass Teacher routes | Valid flying notes / routes | Note accuracy | Practice days |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|
| Muladhara · red | 3 | 80% | 4 | 1 | 0 | 0 | 0 | 0 | — | — | 1 |
| Svadhisthana · orange | 8 | 88% | 3 | 3 | 0 | 4 | 0 | 0 | — | — | 1 |
| Manipura · gold | 12 | 92% | 2.5 | 4 | 4 | 4 | 2 | 2 | 8 / 3 | 75% | 2 |
| Anahata · green | 20 | 96% | 2 | 5 | 10 | 6 | 5 | 4 | 24 / 6 | 85% | 3 |

Every row uses flights meeting that row's accuracy and lap threshold. Ranks are
earned sequentially and permanently. Vishuddha, Ajna and Sahasrara are displayed
dimmed and cannot be earned. They have no fallback score or hidden unlock.

Only built-in routes with at least four chord positions, completed in Student or
Teacher, qualify for ranks. Custom routes and Applicant still count toward their
own mandala collections. Repeats improve results but do not add distinct routes.
Only independent answers count: reveal artifacts leave missing manual-answer
receipts, while option filtering marks the entire flight as assisted. An identical
bass automatically inferred from a correct Teacher root is legitimate. Hints do
not remove game points or cancel the player's normal completion.

Accuracy is correct accepted manual answers / accepted attempts, including every
wrong attempt. A solved part cannot generate another attempt. Flying-note verdicts
are counted once per position/pitch; repeated catches cannot farm note milestones.
Ambiguous catches do not affect note accuracy. The best note total per route is
used; repeats and key changes cannot multiply that route's note total.

A lap is sequence length × barSeconds for the actual mode. The active run clock
already excludes pauses and the initial tonic reference, includes held repeats,
and freezes at completion. Student and Teacher therefore use comparable units.
No change to scoring, audio, MIDI, harmony, pacing, collisions or terrain.

The device-local `ear-yoga-achievements.v1` store retains a small Pareto frontier
per route/key/mode/practice date, earned dates and mandala awards. It does not
overwrite old progress or records, and has no network synchronization. Legacy
completed route IDs establish collection badges only; their missing accuracy and
hint history cannot establish a proficiency rank. Existing ranks never downgrade.

The cabinet opens from Settings or the existing About section. Native dialog
focus, Escape and scrolling are preserved. New ranks use the compact completion
card's existing title/medal area without adding an overlay over musical controls.
No private reference images, textbooks or rejected art are published.
