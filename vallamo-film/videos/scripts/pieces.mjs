// Real Vallamo UI pieces as live DOM, not screenshots. Each piece is the app's
// own markup for one element (cloned after staging, form values carried over)
// on a transparent page that links the app's own CSS. The film renders them in
// iframes with CSS zoom, so text and edges stay vector-crisp at any size and a
// piece has its real radius and border: nothing is cut out of a screenshot.
//
//   node scripts/pieces.mjs        → public/ui/pieces/*.html, app.css, src/pieces.json
//
// Staging is presentation-only and matches scripts/fragments*.mjs and
// capture-beats.mjs (no "Design review" button, no launch banner, fresh times).
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const SRC = "file://" + path.resolve("public/ui/source.html");
const OUT = "public/ui/pieces";
fs.mkdirSync(OUT, { recursive: true });
const meta = {};

const b = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1400 } });
await p.route(/^https?:/, (r) => r.abort());

async function go(url) {
  await p.goto("about:blank");
  await p.goto(url);
  await p.waitForTimeout(900);
  await p.evaluate(() => {
    for (const el of document.querySelectorAll("button")) if (el.textContent.trim() === "Design review") el.remove();
    const hello = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.includes("Welcome to the new Vallamo"));
    hello?.closest(".relative.shrink-0.border-b")?.remove();
  });
  await p.waitForTimeout(200);
}

// The app's CSS (with its embedded fonts), written once.
let cssDone = false;
async function writeCss() {
  if (cssDone) return;
  const css = await p.evaluate(() => [...document.querySelectorAll("style")].map((s) => s.textContent).join("\n"));
  fs.writeFileSync(path.join(OUT, "app.css"), css);
  cssDone = true;
}

/**
 * Serialise the element that `find` returns (evaluated in the page) as a piece.
 * `edit` (optional, in page) stages the clone. Width is fixed to the live width.
 */
async function piece(name, find, { edit, pad = 0 } = {}) {
  await writeCss();
  const res = await p.evaluate(
    ({ findSrc, editSrc, pad }) => {
      const el = new Function(`return (${findSrc})`)()();
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const clone = el.cloneNode(true);
      // Carry live form state over (React sets properties, not attributes).
      const src = [el, ...el.querySelectorAll("*")];
      const dst = [clone, ...clone.querySelectorAll("*")];
      src.forEach((s, i) => {
        const d = dst[i];
        if (s instanceof HTMLInputElement) {
          if (s.type === "checkbox" || s.type === "radio") s.checked ? d.setAttribute("checked", "") : d.removeAttribute("checked");
          else d.setAttribute("value", s.value);
        }
        if (s instanceof HTMLTextAreaElement) d.textContent = s.value;
        if (s instanceof HTMLSelectElement) [...d.options].forEach((o, j) => (j === s.selectedIndex ? o.setAttribute("selected", "") : o.removeAttribute("selected")));
      });
      if (editSrc) new Function("el", `(${editSrc})(el)`)(clone);
      // Owen: no em dashes on screen. Presentation-only: "GBP — £" → "GBP (£)", any other " — " → ", ".
      const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        n.textContent = n.textContent.replace(/\b([A-Z]{3}) — (\S+)/g, "$1 ($2)").replace(/\s*—\s*/g, ", ");
      }
      for (const o of clone.querySelectorAll("option")) o.textContent = o.textContent.replace(/\b([A-Z]{3}) — (\S+)/g, "$1 ($2)");
      // Inherited text styles from the element's context.
      const cs = getComputedStyle(el.parentElement ?? el);
      const inherit = ["color", "font-family", "font-size", "font-weight", "line-height", "letter-spacing", "-webkit-font-smoothing"].map((k) => `${k}:${cs.getPropertyValue(k)}`).join(";");
      const html = document.documentElement;
      const attrs = [...html.attributes].map((a) => `${a.name}="${a.value}"`).join(" ");
      const doc = `<!doctype html>
<html ${attrs} data-theme="light">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="app.css">
<style>*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
html,body{margin:0!important;padding:0!important;background:transparent!important;overflow:hidden!important;min-height:0!important;height:auto!important}
#piece{${inherit};width:${r.width}px;padding:${pad}px;box-sizing:content-box}</style>
<style id="film-dyn"></style>
</head>
<body><div id="piece">${clone.outerHTML}</div></body>
</html>`;
      return { doc, w: Math.round(r.width + pad * 2), h: Math.round(r.height + pad * 2) };
    },
    { findSrc: find.toString(), editSrc: edit?.toString(), pad },
  );
  if (!res) throw new Error("piece not found: " + name);
  fs.writeFileSync(path.join(OUT, name + ".html"), res.doc);
  meta[name] = { w: res.w, h: res.h };
  console.log(name, res.w, res.h);
}

