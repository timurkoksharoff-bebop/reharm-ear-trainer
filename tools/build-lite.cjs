#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const outputRoot = path.join(projectRoot, "lite");
const liteVersion = "0.4";

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) {
    throw new Error(`Could not build Lite: missing ${label}.`);
  }
  return source.replace(search, replacement);
}

function removeCatalogTail(source, startMarker, endMarker, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`Could not build Lite: invalid ${label} boundaries.`);
  }
  return source.slice(0, start) + source.slice(end);
}

function write(relativePath, contents) {
  const target = path.join(outputRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

function copy(relativePath) {
  const source = path.join(projectRoot, relativePath);
  const target = path.join(outputRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
}

if (path.dirname(outputRoot) !== projectRoot || path.basename(outputRoot) !== "lite") {
  throw new Error("Refusing to write outside the expected Lite build directory.");
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

let liteApp = read("app.js");
liteApp = removeCatalogTail(
  liteApp,
  '  makeExercise({\n    id: "exercise-5-1",',
  "];\n\nconst REFERENCE_ANSWER_SPECS = [",
  "core catalog",
);
liteApp = removeCatalogTail(
  liteApp,
  '  ["5-1-r1",',
  "];\n\nconst EXERCISES = [",
  "reference-answer catalog",
);
liteApp = replaceRequired(
  liteApp,
  '"reharm-ear-favorites-v2"',
  '"reharm-ear-lite-favorites-v2"',
  "favorites storage key",
);
liteApp = replaceRequired(
  liteApp,
  '"reharm-ear-favorites-v1"',
  '"reharm-ear-lite-favorites-v1"',
  "legacy favorites storage key",
);
liteApp = replaceRequired(
  liteApp,
  '"reharm-ear-onboarding-v1"',
  '"reharm-ear-lite-onboarding-v1"',
  "onboarding storage key",
);
liteApp = replaceRequired(
  liteApp,
  '"reharm-ear-custom-progressions-v1"',
  '"reharm-ear-lite-custom-progressions-v1"',
  "custom progression storage key",
);
liteApp = liteApp.replaceAll('"reharm-ear-stats"', '"reharm-ear-lite-stats"');
liteApp = replaceRequired(
  liteApp,
  '"All chapters · shuffle"',
  '"Lite chapters 1–4 · shuffle"',
  "chapter shuffle label",
);
liteApp = replaceRequired(
  liteApp,
  "`Reharmonization Techniques · Chapter ${exercise.chapter}`",
  "`Reharmonization Techniques · Lite · Chapter ${exercise.chapter}`",
  "header edition label",
);

const coreSection = liteApp.slice(
  liteApp.indexOf("const CORE_EXERCISES = ["),
  liteApp.indexOf("const REFERENCE_ANSWER_SPECS = ["),
);
const referenceSection = liteApp.slice(
  liteApp.indexOf("const REFERENCE_ANSWER_SPECS = ["),
  liteApp.indexOf("const EXERCISES = ["),
);
const coreCount = (
  (coreSection.match(/\bmakeExercise\(\{/g) || []).length
  + (coreSection.match(/\bcatalogExercise\(/g) || []).length
);
const referenceCount = (referenceSection.match(/^\s+\["/gm) || []).length;
const exerciseCount = coreCount + referenceCount;

if (
  /\bchapter:\s*(?:[5-9]|1[0-6])\b/.test(coreSection)
  || /^\s+\["[^"]+",\s*(?:[5-9]|1[0-6]),/m.test(referenceSection)
) {
  throw new Error("Could not build Lite: a chapter above 4 remains in the catalog.");
}

let liteIndex = read("index.html");
liteIndex = liteIndex
  .replaceAll("Reharm Ear Trainer", "Reharm Ear Trainer Lite")
  .replaceAll("Ear Reharm Trainer", "Ear Reharm Trainer Lite")
  .replace('content="Reharm Ear"', 'content="Reharm Lite"')
  .replace(
    '<body data-atmosphere="dawn">',
    '<body data-atmosphere="dawn" data-edition="lite">',
  )
  .replace(
    '<span class="brand-subtitle">REHARM TRAINER</span>',
    '<span class="brand-subtitle">REHARM TRAINER · LITE</span>',
  )
  .replace(
    '<p class="eyebrow" id="chapterLabel">Reharmonization Techniques</p>',
    '<p class="eyebrow" id="chapterLabel">Reharmonization Techniques · Lite</p>',
  )
  .replaceAll("reharm-local-sw-cleared", "reharm-lite-local-sw-cleared");

const liteManifest = JSON.parse(read("manifest.webmanifest"));
liteManifest.id = "./";
liteManifest.name = "Reharm Ear Trainer Lite";
liteManifest.short_name = "Reharm Lite";
liteManifest.description = "A four-chapter introduction to functional harmonic ear training.";

let liteServiceWorker = read("service-worker.js");
liteServiceWorker = liteServiceWorker
  .replace(
    /^const CACHE_NAME = "[^"]+";/,
    `const CACHE_NAME = "ear-reharm-lite-v${liteVersion}";`,
  )
  .replace(
    '  "./manifest.webmanifest",',
    '  "./manifest.webmanifest",\n  "./build-info.json",',
  )
  .replaceAll(
    'key.startsWith("reharm-ear-trainer-")',
    'key.startsWith("ear-reharm-lite-")',
  );

const liteStyles = `${read("styles.css")}

body[data-edition="lite"] .brand-subtitle {
  color: #7f9b8f;
}
`;

write("app.js", liteApp);
write("index.html", liteIndex);
write("styles.css", liteStyles);
write("service-worker.js", liteServiceWorker);
write("manifest.webmanifest", `${JSON.stringify(liteManifest, null, 2)}\n`);
write("build-info.json", `${JSON.stringify({
  edition: "lite",
  version: liteVersion,
  chapters: [1, 2, 3, 4],
  exerciseCount,
}, null, 2)}\n`);

[
  "favicon.svg",
  "favicon-32.png",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "icon.svg",
  "assets/atmospheres",
  "samples/piano",
  "samples/electric-piano",
  "samples/upright-bass",
].forEach(copy);

console.log(
  `Built Reharm Ear Trainer Lite v${liteVersion}: `
  + `${exerciseCount} exercises from Chapters 1–4.`,
);
