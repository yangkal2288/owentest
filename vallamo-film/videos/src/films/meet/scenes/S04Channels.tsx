import type { CSSProperties } from "react";
import { AbsoluteFill, Easing, Img, staticFile } from "remotion";

import { C } from "../../../brand";
import { clamp01, useTime } from "../../../kit/time";
import { accent, Card, eyebrow, FloorShadow, giant } from "../parts";
import { Piece, pieceSize } from "../Piece";

/**
 * Shot 4 · Channels (VO line 4, 4.5 s).
 * "Answers on WhatsApp… Instagram… and your website… all in one inbox."
 * Beats land about every 0.85 s (Owen: "it can be quicker").
 * The channel word and badge swap in place; each channel's real enquiry
 * pops in on the right as its word lands, so all three are on screen at the end.
 */
export const S04_LENGTH = 4.5;

// The product's easing (tailwind.config.mjs).
const ease = Easing.bezier(0.2, 0.7, 0.2, 1);
const tween = (t: number, start: number, length: number) => ease(clamp01((t - start) / length));

const CHANNELS = [
  { at: 0.2, badge: "badge-wa", word: "WhatsApp", row: "row-1" as const }, // Priya Shah
  { at: 1.05, badge: "badge-ig", word: "Instagram", row: "row-0" as const }, // Sarah Mitchell
  { at: 1.9, badge: "badge-web", word: "your website", row: "row-5" as const }, // Grace Morgan
] as const;
const SWAP = 0.22; // the outgoing word leaves in this long; the next arrives over the same span
const TYPE = 104;
export const CARD_W = 700;
export const CARD_H = (CARD_W * pieceSize("row-0").h) / pieceSize("row-0").w + 3;
export const GAP = 26;
export const STACK_X = 1070;
/** Where the three cards rest, flat, on the last frame: shot 5 picks them up from here. */
export const STACK_TOP = 540 - (3 * (CARD_H + GAP) - GAP) / 2;

/** Rise + blur-in (the product's `blurIn`), and the mirror on the way out. */
function swapStyle(t: number, inAt: number, outAt: number | null, travel = 0.42): CSSProperties {
  const enter = tween(t, inAt, 0.3);
  const leave = outAt === null ? 0 : tween(t, outAt, SWAP);
  const y = (1 - enter) * travel * 100 - leave * travel * 100;
  const opacity = enter * (1 - leave);
  const blur = (1 - enter) * 10 + leave * 10;
  return { transform: `translateY(${y}px)`, opacity, filter: blur > 0.05 ? `blur(${blur}px)` : undefined };
}

export function S04Channels() {
  const t = useTime();
  const intro = tween(t, 0, 0.35);
  const sub = tween(t, 2.75, 0.35);
  const cardsIn = CHANNELS.map((c) => tween(t, c.at + 0.06, 0.36));
  const arrived = cardsIn.reduce((a, b) => a + b, 0);
  // The stack drifts up as it grows, keeping it centred on the frame.
  const stackTop = 540 - (arrived * (CARD_H + GAP) - GAP) / 2;
  // A slow, held camera drift across the whole shot (critically damped feel, no linear move).
  const drift = ease(clamp01(t / S04_LENGTH));
  // Hand-off to shot 5: the stack turns face-on and the words clear.
  const flat = tween(t, 3.85, 0.55);
  const clear = tween(t, 4.0, 0.4);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", perspective: 1800, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 150, top: 318, transform: `translateX(${-14 * drift - 30 * clear}px)`, opacity: 1 - clear, filter: clear > 0 ? `blur(${clear * 10}px)` : undefined }}>
        <div style={{ ...eyebrow, opacity: intro, transform: `translateY(${(1 - intro) * 8}px)` }}>Your channels</div>
        <div style={{ ...giant(TYPE), marginTop: 30, ...swapStyle(t, 0, null, 0.2) }}>Answers on</div>
        {/* Every channel keeps the same slot, so the line never re-centres. */}
        <div style={{ position: "relative", height: TYPE * 1.18, marginTop: 6 }}>
          {CHANNELS.map((c, i) => {
            const next = CHANNELS[i + 1];
            const style = swapStyle(t, c.at, next ? next.at - SWAP : null);
            if (!style.opacity) return null;
            return (
              <div key={c.word} style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center", gap: 24, whiteSpace: "nowrap", ...giant(TYPE), ...style }}>
                <Img src={staticFile(`ui/bits/${c.badge}.png`)} style={{ width: TYPE * 0.84, height: TYPE * 0.84 }} />
                <span>
                  {c.word}
                  <span style={{ color: C.clay }}>.</span>
                </span>
              </div>
            );
          })}
        </div>
        {/* The script's caption: "One inbox." in Playfair italic, clay. */}
        <div style={{ ...accent(84), marginTop: 26, opacity: sub, transform: `translateY(${(1 - sub) * 8}px)`, filter: sub < 1 ? `blur(${(1 - sub) * 8}px)` : undefined }}>
          One inbox.
        </div>
      </div>

      <FloorShadow style={{ opacity: Math.min(1, arrived) * 0.3 * (1 - clear) }} x={1110} y={stackTop + arrived * (CARD_H + GAP) + 30} w={640} h={44} height={90} />
      <div
        style={{
          position: "absolute",
          left: STACK_X,
          top: 0,
          transformStyle: "preserve-3d",
          transform: `rotateY(${(-15 + 3 * drift) * (1 - flat)}deg) rotateX(${5 * (1 - flat)}deg) translateX(${-10 * drift * (1 - flat)}px)`,
          transformOrigin: "0 540px",
        }}
      >
        {CHANNELS.map((c, i) => {
          const u = cardsIn[i];
          if (u <= 0) return null;
          return (
            <div
              key={c.row}
              style={{
                position: "absolute",
                left: 0,
                top: stackTop + i * (CARD_H + GAP),
                opacity: u,
                transform: `translateY(${(1 - u) * 28}px) scale(${0.97 + 0.03 * u})`,
                filter: u < 1 ? `blur(${(1 - u) * 10}px)` : undefined,
              }}
            >
              <Card>
                <Piece name={c.row} w={CARD_W} />
              </Card>
            </div>
          );
        })}
      </div>
      {/* Demo label is drawn once by the film. */}
    </AbsoluteFill>
  );
}