// In-page helpers, passed as source.
const byText = (text, minW, maxW, minH = 0) =>
  `() => { const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
  for (const leaf of [...document.querySelectorAll("body *")].filter((e) => own(e) === ${JSON.stringify(text)})) {
    for (let e = leaf; e; e = e.parentElement) { const r = e.getBoundingClientRect(); if (r.width > ${maxW}) break; if (r.width >= ${minW} && r.height >= ${minH}) return e; }
  } return null; }`;
const fn = (src) => ({ toString: () => src });

// ---------------------------------------------------------------- rows (S04, S05)
// Each row shows the customer's own first message, a fresh time, no pill.
const PEOPLE = [["Sarah Mitchell", "now", "row-0"], ["Priya Shah", "now", "row-1"], ["Grace Morgan", "2 min", "row-5"]];
const first = {};
for (const [name] of PEOPLE) {
  await go(SRC + "#/inbox");
  await p.locator("button.relative.w-full.gap-3", { hasText: name }).first().click();
  await p.waitForTimeout(400);
  first[name] = await p.evaluate(() => document.querySelector(".mx-auto.max-w-\\[720px\\].space-y-3 .flex.flex-col.items-start > div")?.textContent.trim() ?? null);
}
await go(SRC + "#/inbox");
for (const [name, when, id] of PEOPLE) {
  for (const selected of [false, true]) {
    if (selected && id !== "row-0") continue;
    await piece(
      selected ? "row-0-selected" : id,
      fn(`() => [...document.querySelectorAll("button.relative.w-full.gap-3")].find((r) => r.textContent.includes(${JSON.stringify(name)}))`),
      {
        edit: fn(`(r) => {
          r.classList.remove("bg-clay-wash");
          ${selected ? "" : 'r.querySelector(":scope > span.absolute")?.remove();'}
          const time = r.querySelector("span.tnum"); if (time) time.textContent = ${JSON.stringify(when)};
          const preview = r.querySelector(".line-clamp-1"); if (preview) preview.textContent = ${JSON.stringify(first[name] ?? "")};
          const metaRow = r.querySelector(".mt-1\\\\.5"); if (metaRow) [...metaRow.children].slice(0, -1).forEach((c) => c.remove());
          r.querySelector(".truncate.text-base")?.classList.replace("font-medium", "font-semibold");
          r.style.background = ${selected ? '"rgb(var(--clay-wash-c))"' : '"transparent"'};
        }`),
      },
    );
  }
}

// ---------------------------------------------------------------- Sarah's conversation (S06)
await go("file://" + path.resolve("public/ui/snaps/inbox-sarah.html"));
await p.addStyleTag({ content: '[data-film^="msg-"]{display:flex!important}[data-film="outcome-booked"]{display:block!important}' });
for (const n of [1, 2, 3, 4, 5, 6]) await piece(`msg-${n}`, fn(`() => document.querySelector('[data-film="msg-${n}"]')`));
await piece("outcome-pre", fn(`() => document.querySelector('[data-film="outcome-pre"]')`));
await piece("outcome-booked", fn(`() => document.querySelector('[data-film="outcome-booked"]')`));
await piece("upcoming-card", fn(`() => document.querySelector('[data-film="upcoming"] > :last-child')`));

// ---------------------------------------------------------------- integrations (S07)
await go(SRC + "#/integrations");
await piece("int-cliniko", fn(byText("Cliniko", 330, 400, 60)));
for (const s of ["Google Calendar", "Outlook / Microsoft 365", "Microsoft Bookings", "Cal.com", "Acuity Scheduling", "Square Appointments", "Boulevard", "Pabau", "Phorest"]) {
  await piece("int-" + s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, ""), fn(byText(s, 330, 400, 100)));
}

