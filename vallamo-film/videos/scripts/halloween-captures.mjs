// The real Vallamo screens for Maya's setup montage in the Halloween film: the pricing
// page (Growth) and the setup wizard's own steps, captured at 2x from the demo app.
//   node scripts/halloween-captures.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = "public/ui/halloween";
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
await p.route(/^https?:/, (r) => r.abort());
const S = "file://" + path.resolve("public/ui/source.html");
const clean = () => p.evaluate(() => { for (const el of document.querySelectorAll("button")) if (/^\s*Review\s*$/.test(el.textContent)) el.remove(); });

await p.goto(S + "#/pricing");
await p.waitForTimeout(1500);
await clean();
await p.screenshot({ path: `${OUT}/pricing.png` });

// The wizard: press its primary action (bottom right) through each step.
const primary = () =>
  p.evaluate(() => {
    const bs = [...document.querySelectorAll("button, a, [role=button]")].filter((b) => { const r = b.getBoundingClientRect(); return r.width > 0 && !/^\s*(Back|Skip the rest for now|Review|Sign out)\s*$/.test(b.textContent); });
    bs.sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return rb.y + rb.x - (ra.y + ra.x); });
    bs[0]?.click();
    return bs[0]?.textContent.trim();
  });
await p.goto("about:blank");
await p.goto(S + "#/onboarding");
await p.waitForTimeout(1500);
const want = { "What's your website?": null, "Does this look right?": "review", "Connect your booking system": "booking", "is live": "live" };
let scanned = false;
for (let i = 0; i < 12; i++) {
  await clean();
  const txt = await p.evaluate(() => document.body.innerText);
  if (txt.includes("Found 9 services") && !scanned) { await p.screenshot({ path: `${OUT}/scan.png` }); scanned = true; }
  for (const [k, name] of Object.entries(want)) if (name && txt.includes(k) && !fs.existsSync(`${OUT}/${name}.png`)) await p.screenshot({ path: `${OUT}/${name}.png` });
  const clicked = await primary();
  if (!clicked || /Open my dashboard/.test(clicked)) break;
  await p.waitForTimeout(/Scan/.test(clicked) ? 6000 : 1800);
}
console.log(fs.readdirSync(OUT));
await b.close();
