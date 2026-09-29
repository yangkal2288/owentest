import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { blurIn, settle, tween } from "../../meet/motion";
import { pick, useF } from "../format";
import { type Msg, Widget, WIDGET_W } from "../parts";
import { BEAT, useMetaCut } from "../timeline";
import { display, em } from "../type";
import { RESULT_CENTRE } from "./Product";
import { iris, World } from "../../cinema/kit";

/**
 * 21.3–30 s · "Stop losing business to competitors. See Vallamo on your website in
 * ten minutes. Vallamo dot com."
 * A clay circle opens from the booking onto white and the end card builds on the beats,
 * all inside Meta's safe area: the headline, the offer, the action (Get your free website
 * demo), vallamo.com right under it, and "Voice, coming in October" at the top. The real
 * widget rises at the foot; the button breathes on the beat through the hold.
 */
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
  const cut = useMetaCut();
  const WIPE = cut.product.WIPE;
  const { head: HEAD, offer: OFFER, cta: CTA, url: URL, voice: VOICE } = cut.end;
  const s = F.type;
  const o = RESULT_CENTRE(F);
  const clay = tween(t, WIPE, 0.42);
  const white = tween(t, WIPE + 0.09, 0.42);
  const cta = settle(t, CTA, 13);
  const beat = t > URL ? Math.exp(-(((t - URL) % BEAT) / BEAT) * 5) : 0;
  const peek = settle(t, OFFER + 0.1, 8);
  const voice = settle(t, VOICE, 13);
  const k = F.ui * 0.9;
  const top = (tall: number, feed: number) => pick(F, tall, feed);
  return (
    <AbsoluteFill>
      {/* A soft clay lens iris from the booking, the close following through it. */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${o.x}px ${o.y}px, #C49A69 0%, ${C.clay} 40%, #8C6A43 100%)`, ...iris(t, WIPE, 0.6, `${o.x}px`, `${o.y}px`, 320), opacity: clay > 0 ? 1 : 0 }} />
      <AbsoluteFill style={{ background: "#FFFFFF", ...iris(t, WIPE + 0.3, 0.6, `${o.x}px`, `${o.y}px`, 320), opacity: white > 0 ? 1 : 0, overflow: "hidden" }}>
        <World kind="week" t={t} blur={14} wash={0.82} zoom={1.2} spin={-10} tilt={55} />
        {/* The real widget, as it sits on a clinic's website. */}
        <div
          style={{
            position: "absolute",
            left: (F.W - WIDGET_W * k) / 2,
            top: top(1330, 990),
            transform: `translate3d(0, ${(1 - peek) * 700}px, 0) rotate(-2deg)`,
            opacity: Math.min(1, peek * 2),
          }}
        >
          <Widget t={t} msgs={PEEK} body={250} style={{ transform: `scale(${k})`, transformOrigin: "0 0" }} />
        </div>

        {/* Coming next. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: top(268, 64), display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14 * s,
              height: 68 * s,
              padding: `0 ${30 * s}px 0 ${18 * s}px`,
              borderRadius: 999,
              border: `2px solid ${C.clay}`,
              background: C.clayWash,
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: 34 * s,
              color: C.clayInk,
              letterSpacing: "-0.01em",
              opacity: Math.min(1, voice * 2),
              filter: voice < 0.97 ? `blur(${(1 - voice) * 10}px)` : undefined,
              transform: `translateY(${(1 - voice) * -30}px) scale(${0.85 + 0.15 * voice})`,
            }}
          >
            <div style={{ width: 44 * s, height: 44 * s, borderRadius: "50%", background: C.clay, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={24 * s} height={24 * s} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0M12 17v5" />
              </svg>
            </div>
            <span>
              <b style={{ fontWeight: 700 }}>Voice</b> · coming in October
            </span>
          </div>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: top(368, 150), textAlign: "center" }}>
          {LINES.map(([w, a], i) => {
            const u = tween(t, HEAD + i * 0.12, 0.24);
            return (
              <div
                key={w}
                style={{
                  ...(a ? em(140 * s) : display(134 * s)),
                  lineHeight: a ? 1.02 : 0.98,
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

        <div style={{ position: "absolute", left: 0, right: 0, top: top(802, 530), textAlign: "center", ...display(56 * s), color: C.ink2, lineHeight: 1.16, ...blurIn(t, OFFER, null, 16) }}>
          See Vallamo on your website
          <br />
          in <span style={em(60 * s)}>ten minutes.</span>
        </div>

        {/* The action, and where it goes. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: top(974, 680), display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                fontWeight: 650,
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
          <div style={{ marginTop: 34 * s, position: "relative", ...blurIn(t, URL, null, 14) }}>
            <div style={{ ...display(84 * s), letterSpacing: "-0.03em", lineHeight: 1 }}>vallamo.com</div>
            <div style={{ height: 4 * s, marginTop: 10 * s, borderRadius: 2, background: C.clay, transform: `scaleX(${tween(t, URL + 0.2, 0.45)})` }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
