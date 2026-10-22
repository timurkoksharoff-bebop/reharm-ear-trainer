# Journey map and route stars — 1.54

Choose route opens the planetary map. A world offers Random flight or Choose route.
The latter reveals a touch/keyboard carousel using exact route IDs and the existing
catalog. Selection returns to the existing flight engine; no notes, voicings,
slash bass, samples, terrain, pacing or resource rules are replaced.

The map is separate from proficiency achievements. Its central axis shows compact
skill signs; the full seven jewel awards and their conditions remain in Achievements.
The first four award IDs/earning rules and the three reserved ranks remain compatible.
Sanskrit names are replaced by musical names in visible labels.

## Persistent five-star results

`ear-yoga-route-stars.v1` stores the best integer rating per exact route ID.
A replay can raise, never lower it. Percent = completed routes / routes in that
world. Average = mean of the best ratings of completed routes, once per route.
Old completed IDs receive one star for established completion; their old scores
cannot establish independent answer accuracy or earn higher retrospective grades.
Unplayed routes do not enter the quality average and remain in the completion
percentage denominator. Grades are device-local, like existing game progress.

Initial thresholds, to be adjusted after real play:

- 1: completed, including Applicant.
- 2: Student/Teacher answers, accuracy >=80%, at most5 laps; full reveals cap at2.
- 3: accuracy >=93%, at most3 laps.
- 4: independent or reduced-options answers, accuracy >=98%, at most1.65 laps; if notes were attempted, >=85% valid.
- 5: independent answers, every answer correct, at most1.05 laps; every attempted flying note valid.

One lap = chord count × the mode's actual chord duration. Pauses are excluded.
The same receipt used for proficiency records supplies answer independence and
accuracy. These thresholds are design choices, not measured skill percentiles.
The existing numeric score remains separate and unchanged.

## Rendering and controls

Cached shaded planet sprites, starfield and perspective-projected circles on one
Canvas2D background and transparent foreground passes, with the DOM skill axis between them; frame cap approximately30fps, DPR capped1.75. Natural drag and inertia,
two-finger zoom, wheel/buttons, keyboard rotation and a higher camera angle.
Seven axis signs stay fixed. Individual planets have no Saturn rings.
Pause/hidden documents stop drawing; enlarging a world stops the background.
No VR device or physical iPad performance claim. Local prototype values are not
included in the release: the embedded map receives real catalog/progress data.

## Result receipt — 1.54

The result now separates per-key numeric score records from best per-route stars.
Expand the star row to see this flight’s grade, accuracy/laps, hint or Applicant
limit and all five thresholds. A raised best gets an upward marker. Star criteria
use a four-star cap for every partial options filter (half, four choices,
quarter); full reveals cap at two stars. Any answer hint still prevents independent
proficiency-rank credit. A cap is not a guaranteed grade; accuracy and laps
still apply. Multiple hints use the strictest cap for that flight.

Near planet sprites (z<0) are above the fixed axis; far sprites (z>=0) stay below.
Taps and drags on the covered portion go to the visible near planet; native
keyboard access to skill signs remains available.
