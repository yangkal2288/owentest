import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { blurIn, mix, settle, tween } from "../../meet/motion";
import { pick, useF } from "../format";
import { Block } from "../parts";
import { Breakable, shake } from "../shatter";
import { Float, SHADOW, World } from "../../cinema/kit";
import { useMetaCut } from "../timeline";
import { display, em, eyebrow, RED } from "../type";

/**
 * 0–8.2 s · "Have you lost a customer to a competitor?" then "The average customer
 * waits ten minutes for a reply before trying a competitor."
 * The question is whole on the first frame, "lost" in the clay block, and a booking
 * enquiry lands under it. Then the ten minutes, made to hurt: the counter runs to 10
 * and the waiting enquiry shakes harder with every minute. At ten it turns red, the
 * customer writes that she has booked somewhere else, and the card cracks and
 * shatters. "Lost to a competitor." is what's left.
 * The "before" is drawn in the film's own type, not as Vallamo: Vallamo is the answer.
 */
const ink = (a: string, b: string, u: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * u)).join(",")})`;
};

function Card({ t, s }: { t: number; s: number }) {
  const { tenMin: T2, ticks: TICKS, reply: REPLY } = useMetaCut().lost;
  const TEN = TICKS[9];
  const n = TICKS.filter((x) => t >= x).length;
  const red = tween(t, TEN, 0.25);
  const reply = tween(t, REPLY, 0.3);
  const lost = t >= REPLY + 0.3;
  const line = ink(C.line, RED, red);
  return (
    <div style={{ position: "relative", width: 936, background: C.paper, border: `${1.5 + 2.5 * red}px solid ${line}`, borderRadius: 40 * s, padding: 40 * s, boxSizing: "border-box", boxShadow: SHADOW.lift, fontFamily: FONT.sans, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: RED, opacity: 0.07 * red }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24 * s }}>
        <div style={{ width: 84 * s, height: 84 * s, borderRadius: "50%", background: C.canvas, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 30 * s, color: C.ink2 }}>EC</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 38 * s, color: C.ink, letterSpacing: "-0.02em" }}>Emma Clarke</div>
          <div style={{ fontWeight: 500, fontSize: 28 * s, color: C.clay, marginTop: 2 }}>New booking enquiry</div>
        </div>
        <div style={{ fontSize: 28 * s, color: C.ink3 }}>9:02am</div>
      </div>
      <div style={{ position: "relative", marginTop: 28 * s, background: "#F4EEE4", borderRadius: 30 * s, borderBottomLeftRadius: 10 * s, padding: `${24 * s}px ${32 * s}px`, fontSize: 40 * s, lineHeight: 1.3, color: C.ink, letterSpacing: "-0.01em" }}>
        Hi, do you have any consultation appointments this week?
      </div>
      <div style={{ position: "relative", height: reply * 124 * s, overflow: "hidden" }}>
        <div style={{ marginTop: 20 * s, display: "inline-block", background: "#F4EEE4", borderRadius: 30 * s, borderBottomLeftRadius: 10 * s, padding: `${24 * s}px ${32 * s}px`, fontSize: 40 * s, lineHeight: 1.3, color: C.ink, letterSpacing: "-0.01em", opacity: reply, transform: `translateY(${(1 - reply) * 30}px)` }}>
          Never mind, I’ve booked somewhere else.
        </div>
      </div>
      <div style={{ position: "relative", marginTop: 30 * s, display: "flex", alignItems: "center", gap: 14 * s, fontSize: 30 * s, fontWeight: red > 0.5 ? 700 : 500, color: red > 0 ? ink(C.ink3, RED, red) : C.ink3 }}>
        <div style={{ width: 14 * s, height: 14 * s, borderRadius: "50%", background: red > 0 ? RED : t >= T2 ? C.clay : C.ink4 }} />
        {lost ? "Lost to a competitor" : t < TICKS[0] ? "Waiting for a reply" : `No reply · ${n} min`}
      </div>
      <div style={{ position: "relative", marginTop: 20 * s, height: 12 * s, borderRadius: 6 * s, background: C.lineSoft, overflow: "hidden" }}>
        <div style={{ height: "100%", background: ink(C.clay, RED, red), transform: `scaleX(${n / 10})`, transformOrigin: "0 50%" }} />
      </div>
    </div>
  );
}

export function Lost({ t }: { t: number }) {
  const F = useF();
  const { tenMin: T2, ticks: TICKS, reply: REPLY, crack: CRACK, shatter: SHATTER, out: OUT } = useMetaCut().lost;
  const TEN = TICKS[9];
  // The 15 s cut has no ten-minute phase: the question stays until the card breaks.
  const hasTen = Number.isFinite(T2);
  const s = F.type;
  const X = 72;
  // Phase 1: the question.
  const qOut = tween(t, hasTen ? T2 - 0.05 : OUT, 0.35);
  const block = tween(t, 0.1, 0.32);
  const pop = 1 + 0.05 * (1 - settle(t, 0, 14));
  // The enquiry lands, then rises into place for the ten minutes.
  const land = settle(t, 0.42, 13);
  const rise = settle(t, T2 - 0.1, 10);
  const y1 = pick(F, 880, 540);
  const y2 = pick(F, 772, 530);
  const cardY = y1 + (y2 - y1) * rise + (1 - land) * 1100;
  const out = tween(t, OUT, 0.42);
  // The counter.
  const n = TICKS.filter((x) => t >= x).length;
  const since = n > 0 ? t - TICKS[n - 1] : 1;
  const roll = tween(since, 0, 0.14);
  const tenPop = n === 10 ? 1 + 0.16 * (1 - settle(t, TEN, 12)) : 1;
  const red = tween(t, TEN, 0.25);
  // The shake: a tremor that grows with every minute, a jolt at ten, violent before it breaks.
  const amp =
    (t > TICKS[0] ? 1.5 + 11 * Math.pow(n / 10, 2) : 0) +
    (t > TEN ? 34 * Math.exp(-(t - TEN) * 6) : 0) +
    (t > REPLY ? 10 * Math.exp(-(t - REPLY) * 5) : 0) +
    (t > CRACK - 0.15 && t < SHATTER ? 22 : 0);
  const sh = shake(t, t < SHATTER ? amp : 0);
  const lostText = tween(t, SHATTER + 0.22, 0.3);
  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 1800 }}>
      {/* The inbox in depth: all the enquiries still waiting. */}
      <World kind="inbox" t={t} blur={7 + 14 * tween(t, SHATTER, 0.4)} wash={0.58 + 0.2 * tween(t, SHATTER, 0.4)} zoom={1.04 + 0.02 * t} />
      {/* A red flash through the frame when it breaks. */}
      <AbsoluteFill style={{ background: RED, opacity: 0.1 * (tween(t, SHATTER, 0.04) - tween(t, SHATTER + 0.06, 0.4)) }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.035 * tween(t, 0, 8)})`, transformOrigin: "50% 40%" }}>
        {qOut < 1 && (
          <div style={{ position: "absolute", left: X, top: F.top, opacity: 1 - qOut, filter: qOut > 0 ? `blur(${qOut * 16}px)` : undefined, transform: `translateY(${-qOut * 60}px) scale(${pop})`, transformOrigin: "0 0" }}>
            <div style={eyebrow(28 * s)}>Clinic owners</div>
            <div style={{ ...display(128 * s), lineHeight: 1.02, marginTop: 30 * s, whiteSpace: "nowrap" }}>
              <div>
                Have you <Block u={block}>lost</Block>
              </div>
              <div>a customer to</div>
              <div>
                a <span style={em(136 * s)}>competitor?</span>
              </div>
            </div>
          </div>
        )}

        {t >= T2 - 0.1 && (
          <div style={{ position: "absolute", left: X, top: F.top, opacity: 1 - out, filter: out > 0 ? `blur(${out * 14}px)` : undefined, transform: `translateY(${-out * 50}px)` }}>
            <div style={{ ...display(58 * s), color: C.ink2, ...blurIn(t, T2 + 0.12, null, 14) }}>The average customer waits</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 26 * s, marginTop: -6 * s, ...blurIn(t, T2 + 0.22, null, 20) }}>
              <div
                style={{
                  ...display(310 * s),
                  color: ink(C.clayDeep, RED, red),
                  fontVariantNumeric: "lining-nums tabular-nums",
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                  transform: `translate(${sh.x * 0.4}px, ${(1 - roll) * -40}px) scale(${tenPop})`,
                  transformOrigin: "30% 80%",
                  filter: roll < 1 ? `blur(${(1 - roll) * 6}px)` : undefined,
                  opacity: 0.4 + 0.6 * roll,
                }}
              >
                {Math.max(1, n)}
              </div>
              <div style={display(124 * s)}>{n <= 1 ? "minute" : "minutes"}</div>
            </div>
            <div style={{ ...display(58 * s), color: C.ink2, lineHeight: 1.15, marginTop: 8 * s, ...blurIn(t, 5.0, null, 14) }}>
              for a reply before
              <br />
              trying a <span style={em(62 * s)}>competitor.</span>
            </div>
          </div>
        )}

        {/* The enquiry: whole, then in pieces. */}
        <div
          style={{
            position: "absolute",
            left: X,
            top: 0,
            opacity: Math.min(1, land * 2),
            filter: land < 0.97 ? `blur(${(1 - land) * 12}px)` : undefined,
            // Swings up from below the frame, tipped back, and settles facing camera.
            transform: `translate3d(${sh.x}px, ${cardY + sh.y}px, ${(1 - land) * 300}px) rotateX(${(1 - land) * -36}deg) rotate(${sh.r}deg)`,
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
          }}
        >
          <Float t={t} sway={t < SHATTER ? 0.6 : 0}>
            <Breakable t={t} crackAt={CRACK} shatterAt={SHATTER} radius={40 * s}>
              <Card t={t} s={s} />
            </Breakable>
          </Float>
        </div>

        {/* What's left. */}
        {t > SHATTER && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: (hasTen ? y2 : y1) + pick(F, 150, 120),
              textAlign: "center",
              ...em(96 * s),
              color: RED,
              opacity: lostText * (1 - out),
              filter: lostText < 1 || out > 0 ? `blur(${(1 - lostText) * 12 + out * 14}px)` : undefined,
              transform: `scale(${mix(1.25, 1, lostText)}) translateY(${-out * 40}px)`,
            }}
          >
            Lost to a competitor.
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
