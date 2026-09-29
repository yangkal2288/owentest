import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

import { C } from "../../brand";
import { ease, settle, tween } from "../meet/motion";

/**
 * The cinema kit for the Meta ads, after the reference Owen chose (a launch film where
 * nothing sits on empty white): the product's real UI as a tilted world in depth, big
 * type that slams in (the 240 fps render turns the speed into real motion blur), cuts
 * that push through the frame, and layered soft shadows.
 */

/** Layered shadow for a card floating over the world: contact, mid and ambient. */
export const SHADOW = {
  card: "0 1px 2px rgb(44 37 32 / .06), 0 8px 20px -6px rgb(44 37 32 / .12), 0 40px 90px -24px rgb(44 37 32 / .30)",
  lift: "0 2px 4px rgb(44 37 32 / .06), 0 18px 36px -10px rgb(44 37 32 / .16), 0 70px 140px -30px rgb(44 37 32 / .38)",
};

export type WorldKind = "week" | "inbox";
// The depth of field is baked into the tiles (scripts: see world-*.jpg, Gaussian 8 and 16):
// a live CSS blur over the whole plane made every 240 fps frame several times slower.
// Only blur beyond the baked amount (the spikes in a transition) is applied live.
const TILE: Record<WorldKind, { src: string; w: number; h: number; gap: number; cols: number; rows: number }> = {
  week: { src: "ui/bits/world-week-card", w: 1114, h: 769, gap: 70, cols: 4, rows: 5 },
  inbox: { src: "ui/bits/world-inbox-list", w: 686, h: 1120, gap: 60, cols: 6, rows: 3 },
};

/**
 * The real UI, tiled on a plane tilted away from camera (like a desk seen from above at
 * an angle), drifting, out of focus. `blur` is the depth of field; `wash` lifts it towards
 * white behind text; `x`/`y` pan the camera across the plane; `zoom` pushes in.
 */
