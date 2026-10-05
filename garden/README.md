# Сад Эха 0.97

Standalone PWA, desktop and mobile browsers. Entry point: ./index.html. Install from the browser's Add to Home Screen action. This is not an App Store/Google Play binary.

Only Garden runtime assets are precached (about 10 MB), no other planets. On first visit the offline cache must finish downloading. Progress, favourites and welcome-tour dismissal are device-local. The existing /game/ 0.94 release remains unchanged.

## Rebuild

Source: source/. Requires Node.js and sharp. Run node source/tools/build-garden-standalone.mjs /absolute/output/path. Bump version (and therefore CACHE_NAME) for each PWA release. Browser regression uses Playwright and Chrome: GARDEN_RELEASE_URL=http://127.0.0.1:PORT/ node source/tools/garden-release-check.cjs.

## 0.97

- Bottom rail grades the actual bass; slash-chord answers specify the upper chord degree separately. Exact musical notes/catalog preserved.
- sus4 has a fixed place in the right rail (Chill 1 regression).
- Iridescent flower reveals the missing bass degree without spending a charge on a solved position.
- Cocoon protects three ordinary stone impacts; lava, errors and reserve drain bypass it.
- Infinity exits immediately on a correct answer or the visible ▶ button.

- Wheel of Life is a flat procedural mandala with five counter-rotating rings, not a raster jewel. Pickup restores all four reserves to 100%; one 35% rescue lottery when 1–3 unsolved chords remain and any reserve is at or below 18%, plus a rare background chance. At most one per flight; no post-game revival.

- Keyboard movement works after focusing answer/menu buttons; editable fields keep normal typing.

- Back arrow beside settings asks before ending the flight. Pause/continue use international icons only.

- Active accompaniment buttons display miniatures of the exact caught flowers.
- Progressive launch loads scenery/ship first; optional items load in the background. Mobile uses a lighter shader and adaptive pixel density. Scene and ship textures are smaller; meteor alpha is preserved in compact WebP.
- Root spirals filter bass, coloured seeds filter chords, with no letters in the sky. Stronger colours leave fewer choices.
- Anti-idle pressure rings are thinner and more transparent; timing and reserve damage are unchanged.

- Growing vine and fireflies for a correct bass; existing chord blossom retained.
- Visible Garden home exit, paused settings, refined welcome guide and offline install.

Verification: 119 routes with two filter strengths; 679 book sonorities and 22 qualities in 12 keys; pickup-to-inventory infinity regression; responsive browser run at 320/390/430/1440 widths; offline reload. Physical iPhone/Android device testing is still required.
