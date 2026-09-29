// Real Vallamo UI pieces for the Meta ad (films/meta), captured like scripts/pieces.mjs:
// the app's own markup and CSS, cloned from the demo app (North House Aesthetics)
// and staged with the brief's example conversation. Presentation-only staging:
// message texts, the widget tagline, the outcome summary and the upcoming card.
//   node scripts/meta-pieces.mjs && node scripts/pieces-png.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const SRC = "file://" + path.resolve("public/ui/source.html");
const OUT = "public/ui/pieces";
fs.mkdirSync(OUT, { recursive: true });
const meta = JSON.parse(fs.readFileSync("src/pieces.json", "utf8"));
for (const k of Object.keys(meta)) if (k.startsWith("m-") || k.startsWith("p-") || k.startsWith("h-")) delete meta[k];

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

let cssDone = fs.existsSync(path.join(OUT, "app.css"));
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


// ---------------------------------------------------------------- the website chat widget (Channels › Website chat › "What customers see")
const WIDGET = `document.querySelector("div.rounded-\\\\[22px\\\\]")`;
const MSGS = {
  "m-u1": ["user", "Any consultation appointments on Tuesday?"],
  "m-i1": ["isla", "Yes, we have 12:30 or 4pm with Dr Maya. Which suits you?"],
  "m-u2": ["user", "12:30, please."],
  "m-i2": ["isla", "You're booked with Dr Maya on Tuesday at 12:30. A confirmation has just been sent."],
  "m-dots": ["isla", "•••"],
  // The paid-enquiry ad (VALLAMO_MARKETING_SPEND_AD_PRODUCTION_BRIEF.md): a new enquiry, with Vallamo.
  "p-u1": ["user", "Can I book the £120 laser session this week?"],
  "p-i1": ["isla", "Thursday at 3pm is available. Would you like that?"],
  "p-u2": ["user", "Yes, please."],
  "p-idet": ["isla", "Lovely. Could I take your mobile number and email for the booking?"],
  "p-u3": ["user", "07700 900318, amy.lee@example.com"],
  "p-i2": ["isla", "You're booked for a laser session on Thursday at 3pm. A confirmation has just been sent."],
  // The Halloween film: Jess, a new website-chat enquiry.
  "h-u1": ["user", "I'd like the £120 facial. Anything Thursday?"],
  "h-i1": ["isla", "Thursday at 3pm is available. Would you like that?"],
  "h-u2": ["user", "Yes, please."],
  "h-u3": ["user", "07700 900455, jess.kaur@example.com"],
  "h-i2": ["isla", "You're booked for a facial on Thursday at 3pm. A confirmation has just been sent."],
};
await go(SRC + "#/channels/website");
await p.evaluate((W) => {
  const w = new Function(`return ${W}`)();
  const head = w.children[0];
  head.querySelector(".opacity-80").textContent = "Replies instantly";
}, WIDGET);
await piece("m-head", fn(`() => ${WIDGET}.children[0]`));
await piece("m-sub", fn(`() => ${WIDGET}.children[1]`));
await piece("m-input", fn(`() => ${WIDGET}.children[3]`));
await piece("m-launch", fn(`() => ${WIDGET}.parentElement.children[1].firstElementChild`));
// Each staged message in the widget's own bubble (Isla left, customer right), at the body's width.
for (const [name, [who, text]] of Object.entries(MSGS)) {
  await p.evaluate(({ W, who, text }) => {
    const body = new Function(`return ${W}`)().children[2];
    const kids = [...body.children];
    const tpl = who === "user" ? kids[2] : kids[3];
    const el = tpl.cloneNode(true);
    el.textContent = text;
    if (text === "•••") { el.style.letterSpacing = "3px"; el.style.fontSize = "18px"; el.style.lineHeight = "19px"; el.style.color = "rgb(160,150,139)"; el.style.width = "fit-content"; }
    el.id = "staged";
    // A row at the body's width, so right-aligned bubbles stay right-aligned in the piece.
    const row = document.createElement("div");
    row.id = "staged-row";
    row.className = "flex flex-col";
    row.appendChild(el);
    body.querySelector("#staged-row")?.remove();
    body.appendChild(row);
  }, { W: WIDGET, who, text });
  await piece(name, fn(`() => document.getElementById("staged-row")`));
}

