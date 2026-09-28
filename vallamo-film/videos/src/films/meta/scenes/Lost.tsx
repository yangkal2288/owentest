import { AbsoluteFill } from "remotion";

import { C, FONT, SH } from "../../../brand";
import { blurIn, settle, tween } from "../../meet/motion";
import { eyebrow, giant, accent } from "../../meet/parts";
import { pick, useF } from "../format";
import { Block } from "../parts";
import { CUT } from "../timeline";

/**
 * 0–8.2 s · "Have you lost a customer to a competitor?" then "The average customer
 * waits ten minutes for a reply before trying a competitor."
 * The question is whole on the first frame (brief: the question on frame one), and
 * "lost" takes the clay block. An enquiry lands under it: this is about a booking
 * enquiry. Then the ten minutes: a big counter runs to 10 while the enquiry waits,
 * its bar fills, and the customer writes back that she has booked somewhere else.
 * The "before" is drawn in the film's own type, not as Vallamo: Vallamo is the answer.
 */
const T2 = CUT.tenMin; // 2.79
// The ten minutes tick by, slowing as they run out (the last few hang).
const TICKS = Array.from({ length: 10 }, (_, i) => 3.05 + 2.35 * (1 - Math.pow(1 - (i + 1) / 10, 1.7)));
export const LOST_TICKS = TICKS;
const LOST_AT = 6.55; // "…before trying a competitor": the reply that loses the booking
const OUT = 7.8;

function Card({ t, s }: { t: number; s: number }) {
  const n = TICKS.filter((x) => t >= x).length;
  const lost = tween(t, LOST_AT, 0.34);
  const verdict = t >= LOST_AT + 0.3;
  const bar = n / 10;
  return (
    <div style={{ width: 936, background: C.paper, border: `1.5px solid ${C.line}`, borderRadius: 40 * s, padding: 40 * s, boxSizing: "border-box", boxShadow: SH.float, fontFamily: FONT.sans }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 * s }}>
        <div style={{ width: 84 * s, height: 84 * s, borderRadius: "50%", background: C.canvas, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 30 * s, color: C.ink2 }}>EC</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 38 * s, color: C.ink, letterSpacing: "-0.02em" }}>Emma Clarke</div>
          <div style={{ fontWeight: 500, fontSize: 28 * s, color: C.clay, marginTop: 2 }}>New booking enquiry</div>
        </div>
        <div style={{ fontSize: 28 * s, color: C.ink3 }}>9:02am</div>
      </div>
      <div style={{ marginTop: 28 * s, background: "#F4EEE4", borderRadius: 30 * s, borderBottomLeftRadius: 10 * s, padding: `${24 * s}px ${32 * s}px`, fontSize: 40 * s, lineHeight: 1.3, color: C.ink, letterSpacing: "-0.01em" }}>
        Hi, do you have any consultation appointments this week?
      </div>
      {/* Ten minutes later. */}
      <div style={{ height: lost * 124 * s, overflow: "hidden" }}>
        <div
          style={{
            marginTop: 20 * s,
            display: "inline-block",
            background: "#F4EEE4",
            borderRadius: 30 * s,
            borderBottomLeftRadius: 10 * s,
            padding: `${24 * s}px ${32 * s}px`,
            fontSize: 40 * s,
            lineHeight: 1.3,
            color: C.ink,
            letterSpacing: "-0.01em",
            opacity: lost,
            transform: `translateY(${(1 - lost) * 30}px)`,
          }}
        >
          Never mind, I’ve booked somewhere else.
        </div>
      </div>
      <div style={{ marginTop: 30 * s, display: "flex", alignItems: "center", gap: 14 * s, fontSize: 30 * s, fontWeight: verdict ? 700 : 500, color: verdict ? C.clayInk : C.ink3 }}>
        <div style={{ width: 14 * s, height: 14 * s, borderRadius: "50%", background: verdict ? C.clayInk : t >= T2 ? C.clay : C.ink4 }} />
        {verdict ? "Lost to a competitor" : t < TICKS[0] ? "Waiting for a reply" : `No reply · ${n} min`}
      </div>
      <div style={{ marginTop: 20 * s, height: 12 * s, borderRadius: 6 * s, background: C.lineSoft, overflow: "hidden" }}>
        <div style={{ height: "100%", background: verdict ? C.clayInk : C.clay, transform: `scaleX(${bar})`, transformOrigin: "0 50%" }} />
      </div>
    </div>
  );
}

