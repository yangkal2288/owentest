import { AbsoluteFill } from "remotion";

import { useTime } from "../../../kit/time";
import { blurIn, tween } from "../motion";
import { accent, Bit, giant } from "../parts";

/**
 * Shot 11 · Handled (3 s). "Your entire front desk… Handled."
 * An endless tilted grid of the real inbox rows and booking blocks drifts
 * behind the giant line. Out: the grid collapses to the centre (the mark in shot 12).
 */
export const S11_LENGTH = 3;

const TILES = ["row-0", "bk-sarah", "row-1", "row-2", "wk-21", "row-3", "row-4", "wk-23", "row-5", "row-6", "wk-24", "row-7", "row-8"];
const COLS = 7;
const ROWS = 12;

export function S11Handled() {
  const t = useTime();
  const collapse = tween(t, 2.5, 0.5);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden", perspective: 1800 }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
          transformStyle: "preserve-3d",
          transform: `scale(${1 - collapse * 0.94}) rotateX(55deg) rotateZ(-28deg) translate(${-1400 + t * 60}px, ${-1500 + t * 110}px)`,
          opacity: 0.5 * tween(t, 0, 0.18) * (1 - collapse),
          filter: "blur(1.5px)",
        }}
      >
        {Array.from({ length: COLS * ROWS }, (_, k) => {
          const bit = TILES[(k * 5 + Math.floor(k / COLS)) % TILES.length];
          return (
            <div key={k} style={{ position: "absolute", left: (k % COLS) * 380 + (Math.floor(k / COLS) % 2) * 190, top: Math.floor(k / COLS) * 118 }}>
              <Bit name={bit} w={343} style={{ borderRadius: 10 }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - collapse }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", ...giant(132) }}>
          {["Your", "entire", "front", "desk."].map((w, i) => (
            <span key={w} style={{ display: "inline-block", marginRight: "0.24em", ...blurIn(t, 0.05 + i * 0.07, null, 30) }}>
              {w}
            </span>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", ...accent(250), ...blurIn(t, 1.62, null, 30) }}>Handled.</div>
      </div>
    </AbsoluteFill>
  );
}
