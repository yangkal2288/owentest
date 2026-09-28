// Real UI pieces for shots 7 and 9, captured at 2x from public/ui/source.html
// (presentation-only staging: no "Design review" button, no launch banner).
// Output: public/ui/bits/b-*.png
import { chromium } from "playwright";
import path from "node:path";

const b = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 1400 }, deviceScaleFactor: 2 });
await p.route(/^https?:/, (r) => r.abort());
const OUT = "public/ui/bits/";

async function go(hash) {
  await p.goto("about:blank");
  await p.goto("file://" + path.resolve("public/ui/source.html" + hash));
  await p.waitForTimeout(1200);
  await p.evaluate(() => {
    for (const el of document.querySelectorAll("button")) if (el.textContent.trim() === "Design review") el.remove();
    const hello = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.includes("Welcome to the new Vallamo"));
    hello?.closest(".relative.shrink-0.border-b")?.remove();
  });
  await p.waitForTimeout(300);
}

/** Rect of the first ancestor of the element whose text is `text` that fits the size test. */
async function boxOf(text, minW, maxW, minH = 0) {
  return p.evaluate(({ text, minW, maxW, minH }) => {
    const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
    const leaves = [...document.querySelectorAll("body *")].filter((e) => own(e) === text);
    for (const leaf of leaves) {
      for (let e = leaf; e; e = e.parentElement) {
        const r = e.getBoundingClientRect();
        if (r.width > maxW) break;
        if (r.width >= minW && r.height >= minH) return { x: r.x, y: r.y, width: r.width, height: r.height };
      }
    }
    return null;
  }, { text, minW, maxW, minH });
}
async function shoot(name, clip) {
  if (!clip) throw new Error("no box for " + name);
  await p.screenshot({ path: OUT + name + ".png", clip });
}

// Shot 7: every booking system card, plus Cliniko connected.
await go("#/integrations");
const systems = ["Google Calendar", "Outlook / Microsoft 365", "Microsoft Bookings", "Cal.com", "Acuity Scheduling", "Square Appointments", "Boulevard", "Pabau", "Phorest"];
for (const s of systems) await shoot("b-int-" + s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, ""), await boxOf(s, 330, 400, 100));
await shoot("b-int-cliniko", await boxOf("Cliniko", 330, 400, 60));

// Shot 9: booking settings tabs.
await go("#/bookings?settings=rules");
await p.locator("button, [role=tab]", { hasText: "Booking rules" }).first().click(); await p.waitForTimeout(600);
await p.screenshot({ path: OUT + "b-screen-rules.png" });
await p.locator("button, [role=tab]", { hasText: "Reminders & messages" }).first().click(); await p.waitForTimeout(600);
await shoot("b-reminders", await boxOf("Appointment reminders", 560, 700).then(async (r) => {
  const end = await boxOf("Send by", 100, 700);
  return r && end ? { x: r.x - 4, y: r.y - 8, width: 632, height: end.y + 64 - r.y + 8 } : null;
}));
const abandoned = await boxOf("Abandoned-enquiry follow-up", 560, 640, 60);
await shoot("b-followup-off", abandoned);
await p.evaluate(({ x, y, width, height }) => {
  const sw = [...document.querySelectorAll("button, [role=switch]")].find((s) => { const r = s.getBoundingClientRect(); return r.y > y && r.y < y + height && r.x > x + width - 90; });
  sw?.click();
}, abandoned);
await p.waitForTimeout(500);
await shoot("b-followup-on", abandoned);
await p.locator("button, [role=tab]", { hasText: "Deposits" }).first().click(); await p.waitForTimeout(600);
await shoot("b-deposits", await boxOf("Deposits", 560, 700).then(async (r) => {
  const end = await boxOf("Applies to every booking that takes a deposit.", 100, 700);
  return r && end ? { x: r.x - 4, y: r.y - 8, width: 620, height: end.y + end.height - r.y + 18 } : null;
}));

// Shot 9: a non-medical handover (Nadia, unhappy customer, Instagram).
await go("#/follow-ups");
await shoot("b-handover", await boxOf("Nadia Hussain", 1000, 1200, 120));
console.log("ok");
await b.close();
