// Small, licensed modal-audition sample banks. C4 is MIDI 60.
// Wurlitzer PCM is losslessly decoded from the pinned Greg Sullivan FLACs;
// organ WAVs are exact FreePats archive copies (sampled setBfree emulation).
// sourceLo/sourceHi preserve the original SFZ regions for provenance only.
// This reduced bank uses nearest-root playback; do not enforce those original
// ranges as runtime limits (the complete original SFZ has additional samples).
// tune is the original SFZ correction in cents; gainDb is SFZ region volume.
// Organ loop times are the source SFZ frame offsets divided by 44100.
// Attribution and full applicable license travel in samples/modal/.

export const GARDEN_MODAL_SAMPLE_BANKS = {
  "wurli": {
    "label": "Wurlitzer EP200",
    "author": "Greg Sullivan; SFZ mapping by kinwie",
    "source": "https://github.com/sfzinstruments/GregSullivan.E-Pianos/tree/8c3e581acda3594b553948ff0222d4f84a698376",
    "license": "CC BY 3.0 Unported",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "samples": [
      {
        "file": "modal/wurli-ab3mp.wav",
        "midi": 56,
        "layer": 0,
        "tune": -8,
        "gainDb": -5.3,
        "sourceLo": 54,
        "sourceHi": 59
      },
      {
        "file": "modal/wurli-db4mp.wav",
        "midi": 61,
        "layer": 0,
        "tune": 4,
        "gainDb": -5.3,
        "sourceLo": 60,
        "sourceHi": 62
      },
      {
        "file": "modal/wurli-gb4mp.wav",
        "midi": 66,
        "layer": 0,
        "tune": 7,
        "gainDb": -5.4,
        "sourceLo": 63,
        "sourceHi": 68
      },
      {
        "file": "modal/wurli-db5mp.wav",
        "midi": 73,
        "layer": 0,
        "tune": 3,
        "gainDb": -5.4,
        "sourceLo": 72,
        "sourceHi": 74
      },
      {
        "file": "modal/wurli-g5mp.wav",
        "midi": 79,
        "layer": 0,
        "tune": -8,
        "gainDb": -5.4,
        "sourceLo": 75,
        "sourceHi": 80
      },
      {
        "file": "modal/wurli-db6mp.wav",
        "midi": 85,
        "layer": 0,
        "tune": 6,
        "gainDb": -5.6,
        "sourceLo": 81,
        "sourceHi": 89
      },
      {
        "file": "modal/wurli-ab3f.wav",
        "midi": 56,
        "layer": 1,
        "tune": -11,
        "gainDb": -4.8,
        "sourceLo": 54,
        "sourceHi": 59
      },
      {
        "file": "modal/wurli-db4f.wav",
        "midi": 61,
        "layer": 1,
        "tune": -2,
        "gainDb": -4.8,
        "sourceLo": 60,
        "sourceHi": 65
      },
      {
        "file": "modal/wurli-ab4f.wav",
        "midi": 68,
        "layer": 1,
        "tune": 0,
        "gainDb": -5,
        "sourceLo": 66,
        "sourceHi": 71
      },
      {
        "file": "modal/wurli-db5f.wav",
        "midi": 73,
        "layer": 1,
        "tune": 3,
        "gainDb": -6,
        "sourceLo": 72,
        "sourceHi": 77
      },
      {
        "file": "modal/wurli-g5f.wav",
        "midi": 79,
        "layer": 1,
        "tune": -7,
        "gainDb": -5.9,
        "sourceLo": 78,
        "sourceHi": 80
      },
      {
        "file": "modal/wurli-db6f.wav",
        "midi": 85,
        "layer": 1,
        "tune": 0,
        "gainDb": -5.9,
        "sourceLo": 81,
        "sourceHi": 89
      }
    ]
  },
  "drawbar": {
    "label": "Drawbar organ · setBfree",
    "author": "Roberto / FreePats",
    "source": "https://freepats.zenvoid.org/Organ/electric-organ.html#DrawbarOrganEmulation",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "samples": [
      {
        "file": "modal/organ-c4.wav",
        "midi": 60,
        "layer": 0,
        "tune": 0,
        "gainDb": 0,
        "sourceLo": 58,
        "sourceHi": 61,
        "loopStart": 0.8799092970521541,
        "loopEnd": 4.221587301587301
      },
      {
        "file": "modal/organ-c5.wav",
        "midi": 72,
        "layer": 0,
        "tune": 0,
        "gainDb": 0,
        "sourceLo": 70,
        "sourceHi": 73,
        "loopStart": 1.1395238095238096,
        "loopEnd": 4.481428571428571
      },
      {
        "file": "modal/organ-c6.wav",
        "midi": 84,
        "layer": 0,
        "tune": 0,
        "gainDb": 0,
        "sourceLo": 82,
        "sourceHi": 85,
        "loopStart": 1.323514739229025,
        "loopEnd": 4.307278911564626
      }
    ]
  }
};