export function Lost({ t }: { t: number }) {
  const F = useF();
  const s = F.type;
  const X = 72;
  // Phase 1: the question.
  const qOut = tween(t, T2 - 0.05, 0.35);
  const block = tween(t, 0.1, 0.32);
  const pop = 1 + 0.05 * (1 - settle(t, 0, 14));
  // The enquiry lands, then rises into place for the ten minutes.
  const land = settle(t, 0.42, 13);
  const rise = settle(t, T2 - 0.1, 10);
  const y1 = pick(F, 880, 540);
  const y2 = pick(F, 772, 488);
  const cardY = y1 + (y2 - y1) * rise + (1 - land) * 260;
  // Out: everything falls back into depth and blurs as Vallamo arrives.
  const out = tween(t, OUT, 0.42);
  // The counter.
  const n = TICKS.filter((x) => t >= x).length;
  const since = n > 0 ? t - TICKS[n - 1] : 1;
  const roll = tween(since, 0, 0.14);
  const ten = n === 10 ? 1 + 0.12 * (1 - settle(t, TICKS[9], 12)) : 1;
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden", perspective: 1800 }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.035 * tween(t, 0, 8)})`, transformOrigin: "50% 40%" }}>
        {/* The question, whole on frame one. */}
        {qOut < 1 && (
          <div style={{ position: "absolute", left: X, top: F.top, opacity: 1 - qOut, filter: qOut > 0 ? `blur(${qOut * 16}px)` : undefined, transform: `translateY(${-qOut * 60}px) scale(${pop})`, transformOrigin: "0 0" }}>
            <div style={{ ...eyebrow, fontSize: 30 * s, letterSpacing: "0.3em" }}>Clinic owners</div>
            <div style={{ ...giant(118 * s), lineHeight: 1.06, marginTop: 30 * s, whiteSpace: "nowrap" }}>
              <div>
                Have you <Block u={block}>lost</Block>
              </div>
              <div>a customer to</div>
              <div>
                a <span style={{ ...accent(132 * s), lineHeight: 1 }}>competitor?</span>
              </div>
            </div>
          </div>
        )}

        {/* Ten minutes. */}
        {t >= T2 - 0.1 && (
          <div style={{ position: "absolute", left: X, top: F.top, opacity: 1 - out, filter: out > 0 ? `blur(${out * 14}px)` : undefined, transform: `translateY(${-out * 50}px)` }}>
            <div style={{ ...giant(54 * s), color: C.ink2, fontWeight: 600, letterSpacing: "-0.025em", ...blurIn(t, T2 + 0.12, null, 14) }}>The average customer waits</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 26 * s, marginTop: 4 * s, ...blurIn(t, T2 + 0.22, null, 20) }}>
              <div
                style={{
                  ...giant(300 * s),
                  color: C.clay,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.06em",
                  lineHeight: 0.86,
                  transform: `translateY(${(1 - roll) * -40}px) scale(${ten})`,
                  transformOrigin: "30% 80%",
                  filter: roll < 1 ? `blur(${(1 - roll) * 6}px)` : undefined,
                  opacity: 0.4 + 0.6 * roll,
                }}
              >
                {n}
              </div>
              <div style={{ ...giant(112 * s) }}>{n === 1 ? "minute" : "minutes"}</div>
            </div>
            <div style={{ ...giant(54 * s), fontWeight: 600, color: C.ink2, letterSpacing: "-0.025em", lineHeight: 1.18, marginTop: 22 * s, ...blurIn(t, 5.0, null, 14) }}>
              for a reply before
              <br />
              trying a <span style={{ color: C.clay }}>competitor.</span>
            </div>
          </div>
        )}

        {/* The enquiry. */}
        <div
          style={{
            position: "absolute",
            left: X,
            top: 0,
            opacity: Math.min(1, land * 2) * (1 - out),
            filter: land < 0.97 || out > 0 ? `blur(${(1 - land) * 12 + out * 14}px) saturate(${1 - out})` : undefined,
            transform: `translate3d(0, ${cardY}px, ${-out * 500}px) rotateX(${out * 12}deg) scale(${0.9 + 0.1 * land})`,
            transformOrigin: "50% 0%",
          }}
        >
          <Card t={t} s={s} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