export function World({ kind, t, blur = 7, wash = 0.55, x = 0, y = 0, zoom = 1, tilt = 50, spin = -16, opacity = 1, style }: { kind: WorldKind; t: number; blur?: number; wash?: number; x?: number; y?: number; zoom?: number; tilt?: number; spin?: number; opacity?: number; style?: CSSProperties }) {
  const T = TILE[kind];
  const W = T.cols * (T.w + T.gap);
  const H = T.rows * (T.h + T.gap);
  const drift = t * 26;
  const baked = blur >= 13 ? 16 : 8;
  const extra = Math.max(0, blur - baked);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#FBF9F5", opacity, ...style }}>
      <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: "50% 30%" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: W,
            height: H,
            marginLeft: -W / 2,
            marginTop: -H / 2,
            transform: `scale(${zoom}) rotateX(${tilt}deg) rotateZ(${spin}deg) translate3d(${x - drift}px, ${y - drift * 0.4}px, 0)`,
            background: "#EEE8DF",
            filter: extra > 0.5 ? `blur(${extra}px)` : undefined,
          }}
        >
          {Array.from({ length: T.cols * T.rows }, (_, i) => (
            <Img
              key={i}
              src={staticFile(`${T.src}-b${baked}.jpg`)}
              style={{
                position: "absolute",
                left: (i % T.cols) * (T.w + T.gap) + ((Math.floor(i / T.cols) % 2) * (T.w + T.gap)) / 2,
                top: Math.floor(i / T.cols) * (T.h + T.gap),
                width: T.w,
                height: T.h,
                borderRadius: 26,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
      <Bokeh t={t} count={12} opacity={0.9} />
      {/* Light: bright where the words are, the world darker and warmer towards the edges. */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 42%, rgba(255,255,255,${wash}) 0%, rgba(255,255,255,${wash * 0.6}) 45%, rgba(255,255,255,0) 100%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(60,45,30,.10) 100%)" }} />
    </AbsoluteFill>
  );
}

/** One run of a headline: text and whether it is the clay italic emphasis. */
export type Run = [string, boolean?];

/**
 * A headline that slams in word by word: each word lands from larger, blurred and low,
 * fast enough that the motion blur carries it. `out` pushes it through the camera.
 * `dot` ends it with the clay full stop.
 */
export function Slam({ t, at, out = null, lines, base, emStyle, size, align = "center", stagger = 0.07, dot = false, still = false, style }: { t: number; at: number; out?: number | null; lines: Run[][]; base: CSSProperties; emStyle: CSSProperties; size: number; align?: "center" | "left"; stagger?: number; dot?: boolean; still?: boolean; style?: CSSProperties }) {
  const o = out === null ? 0 : tween(t, out, 0.24);
  if (o >= 1) return null;
  let k = 0;
  return (
    <div
      style={{
        textAlign: align,
        opacity: 1 - o,
        filter: o > 0.01 ? `blur(${o * 22}px)` : undefined,
        transform: `scale(${1 + o * 0.35})`,
        transformOrigin: align === "center" ? "50% 50%" : "0% 50%",
        ...style,
      }}
    >
      {lines.map((line, li) => (
        // The line carries the base type, so the spaces between words are full size.
        <div key={li} style={{ whiteSpace: "nowrap", ...base, fontSize: size }}>
          {line.map(([text, isEm], ri) => (
            <span key={ri}>
              {text.split(/(\s+)/).map((w, wi) => {
                if (/^\s+$/.test(w)) return w;
                const u = still ? 1 : ease(Math.min(1, Math.max(0, (t - at - k++ * stagger) / 0.2)));
                const last = dot && li === lines.length - 1 && ri === line.length - 1 && wi === text.split(/(\s+)/).length - 1;
                return (
                  <span
                    key={wi}
                    style={{
                      display: "inline-block",
                      ...(isEm ? emStyle : base),
                      fontSize: isEm ? (emStyle.fontSize as number) ?? size : size,
                      opacity: Math.min(1, u * 1.8),
                      transform: `translate3d(0, ${(1 - u) * 0.35 * size}px, 0) scale(${1 + (1 - u) * 0.55})`,
                      transformOrigin: "50% 80%",
                      filter: u < 0.98 ? `blur(${(1 - u) * 16}px)` : undefined,
                    }}
                  >
                    {w}
                    {last && <Dot t={t} at={at + k * stagger} size={size * 0.2} />}
                  </span>
                );
              })}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** The clay full stop, the ads' connecting motif. */
export function Dot({ t, at, size }: { t: number; at: number; size: number }) {
  const u = settle(t, at, 16);
  return <span style={{ display: "inline-block", width: size, height: size, marginLeft: size * 0.25, borderRadius: "50%", background: C.clay, transform: `scale(${u})`, verticalAlign: "baseline" }} />;
}

/** A camera push through the frame: the outgoing layer flies past the lens as the next settles into place. */
export function pushOut(t: number, at: number, len = 0.3): CSSProperties {
  const u = tween(t, at, len);
  if (u <= 0) return {};
  return { opacity: 1 - u, transform: `scale(${1 + u * u * 0.9})`, filter: `blur(${u * 26}px)` };
}
export function pushIn(t: number, at: number, len = 0.4): CSSProperties {
  const u = settle(t, at, 12);
  if (u >= 0.999) return {};
  // Settles from slightly larger: the camera arriving, and the frame edge never shows what is underneath.
  return { opacity: Math.min(1, u * 1.6), transform: `scale(${1.16 - 0.16 * u})`, filter: `blur(${(1 - u) * 20}px)` };
}

/** A floating card: gentle 3D sway and bob, layered shadow. */
export function Float({ t, children, sway = 1, style }: { t: number; children: ReactNode; sway?: number; style?: CSSProperties }) {
  const rx = Math.sin(t * 0.9) * 2.5 * sway;
  const ry = Math.cos(t * 0.7) * 3.5 * sway;
  const bob = Math.sin(t * 1.3) * 6 * sway;
  return <div style={{ transform: `translate3d(0, ${bob}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`, transformStyle: "preserve-3d", ...style }}>{children}</div>;
}

// ---------------------------------------------------------------- premium finishing

/**
 * A soft lens iris: the incoming shot opens through a feathered circle from (x, y), eased
 * in and out, instead of a hard-edged wipe. Spread onto the incoming layer's style.
 */
export function iris(t: number, at: number, len: number, x: string, y: string, feather = 260): CSSProperties {
  const raw = Math.min(1, Math.max(0, (t - at) / len));
  if (raw >= 1) return {};
  const k = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2; // ease in-out
  const r = k * 2300;
  const m = `radial-gradient(circle at ${x} ${y}, #000 ${Math.max(0, r - feather)}px, rgba(0,0,0,.6) ${r - feather * 0.4}px, transparent ${r}px)`;
  return { maskImage: m, WebkitMaskImage: m };
}

/** A warm band of light that travels across the frame once, from `at`. */
export function Sweep({ t, at, len = 0.9, strength = 0.5, angle = 105 }: { t: number; at: number; len?: number; strength?: number; angle?: number }) {
  const u = Math.min(1, Math.max(0, (t - at) / len));
  if (u <= 0 || u >= 1) return null;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, transparent 38%, rgba(255,236,200,${strength}) 50%, transparent 62%)`,
        backgroundSize: "300% 100%",
        backgroundPosition: `${110 - 140 * ease(u)}% 0`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
}

/** Out-of-focus specks of light drifting through the depth of the world. */
export function Bokeh({ t, count = 14, tint = "255,240,215", opacity = 1 }: { t: number; count?: number; tint?: string; opacity?: number }) {
  const r = (i: number, k: number) => {
    const s = Math.sin(i * 91.7 + k * 37.3) * 43758.5453;
    return s - Math.floor(s);
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {Array.from({ length: count }, (_, i) => {
        const size = 40 + r(i, 1) * 150;
        const depth = 0.3 + r(i, 2) * 0.7;
        const x = ((r(i, 3) * 1300 + t * 18 * depth) % 1300) - 110;
        const y = r(i, 4) * 2000 - 40 + Math.sin(t * 0.6 + i) * 30 * depth - t * 10 * depth;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: ((y % 2000) + 2000) % 2000 - 40,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${tint},${0.32 * depth}) 0%, rgba(${tint},${0.14 * depth}) 45%, rgba(${tint},0) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

/** Fine film grain over the whole frame: premium texture, no flat digital areas. */
export function Grain({ t, opacity = 0.05 }: { t: number; opacity?: number }) {
  const f = Math.floor(t * 24);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile("cinema/grain.png")})`,
        backgroundSize: "512px 512px",
        backgroundPosition: `${(f * 173) % 512}px ${(f * 311) % 512}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
}
