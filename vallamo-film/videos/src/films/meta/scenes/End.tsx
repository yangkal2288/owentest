import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { blurIn, settle, tween } from "../../meet/motion";
import { accent, giant, Logo } from "../../meet/parts";
import { pick, useF } from "../format";
import { type Msg, Widget, WIDGET_W } from "../parts";
import { BEAT, DOWNBEAT } from "../timeline";
import { RESULT_CENTRE, WIPE } from "./Product";

/**
 * 21.3–30 s · "Stop losing business to competitors. See Vallamo on your website in
 * ten minutes. Vallamo dot com."
 * A clay circle opens from the booking onto white. The headline slams in, the offer
 * follows, then the action (Get your free website demo) and vallamo.com, all inside
 * Meta's safe area. The real widget rises at the foot: this is what goes on your
 * website. The CTA breathes on the beat through the hold.
 */
const HEAD = WIPE + 0.3;
const OFFER = DOWNBEAT(9); // 24.34
const CTA = DOWNBEAT(9) + 2 * BEAT; // 25.69
const URL = DOWNBEAT(10); // 27.03
const PEEK: Msg[] = [
  { name: "m-u1", at: 0 },
  { name: "m-i1", at: 0 },
];
const LINES: [string, boolean][] = [
  ["Stop losing", false],
  ["business to", false],
  ["competitors.", true],
];

export function End({ t }: { t: number }) {
  const F = useF();
  const s = F.type;
  const o = RESULT_CENTRE(F);
  const clay = tween(t, WIPE, 0.42);
  const white = tween(t, WIPE + 0.18, 0.42);
  const cta = settle(t, CTA, 13);
  const beat = t > URL ? Math.exp(-(((t - URL) % BEAT) / BEAT) * 5) : 0;
  const peek = settle(t, OFFER + 0.1, 8);
  const k = F.ui * 0.9;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.clay, clipPath: `circle(${clay * 2400}px at ${o.x}px ${o.y}px)` }} />
      <AbsoluteFill style={{ background: "#FFFFFF", clipPath: `circle(${white * 2400}px at ${o.x}px ${o.y}px)`, overflow: "hidden" }}>
        {/* The real widget, as it sits on a clinic's website. */}
        <div
          style={{
            position: "absolute",
            left: (F.W - WIDGET_W * k) / 2,
            top: pick(F, 1340, 1010),
            transform: `translate3d(0, ${(1 - peek) * 700}px, 0) rotate(-2deg)`,
            opacity: Math.min(1, peek * 2),
          }}
        >
          <Widget t={t} msgs={PEEK} body={250} style={{ transform: `scale(${k})`, transformOrigin: "0 0" }} />
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 292, 88), textAlign: "center" }}>
          {LINES.map(([w, a], i) => {
            const u = tween(t, HEAD + i * 0.12, 0.24);
            return (
              <div
                key={w}
                style={{
                  ...(a ? accent(140 * s) : giant(124 * s)),
                  lineHeight: a ? 1.02 : 1.0,
                  opacity: u,
                  filter: u < 1 ? `blur(${(1 - u) * 14}px)` : undefined,
                  transform: `scale(${1 + (1 - u) * 0.3})`,
                }}
              >
                {w}
              </div>
            );
          })}
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 736, 452), textAlign: "center", ...giant(56 * s), fontWeight: 600, color: C.ink2, lineHeight: 1.2, ...blurIn(t, OFFER, null, 16) }}>
          See Vallamo on your website
          <br />
          in <span style={{ ...accent(66 * s) }}>ten minutes.</span>
        </div>

        {/* The action. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 918, 616), display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", opacity: Math.min(1, cta * 2), filter: cta < 0.97 ? `blur(${(1 - cta) * 10}px)` : undefined, transform: `scale(${(0.8 + 0.2 * cta) * (1 + 0.025 * beat)})` }}>
            {[0, 0.4].map((d) => {
              const u = Math.min(1, Math.max(0, (t - CTA - 0.15 - d) / 0.9));
              if (u <= 0 || u >= 1) return null;
              const g = 1 - Math.pow(1 - u, 3);
              return <div key={d} style={{ position: "absolute", inset: -g * 34, borderRadius: 999, border: `${4 - 2 * u}px solid ${C.clay}`, opacity: 0.6 * (1 - u) }} />;
            })}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26 * s,
                height: 132 * s,
                padding: `0 ${22 * s}px 0 ${58 * s}px`,
                borderRadius: 999,
                background: C.ink,
                color: "#FFFFFF",
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 46 * s,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                boxShadow: "0 26px 60px -24px rgb(44 37 32 / .55)",
              }}
            >
              Get your free website demo
              <div style={{ width: 92 * s, height: 92 * s, borderRadius: "50%", background: C.clay, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={44 * s} height={44 * s} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `translateX(${4 * beat}px)` }}>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 1100, 790), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 * s }}>
          <div style={blurIn(t, URL, null, 14)}>
            <Logo file="vallamo-wordmark" w={250 * s} h={81 * s} />
          </div>
          <div style={{ ...giant(58 * s), letterSpacing: "-0.03em", ...blurIn(t, URL + 0.12, null, 14) }}>vallamo.com</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
