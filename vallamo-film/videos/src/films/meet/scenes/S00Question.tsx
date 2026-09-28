import { AbsoluteFill } from "remotion";

import { C } from "../../../brand";
import { useTime } from "../../../kit/time";
import { blurIn, settle, tween } from "../motion";
import { Card, eyebrow, FloorShadow, giant, Logo } from "../parts";
import { Piece } from "../Piece";

/**
 * Shot 0 · The question (4.2 s, no VO). From Owen's mockup, rebuilt in the
 * film's world: white, Inter bold, one clay accent, real UI only.
 * "How many enquiries go unanswered while you're with a client?" builds word by
 * word; a clay highlighter swipes under "unanswered". On the right, real
 * enquiries (WhatsApp, Instagram, web chat) keep arriving and stacking up,
 * unanswered, in front of a slow clay ring. The Vallamo wordmark sits between
 * hairlines at the foot.
 * Out: the type blurs away and the enquiries sink back into depth, where
 * shot 1's blurred enquiries pick up.
 */
export const S00_LENGTH = 4.2;

const LINES = [["How", "many", "enquiries"], ["go", "unanswered", "while"], ["you’re", "with", "a", "client?"]];
const TYPE = 90;
const CARDS = [
  { name: "row-1" as const, at: 0.5, x: 0, y: 0, r: -3 }, // Priya · WhatsApp
  { name: "row-0" as const, at: 1.05, x: 60, y: 170, r: 2.5 }, // Sarah · Instagram
  { name: "row-5" as const, at: 1.6, x: 10, y: 340, r: -2 }, // Grace · web chat
];
const CW = 500;

export function S00Question() {
  const t = useTime();
  const out = tween(t, S00_LENGTH - 0.55, 0.5);
  const swipe = tween(t, 1.25, 0.45);
  const ring = tween(t, 0.2, 1.2);
  const mark = tween(t, 1.9, 0.6);
  let k = 0;

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden", perspective: 1800 }}>
      {/* A thin clay ring, turning slowly behind the enquiries (the mockup's arc, as motion). */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.55 * ring * (1 - out) }}>
        <circle
          cx={1540}
          cy={500}
          r={360}
          fill="none"
          stroke={C.clay}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - ring}
          transform={`rotate(${-100 + t * 9} 1540 500)`}
        />
      </svg>

      {/* The question. */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 290,
          opacity: 1 - out,
          filter: out > 0 ? `blur(${out * 12}px)` : undefined,
          transform: `translateY(${-out * 30}px) scale(${1 + 0.02 * tween(t, 0, S00_LENGTH)})`,
          transformOrigin: "0 50%",
        }}
      >
        <div style={{ ...eyebrow, fontSize: 22, letterSpacing: "0.32em", ...blurIn(t, 0.05, null, 8) }}>Clinic owners</div>
        <div style={{ marginTop: 40 }}>
          {LINES.map((line, i) => (
            <div key={i} style={{ ...giant(TYPE), lineHeight: 1.08, whiteSpace: "nowrap" }}>
              {line.map((w) => {
                const at = 0.2 + k++ * 0.07;
                const hl = w === "unanswered";
                return (
                  <span key={w} style={{ position: "relative", display: "inline-block", marginRight: "0.24em", ...blurIn(t, at, null, 30) }}>
                    {hl && (
                      <span
                        style={{
                          position: "absolute",
                          left: -8,
                          right: -8,
                          bottom: "0.06em",
                          height: "0.42em",
                          background: C.clay,
                          opacity: 0.24,
                          borderRadius: 4,
                          transform: `scaleX(${swipe})`,
                          transformOrigin: "0 50%",
                        }}
                      />
                    )}
                    <span style={{ position: "relative" }}>{w}</span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* The enquiries keep arriving, unanswered. */}
      <FloorShadow x={1310} y={880} w={480} h={40} height={200} style={{ opacity: 0.16 * tween(t, 0.6, 0.6) * (1 - out) }} />
      <div style={{ position: "absolute", left: 1250, top: 250, transformStyle: "preserve-3d", transform: `rotateY(${-14 + 4 * tween(t, 0, S00_LENGTH)}deg) rotateX(4deg)` }}>
        {CARDS.map((c, i) => {
          const u = settle(t, c.at, 8);
          if (u <= 0) return null;
          // On the way out they sink back into depth, where shot 1's blurred enquiries are waiting.
          const z = -900 * out;
          const bob = Math.sin(t * 1.8 + i * 1.4) * 5;
          return (
            <div
              key={c.name}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                opacity: Math.min(1, u * 1.5) * (1 - out * 0.85),
                filter: u < 1 || out > 0 ? `blur(${(1 - u) * 10 + out * 8}px)` : undefined,
                transform: `translate3d(${c.x + (1 - u) * 120}px, ${c.y + (1 - u) * -40 + bob}px, ${z + (1 - u) * 160}px) rotateZ(${c.r}deg)`,
              }}
            >
              <Card radius={20}>
                <Piece name={c.name} w={CW} />
              </Card>
            </div>
          );
        })}
      </div>

      {/* Vallamo between hairlines, at the foot. */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 92, display: "flex", alignItems: "center", justifyContent: "center", gap: 36, opacity: mark * (1 - out) }}>
        <div style={{ width: 300 * mark, height: 1.5, background: C.clay, opacity: 0.6 }} />
        <Logo file="vallamo-wordmark" w={170} h={55} />
        <div style={{ width: 300 * mark, height: 1.5, background: C.clay, opacity: 0.6 }} />
      </div>
    </AbsoluteFill>
  );
}
