// Captures the real Vallamo UI (public/ui/source.html) as static DOM snapshots
// for the film. Each snapshot is the app's own rendered markup + its own CSS,
// with scripts removed and CSS animation/transition switched off, so every
// frame of motion comes from Remotion. Staging edits are listed in STAGING.md
// and kept to presentation only (order, visibility, preview text, times).
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const SRC = "file://" + path.resolve("public/ui/source.html");
const OUT = path.resolve("public/ui/snaps");
const SHOTS = path.resolve("out/snaps");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
await page.route(/^https?:/, (r) => r.abort()); // widget.js etc: never contact production

async function go(hash) {
  await page.goto("about:blank"); // a hash-only change would keep the previous state's DOM edits
  await page.goto(SRC + hash);
  await page.waitForTimeout(900);
}

// ---------------------------------------------------------------- shared staging
async function common() {
  await page.evaluate(() => {
    const leaf = (t) => [...document.querySelectorAll("body *")].filter((e) => e.childElementCount === 0 && e.textContent.trim() === t);
    // Not in the deployed product: the prototype's "Design review" control.
    for (const b of document.querySelectorAll("button")) if (b.textContent.trim() === "Design review") b.remove();
    // Launch banner ("Welcome to the new Vallamo… Take the tour"): not part of the steady-state product.
    const hello = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.includes("Welcome to the new Vallamo"));
    hello?.closest(".relative.shrink-0.border-b")?.remove();
    // Nav: Inbox waiting badge (we stage a quiet inbox with nothing waiting on the owner).
    const inboxNav = [...document.querySelectorAll("a")].find((a) => a.textContent.trim().startsWith("Inbox") && a.getAttribute("href") === "#/inbox");
    if (inboxNav) for (const s of inboxNav.querySelectorAll("span")) if (/^\d+$/.test(s.textContent.trim())) s.remove();
    void leaf;
  });
}

async function openDetails() {
  const b = page.locator("button[aria-label='Show details']");
  if (await b.count()) { await b.first().click(); await page.waitForTimeout(500); }
}

// Inbox list: hide the owner's waiting group, lift three fresh enquiries to the top.
async function stageInboxList() {
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll("button.relative.w-full.gap-3")].filter((b) => b.querySelector(".avatar"));
    const nameOf = (b) => b.querySelector("span.truncate")?.textContent.trim();
    const list = rows[0].parentElement;
    const headers = [...list.children].filter((c) => /^(Waiting on you|Isla has these|Conversations)/.test(c.textContent.trim()));
    // Waiting group = rows between the first header and the second.
    const [waitHdr, islaHdr] = headers;
    if (waitHdr && islaHdr) {
      let e = waitHdr.nextElementSibling;
      while (e && e !== islaHdr) { const n = e.nextElementSibling; e.remove(); e = n; }
      waitHdr.remove();
      // With nothing waiting the product titles the group "Conversations".
      islaHdr.childNodes[0].textContent = "Conversations ";
      const count = islaHdr.querySelector(".tnum"); if (count) count.textContent = "219";
    }
    const pick = (name, pred = () => true) => rows.find((r) => nameOf(r) === name && pred(r));
    const fresh = [
      ["sarah", pick("Sarah Mitchell"), "Hi, do you have anything after 5:30 this week for an anti-wrinkle consultation? It'd be my first time.", "now"],
      // Website: Jasmine Cole's own latest message, as the prototype holds it.
      ["web", pick("Jasmine Cole"), null, "1 min"],
      ["priya", pick("Priya Shah"), "Hi, I’d like some advice for pigmentation and uneven skin tone. Do you have any Saturday appointments?", "2 min"],
    ];
    const hdr = [...list.children].find((c) => c.textContent.trim().startsWith("Conversations"));
    let anchor = hdr.nextElementSibling;
    for (const [key, row, first, when] of fresh) {
      if (!row) throw new Error("row missing " + key);
      row.dataset.film = "row-" + key;
      const time = row.querySelector("span.tnum"); if (time) time.textContent = when;
      const preview = row.querySelector(".line-clamp-1"); if (preview && first) preview.textContent = first;
      // A conversation Isla is still handling has no pill and no rating yet: service label only.
      const meta = row.querySelector(".mt-1\\.5");
      if (meta) { const kids = [...meta.children]; kids.slice(0, -1).forEach((c) => c.remove()); }
      list.insertBefore(row, anchor);
    }
    // Arrival order top-down: Sarah (newest), Lucy, Priya.
    const s = list.querySelector('[data-film="row-sarah"]');
    list.insertBefore(s, hdr.nextElementSibling);
  });
}