// ---------------------------------------------------------------- week view (S08)
await go(SRC + "#/bookings");
await p.locator("button", { hasText: /^Week$/ }).first().click();
await p.waitForTimeout(800);
// Tag every booking block so the film can drop them in one by one.
await p.evaluate(() => {
  let k = 0;
  for (const el of document.querySelectorAll("button, a, div")) {
    const r = el.getBoundingClientRect();
    if (r.y < 540 || r.height < 18 || r.height > 60 || r.width > 160 || r.width < 30 || r.x < 300) continue;
    if (!/^[A-Z][a-z]/.test(el.textContent.trim()) || el.querySelector("button")) continue;
    if (el.parentElement?.closest("[data-film^=wk-]")) continue;
    el.dataset.film = "wk-" + String(k++).padStart(2, "0");
    el.dataset.who = el.textContent.trim().slice(0, 40);
  }
});
await piece("week", fn(byText("21 Sep – 27 Sep", 1000, 1200, 600)));
const blocks = await p.evaluate(() => {
  const card = [...document.querySelectorAll("[data-film^=wk-]")][0].closest("div.rounded-2xl, div[class*=rounded]") ;
  const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
  const head = [...document.querySelectorAll("body *")].find((e) => own(e) === "21 Sep – 27 Sep");
  let c = head; while (c && c.getBoundingClientRect().width < 1000) c = c.parentElement;
  const o = c.getBoundingClientRect();
  void card;
  return [...document.querySelectorAll("[data-film^=wk-]")].map((e) => {
    const r = e.getBoundingClientRect();
    return { id: e.dataset.film, who: e.dataset.who, x: Math.round(r.x - o.x), y: Math.round(r.y - o.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
});
meta.week.blocks = blocks;

// ---------------------------------------------------------------- rules and features (S09)
await go(SRC + "#/bookings?settings=rules");
await p.locator("button, [role=tab]", { hasText: "Deposits" }).first().click();
await p.waitForTimeout(500);
await piece("deposits", fn(`() => { const f = (${byText("Optional. Take a deposit on higher-value treatments to protect against no-shows.", 300, 700)})(); let c = f; while (c && !/Applies to every booking/.test(c.textContent)) c = c.parentElement; return c; }`), { pad: 24 });
await p.locator("button, [role=tab]", { hasText: "Reminders & messages" }).first().click();
await p.waitForTimeout(500);
await piece("reminders", fn(`() => { const f = (${byText("Appointment reminders", 100, 700)})(); let c = f; while (c && !/Send by/.test(c.textContent)) c = c.parentElement; return c; }`), { pad: 24 });
await piece("followup-off", fn(byText("Abandoned-enquiry follow-up", 560, 640, 60)));
await p.evaluate(() => {
  const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
  const t = [...document.querySelectorAll("body *")].find((e) => own(e) === "Abandoned-enquiry follow-up");
  let row = t; while (row && row.getBoundingClientRect().width < 560) row = row.parentElement;
  row.querySelector("button[role=switch], [role=switch], button:last-of-type")?.click();
});
await p.waitForTimeout(400);
await piece("followup-on", fn(byText("Abandoned-enquiry follow-up", 560, 640, 60)));

await go(SRC + "#/settings/team");
await p.getByText("Aesthetic Doctor").first().click();
await p.waitForTimeout(800);
await piece("hours", fn(`() => { const f = (${byText("Working hours", 50, 700)})(); let c = f; while (c && !/Sunday/.test(c.textContent)) c = c.parentElement; return c; }`), { pad: 20 });

await p.setViewportSize({ width: 1100, height: 1000 });
await go(SRC + "#/follow-ups");
// The whole handover card: the first ancestor with the product's card border and radius.
await piece("handover", fn(`() => { let c = (${byText("Nadia Hussain", 10, 1100)})(); while (c && !(getComputedStyle(c).borderTopWidth !== "0px" && parseFloat(getComputedStyle(c).borderTopLeftRadius) >= 10 && c.getBoundingClientRect().width > 600)) c = c.parentElement; return c; }`));

fs.writeFileSync("src/pieces.json", JSON.stringify(meta, null, 1));
await b.close();
