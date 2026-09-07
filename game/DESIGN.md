# Signal Flight: game design direction

The goal is a shooter that is worth playing on its own, where reliable listening
creates tactical power. The first implementation is an experiment in that loop,
not evidence of long-term ear-training outcomes.

## Zanac reference pass, 2026-09-07

Reference: [NES Longplay #83: Zanac, HIDEFACES](https://www.youtube.com/watch?v=JJchGB1hoN8).
Opened playback around 1:15 and inspected the early terrain/combat segment. This
showed a small player against a much larger continuously scrolling, detailed
surface, with small airborne targets distributed across the upper playfield.
Longer playback/seek inspection was unreliable in this browser (ads/player
navigation interrupted it). This is a limited visual pass, not a claim to have
watched the entire hour-long run.

For the mechanics comparison, [GameSpot's Zanac review](https://www.gamespot.com/reviews/zanac-review/1900-6183853/)
describes dense waves, staged larger encounters, multiple weapons and adaptive
difficulty. The [original instruction manual scan](https://www.digitpress.com/library/manuals/nes/Zanac.pdf)
was located as a future primary reference; browser rendering did not provide a
usable page inspection during this pass. No graphic, level, music or code was copied.

## What the reference changes in our prototype

| Principle | Flight 001 implementation |
| --- | --- |
| Movement has continuous purpose | Destroyable drones enter in formations; shots collide; ship dodges both bodies and bullets. |
| Power changes the feel of play | Recognizing bass grants a seven-second five-lane spread with faster fire. |
| Rewards create a route through space | Sound capsules fall: catch matching intervals, dodge mismatches. A full charge restores a shield and grants spread fire. |
| Alternate concentration and release | A listening encounter leads into a combat rush that lasts at least six seconds and waits for the interval capsule to resolve. |
| A world passes beneath the ship | Original detailed terrain scrolls continuously beneath high-contrast sprites, bullets and effects. |
| Pressure follows capacity | Three bounded difficulty bands respond to sector, combo and remaining ship shield. |

This adapts the general genre grammar. It does not reproduce Zanac's weapon set,
enemy algorithms, exact timing, level structures or art.

## Protect hearing while preserving motion

During the reference/target cue, hostile projectiles and drones pause; ship control,
automatic shooting and terrain continue. Replay is free. After a correct signal,
the player gets an immediate beam, shield burst and expanded weapon, then a short
combat release. This novice design deliberately trades uninterrupted hostility for
audible cues. A later experienced mode can slow enemies instead of freezing them.

No wrong-answer popup interrupts the field. A wrong signal causes an aimed attack
and a lost combo/weapon tier. A previously broken musical shield stays broken.
Ordinary drones can be killed with reflexes; the route cannot advance past the
hydra without recognizing its signal. Drone kills never count as correct hearing.

## Long-term learning: hypotheses to test

1. Build a large set of source-audited phrases with frequent key/register/timbre
   changes between phrases, so fixed pitch or rote sequence cannot solve the game.
2. Introduce new sounds through a memorable short auditory encounter, then weave
   familiar and unfamiliar ones into combat. Keep recognition rewards immediate.
3. Track bass and exact chord-type confusions separately. Revisit uncertain contrasts
   across days, without a repetitive question screen.
4. Measure transfer outside the game: unfamiliar instrument, unfamiliar register,
   new progression and a delayed return. In-game score alone is not proof of hearing.
5. Add minor tonics, source-audited functional progressions, inversions and slash
   bass gradually. Exact types and up/down/simultaneous interval capsules are now
   implemented; validate their difficulty before growing the campaign.

Conservatory-level listening is an ambition, not an established result of this
prototype. Deliberate transfer tests and novice playtests should decide expansion.
The aim is satisfying mastery and replay value, not compulsion or retention tricks.

## Symbols as game objects

The weapon pads are battery modules labeled with real chord symbols. Root and
quality are independent choices that assemble a full figured symbol in the HUD.
The beginner route limits its available set; a separate chromatic flight exposes
all 12 pitch roots and 22 qualities through two fixed arsenal tabs. Tab choice
does not depend on the hidden answer. Shape and colour are shared within a bank
so a quality is identified by its notation rather than a mood-colour shortcut.

The terrain was generated as a tile but has imperfect edge geometry. The dark
rendering keeps it subdued; exact seamless art and a broader weapon/enemy roster
remain visual polish work.
