import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";

import { C, FONT, SH } from "../../brand";
import { tween } from "../meet/motion";
import { Piece, pieceSize, type PieceName } from "../meet/Piece";

/** One message in the widget: shown from `at`; `out` collapses it (the typing dots). */
export type Msg = { name: PieceName; at: number; out?: number };

const W = 348; // the widget's inner width (css px of the real widget)
const GAP = 10;
const PAD = 16;

/**
 * The real website chat widget (Channels › Website chat › "What customers see"),
 * built from its captured parts: header, notice, the staged messages, input bar.
 * Sized in the widget's own css px; the caller scales it. Messages flow from the
 * top like a new chat and scroll once they fill the body.
 */
export function Widget({ t, msgs, body = 250, style }: { t: number; msgs: Msg[]; body?: number; style?: CSSProperties }) {
  let y = PAD;
  const laid = msgs.map((m) => {
    const h = pieceSize(m.name).h;
    const u = tween(t, m.at, 0.3) * (m.out === undefined ? 1 : 1 - tween(t, m.out, 0.16));
    const top = y;
    y += u * (h + GAP);
    return { m, u, top, user: m.name.startsWith("m-u") };
  });
  const scroll = Math.max(0, y - body + 4);
  return (
    <div
      style={{
        width: W + 2,
        background: "rgb(255, 253, 248)",
        border: "1px solid rgb(232, 224, 210)",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 24px 64px -24px rgb(44 37 32 / .35)",
        ...style,
      }}
    >
      <Piece name="m-head" w={W} />
      <Piece name="m-sub" w={W} />
      <div style={{ position: "relative", height: body, overflow: "hidden" }}>
        {laid.map(({ m, u, top, user }) =>
          u > 0.001 ? (
            <div
              key={m.name}
              style={{
                position: "absolute",
                left: PAD,
                top: 0,
                opacity: Math.min(1, u * 1.6),
                transform: `translate3d(0, ${top - scroll + (1 - u) * 16}px, 0) scale(${0.94 + 0.06 * u})`,
                transformOrigin: user ? "100% 100%" : "0% 100%",
                filter: u < 1 ? `blur(${(1 - u) * 4}px)` : undefined,
              }}
            >
              <Piece name={m.name} w={W - PAD * 2} />
            </div>
          ) : null,
        )}
      </div>
      <Piece name="m-input" w={W} />
    </div>
  );
}
export const widgetHeight = (body = 250) => 1 + pieceSize("m-head").h + pieceSize("m-sub").h + body + pieceSize("m-input").h + 1;
export const WIDGET_W = W + 2;

/** A channel's own icon, cut from its real Channels card (the 44 px tile at 20,20). */
export function ChannelIcon({ card, size }: { card: PieceName; size: number }) {
  const k = size / 44;
  return (
    <div style={{ width: size, height: size, overflow: "hidden", borderRadius: 12 * k, flex: "none" }}>
      <Img src={staticFile(`ui/pieces/png/${card}.png`)} style={{ display: "block", width: pieceSize(card).w * k, marginLeft: -20 * k, marginTop: -20 * k }} />
    </div>
  );
}

/** A channel label: the channel's icon and name on a paper pill. */
export function ChannelPill({ card, label, scale = 1, style }: { card: PieceName; label: string; scale?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 22 * scale,
        height: 108 * scale,
        padding: `0 ${40 * scale}px 0 ${22 * scale}px`,
        borderRadius: 54 * scale,
        background: C.paper,
        border: `1.5px solid ${C.line}`,
        boxShadow: SH.pop,
        fontFamily: FONT.sans,
        fontWeight: 700,
        fontSize: 44 * scale,
        letterSpacing: "-0.02em",
        color: C.ink,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <ChannelIcon card={card} size={64 * scale} />
      {label}
    </div>
  );
}

/** The clay block behind an emphasised word, text turning white as it passes. */
export function Block({ u, children, pad = 0.12, style }: { u: number; children: ReactNode; pad?: number; style?: CSSProperties }) {
  const c = [0x2c, 0x25, 0x20].map((v) => Math.round(v + (255 - v) * u));
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span
        style={{
          position: "absolute",
          left: `-${pad}em`,
          right: `-${pad}em`,
          top: "0.06em",
          bottom: "-0.04em",
          background: C.clay,
          borderRadius: "0.1em",
          transform: `scaleX(${u})`,
          transformOrigin: "0 50%",
        }}
      />
      <span style={{ position: "relative", color: `rgb(${c[0]}, ${c[1]}, ${c[2]})` }}>{children}</span>
    </span>
  );
}
