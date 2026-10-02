// Real Vallamo UI pieces for the founder ad (films/founder): Owen on camera, the product in
// between. Captured like scripts/meta-pieces.mjs: the app's own markup and CSS, cloned from the
// inbox snapshot (Sarah's Instagram conversation) and staged with the ad's lip filler enquiry.
// Presentation-only staging: the contact, the message texts and times, the upcoming card and
// one week-view block. The price and duration are the demo clinic's own
// (Dermal Filler Treatment, 1ml: £240, 45 min); 2:00pm and 4:30pm are free in its Thursday.
// Run after scripts/pieces.mjs, meta-pieces.mjs and growth-week.mjs, then scripts/pieces-png.mjs.
//   node scripts/founder-pieces.mjs && node scripts/pieces-png.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = "public/ui/pieces";
const SNAP = "file://" + path.resolve("public/ui/snaps/inbox-sarah.html");
const meta = JSON.parse(fs.readFileSync("src/pieces.json", "utf8"));
for (const k of Object.keys(meta)) if (k.startsWith("f-")) delete meta[k];

const b = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1400 } });
await p.route(/^https?:/, (r) => r.abort());

async function go(url) {
  await p.goto("about:blank");
  await p.goto(url);
  await p.waitForTimeout(900);
  await p.addStyleTag({ content: '[data-film^="msg-"]{display:flex!important}[data-film="outcome-booked"]{display:block!important}' });
  await p.waitForTimeout(100);
}

/** Serialise the element `find` returns (in page) as a piece, as scripts/meta-pieces.mjs does. */
async function piece(name, find) {
  const res = await p.evaluate((findSrc) => {
    const el = new Function(`return (${findSrc})`)()();
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const clone = el.cloneNode(true);
    // Owen: no em dashes on screen.
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) n.textContent = n.textContent.replace(/\s*—\s*/g, ", ");
    const cs = getComputedStyle(el.parentElement ?? el);
    const inherit = ["color", "font-family", "font-size", "font-weight", "line-height", "letter-spacing", "-webkit-font-smoothing"].map((k) => `${k}:${cs.getPropertyValue(k)}`).join(";");
    const attrs = [...document.documentElement.attributes].map((a) => `${a.name}="${a.value}"`).join(" ");
    const doc = `<!doctype html>
<html ${attrs} data-theme="light">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="app.css">
<style>*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
html,body{margin:0!important;padding:0!important;background:transparent!important;overflow:hidden!important;min-height:0!important;height:auto!important}
#piece{${inherit};width:${r.width}px;padding:0px;box-sizing:content-box}</style>
<style id="film-dyn"></style>
</head>
<body><div id="piece">${clone.outerHTML}</div></body>
</html>`;
    return { doc, w: Math.round(r.width), h: Math.round(r.height) };
  }, find);
  if (!res) throw new Error("piece not found: " + name);
  fs.writeFileSync(path.join(OUT, name + ".html"), res.doc);
  meta[name] = { w: res.w, h: res.h };
  console.log(name, res.w, res.h);
}

