// Real UI pieces for the "connect your calendar + guardrails" story, captured at 4x.
// Adds to public/ui/bits/ and merges sizes into src/bits.json.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const SRC = "file://" + path.resolve("public/ui/source.html");
const OUT = "public/ui/bits";
const meta = JSON.parse(fs.readFileSync("src/bits.json", "utf8"));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1400 }, deviceScaleFactor: 4 });
await p.route(/^https?:/, (r) => r.abort());
const go = async (h) => { await p.goto("about:blank"); await p.goto(SRC + h); await p.waitForTimeout(900); await p.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important}" }); };
const tag = (name, fn, arg) => p.evaluate(([name, src, arg]) => { const el = new Function("arg", src)(arg); if (!el) throw new Error("not found: " + name); el.dataset.bit = name; }, [name, `return (${fn.toString()})(arg)`, arg]);
const shot = async (name, extra = {}) => {
  const loc = p.locator(`[data-bit="${name}"]`);
  await loc.scrollIntoViewIfNeeded();
  const box = await loc.boundingBox();
  await loc.screenshot({ path: `${OUT}/${name}.png`, omitBackground: true });
  meta[name] = { w: Math.round(box.width), h: Math.round(box.height), ...extra };
};
const clip = async (name, c) => { console.log("clip", name, JSON.stringify(c)); await p.screenshot({ path: `${OUT}/${name}.png`, clip: c, omitBackground: true }); meta[name] = { w: Math.round(c.width), h: Math.round(c.height) }; };
const leafFn = (t) => [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === t);

// ---------------------------------------------------------------- integrations
await go("#/integrations");
await tag("int-cliniko", (arg) => {
  const l = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Synced 3 minutes ago");
  let c = l; while (c && !/Cliniko/.test(c.textContent) ) c = c.parentElement;
  while (c && c.getBoundingClientRect().height < 50) c = c.parentElement;
  return c;
});
await shot("int-cliniko");
const SYSTEMS = ["Google Calendar", "Outlook / Microsoft 365", "Microsoft Bookings", "Cal.com", "Acuity Scheduling", "Pabau"];
for (const [i, name] of SYSTEMS.entries()) {
  await tag(`int-${i}`, (name) => {
    const l = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === name);
    let c = l; while (c && !(getComputedStyle(c).borderTopWidth !== "0px" && parseFloat(getComputedStyle(c).borderRadius) >= 8)) c = c.parentElement;
    return c;
  }, name);
  await shot(`int-${i}`, { name });
}

// ---------------------------------------------------------------- booking rules
await go("#/bookings?settings=rules");
{
  const panel = await p.evaluate(() => {
    const t = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "When Isla can book");
    const g = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Clean-up or room reset.");
    const s = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "All 9 services are bookable in chat.");
    const r = (e) => e.getBoundingClientRect();
    const sw = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Which services Isla can book");
    return { t: r(t), g: r(g), s: r(s), sw: r(sw) };
  });
  await clip("rules-when", { x: panel.t.x - 20, y: panel.t.y - 18, width: 655, height: panel.g.y + panel.g.height - panel.t.y + 58 });
  await clip("rules-services", { x: panel.sw.x - 20, y: panel.sw.y - 18, width: 655, height: panel.s.y + panel.s.height + 30 - panel.sw.y });
}

