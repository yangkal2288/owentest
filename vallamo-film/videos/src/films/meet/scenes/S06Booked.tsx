import { AbsoluteFill, Img, staticFile } from "remotion";

import { C, FONT } from "../../../brand";
import { useTime } from "../../../kit/time";
import { Confetti } from "../Confetti";
import { blurIn, mix, tween } from "../motion";
import { accent, FloorShadow, giant } from "../parts";
import { Piece, pieceSize, type PieceName } from "../Piece";

/**
 * Shot 6 · Booked (7.9 s). "It replies from your own information, checks your
 * diary… and books the appointment."
 * Sarah's real conversation, as live app DOM, plays in focus over her blurred
 * thread: her message types in, Isla replies, the back half runs at 2×
 * (labelled). On Isla's confirmation the camera holds and confetti bursts from
 * the message's edges. Then a clay circle wipe from it opens onto the outcome
 * at poster size: In progress → Booked, and the THU 24 card, which lifts out.
 */
export const S06_LENGTH = 7.9;

const SCALE = 2.1;
const COL_W = 466 * SCALE;
const COL_X = 960 - COL_W / 2;
const MSGS: { name: PieceName; at: number }[] = [
  { name: "msg-1", at: 0.2 }, // Sarah: anything after 5:30 this week?
  { name: "msg-2", at: 1.55 }, // Isla: Thursday 6:00 or Friday 5:30 with Dr Maya
  { name: "msg-3", at: 2.7 }, // Sarah: Thursday at 6 please (2×)
  { name: "msg-4", at: 3.0 },
  { name: "msg-5", at: 3.3 },
  { name: "msg-6", at: 3.6 }, // Isla: you're booked… a confirmation has just been sent
];
const GAPPX = 16;
const BOTTOM = 860;
const CONFIRMED = 3.95; // msg-6 has landed: hold, confetti
const WIPE = 5.25;

// Sarah's first message types into her real bubble: her own text is uncovered
// character by character. Line boxes in the piece (css px); the cover is the bubble's colour.
const BUBBLE = "#EFE8DC";
const TYPE_LINES = [
  { y0: 13.5, y1: 30.5, x0: 14, x1: 356, chars: 52 },
  { y0: 34.5, y1: 51.5, x0: 13.5, x1: 321, chars: 49 },
];
const META_Y = 64;
const TYPE_FROM = 0.35;
const TYPE_TO = 1.45;

function Typed({ t, w }: { t: number; w: number }) {
  const k = w / pieceSize("msg-1").w;
  const total = TYPE_LINES.reduce((n, l) => n + l.chars, 0);
  const typed = Math.floor(total * Math.min(1, Math.max(0, (t - TYPE_FROM) / (TYPE_TO - TYPE_FROM))));
  let left = typed;
  const h = pieceSize("msg-1").h;
  return (
    // "Sarah 9:17pm" appears once she has sent it.
    <div style={{ position: "relative", clipPath: `inset(0 0 ${(1 - tween(t, TYPE_TO, 0.2)) * (h - META_Y) * k}px 0)` }}>
      <Piece name="msg-1" w={w} />
      {TYPE_LINES.map((l, i) => {
        const n = Math.max(0, Math.min(l.chars, left));
        left -= l.chars;
        const x = l.x0 + ((l.x1 - l.x0) * n) / l.chars;
        const caret = (n > 0 && n < l.chars) || (i === 0 && typed === 0);
        return (
          <div key={i}>
            <div style={{ position: "absolute", left: x * k, top: l.y0 * k, width: (l.x1 + 4 - x) * k, height: (l.y1 - l.y0) * k, background: BUBBLE }} />
            {caret && t < TYPE_TO && <div style={{ position: "absolute", left: x * k + 2, top: (l.y0 + 1.5) * k, width: 3, height: (l.y1 - l.y0 - 3) * k, background: C.clay }} />}
          </div>
        );
      })}
    </div>
  );
}

