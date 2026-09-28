import { AbsoluteFill } from "remotion";

import { C } from "../../../brand";
import { useTime } from "../../../kit/time";
import { blurIn, mix, tween } from "../motion";
import { Bit, Card, giant } from "../parts";

/**
 * Shots 1 + 2 · Dot and hook (0:00–0:06).
 * A clay dot stretches into a line; giant type sits on it while real
 * enquiries drift behind at depth and multiply. Out: the line retracts into
 * the dot, which becomes the Vallamo mark in shot 3.
 */
export const S01_LENGTH = 6;

const ROWS = [
  { bit: "row-1", x: 90, y: 110, z: -700, r: -4, at: 1.5 },
  { bit: "row-5", x: 1320, y: 90, z: -900, r: 3, at: 1.7 },
  { bit: "msg-1", x: 1150, y: 760, z: -500, r: -2, w: 466, at: 1.9 },
  { bit: "row-3", x: 140, y: 780, z: -380, r: 2, at: 2.1 },
  { bit: "row-0", x: 700, y: 20, z: -1200, r: 1, at: 2.3 },
  // "Enquiries don't wait": more arrive.
  { bit: "row-7", x: 1480, y: 470, z: -1100, r: -3, at: 4.0 },
  { bit: "row-2", x: -60, y: 470, z: -1000, r: 4, at: 4.15 },
  { bit: "row-8", x: 760, y: 880, z: -1000, r: -2, at: 4.3 },
  { bit: "row-4", x: 520, y: 300, z: -1500, r: 2, at: 4.45 },
  { bit: "row-6", x: 1080, y: 260, z: -1300, r: -1, at: 4.6 },
  { bit: "msg-3", x: 420, y: 640, z: -900, r: 2, w: 466, at: 4.75 },
];

function Words({ t, lines, at, out }: { t: number; lines: string[]; at: number; out: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <div key={line} style={{ position: "absolute", left: 0, right: 0, top: i === 0 ? 322 : 574, textAlign: "center", ...giant(230) }}>
          {line.split(" ").map((word, j) => (
            <span key={j} style={{ display: "inline-block", marginRight: "0.24em", ...blurIn(t, at + (i * 2 + j) * 0.07, out + j * 0.03, 40) }}>
              {word}
            </span>
          ))}
        </div>
      ))}
    </>
  );
}

export function S01Open() {
  const t = useTime();
  const dotIn = tween(t, 0.15, 0.35);
  const stretch = tween(t, 0.85, 0.9);
  const retract = tween(t, 5.45, 0.45);
  const half = mix(0, 810, stretch) * (1 - retract);
  const rowsOut = tween(t, 5.3, 0.5);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", perspective: 1400, overflow: "hidden" }}>
      {ROWS.map((d) => {
        const u = tween(t, d.at, 0.6);
        if (u <= 0) return null;
        const z = d.z + t * 75; // a slow dolly through the enquiries
        return (
          <div
            key={d.bit}
            style={{
              position: "absolute",
              left: d.x + Math.sin(t * 0.6 + d.r) * 16,
              top: d.y - t * 6,
              transform: `translateZ(${z}px) rotateZ(${d.r}deg) rotateX(8deg)`,
              filter: `blur(${Math.round(-z / 90 + rowsOut * 10)}px)`,
              opacity: 0.9 * u * (1 - rowsOut),
            }}
          >
            <Card radius={16}>
              <Bit name={d.bit} w={(d.w ?? 343) * 1.5} />
            </Card>
          </div>
        );
      })}
      {/* The clay dot, then the line the type sits on. */}
      <div style={{ position: "absolute", left: 960 - half, width: half * 2, top: 539, height: 3, background: C.clay }} />
      <div
        style={{
          position: "absolute",
          left: 960 + half - 9,
          top: 531,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: C.clay,
          transform: `scale(${dotIn})`,
        }}
      />
      <Words t={t} lines={["You’re with", "a client."]} at={2.0} out={3.8} />
      <Words t={t} lines={["Enquiries", "don’t wait."]} at={4.0} out={5.35} />
    </AbsoluteFill>
  );
}
