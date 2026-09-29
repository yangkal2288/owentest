import { chromium } from "playwright";
import path from "node:path";
const OUT = process.env.OUT;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.route(/^https?:/, (r) => r.abort());
const S = "file://" + path.resolve("public/ui/source.html");
for (const r of ["#/signup", "#/pricing", "#/onboarding", "#/settings/billing", "#/channels/website"]) {
  await p.goto("about:blank"); await p.goto(S + r); await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}/r-${r.replace(/[#/]/g, "_")}.png` });
  console.log(r, p.url(), (await p.evaluate(() => document.body.innerText.slice(0, 200))).replace(/\n/g, " | "));
}
await b.close();
