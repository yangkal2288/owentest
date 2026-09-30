import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

import { MeetFilm } from "../meet/MeetFilm";
import { START } from "../meet/timeline";
import EDGE from "./edge.json";

/**
 * "Meet Vallamo" for Reels/Stories (9:16) and Feed (4:5): the real film, re-rendered from its
 * source (vector-sharp, same motion, same timing), framed shot by shot for a tall screen. Where
 * a shot is headline-left and product-right, the two halves stack: the headline up top inside
 * Meta's safe area, the product large under it. Centred shots get one tight frame. Panes melt
 * into the film's own background colour (edge.json, measured per frame from the final film),
 * so no edge ever shows. Picture only: the final film's mix is laid back on in the encode.
 */
export type ReframeProps = { fps?: number; format?: "916" | "45" | "11" };

type Rect = [x: number, y: number, w: number, h: number]; // in the film's 1920 x 1080 space
type Layout = { from: number; panes: Rect[]; cut?: boolean };

const S = START;
/** Shot by shot. Rects cover what matters in each shot (measured from the final film). */
const LAYOUTS: Layout[] = [
  // The question: headline, then the enquiries piling up on the right.
  { from: 0, panes: [[50, 225, 1080, 480], [1150, 70, 770, 790]] },
  // "You're with a client." / "Enquiries don't wait." centred.
  { from: S.S01, panes: [[300, 250, 1320, 620]] },
  // Meet: the mark and "Your new front desk."
  { from: S.S03, panes: [[590, 170, 740, 700]] },
  // Channels: "Answers on WhatsApp / Instagram / your website", the enquiries.
  { from: S.S04, panes: [[90, 270, 880, 380], [1030, 190, 800, 810]] },
  // Into one inbox.
  { from: S.S05, panes: [[430, 330, 940, 740]] },
  // The conversation.
  { from: S.S06, panes: [[430, 0, 1060, 910]] },
  // (inside the clay wipe) Answers. Checks your diary. Books it. + the result.
  { from: 26.74, cut: true, panes: [[80, 290, 880, 420], [1060, 250, 790, 380]] },
  // Connect your calendar.
  { from: S.S07, panes: [[80, 310, 720, 500], [760, 0, 1160, 650]] },
  // Watch your diary fill up.
  { from: S.S08, panes: [[100, 350, 640, 290], [760, 110, 1160, 880]] },
  // Your hours, deposits, reminders, follow-ups, handover.
  { from: S.S09, panes: [[80, 350, 760, 300], [830, 180, 1090, 720]] },
  // Your entire front desk. Handled.
  { from: S.S11, panes: [[210, 140, 1500, 720]] },
  // The end card.
  { from: S.S12, panes: [[560, 120, 800, 760]] },
];

const FORMAT = {
  // `focus`: where a single framing centres (9:16: the middle of the area Meta's overlays leave clear).
  "916": { W: 1080, H: 1920, top: 270, bottom: 1880, gap: 36, margin: 24, focus: 780 },
  "45": { W: 1080, H: 1350, top: 40, bottom: 1310, gap: 28, margin: 24, focus: 675 },
  // Square: short, so stacked shots keep the headline full size and the product gives way first.
  "11": { W: 1080, H: 1080, top: 30, bottom: 1050, gap: 20, margin: 24, focus: 540, headFirst: true },
};
const FEATHER = 70;

/** Place a layout's panes: each fills the width, stacked, scaled down together if they don't fit. */
function place(layout: Layout, f: { W: number; top: number; bottom: number; gap: number; margin: number; focus: number; headFirst?: boolean }) {
  const maxW = f.W - f.margin * 2;
  const avail = f.bottom - f.top - f.gap * (layout.panes.length - 1);
  let k = layout.panes.map(([, , w]) => maxW / w);
  const total = layout.panes.reduce((s, [, , , h], i) => s + h * k[i], 0);
  if (total > avail && f.headFirst && layout.panes.length > 1) {
    // The headline pane keeps its size; the others shrink (to half at most) to make room.
    const head = layout.panes[0][3] * k[0];
    const rest = total - head;
    const want = Math.max(0.5, (avail - head) / rest);
    k = k.map((v, i) => (i === 0 ? v : v * want));
  }
  const total2 = layout.panes.reduce((s, [, , , h], i) => s + h * k[i], 0);
  if (total2 > avail) k = k.map((v) => (v * avail) / total2);
  const used = layout.panes.reduce((s, [, , , h], i) => s + h * k[i], 0) + f.gap * (layout.panes.length - 1);
  let y = layout.panes.length === 1 ? Math.max(f.top, Math.min(f.bottom - used, f.focus - used / 2)) : f.top + (f.bottom - f.top - used) / 2;
  return layout.panes.map((r, i) => {
    const w = r[2] * k[i];
    const h = r[3] * k[i];
    const p = { r, k: k[i], x: (f.W - w) / 2, y, w, h };
    y += h + f.gap;
    return p;
  });
}

function Pane({ r, k, x, y, w, h, bg }: { r: Rect; k: number; x: number; y: number; w: number; h: number; bg: string }) {
  const fade = (dir: string) => `linear-gradient(${dir}, ${bg} 0%, ${bg}00 100%)`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale(${k}) translate(${-r[0]}px, ${-r[1]}px)` }}>
        <MeetFilm />
      </div>
      {/* Feathered edges into the film's own background. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: FEATHER, background: fade("180deg") }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: FEATHER, background: fade("0deg") }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: FEATHER * 0.6, background: fade("90deg") }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: FEATHER * 0.6, background: fade("270deg") }} />
    </div>
  );
}

export function MeetReframe({ format = "916" }: ReframeProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const f = FORMAT[format];
  const bg = "#" + EDGE[Math.min(EDGE.length - 1, Math.max(0, Math.round(t * 60)))];
  const i = LAYOUTS.findIndex((l, j) => t >= l.from && (j === LAYOUTS.length - 1 || t < LAYOUTS[j + 1].from));
  const cur = LAYOUTS[Math.max(0, i)];
  // A short dissolve into each new framing, so a layout change never pops.
  const XF = 0.22;
  const u = Math.min(1, (t - cur.from) / XF);
  const prev = i > 0 && u < 1 && !cur.cut ? LAYOUTS[i - 1] : null;
  return (
    <AbsoluteFill style={{ background: bg }}>
      {prev && (
        <AbsoluteFill style={{ opacity: 1 - u }}>
          {place(prev, f).map((p, j) => (
            <Pane key={j} {...p} bg={bg} />
          ))}
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ opacity: prev ? u : 1 }}>
        {place(cur, f).map((p, j) => (
          <Pane key={j} {...p} bg={bg} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
export { FILM_LENGTH as REFRAME_LENGTH } from "../meet/timeline";
