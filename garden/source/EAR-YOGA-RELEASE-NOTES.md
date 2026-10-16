# EAR YOGA 1.22

Mobile PWA release for Space Music College. Public entry point: https://timurkoksharoff-bebop.github.io/reharm-ear-trainer/garden/.

- Conventional outline home and menu icons on the gameplay screen. Home retains flight-exit confirmation. Flight guide and RU/EN labels match the controls.
- Play and pause use matching monochrome SVG strokes, avoiding the blue emoji-style play control on iOS.
- Approved orbital cover art and phone composition retained. Narrow phones fit all difficulty labels; portrait tablets keep the title clear of the difficulty row.
- Space Music College is anchored to the Ear Yoga wordmark size and lower descender band, with a smaller caption stretched from the left E toward the g. Its distance from the wordmark stays constant when phone height changes.
- Russian/English player interface, scrollable illustrated flight map and mobile route paging.
- Five sampled sounds: Felt Piano, Hybrid Keys, Hybrid Orchestra, String Orchestra and Piano N. Sampled arpeggios retain distinct MIDI pitches while using one source recording per phrase.
- 50 Jazz Standards, four saved Cinematic routes and 11 additional Route Lab routes across Anime, Cinematic, Deep House, Funk and Disco. Saved MIDI pitches and tonic centers are retained.
- 60-day local preview from first launch on the device. Updates preserve the original countdown (storage key ear-yoga-preview.1.15). Expiry blocks flight and displays a notice while preserving routes and progress. Clearing browser data can reset this offline limit.

Validation: root smoke check; Garden harmony, arrangement and expiry checks; RU/EN browser checks at 320/390/430/768/1440 widths; home confirmation and menu behavior. Physical iPhone/Android testing remains a user-device check.

Previous navigation source files are retained locally in tmp/navigation-before-1.20, and the 1.19 mobile ZIP remains available for rollback. This release targets the mobile PWA; the separate macOS Trainer wrapper is not rebuilt.
