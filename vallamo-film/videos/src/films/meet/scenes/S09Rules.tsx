import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";

import { cursorAt, UserCursor } from "../../../kit/cursor";
import { useTime } from "../../../kit/time";
import { blurIn, tween } from "../motion";
import { accent, Bit, Card, FloorShadow, giant } from "../parts";

/**
 * Shot 9 · Rules and features (6.5 s), Tessel's left caption + right UI crop.
 * "Your hours. Your rules. Deposits taken, reminders sent, quiet leads
 * followed up… and when it matters, it hands over to you."
 * Every crop is the real app: Dr Maya's working hours, Booking settings ›
 * Deposits and › Reminders, the abandoned-enquiry follow-up switched on, and a
 * real handover (unhappy customer, Instagram) being picked up.
 */
export const S09_LENGTH = 6.5;
const BEAT = 1.3;

type Beat = { plain: string; accent: string; bit: string; w: number; ratio: number; click?: { x: number; y: number } };
const BEATS: Beat[] = [
  { plain: "Your hours.", accent: "Your rules.", bit: "maya-hours", w: 680, ratio: 1816 / 2344 },
  { plain: "Deposits", accent: "taken.", bit: "b-deposits", w: 1000, ratio: 356 / 1240 },
  { plain: "Reminders", accent: "sent.", bit: "b-reminders", w: 900, ratio: 740 / 1264 },
  // The toggle's centre in the capture (fractions of its size).
  { plain: "Quiet leads", accent: "followed up.", bit: "b-followup-off", w: 1000, ratio: 172 / 1216, click: { x: 0.942, y: 0.276 } },
  // "I'm on it" on the handover card.
  // Captured at a 1100px window so the card reads at film size.
  { plain: "Hands over", accent: "when it matters.", bit: "b-handover-narrow", w: 1000, ratio: 456 / 1544, click: { x: 0.802, y: 0.32 } },
];

function Floating({ t, at, out, w, h, children }: { t: number; at: number; out: number | null; w: number; h: number; children: ReactNode }) {
  const left = 1850 - w;
  const top = 540 - h / 2;
  return (
    <>
      <FloorShadow x={left + 40} y={top + h + 40} w={w - 80} h={46} height={100} style={{ opacity: 0.28 * tween(t, at, 0.3) * (out === null ? 1 : 1 - tween(t, out, 0.22)) }} />
      <div style={{ position: "absolute", left, top: top - (t - at) * 10, ...blurIn(t, at + 0.05, out, 30) }}>
        <Card radius={18}>{children}</Card>
      </div>
    </>
  );
}

export function S09Rules() {
  const t = useTime();
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      {BEATS.map((b, i) => {
        const at = i * BEAT;
        const out = i < BEATS.length - 1 ? at + BEAT - 0.2 : S09_LENGTH - 0.3;
        if (t < at - 0.01 || t > out + 0.3) return null;
        const h = b.w * b.ratio;
        const clickAt = at + 0.62;
        const switched = b.bit === "b-followup-off" && t >= clickAt;
        const target = b.click ? { x: 1850 - b.w + b.click.x * b.w, y: 540 - h / 2 - (clickAt - at) * 10 + b.click.y * h } : null;
        const cursor = target
          ? cursorAt(t, [{ t: at + 0.1, x: target.x + 220, y: target.y + 200 }, { t: clickAt, x: target.x, y: target.y, click: true }], (x, y) => ({ x, y }))
          : null;
        return (
          <div key={b.bit}>
            <div style={{ position: "absolute", left: 140, top: 400 }}>
              <div style={{ ...giant(84), ...blurIn(t, at, out) }}>{b.plain}</div>
              <div style={{ ...accent(100), marginTop: 6, ...blurIn(t, at + 0.12, out) }}>{b.accent}</div>
            </div>
            <Floating t={t} at={at} out={out} w={b.w} h={h}>
              <Bit name={switched ? "b-followup-on" : b.bit} w={b.w} />
            </Floating>
            {cursor && (
              <div style={{ position: "absolute", inset: 0, opacity: tween(t, at + 0.1, 0.2) * (1 - tween(t, out - 0.05, 0.2)) }}>
                <UserCursor {...cursor} />
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
