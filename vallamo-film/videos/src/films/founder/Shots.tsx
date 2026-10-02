import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../brand";
import { mix, settle, tween } from "../meet/motion";
import { Piece, pieceSize, type PieceName } from "../meet/Piece";
import { Float, SHADOW, Sweep, World } from "../cinema/kit";
import { ChannelPill } from "../meta/parts";
import { Block, DiaryView, slotY, WEEK } from "../growth/parts";
import { REPLY, SHOTS as S } from "./timing";

/**
 * Script scenes 2 to 4, no phone: the conversation's own bubbles from the Vallamo inbox float
 * over the real inbox in depth. Ellie asks about lip filler at 9:04pm; Isla types while a timer
 * counts the real wait, and replies with the clinic's price and two free Thursday slots. "2pm
 * please." The real week view rises, the booking flies into Thursday 2pm and the confirmation
 * goes out; the booking stays on screen as Instagram, WhatsApp and Website land above it.
 * Key content stays inside Meta's 9:16 safe area (y 262 to 1250), clear of 1150+ for subtitles.
 */
const W = 1080;
/** The conversation: px per css px of the inbox thread, and where its column sits. */
const K = 2.05;
const PW = pieceSize("f-u1").w * K;
const LEFT = (W - PW) / 2;
const COL_TOP = 372;
/** Each item's top in the thread column (css px): header, her message, Isla's slot (typing, then the reply), "2pm please.", the confirmation. */
const Y = { head: 0, u1: 80, slot: 153, u2: 268, i2: 341 };
/** The diary: Tuesday to Friday, noon to 5pm. */
const KD = 1.45;
const D = { from: 12, to: 17, x0: 208, x1: WEEK.cols.Sat };
const DW = (WEEK.labels + D.x1 - D.x0) * KD;
const DIARY = { left: (W - DW) / 2, top: 575 };
/** Thursday 2pm, where Ellie's booking lands (px on screen). */
const SLOT = (() => {
  const x = WEEK.cols.Thu + 4;
  const y = slotY(14);
  return {
    x: DIARY.left + WEEK.labels * KD + (x - D.x0) * KD,
    y: DIARY.top + (WEEK.head[1] - WEEK.head[0]) * KD + (y - (WEEK.hour0 + (D.from - 9) * WEEK.hour)) * KD,
    w: pieceSize("f-bk").w * KD,
    h: pieceSize("f-bk").h * KD,
  };
})();

type Rect = { x: number; y: number; w: number; h: number };
const bubbleOf = (name: PieceName) => (pieceSize(name) as { bubble?: Rect }).bubble!;

/** The thread scrolls as the story moves on: "2pm please." to the top, then the confirmation, then away. */
function scrollAt(t: number) {
  const a = tween(t, S.diary - 0.1, 0.75);
  const b = tween(t, S.i2 - 0.05, 0.6);
  const c = tween(t, S.channels - 0.15, 0.6);
  return (Y.u2 * a + (Y.i2 - Y.u2) * b + (Y.i2 + pieceSize("f-i2").h + 30 - Y.i2) * c) * K;
}

/**
 * One item of the thread, floating: it arrives from depth on its side (her messages from the
 * left, Isla's from the right), sways, and as the thread scrolls past the top it drifts back
 * and up, out of focus.
 */
function Floater({ t, at, top, side, phase, children, style }: { t: number; at: number; top: number; side: -1 | 1; phase: number; children: ReactNode; style?: CSSProperties }) {
  const a = settle(t, at, 11);
  if (a <= 0.001) return null;
  // Fades out as it passes above the column's top.
  const f = Math.min(1, Math.max(0, (top - (COL_TOP - 200)) / 200));
  if (f <= 0.001) return null;
  const blur = (1 - a) * 12 + (1 - f) * 14;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        opacity: Math.min(1, a * 2) * f,
        transform: `translate3d(${(1 - a) * side * 140}px, ${(1 - a) * 90 - (1 - f) * 40}px, ${(1 - a) * -420 - (1 - f) * 260}px) rotateY(${(1 - a) * side * -16}deg)`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      <Float t={t + phase} sway={0.22}>
        {children}
      </Float>
    </div>
  );
}