// ---------------------------------------------------------------- channels (the three live ones; phone is "Soon" and stays out)
await go(SRC + "#/channels");
for (const [name, text] of [["m-ch-web", "Website chat"], ["m-ch-wa", "WhatsApp"], ["m-ch-ig", "Instagram"]]) {
  await piece(name, fn(`() => { let c = (${byText(text, 10, 400)})(); while (c && !(parseFloat(getComputedStyle(c).borderTopLeftRadius) >= 10 && c.getBoundingClientRect().height > 180)) c = c.parentElement; return c; }`));
}

// ---------------------------------------------------------------- knowledge: the service Isla answered from
await go(SRC + "#/knowledge");
await p.getByText("Services & prices").first().click();
await p.waitForTimeout(600);
await piece("m-svc", fn(byText("Anti-Wrinkle Consultation", 700, 900, 50)));

// ---------------------------------------------------------------- "Why Isla said this" for the staged reply
await go(SRC + "#/inbox");
await p.locator("button.relative.w-full.gap-3", { hasText: "Sarah Mitchell" }).first().click();
await p.waitForTimeout(500);
await p.getByText("Why this reply?").first().click();
await p.waitForTimeout(600);
await piece(
  "m-why",
  fn(`() => { let c = (${byText("Why Isla said this", 10, 700)})(); while (c && c.getBoundingClientRect().height < 150) c = c.parentElement; return c; }`),
  { edit: fn(`(el) => { for (const n of el.querySelectorAll("*")) { if (n.childElementCount) continue; if (n.textContent.trim() === "No facts needed for this reply") n.textContent = "Anti-Wrinkle Consultation, 30 min, £25"; } }`) },
);

// ---------------------------------------------------------------- the booking result (inbox side panel)
await go("file://" + path.resolve("public/ui/snaps/inbox-sarah.html"));
await p.addStyleTag({ content: '[data-film="outcome-booked"]{display:block!important}' });
await p.evaluate(() => {
  const sum = document.querySelector('[data-film="outcome-summary"]');
  if (sum && sum.firstChild) sum.firstChild.textContent = "Website enquiry; assistant offered two Tuesday slots and booked 12:30.";
  const up = document.querySelector('[data-film="upcoming"] > :last-child');
  const walker = document.createTreeWalker(up, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const s = n.textContent.trim();
    if (s === "Thu") n.textContent = "Tue";
    else if (s === "24") n.textContent = "22";
    else if (s.startsWith("6:00pm")) n.textContent = n.textContent.replace("6:00pm", "12:30pm");
  }
});
await piece("m-outcome", fn(`() => document.querySelector('[data-film="outcome-booked"]')`));
await piece("m-upcoming", fn(`() => document.querySelector('[data-film="upcoming"] > :last-child')`));

// The paid-enquiry ad: the same real result, staged for Thursday 3pm.
await go("file://" + path.resolve("public/ui/snaps/inbox-sarah.html"));
await p.addStyleTag({ content: '[data-film="outcome-booked"]{display:block!important}' });
await p.evaluate(() => {
  const sum = document.querySelector('[data-film="outcome-summary"]');
  if (sum && sum.firstChild) sum.firstChild.textContent = "Website enquiry from an ad; assistant offered Thursday at 3pm and booked it.";
  const up = document.querySelector('[data-film="upcoming"] > :last-child');
  const walker = document.createTreeWalker(up, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const s = n.textContent.trim();
    if (s === "Anti-Wrinkle Consultation") n.textContent = "Laser Session";
    else if (s.startsWith("6:00pm")) n.textContent = "3:00pm · Nina Patel";
  }
});
await piece("p-outcome", fn(`() => document.querySelector('[data-film="outcome-booked"]')`));
await piece("p-upcoming", fn(`() => document.querySelector('[data-film="upcoming"] > :last-child')`));

fs.writeFileSync("src/pieces.json", JSON.stringify(meta, null, 1));
await b.close();
