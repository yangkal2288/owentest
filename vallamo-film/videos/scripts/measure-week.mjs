// Rects (css px, 1440x1400 viewport) of the booking blocks in the week view.
import { chromium } from "playwright";
import path from "node:path";
const b = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1400 } });
await p.route(/^https?:/, (r) => r.abort());
await p.goto("file://" + path.resolve("public/ui/source.html#/bookings")); await p.waitForTimeout(1200);
await p.evaluate(() => {
  for (const el of document.querySelectorAll("button")) if (el.textContent.trim() === "Design review") el.remove();
  const hello = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.includes("Welcome to the new Vallamo"));
  hello?.closest(".relative.shrink-0.border-b")?.remove();
});
await p.locator("button", { hasText: /^Week$/ }).first().click(); await p.waitForTimeout(800);
const rects = await p.evaluate(() => {
  const head = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "21 Sep – 27 Sep");
  const out = {};
  for (const el of document.querySelectorAll("button, a, div")) {
    const r = el.getBoundingClientRect();
    if (r.y < 540 || r.height < 18 || r.height > 60 || r.width > 160 || r.width < 30) continue;
    const t = el.textContent.trim();
    if (!/^[A-Z][a-z]/.test(t) || el.querySelector("button")) continue;
    const key = t.slice(0, 40);
    if (!out[key] || out[key].w < r.width) out[key] = { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  }
  return out;
});
console.log(JSON.stringify(rects, null, 1));
await b.close();
