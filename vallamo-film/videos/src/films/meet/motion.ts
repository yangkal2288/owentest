import type { CSSProperties } from "react";
import { Easing } from "remotion";

import { critical, step } from "../../kit/spring";
import { clamp01 } from "../../kit/time";

/** The product's easing, cubic-bezier(.2,.7,.2,1): all UI moves use it. */
export const ease = Easing.bezier(0.2, 0.7, 0.2, 1);
/** 0 → 1 over [start, start + length], eased. */
export const tween = (t: number, start: number, length: number) => ease(clamp01((t - start) / length));
/** A critically damped settle (no overshoot) for camera and 3D moves. */
export const settle = (t: number, start: number, response = 9) => Math.min(1, step(t - start, critical(response)));
export const mix = (a: number, b: number, u: number) => a + (b - a) * u;

/** The product's blurIn: fade + 10px blur + rise. `out` mirrors it upward. */
export function blurIn(t: number, at: number, out: number | null = null, rise = 18, length = 0.3): CSSProperties {
  const u = tween(t, at, length);
  const v = out === null ? 0 : tween(t, out, 0.22);
  const opacity = u * (1 - v);
  const blur = (1 - u) * 10 + v * 10;
  return {
    opacity,
    transform: `translateY(${(1 - u) * rise - v * rise}px)`,
    filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
  };
}

/** Visible between two times (with the blurIn fades inside the window). */
export const live = (t: number, from: number, to: number) => t >= from - 0.001 && t < to + 0.25;
