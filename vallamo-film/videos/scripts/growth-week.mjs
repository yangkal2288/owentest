// The growth ad's diary, from the real week view (public/ui/pieces/week.html, scripts/pieces.mjs):
//   g-wk      the week, with Thursday's 3:30pm block cleared so the facial fits 3–4pm
//   g-bk-*    single booking blocks in the week view's own markup, to drop into slots
// Run after scripts/meta-pieces.mjs, then scripts/pieces-png.mjs.
//   node scripts/growth-week.mjs
import fs from "node:fs";

const DIR = "public/ui/pieces";
const week = fs.readFileSync(`${DIR}/week.html`, "utf8");
const meta = JSON.parse(fs.readFileSync("src/pieces.json", "utf8"));
for (const k of Object.keys(meta)) if (k.startsWith("g-wk") || k.startsWith("g-bk")) delete meta[k];

// The week: drop Thursday's 3:30pm Megan Carter (wk-22) so the new hour is free.
const cleared = week.replace(/<button[^>]*data-film="wk-22"[^>]*>.*?<\/button>/, "");
if (cleared === week) throw new Error("wk-22 not found");
fs.writeFileSync(`${DIR}/g-wk.html`, cleared);
meta["g-wk"] = { ...meta.week, blocks: meta.week.blocks.filter((b) => b.id !== "wk-22") };

// A block: the same button, classes and colours as the week view's confirmed bookings.
const head = week.slice(0, week.indexOf("<body>")).replace(/width:1114px/, "width:142px");
const HOUR = 64; // px per hour in the week view; 9am is at y = 126 in the piece
const blocks = {
  // The film's booking: Chloe Reid, Signature Facial, Thursday 3–4pm.
  "g-bk-facial": { who: "Chloe Reid", line: "3:00pm · Facial", mins: 60 },
  // Booked out of hours (the benefit scene): into Wednesday and Friday daytime slots.
  "g-bk-fri": { who: "Ruby Evans", line: "12:00pm · Hydrafacial", mins: 45 },
  "g-bk-sat": { who: "Zara Ahmed", line: "1:30pm · Profhilo", mins: 45 },
  "g-bk-wed": { who: "Holly Price", line: "1:00pm · Facial", mins: 60 },
};
for (const [name, b] of Object.entries(blocks)) {
  const h = Math.round((b.mins / 60) * HOUR) - 3;
  const html = `${head}<body><div id="piece"><button class="relative block w-full overflow-hidden rounded-lg border-l-[3px] px-2 py-1 text-left" style="height: ${h}px; background: var(--sage-soft); border-color: var(--sage);"><div class="truncate text-xs font-semibold text-ink">${b.who}</div><div class="truncate text-2xs text-ink-2">${b.line}</div></button></div></body>\n</html>`;
  fs.writeFileSync(`${DIR}/${name}.html`, html);
  meta[name] = { w: 142, h };
}
fs.writeFileSync("src/pieces.json", JSON.stringify(meta, null, 1));
console.log("growth week pieces ok");
