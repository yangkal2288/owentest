// Measures the static snapshots at the film's UI viewport (1440x1400) and writes
// src/layout.json: the rects the camera and cursor aim at. Never guess positions.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const VIEW = { width: 1440, height: 1400 };
const b = await chromium.launch();
const p = await b.newPage({ viewport: VIEW });
await p.route(/^https?:/, (r) => r.abort());

const out = { view: VIEW, snaps: {} };
const leafTargets = {
  "inbox-sarah": ["Outcome", "Upcoming", "Activity", "Today"],
  bookings: ["Thursday 24 September 2026", "Booked by Isla this week", "6pm", "5pm"],
  "bookings-drawer": ["Booked by", "Confirmed"],
  insights: ["Enquiries", "Booked", "Handled without you", "What Isla is worth", "Bookings recovered", "Conversations over time"],
  "inbox-before": ["Conversations"],
};
for (const name of ["inbox-before", "inbox-sarah", "bookings", "bookings-drawer", "insights"]) {
  await p.goto("file://" + path.resolve(`public/ui/snaps/${name}.html`));
  await p.waitForTimeout(250);
  out.snaps[name] = await p.evaluate((leaves) => {
    const r = (e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
    const res = {};
    for (const e of document.querySelectorAll("[data-film]")) res[e.dataset.film] = r(e);
    for (const t of leaves) {
      const e = [...document.querySelectorAll("body *")].find((x) => x.childElementCount === 0 && x.textContent.trim() === t && x.getBoundingClientRect().width > 0);
      if (e) res["text:" + t] = r(e);
    }
    return res;
  }, leafTargets[name] || []);
}
fs.writeFileSync("src/layout.json", JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 0).slice(0, 3000));
await b.close();
