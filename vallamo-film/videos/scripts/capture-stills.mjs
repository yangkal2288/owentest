// Style-frame captures: real Vallamo screens at 2x, staged with the same
// presentation-only edits as snapshot.mjs (no "Design review" button, no
// launch banner). Output: public/ui/bits/screen-*.png
import { chromium } from "playwright";
import path from "node:path";

const exe = process.env.CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1440, height: 1400 }, deviceScaleFactor: 2 });
await p.route(/^https?:/, (r) => r.abort());

async function clean() {
  await p.evaluate(() => {
    for (const el of document.querySelectorAll("button")) if (el.textContent.trim() === "Design review") el.remove();
    const hello = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.includes("Welcome to the new Vallamo"));
    hello?.closest(".relative.shrink-0.border-b")?.remove();
  });
  await p.waitForTimeout(300);
}

// Week view, week of Thu 24 Sep 2026: the whole window, and the calendar card alone.
await p.goto("file://" + path.resolve("public/ui/source.html#/bookings")); await p.waitForTimeout(1200);
await clean();
await p.locator("button", { hasText: /^Week$/ }).first().click(); await p.waitForTimeout(800);
await p.screenshot({ path: "public/ui/bits/screen-week.png" });

// week-card.png is cropped from screen-week.png: css rect x285 y385 w1114 h769 (block rects: scripts/measure-week.mjs).

// Inbox, staged snapshot (top rows empty is done in-film; here the full screen).
await p.goto("file://" + path.resolve("public/ui/snaps/inbox-before.html")); await p.waitForTimeout(600);
await p.screenshot({ path: "public/ui/bits/screen-inbox.png" });
// Sarah's conversation (the hero), staged snapshot.
await p.goto("file://" + path.resolve("public/ui/snaps/inbox-sarah.html")); await p.waitForTimeout(600);
await p.screenshot({ path: "public/ui/bits/screen-sarah.png" });
await b.close();
