# EAR YOGA modal audition samples

These small banks supply optional modal melody voices. They do not replace the
game's main chord instruments. Source recordings and their licences remain
separate from the game's own code and artwork.

## Wurlitzer EP200

**Samples: Greg Sullivan. SFZ mapping and conversion: kinwie.**

Source: [Greg Sullivan's E-Pianos](https://github.com/sfzinstruments/GregSullivan.E-Pianos),
pinned at commit `8c3e581acda3594b553948ff0222d4f84a698376`.
The source identifies this instrument as Wurlitzer EP200 Electric Piano v1.1
(16 May 1999).

Licence: [Creative Commons Attribution 3.0 Unported](https://creativecommons.org/licenses/by/3.0/).
The complete original legal code is included as `GREG_SULLIVAN_CC_BY_3_0.txt`.
The repository's [README](https://github.com/sfzinstruments/GregSullivan.E-Pianos/blob/8c3e581acda3594b553948ff0222d4f84a698376/README.md)
and [LICENSE](https://github.com/sfzinstruments/GregSullivan.E-Pianos/blob/8c3e581acda3594b553948ff0222d4f84a698376/LICENSE)
provide the author and licence notice.

EAR YOGA preparation: selected 12 samples from the original mp and f layers;
decoded FLAC to mono 16-bit 44.1 kHz WAV with Apple's `afconvert`; renamed files
with the `wurli-` prefix. Decoded PCM was checked against each FLAC's original
STREAMINFO MD5 and is unchanged. No normalisation, trimming, denoising or new
effects were applied to these files. Original SFZ root pitches, tuning
corrections and relative region volumes are preserved in the bank data.

This is a compact subset, not the full original SFZ instrument. The player
transposes the nearest available root within each of the two layers.

## Drawbar organ emulation

**Samples and sound bank: Roberto / FreePats. Version 12 July 2019.**

Source: [FreePats electric organs](https://freepats.zenvoid.org/Organ/electric-organ.html#DrawbarOrganEmulation),
archive [DrawbarOrganEmulation-SFZ-20190712.tar.xz](https://freepats.zenvoid.org/Organ/DrawbarOrganEmulation/DrawbarOrganEmulation-SFZ-20190712.tar.xz).

Licence: [Creative Commons CC0 1.0 Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/).
The original attribution and licence notice is included unchanged as
`FREEPATS_ORGAN_README.txt`.

The samples were recorded from the **setBfree software synthesizer**, an
electromechanical organ emulation. They are not recordings of a hardware
Hammond organ. EAR YOGA uses three unmodified original WAV files (C4, C5, C6),
renamed with the `organ-` prefix, and the source SFZ loop points. The compact
bank uses nearest-root transposition rather than the complete source mapping.

## File verification

`SHA256SUMS.txt` identifies the exact 15 WAV files in this directory.
Total sample payload: **2,995,158 bytes**. All files are mono 16-bit PCM WAV,
44,100 samples per second. Runtime gain, envelopes, tuning and transposition
are applied by the player rather than destructively written into the samples.
