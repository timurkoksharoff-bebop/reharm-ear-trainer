// Compact real Yamaha C5 grand recordings, independent of modal melody voices.
// Salamander v3 by Alexander Holm; Retuned SFZ by Markus Fiedler, remapped by kinwie.
// One fixed recorded dynamic (v10), not the complete 16-layer SFZ instrument.
// C4 is MIDI60. tune is the exact original Retuned region correction in cents.
// Original regions have no gain opcode and no pitch_keytrack override; gainDb=0.
// sourceLo/sourceHi are provenance, not limits for this nearest-root subset.
// Files are stereo PCM16/44.1kHz; capped tails fade only after 8.5/9.5s.
// Full provenance and licence: samples/grand/GRAND_PIANO_CREDITS.md.

export const GARDEN_GRAND_PIANO_BANK = {
  "label": "Grand Piano · Salamander Yamaha C5",
  "author": "Alexander Holm; retuned version by Markus Fiedler; SFZ reconstruction by kinwie",
  "source": "https://github.com/sfzinstruments/SalamanderGrandPiano/tree/3382bf9496bba2486f5ab0de55a264d1dfc38404",
  "license": "CC BY 3.0 Unported",
  "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
  "sourceCommit": "3382bf9496bba2486f5ab0de55a264d1dfc38404",
  "layer": "v10",
  "originalVelocity": [
    73,
    80
  ],
  "sampleRate": 44100,
  "channels": 2,
  "bits": 16,
  "samples": [
    {
      "file": "grand/salamander-a0-v10.wav",
      "midi": 21,
      "tune": 10,
      "gainDb": 0,
      "sourceFile": "A0v10.flac",
      "sourceLo": 21,
      "sourceHi": 22,
      "sourceSha256": "7c3435ed202c64eec040070286b1cfc298e2f701ad4d54c0556e00c1c4ee53b0",
      "sha256": "cb91a7ac964ab3403ca531b72fa1905bac078db6682a19a8de877a6fd96d0e82",
      "duration": 10.0,
      "frames": 441000
    },
    {
      "file": "grand/salamander-c1-v10.wav",
      "midi": 24,
      "tune": 13,
      "gainDb": 0,
      "sourceFile": "C1v10.flac",
      "sourceLo": 23,
      "sourceHi": 25,
      "sourceSha256": "e9bdda4a74f28a47f135cd5f0f7aaae7d78390b82a4642e5201423ae2dabbc21",
      "sha256": "fe07dd1cfa4865f5dd8083e33d0af5d544d6bdd9a1b46b26566aea20a9c4c450",
      "duration": 10.0,
      "frames": 441000
    },
    {
      "file": "grand/salamander-fs1-v10.wav",
      "midi": 30,
      "tune": -3,
      "gainDb": 0,
      "sourceFile": "F#1v10.flac",
      "sourceLo": 29,
      "sourceHi": 31,
      "sourceSha256": "0a841936d69a25eb65104163f0b8a9056d8892db32c5a2aca39acb18ae6899d0",
      "sha256": "58a48f4a666df72087e79c769141e97051b51ab5a56dc5501197ca8ac5f3e85c",
      "duration": 10.0,
      "frames": 441000
    },
    {
      "file": "grand/salamander-c2-v10.wav",
      "midi": 36,
      "tune": -9,
      "gainDb": 0,
      "sourceFile": "C2v10.flac",
      "sourceLo": 35,
      "sourceHi": 37,
      "sourceSha256": "0e55ec6b4046552b7f00b19fb38fbe8aaf02d50f7f4badf9e7eb008ad0843e18",
      "sha256": "365cf6c8e391b3a1510a156681afa70f4e3b539bb00c21a4c77a3f7e1f5a518a",
      "duration": 10.0,
      "frames": 441000
    },
    {
      "file": "grand/salamander-fs2-v10.wav",
      "midi": 42,
      "tune": -7,
      "gainDb": 0,
      "sourceFile": "F#2v10.flac",
      "sourceLo": 41,
      "sourceHi": 43,
      "sourceSha256": "db7c995bf388612d88de97c98183e71860a8c13fb46b02b8b3770fa1f0349ca9",
      "sha256": "2995fdd3fa34c1664a69637d19fcb80198861cddb9db9e666b50bb0d299fca4a",
      "duration": 10.0,
      "frames": 441000
    },
    {
      "file": "grand/salamander-c3-v10.wav",
      "midi": 48,
      "tune": 0,
      "gainDb": 0,
      "sourceFile": "C3v10.flac",
      "sourceLo": 47,
      "sourceHi": 49,
      "sourceSha256": "eb3ddb8e7df54f63d1f91c7fcc04c921623941d325df3ebeed291e1a6d82318c",
      "sha256": "2e3c6529c5672fad7f1e5828a7d44fcb8c80e35396b596f9d028f73eca8679fa",
      "duration": 10.0,
      "frames": 441000
    },
    {
      "file": "grand/salamander-fs3-v10.wav",
      "midi": 54,
      "tune": -3,
      "gainDb": 0,
      "sourceFile": "F#3v10.flac",
      "sourceLo": 53,
      "sourceHi": 55,
      "sourceSha256": "fb05b33c7e8bf85f2cac42f8c75ab1530754dc771f00f15f57a9d86c05cbd13f",
      "sha256": "54b8a5e890be31c44f17e9bb7d8fcbe65fcf1b790b9c7f00e8e7dfc10c2c125c",
      "duration": 10.0,
      "frames": 441000
    },
    {
      "file": "grand/salamander-c4-v10.wav",
      "midi": 60,
      "tune": -6,
      "gainDb": 0,
      "sourceFile": "C4v10.flac",
      "sourceLo": 59,
      "sourceHi": 61,
      "sourceSha256": "0e9d6e945df79113cd8bd9e841aed5d4537989704e993bfbed7fa8839724244a",
      "sha256": "52bcaaf3da21e6217dbfd5da85896685aea7e71e8cc39dcc74ac3ad8fc64ea43",
      "duration": 9.0,
      "frames": 396900
    },
    {
      "file": "grand/salamander-fs4-v10.wav",
      "midi": 66,
      "tune": 0,
      "gainDb": 0,
      "sourceFile": "F#4v10.flac",
      "sourceLo": 65,
      "sourceHi": 67,
      "sourceSha256": "a9912cc7b9cc3c6f4fae20eeb0d9570f21c164f9a69475dfdcd6f7290b159317",
      "sha256": "70406ba06418b45400dd464a211023a79e2adac96199825988fb8895ed3a5a74",
      "duration": 9.0,
      "frames": 396900
    },
    {
      "file": "grand/salamander-c5-v10.wav",
      "midi": 72,
      "tune": -8,
      "gainDb": 0,
      "sourceFile": "C5v10.flac",
      "sourceLo": 71,
      "sourceHi": 73,
      "sourceSha256": "89924ca36674fc1b3f7b99bf503be9f1644f093efa28cbbcedbc885866ec050e",
      "sha256": "2b4b7462bc7de60db92af9cf05ed22379797eccc25b839dfbfc1c1ff3f072f52",
      "duration": 9.0,
      "frames": 396900
    },
    {
      "file": "grand/salamander-fs5-v10.wav",
      "midi": 78,
      "tune": -5,
      "gainDb": 0,
      "sourceFile": "F#5v10.flac",
      "sourceLo": 77,
      "sourceHi": 79,
      "sourceSha256": "fc02895d148b1c591ac927248e0363c085a46a1ca79524ca67cbbcaab29462e3",
      "sha256": "c1ecbf13c4a77fbde922f419b9ba06b5af56beba5504431107e4817355a9be35",
      "duration": 9.0,
      "frames": 396900
    },
    {
      "file": "grand/salamander-c6-v10.wav",
      "midi": 84,
      "tune": -8,
      "gainDb": 0,
      "sourceFile": "C6v10.flac",
      "sourceLo": 83,
      "sourceHi": 85,
      "sourceSha256": "d675a759d036e83eb6727b0630ef99767a008d192952449772874d0756e61a96",
      "sha256": "f1f0d53926bc587d815da7109920899149ff2aedc2ffe69b95d240112a8f8d42",
      "duration": 6.06875283446712,
      "frames": 267632
    },
    {
      "file": "grand/salamander-fs6-v10.wav",
      "midi": 90,
      "tune": -13,
      "gainDb": 0,
      "sourceFile": "F#6v10.flac",
      "sourceLo": 89,
      "sourceHi": 91,
      "sourceSha256": "074eafc5b071e9cb32779d2ab710deac0b63851dc3455f7c4eb8452e0f2f6afd",
      "sha256": "4a271ae47b14ab589d3a205f5dc5f761548561c548490d647f98c85dc3763513",
      "duration": 6.1577551020408166,
      "frames": 271557
    },
    {
      "file": "grand/salamander-c7-v10.wav",
      "midi": 96,
      "tune": -17,
      "gainDb": 0,
      "sourceFile": "C7v10.flac",
      "sourceLo": 95,
      "sourceHi": 97,
      "sourceSha256": "1e2d3cc638f35982e895fb4c4f679c03d73533d1cba3cf33439cbf0b38250f11",
      "sha256": "1c4bb1850c999d1daa54c89d717b06433d29733df63f34d03180bf02517afcc9",
      "duration": 4.53469387755102,
      "frames": 199980
    },
    {
      "file": "grand/salamander-fs7-v10.wav",
      "midi": 102,
      "tune": -27,
      "gainDb": 0,
      "sourceFile": "F#7v10.flac",
      "sourceLo": 101,
      "sourceHi": 103,
      "sourceSha256": "ecd0bf9110491bfdd2ae7a1a101890b51d626f05898ea9780468c145d7f8be45",
      "sha256": "0700886dcbe7125d0be5291e2ff75a2efba716074619c877424d55f4be0515e6",
      "duration": 4.733696145124717,
      "frames": 208756
    },
    {
      "file": "grand/salamander-a7-v10.wav",
      "midi": 105,
      "tune": -38,
      "gainDb": 0,
      "sourceFile": "A7v10.flac",
      "sourceLo": 104,
      "sourceHi": 106,
      "sourceSha256": "4dbf1e500f9c0ea6e88992cdf475b901462adb27e3ed37299d89f128b8b52194",
      "sha256": "845cd62b947533721a1e025278c6e8bc5c0074c69fb792a58b2e7643c33fcd20",
      "duration": 3.862063492063492,
      "frames": 170317
    },
    {
      "file": "grand/salamander-c8-v10.wav",
      "midi": 108,
      "tune": -38,
      "gainDb": 0,
      "sourceFile": "C8v10.flac",
      "sourceLo": 107,
      "sourceHi": 108,
      "sourceSha256": "3907415dcf4efdbcc0c7b2ce1215a90a84dac9cd4b717f9b0f02609811a7c6e9",
      "sha256": "873899863826c010a4678647e7336ab2b4554d57cadaa64bebefe22e244595d3",
      "duration": 3.715487528344671,
      "frames": 163853
    }
  ]
};
