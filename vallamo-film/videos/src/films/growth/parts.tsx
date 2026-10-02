import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";

import { C, FONT } from "../../brand";
import { ease, settle, tween } from "../meet/motion";
import { Piece, pieceSize, type PieceName } from "../meet/Piece";
import { SHADOW } from "../cinema/kit";
import { ChannelIcon } from "../meta/parts";

/**
 * A masked type reveal: the line rises into view from behind its own baseline (the brief's
 * "masked type reveals"), and leaves the same way, upwards. Nothing blurs while it reads.
 */
export function Reveal({ t, at, out = null, children, style, len = 0.55 }: { t: number; at: number; out?: number | null; children: ReactNode; style?: CSSProperties; len?: number }) {
  const u = tween(t, at, len);
  const v = out === null ? 0 : tween(t, out, 0.35);
  if (u <= 0 || v >= 1) return null;
  const y = (1 - u) * 115 - v * 115;
  return (
    <div style={{ overflow: "hidden", padding: "0.04em 0.2em 0.16em", margin: "-0.04em -0.2em -0.16em", ...style }}>
      <div style={{ transform: `translateY(${y}%) rotate(${(1 - u) * 2.5 - v * 2.5}deg)`, transformOrigin: "0 100%" }}>{children}</div>
    </div>
  );
}

/** A gold hand-drawn underline under an emphasised phrase, drawn left to right. */
export function Swash({ u, width, color = C.clay, thick = 10 }: { u: number; width: number; color?: string; thick?: number }) {
  const len = width * 1.08;
  return (
    <svg width={width} height={thick * 4} viewBox={`0 0 ${width} ${thick * 4}`} style={{ position: "absolute", left: 0, bottom: -thick * 2.4, overflow: "visible" }}>
      <path
        d={`M ${thick} ${thick * 2.6} C ${width * 0.3} ${thick * 1.2}, ${width * 0.65} ${thick * 1.4}, ${width - thick} ${thick * 1.8}`}
        fill="none"
        stroke={color}
        strokeWidth={thick}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - u)}
      />
    </svg>
  );
}

// ---------------------------------------------------------------- the real diary, framed

/** The week view piece's own geometry (css px): header row, hour rows, the day columns. */
export const WEEK = {
  head: [60, 126] as const, // day names and dates
  hour0: 126, // 9am
  hour: 64, // px per hour
  labels: 58, // the hour labels' column
  cols: { Wed: 359, Thu: 510, Fri: 661, Sat: 812, Sun: 962 } as Record<string, number>,
};
export const slotY = (h: number) => WEEK.hour0 + 1 + (h - 9) * WEEK.hour;

/**
 * A window onto the real week view (`piece`: g-wk, or the untouched week), Wednesday to Friday (to `x1`), `from` to `to` o'clock, framed
 * as the app's card: hour labels, day header, the body. `k` is px per css px. Children are drawn
 * in the body's coordinates (css px of the piece, so a block at the piece's x/y lands on its slot).
 */
export function DiaryView({ k, from, to, x0 = WEEK.cols.Wed, x1 = WEEK.cols.Sat, piece = "g-wk", children, style }: { k: number; from: number; to: number; x0?: number; x1?: number; piece?: "g-wk" | "week"; children?: ReactNode; style?: CSSProperties }) {
  const y0 = WEEK.hour0 + (from - 9) * WEEK.hour;
  const y1 = WEEK.hour0 + (to - 9) * WEEK.hour;
  const size = pieceSize(piece);
  const img = (dx: number, dy: number) => <Img src={staticFile(`ui/pieces/png/${piece}.png`)} style={{ position: "absolute", left: -dx * k, top: -dy * k, width: size.w * k, height: size.h * k, maxWidth: "none" }} />;
  const headH = (WEEK.head[1] - WEEK.head[0]) * k;
  const bodyW = (x1 - x0) * k;
  const labW = WEEK.labels * k;
  return (
    <div style={{ position: "relative", width: labW + bodyW, height: headH + (y1 - y0) * k, borderRadius: 18 * k, background: C.paper, overflow: "hidden", boxShadow: SHADOW.lift, border: `1px solid ${C.line}`, ...style }}>
      {/* day header */}
      <div style={{ position: "absolute", left: labW, top: 0, width: bodyW, height: headH, overflow: "hidden" }}>{img(x0, WEEK.head[0])}</div>
      {/* hour labels (each sits on its line, so the column starts a little above the first) */}
      <div style={{ position: "absolute", left: 0, top: headH - 18 * k, width: labW, height: (y1 - y0 + 18) * k, overflow: "hidden" }}>{img(0, y0 - 18)}</div>
      {/* the body */}
      <div style={{ position: "absolute", left: labW, top: headH, width: bodyW, height: (y1 - y0) * k, overflow: "hidden" }}>
        {img(x0, y0)}
        <div style={{ position: "absolute", left: -x0 * k, top: -y0 * k, width: size.w * k, height: size.h * k }}>{children}</div>
      </div>
      <div style={{ position: "absolute", left: labW, right: 0, top: headH - 1, height: 1, background: C.line }} />
    </div>
  );
}
/** Where a piece point (css px) lands inside a DiaryView (px, from the view's top left). */
export const diaryPoint = (k: number, from: number, x: number, y: number) => ({
  x: WEEK.labels * k + (x - WEEK.cols.Wed) * k,
  y: (WEEK.head[1] - WEEK.head[0]) * k + (y - (WEEK.hour0 + (from - 9) * WEEK.hour)) * k,
});

