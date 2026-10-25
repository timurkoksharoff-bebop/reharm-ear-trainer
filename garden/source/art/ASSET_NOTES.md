# Approved EAR YOGA 1.37 assets

The user selected the new orbital home screen and square spacecraft icon from
`concepts/ear-yoga-home-v7/` on 19 October 2026. These final derivatives were
created with the built-in image_gen tool. Other concepts are not release assets.
The in-flight spacecraft and scenery remain the existing 1.36 resources.

- `app-icon-ship-1.37.png`: the selected square icon, with only the lateral gold
  tails trimmed back from the left and right edges.
- `menu-orbital-1.37.png`: the selected portrait artwork with its painted UI
  removed, allowing real HTML text and animated controls to be placed over it.
- `menu-reference-1.37.png`: byte-for-byte approved portrait. The live menu samples
  its original lettering, gold frames, ivory engraving and turquoise textures as
  CSS sprites. No recreated Russian type or replacement ornament. Continuous
  screen-blended pearl highlights and caustics animate independently; selected
  mode textures move with selection. Real HTML controls retain their handlers,
  translated labels, keyboard focus and press feedback.
- The clean background is visible only behind the movable control cutouts.

## Final prompt: icon

Use case: precise-object-edit. Edit target: supplied square EAR YOGA spacecraft icon. Preserve the entire original square composition, the exact ivory/gold spacecraft, canopy, turquoise-green exhaust, starfield, central lotus petals, pearl nodes and fine gold detailing. Change ONLY the very outer lateral gold line tails that continue horizontally/diagonally out of the image around its middle height, near the left and right borders: shorten/remove these whisker-like extensions cleanly so the gold orbital contour is fully contained with a small comfortable dark-blue margin at both lateral edges. Preserve the recognizable lotus halo; do not cut off its principal petals. Reconstruct matching stars/deep-blue background only where the removed tails were. No new objects, no lettering, no UI, no rounded corners. Keep the spacecraft pixel appearance as close to the reference as possible. Full opaque square image, same palette and illustration style.

## Final prompt: menu background

Use case: precise-object-edit / UI background extraction. Edit target: supplied tall portrait EAR YOGA menu reference. Produce the identical tall portrait artwork AS A CLEAN BACKGROUND PLATE for live HTML controls. Preserve the exact spacecraft and luminous lotus/orbital hero group at its current size and location, all planets, starfield, blue nebula, and luminous planetary horizon with its cloud detail. Remove ALL text and UI: remove top-left Ear Yoga lettering, small lotus logo, SPACE MUSIC COLLEGE subtitle and its underline; remove top-right Меню and underline; remove all three difficulty buttons and their gold outlines/ornaments; remove both large bottom action buttons with all frames/fills/ornaments and lettering; remove footer links, footer enclosing oval arcs and bottom star ornament. Replace removed UI areas with naturally continuous matching cosmic sky or dark-blue planet cloud background. Keep the existing soft dark lower gradient, providing a quiet readable area for live buttons. The result must contain ONLY the approved background illustration, with zero text or button frames. Do not redesign, move or replace the ship, planet or central hero. Same tall portrait aspect ratio and crop as reference, opaque background.

## Button surface correction — 1.38

The reference PNGs are unchanged. Runtime SVG contour masks remove photographed
rectangular sky from the moving control layers and from the matching holes in
the background plate. Brightness is no longer applied to a rectangular control.
The unselected Student surface is neutral dark blue; its printed letters are
extracted from the same reference through an alpha colour matrix. Footer/menu
lettering stays in the original static Russian plate.

The route button has a dark glazed porcelain body inside its original gold
frame, with rim light, lower shading and travelling pearl reflection. The ivory
button retains its original engraving with a subtle material-lighting layer.
Original printed glyph shapes are layered above the glaze, rather than redrawn.
No new raster artwork or icon changes.

Focused Chromium pixel checks at 820×1180 and 390×844 confirm exterior pixels
are unchanged during presses and Student deselection; route activation works.
These checks are desktop emulation, not physical iOS/Safari testing.

## Detailed lower night surface — local preview1.74

The user requested a naturally continuing night-side planet beneath the home
controls, retaining cloud/terrain detail and tiny lights instead of a plain dark
field. Created with the built-in image_gen tool (not the CLI fallback).

