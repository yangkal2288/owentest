import type { ReactNode } from "react";

import { tween } from "../meet/motion";
import { RED } from "./type";

/**
 * The loss effect shared by the Meta ads: a card that cracks from an impact point and
 * shatters into pieces that fly out and fall. The pieces are copies of the card, each
 * clipped to its shard, so whatever the card shows breaks with it.
 */
const IMPACT = { x: 63, y: 46 };
const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const N = 9;
const ANG = Array.from({ length: N }, (_, i) => ((i + 0.35 * (rnd(i) - 0.5)) / N) * Math.PI * 2);
const ring = (r: number, j: number) => ANG.map((a, i) => ({ x: IMPACT.x + Math.cos(a) * r * (0.85 + 0.3 * rnd(i + j)), y: IMPACT.y + Math.sin(a) * r * 1.8 * (0.85 + 0.3 * rnd(i + j + 7)) }));
const R1 = ring(9, 1);
const R2 = ring(30, 2);
const R3 = ring(160, 3);
type Shard = { pts: { x: number; y: number }[]; c: { x: number; y: number }; seed: number };
const SHARDS: Shard[] = [];
for (let i = 0; i < N; i++) {
  const j = (i + 1) % N;
  const layers = [[IMPACT, R1[i], R1[j]], [R1[i], R2[i], R2[j], R1[j]], [R2[i], R3[i], R3[j], R2[j]]];
  layers.forEach((pts, l) => {
    const c = { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
    SHARDS.push({ pts, c: { x: Math.min(95, Math.max(5, c.x)), y: Math.min(95, Math.max(5, c.y)) }, seed: rnd(i * 3 + l + 50) });
  });
}

/** Deterministic shake: layered sines, amplitude in px. */
export const shake = (t: number, a: number) => ({
  x: (a * (Math.sin(t * 91) + 0.6 * Math.sin(t * 143 + 1.3))) / 1.6,
  y: (a * 0.6 * (Math.sin(t * 107 + 0.7) + 0.5 * Math.sin(t * 171 + 2.1))) / 1.5,
  r: a * 0.05 * Math.sin(t * 77 + 0.4),
});

/** `children` cracks at `crackAt` and breaks apart at `shatterAt`. `radius` clips the cracks to the card. */
export function Breakable({ t, crackAt, shatterAt, radius, children }: { t: number; crackAt: number; shatterAt: number; radius: number; children: ReactNode }) {
  const crack = tween(t, crackAt, 0.12);
  if (t < shatterAt) {
    return (
      <div style={{ position: "relative" }}>
        {children}
        {crack > 0 && (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden", borderRadius: radius }}>
            {SHARDS.map((sd, i) => (
              <polygon
                key={i}
                points={sd.pts.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={RED}
                strokeWidth={2.5}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - crack}
              />
            ))}
          </svg>
        )}
      </div>
    );
  }
  const u = t - shatterAt;
  return (
    <div style={{ position: "relative" }}>
      {/* Holds the card's size; the shards are copies of it. */}
      <div style={{ visibility: "hidden" }}>{children}</div>
      {SHARDS.map((sd, i) => {
        const dx = sd.c.x - IMPACT.x;
        const dy = (sd.c.y - IMPACT.y) / 1.8;
        const d = Math.max(4, Math.hypot(dx, dy));
        const v = (1400 + 900 * sd.seed) / Math.sqrt(d);
        const x = (dx / d) * v * u * 9.36 * 0.12;
        const y = (dy / d) * v * u * 5.2 * 0.22 + 1500 * u * u;
        const z = (sd.seed - 0.3) * 900 * u;
        const r = (sd.seed - 0.5) * 520 * u;
        const o = 1 - tween(u, 0.35, 0.55);
        if (o <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `polygon(${sd.pts.map((p) => `${p.x}% ${p.y}%`).join(",")})`,
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotate(${r}deg) rotateX(${r * 0.6}deg)`,
              transformOrigin: `${sd.c.x}% ${sd.c.y}%`,
              opacity: o,
              filter: u > 0.2 ? `blur(${(u - 0.2) * 6}px)` : undefined,
            }}
          >
            {children}
          </div>
        );
      })}
    </div>
  );
}