// ---------------------------------------------------------------- serialise
async function save(name) {
  await page.mouse.move(1, 1399); await page.waitForTimeout(250); // no hover states or tooltips
  await page.evaluate(() => { for (const e of document.querySelectorAll("*")) if (e.scrollTop) e.scrollTop = 0; });
  const html = await page.evaluate(() => {
    const doc = document.documentElement.cloneNode(true);
    doc.querySelectorAll("script, link[rel=icon], noscript").forEach((s) => s.remove());
    doc.setAttribute("data-theme", "light");
    const head = doc.querySelector("head");
    const freeze = document.createElement("style");
    freeze.textContent = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
*{scrollbar-width:none!important}*::-webkit-scrollbar{display:none!important}
html,body{overflow:hidden!important}`;
    head.appendChild(freeze);
    const dyn = document.createElement("style"); dyn.id = "film-dyn"; head.appendChild(dyn);
    return "<!doctype html>\n" + doc.outerHTML;
  });
  fs.writeFileSync(path.join(OUT, name + ".html"), html);
  await page.screenshot({ path: path.join(SHOTS, name + ".png") });
  console.log("saved", name, (html.length / 1024).toFixed(0) + " KB");
}

// ---------------------------------------------------------------- states
// 1. Inbox before the click: an earlier, finished conversation is open.
await go("#/inbox/" + (await findId("Aisha Begum")));
await openDetails();
await common();
await stageInboxList();
await save("inbox-before");

// 2. Sarah's conversation, details open; pre-booking variants injected beside the booked ones.
const preOutcome = await (async () => {
  // Borrow the product's own "In progress" outcome block from a conversation that has no outcome yet.
  await go("#/inbox/" + (await findId("Megan Hall")));
  await openDetails();
  return page.evaluate(() => {
    const h = [...document.querySelectorAll("aside *, section *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Outcome");
    const box = h?.nextElementSibling;
    return box ? box.outerHTML : null;
  });
})();
await go("#/inbox/cv_0001");
await openDetails();
await common();
await stageInboxList();
await page.evaluate((preOutcome) => {
  const leaf = (t) => [...document.querySelectorAll("body *")].filter((e) => e.childElementCount === 0 && e.textContent.trim() === t);
  const startsLeaf = (t) => [...document.querySelectorAll("body *")].filter((e) => e.childElementCount === 0 && e.textContent.trim().startsWith(t));
  // Thread: tag each message group in order.
  const thread = document.querySelector(".mx-auto.max-w-\\[720px\\].space-y-3");
  const groups = [...thread.querySelectorAll(".flex.flex-col.items-start, .flex.flex-col.items-end")];
  groups.forEach((g, i) => (g.dataset.film = "msg-" + (i + 1)));
  const sep = [...thread.querySelectorAll(".my-4")][0]; if (sep) sep.childNodes.forEach((n) => { if (n.nodeType === 3 && n.textContent.trim() === "Yesterday") n.textContent = "Today"; });
  // Details: drop the rating row (a live conversation has not been rated).
  const rating = leaf("Customer rating")[0]; if (rating) rating.parentElement.remove();
  // Outcome: tag the booked block, add the in-progress one in the same slot.
  const oh = leaf("Outcome")[0];
  const booked = oh.nextElementSibling; booked.dataset.film = "outcome-booked";
  const summary = booked.nextElementSibling; if (summary && /After-hours/.test(summary.textContent)) summary.dataset.film = "outcome-summary";
  if (preOutcome) {
    const wrap = document.createElement("div"); wrap.innerHTML = preOutcome;
    const pre = wrap.firstElementChild; pre.dataset.film = "outcome-pre";
    // The product's copy for a conversation with no outcome yet (in_progress).
    const t = [...pre.querySelectorAll("*")].filter((e) => e.childElementCount === 0 && e.textContent.trim());
    if (t[0]) t[0].textContent = "In progress"; if (t[1]) t[1].textContent = "No outcome recorded yet";
    booked.parentElement.insertBefore(pre, booked);
  }
  // Upcoming booking card + the "Booking made" activity entry.
  const up = leaf("Upcoming")[0];
  if (up) {
    up.parentElement.dataset.film = "upcoming";
    const card = [...up.parentElement.querySelectorAll("*")].find((e) => e !== up && /THU/.test(e.textContent) && /Anti-Wrinkle/.test(e.textContent) && getComputedStyle(e).borderTopWidth !== "0px");
    if (card) card.dataset.film = "upcoming-card";
  }
  const bm = startsLeaf("Booking made")[0]; if (bm) bm.parentElement.dataset.film = "activity-booked";
}, preOutcome);
await save("inbox-sarah");

// 3. Bookings, Thursday 24 September (Day view).
await go("#/bookings");
for (let i = 0; i < 3; i++) { await page.locator("button[aria-label='Next']").first().click().catch(() => {}); await page.waitForTimeout(200); }
await common();
await page.evaluate(() => {
  const blk = [...document.querySelectorAll("button[aria-label]")].find((b) => /with Sarah Mitchell/.test(b.getAttribute("aria-label")));
  if (!blk) throw new Error("Sarah block missing"); blk.dataset.film = "bk-sarah";
  const stat = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Booked by Isla this week");
  let card = stat; while (card && !/^Booked by Isla this week\s*\d+/.test(card.textContent.trim())) card = card.parentElement;
  const num = card && [...card.querySelectorAll("*")].find((e) => e.childElementCount === 0 && /^\d+$/.test(e.textContent.trim()));
  if (!num) throw new Error("stat missing"); num.dataset.film = "stat-isla-week";
});
await save("bookings");
// 3b. The booking drawer for Sarah's appointment.
await page.locator("button[aria-label*='with Sarah Mitchell']").first().click();
await page.waitForTimeout(600);
await common();
await page.evaluate(() => {
  const title = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Anti-Wrinkle Consultation" && getComputedStyle(e).fontFamily.includes("Playfair"));
  let d = title; while (d && getComputedStyle(d).position !== "fixed") d = d.parentElement;
  if (!d) throw new Error("drawer not found");
  // d is the full-screen fixed layer; inside it: the scrim (full size) and the panel (right edge).
  const all = [...d.querySelectorAll("*")];
  const panel = all.find((e) => { const r = e.getBoundingClientRect(); return r.x > 900 && r.height > 1000 && e.contains(title); });
  const scrim = all.find((e) => { const r = e.getBoundingClientRect(); return r.width >= 1400 && r.height >= 1300 && !e.contains(title); });
  if (!panel) throw new Error("panel not found");
  panel.dataset.film = "drawer";
  if (scrim) scrim.dataset.film = "scrim"; else d.dataset.film = "drawer-layer";
});
await save("bookings-drawer");

// 4. Insights.
await go("#/insights");
await common();
// Period-over-period deltas read as performance claims; the demo data is fictional.
await page.evaluate(() => {
  for (const e of [...document.querySelectorAll("body *")]) {
    const t = e.textContent.trim();
    if (e.childElementCount <= 3 && /^(↑|↓)?\s?[+−-]?[\d.]+(%| pts)(\s?vs previous( period)?)?$/.test(t) && e.getBoundingClientRect().height < 30) e.style.visibility = "hidden";
  }
});
// The page's scroller, so the film can scroll it like a person would.
await page.evaluate(() => {
  const worth = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "What Isla is worth");
  let sc = worth; while (sc && !/(auto|scroll)/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
  if (!sc) throw new Error("scroller not found");
  sc.firstElementChild.dataset.film = "scroll-content";
});
await save("insights");

await browser.close();

async function findId(name) {
  await go("#/inbox");
  const id = await page.evaluate((name) => {
    // Conversation ids live in the app's data; resolve by clicking the row and reading the route.
    return name;
  }, name);
  await page.getByText(name, { exact: true }).first().click();
  await page.waitForTimeout(400);
  const hash = await page.evaluate(() => location.hash);
  void id;
  return hash.split("/").pop();
}