export function S06Booked() {
  const t = useTime();
  const bgBlur = tween(t, 0.1, 0.7);
  const shown = MSGS.map((m) => tween(t, m.at, 0.3));
  const heights = MSGS.map((m) => pieceSize(m.name).h * SCALE);
  const total = MSGS.reduce((sum, _m, i) => sum + shown[i] * (heights[i] + GAPPX), 0);
  // Isla's confirmation: its bubble (right-aligned, 82→466 of the piece, above its meta line).
  const m6h = heights[5];
  const m6 = { x: COL_X + 82 * SCALE, y: BOTTOM - GAPPX - m6h, w: 384 * SCALE, h: m6h - 22 * SCALE };
  const centre = { x: m6.x + m6.w / 2, y: m6.y + m6.h / 2 };
  const hold = tween(t, CONFIRMED, 1.3);
  const clay = tween(t, WIPE, 0.45);
  const white = tween(t, WIPE + 0.2, 0.45);
  const flip = tween(t, 6.3, 0.22);
  const flipIn = tween(t, 6.52, 0.25);
  const enter = tween(t, 6.85, 0.3);
  const lift = tween(t, 7.45, 0.45);
  const P = 2.6; // poster scale for the outcome

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <Img
        src={staticFile("ui/bits/screen-sarah.png")}
        style={{ position: "absolute", left: -300, top: -260, width: 2400, filter: `blur(${bgBlur * 18}px)`, opacity: mix(1, 0.5, bgBlur) }}
      />
      {/* The hold: the camera leans in on the confirmation while the confetti flies. */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.07 * hold})`, transformOrigin: `${centre.x}px ${centre.y}px` }}>
        <Confetti t={t - CONFIRMED} rect={m6} />
        <div style={{ position: "absolute", left: COL_X, top: BOTTOM - total, width: COL_W }}>
          {MSGS.map((m, i) =>
            shown[i] > 0 ? (
              <div key={m.name} style={{ marginBottom: GAPPX, ...blurIn(t, m.at, null, 24) }}>
                {i === 0 ? <Typed t={t} w={COL_W} /> : <Piece name={m.name} w={COL_W} />}
              </div>
            ) : null,
          )}
        </div>
      </div>
      {/* Honest speed-up: the back half of the conversation plays at double speed. */}
      <div
        style={{
          position: "absolute",
          left: COL_X + COL_W + 36,
          top: 200,
          height: 80,
          padding: "0 30px",
          borderRadius: 40,
          background: C.paper,
          border: `1.5px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: 44,
          color: C.ink,
          letterSpacing: "-0.02em",
          ...blurIn(t, 2.45, CONFIRMED - 0.1, 10),
        }}
      >
        2×
      </div>

      {/* The wipe: a clay ring sweeps out from Isla's confirmation, white follows. */}
      <div style={{ position: "absolute", inset: 0, background: C.clay, clipPath: `circle(${clay * 2300}px at ${centre.x}px ${centre.y}px)` }} />
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", clipPath: `circle(${white * 2300}px at ${centre.x}px ${centre.y}px)`, perspective: 1800 }}>
        <div style={{ position: "absolute", left: 140, top: 340 }}>
          <div style={{ ...giant(92), ...blurIn(t, WIPE + 0.4) }}>Answers.</div>
          <div style={{ ...giant(92), marginTop: 12, ...blurIn(t, WIPE + 0.62) }}>Checks your diary.</div>
          <div style={{ ...accent(112), marginTop: 10, ...blurIn(t, 6.4) }}>Books it.</div>
        </div>
        <FloorShadow x={1110} y={840} w={620} h={70} height={200} style={{ opacity: 0.3 * tween(t, WIPE + 0.5, 0.4) }} />
        <div style={{ position: "absolute", left: 1080, top: 300, transformStyle: "preserve-3d", transform: "rotateY(-14deg) rotateX(8deg)" }}>
          {/* The outcome flips on its horizontal axis: the real "In progress", then the real "Booked". */}
          <div style={{ position: "relative", height: pieceSize("outcome-booked").h * P }}>
            {/* Both stay mounted (iframes load once); only one side is ever visible. */}
            <div style={{ position: "absolute", visibility: flip < 1 ? "visible" : "hidden", ...blurIn(t, WIPE + 0.45, null, 12) }}>
              <div style={{ transform: `rotateX(${flip * 90}deg)`, transformOrigin: "50% 50%" }}>
                <Piece name="outcome-pre" w={263 * P} />
              </div>
            </div>
            <div style={{ position: "absolute", visibility: flip >= 1 ? "visible" : "hidden", transform: `rotateX(${(1 - flipIn) * -90}deg)`, transformOrigin: "50% 50%" }}>
              <Piece name="outcome-booked" w={263 * P} />
            </div>
          </div>
          <div
            style={{
              marginTop: 34,
              marginLeft: 70,
              transform: `translateZ(${120 + lift * 420}px) translate(${lift * 260}px, ${-lift * 380 + (1 - enter) * 24}px) rotateZ(${-2 + lift * 4}deg)`,
              opacity: enter * (1 - tween(t, 7.7, 0.2)),
              filter: enter < 1 ? `blur(${(1 - enter) * 10}px)` : undefined,
            }}
          >
            <Piece name="upcoming-card" w={263 * 2.1} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
