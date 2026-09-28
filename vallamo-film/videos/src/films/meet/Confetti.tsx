import { C } from "../../brand";

/**
 * Celebration confetti, bursting outward from the edges of a rect (Owen's ask:
 * "celebration confetti come out of the edge of the final booking confirmed
 * message"). Deterministic: every particle is a pure function of time since
 * the burst. Brand colours only; drawn beneath the message so it never covers text.
 */
type Rect = { x: number; y: number; w: number; h: number };

const COLOURS = [C.clay, C.sage, C.clayDeep, "#D9CEBC" /* --line-strong */, C.clay, C.clayInk, C.sage, "#F0EADF" /* --line-soft */];
const COUNT = 220;
const GRAVITY = 1500; // px/s²
const DRAG = 1.6; // 1/s

function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function Confetti({ t, rect, life = 2.2 }: { t: number; rect: Rect; life?: number }) {
  if (t < 0 || t > life + 0.4) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: COUNT }, (_, i) => {
        const r = (k: number) => rand(i * 7.13 + k);
        // Emit from the left, right and top edges (not the bottom: the message's baseline).
        const edge = r(1) < 0.36 ? "left" : r(1) < 0.72 ? "right" : "top";
        const along = r(2);
        const x0 = edge === "left" ? rect.x : edge === "right" ? rect.x + rect.w : rect.x + along * rect.w;
        const y0 = edge === "top" ? rect.y : rect.y + along * rect.h * 0.8;
        const speed = 900 + r(3) * 1300;
        const spread = (r(4) - 0.5) * 1.1;
        const base = edge === "left" ? Math.PI * 1.12 : edge === "right" ? -Math.PI * 0.12 : -Math.PI / 2;
        const angle = base + spread + (edge === "top" ? 0 : -0.35);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 260;
        // Drag-damped ballistic motion, closed form.
        const delay = r(5) * r(5) * 0.35; // a dense first burst, then stragglers
        const tt = Math.max(0, t - delay);
        const k = (1 - Math.exp(-DRAG * tt)) / DRAG;
        const x = x0 + vx * k + Math.sin(tt * (3 + r(6) * 4) + i) * 18 * tt;
        const y = y0 + vy * k + (GRAVITY / DRAG) * (tt - k);
        const fade = Math.min(1, tt * 20) * Math.max(0, 1 - Math.max(0, tt - (life - 0.6)) / 0.6);
        const shape = r(7);
        const w = shape < 0.18 ? 14 : shape < 0.35 ? 7 : 16;
        const h = shape < 0.18 ? 14 : shape < 0.35 ? 34 : 26;
        const flip = Math.cos(tt * (8 + r(8) * 10) + r(9) * 6);
        const spin = (r(10) - 0.5) * 900 * tt + r(11) * 360;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - w / 2,
              top: y - h / 2,
              width: w,
              height: h,
              borderRadius: shape < 0.18 ? "50%" : 2,
              background: COLOURS[i % COLOURS.length],
              opacity: fade,
              transform: `rotate(${spin}deg) scaleY(${0.25 + 0.75 * Math.abs(flip)})`,
            }}
          />
        );
      })}
    </div>
  );
}
