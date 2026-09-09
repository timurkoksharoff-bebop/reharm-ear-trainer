const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const textLayerPath = path.join(root, "assets/brand/ear-trainer-lockup.svg");
const markPath = path.join(root, "assets/brand/ear-bear-mark-approved.png");
const outputPath = path.join(root, "assets/brand/ear-trainer-lockup-approved.svg");

const textLayer = fs.readFileSync(textLayerPath, "utf8");
const mark = fs.readFileSync(markPath).toString("base64");
const embeddedMark = [
  "  <image",
  '    x="24"',
  '    y="8"',
  '    width="235"',
  '    height="312"',
  '    preserveAspectRatio="xMidYMid meet"',
  `    href="data:image/png;base64,${mark}"`,
  "  />",
].join("\n");

if (!textLayer.includes("</svg>")) {
  throw new Error("The logo text layer is not a complete SVG document.");
}

fs.writeFileSync(outputPath, textLayer.replace("</svg>", `${embeddedMark}\n</svg>`));
console.log(path.relative(root, outputPath));
