import type { ReactNode } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

import { C, FONT } from "../../brand";
import { mix, settle, tween } from "../meet/motion";
import { Logo } from "../meet/parts";
import { pick, useF } from "../meta/format";
import { Block } from "../meta/parts";
import { display, em, eyebrow } from "../meta/type";
import { PocketWatch } from "./art/Ghost";
import { TreatmentGlass } from "./art/Set";
import { Fog, Hand, Night, Shade } from "./art/Spectre";
import { ChannelIcon } from "./parts";

/**
 * "The Booking Thief" as a cinematic horror ad: after hours in the clinic, the real inbox
 * far off in the dark, fog, and Mr Elsewhere, a tall shade with pale eyes and one white
 * glove. The glove is the actor: it takes the £120 enquiry, and later closes on nothing.
 */
const DEEP = "#B3261B";
const GOLD = "#D9B774";

// ---------------------------------------------------------------- lettering
export function Headline({ u, at, to, children, top }: { u: number; at: number; to: number; children: ReactNode; top?: number }) {
  const F = useF();
  if (u < at - 0.01 || u > to + 0.3) return null;
  const a = settle(u, at, 13);
  const o = tween(u, to, 0.26);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: top ?? F.top, textAlign: "center", opacity: Math.min(1, a * 1.6) * (1 - o), filter: a < 0.97 || o > 0 ? `blur(${(1 - a) * 16 + o * 18}px)` : undefined, transform: `scale(${1 + (1 - a) * 0.3 + o * o * 0.4})`, textShadow: "0 4px 40px rgba(0,0,0,.6)" }}>
      {children}
    </div>
  );
}
const H = (size: number) => ({ ...display(size), color: "#F6EEE3" });
const HE = (size: number, color = GOLD) => ({ ...em(size), color });

/** A spoken line, subtitled in the film's own type. */
export function Line({ u, at, to, who, children }: { u: number; at: number; to: number; who: string | null; children: ReactNode }) {
  const F = useF();
  if (u < at - 0.01 || u > to + 0.2) return null;
  const a = tween(u, at, 0.2);
  const o = tween(u, to, 0.2);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: pick(F, 1150, 1170), textAlign: "center", opacity: a * (1 - o) }}>
      {who && <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 22, letterSpacing: "0.2em", textTransform: "uppercase", color: who === "Mr Elsewhere" ? "#9FB8D6" : "#E3C28C", marginBottom: 6 }}>{who}</div>}
      <div style={{ ...(who ? display(46) : em(44)), color: "#F6EEE3", lineHeight: 1.2, textShadow: "0 2px 20px rgba(0,0,0,.8)" }}>{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------- the enquiry in the dark
export type Enquiry = { who: string; channel: string; icon: "m-ch-ig" | "m-ch-web"; text: string; reply?: { at: number; text: string } };

function GlowCard({ e, u, status, ash, stamp, w }: { e: Enquiry; u: number; status: string; ash: number; stamp: number; w: number }) {
  const s = w / 820;
  const reply = e.reply ? tween(u, e.reply.at, 0.3) : 0;
  return (
    <div style={{ position: "relative", width: w, boxSizing: "border-box", padding: 38 * s, borderRadius: 40 * s, background: `rgba(${mix(255, 120, ash)}, ${mix(251, 116, ash)}, ${mix(244, 114, ash)}, .96)`, boxShadow: `0 0 ${90 * (1 - ash)}px rgba(255,236,200,.35), 0 40px 100px -30px rgba(0,0,0,.8)`, fontFamily: FONT.sans, filter: ash > 0 ? `grayscale(${ash})` : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 * s }}>
        <ChannelIcon card={e.icon} size={70 * s} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 40 * s, color: C.ink, letterSpacing: "-0.02em" }}>{e.who}</div>
          <div style={{ fontWeight: 500, fontSize: 28 * s, color: C.ink3 }}>{e.channel}</div>
        </div>
      </div>
      <div style={{ marginTop: 24 * s, background: "#F1E9DD", borderRadius: 30 * s, borderBottomLeftRadius: 10 * s, padding: `${22 * s}px ${30 * s}px`, fontSize: 44 * s, lineHeight: 1.27, color: C.ink }}>{e.text}</div>
      {e.reply && (
        <div style={{ height: reply * 150 * s, overflow: "hidden" }}>
          <div style={{ marginTop: 18 * s, display: "inline-block", background: "#F1E9DD", borderRadius: 30 * s, borderBottomLeftRadius: 10 * s, padding: `${22 * s}px ${30 * s}px`, fontSize: 44 * s, lineHeight: 1.27, color: C.ink, fontWeight: 650, opacity: reply }}>{e.reply.text}</div>
        </div>
      )}
      <div style={{ marginTop: 22 * s, display: "flex", alignItems: "center", gap: 12 * s, fontSize: 30 * s, fontWeight: 650, color: status.startsWith("Answered") ? "#8E6C3E" : status.includes("clinic") ? DEEP : C.ink3 }}>
        <div style={{ width: 14 * s, height: 14 * s, borderRadius: "50%", background: status.startsWith("Answered") ? GOLD : status.includes("clinic") ? DEEP : C.ink4 }} />
        {status}
      </div>
      {/* Stamped. */}
      {stamp > 0 && (
        <div style={{ position: "absolute", left: "18%", top: "34%", padding: `${10 * s}px ${26 * s}px`, border: `${7 * s}px solid ${DEEP}`, borderRadius: 12 * s, color: DEEP, fontFamily: "Georgia, serif", fontWeight: 700, letterSpacing: "0.14em", fontSize: 64 * s, transform: `rotate(-11deg) scale(${1 + (1 - stamp) * 1.4})`, opacity: Math.min(1, stamp * 2), mixBlendMode: "multiply" }}>ELSEWHERE</div>
      )}
    </div>
  );
}

