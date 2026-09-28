import { AbsoluteFill } from "remotion";

import { C } from "../../../brand";
import { useTime } from "../../../kit/time";
import { BEAT, blurIn, settle, sinceBeat, tween, useFilmTime } from "../motion";
import { Bit, FloorShadow, giant, Logo } from "../parts";
import { Piece } from "../Piece";

/**
 * Shot 7 · Connect your calendar (4 s). "Connect your calendar…"
 * A tilted grid of the real booking-system cards (Integrations page) drifts;
 * Cliniko, connected and healthy, lifts out in front and a clay line draws to
 * it from the Vallamo mark. No invented counter. Out: whip left (shot 8 whips in).
 */
export const S07_LENGTH = 4;

const SYSTEMS = [
  "google-calendar",
  "outlook-microsoft",
  "microsoft-bookings",
  "cal-com",
  "acuity-scheduling",
  "square-appointments",
  "boulevard",
  "pabau",
  "phorest",
];
const COLS = 4;
const ROWS = 5;
const CW = 363;
const CH = 138;
const G = 26;
const LINE = 10;
const PULSE_TRAVEL = 1.1; // seconds for a pulse to cross the line

export function S07Connect() {
  const t = useTime();
  const lift = settle(t, 0.35, 7);
  const draw = tween(t, 1.05, 0.8);
  // Pulse on the music's beat: a swell every beat, a ring every other beat.
  const filmT = useFilmTime();
  const beat = draw >= 1 ? Math.exp(-sinceBeat(filmT) * 9) : 0;
  const ring = sinceBeat(filmT, 2) / (BEAT * 2);
  const whip = tween(t, 3.62, 0.38);
  // Line from the mark to Cliniko's left edge (screen px).
  const a = { x: 250, y: 752 };
  const b = { x: 1004, y: 548 };
  const path = `M ${a.x} ${a.y} C ${a.x + 320} ${a.y}, ${b.x - 360} ${b.y}, ${b.x} ${b.y}`;

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-whip * whip * 1400}px)`, filter: whip > 0 ? `blur(${whip * 24}px)` : undefined }}>
        {/* The grid: every booking system Vallamo lists. */}
        <div style={{ position: "absolute", inset: 0, perspective: 2000 }}>
          <div
            style={{
              position: "absolute",
              left: 820,
              top: 60,
              transformStyle: "preserve-3d",
              transform: `rotateX(52deg) rotateZ(-20deg) translate(${-t * 40}px, ${t * 18}px)`,
              opacity: 0.9 * tween(t, 0, 0.4),
              filter: "blur(1.2px)",
            }}
          >
            {Array.from({ length: COLS * ROWS }, (_, k) => (
              <div key={k} style={{ position: "absolute", left: (k % COLS) * (CW + G), top: Math.floor(k / COLS) * (CH + G) }}>
                <Bit name={`b-int-${SYSTEMS[k % SYSTEMS.length]}`} w={CW} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 140, top: 360 }}>
          <div style={{ ...giant(96), ...blurIn(t, 0.2) }}>Connect your</div>
          <div style={{ ...giant(96), marginTop: 6, ...blurIn(t, 0.32) }}>calendar.</div>
        </div>
        <div style={{ position: "absolute", left: a.x - 96, top: a.y - 48, ...blurIn(t, 0.7, null, 10) }}>
          <Logo file="vallamo-mark" w={96} h={96} />
        </div>
        {/* The connection: a thick clay line that draws on, then pulses on the beat.
            Owen: "much less thin… make it pulsate". */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={path} pathLength={1} fill="none" stroke={C.clay} strokeWidth={LINE + 4 * beat} strokeDasharray={1} strokeDashoffset={1 - draw} strokeLinecap="round" />
          {/* Data pulses travelling from Vallamo to Cliniko: paper-coloured beads riding the line. */}
          {draw >= 1 &&
            [0, 1, 2].map((i) => {
              const p = ((t - 1.85) / PULSE_TRAVEL + i / 3) % 1;
              const fade = Math.min(1, p * 6, (1 - p) * 6);
              return (
                <path
                  key={i}
                  d={path}
                  pathLength={1}
                  fill="none"
                  stroke={C.paper}
                  strokeOpacity={0.75 * fade * tween(t, 1.85, 0.3)}
                  strokeWidth={LINE * 0.45}
                  strokeLinecap="round"
                  strokeDasharray={`0.035 1`}
                  strokeDashoffset={-p}
                />
              );
            })}
          {/* Nodes at both ends; the Cliniko end rings out on every other beat. */}
          <circle cx={b.x} cy={b.y} r={(LINE + 6) * tween(t, 1.75, 0.2) * (1 + 0.25 * beat)} fill={C.clay} />
          {draw >= 1 && <circle cx={b.x} cy={b.y} r={LINE + 6 + ring * 46} fill="none" stroke={C.clay} strokeWidth={4} strokeOpacity={0.55 * (1 - ring)} />}
        </svg>
        {/* Cliniko, connected: lifts out of the grid to the front. */}
        <FloorShadow x={1040} y={700} w={520} h={50} height={120} style={{ opacity: 0.28 * lift }} />
        <div style={{ position: "absolute", left: 1004, top: 548 - (74 * 1.6) / 2 + (1 - lift) * 80, opacity: lift, filter: lift < 1 ? `blur(${(1 - lift) * 10}px)` : undefined }}>
          <Piece name="int-cliniko" w={CW * 1.6} />
        </div>
      </div>
    </AbsoluteFill>
  );
}
