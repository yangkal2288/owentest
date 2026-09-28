import { AbsoluteFill, Img, staticFile } from "remotion";

import { C, FONT } from "../../../brand";
import { useTime } from "../../../kit/time";
import { blurIn, mix, tween } from "../motion";
import { accent, Bit, Card, FloorShadow, giant } from "../parts";

/**
 * Shot 6 · Booked (7 s). "It replies from your own information, checks your
 * diary… and books the appointment."
 * Sarah's real conversation plays in focus over her blurred thread, the back
 * half at 2× (labelled), then a clay circle wipe from Isla's last reply opens
 * onto the outcome at poster size: In progress → Booked, and the THU 24 card.
 * Out: the THU 24 card lifts towards camera (it lands in the diary in shot 8).
 */
export const S06_LENGTH = 7;

const SCALE = 1.75;
// The real thread, in order (bits.json heights, css px).
const MSGS = [
  { bit: "msg-1", h: 82, at: 0.5 }, // Sarah: anything after 5:30 this week?
  { bit: "msg-2", h: 82, at: 1.55 }, // Isla: Thursday 6:00 or Friday 5:30 with Dr Maya
  { bit: "msg-3", h: 61, at: 2.7 }, // Sarah: Thursday at 6 please (2×)
  { bit: "msg-4", h: 82, at: 3.0 },
  { bit: "msg-5", h: 61, at: 3.3 },
  { bit: "msg-6", h: 124, at: 3.6 }, // Isla: you're booked… confirmation sent
];
const GAPPX = 16;
const BOTTOM = 860;
const WIPE = 4.2;

export function S06Booked() {
  const t = useTime();
  const bgBlur = tween(t, 0.1, 0.7);
  // Chat scrolls so the newest message sits on the baseline.
  const shown = MSGS.map((m) => tween(t, m.at, 0.3));
  const total = MSGS.reduce((sum, m, i) => sum + shown[i] * (m.h * SCALE + GAPPX), 0);
  const clay = tween(t, WIPE, 0.45);
  const white = tween(t, WIPE + 0.2, 0.45);
  const origin = { x: 960 + 200, y: BOTTOM - 60 };
  const flip = tween(t, 5.35, 0.22);
  const flipIn = tween(t, 5.57, 0.25);
  const lift = tween(t, 6.55, 0.45);
  const enter = tween(t, 6.0, 0.3);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      {/* Before the wipe: the conversation. */}
      <Img
        src={staticFile("ui/bits/screen-sarah.png")}
        style={{ position: "absolute", left: -300, top: -260, width: 2400, filter: `blur(${bgBlur * 18}px)`, opacity: mix(1, 0.5, bgBlur) }}
      />
      <div style={{ position: "absolute", left: 960 - (466 * SCALE) / 2, top: BOTTOM - total, width: 466 * SCALE }}>
        {MSGS.map((m, i) =>
          shown[i] > 0 ? (
            <div key={m.bit} style={{ marginBottom: GAPPX, ...blurIn(t, m.at, null, 24) }}>
              <Bit name={m.bit} w={466 * SCALE} />
            </div>
          ) : null,
        )}
      </div>
      {/* Honest speed-up: the back half of the conversation plays at double speed. */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 120,
          height: 58,
          padding: "0 22px",
          borderRadius: 29,
          background: C.paper,
          border: `1.5px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: 30,
          color: C.ink,
          letterSpacing: "-0.02em",
          ...blurIn(t, 2.45, WIPE - 0.1, 10),
        }}
      >
        2×
      </div>

      {/* The wipe: a clay ring sweeps out from Isla's reply, white follows. */}
      <div style={{ position: "absolute", inset: 0, background: C.clay, clipPath: `circle(${clay * 2300}px at ${origin.x}px ${origin.y}px)` }} />
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", clipPath: `circle(${white * 2300}px at ${origin.x}px ${origin.y}px)`, perspective: 1800 }}>
        <div style={{ position: "absolute", left: 140, top: 340 }}>
          <div style={{ ...giant(92), ...blurIn(t, 4.6) }}>Answers.</div>
          <div style={{ ...giant(92), marginTop: 12, ...blurIn(t, 4.85) }}>Checks your diary.</div>
          <div style={{ ...accent(112), marginTop: 10, ...blurIn(t, 5.45) }}>Books it.</div>
        </div>
        <FloorShadow x={1110} y={820} w={620} h={70} height={200} style={{ opacity: 0.3 * tween(t, 4.8, 0.4) }} />
        <div style={{ position: "absolute", left: 1080, top: 300, transformStyle: "preserve-3d", transform: "rotateY(-14deg) rotateX(8deg)" }}>
          {/* The outcome flips on its horizontal axis: the real "In progress" card, then the real "Booked". */}
          <div style={{ position: "relative", height: 70 * 2.6 + 3 }}>
            {flip < 1 && (
              <div style={{ position: "absolute", ...blurIn(t, 4.7, null, 12) }}>
                <div style={{ transform: `rotateX(${flip * 90}deg)`, transformOrigin: "50% 50%" }}>
                  <Card radius={24}>
                    <Bit name="outcome-pre" w={263 * 2.6} />
                  </Card>
                </div>
              </div>
            )}
            {flip >= 1 && (
              <div style={{ position: "absolute", transform: `rotateX(${(1 - flipIn) * -90}deg)`, transformOrigin: "50% 50%" }}>
                <Card radius={24}>
                  <Bit name="outcome-booked" w={263 * 2.6} />
                </Card>
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: 34,
              marginLeft: 70,
              transform: `translateZ(${120 + lift * 420}px) translate(${lift * 260}px, ${-lift * 380 + (1 - enter) * 24}px) rotateZ(${-2 + lift * 4}deg)`,
              opacity: enter * (1 - tween(t, 6.8, 0.2)),
              filter: enter < 1 ? `blur(${(1 - enter) * 10}px)` : undefined,
            }}
          >
            <Bit name="upcoming-card" w={263 * 2.1} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