- Source master: `garden/source/art/menu-night-surface-1.74.png`.
- Runtime derivative: `assets/echo-garden/menu-night-surface-1.74.webp`, WebP92.
- Only the lower surface is overlaid, feathering from61% to69% of cover height.
  The original upper hero, ship, horizon and original masters remain in place.
- Launch keeps its complete original geometric mask. An alpha-only SVG filter
  removes blue photographic overscan while keeping the original RGB of its gold
  and ivory; the original printed-ink layer remains above. No tighter tracing,
  gold clipping, blur or repainting of the buttons is used.
- This is a local preview asset, not a public release by itself.

### Final generation prompt

Use case: precise-object-edit. Asset type: portrait game background plate for EAR YOGA, same exact framing as input. Image1 is the clean background EDIT TARGET. Image2 is a supporting reference ONLY for the deep navy night texture and scattered tiny blue/cyan lights visible around and below its two large bottom buttons; DO NOT copy any buttons, text or UI from image2.

Change ONLY the lower planetary surface in image1, from around66% down through the bottom. Extend the planet's night side naturally downward from the existing illuminated curved horizon: dark sapphire cloud banks and subtle terrain filaments, fine crisp wisps, sparse tiny distant turquoise city or bioluminescent lights, and a few pinprick glimmers. Retain physical surface detail in the shadow instead of flat navy paint or haze. From74% down, its navy values and density should harmonize closely with image2's existing dark lower field, continuing that same dark star-speckled surface UPWARD behind where the controls will be. Very restrained small lights, not a bright city or a new focal object. The surface gradually becomes dark while cloud texture remains legible. No hard rectangular transition, no blur, no broad empty gradient, no added ornament.

INVARIANTS: preserve the upper62% completely, exactly the same original ship, lotus/orbits, golden fine lines, background planets, turquoise exhaust, starfield, and the original bright curved horizon at its current position/shape. Same tall863:1823 ratio and camera/crop. Preserve all original hero detail. No letters, logos, typography, controls, button contours, footer arcs, panels, moons or added large objects anywhere. Full opaque clean BACKGROUND artwork, not a mockup.

## Mode selection and English correction — 1.39

English mode sprites now use the same complete gold contour masks as Russian;
rectangular label windows are removed. Every mode has an opaque dark interior
with the original Russian ink above it, or live English text. Only the selected
mode runs visible pearl/water animations; hovering an unselected mode cannot
light it. Keyboard focus uses the gold contour rather than a rectangular outline.
English footer labels fit on one line. The duplicated upper Menu action is hidden
and its painted lettering is removed with a feathered mask into the clean plate;
Choose route still opens the same route/settings screen. No raster masters changed.

Focused Chromium checks cover RU/EN at iPad/phone viewport sizes, exterior pixels
during presses and deselection, keyboard focus and single-mode shine during hover.
PWA recovery/update behavior is checked independently; no physical Safari claim.

## Rim alignment and direct Settings — 1.40

The route-button ceramic surface and its pearl reflection now share a mask
aligned to the actual inner gold rim (775×124 reference coordinates, tips at
y=56). The old generic inset lens sat below that centre and overlapped the tip.
Material and reflection stay inside the rim even during a press. Mode buttons
have opaque pointed interiors and a fine inner gold stroke for clearer edges;
only the selected mode shimmers. Raster images and printed glyph shapes unchanged.

A balanced top-right Settings action aligns with the main wordmark and opens the
existing instrument/volume/EQ controls directly, with route selection hidden.
Closing restores the main screen and keyboard focus. Choose route retains the
route library. Focused RU/EN checks cover direct instrument/volume controls and
actual gold-tip pixels at reference scale, in addition to prior material checks.

## Reflection pacing — 1.41

At the user's request, all four reflective motions run 20% slower: pearl sweep
9.75s, rotating caustics 21.25s, water breath 7.5s and ceramic reflection 10s.
Phase offsets scale with the cycle. The 1.40 contour/settings corrections remain.

## Upward reflection trial — 1.42

The user requested a vertical-motion trial following the upward flight direction.
The pearl light sweeps and ceramic glints travel bottom to top; secondary caustic
detail and water drift use the vertical axis. The slower 1.41 cycle times remain.
Button geometry and lettering are unchanged. ?reflections=horizontal selects the
previous horizontal motion for comparison; removing the query selects upward.
The horizontal checkpoint is local f74088c / GitHub 42fc9de1fd77963530b35c63e333746118bf4f96.
