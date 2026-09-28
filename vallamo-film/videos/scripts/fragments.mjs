// Real Vallamo UI pieces, captured at 4x from the prototype for the "bits of UI"
// film. Nothing is redrawn: each PNG is the app's own rendering of one element.
// Writes public/ui/bits/*.png and src/bits.json (sizes in UI px, channel, text).
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const SRC = "file://" + path.resolve("public/ui/source.html");
const OUT = "public/ui/bits";
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const meta = {};

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1400 }, deviceScaleFactor: 4 });
await p.route(/^https?:/, (r) => r.abort());
const go = async (url) => { await p.goto("about:blank"); await p.goto(url); await p.waitForTimeout(700); };
const freeze = () => p.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important}" });
const shot = async (locator, name, extra = {}) => {
  const box = await locator.boundingBox();
  await locator.screenshot({ path: `${OUT}/${name}.png`, omitBackground: true });
  meta[name] = { w: Math.round(box.width), h: Math.round(box.height), ...extra };
};

// ---------------------------------------------------------------- 1. incoming rows, one per enquiry
// Each row shows the customer's own first message (read from their thread), a fresh time,
// and no pill: the state of a conversation Isla has only just picked up.
const PEOPLE = [
  ["Sarah Mitchell", "now"], ["Priya Shah", "now"], ["Jasmine Cole", "now"],
  ["Imogen Johnson", "1 min"], ["Aisha Begum", "1 min"], ["Grace Morgan", "2 min"],
  ["Phoebe Ward", "2 min"], ["Zara Johnson", "3 min"], ["Melissa Cooper", "3 min"],
];
const first = {};
for (const [name] of PEOPLE) {
  await go(SRC + "#/inbox");
  await p.locator("button.relative.w-full.gap-3", { hasText: name }).first().click();
  await p.waitForTimeout(400);
  first[name] = await p.evaluate(() => {
    const g = document.querySelector(".mx-auto.max-w-\\[720px\\].space-y-3 .flex.flex-col.items-start > div");
    return g ? g.textContent.trim() : null;
  });
}
await go(SRC + "#/inbox");
await freeze();
for (const [i, [name, when]] of PEOPLE.entries()) {
  const row = p.locator("button.relative.w-full.gap-3", { hasText: name }).first();
  const channel = await row.evaluate((r, [msg, when]) => {
    r.classList.remove("bg-clay-wash");
    r.querySelector(":scope > span.absolute")?.remove(); // selected bar
    const time = r.querySelector("span.tnum"); if (time) time.textContent = when;
    const preview = r.querySelector(".line-clamp-1"); if (preview && msg) preview.textContent = msg;
    const metaRow = r.querySelector(".mt-1\\.5"); if (metaRow) [...metaRow.children].slice(0, -1).forEach((c) => c.remove());
    r.querySelector(".truncate.text-base")?.classList.replace("font-medium", "font-semibold");
    r.style.background = "transparent";
    return r.querySelector("[title]")?.getAttribute("title");
  }, [first[name], when]);
  await shot(row, `row-${i}`, { name, channel, text: first[name] });
}

// ---------------------------------------------------------------- 2. the one inbox (queue panel)
await go("file://" + path.resolve("public/ui/snaps/inbox-sarah.html"));
await p.addStyleTag({ content: '[data-film^="msg-"]{display:flex!important}' });
const queue = await p.evaluate(() => {
  const row = document.querySelector('[data-film="row-sarah"]');
  let panel = row; while (panel && panel.getBoundingClientRect().width < 330) panel = panel.parentElement;
  while (panel && panel.getBoundingClientRect().height < 900) panel = panel.parentElement;
  const r = panel.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width };
});
await p.screenshot({ path: `${OUT}/inbox-list.png`, clip: { x: queue.x, y: queue.y, width: queue.w, height: 560 }, omitBackground: true });
meta["inbox-list"] = { w: Math.round(queue.w), h: 560, rowsTop: 202 - queue.y, rowH: 86 };

