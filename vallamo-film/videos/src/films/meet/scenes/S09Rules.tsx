import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";

import { cursorAt, UserCursor } from "../../../kit/cursor";
import { useTime } from "../../../kit/time";
import { blurIn, tween } from "../motion";
import { accent, Card, FloorShadow, giant } from "../parts";
import { Piece, pieceSize, type PieceName } from "../Piece";

/**
 * Shot 9 · Rules and features (6.5 s), Tessel's left caption + right UI.
 * "Your hours. Your rules. Deposits taken, reminders sent, quiet leads
 * followed up… and when it matters, it hands over to you."
 * Every panel is live app DOM: Dr Maya's working hours, Booking settings ›
 * Deposits and › Reminders, the abandoned-enquiry follow-up being switched on,
 * and a real handover (unhappy customer, Instagram) being picked up.
 */
export const S09_LENGTH = 6.5;
const BEAT = 1.3;

type Beat = {
  plain: string;
  accent: string;
  piece: PieceName;
  after?: PieceName; // state after the click
  w: number;
  surface: boolean; // sits on a product card surface (sections without their own container)
  click?: { x: number; y: number }; // fractions of the piece
  /** Show only the top of the panel (css px of the piece), fading out at the bottom like a scrolled panel. */
  clip?: number;
};
const BEATS: Beat[] = [
  { plain: "Your hours.", accent: "Your rules.", piece: "hours", w: 900, surface: true },
  { plain: "Deposits", accent: "taken.", piece: "deposits", w: 1000, surface: true, clip: 214 },
  { plain: "Reminders", accent: "sent.", piece: "reminders", w: 1000, surface: true },
  { plain: "Quiet leads", accent: "followed up.", piece: "followup-off", after: "followup-on", w: 1000, surface: true, click: { x: 0.942, y: 0.276 } },
  // Captured at a 1100px window so the card reads at film size. Cursor on "I'm on it".
  { plain: "Hands over", accent: "when it matters.", piece: "handover", w: 1000, surface: false, click: { x: 0.8, y: 0.313 } },
];
const PAD = 22;

function Floating({ t, at, out, w, h, children }: { t: number; at: number; out: number | null; w: number; h: number; children: ReactNode }) {
  const left = 1850 - w;
  const top = 540 - h / 2;
  return (
    <>
      <FloorShadow x={left + 40} y={Math.min(1000, top + h + 40)} w={w - 80} h={46} height={100} style={{ opacity: 0.28 * tween(t, at, 0.3) * (out === null ? 1 : 1 - tween(t, out, 0.22)) }} />
      {/* Moves are transforms only: a layout offset snaps the live UI to whole pixels and it hitches. */}
      <div style={{ position: "absolute", left, top, transform: `translate3d(0, ${-(t - at) * 10}px, 0)` }}>
        <div style={blurIn(t, at + 0.05, out, 30)}>{children}</div>
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
        const out = i < BEATS.length - 1 ? at + BEAT - 0.2 : S09_LENGTH - 0.12;
        if (t < at - 0.01 || t > out + 0.3) return null;
        const size = pieceSize(b.piece);
        const inner = b.surface ? b.w - PAD * 2 : b.w;
        const zoom = inner / size.w;
        const ih = (b.clip ?? size.h) * zoom;
        const h = ih + (b.surface ? PAD * 2 : 0);
        const clickAt = at + 0.62;
        const switched = !!b.after && t >= clickAt;
        const origin = { x: 1850 - b.w + (b.surface ? PAD : 0), y: 540 - h / 2 - (clickAt - at) * 10 + (b.surface ? PAD : 0) };
        const target = b.click ? { x: origin.x + b.click.x * inner, y: origin.y + b.click.y * ih } : null;
        const cursor = target
          ? cursorAt(t, [{ t: at + 0.1, x: target.x + 220, y: target.y + 200 }, { t: clickAt, x: target.x, y: target.y, click: true }], (x, y) => ({ x, y }))
          : null;
        const body = (
          <div style={{ position: "relative", ...(b.clip ? { height: ih, overflow: "hidden", maskImage: "linear-gradient(to bottom, #000 calc(100% - 40px), transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 calc(100% - 40px), transparent)" } : {}) }}>
            <Piece name={b.piece} w={inner} style={{ visibility: switched ? "hidden" : "visible" }} />
            {b.after && <Piece name={b.after} w={inner} style={{ position: "absolute", left: 0, top: 0, visibility: switched ? "visible" : "hidden" }} />}
          </div>
        );
        return (
          <div key={b.piece}>
            <div style={{ position: "absolute", left: 140, top: 400 }}>
              <div style={{ ...giant(84), ...blurIn(t, at, out) }}>{b.plain}</div>
              <div style={{ ...accent(100), marginTop: 6, ...blurIn(t, at + 0.12, out) }}>{b.accent}</div>
            </div>
            <Floating t={t} at={at} out={out} w={b.w} h={h}>
              {b.surface ? (
                <Card radius={22} pad={PAD}>
                  {body}
                </Card>
              ) : (
                body
              )}
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
