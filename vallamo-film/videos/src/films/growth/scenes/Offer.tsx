import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { settle, tween } from "../../meet/motion";
import { Logo } from "../../meet/parts";
import { iris, SHADOW, Slam, Sweep, World } from "../../cinema/kit";
import { pick, useF } from "../../meta/format";
import { display, em } from "../../meta/type";
import { useGrowth } from "../timing";
import { facialSlot } from "./Diary";

const BEAT = 60 / 89.1;
const serif = '"Playfair Display", Georgia, serif';

/**
 * The Autumn deal, opening through a lens iris from the booked facial: AUTUMN DEAL, first 30 new
 * paying clinics, the setup price wiped once from £399 to £0 (saving £399), Growth £399/month
 * stationary and fully readable throughout, Get started online, vallamo.com, the terms.
 */
export function Offer({ t }: { t: number }) {
  const F = useF();
  const g = useGrowth();
  const o = g.offer;
  const slot = facialSlot(F);
  const y0 = pick(F, 285, 150);
  const cardW = pick(F, 900, 860);
  const card = settle(t, o.card, 10);
  const wipe = tween(t, o.wipe, 0.5);
  const cta = settle(t, o.cta, 13);
  const beat = t > o.url ? Math.exp(-(((t - o.url) % BEAT) / BEAT) * 5) : 0;
  const url = tween(t, o.url, 0.35);
  const pill = settle(t, o.at + 0.2, 12);
  const price = pick(F, 156, 140);
  return (
    <AbsoluteFill style={{ ...iris(t, o.at, 0.7, `${slot.x + slot.w / 2}px`, `${slot.y + slot.h / 2}px`, 300), background: "#FBF8F2" }}>
      <World kind="week" t={t} blur={16} wash={0.9} zoom={1.25} spin={-8} tilt={58} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 45% at 50% 38%, rgba(255,236,205,.55) 0%, rgba(255,236,205,0) 70%)" }} />

      {/* AUTUMN DEAL */}
      <div style={{ position: "absolute", left: 0, right: 0, top: y0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 16, height: pick(F, 78, 70), padding: `0 ${pick(F, 38, 34)}px`, borderRadius: 999, background: `linear-gradient(135deg, #BE9760 0%, ${C.clay} 55%, #86653F 100%)`, color: "#FFFFFF", fontFamily: FONT.sans, fontWeight: 700, fontSize: pick(F, 32, 29), letterSpacing: "0.2em", boxShadow: "0 12px 30px -10px rgba(138,106,68,.6)", opacity: Math.min(1, pill * 2), transform: `translateY(${(1 - pill) * -30}px) scale(${0.8 + 0.2 * pill})` }}>
          <svg width={30} height={30} viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12 2c3 4 7 5 7 10a7 7 0 0 1-14 0c0-5 4-6 7-10z" opacity=".95" /></svg>
          AUTUMN DEAL
          <Sweep t={t} at={o.at + 0.8} len={0.9} strength={0.7} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: y0 + pick(F, 106, 96) }}>
        <Slam t={t} at={o.at + 0.35} lines={[[["First "], ["30", true], [" new paying clinics"]]]} base={display(pick(F, 66, 60))} emStyle={{ ...em(pick(F, 72, 66)), color: C.clayDeep }} size={pick(F, 66, 60)} stagger={0.05} />
      </div>

      {/* The prices. */}
      <div style={{ position: "absolute", left: (F.W - cardW) / 2, top: y0 + pick(F, 210, 190), width: cardW, opacity: Math.min(1, card * 1.8), transform: `perspective(1600px) translate3d(0, ${(1 - card) * 200}px, ${(1 - card) * -500}px) rotateX(${(1 - card) * 25}deg)`, filter: card < 0.97 ? `blur(${(1 - card) * 14}px)` : undefined }}>
        <div style={{ borderRadius: 40, background: C.paper, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.lift, padding: `${pick(F, 34, 30)}px ${pick(F, 50, 46)}px` }}>
          {/* Setup: £399, wiped once to £0. */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: FONT.sans, fontWeight: 650, fontSize: pick(F, 40, 36), color: C.ink2, letterSpacing: "-0.01em" }}>Setup</div>
            <div style={{ position: "relative", height: price * 1.05, width: price * 2.7 }}>
              <div style={{ position: "absolute", right: 0, top: 0, fontFamily: serif, fontWeight: 500, fontSize: price, lineHeight: 1.05, letterSpacing: "-0.04em", color: C.ink3, clipPath: `inset(0 0 0 ${wipe * 100}%)` }}>£399</div>
              <div style={{ position: "absolute", right: 0, top: 0, width: "100%", textAlign: "right", fontFamily: serif, fontWeight: 600, fontSize: price, lineHeight: 1.05, letterSpacing: "-0.04em", color: C.clay, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>£0</div>
              {wipe > 0 && wipe < 1 && <div style={{ position: "absolute", top: price * 0.08, bottom: price * 0.02, left: `${wipe * 100}%`, width: 8, marginLeft: -4, borderRadius: 4, background: "#E9C98F", boxShadow: "0 0 24px 6px rgba(233,201,143,.8)" }} />}
            </div>
          </div>
          <div style={{ textAlign: "right", marginTop: -4, height: pick(F, 56, 50), ...em(pick(F, 44, 40)), color: C.clayDeep, opacity: tween(t, o.wipe + 0.35, 0.3), transform: `translateY(${(1 - tween(t, o.wipe + 0.35, 0.3)) * 14}px)` }}>Save £399 on Growth setup</div>
          <div style={{ height: 1.5, background: C.line, margin: `${pick(F, 26, 22)}px 0` }} />
          {/* Growth £399/month: stationary, fully readable from the moment the card lands. */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: pick(F, 44, 40), color: C.ink, letterSpacing: "-0.01em" }}>Growth</div>
            <div style={{ fontFamily: serif, fontWeight: 500, fontSize: pick(F, 104, 94), letterSpacing: "-0.04em", color: C.ink, whiteSpace: "nowrap" }}>
              £399<span style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: pick(F, 40, 36), letterSpacing: "-0.01em", color: C.ink2 }}>/month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Get started online. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: y0 + pick(F, 700, 640), display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", opacity: Math.min(1, cta * 2), filter: cta < 0.97 ? `blur(${(1 - cta) * 12}px)` : undefined, transform: `translateY(${(1 - cta) * 60}px) scale(${(0.8 + 0.2 * cta) * (1 + 0.025 * beat)})` }}>
          {[0, 0.4].map((dd) => {
            const u = Math.min(1, Math.max(0, (t - o.cta - 0.15 - dd) / 0.9));
            if (u <= 0 || u >= 1) return null;
            const e = 1 - Math.pow(1 - u, 3);
            return <div key={dd} style={{ position: "absolute", inset: -e * 34, borderRadius: 999, border: `${4 - 2 * u}px solid ${C.clay}`, opacity: 0.6 * (1 - u) }} />;
          })}
          <div style={{ display: "flex", alignItems: "center", gap: 24, height: pick(F, 124, 114), padding: `0 ${pick(F, 20, 18)}px 0 ${pick(F, 54, 50)}px`, borderRadius: 999, background: C.ink, whiteSpace: "nowrap", boxShadow: "0 2px 4px rgb(44 37 32 / .1), 0 26px 60px -20px rgb(44 37 32 / .6)", fontFamily: FONT.sans, fontWeight: 650, fontSize: pick(F, 46, 42), letterSpacing: "-0.02em", color: "#FFFFFF" }}>
            Get started online
            <div style={{ width: pick(F, 86, 78), height: pick(F, 86, 78), borderRadius: "50%", background: C.clay, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `translateX(${4 * beat}px)` }}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ marginTop: pick(F, 34, 30), display: "flex", alignItems: "center", gap: 18, opacity: url, filter: url < 1 ? `blur(${(1 - url) * 10}px)` : undefined, transform: `translateY(${(1 - url) * 20}px)` }}>
          <Logo file="vallamo-mark" w={pick(F, 64, 58)} h={pick(F, 64, 58)} />
          <div style={{ ...display(pick(F, 68, 62)), lineHeight: 1 }}>vallamo.com</div>
        </div>
        <div style={{ marginTop: pick(F, 26, 26), textAlign: "center", fontFamily: FONT.sans, fontWeight: 500, fontSize: pick(F, 25, 24), lineHeight: 1.4, color: C.ink3, opacity: tween(t, o.url + 0.15, 0.4) }}>
          New monthly subscriptions. Setup fee waived; monthly subscription applies.
          <br />
          Full terms at vallamo.com/pricing
        </div>
      </div>
    </AbsoluteFill>
  );
}
