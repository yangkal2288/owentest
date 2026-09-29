import { chromium } from "playwright";
import path from "node:path";
const OUT = process.env.OUT;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.route(/^https?:/, (r) => r.abort());
const S = "file://" + path.resolve("public/ui/source.html");
await p.goto(S + "#/onboarding"); await p.waitForTimeout(1500);
for (let i = 0; i < 16; i++) {
  await p.screenshot({ path: `${OUT}/w-${String(i).padStart(2, "0")}.png` });
  const txt = (await p.evaluate(() => document.body.innerText.slice(0, 120))).replace(/\n/g, " | ");
  console.log(i, txt);
  // The primary action: the lowest, right-most visible button that isn't Back/Skip/Review.
  const ok = await p.evaluate(() => {
    const bs = [...document.querySelectorAll("button, a, [role=button]")].filter((b) => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !/^\\s*(Back|Skip the rest for now|Review|Sign out)\\s*$/.test(b.textContent); });
    bs.sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return rb.y + rb.x - (ra.y + ra.x); });
    if (!bs.length) return null;
    const t = bs[0].textContent.trim(); bs[0].click(); return t;
  });
  console.log("  clicked:", ok);
  if (!ok) break;
  await p.waitForTimeout(ok.includes("Scan") ? 6000 : 1800);
}
await b.close();