/** A message from the thread, with its bubble's own soft shadow. */
function Message({ name }: { name: PieceName }) {
  const b = bubbleOf(name);
  const user = name.startsWith("f-u");
  return (
    <div style={{ position: "relative", width: PW }}>
      <div
        style={{
          position: "absolute",
          left: b.x * K,
          top: b.y * K,
          width: b.w * K,
          height: b.h * K,
          borderRadius: 16 * K,
          [user ? "borderBottomLeftRadius" : "borderBottomRightRadius"]: 6 * K,
          boxShadow: "0 2px 4px rgb(44 37 32 / .05), 0 18px 36px -14px rgb(44 37 32 / .24), 0 50px 90px -36px rgb(44 37 32 / .28)",
        }}
      />
      <Piece name={name} w={PW} style={{ position: "relative" }} />
    </div>
  );
}

/** Isla typing: her empty bubble with the three dots rising in turn. */
function Typing({ t }: { t: number }) {
  const b = bubbleOf("f-dots");
  return (
    <div style={{ position: "relative" }}>
      <Message name="f-dots" />
      {[0, 1, 2].map((i) => {
        const w = Math.max(0, Math.sin((t - S.dots) * 7.5 - i * 0.8));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (b.x + b.w / 2 + (i - 1) * 12) * K - 3.4 * K,
              top: (b.y + b.h / 2) * K - 3.4 * K - w * 3.5 * K,
              width: 6.8 * K,
              height: 6.8 * K,
              borderRadius: "50%",
              background: "rgb(160, 150, 139)",
              opacity: 0.45 + 0.55 * w,
            }}
          />
        );
      })}
    </div>
  );
}

