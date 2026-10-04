# Space Music College — mobile PWA 0.92

This publication uses the frozen, tested `dist-092` distribution from the
desktop 0.92 release. It does not include unfinished 0.93 changes.

The public entry point remains `/reharm-ear-trainer/game/`, with Echo Garden at
`/reharm-ear-trainer/game/garden-flight.html`. Install the main game entry point
from Safari using Add to Home Screen. The original Trainer and Lite URLs are
unchanged.

`game.bundle.js` and `garden-flight.bundle.js` are the release runtime. Some
development modules retained in this repository predate this frozen release;
do not rebuild the 0.92 publication from those modules. The copied distribution
modules and assets are kept alongside the frozen bundles for inspection.

Offline cache: `space-music-college-0.92-mobile1`. The parent Trainer cache is bumped
to `reharm-ear-trainer-v0.92-mobile1` so previously cached game entry points update.
The mobile adapter precaches the directory start URL and resolves versioned
asset URLs against this release's own cache, including on the first offline
visit to Echo Garden. Gameplay and visuals remain those of frozen 0.92.

The release includes the two canyon routes and their approved landscape
awakening images, new cast and album artifacts, Echo Garden arrangement
flowers (four arpeggios and three bass patterns, lasting 1–3 rounds), and
the nature rewards. Later musical-audit, compact-HUD, pause and artifact-art
corrections remain separate follow-up work, not claims about this release.

The reference PDFs, private plans, credentials, Mac binaries and ZIP archives
are not part of this publication. The 0.92 Mac package remains unchanged.