/** A booking block from the week view, placed at its slot (in DiaryView body coordinates). */
export function Block({ name, x, y, k, u = 1, glow = 0 }: { name: PieceName; x: number; y: number; k: number; u?: number; glow?: number }) {
  const s = pieceSize(name);
  if (u <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: (x + 4) * k,
        top: y * k,
        width: s.w * k,
        opacity: Math.min(1, u * 2),
        transform: `translateY(${(1 - u) * -40 * k}px) scale(${1.25 - 0.25 * u})`,
        transformOrigin: "50% 100%",
        borderRadius: 8 * k,
        boxShadow: glow > 0 ? `0 0 0 ${3 * k}px rgba(164,127,84,${0.9 * glow}), 0 0 ${28 * k}px rgba(214,170,100,${0.8 * glow})` : undefined,
      }}
    >
      <Piece name={name} w={s.w * k} />
    </div>
  );
}

// ---------------------------------------------------------------- enquiries on the three live channels

export const CHANNELS = [
  { card: "m-ch-wa", label: "WhatsApp", text: "Hi, do you have anything this Saturday?" },
  { card: "m-ch-ig", label: "Instagram", text: "How much is Profhilo?" },
  { card: "m-ch-web", label: "Website", text: "Is the £120 facial available this week?" },
] as const;

/** An enquiry arriving on one channel: the channel's own icon and name, the customer's message. */
export function EnquiryCard({ card, label, text, w, style }: { card: PieceName; label: string; text: string; w: number; style?: CSSProperties }) {
  const s = w / 820;
  return (
    <div style={{ width: w, boxSizing: "border-box", padding: `${30 * s}px ${34 * s}px`, borderRadius: 34 * s, background: C.paper, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.card, fontFamily: FONT.sans, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 * s }}>
        <ChannelIcon card={card} size={58 * s} />
        <div style={{ fontWeight: 700, fontSize: 36 * s, letterSpacing: "-0.02em", color: C.ink }}>{label}</div>
        <div style={{ marginLeft: "auto", fontWeight: 600, fontSize: 26 * s, color: C.ink3 }}>New enquiry</div>
      </div>
      <div style={{ marginTop: 20 * s, background: "#F4EEE4", borderRadius: 26 * s, borderBottomLeftRadius: 8 * s, padding: `${20 * s}px ${28 * s}px`, fontSize: 38 * s, lineHeight: 1.3, color: C.ink }}>{text}</div>
    </div>
  );
}

// ---------------------------------------------------------------- ENQUIRY → ANSWER → BOOKING

/** The mechanism in three words; each lights as the film reaches it, a gold line drawing between. */
export function Flow({ t, at, lit, size, color = C.ink }: { t: number; at: number; lit: [number, number, number]; size: number; color?: string }) {
  const words = ["ENQUIRY", "ANSWER", "BOOKING"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: size * 0.5, fontFamily: FONT.sans, fontWeight: 700, fontSize: size, letterSpacing: "0.12em" }}>
      {words.map((w, i) => {
        const u = tween(t, at + i * 0.22, 0.4);
        const on = tween(t, lit[i], 0.3);
        const line = tween(t, at + i * 0.22 + 0.2, 0.35);
        return (
          <div key={w} style={{ display: "flex", alignItems: "center", gap: size * 0.5 }}>
            {i > 0 && (
              <svg width={size * 1.6} height={size} viewBox="0 0 64 40" style={{ opacity: u }}>
                <path d="M2 20 H56 M46 10 L58 20 L46 30" fill="none" stroke={C.clay} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - line)} />
              </svg>
            )}
            <div style={{ position: "relative", opacity: Math.min(1, u * 1.6), transform: `translateY(${(1 - u) * size * 0.6}px)`, color: on > 0.5 && i === 2 ? C.clay : color }}>
              {w}
              {i === 2 && on > 0 && <div style={{ position: "absolute", inset: `-${size * 0.35}px -${size * 0.45}px`, borderRadius: 999, border: `${size * 0.07}px solid ${C.clay}`, opacity: on, transform: `scale(${1.2 - 0.2 * ease(on)})` }} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- time of day

/** "2:40pm · with a client": when the booking was made, with the sun or the moon. */
export function TimeChip({ t, at, time, what, night, size }: { t: number; at: number; time: string; what: string; night: boolean; size: number }) {
  const u = settle(t, at, 12);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.45,
        height: size * 2.1,
        padding: `0 ${size * 0.9}px 0 ${size * 0.6}px`,
        borderRadius: 999,
        background: night ? "rgba(255,253,249,.12)" : C.paper,
        border: `1.5px solid ${night ? "rgba(255,253,249,.28)" : C.line}`,
        boxShadow: night ? "none" : SHADOW.card,
        fontFamily: FONT.sans,
        fontWeight: 650,
        fontSize: size,
        letterSpacing: "-0.01em",
        color: night ? "#F6EBDD" : C.ink,
        opacity: Math.min(1, u * 2),
        transform: `translateY(${(1 - u) * 30}px) scale(${0.9 + 0.1 * u})`,
        whiteSpace: "nowrap",
      }}
    >
      <svg width={size * 1.2} height={size * 1.2} viewBox="0 0 24 24" fill="none" stroke={night ? "#E9C98F" : C.clay} strokeWidth={2.2} strokeLinecap="round">
        {night ? <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="#E9C98F" /> : <><circle cx="12" cy="12" r="4.5" fill={C.clay} />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d="M12 2.5v2.5" transform={`rotate(${a} 12 12)`} />)}</>}
      </svg>
      <span>{time}</span>
      <span style={{ opacity: 0.5 }}>·</span>
      <span style={{ fontWeight: 500 }}>{what}</span>
    </div>
  );
}