/** 9:04pm · Clinic closed: the hour the enquiry comes in, at the top through all three scenes. */
function TimeChip({ t }: { t: number }) {
  const u = settle(t, S.chip - 0.3, 12);
  const next = tween(t, S.u2, 0.3);
  const digit = (s: string, v: number) => (
    <span style={{ position: "absolute", left: 0, top: 0, opacity: v, transform: `translateY(${(1 - v) * 18}px)` }}>{s}</span>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 268,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(1, u * 2),
        transform: `translateY(${(1 - u) * -24}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, height: 70, padding: "0 34px 0 24px", borderRadius: 999, background: C.paper, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.card, fontFamily: FONT.sans, fontSize: 32, letterSpacing: "-0.01em", color: C.ink, whiteSpace: "nowrap" }}>
        <svg width={36} height={36} viewBox="0 0 24 24">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill={C.clay} />
        </svg>
        <span style={{ position: "relative", fontWeight: 700, fontVariantNumeric: "tabular-nums", width: 112, height: 40 }}>
          {digit("9:04pm", 1 - next)}
          {digit("9:05pm", next)}
        </span>
        <span style={{ color: C.ink4 }}>·</span>
        <span style={{ fontWeight: 500, color: C.ink2 }}>Clinic closed</span>
      </div>
    </div>
  );
}

/** The real wait, counted while Isla types, then "Replied in 6 seconds". */
function Timer({ t, top }: { t: number; top: number }) {
  const u = settle(t, S.dots, 12);
  const o = tween(t, S.timerOut, 0.3);
  if (u <= 0.001 || o >= 1) return null;
  const done = t >= S.i1;
  const pop = done ? settle(t, S.i1, 14) : 1;
  const n = Math.min(REPLY - 1, Math.max(0, Math.floor(t - S.sent)));
  return (
    <div
      style={{
        position: "absolute",
        right: LEFT,
        top,
        display: "flex",
        alignItems: "center",
        gap: 14,
        height: 66,
        padding: "0 30px 0 16px",
        borderRadius: 999,
        background: done ? C.clayWash : C.paper,
        border: `1.5px solid ${done ? C.clay : C.line}`,
        boxShadow: SHADOW.card,
        fontFamily: FONT.sans,
        fontWeight: 600,
        fontSize: 31,
        letterSpacing: "-0.01em",
        color: done ? C.clayInk : C.ink2,
        whiteSpace: "nowrap",
        opacity: Math.min(1, u * 2) * (1 - o),
        transform: `translateY(${(1 - u) * 20 - o * 20}px) scale(${0.92 + 0.08 * pop})`,
        transformOrigin: "100% 50%",
        filter: o > 0 ? `blur(${o * 8}px)` : undefined,
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: done ? C.clay : C.clayWash, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {done ? (
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        ) : (
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth={2.4} strokeLinecap="round">
            <circle cx="12" cy="13.5" r="7.5" />
            <path d="M12 13.5V9.5M9.5 2.5h5" />
            <path d={`M12 13.5 L${12 + 5.5 * Math.sin((t - S.sent) * Math.PI * 2)} ${13.5 - 5.5 * Math.cos((t - S.sent) * Math.PI * 2)}`} />
          </svg>
        )}
      </div>
      {done ? (
        <span>
          Replied in <b style={{ fontWeight: 700 }}>{REPLY} seconds</b>
        </span>
      ) : (
        <span style={{ fontVariantNumeric: "tabular-nums", color: C.ink }}>{n}s</span>
      )}
    </div>
  );
}

export function Shots({ t }: { t: number }) {
  const scroll = scrollAt(t);
  const at = (y: number) => COL_TOP + y * K - scroll;
  // Isla's slot grows from the typing bubble to her reply.
  const grow = tween(t, S.i1, 0.32);
  const slotH = mix(pieceSize("f-dots").h, pieceSize("f-i1").h, grow);

  // The diary rises from below as the thread scrolls up.
  const enter = settle(t, S.diary, 9);
  // The booking: the upcoming card pops out under "2pm please.", flies along an arc and lands in Thursday 2pm.
  const KC = 2.2;
  const cw = pieceSize("f-upcoming").w * KC;
  const ch = pieceSize("f-upcoming").h * KC;
  const start = { x: (W - cw) / 2 + 60, y: at(Y.u2) + pieceSize("f-u2").h * K + 26 };
  const fl = tween(t, S.lift + 0.25, S.land - S.lift - 0.25);
  const arc = (u: number) => ({ x: mix(start.x, SLOT.x, u), y: mix(start.y, SLOT.y, u) - Math.sin(u * Math.PI) * 120 });
  const pos = arc(fl);
  const size = mix(cw, SLOT.w, fl);
  const pop = settle(t, S.lift, 13);
  const landed = tween(t, S.land - 0.08, 0.2);
  const pulse = t > S.land ? Math.exp(-(t - S.land) * 2.2) : 0;
  // It stays lit as the evidence through scene 4.
  const hold = t > S.land ? 0.3 + 0.12 * Math.sin((t - S.land) * 2.4) : 0;

  return (
    <AbsoluteFill style={{ background: "#FBF8F2" }}>
      <World kind="inbox" t={t} blur={16} wash={0.82} zoom={1.24 + 0.004 * t} spin={-12} tilt={54} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        {/* The thread. */}
        <Floater t={t} at={S.head} top={at(Y.head)} side={-1} phase={0.4}>
          <div style={{ marginLeft: LEFT - 6 * K, width: "fit-content", borderRadius: 999, background: C.paper, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.card, padding: `${2 * K}px ${4 * K}px ${2 * K}px 0` }}>
            <Piece name="f-head" w={pieceSize("f-head").w * K} />
          </div>
        </Floater>
        <Floater t={t} at={S.u1} top={at(Y.u1)} side={-1} phase={1.3} style={{ left: LEFT }}>
          <Message name="f-u1" />
        </Floater>
        {t < S.i1 + 0.2 && (
          <Floater t={t} at={S.dots} top={at(Y.slot)} side={1} phase={2.1} style={{ left: LEFT }}>
            <div style={{ opacity: 1 - tween(t, S.i1 - 0.05, 0.15) }}>
              <Typing t={t} />
            </div>
          </Floater>
        )}
        <Floater t={t} at={S.i1} top={at(Y.slot)} side={1} phase={2.1} style={{ left: LEFT }}>
          <Message name="f-i1" />
        </Floater>
        <Timer t={t} top={at(Y.slot) + (slotH + 10) * K} />
        <Floater t={t} at={S.u2} top={at(Y.u2)} side={-1} phase={0.9} style={{ left: LEFT }}>
          <Message name="f-u2" />
        </Floater>
        <Floater t={t} at={S.i2} top={at(Y.i2)} side={1} phase={1.7} style={{ left: LEFT }}>
          <Message name="f-i2" />
        </Floater>

        {/* The real week view, with Ellie's booking landing in Thursday 2pm. */}
        {t >= S.diary - 0.05 && (
          <div
            style={{
              position: "absolute",
              left: DIARY.left,
              top: DIARY.top,
              opacity: Math.min(1, enter * 1.6),
              transform: `translate3d(0, ${(1 - enter) * 320}px, ${(1 - enter) * -900}px) rotateX(${mix(34, 3, enter)}deg)`,
              transformOrigin: "50% 100%",
              filter: enter < 0.97 ? `blur(${(1 - enter) * 14}px)` : undefined,
            }}
          >
            <Float t={t + 0.6} sway={0.18}>
              <DiaryView k={KD} from={D.from} to={D.to} x0={D.x0} x1={D.x1} piece="week" style={{ boxShadow: SHADOW.lift }}>
                {t > S.land - 0.1 && <Block name="f-bk" x={WEEK.cols.Thu} y={slotY(14)} k={KD} u={landed} glow={Math.max(hold, pulse)} />}
              </DiaryView>
            </Float>
          </div>
        )}
        {/* Drop rings where it lands. */}
        {[0.05, 0.35].map((dd) => {
          const u = Math.min(1, Math.max(0, (t - S.land - dd) / 0.8));
          if (u <= 0 || u >= 1) return null;
          const e = 1 - Math.pow(1 - u, 3);
          return <div key={dd} style={{ position: "absolute", left: SLOT.x - e * 40, top: SLOT.y - e * 30, width: SLOT.w + e * 80, height: SLOT.h + e * 60, borderRadius: 14 + e * 20, border: `${3 - 2 * u}px solid ${C.clay}`, opacity: 0.7 * (1 - u) }} />;
        })}
        {/* The flight, along a dotted clay line. */}
        {t > S.lift && t < S.land + 0.9 && (
          <svg width={W} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - tween(t, S.land + 0.2, 0.6) }}>
            {(() => {
              const drawn = tween(t, S.lift + 0.2, S.land - S.lift - 0.25);
              const n = Math.max(2, Math.round(40 * drawn));
              const pts = Array.from({ length: n + 1 }, (_, i) => {
                const u = (i / n) * drawn;
                const p = arc(u);
                return `${i ? "L" : "M"} ${p.x + mix(cw, SLOT.w, u) / 2} ${p.y + mix(ch, SLOT.h, u) / 2}`;
              });
              return drawn > 0 ? <path d={pts.join(" ")} fill="none" stroke={C.clay} strokeWidth={6} strokeLinecap="round" strokeDasharray="1 18" /> : null;
            })()}
          </svg>
        )}
        {t > S.lift && landed < 1 && (
          <div style={{ position: "absolute", left: pos.x, top: pos.y, width: size, opacity: Math.min(1, pop * 2) * (1 - landed), transform: `scale(${0.7 + 0.3 * pop}) rotate(${Math.sin(fl * Math.PI) * -4}deg)`, transformOrigin: "50% 0%" }}>
            <div style={{ borderRadius: 12 * (size / pieceSize("f-upcoming").w), background: C.paper, boxShadow: SHADOW.lift, outline: `${Math.max(2, 3 * (size / cw))}px solid rgba(164,127,84,.9)` }}>
              <Piece name="f-upcoming" w={size} />
            </div>
          </div>
        )}

        {/* Scene 4: the channels it answers on, above the booking. */}
        {t >= S.channels - 0.05 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: COL_TOP + 8, display: "flex", justifyContent: "center", gap: 18 }}>
            {(
              [
                ["m-ch-ig", "Instagram"],
                ["m-ch-wa", "WhatsApp"],
                ["m-ch-web", "Website"],
              ] as const
            ).map(([card, label], i) => {
              const u = settle(t, S.channels + 0.1 + i * 0.32, 12);
              return (
                <div key={card} style={{ opacity: Math.min(1, u * 2), filter: u < 0.97 ? `blur(${(1 - u) * 10}px)` : undefined, transform: `translate3d(0, ${(1 - u) * 70}px, ${(1 - u) * -300}px)` }}>
                  <Float t={t + i * 0.9} sway={0.2}>
                    <ChannelPill card={card} label={label} scale={0.64} style={{ boxShadow: SHADOW.card }} />
                  </Float>
                </div>
              );
            })}
          </div>
        )}
      </AbsoluteFill>
      <TimeChip t={t} />
      <Sweep t={t} at={S.land + 0.15} len={0.9} strength={0.3} />
    </AbsoluteFill>
  );
}

/** Restrained sound: a click per message, the diary arriving, one landing. */
export const SHOT_SFX: { at: number; file: string; volume: number }[] = [
  { at: S.u1, file: "click", volume: 0.16 },
  { at: S.i1, file: "click", volume: 0.18 },
  { at: S.u2, file: "click", volume: 0.16 },
  { at: S.diary, file: "whoosh", volume: 0.13 },
  { at: S.lift, file: "whoosh", volume: 0.09 },
  { at: S.land, file: "thud", volume: 0.2 },
  { at: S.land + 0.02, file: "chime", volume: 0.18 },
  { at: S.i2, file: "click", volume: 0.16 },
  { at: S.channels, file: "whoosh", volume: 0.1 },
  ...[0, 1, 2].map((i) => ({ at: S.channels + 0.1 + i * 0.32, file: "click", volume: 0.13 })),
];