export type DarkScript = {
  e: Enquiry;
  status: (u: number) => string;
  cardIn: number;
  shade?: { in: number; eyes: number; near?: [number, number]; recoil?: number; fade?: number };
  hand?: { in: number; pinch?: number; stamp?: number; drag?: number; miss?: number; gone?: number };
  vallamo?: { at: number; text: string };
  glass?: boolean; // Maya with her client, far off behind frosted glass
  light?: [number, number]; // Vallamo's warm light rising
  push?: number; // camera push over the shot
};

/** One continuous shot: the card glows in the dark, the shade watches, the hand comes for it. */
export function DarkShot({ u, s, len, children }: { u: number; s: DarkScript; len: number; children?: ReactNode }) {
  const F = useF();
  const cw = 820;
  const cx = (F.W - cw) / 2;
  const cy = pick(F, 690, 470);
  const cardIn = settle(u, s.cardIn, 10);
  const h = s.hand;
  const reach = h ? settle(u, h.in, 7) : 0;
  const pinch = h?.pinch !== undefined ? tween(u, h.pinch, 0.25) : 0;
  const stamp = h?.stamp !== undefined ? tween(u, h.stamp, 0.14) : 0;
  const drag = h?.drag !== undefined ? tween(u, h.drag, 0.7) : 0;
  const miss = h?.miss !== undefined ? tween(u, h.miss, 0.3) : 0;
  const gone = h?.gone !== undefined ? tween(u, h.gone, 0.7) : 0;
  const light = s.light ? tween(u, s.light[0], s.light[1] - s.light[0]) : 0;
  const sh = s.shade;
  const near = sh?.near ? tween(u, sh.near[0], sh.near[1] - sh.near[0]) : 0;
  const push = 1 + (s.push ?? 0.05) * (u / len);
  // The hand: reaches in from the right to the card's right edge; drags it off into the dark.
  const handW = 1000;
  const handX = mix(F.W + 60, cx + cw - 260, reach) + drag * 900 + miss * 30 + gone * 700;
  const handY = cy + pick(F, 150, 120) - 175 + drag * 60;
  const shake = stamp > 0 && stamp < 1 ? Math.sin(u * 90) * 10 * (1 - stamp) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Night t={u} lift={light}>
        <AbsoluteFill style={{ transform: `scale(${push}) translateY(${shake}px)` }}>
          {/* Maya, with her client, warm behind frosted glass across the dark room. */}
          {s.glass && <TreatmentGlass t={u} x={F.W - 330} y={pick(F, 360, 180)} w={300} h={400} style={{ filter: "blur(2px) brightness(.85)", opacity: 0.8, boxShadow: "0 0 120px rgba(255,200,130,.35)" }} />}
          {sh && (
            <div style={{ position: "absolute", left: (F.W - mix(520, 760, near)) / 2 - 140, top: pick(F, 90, -40) + near * 40, width: mix(520, 760, near), filter: `blur(${mix(3, 0, near)}px)` }}>
              <Shade t={u} reveal={settle(u, sh.in, 6)} eyes={tween(u, sh.eyes, 0.4) * (1 - (sh.fade !== undefined ? tween(u, sh.fade, 0.8) : 0))} recoil={sh.recoil !== undefined ? tween(u, sh.recoil, 0.6) : 0} fade={sh.fade !== undefined ? tween(u, sh.fade, 1.2) : 0} style={{ width: "100%" }} />
            </div>
          )}
          <Fog t={u} density={0.55 * (1 - light * 0.8)} />
          {/* The enquiry */}
          <div
            style={{
              position: "absolute",
              left: cx + drag * 820,
              top: cy + drag * 40,
              opacity: Math.min(1, cardIn * 1.5) * (1 - tween(u, (h?.drag ?? 99) + 0.35, 0.35)),
              transform: `translateY(${(1 - cardIn) * 90}px) scale(${(0.94 + 0.06 * cardIn) * (1 - drag * 0.45)}) rotate(${drag * 14}deg)`,
              filter: cardIn < 0.97 || drag > 0 ? `blur(${(1 - cardIn) * 14 + drag * 10}px)` : undefined,
            }}
          >
            <GlowCard e={s.e} u={u} status={s.status(u)} ash={tween(u, (h?.stamp ?? 99) - 0.05, 0.3)} stamp={stamp} w={cw} />
          </div>
          {/* Vallamo answers: gold, instantly, before the hand arrives. */}
          {s.vallamo && u > s.vallamo.at - 0.05 && (
            <div style={{ position: "absolute", left: cx + 70, top: cy + pick(F, 380, 350), width: cw - 70, opacity: tween(u, s.vallamo.at, 0.15), transform: `translateY(${(1 - settle(u, s.vallamo.at, 16)) * 40}px)` }}>
              <div style={{ padding: "26px 32px", borderRadius: 32, background: "#FFF9EE", border: `4px solid ${GOLD}`, boxShadow: `0 0 90px rgba(217,183,116,.75), 0 30px 80px -30px rgba(0,0,0,.8)`, fontFamily: FONT.sans }}>
                <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8E6C3E" }}>Isla · Vallamo · replied instantly</div>
                <div style={{ fontSize: 42, lineHeight: 1.27, color: C.ink, marginTop: 8 }}>{s.vallamo.text}</div>
              </div>
            </div>
          )}
          {h && reach > 0.001 && (
            <div style={{ position: "absolute", left: handX, top: handY, width: handW, opacity: 1 - gone, filter: gone > 0 ? `blur(${gone * 30}px)` : undefined }}>
              <Hand t={u} curl={miss} pinch={Math.max(pinch, drag > 0 ? 1 : 0)} style={{ width: handW }} />
            </div>
          )}
          {/* Vallamo's light burns through. */}
          {light > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${pick(F, 45, 42)}%, rgba(255,214,150,${0.55 * light}) 0%, rgba(255,190,110,${0.25 * light}) 35%, rgba(0,0,0,0) 70%)`, mixBlendMode: "screen" }} />}
        </AbsoluteFill>
        {children}
      </Night>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- ten minutes
export function ClockShot({ u, len }: { u: number; len: number }) {
  const F = useF();
  const run = tween(u, 0.1, len - 0.5);
  const swing = Math.sin(u * 3.2) * 14 * (1 - run * 0.3);
  const mins = Math.min(10, Math.floor(run * 10 + 0.0001));
  return (
    <AbsoluteFill>
      <Night t={u}>
        <div style={{ position: "absolute", left: F.W / 2, top: pick(F, 120, -60), transformOrigin: "0 0", transform: `rotate(${swing}deg)` }}>
          <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: pick(F, 620, 560), background: "repeating-linear-gradient(180deg, #D9BE88 0 10px, transparent 10px 15px)" }} />
          <div style={{ position: "absolute", left: -190, top: pick(F, 600, 540) }}>
            <PocketWatch size={380} open={1} hands={run * 10 + 0.001} />
          </div>
        </div>
        <Fog t={u} density={0.5} />
        <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 1180, 1000), textAlign: "center" }}>
          <div style={{ ...H(pick(F, 130, 116)), fontVariantNumeric: "lining-nums tabular-nums" }}>
            {mins} <span style={HE(pick(F, 130, 116), mins >= 10 ? "#E0584A" : GOLD)}>minutes</span>
          </div>
          <div style={{ ...H(pick(F, 52, 46)), color: "#BFB4A8" }}>without a reply</div>
        </div>
      </Night>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- £120 booking lost
export function LostShot({ u }: { u: number }) {
  const F = useF();
  return (
    <AbsoluteFill>
      <Night t={u}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(179,38,27,${0.35 * tween(u, 0, 0.1)}) 0%, rgba(0,0,0,0) 60%)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 440, 250), display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width={300} height={300} viewBox="0 0 100 100" style={{ transform: `scale(${1 + 0.4 * (1 - settle(u, 0, 16))})`, filter: "drop-shadow(0 0 30px rgba(224,60,40,.7))" }}>
            {[["M18 18L82 82", 0], ["M82 18L18 82", 0.06]].map(([d, dl]) => (
              <path key={d as string} d={d as string} stroke="#E0453A" strokeWidth={14} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tween(u, dl as number, 0.09)} />
            ))}
          </svg>
          <div style={{ ...display(pick(F, 230, 200)), color: "#E0453A", lineHeight: 0.95, opacity: tween(u, 0.08, 0.12), textShadow: "0 0 40px rgba(224,60,40,.6)" }}>£120</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: pick(F, 64, 56), letterSpacing: "0.1em", color: "#E0453A", marginTop: 16, opacity: tween(u, 0.16, 0.12) }}>BOOKING LOST</div>
        </div>
        <Fog t={u} density={0.4} />
      </Night>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- Vallamo arrives
const SCREENS = ["pricing", "scan", "review", "booking", "live"] as const;
export function DawnShot({ u, len, screens = 3 }: { u: number; len: number; screens?: number }) {
  const F = useF();
  const burn = tween(u, 0, 0.9);
  const logo = settle(u, 0.35, 11);
  const list = SCREENS.slice(0, screens === 3 ? 5 : screens).filter((_, i) => screens >= 5 || i % 2 === 0 || i === 4);
  const start = 1.5;
  const per = (len - start - 0.3) / list.length;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Night t={u} lift={1}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, rgba(255,226,170,${burn}) 0%, rgba(240,200,140,${0.85 * burn}) ${20 + 60 * burn}%, rgba(90,60,30,${0.5 * burn}) 100%)` }} />
        <Fog t={u} density={0.35 * (1 - burn)} speed={3} />
        <div style={{ position: "absolute", left: 0, right: 0, top: F.top, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, logo * 1.6), transform: `scale(${0.85 + 0.15 * logo})`, filter: logo < 0.97 ? `blur(${(1 - logo) * 16}px)` : undefined }}>
          <Logo file="vallamo-wordmark" w={pick(F, 520, 460)} h={pick(F, 169, 150)} color="#5A3E1F" />
          <div style={{ ...display(pick(F, 60, 54)), color: "#3A2A1C", marginTop: 12 }}>
            Your all-in-one <span style={{ ...em(pick(F, 64, 58)), color: "#8A6436" }}>front desk.</span>
          </div>
        </div>
        {/* The real setup, in the order a clinic does it: plan, website, check, booking system, live. */}
        {list.map((name, i) => {
          const a = settle(u, start + i * per, 11);
          const o = i < list.length - 1 ? tween(u, start + (i + 1) * per, 0.25) : 0;
          if (a <= 0.001 || o >= 1) return null;
          return (
            <div key={name} style={{ position: "absolute", left: (F.W - 900) / 2, top: pick(F, 640, 440), width: 900, perspective: 1800, opacity: Math.min(1, a * 1.6) * (1 - o) }}>
              <div style={{ transform: `translate3d(${(1 - a) * 200 - o * 300}px, ${(1 - a) * 80}px, ${(1 - a) * -400}px) rotateY(${(1 - a) * -24 + o * 20}deg)`, borderRadius: 18, overflow: "hidden", boxShadow: "0 50px 120px -40px rgba(60,35,10,.7)", border: "10px solid #2B2826" }}>
                <Img src={staticFile(`ui/halloween/${name}.png`)} style={{ display: "block", width: "100%" }} />
              </div>
              {name === "pricing" && (
                <div style={{ position: "absolute", right: 40, top: -40, padding: "14px 26px", borderRadius: 999, background: C.ink, color: "#FFF", fontFamily: FONT.sans, fontWeight: 700, fontSize: 30, transform: "rotate(-3deg)", boxShadow: "0 16px 40px -14px rgba(20,10,5,.6)" }}>
                  Halloween · <span style={{ color: GOLD }}>£0 setup</span>
                </div>
              )}
            </div>
          );
        })}
      </Night>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- the booking in the diary (warm)
