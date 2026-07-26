const CORE_EXERCISES = [
  makeExercise({
    id: "fig-1-6",
    chapter: 1,
    name: "Fig. 1.6 — basic model",
    source: "Chapter 1 · Fig. 1.6 · printed p. 9",
    baseTonic: 5,
    sequence: [
      chord("I6", 0, "6"),
      chord("VI−7", 9, "m7"),
      chord("IV", 5, "maj"),
      chord("I6", 0, "6"),
    ],
    distractors: [
      chord("III−7", 4, "m7"),
      chord("II−7", 2, "m7"),
      chord("V7sus4", 7, "7sus4"),
    ],
  }),
  makeExercise({
    id: "fig-1-7",
    chapter: 1,
    name: "Fig. 1.7 — simple substitution",
    source: "Chapter 1 · Fig. 1.7 · printed p. 9",
    baseTonic: 5,
    sequence: [
      chord("I6", 0, "6"),
      chord("III−7", 4, "m7"),
      chord("II−7", 2, "m7"),
      chord("I6", 0, "6"),
    ],
    distractors: [
      chord("VI−7", 9, "m7"),
      chord("IV", 5, "maj"),
      chord("V7sus4", 7, "7sus4"),
    ],
  }),
  makeExercise({
    id: "fig-1-8",
    chapter: 1,
    name: "Fig. 1.8 — another substitution",
    source: "Chapter 1 · Fig. 1.8 · printed p. 9",
    baseTonic: 5,
    sequence: [
      chord("I6", 0, "6"),
      chord("VI−7", 9, "m7"),
      chord("V7sus4", 7, "7sus4"),
      chord("VI−7", 9, "m7"),
    ],
    distractors: [
      chord("III−7", 4, "m7"),
      chord("II−7", 2, "m7"),
      chord("IV", 5, "maj"),
    ],
  }),
  makeExercise({
    id: "fig-1-9",
    chapter: 1,
    name: "Fig. 1.9 — minor II–V",
    source: "Chapter 1 · Fig. 1.9 · printed p. 10",
    baseTonic: 5,
    sequence: [
      chord("II−7(♭5)", 2, "m7b5"),
      chord("V7(♭9)", 7, "7b9"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
      chord("I6", 0, "6"),
    ],
  }),
  makeExercise({
    id: "fig-1-10a",
    chapter: 1,
    name: "Fig. 1.10 — variant with VII−7(♭5)",
    source: "Chapter 1 · Fig. 1.10 · printed p. 10",
    baseTonic: 5,
    sequence: [
      chord("II−7(♭5)", 2, "m7b5"),
      chord("VII−7(♭5)", 11, "m7b5"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("V7(♭9)", 7, "7b9"),
      chord("V7sus4", 7, "7sus4"),
      chord("III−7", 4, "m7"),
    ],
  }),
  makeExercise({
    id: "fig-1-10b",
    chapter: 1,
    name: "Fig. 1.10 — variant with V7sus4",
    source: "Chapter 1 · Fig. 1.10 · printed p. 10",
    baseTonic: 5,
    sequence: [
      chord("II−7(♭5)", 2, "m7b5"),
      chord("V7sus4", 7, "7sus4"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("V7(♭9)", 7, "7b9"),
      chord("VII−7(♭5)", 11, "m7b5"),
      chord("III−7", 4, "m7"),
    ],
  }),
  makeExercise({
    id: "fig-1-11",
    chapter: 1,
    name: "Fig. 1.11 — resolution to III−7",
    source: "Chapter 1 · Fig. 1.11 · printed p. 10",
    baseTonic: 5,
    sequence: [
      chord("II−7(♭5)", 2, "m7b5"),
      chord("V7(♭9)", 7, "7b9"),
      chord("III−7", 4, "m7"),
    ],
    distractors: [
      chord("IMaj7", 0, "maj7"),
      chord("VI−7", 9, "m7"),
      chord("V7sus4", 7, "7sus4"),
    ],
  }),
  makeExercise({
    id: "fig-1-15",
    chapter: 1,
    name: "Fig. 1.15 — slash bass in III−7",
    source: "Chapter 1 · Fig. 1.15 · printed p. 13",
    baseTonic: 5,
    sequence: [
      chord("I6", 0, "6"),
      chord("VI−7", 9, "m7"),
      chord("III−7/5", 4, "m7", null, 11),
      chord("IMaj7", 0, "maj7"),
      chord("IV", 5, "maj"),
      chord("I6", 0, "6"),
    ],
    distractors: [
      chord("III−7", 4, "m7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
    ],
  }),
  makeExercise({
    id: "fig-1-16",
    chapter: 1,
    name: "Fig. 1.16 — extended substitution",
    source: "Chapter 1 · Fig. 1.16 · printed p. 13",
    baseTonic: 5,
    sequence: [
      chord("I6", 0, "6"),
      chord("VI−7", 9, "m7"),
      chord("III−7/5", 4, "m7", null, 11),
      chord("IMaj7", 0, "maj7"),
      chord("IV", 5, "maj"),
      chord("II−7", 2, "m7"),
      chord("I6", 0, "6"),
    ],
    distractors: [
      chord("III−7", 4, "m7"),
      chord("V7", 7, "7"),
      chord("V7sus4", 7, "7sus4"),
    ],
  }),

  makeExercise({
    id: "fig-2-4",
    chapter: 2,
    name: "Fig. 2.4 — strong cadence",
    source: "Chapter 2 · Fig. 2.4 · printed p. 19",
    baseTonic: 0,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("VI−7", 9, "m7"),
      chord("IVMaj7", 5, "maj7"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("II−7", 2, "m7"),
      chord("IIIMaj7", 4, "maj7"),
      chord("V7", 7, "7"),
    ],
  }),
  makeExercise({
    id: "fig-2-5",
    chapter: 2,
    name: "Fig. 2.5 — weak cadence",
    source: "Chapter 2 · Fig. 2.5 · printed p. 20",
    baseTonic: 0,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("IVMaj7", 5, "maj7"),
      chord("VI−7", 9, "m7"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("III−7", 4, "m7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
    ],
  }),
  makeExercise({
    id: "fig-2-6",
    chapter: 2,
    name: "Fig. 2.6 — deceptive cadence",
    source: "Chapter 2 · Fig. 2.6 · printed p. 20",
    baseTonic: 0,
    sequence: [
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
      chord("♭VIMaj7", 8, "maj7", "flat"),
    ],
    distractors: [
      chord("IMaj7", 0, "maj7"),
      chord("VI−7", 9, "m7"),
      chord("♭VI7", 8, "7", "flat"),
    ],
  }),
  makeExercise({
    id: "fig-2-8",
    chapter: 2,
    name: "Fig. 2.8 — less active harmonic rhythm",
    source: "Chapter 2 · Fig. 2.8 · printed p. 21",
    baseTonic: 0,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("VII−7(♭5)", 11, "m7b5"),
      chord("IMaj7", 0, "maj7"),
      chord("II−7", 2, "m7"),
      chord("III−7", 4, "m7"),
      chord("VI−7", 9, "m7"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("IVMaj7", 5, "maj7"),
      chord("V7", 7, "7"),
      chord("♭VIIMaj7", 10, "maj7", "flat"),
    ],
  }),
  makeExercise({
    id: "fig-2-9",
    chapter: 2,
    name: "Fig. 2.9 — third in the top voice",
    source: "Chapter 2 · Fig. 2.9 · printed p. 21",
    baseTonic: 0,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("V7", 7, "7"),
      chord("VI−7", 9, "m7"),
      chord("VII−7(♭5)", 11, "m7b5"),
      chord("IMaj7", 0, "maj7"),
      chord("IVMaj7", 5, "maj7"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("II−7", 2, "m7"),
      chord("III−7", 4, "m7"),
      chord("♭VIIMaj7", 10, "maj7", "flat"),
    ],
  }),
  makeExercise({
    id: "fig-2-10",
    chapter: 2,
    name: "Fig. 2.10 — borrowed ♭VIIMaj7",
    source: "Chapter 2 · Fig. 2.10 · printed p. 22",
    baseTonic: 0,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("V7", 7, "7"),
      chord("VI−7", 9, "m7"),
      chord("♭VIIMaj7", 10, "maj7", "flat"),
      chord("IMaj7", 0, "maj7"),
      chord("IVMaj7", 5, "maj7"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("VII−7(♭5)", 11, "m7b5"),
      chord("II−7", 2, "m7"),
      chord("♭VII7", 10, "7", "flat"),
    ],
  }),
  makeExercise({
    id: "fig-2-11",
    chapter: 2,
    name: "Fig. 2.11 — fifth in the top voice",
    source: "Chapter 2 · Fig. 2.11 · printed p. 22",
    baseTonic: 0,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("III−7", 4, "m7"),
      chord("IVMaj7", 5, "maj7"),
      chord("V7", 7, "7"),
      chord("VI−7", 9, "m7"),
      chord("II−7", 2, "m7"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("VII−7(♭5)", 11, "m7b5"),
      chord("♭VIIMaj7", 10, "maj7", "flat"),
      chord("I6", 0, "6"),
    ],
  }),
  makeExercise({
    id: "fig-2-12a",
    chapter: 2,
    name: "Fig. 2.12 — variant with VII−7(♭5)",
    source: "Chapter 2 · Fig. 2.12 · printed p. 22",
    baseTonic: 0,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("II−7", 2, "m7"),
      chord("III−7", 4, "m7"),
      chord("IVMaj7", 5, "maj7"),
      chord("VII−7(♭5)", 11, "m7b5"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("V7", 7, "7"),
      chord("VI−7", 9, "m7"),
      chord("♭VIIMaj7", 10, "maj7", "flat"),
    ],
  }),
  makeExercise({
    id: "fig-2-12b",
    chapter: 2,
    name: "Fig. 2.12 — variant with ♭VIIMaj7",
    source: "Chapter 2 · Fig. 2.12 · printed p. 22",
    baseTonic: 0,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("II−7", 2, "m7"),
      chord("III−7", 4, "m7"),
      chord("IVMaj7", 5, "maj7"),
      chord("♭VIIMaj7", 10, "maj7", "flat"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("V7", 7, "7"),
      chord("VI−7", 9, "m7"),
      chord("VII−7(♭5)", 11, "m7b5"),
    ],
  }),

  makeExercise({
    id: "ch3-fifths-chain",
    chapter: 3,
    name: "Extended dominants — circle-of-fifths motion",
    source: "Chapter 3 · introduction · printed p. 28",
    baseTonic: 0,
    sequence: [
      chord("I7", 0, "7"),
      chord("IV7", 5, "7"),
      chord("♭VII7", 10, "7", "flat"),
      chord("♭III7", 3, "7", "flat"),
    ],
    distractors: [
      chord("V7", 7, "7"),
      chord("♭VI7", 8, "7", "flat"),
      chord("II7", 2, "7"),
    ],
  }),
  makeExercise({
    id: "ch3-chromatic-chain",
    chapter: 3,
    name: "Extended dominants — chromatic descent",
    source: "Chapter 3 · introduction · printed p. 28",
    baseTonic: 0,
    sequence: [
      chord("I7", 0, "7"),
      chord("VII7", 11, "7"),
      chord("♭VII7", 10, "7", "flat"),
      chord("VI7", 9, "7"),
      chord("♭VI7", 8, "7", "flat"),
    ],
    distractors: [
      chord("V7", 7, "7"),
      chord("♭V7", 6, "7", "flat"),
      chord("IV7", 5, "7"),
    ],
  }),
  makeExercise({
    id: "fig-3-2",
    chapter: 3,
    name: "Fig. 3.2 — complete extended-dominant chain",
    source: "Chapter 3 · Fig. 3.2 · printed p. 29",
    baseTonic: 3,
    sequence: [
      chord("#II7", 3, "7", "sharp"),
      chord("#V7", 8, "7", "sharp"),
      chord("#I7", 1, "7", "sharp"),
      chord("#IV7", 6, "7", "sharp"),
      chord("VII7", 11, "7"),
      chord("III7", 4, "7"),
      chord("VI7", 9, "7"),
      chord("II7", 2, "7"),
      chord("V7", 7, "7"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("IV7", 5, "7"),
      chord("♭VII7", 10, "7", "flat"),
    ],
  }),
  makeExercise({
    id: "fig-3-4",
    chapter: 3,
    name: "Fig. 3.4 — tritone substitutions",
    source: "Chapter 3 · Fig. 3.4 · printed p. 30",
    baseTonic: 3,
    sequence: [
      chord("VI7", 9, "7"),
      chord("II7sus4", 2, "7sus4"),
      chord("V7", 7, "7"),
      chord("#IV7sus4", 6, "7sus4", "sharp"),
      chord("IV7", 5, "7"),
      chord("III7", 4, "7"),
      chord("VI7", 9, "7"),
      chord("#V7", 8, "7", "sharp"),
      chord("V7", 7, "7"),
      chord("IMaj7", 0, "maj7"),
    ],
    distractors: [
      chord("II7", 2, "7"),
      chord("VII7", 11, "7"),
      chord("♭III7", 3, "7", "flat"),
    ],
  }),
  makeExercise({
    id: "fig-3-7",
    chapter: 3,
    name: "Fig. 3.7 — Georgia, corrected substitution",
    source: "Chapter 3 · Fig. 3.7 · printed p. 31",
    baseTonic: 5,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("VI7", 9, "7"),
      chord("#V7", 8, "7", "sharp"),
      chord("#I7", 1, "7", "sharp"),
      chord("#IV7", 6, "7", "sharp"),
      chord("IV7", 5, "7"),
      chord("III−7", 4, "m7"),
      chord("VI7", 9, "7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
    ],
    distractors: [
      chord("III7", 4, "7"),
      chord("♭VII7", 10, "7", "flat"),
      chord("I6", 0, "6"),
    ],
  }),
  makeExercise({
    id: "fig-3-16",
    chapter: 3,
    name: "Fig. 3.16 — extended dominants only",
    source: "Chapter 3 · Fig. 3.16 · printed p. 33",
    baseTonic: 5,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("VI7", 9, "7"),
      chord("#I7", 1, "7", "sharp"),
      chord("I7", 0, "7"),
      chord("VII7sus4", 11, "7sus4"),
      chord("III7", 4, "7"),
      chord("III−7", 4, "m7"),
      chord("VI7", 9, "7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
    ],
    distractors: [
      chord("♭VI7", 8, "7", "flat"),
      chord("IV7", 5, "7"),
      chord("VII7", 11, "7"),
    ],
  }),
  makeExercise({
    id: "fig-3-17",
    chapter: 3,
    name: "Fig. 3.17 — dominants and minor sevenths",
    source: "Chapter 3 · Fig. 3.17 · printed p. 33",
    baseTonic: 5,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("VI7", 9, "7"),
      chord("V−7", 7, "m7"),
      chord("I7", 0, "7"),
      chord("VII−7", 11, "m7"),
      chord("III7", 4, "7"),
      chord("III−7", 4, "m7"),
      chord("VI7", 9, "7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
    ],
    distractors: [
      chord("VII7sus4", 11, "7sus4"),
      chord("♭II7", 1, "7", "flat"),
      chord("IVMaj7", 5, "maj7"),
    ],
  }),

  makeExercise({
    id: "fig-4-1",
    chapter: 4,
    name: "Fig. 4.1 — Georgia, original form",
    source: "Chapter 4 · Fig. 4.1 · printed p. 37",
    baseTonic: 5,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("III7", 4, "7"),
      chord("VI−7", 9, "m7"),
      chord("IV−6", 5, "m6"),
      chord("IMaj7", 0, "maj7"),
      chord("VI7", 9, "7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
      chord("III−7", 4, "m7"),
      chord("VI7", 9, "7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
    ],
    distractors: [
      chord("IV6", 5, "6"),
      chord("III7sus4", 4, "7sus4"),
      chord("I6", 0, "6"),
    ],
  }),
  makeExercise({
    id: "fig-4-2",
    chapter: 4,
    name: "Fig. 4.2 — Georgia with displacement",
    source: "Chapter 4 · Fig. 4.2 · printed p. 37",
    baseTonic: 5,
    sequence: [
      chord("IMaj7", 0, "maj7"),
      chord("VII−7", 11, "m7"),
      chord("III7", 4, "7"),
      chord("VI−7", 9, "m7"),
      chord("IV6", 5, "6"),
      chord("IV−6", 5, "m6"),
      chord("IMaj7", 0, "maj7"),
      chord("VI7", 9, "7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
      chord("III−7", 4, "m7"),
      chord("VI7", 9, "7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
    ],
    distractors: [
      chord("VII−7(♭5)", 11, "m7b5"),
      chord("III7sus4", 4, "7sus4"),
      chord("I6", 0, "6"),
    ],
  }),
  makeExercise({
    id: "fig-4-3",
    chapter: 4,
    name: "Fig. 4.3 — My Ship, original form",
    source: "Chapter 4 · Fig. 4.3 · printed p. 38",
    baseTonic: 5,
    sequence: [
      chord("I6", 0, "6"),
      chord("VI7", 9, "7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
      chord("I6", 0, "6"),
    ],
    distractors: [
      chord("III−7", 4, "m7"),
      chord("III7", 4, "7"),
      chord("II7", 2, "7"),
    ],
  }),
  makeExercise({
    id: "fig-4-4",
    chapter: 4,
    name: "Fig. 4.4 — displaced dominants and related II−7",
    source: "Chapter 4 · Fig. 4.4 · printed p. 38",
    baseTonic: 5,
    sequence: [
      chord("I6", 0, "6"),
      chord("III−7", 4, "m7"),
      chord("VI7", 9, "7"),
      chord("VI−7", 9, "m7"),
      chord("II7", 2, "7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
      chord("I6", 0, "6"),
    ],
    distractors: [
      chord("III7", 4, "7"),
      chord("V7sus4", 7, "7sus4"),
      chord("IMaj7", 0, "maj7"),
    ],
  }),
  makeExercise({
    id: "fig-4-6",
    chapter: 4,
    name: "Fig. 4.6 — My Ship, clashes fixed",
    source: "Chapter 4 · Fig. 4.6 · printed p. 39",
    baseTonic: 5,
    sequence: [
      chord("I6", 0, "6"),
      chord("V7sus4", 7, "7sus4"),
      chord("#IV7", 6, "7", "sharp"),
      chord("VII7sus4", 11, "7sus4"),
      chord("III7", 4, "7"),
      chord("VI7", 9, "7"),
      chord("II7", 2, "7"),
      chord("V7", 7, "7"),
      chord("I6", 0, "6"),
    ],
    distractors: [
      chord("♭V7sus4", 6, "7sus4", "flat"),
      chord("VII7", 11, "7"),
      chord("II−7", 2, "m7"),
    ],
  }),
  makeExercise({
    id: "fig-4-7",
    chapter: 4,
    name: "Fig. 4.7 — tritone substitution for III7",
    source: "Chapter 4 · Fig. 4.7 · printed p. 39",
    baseTonic: 5,
    sequence: [
      chord("I6", 0, "6"),
      chord("V7sus4", 7, "7sus4"),
      chord("#IV7", 6, "7", "sharp"),
      chord("VII7sus4", 11, "7sus4"),
      chord("♭VII7", 10, "7", "flat"),
      chord("VI7", 9, "7"),
      chord("II7", 2, "7"),
      chord("V7", 7, "7"),
      chord("I6", 0, "6"),
    ],
    distractors: [
      chord("III7", 4, "7"),
      chord("VII7", 11, "7"),
      chord("II−7", 2, "m7"),
    ],
  }),
  makeExercise({
    id: "fig-4-8",
    chapter: 4,
    name: "Fig. 4.8 — two tritone substitutions",
    source: "Chapter 4 · Fig. 4.8 · printed p. 39",
    baseTonic: 5,
    sequence: [
      chord("I6", 0, "6"),
      chord("V7sus4", 7, "7sus4"),
      chord("I7", 0, "7"),
      chord("VII7sus4", 11, "7sus4"),
      chord("♭VII7", 10, "7", "flat"),
      chord("♭III7", 3, "7", "flat"),
      chord("II7", 2, "7"),
      chord("V7", 7, "7"),
      chord("I6", 0, "6"),
    ],
    distractors: [
      chord("♭V7", 6, "7", "flat"),
      chord("III7", 4, "7"),
      chord("VI7", 9, "7"),
    ],
  }),

  makeExercise({
    id: "exercise-5-1",
    chapter: 5,
    name: "Exercise 5.1 — original form",
    source: "Chapter 5 · Exercise 5.1 · printed p. 50",
    baseTonic: 3,
    sequence: [
      chord("V7", 7, "7"),
      chord("I6", 0, "6"),
      chord("VI−7", 9, "m7"),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
      chord("IMaj7", 0, "maj7"),
      chord("#I°7", 1, "dim7", "sharp"),
      chord("II−7", 2, "m7"),
    ],
  }),

  catalogExercise("fig-5-3", 5, "Fig. 5.3 — Never on Sunday, original form", 47, 0, [
    ["V7", 7, "7"],
    ["I6", 0, "6"],
    ["V7", 7, "7"],
  ]),
  catalogExercise("fig-5-4", 5, "Fig. 5.4 — modal interchange", 47, 0, [
    ["V7", 7, "7"],
    ["I6", 0, "6"],
    ["I−6", 0, "m6"],
    ["I6", 0, "6"],
    ["V7", 7, "7"],
  ]),
  catalogExercise("fig-5-5", 5, "Fig. 5.5 — MI chord as a link", 47, 0, [
    ["V7", 7, "7"],
    ["I6", 0, "6"],
    ["IV−6", 5, "m6"],
    ["V7", 7, "7"],
  ]),
  catalogExercise("fig-5-7", 5, "Fig. 5.7 — neighboring MI chords", 48, 0, [
    ["V7", 7, "7"],
    ["I", 0, "maj"],
    ["V7sus4", 7, "7sus4"],
    ["♭VIIMaj7", 10, "maj7", "flat"],
    ["VI−7", 9, "m7"],
    ["♭VIMaj7", 8, "maj7", "flat"],
    ["V7", 7, "7"],
    ["♭IIIMaj7", 3, "maj7", "flat"],
    ["♭VIMaj7", 8, "maj7", "flat"],
    ["I/5", 0, "maj", null, 7],
    ["IV−7", 5, "m7"],
    ["I/3", 0, "maj", null, 4],
    ["♭IIIMaj7", 3, "maj7", "flat"],
    ["♭IIMaj7", 1, "maj7", "flat"],
    ["I", 0, "maj"],
    ["IV/5", 5, "maj", null, 0],
    ["I", 0, "maj"],
    ["IV−7", 5, "m7"],
    ["♭VII7", 10, "7", "flat"],
    ["I", 0, "maj"],
  ]),
  catalogExercise("fig-5-8", 5, "Fig. 5.8 — Georgia, original form", 49, 5, [
    ["IMaj7", 0, "maj7"],
    ["V7/II", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["III−7", 4, "m7"],
    ["V7/II", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
  ]),
  catalogExercise("fig-5-9", 5, "Fig. 5.9 — Georgia with modal interchange", 49, 5, [
    ["IMaj7", 0, "maj7"],
    ["V7/II", 9, "7"],
    ["II−7", 2, "m7"],
    ["♭VIIMaj7", 10, "maj7", "flat"],
    ["III−7", 4, "m7"],
    ["♭IIIMaj7", 3, "maj7", "flat"],
    ["II−7", 2, "m7"],
    ["♭IIMaj7", 1, "maj7", "flat"],
  ]),
  catalogExercise("fig-5-10", 5, "Fig. 5.10 — several reharmonization techniques", 49, 5, [
    ["IMaj7", 0, "maj7"],
    ["SubV7/III", 5, "7"],
    ["III−7", 4, "m7"],
    ["SubV7/II", 3, "7", "flat"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["♭IIIMaj7", 3, "maj7", "flat"],
    ["♭VIMaj7", 8, "maj7", "flat"],
    ["♭IIMaj7", 1, "maj7", "flat"],
  ]),

  catalogExercise("fig-6-7", 6, "Fig. 6.7 — descending bass line", 56, 5, [
    ["IMaj7", 0, "maj7"],
    ["V7/3", 7, "7", null, 11],
    ["II−7/5", 2, "m7", null, 9],
    ["III−7/3", 4, "m7", null, 7],
    ["IVMaj7", 5, "maj7"],
    ["IVMaj7/7", 5, "maj7", null, 4],
    ["V−7/5", 7, "m7", null, 2],
    ["I7", 0, "7"],
    ["IVMaj7", 5, "maj7"],
    ["I6", 0, "6"],
  ]),
  catalogExercise("fig-6-9", 6, "Fig. 6.9 — Camptown Races, active bass line", 56, 5, [
    ["III−7", 4, "m7"],
    ["SubV7/II", 3, "7", "flat"],
    ["II−7", 2, "m7"],
    ["SubV7/I", 1, "7", "flat"],
    ["I7", 0, "7"],
    ["V7/3", 7, "7", null, 11],
    ["♭VII7", 10, "7", "flat"],
    ["V7/II", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["#IV−7(♭5)", 6, "m7b5", "sharp"],
    ["IV−6", 5, "m6"],
  ]),
  catalogExercise("fig-6-10a", 6, "Fig. 6.10 — bass-line variant A", 57, 5, [
    ["I/3", 0, "maj", null, 4],
    ["V7/5", 7, "7", null, 2],
    ["I", 0, "maj"],
    ["V7/3", 7, "7", null, 11],
    ["♭VII7", 10, "7", "flat"],
    ["II−7/5", 2, "m7", null, 9],
    ["V7", 7, "7"],
    ["#IV−7(♭5)", 6, "m7b5", "sharp"],
    ["IV−6", 5, "m6"],
  ]),
  catalogExercise("fig-6-10b", 6, "Fig. 6.10 — bass-line variant B", 57, 5, [
    ["V7/5", 7, "7", null, 2],
    ["IMaj7", 0, "maj7"],
    ["V7/3", 7, "7", null, 11],
    ["♭VII7", 10, "7", "flat"],
    ["V7/V/5", 2, "7", null, 9],
    ["V7", 7, "7"],
    ["#IV−7(♭5)", 6, "m7b5", "sharp"],
    ["IV−6", 5, "m6"],
  ]),
  catalogExercise("fig-6-11", 6, "Fig. 6.11 — Over the Rainbow", 57, 0, [
    ["I6", 0, "6"],
    ["♭VIIMaj7", 10, "maj7", "flat"],
    ["VI−7", 9, "m7"],
    ["SubV7/V", 8, "7", "flat"],
    ["III−7/3", 4, "m7", null, 7],
    ["#IV−7(♭5)", 6, "m7b5", "sharp"],
    ["IVMaj7", 5, "maj7"],
    ["SubV7/II", 3, "7", "flat"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["I6", 0, "6"],
  ]),

  catalogExercise("fig-7-4", 7, "Fig. 7.4 — appropriate jazz symbols", 66, 3, [
    ["IMaj7", 0, "maj7"],
    ["V−7/IV", 7, "m7"],
    ["V7/IV", 0, "7"],
    ["IVMaj7", 5, "maj7"],
  ]),
  catalogExercise("fig-7-10", 7, "Fig. 7.10 — consistent sharp-key spelling", 68, 11, [
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-7-15", 7, "Fig. 7.15 — clarified diminished function", 69, 0, [
    ["I6", 0, "6"],
    ["#I°7", 1, "dim7", "sharp"],
    ["II−7", 2, "m7"],
  ]),
  catalogExercise("fig-7-17", 7, "Fig. 7.17 — line cliché notation", 70, 0, [
    ["I", 0, "maj"],
    ["I+", 0, "aug"],
    ["I6", 0, "6"],
    ["#I°7", 1, "dim7", "sharp"],
    ["II−7", 2, "m7"],
  ]),

  catalogExercise("fig-8-6", 8, "Fig. 8.6 — typical turnaround", 74, 0, [
    ["V7", 7, "7"],
    ["III−7", 4, "m7"],
    ["VI7", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-11", 8, "Fig. 8.11 — turnaround example 1", 76, 0, [
    ["V7", 7, "7"],
    ["VI−7", 9, "m7"],
    ["V7/II", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-12", 8, "Fig. 8.12 — turnaround example 2", 76, 0, [
    ["V7", 7, "7"],
    ["III−7", 4, "m7"],
    ["VI7", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-13", 8, "Fig. 8.13 — turnaround example 3", 76, 0, [
    ["V7", 7, "7"],
    ["VI−7", 9, "m7"],
    ["SubV7/V", 8, "7", "flat"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-14", 8, "Fig. 8.14 — chromatic III substitution", 77, 0, [
    ["V7", 7, "7"],
    ["♭IIIMaj7", 3, "maj7", "flat"],
    ["♭VIMaj7", 8, "maj7", "flat"],
    ["♭IIMaj7", 1, "maj7", "flat"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-15", 8, "Fig. 8.15 — turnaround example 5", 77, 0, [
    ["V7", 7, "7"],
    ["♭IIMaj7", 1, "maj7", "flat"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-17", 8, "Fig. 8.17 — advanced turnaround 1", 78, 0, [
    ["V7", 7, "7"],
    ["III−7(♭5)", 4, "m7b5"],
    ["VI7(♭9)", 9, "7b9"],
    ["II−7", 2, "m7"],
    ["SubV7/I", 1, "7", "flat"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-18", 8, "Fig. 8.18 — advanced turnaround 2", 78, 0, [
    ["V7", 7, "7"],
    ["♭VIIMaj7", 10, "maj7", "flat"],
    ["♭IIIMaj7", 3, "maj7", "flat"],
    ["♭VIMaj7", 8, "maj7", "flat"],
    ["♭IIMaj7", 1, "maj7", "flat"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-19", 8, "Fig. 8.19 — advanced turnaround 3", 78, 0, [
    ["V7", 7, "7"],
    ["IVMaj7", 5, "maj7"],
    ["IV−7", 5, "m7"],
    ["♭VII7", 10, "7", "flat"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-22", 8, "Fig. 8.22 — turnaround variation 3", 79, 0, [
    ["V7", 7, "7"],
    ["III7", 4, "7"],
    ["VI7", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-23", 8, "Fig. 8.23 — turnaround variation 4", 79, 0, [
    ["V7", 7, "7"],
    ["VI7(♭9)", 9, "7b9"],
    ["SubV7/V", 8, "7", "flat"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-8-24", 8, "Fig. 8.24 — turnaround variation 5", 79, 0, [
    ["V7", 7, "7"],
    ["VI7(♭9)", 9, "7b9"],
    ["V7/V", 2, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),

  catalogExercise("fig-9-3", 9, "Fig. 9.3 — extended ending to a new key", 87, 5, [
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["♭IIIMaj7", 3, "maj7", "flat"],
    ["♭VIMaj7", 8, "maj7", "flat"],
    ["VMaj7", 7, "maj7"],
  ]),
  catalogExercise("fig-9-5", 9, "Fig. 9.5 — Misty, extended ending", 87, 3, [
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["VI−7", 9, "m7"],
    ["V7/V", 2, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-9-6", 9, "Fig. 9.6 — deceptive ending to a new key", 88, 3, [
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["VI−7", 9, "m7"],
    ["V7/V", 2, "7"],
    ["V−7", 7, "m7"],
    ["I7", 0, "7"],
    ["IVMaj7(#11)", 5, "maj7sharp11"],
  ]),
  catalogExercise("fig-9-7", 9, "Fig. 9.7 — extended ending in C", 88, 0, [
    ["IV−7", 5, "m7"],
    ["♭VII7", 10, "7", "flat"],
    ["IMaj7", 0, "maj7"],
    ["V7/II", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7sus4", 7, "7sus4"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-9-13", 9, "Fig. 9.13 — Misty, modulatory interlude", 90, 3, [
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["VI−7", 9, "m7"],
    ["SubV7/V", 8, "7", "flat"],
    ["V−7", 7, "m7"],
    ["I7", 0, "7"],
    ["#IV−7", 6, "m7", "sharp"],
    ["VII7", 11, "7"],
    ["VI−7", 9, "m7"],
    ["SubV7/V", 8, "7", "flat"],
    ["V−7", 7, "m7"],
    ["I7", 0, "7"],
    ["IVMaj7", 5, "maj7"],
  ]),

  catalogExercise("fig-10-3", 10, "Fig. 10.3 — voice-leading resolutions", 97, 0, [
    ["IMaj7", 0, "maj7"],
    ["#IV−7", 6, "m7", "sharp"],
    ["VII7", 11, "7"],
    ["III−7", 4, "m7"],
    ["VI7", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-10-7", 10, "Fig. 10.7 — voice leading with tensions", 98, 0, [
    ["IMaj7", 0, "maj7"],
    ["#IV−7(♭5)", 6, "m7b5", "sharp"],
    ["VII7(♭9,♭13)", 11, "7b9b13"],
    ["III−7", 4, "m7"],
    ["VI7", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-10-8", 10, "Fig. 10.8 — tensions between chord tones", 99, 0, [
    ["IMaj7", 0, "maj7"],
    ["#IV−7(♭5)", 6, "m7b5", "sharp"],
    ["VII7(♭9,♭13)", 11, "7b9b13"],
    ["III−7", 4, "m7"],
    ["VI7", 9, "7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-10-15", 10, "Fig. 10.15 — root position and third inversions", 101, 0, [
    ["IMaj7", 0, "maj7"],
    ["IMaj7/7", 0, "maj7", null, 11],
    ["IVMaj7/3", 5, "maj7", null, 9],
    ["IVMaj7", 5, "maj7"],
    ["IVMaj7/7", 5, "maj7", null, 4],
    ["♭VIIMaj7/3", 10, "maj7", "flat", 2],
  ]),

  catalogExercise("fig-11-5", 11, "Fig. 11.5 — chromatic line cliché", 106, 9, [
    ["I−", 0, "min"],
    ["I−/Maj7", 0, "min", null, 11],
    ["I−/♭7", 0, "min", null, 10],
    ["I−/6", 0, "min", null, 9],
  ]),
  catalogExercise("fig-11-7", 11, "Fig. 11.7 — Aeolian line cliché", 106, 9, [
    ["I−", 0, "min"],
    ["I−/♭7", 0, "min", null, 10],
    ["I−/♭6", 0, "min", null, 8],
    ["I−/5", 0, "min", null, 7],
  ]),
  catalogExercise("fig-11-12", 11, "Fig. 11.12 — line cliché added", 108, 10, [
    ["I−", 0, "min"],
    ["I−/Maj7", 0, "min", null, 11],
    ["I−/♭7", 0, "min", null, 10],
    ["I−/6", 0, "min", null, 9],
    ["I−7", 0, "m7"],
    ["I−6", 0, "m6"],
    ["I−7(♭5)", 0, "m7b5"],
    ["I−6", 0, "m6"],
  ]),
  catalogExercise("fig-11-17", 11, "Fig. 11.17 — simplified line cliché notation", 110, 10, [
    ["I", 0, "maj"],
    ["I7", 0, "7"],
    ["IVMaj7", 5, "maj7"],
    ["IV−7", 5, "m7"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["I", 0, "maj"],
  ]),

  catalogExercise("fig-12-2", 12, "Fig. 12.2 — typical diminished resolution", 113, 0, [
    ["IMaj7", 0, "maj7"],
    ["#I°7", 1, "dim7", "sharp"],
    ["II−7", 2, "m7"],
  ]),
  catalogExercise("fig-12-13a", 12, "Fig. 12.13 — diminished approach", 116, 0, [
    ["IMaj7", 0, "maj7"],
    ["#I°7", 1, "dim7", "sharp"],
    ["II−7", 2, "m7"],
  ]),
  catalogExercise("fig-12-13b", 12, "Fig. 12.13 — dominant substitute A7(♭9)", 116, 0, [
    ["IMaj7", 0, "maj7"],
    ["VI7(♭9)", 9, "7b9"],
    ["II−7", 2, "m7"],
  ]),
  catalogExercise("fig-12-13c", 12, "Fig. 12.13 — substitute ♭III7", 116, 0, [
    ["IMaj7", 0, "maj7"],
    ["♭III7", 3, "7", "flat"],
    ["II−7", 2, "m7"],
  ]),
  catalogExercise("fig-12-14", 12, "Fig. 12.14 — approach to III−7", 116, 0, [
    ["II−7", 2, "m7"],
    ["#II°7", 3, "dim7", "sharp"],
    ["III−7", 4, "m7"],
  ]),
  catalogExercise("fig-12-15", 12, "Fig. 12.15 — approach to V7", 116, 0, [
    ["IVMaj7", 5, "maj7"],
    ["#IV°7", 6, "dim7", "sharp"],
    ["V7", 7, "7"],
  ]),
  catalogExercise("fig-12-16", 12, "Fig. 12.16 — approach to VI−7", 116, 0, [
    ["V7", 7, "7"],
    ["#V°7", 8, "dim7", "sharp"],
    ["VI−7", 9, "m7"],
  ]),
  catalogExercise("fig-12-23", 12, "Fig. 12.23 — diminished chords replaced", 118, 0, [
    ["IMaj7", 0, "maj7"],
    ["♭III7(♭9)", 3, "7b9", "flat"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
    ["III−7", 4, "m7"],
    ["VII7(♭9)", 11, "7b9"],
    ["II−7", 2, "m7"],
    ["V7", 7, "7"],
  ]),

  catalogExercise("fig-13-6", 13, "Fig. 13.6 — Maiden Voyage, Dorian cadence", 125, 0, [
    ["I−7", 0, "m7"],
    ["II−7", 2, "m7"],
    ["♭VIIMaj7", 10, "maj7", "flat"],
    ["I−7", 0, "m7"],
    ["I−7", 0, "m7"],
    ["II−7", 2, "m7"],
    ["♭VIIMaj7", 10, "maj7", "flat"],
    ["I−7", 0, "m7"],
  ]),
  catalogExercise("fig-13-8", 13, "Fig. 13.8 — Dorian cadences with tonic pedal", 125, 7, [
    ["I−7", 0, "m7"],
    ["II−7", 2, "m7"],
    ["♭VIIMaj7", 10, "maj7", "flat"],
    ["I−7", 0, "m7"],
    ["I−7", 0, "m7"],
    ["II−7", 2, "m7"],
    ["♭VIIMaj7", 10, "maj7", "flat"],
    ["I−7", 0, "m7"],
  ]),
  catalogExercise("fig-13-11", 13, "Fig. 13.11 — The Duke, Dorian", 126, 2, [
    ["I−7", 0, "m7"],
    ["II−7", 2, "m7"],
    ["I−7", 0, "m7"],
    ["II−7", 2, "m7"],
  ]),
  catalogExercise("fig-13-15", 13, "Fig. 13.15 — Phrygian cadences", 127, 5, [
    ["I−7", 0, "m7"],
    ["♭II", 1, "maj", "flat"],
    ["♭VII", 10, "maj", "flat"],
    ["I−7", 0, "m7"],
    ["I−7", 0, "m7"],
    ["♭II", 1, "maj", "flat"],
    ["♭VII", 10, "maj", "flat"],
    ["I−7", 0, "m7"],
  ]),
  catalogExercise("fig-13-20", 13, "Fig. 13.20 — Aeolian cadences", 129, 0, [
    ["IV−7", 5, "m7"],
    ["I−7", 0, "m7"],
    ["IV−6", 5, "m6"],
    ["I−7", 0, "m7"],
    ["IV−7", 5, "m7"],
    ["I−7", 0, "m7"],
    ["♭VIMaj7", 8, "maj7", "flat"],
    ["I−7", 0, "m7"],
    ["♭VI", 8, "maj", "flat"],
    ["I−7", 0, "m7"],
  ]),
  catalogExercise("fig-13-28", 13, "Fig. 13.28 — Lydian cadences", 131, 0, [
    ["II", 2, "maj"],
    ["I", 0, "maj"],
    ["II", 2, "maj"],
    ["IMaj7", 0, "maj7"],
    ["II7", 2, "7"],
    ["IMaj7(#11)", 0, "maj7sharp11"],
    ["VII−", 11, "min"],
    ["IMaj7(#11)", 0, "maj7sharp11"],
    ["VII−7", 11, "m7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-13-35", 13, "Fig. 13.35 — Mixolydian cadences", 134, 0, [
    ["♭VII", 10, "maj", "flat"],
    ["I", 0, "maj"],
    ["V−", 7, "min"],
    ["I", 0, "maj"],
    ["♭VIIMaj7", 10, "maj7", "flat"],
    ["I7", 0, "7"],
    ["V−7", 7, "m7"],
    ["I7sus4", 0, "7sus4"],
  ]),
  catalogExercise("fig-13-44", 13, "Fig. 13.44 — modal cadences in several keys", 138, 0, [
    ["I−7", 0, "m7"],
    ["IV7", 5, "7"],
    ["♭VIMaj7", 8, "maj7", "flat"],
    ["♭VII7(♭9)", 10, "7b9", "flat"],
    ["I−7", 0, "m7"],
    ["IVMaj7", 5, "maj7"],
  ]),

  catalogExercise("fig-14-5", 14, "Fig. 14.5 — hybrid voicings", 147, 0, [
    ["IMaj7", 0, "maj7"],
    ["III−7/VI", 4, "m7", null, 9],
    ["I/II", 0, "maj", null, 2],
    ["IV/V", 5, "maj", null, 7],
    ["V/I", 7, "maj", null, 0],
  ]),
  catalogExercise("fig-14-7", 14, "Fig. 14.7 — The Girl from Ipanema, hybrids", 148, 0, [
    ["I/IV", 0, "maj", null, 5],
    ["IV/V", 5, "maj", null, 7],
    ["II−/V", 2, "min", null, 7],
    ["♭V/V", 6, "maj", "flat", 7],
    ["I/IV", 0, "maj", null, 5],
    ["♭VI/V", 8, "maj", "flat", 7],
  ]),
  catalogExercise("fig-14-9", 14, "Fig. 14.9 — Bossa Lo Nut, hybrid voicings", 148, 0, [
    ["I−/IV", 0, "min", null, 5],
    ["II−/V", 2, "min", null, 7],
    ["♭IIIMaj7/IV", 3, "maj7", "flat", 5],
    ["IVMaj/V", 5, "maj", null, 7],
  ]),

  catalogExercise("fig-15-1", 15, "Fig. 15.1 — constant major-seventh structure", 155, 0, [
    ["IMaj7", 0, "maj7"],
    ["♭IIIMaj7", 3, "maj7", "flat"],
    ["♭VMaj7", 6, "maj7", "flat"],
    ["♭IIIMaj7", 3, "maj7", "flat"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-15-2", 15, "Fig. 15.2 — tonal constant structure", 155, 0, [
    ["IMaj7", 0, "maj7"],
    ["♭IIIMaj7", 3, "maj7", "flat"],
    ["IVMaj7", 5, "maj7"],
    ["IMaj7", 0, "maj7"],
  ]),
  catalogExercise("fig-15-3", 15, "Fig. 15.3 — constant dominant-sus structure", 155, 0, [
    ["V7sus4", 7, "7sus4"],
    ["VI7sus4", 9, "7sus4"],
    ["♭VII7sus4", 10, "7sus4", "flat"],
    ["V7sus4", 7, "7sus4"],
  ]),
  catalogExercise("fig-15-4", 15, "Fig. 15.4 — constant minor-seventh structure", 156, 0, [
    ["II−7", 2, "m7"],
    ["♭III−7", 3, "m7", "flat"],
    ["III−7", 4, "m7"],
    ["♭III−7", 3, "m7", "flat"],
  ]),
  catalogExercise("fig-15-5", 15, "Fig. 15.5 — structured bass motion", 156, 0, [
    ["I7sus4", 0, "7sus4"],
    ["♭III7sus4", 3, "7sus4", "flat"],
    ["IV7sus4", 5, "7sus4"],
    ["♭III7sus4", 3, "7sus4", "flat"],
    ["II7sus4", 2, "7sus4"],
    ["IV7sus4", 5, "7sus4"],
    ["V7sus4", 7, "7sus4"],
    ["IV7sus4", 5, "7sus4"],
  ]),
  catalogExercise("fig-15-8", 15, "Fig. 15.8 — sus structure by thirds", 157, 9, [
    ["I7sus4", 0, "7sus4"],
    ["IV7sus4", 5, "7sus4"],
    ["V7sus4", 7, "7sus4"],
  ]),
  catalogExercise("fig-15-9", 15, "Fig. 15.9 — sus structure over diminished triad", 157, 2, [
    ["III7sus4", 4, "7sus4"],
    ["V7sus4", 7, "7sus4"],
    ["♭VII7sus4", 10, "7sus4", "flat"],
  ]),
  catalogExercise("fig-15-13", 15, "Fig. 15.13 — In Her Memory, constant structures", 158, 0, [
    ["V7sus4", 7, "7sus4"],
    ["IV7sus4", 5, "7sus4"],
    ["III7sus4", 4, "7sus4"],
    ["II7sus4", 2, "7sus4"],
    ["V7sus4", 7, "7sus4"],
    ["♭III7sus4", 3, "7sus4", "flat"],
    ["III7sus4", 4, "7sus4"],
    ["#IV7sus4", 6, "7sus4", "sharp"],
    ["V7sus4", 7, "7sus4"],
    ["VI7sus4", 9, "7sus4"],
    ["♭VIMaj7", 8, "maj7", "flat"],
  ]),

  catalogExercise("fig-16-2", 16, "Fig. 16.2 — Phrygian reharmonization", 163, 4, [
    ["I−7", 0, "m7"],
    ["♭IIMaj7", 1, "maj7", "flat"],
    ["I−7", 0, "m7"],
  ]),
  catalogExercise("fig-16-4", 16, "Fig. 16.4 — hybrid chords develop progression", 164, 4, [
    ["V−/I", 7, "min", null, 0],
    ["♭VI/♭II", 8, "maj", "flat", 1],
    ["V−/I", 7, "min", null, 0],
  ]),
  catalogExercise("fig-16-7", 16, "Fig. 16.7 — Aeolian progression", 165, 9, [
    ["I−7", 0, "m7"],
    ["♭VII", 10, "maj", "flat"],
    ["I−7", 0, "m7"],
    ["♭VII", 10, "maj", "flat"],
  ]),
  catalogExercise("fig-16-8", 16, "Fig. 16.8 — hybrid variation", 165, 9, [
    ["V−/I", 7, "min", null, 0],
    ["IV−/♭VII", 5, "min", null, 10],
    ["V−/I", 7, "min", null, 0],
    ["IV−/♭VII", 5, "min", null, 10],
  ]),
  catalogExercise("fig-16-9", 16, "Fig. 16.9 — hybrid chord variants", 165, 9, [
    ["♭VII/I", 10, "maj", "flat", 0],
    ["♭VI/♭VII", 8, "maj", "flat", 10],
    ["II−/I", 2, "min", null, 0],
    ["♭VI/♭VII", 8, "maj", "flat", 10],
  ]),
  catalogExercise("fig-16-10", 16, "Fig. 16.10 — constant structures from Aeolian roots", 166, 9, [
    ["I7sus4", 0, "7sus4"],
    ["♭VII7sus4", 10, "7sus4", "flat"],
    ["I7sus4", 0, "7sus4"],
    ["♭VII7sus4", 10, "7sus4", "flat"],
    ["I7", 0, "7"],
    ["♭VII7", 10, "7", "flat"],
    ["I7", 0, "7"],
    ["♭VII7", 10, "7", "flat"],
  ]),
];

const REFERENCE_ANSWER_SPECS = [
  ["1-1-r1", 1, "1.1", 172, 14, "C", "1", "E-7 F C A-7"],
  ["1-1-r2", 1, "1.1", 172, 14, "C", "2", "A-7 F E- A-7"],
  ["1-2-r1", 1, "1.2", 172, 15, "C", "1", "F6 G D- A- G"],
  ["1-2-r2", 1, "1.2", 172, 15, "C", "2", "F D- F G F C G"],
  ["1-3-r1", 1, "1.3", 172, 15, "C", "1", "D-7 D-7 G D-7 C A-7 G C"],
  ["1-3-r2", 1, "1.3", 172, 15, "C", "2", "F BbMaj7 G BbMaj7 A-7 G A-"],
  ["1-3-r3", 1, "1.3", 172, 15, "C", "3", "F BbMaj7 G BbMaj7 A-7 G A-"],
  ["1-4-r1", 1, "1.4", 172, 16, "C", "1", "CMaj7 A-7 CMaj7 A-7 D-7 A-7 G7sus4 G7"],
  ["1-4-r2", 1, "1.4", 172, 16, "C", "2", "E-7 CMaj7 A-7 E-7 FMaj7 D-7 BbMaj7 G7"],
  ["2-1-r1", 2, "2.1", 172, 26, "C", "1", "CMaj7 D-7 CMaj7 A-7 D-7 E-7 BbMaj7 CMaj7"],
  ["2-1-r2", 2, "2.1", 172, 26, "C", "2", "A-7 BbMaj7 CMaj7 A-7 D-7 CMaj7 BbMaj7 G7 CMaj7"],
  ["2-1-r3", 2, "2.1", 172, 26, "C", "3", "FMaj7 G7 CMaj7 A-7 BbMaj7 A-7 G7 CMaj7"],
  ["2-2-r1", 2, "2.2", 172, 27, "C", "1", "E-7 FMaj7 GMaj7 CMaj7 A-7 E-7 FMaj7 CMaj7"],
  ["2-2-r2", 2, "2.2", 172, 27, "C", "2", "CMaj7 D7sus4 GMaj7 CMaj7 A-7 F#-7(b5) G6 CMaj7"],
  ["2-2-r3", 2, "2.2", 172, 27, "C", "3", "GMaj7 A-7 E-7 A-7 CMaj7 D7 E-7 A-7"],
  ["2-2-r4", 2, "2.2", 172, 27, "C", "4", "D7 E-7 B-7 A-7 CMaj7 B-7 CMaj7 D7sus4"],
  ["3-1-r1", 3, "3.1", 173, 35, "C", "1", "A-7 D7 G-7 C7 B-7 E7 A-7 D7"],
  ["3-1-r2", 3, "3.1", 173, 35, "C", "2", "D-7 G7 C-7 B7sus4 Bb-7 A7 A-7 D7"],
  ["3-2-r1", 3, "3.2", 173, 35, "C", "1", "A-7 D7 G7 C7 FMaj7"],
  ["3-2-r2", 3, "3.2", 173, 35, "C", "2", "E-7 Eb7 A-7 D7 G-7 C7 FMaj7"],
  ["3-3-r1", 3, "3.3", 173, 36, "Eb", "1", "Eb7 Ab7 G7 C7 B7 F7 Bb7 EbMaj7"],
  ["3-3-r2", 3, "3.3", 173, 36, "Eb", "2", "Bb7 Eb-7 Ab7 G-7 Gb7 F-7 Bb7 EbMaj7"],
  ["3-4-r1", 3, "3.4", 173, 36, "Eb", "1", "C-7 F7sus4 Bb7 Eb7 AbMaj7"],
  ["3-4-r2", 3, "3.4", 173, 36, "Eb", "2", "C-7 F7sus4 Bb7 A7 AbMaj7"],
  ["4-1-r1", 4, "4.1", 173, 42, "G", "1", "G6 E-7 CMaj7 C-7 F7 B-7(b5) E7(b9) A-7 D7sus4 C#-7(b5) F#7(b9) B-7 E7 A-7 D7"],
  ["4-2-r1", 4, "4.2", 173, 43, "G", "1", "D7 G6 C-7 F7 E-7 A7 D-7 G7 C#-7(b5) F#7(b9) B-7(b5) E7(b9) A-7 D7"],
  ["4-2-r2", 4, "4.2", 173, 43, "G", "2", "D7sus4 E-7 A7 D-7 G7 F#-7(b5) F7 E-7 FMaj7 G6 B-7 E7 Bb-7 Eb7"],
  ["4-3-analysis", 4, "4.3", 173, 43, "C", "analysis", "C6 B7sus4 B7 C6 A7"],
  ["4-4-r1", 4, "4.4", 173, 44, "C", "1", "C6 G7 BbMaj7 C6 G7 BbMaj7 CMaj7 B7sus4 E-7 A-7 B7 C#7 C7 B7 C6 B7 E7 A7"],
  ["4-4-r2", 4, "4.4", 173, 44, "C", "2", "D7 G7 CMaj7 G7 F#7sus4 B7 CMaj7 FMaj7 G7 CMaj7 C7 B7 E7 E-7 A7"],
  ["5-1-r1", 5, "5.1", 174, 50, "Eb", "1", "Bb7 Eb6 C-7 F-7 Bb7 EbMaj7 Eo7 F-7"],
  ["5-1-r2", 5, "5.1", 174, 50, "Eb", "2", "Bb7 Eb6 CbMaj7 AbMaj7 Ab-7 EbMaj7 GbMaj7 F-7"],
  ["5-1-r3", 5, "5.1", 174, 50, "Eb", "3", "Bb7 DbMaj7 Eb6 C-7 D-7(b5) Db7 G-7 GbMaj7 EMaj7"],
  ["5-2-r1", 5, "5.2", 174, 51, "C", "1", "CMaj7 A-7 D-7 G7 CMaj7 CMaj7 G7 CMaj7 G7 CMaj7 C#o7 D-7 G7 C"],
  ["5-2-r2", 5, "5.2", 174, 51, "C", "2", "G7 A-7 AbMaj7 EbMaj7 D-7 Bb7 CMaj7 G-7 CMaj7 G7 AbMaj7 EbMaj7 D-7 G7 E-7 EbMaj7 D-7 G7 CMaj7"],
  ["5-2-r3", 5, "5.2", 174, 51, "C", "3", "BbMaj7 CMaj7 EbMaj7 D-7 DbMaj7 CMaj7 Bb7 CMaj7 Bb7 A-7 AbMaj7 G7sus4 G7 EbMaj7 DbMaj7 D-7 Bb7 CMaj7 C7sus4"],
  ["5-3-r1", 5, "5.3", 174, 52, "F", "1", "A-7 AbMaj7 G-7 FMaj7 DbMaj7 D-7 G7 G-7 C7sus4 Bb-7 Eb7 FMaj7 Ab7"],
  ["5-3-r2", 5, "5.3", 174, 52, "F", "2", "FMaj7 F-6 A-7 AbMaj7 G-7 Eb7 FMaj7 Bb-6 C7 A-7 EbMaj7 D7"],
  ["5-3-r3", 5, "5.3", 174, 52, "F", "3", "DbMaj7 Bb-6 FMaj7 F-6 EbMaj7 DbMaj7 EbMaj7 GbMaj7 G-7 A-7 D7"],
  ["6-1-r1", 6, "6.1", 175, 62, "C", "1", "FMaj7 FMaj7/E D-7 D-7/C B7 E-7 Bb7 A-7 G7 F-7"],
  ["6-1-r2", 6, "6.1", 175, 62, "C", "2", "E-7 A-7 AbMaj7 G7 FMaj7 FMaj7 E-7 FMaj7 Bb7"],
  ["6-1-r3", 6, "6.1", 175, 62, "C", "3", "A-7 A-7/G FMaj7 EbMaj7 G7/D CMaj7 B-7(b5) Bb7"],
  ["6-2-r1", 6, "6.2", 175, 63, "Db", "1", "Eb-7 Eb-7/Db CbMaj7 CbMaj7/Bb Ab7 DbMaj7 DbMaj7/C Bb-7 Db7/Ab GbMaj7"],
  ["6-2-r2", 6, "6.2", 175, 63, "Db", "2", "Ab7 Ab7/Gb F-7 Eb-7 DbMaj7 DbMaj7/C Bb-7 Ab7 Ab7/Gb DbMaj7/F Eb7"],
  ["6-2-r3", 6, "6.2", 175, 63, "Db", "3", "Ab7/Eb DbMaj7 C-7(b5) F7(b9) Bb-7 Cb7 DbMaj7 Ab7/Eb F-7"],
  ["6-3-r1", 6, "6.3", 176, 64, "C", "1", "F7 E-7(b5) Eb7 D-7(b5) G7 C-7 C-7/Bb Ab7 G-7 G-7/F"],
  ["6-3-r2", 6, "6.3", 176, 64, "C", "2", "Eb7 FMaj7 G-7 AbMaj7 BbMaj7 C-7 F7 D-7 D-7/C G7/B"],
  ["6-3-r3", 6, "6.3", 176, 64, "C", "3", "D-7 C7 C7/Bb A-7 A-7/G FMaj7 FMaj7/E EbMaj7 EbMaj7/D DbMaj7 D-7 D-7/C B-7(b5) BbMaj7"],
  ["7-1-a", 7, "7.1", 176, 71, "Eb", "line 1", "BbMaj7 EbMaj7 Eb+(Maj7) Eb D-7(b5) G7(b9) C-7 F7(b9)"],
  ["7-1-b", 7, "7.1", 176, 71, "Bb", "line 2", "BbMaj7 C7 A-7(b5) D7(b9) G-7"],
  ["7-1-c", 7, "7.1", 176, 71, "G", "line 3", "B-7 B-/A# B-/A B-/G# CMaj7 CMaj7/B A-7 D7 GMaj7"],
  ["7-2-analysis", 7, "7.2", 176, 72, "G", "analysis", "G- G-(#5) G-6 G-(#5) G- G-(#5) G-6 G-(#5) AbMaj7 AbMaj7/G F-7 Bb7 EbMaj7"],
  ["7-3-analysis", 7, "7.3", 177, 72, "Eb", "analysis", "F7(b13,b9) BbMaj7 F-7 Bb Bb7 Bb+(Maj7) EbMaj7 Bb6 Dbo7 C-7 F7 D-7(b5) G7"],
  ["8-1-t1", 8, "8.1", 177, 80, "F", "turnaround 1", "FMaj7 D-7 G-7 C7 A-7 D7 G-7 C7 FMaj7"],
  ["8-1-t2", 8, "8.1", 177, 80, "F", "turnaround 2", "FMaj7 D-7 G-7 C7 D-7 G7 G-7 C7 FMaj7"],
  ["8-2-t1", 8, "8.2", 177, 80, "C", "turnaround 1", "D-7 G7sus4 F#-7(b5) B7sus4 E-7 Eb7 D-7 G7 E-7 A7"],
  ["8-2-t2", 8, "8.2", 177, 80, "C", "turnaround 2", "D-7 G7sus4 F#-7(b5) FMaj7 E-7 A7 D-7 G7 E-7 A7"],
  ["8-3-t1", 8, "8.3", 177, 81, "Eb", "turnaround 1", "F-7 Bb7 G-7 C7 F-7 DbMaj7 Eb6 C-7"],
  ["8-3-t2", 8, "8.3", 177, 81, "Eb", "turnaround 2", "F-7 Bb7 CbMaj7 DbMaj7 Eb6 C-7"],
  ["8-4-t1", 8, "8.4", 177, 84, "C", "turnaround 1", "D-7 G7sus4 F#-7(b5) B7(b9) E-7 Eb7 DMaj7"],
  ["8-4-t2", 8, "8.4", 177, 84, "C", "turnaround 2", "D-7 G7sus4 EbMaj7 DbMaj7 Gb7 AbMaj7"],
  ["8-5-t1", 8, "8.5", 178, 85, "F", "turnaround 1", "FMaj7 D-7 G-7 C7 D-7 G7 F#-7 F7 BbMaj7"],
  ["8-5-t2", 8, "8.5", 178, 85, "F", "turnaround 2", "FMaj7 D-7 G-7 C7 BbMaj7 EbMaj7 AbMaj7 BbMaj7"],
  ["8-5-t3", 8, "8.5", 178, 85, "F", "turnaround 3", "FMaj7 D-7 G-7 C7 A-7 D7 D-7 G7 CMaj7"],
  ["8-5-t4", 8, "8.5", 178, 85, "G", "turnaround 4", "GMaj7 E-7 A-7 D7 B-7 E7 A-7 Ab7 DbMaj7"],
  ["9-1-e1", 9, "9.1", 178, 91, "F", "extended ending 1", "FMaj7 D-7 G-7 C7 A-7 AbMaj7 GbMaj7 F"],
  ["9-1-e2", 9, "9.1", 178, 91, "F", "extended ending 2", "FMaj7 D-7 G-7 C7 D-7 DbMaj7 C7sus4 Bb-7 Eb7 FMaj7"],
  ["9-2-e1", 9, "9.2", 178, 91, "F", "extended ending 1", "F-7 Bb7 A-7(b5) Ab7 G-7 C7alt FMaj7"],
  ["9-2-e2", 9, "9.2", 178, 91, "Ab", "extended ending 2", "F-7 Bb7 GbMaj7 AbMaj7 Bb-7 Eb7 AbMaj7"],
  ["9-3-e1", 9, "9.3", 179, 92, "G", "extended ending 1", "B-7 Bb7 A-7 G B-7 E7sus4 E7 A-7 Ab7 GMaj7"],
  ["9-3-e2", 9, "9.3", 179, 92, "G", "extended ending 2", "B-7 Bb7 A-7 G BbMaj7 EbMaj7 AbMaj7 G6"],
  ["9-4-e1", 9, "9.4", 179, 93, "C", "extended ending 1", "D-7(b5) G7 AbMaj7 BbMaj7 Eb C-7"],
  ["9-4-e2", 9, "9.4", 179, 93, "C", "extended ending 2", "D-7(b5) G7 DbMaj7 GbMaj7 AbMaj7 GMaj7"],
  ["9-5-answer", 9, "9.5", 179, 94, "C", "answer", "D-7(b5) G7 C-7 A-7(b5) Ab7 G-7 C7 F-7 E7 EbMaj7 A-7 D7 G-"],
  ["9-6-answer", 9, "9.6", 179, 94, "F", "answer", "FMaj7 D-7 G-7 C7 F6 AbMaj7 GbMaj7 G-7 C7 A-7 D7 G-7 C7 BbMaj7"],
  ["10-1-answer", 10, "10.1", 179, 102, "F", "answer", "F7 F7/Eb Bb/D Bb-/Db F/C D7/C G7/B C7/Bb F/A Ab7 C/G F#-7(b5) D-7/F G7 C"],
  ["10-2-answer", 10, "10.2", 179, 102, "F", "answer", "F7 F7/Eb Bb/D Bb-/Db F/C D7/C G7/B C7/Bb F/A Ab7 C/G F#-7(b5) D-7/F G7 C"],
  ["10-3-answer", 10, "10.3", 180, 103, "F", "answer", "FMaj7 G-7 C7 B-7(b5) E7(b9) A-7 AbMaj7 GbMaj7 G-7 C7 FMaj7 Bb-7 Eb7 D-7 G7 G-7 Gb7"],
  ["10-4-answer", 10, "10.4", 180, 103, "F", "answer", "FMaj7 G-7 C7 B-7(b5,9) E7(b9) A-7(9) AbMaj7 GbMaj7 G-7 C7 FMaj7 Bb-7 Eb7 D-7 G7 G-7 Gb7"],
  ["10-5-answer", 10, "10.5", 180, 104, "F", "answer", "FMaj7 G-7 C7 B-7(b5,9) E7(b9) A-7(9) AbMaj7 GbMaj7 G-7 C7 FMaj7 Bb-7 Eb7 D-7 G7 G-7 Gb7"],
  ["10-6-answer", 10, "10.6", 180, 104, "F", "answer", "FMaj7 G-7 C7 B-7(b5,9) E7(b9) A-7(9) AbMaj7 GbMaj7 G-7 C7 FMaj7 Bb-7 Eb7 D-7 G7 G-7 Gb7"],
  ["11-1-r1", 11, "11.1", 180, 111, "C", "1", "C- C-/B C-/Bb C-/Ab C- C-/B C-/Bb C-/A C- C-(#5) C-6 C-(#5) C- C-/B C-/Bb C-/A"],
  ["11-1-r2", 11, "11.1", 180, 111, "C", "2", "C- C-(#5) C-6 C-(#5) C- C-(#5) C-6 C-(#5)"],
  ["11-2-r1", 11, "11.2", 181, 112, "A", "1", "A- A-/G# A-/G A-/F# A- A-/G# A-/G A-/F A- A-(#5) A-6 A-(#5) A- A-/G# A-/G A-/F#"],
  ["11-2-r2", 11, "11.2", 181, 112, "A", "2", "A- A-/G# A-/G A-/F# A-/F E7(b9)"],
  ["12-1-answer", 12, "12.1", 181, 120, "E", "answer", "F#-7 B7 EMaj7 F#7 F#-7 F7 B-7 E7"],
  ["12-2-answer", 12, "12.2", 181, 120, "F", "answer", "FMaj7 D7 G-7 E7(b9) FMaj7/A C-7 F7"],
  ["12-3-answer", 12, "12.3", 181, 121, "G", "answer", "D7/A B-7(b5) E7(b9) G-7"],
  ["12-4-answer", 12, "12.4", 181, 121, "F", "answer", "Bb/D A7(b5) C-7 F7"],
  ["12-5-answer", 12, "12.5", 181, 121, "Eb", "answer", "D7 F7 Bb7 C7(b9) F-7 Bb7 EbMaj7"],
  ["12-6-answer", 12, "12.6", 182, 122, "Eb", "answer", "Bb7 EbMaj7 G7 AbMaj7 F7 Bb7 G7 C-7 F7"],
  ["12-7-answer", 12, "12.7", 182, 122, "C", "answer", "D-7(9) E-7(b5) A7(b9) C-7(b5)"],
  ["13-1-r1", 13, "13.1", 182, 141, "C", "1", "C-7 DbMaj7 C-7 DbMaj7 DbMaj7 Eb DbMaj7 C-7"],
  ["13-1-r2", 13, "13.1", 182, 141, "F", "2", "F-7 Bb7 F-7 EbMaj7 G-7 AbMaj7 G-7"],
  ["13-1-r3", 13, "13.1", 182, 141, "Ab", "3", "AbMaj7 G-7 AbMaj7 Bb AbMaj7 G-7 AbMaj7"],
  ["13-1-r4", 13, "13.1", 182, 141, "Bb", "4", "Bb7sus4 Ab Bb7sus4 Ab DbMaj7 Eb7 DbMaj7"],
  ["13-2-r1", 13, "13.2", 182, 142, "Bb", "1", "Bb- Eb Bb- Eb Db C- Db A B/A"],
  ["13-2-r2", 13, "13.2", 182, 142, "Db", "2", "DbMaj7 Eb Db Eb DbMaj7 Eb7 B- C#-"],
  ["13-2-r3", 13, "13.2", 182, 142, "F", "3", "F-7 GbMaj7 F- Eb7 F- Eb-7 F-7 GbMaj7 F-7 GbMaj7 GMaj7 AMaj7"],
  ["13-2-r4", 13, "13.2", 182, 142, "Ab", "4", "AbMaj7(#11) Bb/Ab Eb Bb-7 DbMaj7 Eb7 DbMaj7 Eb7 EMaj7 F#/E"],
  ["13-3-r1", 13, "13.3", 183, 144, "C", "1", "BbMaj7 C BbMaj7 C BbMaj7 C BbMaj7 C"],
  ["13-3-r2", 13, "13.3", 183, 144, "D", "2", "D-7 E-7 D-7 CMaj7 D-7"],
  ["13-3-r3", 13, "13.3", 183, 144, "A", "3", "FMaj7/A A- E-7/A A- A-7 G/F FMaj7(#11)"],
  ["13-3-r4", 13, "13.3", 183, 144, "G", "4", "G7sus4 F G7sus4 D-7 G7sus4"],
  ["14-1-r1", 14, "14.1", 183, 151, "C", "1", "C/D F/G Db/G G/C D-7/G"],
  ["14-1-r2", 14, "14.1", 183, 151, "C", "2", "B-/E G/A A-/D Ab/G C/D E-/A D-7/G"],
  ["14-1-r3", 14, "14.1", 183, 151, "C", "3", "A-7/D A-7/G F-/G G/C Eb/Ab"],
  ["14-2-r1", 14, "14.2", 183, 152, "Eb", "1", "Eb-/Ab F-/Bb A/D Bb/Eb"],
  ["14-2-r2", 14, "14.2", 183, 152, "Eb", "2", "Gb/Ab Ab/Bb A/D D-/Eb"],
  ["14-2-r3", 14, "14.2", 183, 152, "Eb", "3", "Bb-/Ab C-/Bb A/D F/Eb"],
  ["14-3-r1", 14, "14.3", 183, 153, "D", "1", "A-/D F/G A-/D F/G B-/E E-/A Ab/Db F-/Bb"],
  ["14-3-r2", 14, "14.3", 183, 153, "D", "2", "C/F D-/G C/D D-/G G/C A-/D Ab-/Db"],
  ["14-3-r3", 14, "14.3", 183, 153, "D", "3", "D-/G G/F D-/G B-/E C/F Db/Gb Ab/Db"],
  ["14-4-r1", 14, "14.4", 184, 154, "D", "1", "D-/G C-/F Eb/Ab Ab-/Db Ab-/Db Db-/Gb"],
  ["14-4-r2", 14, "14.4", 184, 154, "D", "2", "D-/G A-/D F-/Bb F#-/B Db/C Ab-/Db"],
  ["14-4-r3", 14, "14.4", 184, 154, "F", "3", "C-/F Bb/Eb F-/Bb Bb-/Eb Bb-/Eb F#-/E"],
  ["15-1-r1", 15, "15.1", 184, 159, "D", "1", "D7sus4 E7sus4 D7sus4"],
  ["15-1-r2", 15, "15.1", 184, 159, "D", "2", "A7sus4 G7sus4 D7sus4 A7sus4 G7sus4 A7sus4"],
  ["15-2-r1", 15, "15.2", 184, 160, "D", "1", "D-7 Eb-7 D-7 A-7 B-7 A-7 B-7 C-7"],
  ["15-2-r2", 15, "15.2", 184, 160, "G", "2", "GMaj7 EbMaj7 CMaj7 AbMaj7 FMaj7 GMaj7 EbMaj7 CMaj7 AbMaj7"],
  ["15-3-r1", 15, "15.3", 184, 161, "B", "1", "B7sus4 A7sus4 D7sus4"],
  ["15-3-r2", 15, "15.3", 184, 161, "D", "2", "D7sus4 E7sus4 A7sus4 B7sus4"],
  ["15-3-r3", 15, "15.3", 184, 161, "F#", "3", "F#-7 E-7 D-7 C#-7"],
  ["15-4-r1", 15, "15.4", 184, 162, "F", "1", "F7sus4 G7sus4 E7sus4 Eb7sus4 F7sus4"],
  ["15-4-r2", 15, "15.4", 184, 162, "Bb", "2", "Bb7sus4 Eb7sus4 F7sus4 D7sus4 Bb7sus4 D7sus4"],
  ["16-1-r1", 16, "16.1", 185, 170, "F", "1", "C-/F D-/G Eb/F F/G"],
  ["16-1-r2", 16, "16.1", 185, 170, "C", "2", "C-7 D-7 C-7 D-7"],
  ["16-1-r3", 16, "16.1", 185, 170, "F", "3", "C/F C/F Bb/Eb C/F Bb/Eb"],
  ["16-2-r1", 16, "16.2", 185, 171, "C", "1", "CMaj7 D B-7 CMaj7 D B-7"],
  ["16-2-r2", 16, "16.2", 185, 171, "E", "2", "E-7 FMaj7 E-7 FMaj7 D-/E C/F D-/E C/F"],
  ["16-2-r3", 16, "16.2", 185, 171, "F#", "3", "F#7sus4 A7sus4 C7sus4 Eb7sus4 F#7sus4 A7sus4 F#7sus4 C7sus4"],
  ["16-2-r4", 16, "16.2", 185, 171, "F#", "4", "E/F# G/A Bb/C Db/Eb E-/F# G/A E-/F# Db/Eb"],
];

const EXERCISES = [
  ...CORE_EXERCISES,
  ...REFERENCE_ANSWER_SPECS.map(referenceAnswerExercise),
];

const KEY_CHOICES = [
  { name: "C", tonic: 0, spelling: "sharp" },
  { name: "D♭", tonic: 1, spelling: "flat" },
  { name: "D", tonic: 2, spelling: "sharp" },
  { name: "E♭", tonic: 3, spelling: "flat" },
  { name: "F", tonic: 5, spelling: "flat" },
  { name: "G", tonic: 7, spelling: "sharp" },
  { name: "A♭", tonic: 8, spelling: "flat" },
  { name: "B♭", tonic: 10, spelling: "flat" },
];

const NOTE_NAMES = {
  sharp: ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"],
  flat: ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"],
};

const QUALITY = {
  maj: { suffix: "", intervals: [0, 4, 7] },
  min: { suffix: "−", intervals: [0, 3, 7] },
  aug: { suffix: "+", intervals: [0, 4, 8] },
  "6": { suffix: "6", intervals: [0, 4, 7, 9] },
  maj7: { suffix: "Maj7", intervals: [0, 4, 7, 11] },
  maj7sharp11: { suffix: "Maj7(#11)", intervals: [0, 4, 7, 11, 18] },
  m7: { suffix: "−7", intervals: [0, 3, 7, 10] },
  m7b5: { suffix: "−7(♭5)", intervals: [0, 3, 6, 10] },
  m7natural9: { suffix: "−7(9)", intervals: [0, 3, 7, 10, 14] },
  m7b5natural9: { suffix: "−7(♭5,9)", intervals: [0, 3, 6, 10, 14] },
  m6: { suffix: "−6", intervals: [0, 3, 7, 9] },
  "7": { suffix: "7", intervals: [0, 4, 7, 10] },
  "7b9": { suffix: "7(♭9)", intervals: [0, 4, 7, 10, 13] },
  "7b9b13": { suffix: "7(♭9,♭13)", intervals: [0, 4, 7, 10, 13, 20] },
  dim7: { suffix: "°7", intervals: [0, 3, 6, 9] },
  "7sus4": { suffix: "7sus4", intervals: [0, 5, 7, 10] },
  "7b5": { suffix: "7(♭5)", intervals: [0, 4, 6, 10] },
  "7sharp5": { suffix: "7(#5)", intervals: [0, 4, 8, 10] },
  "7alt": { suffix: "7alt", intervals: [0, 4, 6, 10, 13] },
  m7b9: { suffix: "−7(♭9)", intervals: [0, 3, 7, 10, 13] },
  minSharp5: { suffix: "−(#5)", intervals: [0, 3, 8] },
  augMaj7: { suffix: "+(Maj7)", intervals: [0, 4, 8, 11] },
};

const FAVORITES_STORAGE_KEY = "reharm-ear-favorites-v2";
const LEGACY_FAVORITES_STORAGE_KEY = "reharm-ear-favorites-v1";

const state = {
  exerciseIndex: 0,
  chapterFilter: "all",
  favorites: loadFavorites(),
  mode: "degree",
  sound: "piano",
  key: KEY_CHOICES[4],
  answers: [],
  wrongAnswers: [],
  completed: false,
  revealed: false,
  playing: false,
  playbackMode: null,
  playbackRange: null,
  activePosition: null,
  previewOptionIndex: null,
  lastKeyName: "",
  stats: loadStats(),
};

const ui = {
  chapterSelect: document.querySelector("#chapterSelect"),
  exerciseSelect: document.querySelector("#exerciseSelect"),
  tempoSelect: document.querySelector("#tempoSelect"),
  soundSelect: document.querySelector("#soundSelect"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsPanel: document.querySelector("#settingsPanel"),
  settingsScrim: document.querySelector("#settingsScrim"),
  settingsCloseButton: document.querySelector("#settingsCloseButton"),
  sourceLabel: document.querySelector("#sourceLabel"),
  promptLabel: document.querySelector("#promptLabel"),
  chapterLabel: document.querySelector("#chapterLabel"),
  keyBadge: document.querySelector("#keyBadge"),
  favoriteButton: document.querySelector("#favoriteButton"),
  matrixScroll: document.querySelector("#matrixScroll"),
  positionLegend: document.querySelector("#positionLegend"),
  answerGrid: document.querySelector("#answerGrid"),
  feedback: document.querySelector("#feedback"),
  playbackControls: document.querySelector("#playbackControls"),
  playButton: document.querySelector("#playButton"),
  segmentPlayback: document.querySelector("#segmentPlayback"),
  segmentPlayButtons: [...document.querySelectorAll("[data-play-segment]")],
  showButton: document.querySelector("#showButton"),
  reviewButton: document.querySelector("#reviewButton"),
  nextButton: document.querySelector("#nextButton"),
  resetStatsButton: document.querySelector("#resetStatsButton"),
  pianoKeyboard: document.querySelector("#pianoKeyboard"),
  pianoStopButton: document.querySelector("#pianoStopButton"),
  completedStat: document.querySelector("#completedStat"),
  accuracyStat: document.querySelector("#accuracyStat"),
  streakStat: document.querySelector("#streakStat"),
  revealedStat: document.querySelector("#revealedStat"),
  modeButtons: [...document.querySelectorAll("[data-mode]")],
  voicingPopover: document.querySelector("#voicingPopover"),
  voicingTitle: document.querySelector("#voicingTitle"),
  voicingStaff: document.querySelector("#voicingStaff"),
  voicingNotes: document.querySelector("#voicingNotes"),
  voicingMeta: document.querySelector("#voicingMeta"),
  voicingCloseButton: document.querySelector("#voicingCloseButton"),
};

let audioContext = null;
let audioContextIdleTimer = null;
let audioContextLastUsedAt = 0;
let stopTimer = null;
let previewTimer = null;
let autoNextTimer = null;
let highlightTimers = [];
let pianoAudioContext = null;
let pianoAudioContextLastUsedAt = 0;
let pianoIdleTimer = null;
let mobileAudioElement = null;
let mobileAudioUnlocked = false;
let pianoSamplePromise = null;
let electricPianoSamplePromise = null;
let uprightBassSamplePromise = null;
const pianoSampleBuffers = new Map();
const electricPianoSampleBuffers = new Map();
const uprightBassSampleBuffers = new Map();
const pianoVoices = new Set();
const pianoKeyTimers = new Map();
const chapterQueues = new Map();
let voicingPopoverAnchor = null;
const PIANO_SUSTAIN_RATIO = 1.1;
const PIANO_LEGATO_SUSTAIN_RATIO = 1.35;
const PIANO_RELEASE_SECONDS = 0.7;
const PIANO_LEGATO_RELEASE_SECONDS = 1.1;
const ELECTRIC_PIANO_RELEASE_SECONDS = 0.85;
const ELECTRIC_PIANO_OUTPUT_GAIN = 0.8;
const UPRIGHT_BASS_OUTPUT_GAIN = 0.82;
const UPRIGHT_BASS_MAX_DURATION_SECONDS = 1.05;
const UPRIGHT_BASS_FILTER_HZ = 2600;
const AUDIO_HARDWARE_IDLE_THRESHOLD_MS = 6000;
const AUDIO_HARDWARE_WARMUP_MS = 110;
const AUDIO_CONTEXT_IDLE_CLOSE_MS = 120000;
const SEGMENTED_PLAYBACK_MIN_LENGTH = 8;
const PIANO_SAMPLE_MANIFEST = [
  [36, "C2"],
  [39, "Ds2"],
  [42, "Fs2"],
  [45, "A2"],
  [48, "C3"],
  [51, "Ds3"],
  [54, "Fs3"],
  [57, "A3"],
  [60, "C4"],
  [63, "Ds4"],
  [66, "Fs4"],
  [69, "A4"],
  [72, "C5"],
  [75, "Ds5"],
  [78, "Fs5"],
  [84, "C6"],
  [87, "Ds6"],
  [90, "Fs6"],
].map(([midi, name]) => ({
  midi,
  url: `samples/piano/${name}.mp3`,
}));
const ELECTRIC_PIANO_SAMPLE_MANIFEST = [
  [36, "c2f", -7],
  [41, "f2f", -6],
  [47, "b2f", -8],
  [52, "e3f", -4],
  [56, "ab3f", -11],
  [61, "db4f", -2],
  [68, "ab4f", 0],
  [73, "db5f", 3],
  [79, "g5f", -7],
  [85, "db6f", 0],
  [92, "ab6f", 0],
].map(([midi, name, tuneCents]) => ({
  midi,
  tuneCents,
  url: `samples/electric-piano/${name}.m4a`,
}));
const UPRIGHT_BASS_SAMPLE_MANIFEST = [
  [36, "c2"],
  [40, "e2"],
  [44, "gs2"],
  [49, "cs3"],
].map(([midi, name]) => ({
  midi,
  url: `samples/upright-bass/${name}.m4a`,
}));

function chord(degree, offset, quality, spelling = null, bassOffset = null) {
  return { degree, offset, quality, spelling, bassOffset };
}

function isPianoSound(sound = state.sound) {
  return sound === "piano"
    || sound === "piano-legato"
    || sound === "piano-upright"
    || sound === "bass";
}

function isPianoLegato(sound = state.sound) {
  return sound === "piano-legato";
}

function isElectricPianoSound(sound = state.sound) {
  return sound === "electric-piano";
}

function isUprightBassSound(sound = state.sound) {
  return sound === "piano-upright";
}

function isSampledKeyboardSound(sound = state.sound) {
  return isPianoSound(sound) || isElectricPianoSound(sound);
}

function isBassSound(sound = state.sound) {
  return sound === "bass";
}

function soundName(sound = state.sound) {
  if (sound === "piano-legato") return "Piano legato";
  if (sound === "piano-upright") return "Piano + upright bass";
  if (sound === "piano") return "Piano";
  if (sound === "electric-piano") return "Electric piano";
  if (sound === "bass") return "Bass";
  return "Organ";
}

function pianoReleaseSeconds(sound = state.sound) {
  return isPianoLegato(sound)
    ? PIANO_LEGATO_RELEASE_SECONDS
    : PIANO_RELEASE_SECONDS;
}

function keyboardReleaseSeconds(sound = state.sound) {
  return isElectricPianoSound(sound)
    ? ELECTRIC_PIANO_RELEASE_SECONDS
    : pianoReleaseSeconds(sound);
}

function referenceAnswerExercise(spec) {
  const [
    id,
    chapter,
    exercise,
    answerPage,
    exercisePage,
    tonicName,
    variant,
    symbolSequence,
  ] = spec;
  const sequence = symbolSequence.trim().split(/\s+/).map((symbol) => (
    referenceChord(symbol, tonicName)
  ));
  const answerName = variant === "answer"
    ? "reference answer"
    : `reference answer ${variant}`;
  const answerSource = variant === "answer"
    ? "answer"
    : `answer ${variant}`;
  return makeExercise({
    id: `answer-${id}`,
    chapter,
    name: `Exercise ${exercise} — ${answerName}`,
    source: (
      `Chapter ${chapter} · Exercise ${exercise} · `
      + `${answerSource} · printed p. ${answerPage} `
      + `(exercise: p. ${exercisePage})`
    ),
    baseTonic: notePitchClass(tonicName),
    sequence,
    distractors: [
      referenceChord(tonicName, tonicName),
      chord("II−7", 2, "m7"),
      chord("V7", 7, "7"),
      chord("♭VIIMaj7", 10, "maj7", "flat"),
    ],
  });
}

function referenceChord(symbol, tonicName) {
  const [upperSymbol, bassSymbol = null] = symbol.split("/");
  const match = upperSymbol.match(/^([A-G](?:b|#)?)(.*)$/);
  if (!match) throw new Error(`Unsupported reference chord: ${symbol}`);
  const [, rootName, suffix] = match;
  const qualityBySuffix = {
    "": "maj",
    "-": "min",
    "6": "6",
    "Maj7": "maj7",
    "Maj7(#11)": "maj7sharp11",
    "-7": "m7",
    "-7(b5)": "m7b5",
    "-7(9)": "m7natural9",
    "-7(b5,9)": "m7b5natural9",
    "-6": "m6",
    "7": "7",
    "7(b9)": "7b9",
    "7(b9,b13)": "7b9b13",
    "7(b13,b9)": "7b9b13",
    "7(b5)": "7b5",
    "7(#5)": "7sharp5",
    "7alt": "7alt",
    "-7(b9)": "m7b9",
    "-(#5)": "minSharp5",
    "+(Maj7)": "augMaj7",
    "7sus4": "7sus4",
    "o7": "dim7",
  };
  const quality = qualityBySuffix[suffix];
  if (!quality) throw new Error(`Unsupported reference chord quality: ${symbol}`);
  const tonic = notePitchClass(tonicName);
  const root = notePitchClass(rootName);
  const offset = (root - tonic + 12) % 12;
  const bassOffset = bassSymbol
    ? (notePitchClass(bassSymbol) - tonic + 12) % 12
    : null;
  const spelling = rootName.includes("b")
    ? "flat"
    : (rootName.includes("#") ? "sharp" : null);
  const degree = referenceDegreeLabel(offset, quality, spelling, bassOffset);
  return chord(degree, offset, quality, spelling, bassOffset);
}

function notePitchClass(noteName) {
  const match = noteName.match(/^([A-G])([b#]?)$/);
  if (!match) throw new Error(`Unsupported note name: ${noteName}`);
  const naturals = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const accidental = match[2] === "b" ? -1 : (match[2] === "#" ? 1 : 0);
  return (naturals[match[1]] + accidental + 12) % 12;
}

function referenceDegreeLabel(offset, quality, spelling, bassOffset) {
  const sharpDegrees = ["I", "#I", "II", "#II", "III", "IV", "#IV", "V", "#V", "VI", "#VI", "VII"];
  const flatDegrees = ["I", "♭II", "II", "♭III", "III", "IV", "♭V", "V", "♭VI", "VI", "♭VII", "VII"];
  const degrees = spelling === "sharp" ? sharpDegrees : flatDegrees;
  const suffixes = {
    maj: "",
    min: "−",
    "6": "6",
    maj7: "Maj7",
    maj7sharp11: "Maj7(#11)",
    m7: "−7",
    m7b5: "−7(♭5)",
    m7natural9: "−7(9)",
    m7b5natural9: "−7(♭5,9)",
    m6: "−6",
    "7": "7",
    "7b9": "7(♭9)",
    "7b9b13": "7(♭9,♭13)",
    "7b5": "7(♭5)",
    "7sharp5": "7(#5)",
    "7alt": "7alt",
    m7b9: "−7(♭9)",
    minSharp5: "−(#5)",
    augMaj7: "+(Maj7)",
    "7sus4": "7sus4",
    dim7: "°7",
  };
  const bass = bassOffset === null ? "" : `/${degrees[bassOffset]}`;
  return `${degrees[offset]}${suffixes[quality]}${bass}`;
}

function makeExercise({ distractors = [], sequence, ...metadata }) {
  return {
    ...metadata,
    sequence,
    options: buildOptions(sequence, distractors),
  };
}

function catalogExercise(id, chapter, name, page, baseTonic, rawSequence) {
  const distractors = [
    chord("IMaj7", 0, "maj7"),
    chord("II−7", 2, "m7"),
    chord("V7", 7, "7"),
    chord("♭VIIMaj7", 10, "maj7", "flat"),
    chord("#I°7", 1, "dim7", "sharp"),
  ];
  return makeExercise({
    id,
    chapter,
    name,
    source: `Chapter ${chapter} · ${name.split(" — ")[0]} · printed p. ${page}`,
    baseTonic,
    sequence: rawSequence.map((item) => chord(...item)),
    distractors,
  });
}

function buildOptions(sequence, distractors) {
  const unique = new Map();
  [...sequence, ...distractors].forEach((item) => {
    const key = [
      item.offset,
      item.quality,
      item.bassOffset ?? "",
    ].join(":");
    if (!unique.has(key)) unique.set(key, item);
  });
  return [...unique.values()].sort((left, right) => (
    left.offset - right.offset
    || left.quality.localeCompare(right.quality)
    || (left.bassOffset ?? -1) - (right.bassOffset ?? -1)
  ));
}

function currentExercise() {
  return EXERCISES[state.exerciseIndex];
}

function setSettingsOpen(open) {
  ui.settingsPanel.hidden = !open;
  ui.settingsScrim.hidden = !open;
  ui.settingsButton.setAttribute("aria-expanded", String(open));
  ui.settingsButton.setAttribute("aria-label", open ? "Close settings" : "Open settings");
  document.body.classList.toggle("settings-open", open);
  if (open) ui.settingsCloseButton.focus?.();
}

function init() {
  configurePlaybackAudioSession();
  document.addEventListener("pointerdown", () => {
    requestPortraitOrientation();
    unlockMobileAudio();
  }, { once: true, capture: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    requestPortraitOrientation();
    configurePlaybackAudioSession();
    resumeAudioAfterInterruption();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !ui.voicingPopover.hidden) {
      closeVoicingPopover(true);
      return;
    }
    if (event.key === "Escape" && !ui.settingsPanel.hidden) {
      setSettingsOpen(false);
      ui.settingsButton.focus?.();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (ui.voicingPopover.hidden) return;
    if (
      ui.voicingPopover.contains?.(event.target)
      || voicingPopoverAnchor?.contains?.(event.target)
    ) return;
    closeVoicingPopover(false);
  });
  ui.voicingCloseButton.addEventListener("click", () => closeVoicingPopover(true));
  closeVoicingPopover(false);
  ui.settingsButton.addEventListener("click", () => {
    setSettingsOpen(ui.settingsPanel.hidden);
  });
  ui.settingsCloseButton.addEventListener("click", () => setSettingsOpen(false));
  ui.settingsScrim.addEventListener("click", () => setSettingsOpen(false));
  setSettingsOpen(false);

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All chapters · shuffle";
  ui.chapterSelect.append(allOption);

  const favoritesOption = document.createElement("option");
  favoritesOption.value = "favorites";
  ui.chapterSelect.append(favoritesOption);
  updateFavoriteChapterOption();

  [...new Set(EXERCISES.map((exercise) => exercise.chapter))]
    .sort((left, right) => left - right)
    .forEach((chapter) => {
      const option = document.createElement("option");
      option.value = String(chapter);
      option.textContent = `Chapter ${chapter}`;
      ui.chapterSelect.append(option);
    });

  ui.chapterSelect.value = state.chapterFilter;
  state.exerciseIndex = nextRandomIndex(
    state.chapterFilter,
    eligibleExerciseIndexes(),
    state.exerciseIndex,
  );
  refreshExerciseSelect();

  ui.chapterSelect.addEventListener("change", () => {
    const previousFilter = state.chapterFilter;
    const requestedFilter = ui.chapterSelect.value;
    if (requestedFilter === "favorites" && state.favorites.size === 0) {
      ui.chapterSelect.value = previousFilter;
      setFeedback("Favorites are empty. Tap ♡ on a progression to save it.");
      return;
    }

    state.chapterFilter = requestedFilter;
    const indexes = eligibleExerciseIndexes();
    state.exerciseIndex = nextRandomIndex(
      state.chapterFilter,
      indexes,
      indexes.includes(state.exerciseIndex) ? state.exerciseIndex : -1,
    );
    refreshExerciseSelect();
    startExercise(true);
  });

  ui.exerciseSelect.addEventListener("change", () => {
    state.exerciseIndex = Number(ui.exerciseSelect.value);
    startExercise(true);
  });

  ui.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      ui.modeButtons.forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });

  ui.playButton.addEventListener("click", toggleMainPlayback);
  ui.segmentPlayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleSegmentPlayback(Number(button.dataset.playSegment));
    });
  });
  ui.reviewButton.addEventListener("click", () => playSequence(true));
  ui.showButton.addEventListener("click", showAnswer);
  ui.nextButton.addEventListener("click", nextExercise);
  ui.favoriteButton.addEventListener("click", toggleFavorite);
  ui.resetStatsButton.addEventListener("click", resetStats);
  ui.soundSelect.addEventListener("change", () => {
    cancelPlayback();
    stopPianoVoices();
    state.sound = ui.soundSelect.value;
    setFeedback(`Sound: ${soundName()}.`);
    render();
  });
  ui.pianoStopButton.addEventListener("click", stopPianoVoices);
  buildPianoKeyboard();

  startExercise(true);
}

function refreshExerciseSelect() {
  ui.exerciseSelect.replaceChildren();
  eligibleExerciseIndexes().forEach((index) => {
    const exercise = EXERCISES[index];
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = state.chapterFilter === "all"
      ? `Chapter ${exercise.chapter} · ${exercise.name}`
      : exercise.name;
    ui.exerciseSelect.append(option);
  });
  ui.exerciseSelect.value = String(state.exerciseIndex);
}

function eligibleExerciseIndexes() {
  return EXERCISES
    .map((exercise, index) => ({ exercise, index }))
    .filter(({ exercise }) => (
      (state.chapterFilter === "favorites" && state.favorites.has(exercise.id))
      || state.chapterFilter === "all"
      || String(exercise.chapter) === state.chapterFilter
    ))
    .map(({ index }) => index);
}

function startExercise(randomizeKey) {
  const exercise = currentExercise();
  cancelPlayback();
  window.clearTimeout(autoNextTimer);
  if (randomizeKey) state.key = pickKey();
  state.answers = Array(exercise.sequence.length).fill(null);
  state.wrongAnswers = Array.from(
    { length: exercise.sequence.length },
    () => new Set(),
  );
  state.completed = false;
  state.revealed = false;
  state.activePosition = null;
  setFeedback("Tonic first, then the progression.");
  render();
}

function pickKey() {
  const available = KEY_CHOICES.filter((key) => key.name !== state.lastKeyName);
  const key = available[Math.floor(Math.random() * available.length)];
  state.lastKeyName = key.name;
  return key;
}

function nextExercise() {
  window.clearTimeout(autoNextTimer);
  const indexes = eligibleExerciseIndexes();

  if (indexes.length > 1) {
    state.exerciseIndex = nextRandomIndex(
      state.chapterFilter,
      indexes,
      state.exerciseIndex,
    );
  }
  refreshExerciseSelect();
  startExercise(true);
}

function nextRandomIndex(chapter, indexes, currentIndex) {
  if (indexes.length === 0) return currentIndex;
  if (indexes.length === 1) return indexes[0];

  let queue = chapterQueues.get(chapter) || [];
  queue = queue.filter((index) => indexes.includes(index) && index !== currentIndex);

  if (queue.length === 0) {
    queue = shuffle(indexes.filter((index) => index !== currentIndex));
  }

  const nextIndex = queue.shift();
  chapterQueues.set(chapter, queue);
  return nextIndex;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function stableStringHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function harmonicTensionScore(exercise) {
  const total = exercise.sequence.reduce((score, item) => {
    let chordScore = 0;
    if (/[♭#°+]/.test(item.degree)) chordScore += 0.8;
    if (/dim|b5|b9|b13|aug|alt|minMaj/i.test(item.quality)) chordScore += 1.1;
    if (item.bassOffset !== null && item.bassOffset !== item.offset) chordScore += 0.35;
    return score + chordScore;
  }, 0);
  return total / exercise.sequence.length;
}

function visualMoodForExercise(exercise) {
  const hash = stableStringHash(exercise.id);
  const tension = harmonicTensionScore(exercise);
  if (tension > 0.72) return ["rain", "dusk"][hash % 2];
  if (tension > 0.32) return ["lake", "rain", "dusk"][hash % 3];
  return ["dawn", "meadow", "lake"][hash % 3];
}

function render() {
  if (!ui.voicingPopover.hidden) closeVoicingPopover(false);
  const exercise = currentExercise();
  const positionCount = exercise.sequence.length;
  const playbackRanges = segmentedPlaybackRanges(positionCount);
  const showSegmentPlayback = (
    playbackRanges.length > 0
    && state.playbackMode !== "review"
  );
  ui.matrixScroll.dataset.compact = String(positionCount >= 10);
  document.body.dataset.atmosphere = visualMoodForExercise(exercise);

  ui.chapterLabel.textContent = `Reharmonization Techniques · Chapter ${exercise.chapter}`;
  ui.sourceLabel.textContent = exercise.source;
  ui.promptLabel.textContent = `Sequence · ${positionCount} chords`;
  ui.keyBadge.textContent = state.revealed ? `Key: ${state.key.name}` : "Key hidden";
  const isFavorite = state.favorites.has(exercise.id);
  ui.favoriteButton.textContent = isFavorite ? "♥" : "♡";
  ui.favoriteButton.classList.toggle("active", isFavorite);
  ui.favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  ui.favoriteButton.setAttribute(
    "aria-label",
    isFavorite ? "Remove from favorites" : "Add to favorites",
  );
  ui.favoriteButton.title = isFavorite ? "Remove from favorites" : "Add to favorites";

  ui.positionLegend.replaceChildren();
  ui.positionLegend.style.setProperty("--positions", positionCount);
  ui.positionLegend.style.setProperty("--matrix-width", `${98 + positionCount * 35}px`);
  ui.positionLegend.append(document.createElement("span"));
  for (let position = 0; position < positionCount; position += 1) {
    const number = document.createElement("span");
    number.className = "position-number";
    number.textContent = String(position + 1);
    number.classList.toggle("active", state.activePosition === position);
    ui.positionLegend.append(number);
  }

  ui.answerGrid.replaceChildren();
  const showActiveAnswer = (
    state.activePosition !== null
    && state.playbackMode === "review"
  );
  exercise.options.forEach((option, optionIndex) => {
    const row = document.createElement("div");
    row.className = "answer-row";
    row.style.setProperty("--positions", positionCount);
    row.style.setProperty("--matrix-width", `${98 + positionCount * 35}px`);
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `Preview chord ${optionLabel(option)}`);
    row.title = `Preview ${optionLabel(option)}`;
    const activeOptionIndex = !showActiveAnswer
      ? -1
      : correctOptionIndex(state.activePosition);
    if (optionIndex === activeOptionIndex) row.classList.add("sounding");
    if (optionIndex === state.previewOptionIndex) row.classList.add("previewing");
    row.addEventListener("click", () => previewChord(option, optionIndex));
    row.addEventListener("keydown", (event) => {
      if (event.target !== row) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      previewChord(option, optionIndex);
    });

    const name = document.createElement("span");
    name.className = "answer-name";
    const label = document.createElement("span");
    label.className = "answer-label";
    label.textContent = optionLabel(option);
    const notesButton = createChordNotesButton(option);
    name.append(label, notesButton);
    row.append(name);

    for (let position = 0; position < positionCount; position += 1) {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.type = "button";
      dot.title = `${optionLabel(option)}, position ${position + 1}`;
      dot.setAttribute("aria-label", dot.title);
      dot.dataset.option = String(optionIndex);
      dot.dataset.position = String(position);

      if (state.wrongAnswers[position]?.has(optionIndex)) {
        dot.classList.add("wrong");
      }

      if (
        state.answers[position] === optionIndex
        && isCorrectOption(position, optionIndex)
      ) {
        dot.classList.add("correct");
      }

      if (state.revealed && isCorrectOption(position, optionIndex)) {
        dot.classList.add("correct", "revealed");
      }

      if (
        showActiveAnswer
        &&
        state.activePosition === position
        && isCorrectOption(position, optionIndex)
      ) {
        dot.classList.add("sounding");
      }

      const positionSolved = state.answers[position] !== null;
      dot.disabled = state.revealed
        || state.completed
        || positionSolved
        || state.wrongAnswers[position]?.has(optionIndex);
      dot.addEventListener("click", (event) => {
        event.stopPropagation();
        selectAnswer(position, optionIndex);
      });
      row.append(dot);
    }

    ui.answerGrid.append(row);
  });

  ui.showButton.disabled = state.revealed || state.completed || state.playing;
  ui.reviewButton.disabled = !state.revealed || state.playing;
  ui.playbackControls.classList.toggle("segmented", showSegmentPlayback);
  ui.playButton.hidden = false;
  ui.playButton.disabled = false;
  ui.playButton.classList.toggle("playing", state.playing);
  ui.playButton.textContent = state.playing ? "■" : "▶";
  ui.playButton.setAttribute(
    "aria-label",
    state.playing ? "Stop and reset playback" : "Play full sequence",
  );
  ui.playButton.title = state.playing ? "Stop" : "Play full sequence";
  ui.segmentPlayback.hidden = !showSegmentPlayback;
  ui.segmentPlayButtons.forEach((button, index) => {
    const range = playbackRanges[index];
    if (!range) {
      button.hidden = true;
      return;
    }

    button.hidden = false;
    const label = playbackRangeLabel(range);
    const isActive = (
      state.playing
      && state.playbackMode === "blind"
      && state.playbackRange?.start === range.start
      && state.playbackRange?.end === range.end
    );
    button.textContent = `${isActive ? "■" : "▶"} ${label}`;
    button.classList.toggle("playing", isActive);
    button.disabled = state.playing && !isActive;
    button.setAttribute(
      "aria-label",
      isActive
        ? `Stop playback of part ${label}`
        : `Play part ${label}`,
    );
    button.title = isActive ? "Stop" : `Play chords ${label}`;
  });
  ui.nextButton.disabled = false;
  updateStats();
}

function segmentedPlaybackRanges(positionCount) {
  if (positionCount < SEGMENTED_PLAYBACK_MIN_LENGTH) return [];
  const midpoint = Math.ceil(positionCount / 2);
  return [
    { start: 0, end: midpoint },
    { start: midpoint, end: positionCount },
  ];
}

function playbackRangeLabel(range) {
  return `${range.start + 1}–${range.end}`;
}

function optionLabel(option) {
  if (state.mode === "degree") return option.degree;
  const pitchClass = (state.key.tonic + option.offset) % 12;
  const spelling = option.spelling || state.key.spelling;
  const root = `${NOTE_NAMES[spelling][pitchClass]}${QUALITY[option.quality].suffix}`;
  if (option.bassOffset === null) return root;
  const bassPitchClass = (state.key.tonic + option.bassOffset) % 12;
  return `${root}/${NOTE_NAMES[state.key.spelling][bassPitchClass]}`;
}

function selectAnswer(position, optionIndex) {
  if (
    state.completed
    || state.revealed
    || state.answers[position] !== null
  ) return;

  if (!isCorrectOption(position, optionIndex)) {
    state.wrongAnswers[position].add(optionIndex);
    setFeedback(
      `Position ${position + 1}: not quite. Choose another chord.`,
      "error",
    );
    render();
    return;
  }

  state.answers[position] = optionIndex;

  if (state.answers.every((answer) => answer !== null)) {
    completeExercise();
    return;
  }

  const solvedCount = state.answers.filter((answer) => answer !== null).length;
  setFeedback(
    `Position ${position + 1}: correct. ${solvedCount} of ${state.answers.length} solved.`,
    "success",
  );
  render();
}

function correctOptionIndex(position) {
  const target = currentExercise().sequence[position];
  return currentExercise().options.findIndex((option) => (
    option.degree === target.degree
    && option.offset === target.offset
    && option.quality === target.quality
    && option.bassOffset === target.bassOffset
  ));
}

function isCorrectOption(position, optionIndex) {
  return correctOptionIndex(position) === optionIndex;
}

function completeExercise() {
  if (state.completed || state.revealed) return;

  state.completed = true;
  const firstTryPositions = state.wrongAnswers.reduce(
    (sum, wrongOptions) => sum + Number(wrongOptions.size === 0),
    0,
  );
  const perfect = firstTryPositions === state.answers.length;

  state.stats.completed += 1;
  state.stats.positions += state.answers.length;
  state.stats.correctPositions += firstTryPositions;
  state.stats.streak = perfect ? state.stats.streak + 1 : 0;
  state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.streak);
  saveStats();

  if (perfect) {
    setFeedback("Entire progression solved on the first try.", "success");
  } else {
    setFeedback(
      `Progression solved. First try: ${firstTryPositions} of ${state.answers.length}.`,
      "success",
    );
  }
  render();

  autoNextTimer = window.setTimeout(() => {
    nextExercise();
  }, 1200);
}

function showAnswer() {
  if (state.revealed) return;
  state.revealed = true;
  state.stats.revealed += 1;
  state.stats.streak = 0;
  saveStats();
  setFeedback("The correct progression is shown in blue.", "success");
  render();
}

function setFeedback(message, type = "") {
  ui.feedback.textContent = message;
  ui.feedback.className = `feedback${type ? ` ${type}` : ""}`;
}

function loadFavorites() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(FAVORITES_STORAGE_KEY)
      || localStorage.getItem(LEGACY_FAVORITES_STORAGE_KEY)
      || "[]",
    );
    if (!Array.isArray(stored)) return new Set();

    const exercisesById = new Map(
      EXERCISES.map((exercise) => [exercise.id, exercise]),
    );
    const exercisesBySignature = new Map(
      EXERCISES.map((exercise) => [favoriteSignature(exercise), exercise]),
    );
    const restoredIds = stored.flatMap((item) => {
      if (typeof item === "string") {
        return exercisesById.has(item) ? [item] : [];
      }
      if (!item || typeof item !== "object") return [];
      if (exercisesById.has(item.id)) return [item.id];
      const matched = exercisesBySignature.get(favoriteSignature(item));
      return matched ? [matched.id] : [];
    });
    return new Set(restoredIds);
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  try {
    const records = EXERCISES
      .filter((exercise) => state.favorites.has(exercise.id))
      .map((exercise) => ({
        id: exercise.id,
        chapter: exercise.chapter,
        name: exercise.name,
        source: exercise.source,
      }));
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(records),
    );
    localStorage.setItem(
      LEGACY_FAVORITES_STORAGE_KEY,
      JSON.stringify([...state.favorites]),
    );
  } catch {
    // Favorites remain available for the current session if storage is blocked.
  }
  requestPersistentFavoritesStorage();
}

function favoriteSignature(exercise) {
  return [
    exercise.chapter ?? "",
    exercise.name ?? "",
    exercise.source ?? "",
  ].join("\u001f");
}

async function requestPersistentFavoritesStorage() {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) return false;
  try {
    if (navigator.storage.persisted && await navigator.storage.persisted()) {
      return true;
    }
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

function updateFavoriteChapterOption() {
  const option = [...ui.chapterSelect.children]
    .find((item) => item.value === "favorites");
  if (option) option.textContent = `Favorites · ${state.favorites.size}`;
}

function toggleFavorite() {
  const exercise = currentExercise();
  const wasFavorite = state.favorites.has(exercise.id);

  if (wasFavorite) state.favorites.delete(exercise.id);
  else state.favorites.add(exercise.id);

  saveFavorites();
  updateFavoriteChapterOption();

  if (wasFavorite && state.chapterFilter === "favorites") {
    const remainingIndexes = eligibleExerciseIndexes();
    if (remainingIndexes.length === 0) {
      state.chapterFilter = "all";
      ui.chapterSelect.value = "all";
      refreshExerciseSelect();
      setFeedback("Removed. Favorites are empty, so All chapters is open.");
      render();
      return;
    }

    state.exerciseIndex = nextRandomIndex(
      "favorites",
      remainingIndexes,
      state.exerciseIndex,
    );
    refreshExerciseSelect();
    startExercise(true);
    setFeedback("Removed from favorites. The next saved progression is open.");
    return;
  }

  refreshExerciseSelect();
  render();
  setFeedback(
    wasFavorite ? "Removed from favorites." : "Added to favorites.",
    wasFavorite ? "" : "success",
  );
}

function loadStats() {
  try {
    return {
      completed: 0,
      positions: 0,
      correctPositions: 0,
      streak: 0,
      bestStreak: 0,
      revealed: 0,
      ...JSON.parse(localStorage.getItem("reharm-ear-stats") || "{}"),
    };
  } catch {
    return { completed: 0, positions: 0, correctPositions: 0, streak: 0, bestStreak: 0, revealed: 0 };
  }
}

function saveStats() {
  try {
    localStorage.setItem("reharm-ear-stats", JSON.stringify(state.stats));
  } catch {
    // The trainer remains usable if a local WebKit profile blocks persistence.
  }
}

function resetStats() {
  if (!window.confirm("Reset all statistics for this trainer?")) return;
  state.stats = { completed: 0, positions: 0, correctPositions: 0, streak: 0, bestStreak: 0, revealed: 0 };
  saveStats();
  updateStats();
}

function updateStats() {
  const accuracy = state.stats.positions
    ? Math.round((state.stats.correctPositions / state.stats.positions) * 100)
    : 0;
  ui.completedStat.textContent = String(state.stats.completed);
  ui.accuracyStat.textContent = `${accuracy}%`;
  ui.streakStat.textContent = String(state.stats.streak);
  ui.revealedStat.textContent = String(state.stats.revealed);
}

async function playSequence(withAnswer, requestedRange = null) {
  if (state.playing || (withAnswer && !state.revealed)) return;
  if (state.previewOptionIndex !== null) cancelPlayback();
  if (!await ensureAudioContext()) return;

  const exercise = currentExercise();
  const playbackRange = requestedRange
    ? {
      start: Math.max(0, requestedRange.start),
      end: Math.min(exercise.sequence.length, requestedRange.end),
    }
    : { start: 0, end: exercise.sequence.length };
  const playbackItems = exercise.sequence.slice(playbackRange.start, playbackRange.end);
  if (playbackItems.length === 0) return;

  state.playing = true;
  state.playbackMode = withAnswer ? "review" : "blind";
  state.playbackRange = requestedRange ? playbackRange : null;
  state.activePosition = null;
  render();

  const secondsPerChord = Number(ui.tempoSelect.value);
  const startAt = audioContext.currentTime + 0.08;
  const sampledKeyboardSound = isSampledKeyboardSound();
  const sustainRatio = isPianoLegato()
    ? PIANO_LEGATO_SUSTAIN_RATIO
    : (sampledKeyboardSound ? PIANO_SUSTAIN_RATIO : 0.9);
  const releaseTail = sampledKeyboardSound ? keyboardReleaseSeconds() : 0.02;
  const chordDuration = secondsPerChord * sustainRatio;
  const referenceDuration = sampledKeyboardSound
    ? secondsPerChord * PIANO_SUSTAIN_RATIO
    : chordDuration;
  const referenceGap = sampledKeyboardSound
    ? keyboardReleaseSeconds() + 0.05
    : 0.55;
  const sequenceStart = startAt + referenceDuration + referenceGap;

  if (withAnswer) {
    setFeedback("Reference chord: I — tonic.", "playing");
  }
  scheduleChord(tonicReferenceChord(), startAt, referenceDuration);

  playbackItems.forEach((item, relativeIndex) => {
    const absoluteIndex = playbackRange.start + relativeIndex;
    scheduleChord(
      item,
      sequenceStart + relativeIndex * secondsPerChord,
      chordDuration,
    );

    const delay = Math.max(
      0,
      sequenceStart + relativeIndex * secondsPerChord - audioContext.currentTime,
    );
    const timer = window.setTimeout(() => {
      state.activePosition = absoluteIndex;
      if (withAnswer) {
        setFeedback(
          `Now playing ${item.degree} · position ${absoluteIndex + 1}.`,
          "playing",
        );
      } else {
        setFeedback(
          `Now playing position ${absoluteIndex + 1} of ${exercise.sequence.length}.`,
          "playing",
        );
      }
      render();
    }, delay * 1000);
    highlightTimers.push(timer);
  });

  window.clearTimeout(stopTimer);
  stopTimer = window.setTimeout(() => {
    const wasReview = state.playbackMode === "review";
    const completedRange = state.playbackRange;
    state.playing = false;
    state.playbackMode = null;
    state.playbackRange = null;
    state.activePosition = null;
    clearHighlightTimers();
    parkAudioContext();
    if (wasReview) {
      setFeedback("Review complete. You can play it again.");
    } else if (completedRange) {
      setFeedback(`Part ${playbackRangeLabel(completedRange)} complete.`);
    } else {
      setFeedback("Full sequence complete.");
    }
    render();
  }, (
    referenceDuration
    + referenceGap
    + Math.max(0, playbackItems.length - 1) * secondsPerChord
    + chordDuration
    + releaseTail
    + 0.25
  ) * 1000);
}

function toggleMainPlayback() {
  if (state.playing || state.previewOptionIndex !== null) {
    cancelPlayback();
    setFeedback("Playback stopped. The next play starts from the beginning.");
    render();
    return;
  }
  playSequence(false);
}

function toggleSegmentPlayback(segmentIndex) {
  if (state.playing || state.previewOptionIndex !== null) {
    cancelPlayback();
    setFeedback("Playback stopped. The next play starts from the beginning.");
    render();
    return;
  }

  const range = segmentedPlaybackRanges(currentExercise().sequence.length)[segmentIndex];
  if (!range) return;
  setFeedback(`Part ${playbackRangeLabel(range)}: tonic first, then the chords.`, "playing");
  playSequence(false, range);
}

async function previewChord(item, optionIndex) {
  cancelPlayback();
  if (!await ensureAudioContext()) return;

  const duration = isPianoLegato()
    ? 2.25
    : (isSampledKeyboardSound() ? 1.65 : 1.15);
  state.previewOptionIndex = optionIndex;
  setFeedback(`Preview: ${optionLabel(item)}.`, "playing");
  render();
  scheduleChord(item, audioContext.currentTime + 0.04, duration);

  previewTimer = window.setTimeout(() => {
    state.previewOptionIndex = null;
    parkAudioContext();
    render();
  }, (
    duration
    + (isSampledKeyboardSound() ? keyboardReleaseSeconds() + 0.1 : 0.2)
  ) * 1000);
}

function buildPianoKeyboard() {
  const sharpNames = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  const flatNames = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
  const blackPitchClasses = new Set([1, 3, 6, 8, 10]);
  let whiteIndex = 0;

  for (let midi = 48; midi <= 72; midi += 1) {
    const pitchClass = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    const isBlack = blackPitchClasses.has(pitchClass);
    const button = document.createElement("button");
    const sharpName = `${sharpNames[pitchClass]}${octave}`;
    const flatName = `${flatNames[pitchClass]}${octave}`;

    button.type = "button";
    button.className = `piano-key ${isBlack ? "black" : "white"}`;
    button.dataset.midi = String(midi);
    button.title = isBlack ? `${sharpName} / ${flatName}` : sharpName;
    button.setAttribute("aria-label", button.title);

    if (isBlack) {
      button.style.setProperty("--white-index", String(whiteIndex - 1));
    } else {
      button.textContent = sharpName;
      whiteIndex += 1;
    }

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      triggerPianoKey(button, midi);
    });
    button.addEventListener("keydown", (event) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      triggerPianoKey(button, midi);
    });
    ui.pianoKeyboard.append(button);
  }
}

async function triggerPianoKey(button, midi) {
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) {
    setFeedback("This browser does not support Web Audio playback.", "error");
    return;
  }

  configurePlaybackAudioSession();
  await unlockMobileAudio();
  window.clearTimeout(pianoIdleTimer);
  const now = Date.now();
  const createdContext = !pianoAudioContext || pianoAudioContext.state === "closed";
  if (createdContext) pianoAudioContext = new AudioEngine();
  const wasSuspended = pianoAudioContext.state !== "running";
  const idleFor = now - pianoAudioContextLastUsedAt;
  try {
    await pianoAudioContext.resume();
  } catch {
    setFeedback("Audio could not start. Check the iPhone silent-mode setting.", "error");
    return;
  }
  if (
    createdContext
    || wasSuspended
    || idleFor >= AUDIO_HARDWARE_IDLE_THRESHOLD_MS
  ) {
    await warmUpAudioHardware(pianoAudioContext);
  }
  pianoAudioContextLastUsedAt = Date.now();

  const context = pianoAudioContext;
  const startAt = context.currentTime + 0.04;
  const isPiano = isPianoSound();
  const isElectricPiano = isElectricPianoSound();
  const isSampledKeyboard = isPiano || isElectricPiano;
  const outputGain = isElectricPiano ? ELECTRIC_PIANO_OUTPUT_GAIN : 1;
  const duration = isPianoLegato()
    ? 2.85
    : (isSampledKeyboard ? 2.15 : 1.55);

  if (isPiano && await ensurePianoSamples(context)) {
    const sources = scheduleSampledPianoNotes(
      context,
      [midi],
      startAt,
      duration,
    );
    const voice = { sources };
    pianoVoices.add(voice);
    sources[0].onended = () => {
      pianoVoices.delete(voice);
      schedulePianoContextRelease();
    };
    flashPianoKey(button);
    return;
  }
  if (isElectricPiano && await ensureElectricPianoSamples(context)) {
    const sources = scheduleSampledPianoNotes(
      context,
      [midi],
      startAt,
      duration,
      {
        outputGain: ELECTRIC_PIANO_OUTPUT_GAIN,
        releaseSeconds: ELECTRIC_PIANO_RELEASE_SECONDS,
        sampleManifest: ELECTRIC_PIANO_SAMPLE_MANIFEST,
        sampleBuffers: electricPianoSampleBuffers,
      },
    );
    const voice = { sources };
    pianoVoices.add(voice);
    sources[0].onended = () => {
      pianoVoices.delete(voice);
      schedulePianoContextRelease();
    };
    flashPianoKey(button);
    return;
  }

  const frequency = 440 * (2 ** ((midi - 69) / 12));
  const voice = {
    oscillator: context.createOscillator(),
    overtone: context.createOscillator(),
    gain: context.createGain(),
    overtoneGain: context.createGain(),
    filter: context.createBiquadFilter(),
  };

  voice.oscillator.type = "triangle";
  voice.oscillator.frequency.setValueAtTime(frequency, startAt);
  voice.overtone.type = isSampledKeyboard ? "triangle" : "sine";
  voice.overtone.frequency.setValueAtTime(
    frequency * (isSampledKeyboard ? 2.012 : 2.005),
    startAt,
  );
  voice.filter.type = "lowpass";
  voice.filter.frequency.setValueAtTime(isSampledKeyboard ? 5200 : 3100, startAt);
  if (isSampledKeyboard) {
    voice.filter.frequency.exponentialRampToValueAtTime(1350, startAt + 1.35);
  }
  voice.filter.Q.setValueAtTime(0.65, startAt);
  voice.gain.gain.setValueAtTime(0.0001, startAt);
  voice.gain.gain.exponentialRampToValueAtTime(
    (isSampledKeyboard ? 0.28 : 0.2) * outputGain,
    startAt + 0.012,
  );
  voice.gain.gain.exponentialRampToValueAtTime(
    (isSampledKeyboard ? 0.055 : 0.075) * outputGain,
    startAt + 0.52,
  );
  voice.gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  voice.overtoneGain.gain.setValueAtTime(
    (isSampledKeyboard ? 0.14 : 0.08) * outputGain,
    startAt,
  );
  voice.overtoneGain.gain.exponentialRampToValueAtTime(
    0.0001,
    startAt + (isSampledKeyboard ? 0.72 : 0.48),
  );

  voice.oscillator.connect(voice.gain);
  voice.overtone.connect(voice.overtoneGain);
  voice.gain.connect(voice.filter);
  voice.overtoneGain.connect(voice.filter);
  voice.filter.connect(context.destination);

  pianoVoices.add(voice);
  voice.oscillator.onended = () => {
    pianoVoices.delete(voice);
    schedulePianoContextRelease();
  };
  voice.oscillator.start(startAt);
  voice.overtone.start(startAt);
  voice.oscillator.stop(startAt + duration + 0.02);
  voice.overtone.stop(startAt + duration + 0.02);

  flashPianoKey(button);
}

function flashPianoKey(button) {
  button.classList.add("active");
  window.clearTimeout(pianoKeyTimers.get(button));
  pianoKeyTimers.set(button, window.setTimeout(() => {
    button.classList.remove("active");
    pianoKeyTimers.delete(button);
  }, 230));
}

function schedulePianoContextRelease() {
  if (pianoVoices.size || !pianoAudioContext) return;
  window.clearTimeout(pianoIdleTimer);
  pianoAudioContextLastUsedAt = Date.now();
  pianoIdleTimer = window.setTimeout(() => {
    if (!pianoVoices.size) releasePianoContext();
  }, AUDIO_CONTEXT_IDLE_CLOSE_MS);
}

function stopPianoVoices() {
  pianoKeyTimers.forEach((timer, button) => {
    window.clearTimeout(timer);
    button.classList.remove("active");
  });
  pianoKeyTimers.clear();
  pianoVoices.clear();
  releasePianoContext();
}

function releasePianoContext() {
  window.clearTimeout(pianoIdleTimer);
  const context = pianoAudioContext;
  pianoAudioContext = null;
  pianoAudioContextLastUsedAt = 0;
  if (context && context.state !== "closed") {
    context.close().catch(() => {});
  }
}

async function warmUpAudioHardware(context) {
  if (!context || context.state !== "running") return;

  try {
    const startAt = context.currentTime + 0.005;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220, startAt);
    gain.gain.setValueAtTime(0.00003, startAt);
    gain.gain.exponentialRampToValueAtTime(0.00001, startAt + 0.055);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.06);
  } catch {
    // The ordinary scheduling lead-in below still protects the first attack.
  }

  await new Promise((resolve) => {
    window.setTimeout(resolve, AUDIO_HARDWARE_WARMUP_MS);
  });
}

async function ensureAudioContext() {
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) {
    setFeedback("This browser does not support Web Audio playback.", "error");
    return false;
  }
  configurePlaybackAudioSession();
  await unlockMobileAudio();
  window.clearTimeout(audioContextIdleTimer);
  const now = Date.now();
  const createdContext = !audioContext || audioContext.state === "closed";
  if (createdContext) audioContext = new AudioEngine();
  const wasSuspended = audioContext.state !== "running";
  const idleFor = now - audioContextLastUsedAt;
  try {
    await audioContext.resume();
  } catch {
    setFeedback("Audio could not start. Check the iPhone silent-mode setting.", "error");
    return false;
  }
  if (
    createdContext
    || wasSuspended
    || idleFor >= AUDIO_HARDWARE_IDLE_THRESHOLD_MS
  ) {
    await warmUpAudioHardware(audioContext);
  }
  audioContextLastUsedAt = Date.now();
  if (isPianoSound()) {
    await ensurePianoSamples(audioContext);
    if (isUprightBassSound()) {
      await ensureUprightBassSamples(audioContext);
    }
  } else if (isElectricPianoSound()) {
    await ensureElectricPianoSamples(audioContext);
  }
  return true;
}

async function ensurePianoSamples(context) {
  if (pianoSampleBuffers.size === PIANO_SAMPLE_MANIFEST.length) return true;

  pianoSamplePromise ||= Promise.all(PIANO_SAMPLE_MANIFEST.map(async (sample) => {
    const encoded = await loadPianoSampleBytes(sample.url);
    const buffer = await new Promise((resolve, reject) => {
      context.decodeAudioData(encoded, resolve, reject);
    });
    return [sample.midi, buffer];
  }))
    .then((samples) => {
      samples.forEach(([midi, buffer]) => pianoSampleBuffers.set(midi, buffer));
      return true;
    })
    .catch((error) => {
      console.error(error);
      pianoSamplePromise = null;
      setFeedback(
        "Piano samples did not load; a synthesized sound is being used temporarily.",
        "error",
      );
      return false;
    });

  return pianoSamplePromise;
}

async function ensureElectricPianoSamples(context) {
  if (
    electricPianoSampleBuffers.size
    === ELECTRIC_PIANO_SAMPLE_MANIFEST.length
  ) return true;

  electricPianoSamplePromise ||= Promise.all(
    ELECTRIC_PIANO_SAMPLE_MANIFEST.map(async (sample) => {
      const encoded = await loadPianoSampleBytes(sample.url);
      const buffer = await new Promise((resolve, reject) => {
        context.decodeAudioData(encoded, resolve, reject);
      });
      return [sample.midi, buffer];
    }),
  )
    .then((samples) => {
      samples.forEach(([midi, buffer]) => (
        electricPianoSampleBuffers.set(midi, buffer)
      ));
      return true;
    })
    .catch((error) => {
      console.error(error);
      electricPianoSamplePromise = null;
      setFeedback(
        "Electric-piano samples did not load; a synthesized sound is being used temporarily.",
        "error",
      );
      return false;
    });

  return electricPianoSamplePromise;
}

async function ensureUprightBassSamples(context) {
  if (
    uprightBassSampleBuffers.size
    === UPRIGHT_BASS_SAMPLE_MANIFEST.length
  ) return true;

  uprightBassSamplePromise ||= Promise.all(
    UPRIGHT_BASS_SAMPLE_MANIFEST.map(async (sample) => {
      const encoded = await loadPianoSampleBytes(sample.url);
      const buffer = await new Promise((resolve, reject) => {
        context.decodeAudioData(encoded, resolve, reject);
      });
      return [sample.midi, buffer];
    }),
  )
    .then((samples) => {
      samples.forEach(([midi, buffer]) => (
        uprightBassSampleBuffers.set(midi, buffer)
      ));
      return true;
    })
    .catch((error) => {
      console.error(error);
      uprightBassSamplePromise = null;
      setFeedback(
        "Upright-bass samples did not load; the piano will continue without bass reinforcement.",
        "error",
      );
      return false;
    });

  return uprightBassSamplePromise;
}

async function loadPianoSampleBytes(url) {
  try {
    const response = await fetch(url);
    if (!response.ok && response.status !== 0) {
      throw new Error(`Piano sample ${url}: HTTP ${response.status}`);
    }
    const encoded = await response.arrayBuffer();
    if (encoded.byteLength) return encoded;
    throw new Error(`Piano sample ${url}: empty response`);
  } catch (fetchError) {
    if (window.location?.protocol !== "file:") throw fetchError;
  }

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = () => {
      if (request.response?.byteLength) {
        resolve(request.response);
      } else {
        reject(new Error(`Piano sample ${url}: empty local response`));
      }
    };
    request.onerror = () => {
      reject(new Error(`Piano sample ${url}: local file load failed`));
    };
    request.send();
  });
}

function nearestPianoSample(
  midi,
  sampleManifest = PIANO_SAMPLE_MANIFEST,
  sampleBuffers = pianoSampleBuffers,
) {
  let nearest = sampleManifest[0];
  sampleManifest.forEach((sample) => {
    if (Math.abs(sample.midi - midi) < Math.abs(nearest.midi - midi)) {
      nearest = sample;
    }
  });
  return {
    ...nearest,
    buffer: sampleBuffers.get(nearest.midi),
  };
}

function scheduleSampledPianoNotes(
  context,
  notes,
  startAt,
  duration,
  {
    bassVoiceCount = 0,
    bassGain = 1,
    outputGain = 1,
    releaseSeconds = pianoReleaseSeconds(),
    sampleManifest = PIANO_SAMPLE_MANIFEST,
    sampleBuffers = pianoSampleBuffers,
  } = {},
) {
  const master = context.createGain();
  const compressor = context.createDynamicsCompressor();
  const level = Math.min(0.92, 1.28 / Math.sqrt(notes.length)) * outputGain;
  master.gain.setValueAtTime(level, startAt);
  compressor.threshold.setValueAtTime(-14, startAt);
  compressor.knee.setValueAtTime(9, startAt);
  compressor.ratio.setValueAtTime(3, startAt);
  compressor.attack.setValueAtTime(0.003, startAt);
  compressor.release.setValueAtTime(0.22, startAt);
  master.connect(compressor);
  compressor.connect(context.destination);

  return notes.map((midi, noteIndex) => {
    const sample = nearestPianoSample(midi, sampleManifest, sampleBuffers);
    const source = context.createBufferSource();
    const envelope = context.createGain();
    const playbackRate = 2 ** (
      (
        (midi - sample.midi) * 100
        + (sample.tuneCents ?? 0)
      ) / 1200
    );
    const releaseAt = startAt + duration;

    source.buffer = sample.buffer;
    source.playbackRate.setValueAtTime(playbackRate, startAt);
    envelope.gain.setValueAtTime(0.0001, startAt);
    const peakGain = noteIndex < bassVoiceCount ? bassGain : 1;
    envelope.gain.exponentialRampToValueAtTime(peakGain, startAt + 0.008);
    envelope.gain.setValueAtTime(0.9, startAt + Math.min(0.35, duration * 0.4));
    envelope.gain.exponentialRampToValueAtTime(
      0.0001,
      releaseAt + releaseSeconds,
    );

    source.connect(envelope);
    envelope.connect(master);
    source.start(startAt);
    source.stop(releaseAt + releaseSeconds + 0.05);
    return source;
  });
}

function scheduleSampledUprightBassNote(context, midi, startAt, duration) {
  const sample = nearestPianoSample(
    midi,
    UPRIGHT_BASS_SAMPLE_MANIFEST,
    uprightBassSampleBuffers,
  );
  if (!sample.buffer) return null;

  const source = context.createBufferSource();
  const lowpass = context.createBiquadFilter();
  const envelope = context.createGain();
  const playbackRate = 2 ** ((midi - sample.midi) / 12);
  const naturalDuration = sample.buffer.duration / playbackRate;
  const tempoAwareDuration = Math.max(
    0.7,
    Math.min(UPRIGHT_BASS_MAX_DURATION_SECONDS, duration * 0.62),
  );
  const soundingDuration = Math.min(
    naturalDuration,
    tempoAwareDuration,
  );
  const settleAt = startAt + Math.min(0.28, soundingDuration * 0.36);
  const fadeAt = startAt + Math.max(0.34, soundingDuration - 0.22);
  const stopAt = startAt + soundingDuration;

  source.buffer = sample.buffer;
  source.playbackRate.setValueAtTime(playbackRate, startAt);
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(UPRIGHT_BASS_FILTER_HZ, startAt);
  lowpass.Q.setValueAtTime(0.62, startAt);
  envelope.gain.setValueAtTime(0.0001, startAt);
  envelope.gain.exponentialRampToValueAtTime(
    UPRIGHT_BASS_OUTPUT_GAIN,
    startAt + 0.006,
  );
  envelope.gain.exponentialRampToValueAtTime(
    UPRIGHT_BASS_OUTPUT_GAIN * 0.68,
    settleAt,
  );
  envelope.gain.setValueAtTime(UPRIGHT_BASS_OUTPUT_GAIN * 0.68, fadeAt);
  envelope.gain.exponentialRampToValueAtTime(0.0001, stopAt);

  source.connect(lowpass);
  lowpass.connect(envelope);
  envelope.connect(context.destination);
  source.start(startAt);
  source.stop(stopAt + 0.02);
  return source;
}

function isAppleMobileDevice() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function configurePlaybackAudioSession() {
  if (typeof navigator === "undefined" || !navigator.audioSession) return false;
  try {
    navigator.audioSession.type = "playback";
    return navigator.audioSession.type === "playback";
  } catch {
    return false;
  }
}

function resumeAudioAfterInterruption() {
  [audioContext, pianoAudioContext].forEach((context) => {
    if (!context || context.state === "closed" || context.state === "running") return;
    context.resume().catch(() => {});
  });
}

function requestPortraitOrientation() {
  const orientation = window.screen?.orientation;
  if (!orientation?.lock) return;
  orientation.lock("portrait-primary").catch(() => {});
}

async function unlockMobileAudio() {
  if (!isAppleMobileDevice() || mobileAudioUnlocked) return true;

  if (!mobileAudioElement) {
    const sampleRate = 8000;
    const sampleCount = 800;
    const wav = new ArrayBuffer(44 + sampleCount);
    const view = new DataView(wav);
    const writeText = (offset, text) => {
      for (let index = 0; index < text.length; index += 1) {
        view.setUint8(offset + index, text.charCodeAt(index));
      }
    };

    writeText(0, "RIFF");
    view.setUint32(4, 36 + sampleCount, true);
    writeText(8, "WAVE");
    writeText(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate, true);
    view.setUint16(32, 1, true);
    view.setUint16(34, 8, true);
    writeText(36, "data");
    view.setUint32(40, sampleCount, true);
    for (let index = 44; index < wav.byteLength; index += 1) {
      view.setUint8(index, 128);
    }

    mobileAudioElement = new Audio(URL.createObjectURL(
      new Blob([wav], { type: "audio/wav" }),
    ));
    mobileAudioElement.preload = "auto";
    mobileAudioElement.setAttribute("playsinline", "");
  }

  try {
    mobileAudioElement.currentTime = 0;
    await mobileAudioElement.play();
    mobileAudioUnlocked = true;
    return true;
  } catch {
    return false;
  }
}

function tonicReferenceChord() {
  return chord("I", 0, "maj");
}

function clearHighlightTimers() {
  highlightTimers.forEach((timer) => window.clearTimeout(timer));
  highlightTimers = [];
}

function cancelPlayback() {
  window.clearTimeout(stopTimer);
  window.clearTimeout(previewTimer);
  clearHighlightTimers();
  state.playing = false;
  state.playbackMode = null;
  state.playbackRange = null;
  state.activePosition = null;
  state.previewOptionIndex = null;
  releaseAudioContext();
}

function parkAudioContext() {
  const context = audioContext;
  if (!context || context.state === "closed") return;

  audioContextLastUsedAt = Date.now();
  window.clearTimeout(audioContextIdleTimer);
  audioContextIdleTimer = window.setTimeout(() => {
    if (
      audioContext !== context
      || state.playing
      || state.previewOptionIndex !== null
    ) return;
    audioContext = null;
    audioContextLastUsedAt = 0;
    context.close().catch(() => {});
  }, AUDIO_CONTEXT_IDLE_CLOSE_MS);
}

function releaseAudioContext() {
  window.clearTimeout(audioContextIdleTimer);
  const context = audioContext;
  audioContext = null;
  audioContextLastUsedAt = 0;
  if (context && context.state !== "closed") {
    context.close().catch(() => {});
  }
}

function midiNotesForChord(item) {
  const hasIndependentBass = (
    item.bassOffset !== null
    && item.bassOffset !== item.offset
  );
  const rootPitchClass = (state.key.tonic + item.offset) % 12;
  const bassPitchClass = (
    state.key.tonic
    + (item.bassOffset ?? item.offset)
  ) % 12;
  const bassMidi = 36 + bassPitchClass;
  let upperRootMidi = 60 + rootPitchClass;
  if (upperRootMidi > 67) upperRootMidi -= 12;

  const notes = [
    bassMidi,
    ...(hasIndependentBass ? [bassMidi + 12] : []),
    ...QUALITY[item.quality].intervals.map((interval) => upperRootMidi + interval),
  ];
  return { notes, hasIndependentBass };
}

function playbackNotesForChord(item, sound = state.sound) {
  const voicing = midiNotesForChord(item);
  if (!isBassSound(sound)) return voicing;
  return {
    notes: [voicing.notes[0]],
    hasIndependentBass: false,
  };
}

function midiNoteInfo(midi, spelling = state.key.spelling) {
  const pitchClass = ((midi % 12) + 12) % 12;
  const name = NOTE_NAMES[spelling][pitchClass];
  const octave = Math.floor(midi / 12) - 1;
  const letterIndex = "CDEFGAB".indexOf(name[0]);
  return {
    midi,
    name: `${name}${octave}`,
    accidental: name.slice(1),
    diatonic: octave * 7 + letterIndex,
  };
}

function voicingNotationData(item, sound = state.sound) {
  const playback = playbackNotesForChord(item, sound);
  const sourceVoicing = midiNotesForChord(item);
  const spelling = item.spelling || state.key.spelling;
  const notes = [...new Set(playback.notes)]
    .sort((left, right) => left - right)
    .map((midi) => midiNoteInfo(midi, spelling));
  const lowestName = notes[0]?.name || "";
  const reinforcedMidi = isUprightBassSound(sound)
    || sourceVoicing.hasIndependentBass
    ? notes[0]?.midi ?? null
    : null;
  const details = [];

  if (isBassSound(sound)) {
    details.push(`only ${lowestName} sounds`);
  } else {
    details.push("exact playback voicing");
  }
  if (isUprightBassSound(sound)) {
    details.push(`${lowestName} reinforced by upright bass`);
  }
  if (sourceVoicing.hasIndependentBass) {
    details.push(`independent ${lowestName} slash bass`);
  }

  return {
    notes,
    reinforcedMidi,
    label: optionLabel(item),
    meta: `${soundName(sound)} · ${details.join(" · ")}`,
  };
}

function svgElement(tag, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attributes).forEach(([name, value]) => (
    element.setAttribute(name, String(value))
  ));
  return element;
}

function staffY(note, staff) {
  const bottomDiatonic = staff === "treble" ? 30 : 18;
  const bottomY = staff === "treble" ? 70 : 148;
  return bottomY - (note.diatonic - bottomDiatonic) * 4;
}

function appendLedgerLines(svg, note, staff, noteX) {
  const bottomDiatonic = staff === "treble" ? 30 : 18;
  const topDiatonic = staff === "treble" ? 38 : 26;
  const lineIndexes = [];

  for (
    let diatonic = bottomDiatonic - 2;
    diatonic >= note.diatonic;
    diatonic -= 2
  ) lineIndexes.push(diatonic);
  for (
    let diatonic = topDiatonic + 2;
    diatonic <= note.diatonic;
    diatonic += 2
  ) lineIndexes.push(diatonic);

  lineIndexes.forEach((diatonic) => {
    const ledgerNote = { diatonic };
    const y = staffY(ledgerNote, staff);
    svg.append(svgElement("line", {
      class: "voicing-ledger",
      x1: noteX - 12,
      x2: noteX + 15,
      y1: y,
      y2: y,
    }));
  });
}

function renderVoicingSvg(item, sound = state.sound) {
  const data = voicingNotationData(item, sound);
  const svg = svgElement("svg", {
    viewBox: "0 0 360 188",
    role: "img",
    "aria-label": `${data.label}: ${data.notes.map((note) => note.name).join(", ")}`,
  });
  svg.classList.add("voicing-score");

  ["treble", "bass"].forEach((staff) => {
    const firstY = staff === "treble" ? 38 : 116;
    for (let line = 0; line < 5; line += 1) {
      const y = firstY + line * 8;
      svg.append(svgElement("line", {
        class: "voicing-staff-line",
        x1: 72,
        x2: 326,
        y1: y,
        y2: y,
      }));
    }
  });

  const trebleClef = svgElement("text", {
    class: "voicing-clef voicing-treble-clef",
    x: 77,
    y: 70,
  });
  trebleClef.textContent = "𝄞";
  const bassClef = svgElement("text", {
    class: "voicing-clef voicing-bass-clef",
    x: 78,
    y: 145,
  });
  bassClef.textContent = "𝄢";
  svg.append(trebleClef, bassClef);

  const groupedNotes = {
    treble: data.notes.filter((note) => note.midi >= 60),
    bass: data.notes.filter((note) => note.midi < 60),
  };
  Object.entries(groupedNotes).forEach(([staff, notes]) => {
    let previousDiatonic = null;
    notes.forEach((note) => {
      const adjacent = previousDiatonic !== null
        && note.diatonic - previousDiatonic === 1;
      const noteX = adjacent ? 226 : 216;
      const y = staffY(note, staff);
      appendLedgerLines(svg, note, staff, noteX);

      if (note.accidental) {
        const accidental = svgElement("text", {
          class: "voicing-accidental",
          x: noteX - 21,
          y: y + 5,
        });
        accidental.textContent = note.accidental;
        svg.append(accidental);
      }

      svg.append(svgElement("ellipse", {
        class: note.midi === data.reinforcedMidi
          ? "voicing-note reinforced"
          : "voicing-note",
        cx: noteX,
        cy: y,
        rx: 7.2,
        ry: 5.1,
        transform: `rotate(-18 ${noteX} ${y})`,
      }));
      previousDiatonic = note.diatonic;
    });
  });

  return svg;
}

function createChordNotesButton(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chord-notes-button";
  button.title = `Show sounding notes for ${optionLabel(item)}`;
  button.setAttribute("aria-label", button.title);
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-expanded", "false");

  const icon = svgElement("svg", {
    viewBox: "0 0 28 28",
    "aria-hidden": "true",
  });
  [8, 11, 14, 17, 20].forEach((y) => {
    icon.append(svgElement("line", {
      x1: 3.5,
      x2: 24.5,
      y1: y,
      y2: y,
    }));
  });
  icon.append(
    svgElement("ellipse", {
      cx: 14.5,
      cy: 14,
      rx: 3.2,
      ry: 2.25,
      transform: "rotate(-18 14.5 14)",
    }),
    svgElement("line", {
      x1: 17.4,
      x2: 17.4,
      y1: 13.3,
      y2: 5.5,
    }),
  );
  button.append(icon);
  button.addEventListener("pointerdown", (event) => event.stopPropagation());
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openVoicingPopover(item, button);
  });
  return button;
}

function positionVoicingPopover(anchor) {
  const anchorRect = anchor.getBoundingClientRect();
  const popoverRect = ui.voicingPopover.getBoundingClientRect();
  const edge = 12;
  const preferredLeft = (
    anchorRect.left
    + anchorRect.width / 2
    - popoverRect.width / 2
  );
  const left = Math.min(
    window.innerWidth - popoverRect.width - edge,
    Math.max(edge, preferredLeft),
  );
  let top = anchorRect.bottom + 10;
  if (top + popoverRect.height > window.innerHeight - edge) {
    top = Math.max(edge, anchorRect.top - popoverRect.height - 10);
  }
  ui.voicingPopover.style.left = `${left}px`;
  ui.voicingPopover.style.top = `${top}px`;
}

function openVoicingPopover(item, anchor) {
  closeVoicingPopover(false);
  const data = voicingNotationData(item);
  ui.voicingTitle.textContent = data.label;
  ui.voicingStaff.replaceChildren(renderVoicingSvg(item));
  ui.voicingNotes.textContent = data.notes.map((note) => note.name).join(" · ");
  ui.voicingMeta.textContent = data.meta;
  ui.voicingPopover.hidden = false;
  voicingPopoverAnchor = anchor;
  anchor.setAttribute("aria-expanded", "true");
  positionVoicingPopover(anchor);
}

function closeVoicingPopover(restoreFocus = false) {
  const anchor = voicingPopoverAnchor;
  if (anchor) anchor.setAttribute("aria-expanded", "false");
  ui.voicingPopover.hidden = true;
  voicingPopoverAnchor = null;
  if (restoreFocus) anchor?.focus?.();
}

function scheduleChord(item, startAt, duration) {
  const isPiano = isPianoSound();
  const isElectricPiano = isElectricPianoSound();
  const isSampledKeyboard = isPiano || isElectricPiano;
  const { notes, hasIndependentBass } = playbackNotesForChord(item);

  if (
    isUprightBassSound()
    && uprightBassSampleBuffers.size === UPRIGHT_BASS_SAMPLE_MANIFEST.length
  ) {
    scheduleSampledUprightBassNote(
      audioContext,
      notes[0],
      startAt,
      duration,
    );
  }

  if (
    isPiano
    && pianoSampleBuffers.size === PIANO_SAMPLE_MANIFEST.length
  ) {
    scheduleSampledPianoNotes(
      audioContext,
      notes,
      startAt,
      duration,
      {
        bassVoiceCount: hasIndependentBass ? 2 : 1,
        bassGain: hasIndependentBass ? 1.34 : 1.12,
        releaseSeconds: pianoReleaseSeconds(),
      },
    );
    return;
  }
  if (
    isElectricPiano
    && electricPianoSampleBuffers.size
      === ELECTRIC_PIANO_SAMPLE_MANIFEST.length
  ) {
    scheduleSampledPianoNotes(
      audioContext,
      notes,
      startAt,
      duration,
      {
        bassVoiceCount: hasIndependentBass ? 2 : 1,
        bassGain: hasIndependentBass ? 1.22 : 1.06,
        outputGain: ELECTRIC_PIANO_OUTPUT_GAIN,
        releaseSeconds: ELECTRIC_PIANO_RELEASE_SECONDS,
        sampleManifest: ELECTRIC_PIANO_SAMPLE_MANIFEST,
        sampleBuffers: electricPianoSampleBuffers,
      },
    );
    return;
  }

  const master = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const outputGain = isElectricPiano ? ELECTRIC_PIANO_OUTPUT_GAIN : 1;
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(isSampledKeyboard ? 5400 : 2600, startAt);
  if (isSampledKeyboard) {
    filter.frequency.exponentialRampToValueAtTime(
      1450,
      startAt + Math.max(0.25, duration * 0.82),
    );
  }
  filter.Q.setValueAtTime(0.7, startAt);
  master.gain.setValueAtTime(0.0001, startAt);
  master.gain.exponentialRampToValueAtTime(
    ((isSampledKeyboard ? 0.36 : 0.24) * outputGain) / Math.sqrt(notes.length),
    startAt + 0.018,
  );
  master.gain.exponentialRampToValueAtTime(
    ((isSampledKeyboard ? 0.035 : 0.08) * outputGain) / Math.sqrt(notes.length),
    startAt + duration * (isSampledKeyboard ? 0.72 : 0.48),
  );
  master.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  filter.connect(master);
  master.connect(audioContext.destination);

  notes.forEach((midi, noteIndex) => {
    const frequency = 440 * (2 ** ((midi - 69) / 12));
    const oscillator = audioContext.createOscillator();
    const overtone = audioContext.createOscillator();
    const noteGain = audioContext.createGain();
    const overtoneGain = audioContext.createGain();

    oscillator.type = isSampledKeyboard
      ? "triangle"
      : (noteIndex === 0 ? "sine" : "triangle");
    oscillator.frequency.setValueAtTime(frequency, startAt);
    overtone.type = isSampledKeyboard ? "triangle" : "sine";
    overtone.frequency.setValueAtTime(
      frequency * (isSampledKeyboard ? 2.014 : 2.01),
      startAt,
    );
    noteGain.gain.setValueAtTime(
      isSampledKeyboard
        ? (noteIndex === 0 ? 0.72 : 0.58)
        : (noteIndex === 0 ? 0.82 : 0.64),
      startAt,
    );
    overtoneGain.gain.setValueAtTime(
      isSampledKeyboard ? 0.19 : 0.13,
      startAt,
    );
    overtoneGain.gain.exponentialRampToValueAtTime(
      0.0001,
      startAt + duration * (isSampledKeyboard ? 0.34 : 0.45),
    );

    oscillator.connect(noteGain);
    overtone.connect(overtoneGain);
    noteGain.connect(filter);
    overtoneGain.connect(filter);

    oscillator.start(startAt);
    overtone.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
    overtone.stop(startAt + duration + 0.02);
  });
}

init();
