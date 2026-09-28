import { AbsoluteFill, Img, staticFile } from "remotion";

import { C } from "../../../brand";
import { useTime } from "../../../kit/time";
import BLOCKS from "../week-blocks.json";
import { blurIn, mix, settle, tween } from "../motion";
import { accent, Bit, Card, FloorShadow, giant } from "../parts";

/**
 * Shot 8 · Watch it fill up (5 s). "…and watch it fill up."
 * The real Bookings week view (21–27 Sep), tilted. The THU 24 card from shot 6
 * flies in and becomes Sarah's block at Thursday 6pm; then the rest of the
 * week's real bookings drop into their slots in a staggered cascade.
 * Out: push into Sarah's block.
 */
export const S08_LENGTH = 5;

const W8 = 1.12;
// Week card: css rect x285 y385 of the week view (scripts/capture-stills.mjs).
const rect = (b: { x: number; y: number; w: number; h: number }) => ({ x: (b.x - 285) * W8, y: (b.y - 385) * W8, w: b.w * W8, h: b.h * W8 });
const KEEP = new Set(["wk-00", "wk-01", "wk-20"]); // already booked when we arrive
const SARAH = "wk-22";
const CASCADE = BLOCKS.filter((b) => !KEEP.has(b.id) && b.id !== SARAH).sort((p, q) => p.x - q.x || p.y - q.y);

export function S08Fill() {
  const t = useTime();
  const enter = tween(t, 0, 0.45);
  const push = tween(t, 4.5, 0.5);
  const sarahBlock = BLOCKS.find((b) => b.id === SARAH)!;
  const sr = rect(sarahBlock);
  const fly = settle(t, 0.25, 5.5);
  const from = { x: sr.x + 520, y: sr.y - 900, w: 263 * 1.5 };

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + push * 0.8})`, transformOrigin: "1380px 760px", opacity: 1 - tween(t, 4.75, 0.25) }}>
        <div style={{ position: "absolute", left: 140, top: 390 }}>
          <div style={{ ...giant(88), ...blurIn(t, 0.5) }}>Watch your</div>
          <div style={{ ...giant(88), marginTop: 6, ...blurIn(t, 0.62) }}>
            diary <span style={accent(108)}>fill up.</span>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, perspective: 2400, transform: `translateX(${(1 - enter) * (1 - enter) * 1400}px)`, filter: enter < 1 ? `blur(${(1 - enter) * 24}px)` : undefined }}>
          <div
            style={{
              position: "absolute",
              left: 860,
              top: 90,
              width: 1114 * W8,
              height: 769 * W8,
              transformStyle: "preserve-3d",
              transform: "rotateX(40deg) rotateZ(-13deg)",
              transformOrigin: "30% 60%",
            }}
          >
            <Card radius={22} style={{ position: "absolute", inset: 0 }}>
              <Img src={staticFile("ui/bits/week-card.png")} style={{ width: 1114 * W8, display: "block" }} />
            </Card>
            {/* Empty slots, filled one by one. */}
            {[...CASCADE, sarahBlock].map((b) => {
              const r = rect(b);
              return <div key={"e" + b.id} style={{ position: "absolute", left: r.x - 1, top: r.y + 2, width: r.w + 2, height: r.h - 2, background: C.paper }} />;
            })}
            {CASCADE.map((b, k) => {
              const at = 1.2 + k * 0.085;
              const u = settle(t, at, 9);
              if (u <= 0) return null;
              const r = rect(b);
              const z = 220 * (1 - u);
              return (
                <div key={b.id}>
                  <FloorShadow x={r.x} y={r.y} w={r.w} h={r.h} height={z} style={{ transform: "translateZ(1px)", opacity: 0.25 * (1 - u) * Math.min(1, u * 4) }} />
                  <div style={{ position: "absolute", left: r.x, top: r.y, transform: `translateZ(${z}px)`, opacity: Math.min(1, u * 3) }}>
                    <Bit name={b.id} w={r.w} />
                  </div>
                </div>
              );
            })}
            {/* THU 24 · Anti-Wrinkle Consultation → Sarah's block at Thursday 6pm. */}
            {(() => {
              const w = mix(from.w, sr.w, fly);
              const morph = tween(fly, 0.8, 0.2);
              const z = 300 * (1 - fly);
              return (
                <>
                  <FloorShadow x={sr.x} y={sr.y} w={sr.w} h={sr.h} height={z} style={{ transform: "translateZ(1px)", opacity: 0.3 * (1 - fly) }} />
                  <div style={{ position: "absolute", left: mix(from.x, sr.x, fly), top: mix(from.y, sr.y, fly), transform: `translateZ(${z}px) rotateX(${-40 * (1 - fly)}deg)`, transformOrigin: "50% 100%" }}>
                    <div style={{ opacity: 1 - morph }}>
                      <Bit name="upcoming-card" w={w} />
                    </div>
                    <div style={{ position: "absolute", left: 0, top: 0, opacity: morph }}>
                      <Bit name={SARAH} w={sr.w} />
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
