import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";

import { C, FONT } from "../../brand";

/** A real UI piece from public/ui/bits. `scale` is px per CSS px of the captured UI (bits are 4x, screens 2x). */
export function Bit({ name, w, style }: { name: string; w: number; style?: CSSProperties }) {
  return <Img src={staticFile(`ui/bits/${name}.png`)} style={{ display: "block", width: w, height: "auto", ...style }} />;
}

/** The Vallamo logo SVGs use currentColor: drawn as a mask filled with clay. */
export function Logo({ file, w, h, color = C.clay, style }: { file: string; w: number; h: number; color?: string; style?: CSSProperties }) {
  const url = `url(${staticFile(`brand/${file}.svg`)})`;
  return (
    <div
      style={{
        width: w,
        height: h,
        backgroundColor: color,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        ...style,
      }}
    />
  );
}

/** Soft contact shadow on the floor under a floating object: a blurred ellipse, not a box-shadow. */
export function FloorShadow({ x, y, w, h, height = 0, style }: { x: number; y: number; w: number; h: number; height?: number; style?: CSSProperties }) {
  // Higher objects cast a wider, softer, fainter shadow.
  const spread = 1 + height / 400;
  const opacity = Math.max(0.08, 0.34 - height / 900);
  return (
    <div
      style={{
        position: "absolute",
        left: x + (w - w * spread) / 2,
        top: y,
        width: w * spread,
        height: h * spread,
        borderRadius: "50%",
        background: C.ink,
        opacity,
        filter: `blur(${14 + height / 12}px)`,
        ...style,
      }}
    />
  );
}

/** A floating UI card: the product's own surface (paper, hairline, radius), no drop shadow. */
export function Card({ children, radius = 22, pad = 0, style }: { children: ReactNode; radius?: number; pad?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "inline-block", verticalAlign: "top", background: C.paper, border: `1.5px solid ${C.line}`, borderRadius: radius, padding: pad, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

/** White Apple-style browser: grey traffic lights, vallamo.app pill, 18px radius, hairline. */
export function Browser({ w, h, children, style }: { w: number; h: number; children: ReactNode; style?: CSSProperties }) {
  const bar = 52;
  return (
    <div style={{ width: w, height: h, background: "#FFFFFF", border: `1.5px solid ${C.line}`, borderRadius: 18, overflow: "hidden", position: "relative", ...style }}>
      <div style={{ height: bar, display: "flex", alignItems: "center", borderBottom: `1px solid ${C.line}`, background: "#FFFFFF", position: "relative" }}>
        <div style={{ display: "flex", gap: 9, marginLeft: 20 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 13, height: 13, borderRadius: 7, background: "#DDD8D1" }} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            height: 32,
            padding: "0 90px",
            borderRadius: 9,
            background: "#F4F1EC",
            display: "flex",
            alignItems: "center",
            fontFamily: FONT.sans,
            fontSize: 15,
            color: C.ink2,
            letterSpacing: "-0.01em",
          }}
        >
          vallamo.app
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: bar, right: 0, bottom: 0, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

/** Giant kinetic type: Inter bold, tight. */
export const giant = (size: number): CSSProperties => ({
  fontFamily: FONT.sans,
  fontWeight: 700,
  fontSize: size,
  letterSpacing: "-0.035em",
  lineHeight: 0.98,
  color: C.ink,
});

/** Accent line: Playfair Display italic, clay. */
export const accent = (size: number): CSSProperties => ({
  fontFamily: FONT.serif,
  fontStyle: "italic",
  fontWeight: 400,
  fontSize: size,
  letterSpacing: "-0.01em",
  color: C.clay,
});

export const eyebrow: CSSProperties = {
  fontFamily: FONT.sans,
  fontWeight: 600,
  fontSize: 20,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: C.clay,
};

/** Required on frames that show demo data. */
export function DemoLabel() {
  return (
    <div style={{ position: "absolute", left: 64, bottom: 44, fontFamily: FONT.sans, fontSize: 20, color: C.ink3, letterSpacing: "-0.005em" }}>
      Demo clinic · illustrative figures
    </div>
  );
}
