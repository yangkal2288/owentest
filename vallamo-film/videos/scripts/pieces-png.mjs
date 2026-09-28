// Renders every live piece (public/ui/pieces/*.html) to a transparent 4x PNG
// (public/ui/pieces/png/*.png). The film shows these for anything that moves:
// a live iframe snaps to whole pixels, so a slow glide stutters; an image
// moves at sub-pixel precision. Same real markup and CSS, same real edges.
//   node scripts/pieces-png.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const DIR = "public/ui/pieces";
fs.mkdirSync(path.join(DIR, "png"), { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1600, height: 1600 }, deviceScaleFactor: 4 });
for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith(".html"))) {
  await p.goto("file://" + path.resolve(DIR, f));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  await p.locator("#piece").screenshot({ path: path.join(DIR, "png", f.replace(".html", ".png")), omitBackground: true });
  console.log(f);
}
await b.close();
