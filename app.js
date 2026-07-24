const EXERCISES = [
  makeExercise({
    id: "fig-1-6",
    chapter: 1,
    name: "Fig. 1.6 — базовая модель",
    source: "Chapter 1 · Fig. 1.6 · печатная стр. 9",
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
    name: "Fig. 1.7 — простая замена",
    source: "Chapter 1 · Fig. 1.7 · печатная стр. 9",
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
    name: "Fig. 1.8 — еще одна замена",
    source: "Chapter 1 · Fig. 1.8 · печатная стр. 9",
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
    name: "Fig. 1.9 — минорный II–V",
    source: "Chapter 1 · Fig. 1.9 · печатная стр. 10",
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
    name: "Fig. 1.10 — вариант с VII−7(♭5)",
    source: "Chapter 1 · Fig. 1.10 · печатная стр. 10",
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
    name: "Fig. 1.10 — вариант с V7sus4",
    source: "Chapter 1 · Fig. 1.10 · печатная стр. 10",
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
    name: "Fig. 1.11 — разрешение в III−7",
    source: "Chapter 1 · Fig. 1.11 · печатная стр. 10",
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
    name: "Fig. 1.15 — slash-бас в III−7",
    source: "Chapter 1 · Fig. 1.15 · печатная стр. 13",
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
    name: "Fig. 1.16 — расширенная замена",
    source: "Chapter 1 · Fig. 1.16 · печатная стр. 13",
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
    source: "Chapter 2 · Fig. 2.4 · печатная стр. 19",
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
    source: "Chapter 2 · Fig. 2.5 · печатная стр. 20",
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
    source: "Chapter 2 · Fig. 2.6 · печатная стр. 20",
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
    name: "Fig. 2.8 — менее активный harmonic rhythm",
    source: "Chapter 2 · Fig. 2.8 · печатная стр. 21",
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
    name: "Fig. 2.9 — терция в верхнем голосе",
    source: "Chapter 2 · Fig. 2.9 · печатная стр. 21",
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
    source: "Chapter 2 · Fig. 2.10 · печатная стр. 22",
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
    name: "Fig. 2.11 — квинта в верхнем голосе",
    source: "Chapter 2 · Fig. 2.11 · печатная стр. 22",
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
    name: "Fig. 2.12 — вариант с VII−7(♭5)",
    source: "Chapter 2 · Fig. 2.12 · печатная стр. 22",
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
    name: "Fig. 2.12 — вариант с ♭VIIMaj7",
    source: "Chapter 2 · Fig. 2.12 · печатная стр. 22",
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
    name: "Extended dominants — движение по квинтам",
    source: "Chapter 3 · вступление · печатная стр. 28",
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
    name: "Extended dominants — хроматическое снижение",
    source: "Chapter 3 · вступление · печатная стр. 28",
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
    name: "Fig. 3.2 — полная цепь extended dominants",
    source: "Chapter 3 · Fig. 3.2 · печатная стр. 29",
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
    source: "Chapter 3 · Fig. 3.4 · печатная стр. 30",
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
    name: "Fig. 3.7 — Georgia, исправленная замена",
    source: "Chapter 3 · Fig. 3.7 · печатная стр. 31",
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
    source: "Chapter 3 · Fig. 3.16 · печатная стр. 33",
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
    name: "Fig. 3.17 — dominants и minor sevenths",
    source: "Chapter 3 · Fig. 3.17 · печатная стр. 33",
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
    source: "Chapter 4 · Fig. 4.1 · печатная стр. 37",
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
    source: "Chapter 4 · Fig. 4.2 · печатная стр. 37",
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
    source: "Chapter 4 · Fig. 4.3 · печатная стр. 38",
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
    name: "Fig. 4.4 — displaced dominants и related II−7",
    source: "Chapter 4 · Fig. 4.4 · печатная стр. 38",
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
    source: "Chapter 4 · Fig. 4.6 · печатная стр. 39",
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
    source: "Chapter 4 · Fig. 4.7 · печатная стр. 39",
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
    name: "Fig. 4.8 — две tritone substitutions",
    source: "Chapter 4 · Fig. 4.8 · печатная стр. 39",
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
    name: "Exercise 5.1 — исходная форма",
    source: "Chapter 5 · Exercise 5.1 · печатная стр. 50",
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
  m6: { suffix: "−6", intervals: [0, 3, 7, 9] },
  "7": { suffix: "7", intervals: [0, 4, 7, 10] },
  "7b9": { suffix: "7(♭9)", intervals: [0, 4, 7, 10, 13] },
  "7b9b13": { suffix: "7(♭9,♭13)", intervals: [0, 4, 7, 10, 13, 20] },
  dim7: { suffix: "°7", intervals: [0, 3, 6, 9] },
  "7sus4": { suffix: "7sus4", intervals: [0, 5, 7, 10] },
};

const state = {
  exerciseIndex: 0,
  chapterFilter: "all",
  mode: "degree",
  sound: "piano",
  key: KEY_CHOICES[4],
  answers: [],
  wrongAnswers: [],
  completed: false,
  revealed: false,
  playing: false,
  playbackMode: null,
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
  sourceLabel: document.querySelector("#sourceLabel"),
  promptLabel: document.querySelector("#promptLabel"),
  chapterLabel: document.querySelector("#chapterLabel"),
  keyBadge: document.querySelector("#keyBadge"),
  matrixScroll: document.querySelector("#matrixScroll"),
  positionLegend: document.querySelector("#positionLegend"),
  answerGrid: document.querySelector("#answerGrid"),
  feedback: document.querySelector("#feedback"),
  playButton: document.querySelector("#playButton"),
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
};

let audioContext = null;
let stopTimer = null;
let previewTimer = null;
let autoNextTimer = null;
let highlightTimers = [];
let pianoAudioContext = null;
let pianoIdleTimer = null;
let mobileAudioElement = null;
let mobileAudioUnlocked = false;
let pianoSamplePromise = null;
const pianoSampleBuffers = new Map();
const pianoVoices = new Set();
const pianoKeyTimers = new Map();
const chapterQueues = new Map();
const PIANO_SUSTAIN_RATIO = 1.1;
const PIANO_RELEASE_SECONDS = 0.7;
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

function chord(degree, offset, quality, spelling = null, bassOffset = null) {
  return { degree, offset, quality, spelling, bassOffset };
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
    source: `Chapter ${chapter} · ${name.split(" — ")[0]} · печатная стр. ${page}`,
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

function init() {
  document.addEventListener("pointerdown", () => {
    requestPortraitOrientation();
    unlockMobileAudio();
  }, { once: true, capture: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) requestPortraitOrientation();
  });

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Все главы · случайно";
  ui.chapterSelect.append(allOption);

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
    state.chapterFilter = ui.chapterSelect.value;
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
  ui.reviewButton.addEventListener("click", () => playSequence(true));
  ui.showButton.addEventListener("click", showAnswer);
  ui.nextButton.addEventListener("click", nextExercise);
  ui.resetStatsButton.addEventListener("click", resetStats);
  ui.soundSelect.addEventListener("change", () => {
    cancelPlayback();
    stopPianoVoices();
    state.sound = ui.soundSelect.value;
    setFeedback(`Тембр: ${state.sound === "piano" ? "рояль" : "мягкий орган"}.`);
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
      state.chapterFilter === "all"
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
  setFeedback("Сначала прозвучит тоника, затем последовательность.");
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

function render() {
  const exercise = currentExercise();
  const positionCount = exercise.sequence.length;
  ui.matrixScroll.dataset.compact = String(positionCount >= 10);

  ui.chapterLabel.textContent = `Reharmonization Techniques · Chapter ${exercise.chapter}`;
  ui.sourceLabel.textContent = exercise.source;
  ui.promptLabel.textContent = `Определите последовательность из ${positionCount} аккордов`;
  ui.keyBadge.textContent = state.revealed ? `Тональность: ${state.key.name}` : "Тональность скрыта";

  ui.positionLegend.replaceChildren();
  ui.positionLegend.style.setProperty("--positions", positionCount);
  ui.positionLegend.style.setProperty("--matrix-width", `${98 + positionCount * 35}px`);
  ui.positionLegend.append(document.createElement("span"));
  for (let position = 0; position < positionCount; position += 1) {
    const number = document.createElement("span");
    number.textContent = String(position + 1);
    ui.positionLegend.append(number);
  }

  ui.answerGrid.replaceChildren();
  exercise.options.forEach((option, optionIndex) => {
    const row = document.createElement("div");
    row.className = "answer-row";
    row.style.setProperty("--positions", positionCount);
    row.style.setProperty("--matrix-width", `${98 + positionCount * 35}px`);
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `Прослушать аккорд ${optionLabel(option)}`);
    row.title = `Прослушать ${optionLabel(option)}`;
    const activeOptionIndex = state.activePosition === null
      ? -1
      : correctOptionIndex(state.activePosition);
    if (optionIndex === activeOptionIndex) row.classList.add("sounding");
    if (optionIndex === state.previewOptionIndex) row.classList.add("previewing");
    row.addEventListener("click", () => previewChord(option, optionIndex));
    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      previewChord(option, optionIndex);
    });

    const label = document.createElement("span");
    label.className = "answer-label";
    label.textContent = optionLabel(option);
    row.append(label);

    for (let position = 0; position < positionCount; position += 1) {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.type = "button";
      dot.title = `${optionLabel(option)}, позиция ${position + 1}`;
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
  ui.playButton.disabled = false;
  ui.playButton.classList.toggle("playing", state.playing);
  ui.playButton.textContent = state.playing ? "■" : "▶";
  ui.playButton.setAttribute(
    "aria-label",
    state.playing ? "Остановить и сбросить воспроизведение" : "Воспроизвести сначала",
  );
  ui.playButton.title = state.playing ? "Стоп" : "Воспроизвести сначала";
  ui.nextButton.disabled = false;
  updateStats();
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
      `Позиция ${position + 1}: неверно. Выберите другой аккорд.`,
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
    `Позиция ${position + 1}: верно. Решено ${solvedCount} из ${state.answers.length}.`,
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
    setFeedback("Вся последовательность определена с первой попытки.", "success");
  } else {
    setFeedback(
      `Последовательность определена. С первой попытки: ${firstTryPositions} из ${state.answers.length}.`,
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
  setFeedback("Правильная последовательность показана синим.", "success");
  render();
}

function setFeedback(message, type = "") {
  ui.feedback.textContent = message;
  ui.feedback.className = `feedback${type ? ` ${type}` : ""}`;
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
  if (!window.confirm("Сбросить всю статистику этого тренажера?")) return;
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

async function playSequence(withAnswer) {
  if (state.playing || (withAnswer && !state.revealed)) return;
  if (state.previewOptionIndex !== null) cancelPlayback();
  if (!await ensureAudioContext()) return;

  state.playing = true;
  state.playbackMode = withAnswer ? "review" : "blind";
  state.activePosition = null;
  render();

  const secondsPerChord = Number(ui.tempoSelect.value);
  const startAt = audioContext.currentTime + 0.08;
  const sustainRatio = state.sound === "piano" ? PIANO_SUSTAIN_RATIO : 0.9;
  const releaseTail = state.sound === "piano" ? PIANO_RELEASE_SECONDS : 0.02;
  const chordDuration = secondsPerChord * sustainRatio;
  const referenceDuration = chordDuration;
  const referenceGap = state.sound === "piano" ? PIANO_RELEASE_SECONDS + 0.05 : 0.55;
  const sequenceStart = startAt + referenceDuration + referenceGap;

  if (withAnswer) {
    setFeedback("Опорный аккорд: I — тоника.", "playing");
  }
  scheduleChord(tonicReferenceChord(), startAt, referenceDuration);

  currentExercise().sequence.forEach((item, index) => {
    scheduleChord(
      item,
      sequenceStart + index * secondsPerChord,
      chordDuration,
    );

    if (withAnswer) {
      const delay = Math.max(
        0,
        sequenceStart + index * secondsPerChord - audioContext.currentTime,
      );
      const timer = window.setTimeout(() => {
        state.activePosition = index;
        setFeedback(
          `Сейчас звучит ${item.degree} · позиция ${index + 1}.`,
          "playing",
        );
        render();
      }, delay * 1000);
      highlightTimers.push(timer);
    }
  });

  window.clearTimeout(stopTimer);
  stopTimer = window.setTimeout(() => {
    const wasReview = state.playbackMode === "review";
    state.playing = false;
    state.playbackMode = null;
    state.activePosition = null;
    clearHighlightTimers();
    releaseAudioContext();
    if (wasReview) {
      setFeedback("Разбор завершён. Можно прослушать его ещё раз.");
    }
    render();
  }, (
    referenceDuration
    + referenceGap
    + Math.max(0, currentExercise().sequence.length - 1) * secondsPerChord
    + chordDuration
    + releaseTail
    + 0.25
  ) * 1000);
}

function toggleMainPlayback() {
  if (state.playing || state.previewOptionIndex !== null) {
    cancelPlayback();
    setFeedback("Воспроизведение остановлено. Следующий запуск начнется сначала.");
    render();
    return;
  }
  playSequence(false);
}

async function previewChord(item, optionIndex) {
  cancelPlayback();
  if (!await ensureAudioContext()) return;

  const duration = state.sound === "piano" ? 1.65 : 1.15;
  state.previewOptionIndex = optionIndex;
  setFeedback(`Прослушивание: ${optionLabel(item)}.`, "playing");
  render();
  scheduleChord(item, audioContext.currentTime + 0.04, duration);

  previewTimer = window.setTimeout(() => {
    state.previewOptionIndex = null;
    releaseAudioContext();
    render();
  }, (duration + 0.2) * 1000);
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
    setFeedback("Этот браузер не поддерживает воспроизведение Web Audio.", "error");
    return;
  }

  await unlockMobileAudio();
  window.clearTimeout(pianoIdleTimer);
  pianoAudioContext ||= new AudioEngine();
  try {
    await pianoAudioContext.resume();
  } catch {
    setFeedback("Не удалось включить звук. Проверьте беззвучный режим iPhone.", "error");
    return;
  }

  const context = pianoAudioContext;
  const startAt = context.currentTime + 0.01;
  const isPiano = state.sound === "piano";
  const duration = isPiano ? 2.15 : 1.55;

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
  voice.overtone.type = isPiano ? "triangle" : "sine";
  voice.overtone.frequency.setValueAtTime(frequency * (isPiano ? 2.012 : 2.005), startAt);
  voice.filter.type = "lowpass";
  voice.filter.frequency.setValueAtTime(isPiano ? 5200 : 3100, startAt);
  if (isPiano) {
    voice.filter.frequency.exponentialRampToValueAtTime(1350, startAt + 1.35);
  }
  voice.filter.Q.setValueAtTime(0.65, startAt);
  voice.gain.gain.setValueAtTime(0.0001, startAt);
  voice.gain.gain.exponentialRampToValueAtTime(isPiano ? 0.28 : 0.2, startAt + 0.012);
  voice.gain.gain.exponentialRampToValueAtTime(isPiano ? 0.055 : 0.075, startAt + 0.52);
  voice.gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  voice.overtoneGain.gain.setValueAtTime(isPiano ? 0.14 : 0.08, startAt);
  voice.overtoneGain.gain.exponentialRampToValueAtTime(
    0.0001,
    startAt + (isPiano ? 0.72 : 0.48),
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
  pianoIdleTimer = window.setTimeout(() => {
    if (!pianoVoices.size) releasePianoContext();
  }, 500);
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
  if (context && context.state !== "closed") {
    context.close().catch(() => {});
  }
}

async function ensureAudioContext() {
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) {
    setFeedback("Этот браузер не поддерживает воспроизведение Web Audio.", "error");
    return false;
  }
  await unlockMobileAudio();
  audioContext ||= new AudioEngine();
  try {
    await audioContext.resume();
  } catch {
    setFeedback("Не удалось включить звук. Проверьте беззвучный режим iPhone.", "error");
    return false;
  }
  if (state.sound === "piano") {
    await ensurePianoSamples(audioContext);
  }
  return true;
}

async function ensurePianoSamples(context) {
  if (pianoSampleBuffers.size === PIANO_SAMPLE_MANIFEST.length) return true;

  pianoSamplePromise ||= Promise.all(PIANO_SAMPLE_MANIFEST.map(async (sample) => {
    const response = await fetch(sample.url);
    if (!response.ok) {
      throw new Error(`Piano sample ${sample.url}: HTTP ${response.status}`);
    }
    const encoded = await response.arrayBuffer();
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
        "Семплы рояля не загрузились; временно используется синтезированный тембр.",
        "error",
      );
      return false;
    });

  return pianoSamplePromise;
}

function nearestPianoSample(midi) {
  let nearest = PIANO_SAMPLE_MANIFEST[0];
  PIANO_SAMPLE_MANIFEST.forEach((sample) => {
    if (Math.abs(sample.midi - midi) < Math.abs(nearest.midi - midi)) {
      nearest = sample;
    }
  });
  return {
    ...nearest,
    buffer: pianoSampleBuffers.get(nearest.midi),
  };
}

function scheduleSampledPianoNotes(context, notes, startAt, duration) {
  const master = context.createGain();
  const compressor = context.createDynamicsCompressor();
  const level = Math.min(0.92, 1.28 / Math.sqrt(notes.length));
  master.gain.setValueAtTime(level, startAt);
  compressor.threshold.setValueAtTime(-14, startAt);
  compressor.knee.setValueAtTime(9, startAt);
  compressor.ratio.setValueAtTime(3, startAt);
  compressor.attack.setValueAtTime(0.003, startAt);
  compressor.release.setValueAtTime(0.22, startAt);
  master.connect(compressor);
  compressor.connect(context.destination);

  return notes.map((midi, noteIndex) => {
    const sample = nearestPianoSample(midi);
    const source = context.createBufferSource();
    const envelope = context.createGain();
    const playbackRate = 2 ** ((midi - sample.midi) / 12);
    const releaseAt = startAt + duration;

    source.buffer = sample.buffer;
    source.playbackRate.setValueAtTime(playbackRate, startAt);
    envelope.gain.setValueAtTime(0.0001, startAt);
    envelope.gain.exponentialRampToValueAtTime(
      noteIndex === 0 && notes.length > 1 ? 0.82 : 1,
      startAt + 0.008,
    );
    envelope.gain.setValueAtTime(0.9, startAt + Math.min(0.35, duration * 0.4));
    const releaseSeconds = PIANO_RELEASE_SECONDS;
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

function isAppleMobileDevice() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
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
  state.activePosition = null;
  state.previewOptionIndex = null;
  releaseAudioContext();
}

function releaseAudioContext() {
  const context = audioContext;
  audioContext = null;
  if (context && context.state !== "closed") {
    context.close().catch(() => {});
  }
}

function scheduleChord(item, startAt, duration) {
  const isPiano = state.sound === "piano";
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
    ...QUALITY[item.quality].intervals.map((interval) => upperRootMidi + interval),
  ];

  if (
    isPiano
    && pianoSampleBuffers.size === PIANO_SAMPLE_MANIFEST.length
  ) {
    scheduleSampledPianoNotes(audioContext, notes, startAt, duration);
    return;
  }

  const master = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(isPiano ? 5400 : 2600, startAt);
  if (isPiano) {
    filter.frequency.exponentialRampToValueAtTime(
      1450,
      startAt + Math.max(0.25, duration * 0.82),
    );
  }
  filter.Q.setValueAtTime(0.7, startAt);
  master.gain.setValueAtTime(0.0001, startAt);
  master.gain.exponentialRampToValueAtTime(
    (isPiano ? 0.36 : 0.24) / Math.sqrt(notes.length),
    startAt + 0.018,
  );
  master.gain.exponentialRampToValueAtTime(
    (isPiano ? 0.035 : 0.08) / Math.sqrt(notes.length),
    startAt + duration * (isPiano ? 0.72 : 0.48),
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

    oscillator.type = isPiano ? "triangle" : (noteIndex === 0 ? "sine" : "triangle");
    oscillator.frequency.setValueAtTime(frequency, startAt);
    overtone.type = isPiano ? "triangle" : "sine";
    overtone.frequency.setValueAtTime(frequency * (isPiano ? 2.014 : 2.01), startAt);
    noteGain.gain.setValueAtTime(
      isPiano ? (noteIndex === 0 ? 0.72 : 0.58) : (noteIndex === 0 ? 0.82 : 0.64),
      startAt,
    );
    overtoneGain.gain.setValueAtTime(isPiano ? 0.19 : 0.13, startAt);
    overtoneGain.gain.exponentialRampToValueAtTime(
      0.0001,
      startAt + duration * (isPiano ? 0.34 : 0.45),
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
