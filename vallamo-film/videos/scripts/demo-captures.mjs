// Captures from the live interactive demo (https://vallamo.com/demo) for the Instagram pins
// (films/insta/Pins.tsx): the WhatsApp phone mid-conversation and booked, and the dashboard's
// inbox list, Thursday's diary and the flagged handover. 3x PNGs in public/ui/demo. The phones
// are then trimmed to the frame (outside made transparent) by the snippet at the end.
//   node scripts/demo-captures.mjs        (behind a proxy, HTTPS_PROXY is passed to Chromium)
import { chromium } from "playwright";
const OUT = "public/ui/demo";
import fs from "node:fs"; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: process.env.HTTPS_PROXY ? [`--proxy-server=${process.env.HTTPS_PROXY}`, "--ignore-certificate-errors"] : [] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
await p.goto("https://vallamo.com/demo", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1500);
// Find the smallest ancestor of an element holding `text` whose box is within the size range; tag it.
async function tag(id, text, minW, maxW, minH) {
  const ok = await p.evaluate(({ id, text, minW, maxW, minH }) => {
    const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
    const leaves = [...document.querySelectorAll("body *")].filter((e) => own(e).includes(text));
    for (const leaf of leaves) for (let e = leaf; e; e = e.parentElement) {
      const r = e.getBoundingClientRect();
      if (r.width > maxW) break;
      if (r.width >= minW && r.height >= minH) { e.setAttribute("data-cap", id); return [r.width, r.height]; }
    }
    return null;
  }, { id, text, minW, maxW, minH });
  console.log(id, ok);
  return ok;
}
async function shot(id) { await p.locator(`[data-cap="${id}"]`).screenshot({ path: `${OUT}/${id}.png` }); }
// Close the guided-tour card if it is open.
async function hideTour() {
  await p.evaluate(() => { for (const e of document.querySelectorAll("body *")) { if ((e.textContent || "").includes("Your guide to Vallamo") && e.getBoundingClientRect().width < 400 && e.getBoundingClientRect().width > 200) { let c = e; while (c.parentElement && c.parentElement.getBoundingClientRect().width < 420) c = c.parentElement; c.style.visibility = "hidden"; } } });
}
// The WhatsApp story: play it, capture the phone mid-conversation and at the end.
await p.getByText("Start demo").first().click();
await p.waitForTimeout(9000);
await tag("phone-chat", "Marlow Aesthetics & Skin Clinic", 330, 520, 600); await shot("phone-chat");
await p.waitForTimeout(9000);
await tag("phone-booked", "Marlow Aesthetics & Skin Clinic", 330, 520, 600); await shot("phone-booked");
// The dashboard tabs.
for (const [tab, id, text, minW, maxW, minH] of [
  ["Inbox", "inbox", "Needs reply", 250, 700, 400],
  ["Handovers", "handover", "Chemical peel suitability", 500, 1300, 150],
  ["Bookings", "diary", "Botox (3 areas)", 200, 460, 500],
]) {
  await p.getByText(tab, { exact: true }).first().click();
  await p.waitForTimeout(5000);
  await hideTour();
  await p.waitForTimeout(500);
  if (await tag(id, text, minW, maxW, minH)) await shot(id);
}
await b.close();
// Then trim each phone to its frame (python3, PIL + numpy):
//   for each of phone-chat, phone-booked: crop below the last bezel row; per row, make everything
//   left of the first and right of the last near-black pixel transparent.