// ---------------------------------------------------------------- the conversation, in the thread's own bubbles
// [who, text, time]: who is "user" (Ellie, left, msg-1's bubble) or "isla" (right, msg-2's, with Read and "Why this reply?").
const MSGS = {
  "f-u1": ["user", "Hi, do you have anything free Thursday for lip filler?", "9:04pm"],
  "f-dots": ["isla", "•••", null],
  "f-i1": ["isla", "Hi Ellie! Lip filler (1ml) is £240 and takes about 45 minutes. On Thursday I have 2:00pm or 4:30pm with Dr Maya. Which suits you?", "9:04pm"],
  "f-u2": ["user", "2pm please.", "9:05pm"],
  "f-i2": ["isla", "You're booked with Dr Maya for lip filler on Thursday at 2:00pm. A confirmation has just been sent.", "9:05pm"],
};
await go(SNAP);
for (const [name, [who, text, time]] of Object.entries(MSGS)) {
  await p.evaluate(({ who, text, time }) => {
    const tpl = document.querySelector(`[data-film="${who === "user" ? "msg-1" : "msg-2"}"]`);
    const el = tpl.cloneNode(true);
    el.removeAttribute("data-film");
    el.id = "staged";
    const bubble = el.children[0];
    bubble.textContent = text;
    const metaRow = el.children[1];
    if (time === null) {
      // Isla typing: her empty bubble, no meta row. The film draws the three dots in it, moving.
      metaRow.remove();
      bubble.innerHTML = "&nbsp;";
      bubble.style.width = "68px";
    } else {
      if (who === "user") metaRow.children[0].textContent = "Ellie";
      metaRow.children[1].textContent = time;
    }
    document.getElementById("staged")?.remove();
    tpl.parentElement.appendChild(el);
  }, { who, text, time });
  await piece(name, `() => document.getElementById("staged")`);
  // Where the bubble sits in the piece (css px), for its shadow and the typing dots.
  meta[name].bubble = await p.evaluate(() => {
    const el = document.getElementById("staged");
    const o = el.getBoundingClientRect();
    const r = el.children[0].getBoundingClientRect();
    return { x: Math.round(r.x - o.x), y: Math.round(r.y - o.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
}

// ---------------------------------------------------------------- the thread header: Ellie on Instagram
{
  await go(SNAP);
  await p.evaluate(() => {
    const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
    const nameEl = [...document.querySelectorAll("header span")].find((e) => own(e) === "Sarah Mitchell");
    const head = nameEl.closest("header");
    head.id = "staged-head";
    // Only the contact: avatar (with its Instagram badge), name, status. The thread's controls stay in the app.
    const avatar = head.querySelector(":scope > .avatar");
    const contact = nameEl.closest(".min-w-0.flex-1");
    for (const c of [...head.children]) if (c !== avatar && c !== contact) c.remove();
    head.style.borderBottom = "0";
    head.style.width = "fit-content";
    head.style.paddingRight = "28px";
    // Not booked yet: no "Booked" pill (the app shows it at 2xl widths).
    contact.querySelector(".pill")?.remove();
    const walker = document.createTreeWalker(head, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const s = n.textContent.trim();
      if (s === "Sarah Mitchell") n.textContent = "Ellie Hart";
      else if (s === "SM") n.textContent = "EH";
      else if (s.includes("@")) n.textContent = n.textContent.replace(/\s*·?\s*@\S+/, "");
    }
    // Drop a separator left dangling where the handle was.
    const status = contact.children[1];
    while (status.lastChild && status.lastChild.nodeType === 3 && /^[\s·]*$/.test(status.lastChild.textContent)) status.lastChild.remove();
    const last = status.lastElementChild;
    if (last && last === status.lastChild && last.childElementCount === 0 && /^[\s·]*$/.test(last.textContent)) last.remove();
    for (const e of head.querySelectorAll(".truncate")) e.classList.remove("truncate");
  });
  await piece("f-head", `() => document.getElementById("staged-head")`);
}

// ---------------------------------------------------------------- the upcoming card (the booking that flies into the diary)
await go(SNAP);
await p.evaluate(() => {
  const up = document.querySelector('[data-film="upcoming"] > :last-child');
  const walker = document.createTreeWalker(up, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const s = n.textContent.trim();
    if (s === "Anti-Wrinkle Consultation") n.textContent = "Lip Filler (1ml)";
    else if (s.startsWith("6:00pm")) n.textContent = "2:00pm · Dr Maya Rahman";
  }
});
await piece("f-upcoming", `() => document.querySelector('[data-film="upcoming"] > :last-child')`);
await b.close();

// ---------------------------------------------------------------- Ellie's block for the week view (g-wk, Thursday 2:00 to 2:45pm)
// The week view's own confirmed-booking button, as scripts/growth-week.mjs builds its blocks.
const week = fs.readFileSync(`${OUT}/week.html`, "utf8");
const head = week.slice(0, week.indexOf("<body>")).replace(/width:1114px/, "width:142px");
const h = Math.round((45 / 60) * 64) - 3;
fs.writeFileSync(
  `${OUT}/f-bk.html`,
  `${head}<body><div id="piece"><button class="relative block w-full overflow-hidden rounded-lg border-l-[3px] px-2 py-1 text-left" style="height: ${h}px; background: var(--sage-soft); border-color: var(--sage);"><div class="truncate text-xs font-semibold text-ink">Ellie Hart</div><div class="truncate text-2xs text-ink-2">2:00pm · Lip filler</div></button></div></body>\n</html>`,
);
meta["f-bk"] = { w: 142, h };
console.log("f-bk", 142, h);

fs.writeFileSync("src/pieces.json", JSON.stringify(meta, null, 1));
