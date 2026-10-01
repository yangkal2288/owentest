// Renders the story highlights (About, Demo, FAQ) and their covers to deliverables/instagram/stories.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("../deliverables/instagram/stories");
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const COUNTS = { about: 8, demo: 8, faq: 10 };
const NAMES = { about: "About", demo: "Demo", faq: "FAQ" };
const only = process.argv[2];

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const jobs = [];
for (const [set, n] of Object.entries(COUNTS)) {
  if (only && only !== set) continue;
  mkdirSync(`${OUT}/${NAMES[set]}`, { recursive: true });
  jobs.push({ id: "Highlight", props: { which: set }, file: `${OUT}/${NAMES[set]}/00-${NAMES[set]}-highlight-cover.png` });
  for (let i = 0; i < n; i++) jobs.push({ id: "Story", props: { set, i }, file: `${OUT}/${NAMES[set]}/${String(i + 1).padStart(2, "0")}-${NAMES[set]}-story.png` });
}
for (const j of jobs) {
  const composition = await selectComposition({ serveUrl, id: j.id, inputProps: j.props, browserExecutable });
  await renderStill({ serveUrl, composition, inputProps: j.props, output: j.file, browserExecutable });
  console.log(path.relative(OUT, j.file));
}