// ---------------------------------------------------------------- 3. the conversation
for (const n of [1, 2, 3, 4, 5, 6]) await shot(p.locator(`[data-film="msg-${n}"]`), `msg-${n}`);
const head = p.locator("section").filter({ hasText: "Isla is handling this" }).locator("> div").first();
await shot(head, "thread-head");
// Outcome, before and after, and the appointment card.
await shot(p.locator('[data-film="outcome-pre"]'), "outcome-pre");
await p.addStyleTag({ content: '[data-film="outcome-booked"]{display:block!important}' });
await shot(p.locator('[data-film="outcome-booked"]'), "outcome-booked");
await shot(p.locator('[data-film="upcoming"] > :last-child'), "upcoming-card");

// ---------------------------------------------------------------- 4. the calendar and the booking
await go("file://" + path.resolve("public/ui/snaps/bookings.html"));
await shot(p.locator('[data-film="bk-sarah"]'), "bk-sarah");
const cal = await p.evaluate(() => {
  const blk = document.querySelector('[data-film="bk-sarah"]').getBoundingClientRect();
  const hdr = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Thursday 24 September 2026").getBoundingClientRect();
  return { blk, hdr };
});
await p.addStyleTag({ content: '[data-film="bk-sarah"]{visibility:hidden!important}' });
const calClip = { x: 286, y: cal.hdr.y - 26, width: 410, height: cal.blk.y + cal.blk.height + 34 - (cal.hdr.y - 26) };
await p.screenshot({ path: `${OUT}/calendar.png`, clip: calClip, omitBackground: true });
meta.calendar = { w: calClip.width, h: Math.round(calClip.height), slot: { x: Math.round(cal.blk.x - calClip.x), y: Math.round(cal.blk.y - calClip.y), w: Math.round(cal.blk.width), h: Math.round(cal.blk.height) } };

await go("file://" + path.resolve("public/ui/snaps/bookings-drawer.html"));
const drawer = p.locator('[data-film="drawer"]');
const dbox = await drawer.boundingBox();
await p.screenshot({ path: `${OUT}/booking-drawer.png`, clip: { x: dbox.x, y: dbox.y, width: dbox.width, height: 520 }, omitBackground: true });
meta["booking-drawer"] = { w: Math.round(dbox.width), h: 520 };

// ---------------------------------------------------------------- 5. insights cards
await p.setViewportSize({ width: 1440, height: 2400 });
await go("file://" + path.resolve("public/ui/snaps/insights.html"));
const cards = [["Enquiries", "kpi-enquiries"], ["Booked", "kpi-booked"], ["Handled without you", "kpi-handled"], ["Bookings recovered", "kpi-recovered"], ["After-hours handled", "kpi-afterhours"], ["Where conversations came from", "kpi-channels"]];
for (const [label, name] of cards) {
  const ok = await p.evaluate(([label, name]) => {
    const leaf = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === label);
    let c = leaf; while (c && !(getComputedStyle(c).borderTopWidth !== "0px" && parseFloat(getComputedStyle(c).borderRadius) >= 10)) c = c.parentElement;
    if (c) c.dataset.bit = name; return !!c;
  }, [label, name]);
  if (ok) await shot(p.locator(`[data-bit="${name}"]`), name);
}

fs.writeFileSync("src/bits.json", JSON.stringify(meta, null, 1));
console.log(JSON.stringify(meta, null, 0));
await b.close();

// ---------------------------------------------------------------- 6. inbox header + Sarah selected
{
  const b2 = await chromium.launch();
  const q = await b2.newPage({ viewport: { width: 1440, height: 1400 }, deviceScaleFactor: 4 });
  await q.route(/^https?:/, (r) => r.abort());
  await q.goto("file://" + path.resolve("public/ui/snaps/inbox-sarah.html"));
  await q.waitForTimeout(300);
  const m2 = JSON.parse(fs.readFileSync("src/bits.json", "utf8"));
  await q.screenshot({ path: `${OUT}/inbox-head.png`, clip: { x: 253, y: 101, width: 344, height: 101 }, omitBackground: true });
  m2["inbox-head"] = { w: 344, h: 101 };
  const row = q.locator('[data-film="row-sarah"]');
  await row.screenshot({ path: `${OUT}/row-0-selected.png`, omitBackground: true });
  m2["row-0-selected"] = { w: 343, h: 86 };
  fs.writeFileSync("src/bits.json", JSON.stringify(m2, null, 1));
  await b2.close();
}
