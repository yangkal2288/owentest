import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { blurIn, settle, tween } from "../../meet/motion";
import { Logo } from "../../meet/parts";
import { pick, useF } from "../../meta/format";
import { type Msg, Widget, WIDGET_W } from "../../meta/parts";
import { display, em } from "../../meta/type";
import { useCut } from "../timing";

/**
 * The close: a clay circle opens from the booking onto white, and the card builds on the
 * beats: the headline, the ten-minute website offer, the action, the Vallamo mark with
 * vallamo.com. The complete card holds for the last few seconds; the button breathes on the beat.
 */
const BEAT = 60 / 89.1;
const PEEK: Msg[] = [
  { name: "p-u1", at: 0 },
  { name: "p-i1", at: 0 },
];

export function End({ t }: { t: number }) {
  const F = useF();
  const cut = useCut();
  const e = cut.end;
  const s = F.type;
  const o = { x: 540, y: pick(F, 760, 520) };
  const clay = tween(t, e.at - 0.3, 0.42);
  const white = tween(t, e.at - 0.12, 0.42);
  const cta = settle(t, e.cta, 13);
  const beat = t > e.url ? Math.exp(-(((t - e.url) % BEAT) / BEAT) * 5) : 0;
  const peek = settle(t, e.offer + 0.1, 8);
  const k = F.ui * 0.9;
  const domainButton = e.ctaText === null;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.clay, clipPath: `circle(${clay * 2400}px at ${o.x}px ${o.y}px)` }} />
      <AbsoluteFill style={{ background: "#FFFFFF", clipPath: `circle(${white * 2400}px at ${o.x}px ${o.y}px)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: (F.W - WIDGET_W * k) / 2, top: pick(F, 1370, 1030), transform: `translate3d(0, ${(1 - peek) * 700}px, 0) rotate(-2deg)`, opacity: Math.min(1, peek * 2) }}>
          <Widget t={t} msgs={PEEK} body={250} style={{ transform: `scale(${k})`, transformOrigin: "0 0" }} />
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 320, 96), textAlign: "center" }}>
          {e.headline.map((w, i) => {
            const u = tween(t, e.at + i * 0.12, 0.24);
            const last = i === 2;
            return (
              <div key={w} style={{ ...(last ? em(pick(F, 140, 124)) : display(pick(F, 132, 118))), lineHeight: last ? 1.04 : 0.98, opacity: u, filter: u < 1 ? `blur(${(1 - u) * 14}px)` : undefined, transform: `scale(${1 + (1 - u) * 0.3})` }}>
                {w}
              </div>
            );
          })}
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 760, 490), textAlign: "center", ...display(pick(F, 56, 50)), color: C.ink2, lineHeight: 1.16, ...blurIn(t, e.offer, null, 16) }}>
          See Vallamo on your website
          <br />
          in <span style={em(pick(F, 60, 54))}>ten minutes.</span>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 930, 640), display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", opacity: Math.min(1, cta * 2), filter: cta < 0.97 ? `blur(${(1 - cta) * 10}px)` : undefined, transform: `scale(${(0.8 + 0.2 * cta) * (1 + 0.025 * beat)})` }}>
            {[0, 0.4].map((d) => {
              const u = Math.min(1, Math.max(0, (t - e.cta - 0.15 - d) / 0.9));
              if (u <= 0 || u >= 1) return null;
              const g = 1 - Math.pow(1 - u, 3);
              return <div key={d} style={{ position: "absolute", inset: -g * 34, borderRadius: 999, border: `${4 - 2 * u}px solid ${C.clay}`, opacity: 0.6 * (1 - u) }} />;
            })}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24 * s,
                height: 128 * s,
                padding: `0 ${22 * s}px 0 ${54 * s}px`,
                borderRadius: 999,
                background: C.ink,
                whiteSpace: "nowrap",
                boxShadow: "0 26px 60px -24px rgb(44 37 32 / .55)",
                ...(domainButton ? display(62 * s) : { fontFamily: FONT.sans, fontWeight: 650, fontSize: 44 * s, letterSpacing: "-0.02em" }),
                color: "#FFFFFF",
              }}
            >
              {e.ctaText ?? "vallamo.com"}
              <div style={{ width: 88 * s, height: 88 * s, borderRadius: "50%", background: C.clay, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={42 * s} height={42 * s} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `translateX(${4 * beat}px)` }}>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </div>
          <div style={{ marginTop: pick(F, 56, 40), display: "flex", alignItems: "center", gap: 22 * s, ...blurIn(t, e.url, null, 14) }}>
            <Logo file="vallamo-mark" w={pick(F, 84, 72)} h={pick(F, 84, 72)} />
            {!domainButton && <div style={{ ...display(pick(F, 80, 70)), lineHeight: 1 }}>vallamo.com</div>}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
