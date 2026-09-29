import { chromium } from "playwright";
import path from "node:path";
const DIR = "public/ui/pieces";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1600, height: 1600 }, deviceScaleFactor: 4 });
for (const n of process.argv.slice(2)) {
  await p.goto("file://" + path.resolve(DIR, n + ".html"));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  await p.locator("#piece").screenshot({ path: path.join(DIR, "png", n + ".png"), omitBackground: true });
}
await b.close();