// ---------------------------------------------------------------- practitioner (Dr Maya)
await go("#/settings/team");
await p.getByText("Aesthetic Doctor").first().click(); await p.waitForTimeout(800);
await p.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important}" });
await tag("maya-link", () => { const l = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Bookable by Isla" && e.closest("[class*=fixed], aside, [role=dialog]")); let c = l; while (c && !/Linked to a Cliniko practitioner/.test(c.textContent)) c = c.parentElement; return c; });
await shot("maya-link");
{
  const r = await p.evaluate(() => {
    const h = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Services & pricing").getBoundingClientRect();
    return { h, row3: { y: h.y + 196 } };
  });
  await clip("maya-services", { x: r.h.x - 18, y: r.h.y - 14, width: 586, height: r.row3.y + 40 - r.h.y });
}
// Working hours + time off: scroll the panel so the whole section shows.
await p.evaluate(() => {
  const h = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Working hours");
  let sc = h; while (sc && !/(auto|scroll)/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
  sc.scrollTop = h.getBoundingClientRect().top - sc.getBoundingClientRect().top - 20 + sc.scrollTop;
});
await p.waitForTimeout(200);
{
  const r = await p.evaluate(() => {
    const q = (t) => [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === t)?.getBoundingClientRect();
    const h = q("Working hours"); const off = q("Time off"); const sun = q("Sunday");
    const none = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && /No time off booked|time off/i.test(e.textContent) && e.getBoundingClientRect().y > (off?.y ?? 0))?.getBoundingClientRect();
    return { h, off, sun, none };
  });
  console.log("hours", JSON.stringify(r));
  const bottom = r.none ? r.none.y + r.none.height + 22 : (r.off ? r.off.y + 60 : r.sun.y + 40);
  await clip("maya-hours", { x: r.h.x - 18, y: r.h.y - 14, width: 586, height: Math.min(1390, bottom + 38) - (r.h.y - 14) });
}

// ---------------------------------------------------------------- playground: the guardrail exchange
await go("#/playground");
const inp = p.locator('input[placeholder^="Ask what a customer"]');
await inp.fill("Could I do Thursday at 3:30?"); await inp.press("Enter"); await p.waitForTimeout(2600);
await p.getByText("Why this reply?").last().click(); await p.waitForTimeout(400);
await p.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important}" });
// The playground adds "(test mode)"; in the live inbox the same step reads without it.
await p.evaluate(() => { for (const e of document.querySelectorAll("body *")) if (e.childElementCount === 0 && e.textContent.trim() === "Checked availability in Cliniko (test mode)") e.textContent = "Checked availability in Cliniko"; });
await tag("pg-ask", () => [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Could I do Thursday at 3:30?"));
await shot("pg-ask");
await tag("pg-reply", () => {
  const t = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && /^Dr Maya has Thursday/.test(e.textContent.trim()));
  let c = t; while (c && !/Thu 6:00pm/.test(c.textContent)) c = c.parentElement; return c;
});
const replyBox = await p.locator('[data-bit="pg-reply"]').boundingBox();
const chip = await p.getByText("Thu 6:00pm", { exact: true }).last().boundingBox();
const bubbleEl = await p.evaluate(() => { const t = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && /^Dr Maya has Thursday/.test(e.textContent.trim())); let c = t; while (c && getComputedStyle(c).borderTopWidth === "0px") c = c.parentElement; const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
await shot("pg-reply", { chip6: { x: Math.round(chip.x - replyBox.x), y: Math.round(chip.y - replyBox.y), w: Math.round(chip.width), h: Math.round(chip.height) } });
// Reply without the trace (bubble + chips + "why" line only) for the first beat.
await tag("pg-trace", () => { const l = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Checked availability in Cliniko"); let c = l; while (c && !/Fact-check/.test(c.textContent)) c = c.parentElement; return c; });
await shot("pg-trace");
const traceBox = await p.locator('[data-bit="pg-trace"]').boundingBox();
meta["pg-reply"].traceTop = Math.round(traceBox.y - replyBox.y);
void bubbleEl;
// The customer's tap, as the playground sends it.
await inp.fill("Thu 6:00pm"); await inp.press("Enter"); await p.waitForTimeout(300);
await tag("pg-chosen", () => [...document.querySelectorAll("body *")].filter((e) => e.childElementCount === 0 && e.textContent.trim() === "Thu 6:00pm").pop());
await shot("pg-chosen");

// ---------------------------------------------------------------- the product's pills, labelled for the scan
await go("#/bookings");
await p.evaluate(() => {
  const host = document.createElement("div"); host.id = "pills"; host.style.cssText = "position:fixed;left:40px;top:40px;display:flex;gap:12px;z-index:9999;background:transparent";
  host.innerHTML = '<span data-bit="pill-unavailable" class="pill pill-muted"><span class="pill-dot"></span>Unavailable</span><span data-bit="pill-available" class="pill pill-good"><span class="pill-dot"></span>Available</span><span data-bit="pill-checked" class="pill pill-good"><span class="pill-dot"></span>Checked in Cliniko</span>';
  document.body.appendChild(host);
});
for (const n of ["pill-unavailable", "pill-available", "pill-checked"]) await shot(n);
// Dr Maya's column header on Thursday.
for (let i = 0; i < 3; i++) { await p.locator("button[aria-label='Next']").first().click(); await p.waitForTimeout(150); }
await tag("cal-maya-head", () => { const l = [...document.querySelectorAll("body *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Dr Maya" && e.getBoundingClientRect().y > 400); let c = l; while (c && c.getBoundingClientRect().width < 300) c = c.parentElement; return c; });
await shot("cal-maya-head");

fs.writeFileSync("src/bits.json", JSON.stringify(meta, null, 1));
console.log(Object.keys(meta).filter((k) => /^(int|rules|maya|pg|pill|cal-maya)/.test(k)).map((k) => `${k} ${meta[k].w}x${meta[k].h}`).join("\n"));
await b.close();