const THU_3PM = { x: 514, y: 511, w: 142, h: 29 };
export function BookedShot({ u }: { u: number }) {
  const F = useF();
  const W = 1114;
  const k = 0.9;
  const land = settle(u, 0.5, 9);
  const confirm = settle(u, 0.05, 12);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #FFF3DC 0%, #F1DDBD 60%, #D9BC92 100%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: F.top, display: "flex", justifyContent: "center", opacity: Math.min(1, confirm * 1.5), transform: `scale(${0.9 + 0.1 * confirm})` }}>
        <div style={{ padding: "24px 38px", borderRadius: 28, background: "#FFFCF6", border: `4px solid ${GOLD}`, boxShadow: "0 0 60px rgba(214,170,90,.6), 0 30px 60px -24px rgba(60,35,10,.4)", fontFamily: FONT.sans, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8E6C3E" }}>Jess · Appointment confirmed</div>
          <div style={{ ...display(70), marginTop: 4 }}>
            Thursday · <span style={em(74)}>3pm</span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: (F.W - W * k) / 2, top: pick(F, 720, 460), width: W * k }}>
        <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 90px -30px rgba(60,35,10,.5)" }}>
          <Img src={staticFile("ui/pieces/png/week.png")} style={{ display: "block", width: W * k }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: mix(THU_3PM.x * k - 200, THU_3PM.x * k, land),
            top: mix(THU_3PM.y * k - 440, THU_3PM.y * k, land),
            width: mix(440, THU_3PM.w * k, land),
            height: mix(120, THU_3PM.h * k + 4, land),
            borderRadius: mix(20, 6, land),
            background: "#FFF8EA",
            border: `${mix(4, 2.5, land)}px solid ${GOLD}`,
            boxShadow: `0 0 ${mix(60, 22, land)}px rgba(214,170,90,.85)`,
            fontFamily: FONT.sans,
            fontWeight: 700,
            fontSize: mix(36, 12, land),
            color: C.ink,
            display: "flex",
            alignItems: "center",
            paddingLeft: mix(24, 6, land),
            boxSizing: "border-box",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          Jess · Facial · 3pm
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- the ghost takes his leave
export function FarewellShot({ u, len }: { u: number; len: number }) {
  const F = useF();
  const warm = tween(u, 0, len * 0.6);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Night t={u} lift={warm}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 40%, rgba(255,214,150,${0.5 * warm}) 0%, rgba(0,0,0,0) 60%)` }} />
        <div style={{ position: "absolute", left: (F.W - 820) / 2 + tween(u, len * 0.45, len * 0.55) * 260, top: pick(F, 60, -120), width: 820 }}>
          <Shade t={u} reveal={1} eyes={1 - tween(u, len * 0.35, 0.6)} recoil={tween(u, len * 0.4, len * 0.6) * 0.8} fade={tween(u, len * 0.5, len * 0.5)} style={{ width: "100%" }} />
        </div>
        <Fog t={u} density={0.5 * (1 - warm * 0.5)} speed={2} />
      </Night>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- the offer
export function OfferCard({ u }: { u: number }) {
  const F = useF();
  const s = F.type;
  const at = (d: number) => ({ opacity: tween(u, d, 0.3), transform: `translateY(${(1 - tween(u, d, 0.3)) * 24}px)`, filter: tween(u, d, 0.3) < 1 ? `blur(${(1 - tween(u, d, 0.3)) * 10}px)` : undefined });
  const strike = tween(u, 1.4, 0.22);
  const zero = settle(u, 1.65, 14);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 38%, #FFF8EC 0%, #F4E6CE 60%, #E6CFAA 100%)", overflow: "hidden" }}>
      {/* The last of the fog, burning off at the edges. */}
      <Fog t={u} density={0.35 * (1 - tween(u, 0, 3))} tint="invert(1) sepia(1) brightness(.6)" />
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 250, 70), textAlign: "center" }}>
        <div style={{ ...eyebrow(30 * s), ...at(0.2) }}>Halloween launch offer</div>
        <div style={{ ...display(pick(F, 76, 66)), marginTop: 16, ...at(0.4) }}>
          First 30 new <span style={em(pick(F, 80, 70))}>paying clinics</span>
        </div>
        <div style={{ ...at(0.8), marginTop: pick(F, 36, 20), display: "flex", justifyContent: "center", alignItems: "baseline", gap: 30 }}>
          <span style={{ position: "relative", ...display(pick(F, 110, 96)), color: C.ink3 }}>
            £399
            <span style={{ position: "absolute", left: "-6%", right: "-6%", top: "52%", height: 8, borderRadius: 4, background: DEEP, transform: `rotate(-8deg) scaleX(${strike})`, transformOrigin: "0 50%" }} />
          </span>
          <span style={{ ...display(pick(F, 240, 206)), color: C.clay, lineHeight: 1, display: "inline-block", transform: `scale(${0.6 + 0.4 * zero})`, opacity: Math.min(1, zero * 2) }}>£0</span>
        </div>
        <div style={{ ...display(pick(F, 54, 48)), marginTop: -4, ...at(2.0) }}>
          setup · <span style={em(pick(F, 56, 50))}>save £399 on Growth setup</span>
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 650, fontSize: 36 * s, color: C.ink2, marginTop: 16, ...at(2.3) }}>Growth £399/month</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: pick(F, 46, 28), ...at(2.7) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, height: 124 * s, padding: `0 ${22 * s}px 0 ${52 * s}px`, borderRadius: 999, background: C.ink, color: "#FFF", fontFamily: FONT.sans, fontWeight: 700, fontSize: 44 * s, letterSpacing: "0.02em", boxShadow: "0 26px 60px -20px rgba(44,37,32,.6)" }}>
            GET STARTED ONLINE
            <div style={{ width: 86 * s, height: 86 * s, borderRadius: "50%", background: C.clay, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={40 * s} height={40 * s} viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ ...display(pick(F, 72, 62)), marginTop: pick(F, 30, 18), ...at(3.0) }}>vallamo.com</div>
        <div style={{ fontFamily: FONT.sans, fontSize: 24 * s, color: C.ink3, marginTop: 12, ...at(3.2) }}>New monthly subscriptions. Setup fee waived; monthly subscription applies.</div>
        <div style={{ ...em(pick(F, 46, 40)), color: C.clayDeep, marginTop: pick(F, 36, 20), ...at(3.8) }}>Keep the bookings. Lose the ghost.</div>
      </div>
    </AbsoluteFill>
  );
}

/** "Vallamo ALWAYS replies instantly." over a shot. */
export function AlwaysLine({ u, at, to }: { u: number; at: number; to: number }) {
  const F = useF();
  return (
    <Headline u={u} at={at} to={to}>
      <div style={{ ...H(pick(F, 96, 86)), whiteSpace: "nowrap", lineHeight: 1.04 }}>
        Vallamo{" "}
        <span style={{ display: "inline-block", marginLeft: "0.1em" }}>
          <Block u={tween(u, at + 0.12, 0.26)}>ALWAYS</Block>
        </span>
        <br />
        replies <span style={HE(pick(F, 102, 92))}>instantly.</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 16, opacity: tween(u, at + 0.4, 0.3) }}>
        {([["m-ch-web", "Website"], ["m-ch-wa", "WhatsApp"], ["m-ch-ig", "Instagram"]] as const).map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, height: 54, padding: "0 20px 0 10px", borderRadius: 27, background: "rgba(255,253,249,.94)", fontFamily: FONT.sans, fontWeight: 650, fontSize: 24, color: C.ink }}>
            <ChannelIcon card={c} size={34} />
            {l}
          </div>
        ))}
      </div>
    </Headline>
  );
}
