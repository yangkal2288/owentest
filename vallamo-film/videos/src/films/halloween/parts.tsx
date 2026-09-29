import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

import { C, FONT } from "../../brand";
import { ease, mix } from "../meet/motion";
import { pick, useF } from "../meta/format";
import { display, em } from "../meta/type";

/** Keyframed camera over the 1080 x 1920 stage: centre (x, y) and zoom. */
export type Key = { at: number; x: number; y: number; zoom: number };
export function camAt(keys: Key[], u: number) {
  if (u <= keys[0].at) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (u <= b.at) {
      const k = ease((u - a.at) / (b.at - a.at));
      return { at: u, x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), zoom: mix(a.zoom, b.zoom, k) };
    }
  }
  return keys[keys.length - 1];
}

/**
 * The stage: everything drawn in 1080 x 1920 stage coordinates, framed by the camera.
 * The 4:5 cut sees less height, so the same camera centre frames the same action.
 */
export function Stage({ cam: raw, children, style }: { cam: { x: number; y: number; zoom: number }; children: ReactNode; style?: CSSProperties }) {
  const F = useF();
  // The camera never looks past the edge of the set.
  const hx = F.W / 2 / raw.zoom;
  const hy = F.H / 2 / raw.zoom;
  const cam = { zoom: raw.zoom, x: Math.min(1080 - hx, Math.max(hx, raw.x)), y: Math.min(1920 - hy, Math.max(hy, raw.y)) };
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          transform: `translate(${F.W / 2 - cam.x * cam.zoom}px, ${F.H / 2 - cam.y * cam.zoom}px) scale(${cam.zoom})`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}

/** A channel's icon cut from its real Channels card (the 44 px tile at 20,20). */
export function ChannelIcon({ card, size }: { card: "m-ch-ig" | "m-ch-web" | "m-ch-wa"; size: number }) {
  const k = size / 44;
  return (
    <div style={{ width: size, height: size, overflow: "hidden", borderRadius: 12 * k, flex: "none" }}>
      <Img src={staticFile(`ui/pieces/png/${card}.png`)} style={{ display: "block", width: 267 * k, marginLeft: -20 * k, marginTop: -20 * k }} />
    </div>
  );
}

/**
 * A floating enquiry card: a narrative graphic in the clinic (the brief: never presented
 * as a real phone notification). Translucent while it waits; `gold` once it is a booking.
 */
export function EnquiryCard({ who, channel, icon, text, status, gold = 0, w = 560, style }: { who: string; channel: string; icon: "m-ch-ig" | "m-ch-web"; text: string; status?: string; gold?: number; w?: number; style?: CSSProperties }) {
  const s = w / 560;
  return (
    <div
      style={{
        width: w,
        boxSizing: "border-box",
        padding: 26 * s,
        borderRadius: 28 * s,
        background: `rgba(255, 252, 246, ${0.78 + 0.2 * gold})`,
        border: `${1.5 + 2.5 * gold}px solid ${gold > 0 ? `rgba(184,146,90,${0.4 + 0.6 * gold})` : "rgba(255,255,255,.7)"}`,
        boxShadow: `0 20px 50px -18px rgba(40,30,20,.45), 0 0 ${40 * gold}px rgba(214,170,90,${0.45 * gold})`,
        backdropFilter: "blur(6px)",
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 * s }}>
        <ChannelIcon card={icon} size={48 * s} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 28 * s, color: C.ink, letterSpacing: "-0.02em" }}>{who}</div>
          <div style={{ fontWeight: 500, fontSize: 21 * s, color: C.ink3 }}>{channel}</div>
        </div>
      </div>
      <div style={{ marginTop: 16 * s, background: "#F4EEE4", borderRadius: 22 * s, borderBottomLeftRadius: 8 * s, padding: `${16 * s}px ${22 * s}px`, fontSize: 30 * s, lineHeight: 1.3, color: C.ink }}>{text}</div>
      {status && <div style={{ marginTop: 14 * s, fontSize: 22 * s, fontWeight: 650, color: gold > 0.5 ? "#8E6C3E" : C.ink3 }}>{status}</div>}
    </div>
  );
}

/** A spoken line, subtitled: the film has to work muted. `who` null is the narrator. */
export function Caption({ u, at, to, who, children }: { u: number; at: number; to: number; who: string | null; children: ReactNode }) {
  const F = useF();
  if (u < at - 0.01 || u > to + 0.2) return null;
  const a = ease(Math.min(1, (u - at) / 0.18));
  const o = ease(Math.min(1, Math.max(0, (u - to) / 0.18)));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: pick(F, 1110, 1150), display: "flex", justifyContent: "center", opacity: a * (1 - o), transform: `translateY(${(1 - a) * 12}px)` }}>
      <div style={{ maxWidth: 940, padding: "18px 30px", borderRadius: 22, background: "rgba(30, 24, 20, .62)", backdropFilter: "blur(10px)", textAlign: "center" }}>
        {who && <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 22, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E3C28C", marginBottom: 6 }}>{who}</div>}
        <div style={{ ...(who ? display(44) : em(42)), color: who ? "#FFFFFF" : "#F6EBDD", lineHeight: 1.2 }}>{children}</div>
      </div>
    </div>
  );
}

/** Film lettering over a shot: the campaign headline, time cards, the product line. */
export function Title({ u, at, to, top, children, style }: { u: number; at: number; to: number; top: number; children: ReactNode; style?: CSSProperties }) {
  if (u < at - 0.01 || u > to + 0.25) return null;
  const a = ease(Math.min(1, (u - at) / 0.24));
  const o = ease(Math.min(1, Math.max(0, (u - to) / 0.24)));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: a * (1 - o), filter: a < 1 || o > 0 ? `blur(${(1 - a) * 12 + o * 12}px)` : undefined, transform: `scale(${1 + (1 - a) * 0.2})`, ...style }}>
      {children}
    </div>
  );
}
