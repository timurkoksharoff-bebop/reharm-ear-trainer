#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const liteRoot = path.join(projectRoot, "lite");
const read = (relativePath) => fs.readFileSync(path.join(liteRoot, relativePath), "utf8");

const app = read("app.js");
const index = read("index.html");
const manifest = JSON.parse(read("manifest.webmanifest"));
const serviceWorker = read("service-worker.js");
const buildInfo = JSON.parse(read("build-info.json"));

new vm.Script(app, { filename: "lite/app.js" });

assert.deepEqual(buildInfo.chapters, [1, 2, 3, 4]);
assert.equal(buildInfo.exerciseCount, 62);
assert.match(index, /Reharm Ear Trainer Lite/);
assert.match(index, /REHARM TRAINER · LITE/);
assert.equal(manifest.name, "Reharm Ear Trainer Lite");
assert.equal(manifest.short_name, "Reharm Lite");
assert.equal(manifest.id, "./");
assert.match(serviceWorker, /ear-reharm-lite-v0\.1/);
assert.doesNotMatch(serviceWorker, /reharm-ear-trainer-v0\.24/);
assert.match(app, /reharm-ear-lite-favorites-v2/);
assert.match(app, /reharm-ear-lite-stats/);
assert.match(app, /Lite chapters 1–4 · shuffle/);
assert.match(app, /Reharmonization Techniques · Lite · Chapter/);

const coreSection = app.slice(
  app.indexOf("const CORE_EXERCISES = ["),
  app.indexOf("const REFERENCE_ANSWER_SPECS = ["),
);
const referenceSection = app.slice(
  app.indexOf("const REFERENCE_ANSWER_SPECS = ["),
  app.indexOf("const EXERCISES = ["),
);
assert.doesNotMatch(coreSection, /\bchapter:\s*(?:[5-9]|1[0-6])\b/);
assert.doesNotMatch(
  referenceSection,
  /^\s+\["[^"]+",\s*(?:[5-9]|1[0-6]),/m,
);
assert.match(coreSection, /id: "fig-4-8"/);
assert.match(referenceSection, /\["4-4-r2",\s*4,/);

const appFilesSource = serviceWorker.match(
  /const APP_FILES = (\[[\s\S]*?\]);/,
);
assert.ok(appFilesSource, "Could not read the Lite service-worker file list.");
const appFiles = vm.runInNewContext(appFilesSource[1]);
for (const relativeUrl of appFiles) {
  const relativePath = relativeUrl === "./"
    ? "index.html"
    : relativeUrl.replace(/^\.\//, "");
  assert.ok(
    fs.existsSync(path.join(liteRoot, relativePath)),
    `Missing Lite offline file: ${relativeUrl}`,
  );
}

console.log(
  "Lite check passed: 62 exercises, Chapters 1–4 only, isolated storage and offline cache.",
);
