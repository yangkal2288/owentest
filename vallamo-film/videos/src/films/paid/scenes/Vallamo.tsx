import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { mix, settle, tween } from "../../meet/motion";
import { Logo } from "../../meet/parts";
import { Piece, pieceSize, type PieceName } from "../../meet/Piece";
import { Float, pushIn, SHADOW, Slam, World } from "../../cinema/kit";
import { pick, useF } from "../../meta/format";
import { Block, ChannelPill, Widget, WIDGET_W } from "../../meta/parts";
import { display, em } from "../../meta/type";
import { useCut } from "../timing";

const CREAM = "#FFFDF9";

/**
 * Meet Vallamo: a clay dot opens into a clay field and the wordmark arrives on it,
 * "Your all-in-one front desk." Out: the wordmark flies through the lens onto white.
 */
export function MeetClay({ t }: { t: number }) {
  const F = useF();
  const m = useCut().meet!;
  const s = F.type;
  const mid = pick(F, 760, 640);
  const open = tween(t, m.at, 0.5);
  const logo = settle(t, m.at + 0.3, 11);
  const out = tween(t, m.out - 0.3, 0.35);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${open * 1500}px at 540px ${mid}px)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% ${(mid / F.H) * 100}%, #B48D60 0%, ${C.clay} 45%, #8C6A43 100%)` }} />
      {/* A slow light across the field. */}
      <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent 30%, rgba(255,240,215,.16) 50%, transparent 70%)`, backgroundSize: "300% 100%", backgroundPosition: `${mix(110, -30, tween(t, m.at + 0.4, 2.6))}% 0` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: mid - pick(F, 210, 190),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: Math.min(1, logo * 1.5) * (1 - out),
          filter: logo < 0.97 || out > 0 ? `blur(${(1 - logo) * 18 + out * 24}px)` : undefined,
          transform: `scale(${(0.86 + 0.14 * logo) * (1 + 0.04 * tween(t, m.at, m.out - m.at)) * (1 + out * out * 1.2)})`,
        }}
      >
        <Logo file="vallamo-wordmark" w={pick(F, 660, 600)} h={pick(F, 214, 195)} color={CREAM} />
        <div style={{ marginTop: 34 * s }}>
          <Slam t={t} at={m.at + 0.75} lines={[[["Your all-in-one "], ["front desk.", true]]]} base={{ ...display(pick(F, 64, 58)), color: CREAM }} emStyle={{ ...em(pick(F, 68, 62)), color: "#F6E9D6" }} size={pick(F, 64, 58)} stagger={0.05} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** "Vallamo ALWAYS replies instantly." over the inbox in depth, the three live channels landing under it. */
export function Always({ t }: { t: number }) {
  const F = useF();
  const a = useCut().always!;
  const s = F.type;
  const mid = pick(F, 760, 640);
  const out = tween(t, a.out, 0.28);
  return (
    <AbsoluteFill style={{ ...pushIn(t, a.at - 0.05) }}>
      <World kind="inbox" t={t} blur={9} wash={0.62} zoom={1.1} spin={-12} />
      <div style={{ position: "absolute", left: 0, right: 0, top: mid - pick(F, 250, 230), textAlign: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 22}px)` : undefined, transform: `scale(${1 + out * out * 0.8})` }}>
        <div style={{ ...display(pick(F, 116, 120)), lineHeight: 1.04, whiteSpace: "nowrap" }}>
          <div>
            <Slam t={t} at={a.at + 0.05} lines={[[["Vallamo"]]]} base={display(pick(F, 116, 120))} emStyle={em(132)} size={pick(F, 116, 120)} style={{ display: "inline-block" }} />{" "}
            <span style={{ display: "inline-block", marginLeft: "0.1em", transform: `scale(${1 + 0.18 * (1 - settle(t, a.at + 0.2, 14))})`, transformOrigin: "30% 70%", opacity: tween(t, a.at + 0.16, 0.08) }}>
              <Block u={tween(t, a.at + 0.2, 0.26)}>
                ALWAYS
                <span
                  style={{
                    position: "absolute",
                    inset: "0.06em -0.12em -0.04em",
                    borderRadius: "0.1em",
                    background: "linear-gradient(100deg, transparent 35%, rgba(255,240,215,0.55) 50%, transparent 65%)",
                    backgroundSize: "300% 100%",
                    backgroundPosition: `${mix(100, -50, tween(t, a.at + 0.6, 0.9))}% 0`,
                    mixBlendMode: "screen",
                  }}
                />
              </Block>
            </span>
          </div>
          <Slam t={t} at={a.at + 0.35} lines={[[["replies "], ["instantly", true]]]} base={display(pick(F, 116, 120))} emStyle={em(pick(F, 124, 128))} size={pick(F, 116, 120)} dot />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: pick(F, 80, 60), perspective: 1200 }}>
          {([["m-ch-wa", "WhatsApp"], ["m-ch-ig", "Instagram"], ["m-ch-web", "Website"]] as const).map(([card, label], i) => {
            const u = settle(t, a.pills[i], 12);
            return (
              <div key={label} style={{ opacity: Math.min(1, u * 2), filter: u < 0.97 ? `blur(${(1 - u) * 12}px)` : undefined, transform: `translate3d(0, ${(1 - u) * 120}px, ${(1 - u) * 400}px) rotateX(${(1 - u) * -40}deg)` }}>
                <Float t={t + i} sway={0.5}>
                  <ChannelPill card={card} label={label} scale={0.84 * s} style={{ boxShadow: SHADOW.card }} />
                </Float>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/**
 * The new enquiry, answered: the real website chat widget swings in from depth over the
 * inbox, the conversation plays, then the booking bursts forward: the real Booked outcome,
 * the Thursday 3pm card, and "Appointment booked · Thursday, 3pm" in gold.
 */
export function Demo({ t }: { t: number }) {
  const F = useF();
  const d = useCut().demo;
  const s = F.type;
  const k = F.ui;
  const wx = (F.W - WIDGET_W * k) / 2;
  const uiTop = pick(F, 560, 330);
  const top = pick(F, 290, 96);
  const enter = settle(t, d.at + 0.15, 9);
  const recede = tween(t, d.booked - 0.1, 0.45);
  const out = tween(t, d.out, 0.3);
  const R = pick(F, 3.0, 2.6);
  const ry = pick(F, 560, 360);
  const oh = pieceSize("p-outcome").h * R;
  const uh = pieceSize("p-upcoming").h * R;
  return (
    <AbsoluteFill style={{ ...pushIn(t, d.at - 0.05), perspective: 1800 }}>
      <World kind="inbox" t={t} blur={11} wash={0.7} zoom={1.15} spin={-18} tilt={46} />
      <div style={{ position: "absolute", left: 0, right: 0, top, opacity: 1 - out }}>
        {d.head === "answered" ? (
          <Slam t={t} at={d.at + 0.05} out={d.booked - 0.15} lines={[[["Answered while you’re"]], [["with a "], ["client", true]]]} base={display(pick(F, 86, 80))} emStyle={em(pick(F, 92, 86))} size={pick(F, 86, 80)} dot />
        ) : (
          <div style={{ ...display(pick(F, 96, 88)), textAlign: "center", lineHeight: 1.04, whiteSpace: "nowrap", opacity: 1 - tween(t, d.booked - 0.15, 0.24) }}>
            <Slam t={t} at={d.at + 0.05} lines={[[["Vallamo"]]]} base={display(pick(F, 96, 88))} emStyle={em(96)} size={pick(F, 96, 88)} style={{ display: "inline-block" }} />{" "}
            <span style={{ display: "inline-block", marginLeft: "0.1em", transform: `scale(${1 + 0.18 * (1 - settle(t, d.at + 0.2, 14))})`, transformOrigin: "30% 70%", opacity: tween(t, d.at + 0.16, 0.08) }}>
              <Block u={tween(t, d.at + 0.2, 0.26)}>ALWAYS</Block>
            </span>
            <Slam t={t} at={d.at + 0.35} lines={[[["replies "], ["instantly", true]]]} base={display(pick(F, 96, 88))} emStyle={em(pick(F, 102, 94))} size={pick(F, 96, 88)} dot />
          </div>
        )}
        {/* The booking, in gold, where the headline was. */}
        {t > d.booked && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center" }}>
            <Slam t={t} at={d.booked + 0.1} lines={[[["Appointment "], ["booked", true]]]} base={display(pick(F, 96, 88))} emStyle={{ ...em(pick(F, 104, 96)), color: C.clay }} size={pick(F, 96, 88)} dot />
          </div>
        )}
      </div>

      {/* The real widget, swinging in from depth. */}
      {recede < 1 && (
        <div
          style={{
            position: "absolute",
            left: wx,
            top: uiTop,
            opacity: Math.min(1, enter * 1.6) * (1 - recede),
            transform: `translate3d(0, ${(1 - enter) * 300 + recede * 60}px, ${(1 - enter) * -900 - recede * 500}px) rotateY(${mix(-38, -5, enter)}deg) rotateX(${mix(18, 3, enter)}deg)`,
            filter: enter < 0.97 || recede > 0 ? `blur(${(1 - enter) * 16 + recede * 16}px)` : undefined,
            transformStyle: "preserve-3d",
          }}
        >
          <Float t={t} sway={0.5}>
            <div style={{ borderRadius: 22 * k, boxShadow: SHADOW.lift }}>
              <Widget t={t} msgs={d.msgs} body={250} style={{ transform: `scale(${k})`, transformOrigin: "0 0", boxShadow: "none" }} />
            </div>
          </Float>
        </div>
      )}
      {d.fast && (
        <div style={{ position: "absolute", left: wx + WIDGET_W * k - 120, top: uiTop - 44, height: 76, padding: "0 28px", borderRadius: 38, background: C.paper, border: `1.5px solid ${C.line}`, boxShadow: SHADOW.card, display: "flex", alignItems: "center", fontFamily: FONT.sans, fontWeight: 650, fontSize: 40, color: C.ink, opacity: tween(t, d.fast[0], 0.2) * (1 - tween(t, d.fast[1], 0.2)) }}>2×</div>
      )}

      {/* The booking bursts forward. */}
      {t > d.booked - 0.05 && (
        <div style={{ position: "absolute", left: (F.W - 263 * R) / 2, top: ry, opacity: 1 - out }}>
          {[0.15, 0.5].map((dd) => {
            const u = Math.min(1, Math.max(0, (t - d.booked - dd) / 1.0));
            if (u <= 0 || u >= 1) return null;
            const g = 1 - Math.pow(1 - u, 3);
            return <div key={dd} style={{ position: "absolute", left: -g * 70, top: -g * 50, width: 263 * R + g * 140, height: oh + g * 100, borderRadius: 14 * R + g * 40, border: `${3 - 2 * u}px solid ${C.clay}`, opacity: 0.5 * (1 - u) }} />;
          })}
          {(["p-outcome", "p-upcoming"] as PieceName[]).map((name, i) => {
            const u = settle(t, d.booked + i * 0.14, 11);
            return (
              <div key={name} style={{ marginTop: i ? 26 * s : 0, opacity: Math.min(1, u * 2), filter: u < 0.97 ? `blur(${(1 - u) * 14}px)` : undefined, transform: `translate3d(0, ${(1 - u) * 260}px, ${(1 - u) * 700}px) rotateX(${(1 - u) * -35}deg)` }}>
                <Float t={t + i * 1.7} sway={0.7}>
                  <div style={{ borderRadius: 12 * R, background: C.paper, boxShadow: SHADOW.lift }}>
                    <Piece name={name} w={263 * R} />
                  </div>
                </Float>
              </div>
            );
          })}
          <div style={{ textAlign: "center", marginTop: pick(F, 60, 44), marginLeft: -200, marginRight: -200, ...display(pick(F, 72, 64)), opacity: tween(t, d.booked + 0.55, 0.3), filter: `blur(${(1 - tween(t, d.booked + 0.55, 0.3)) * 10}px)` }}>
            Thursday, <span style={{ ...em(pick(F, 76, 68)), color: C.clay }}>3pm</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}

const BEAT = 60 / 89.1;
/** The close: over a soft world, the headline, the offer, the action, the mark with vallamo.com. */
export function End({ t }: { t: number }) {
  const F = useF();
  const e = useCut().end;
  const s = F.type;
  const cta = settle(t, e.cta, 13);
  const beat = t > e.url ? Math.exp(-(((t - e.url) % BEAT) / BEAT) * 5) : 0;
  const domainButton = e.ctaText === null;
  return (
    <AbsoluteFill style={{ ...pushIn(t, e.at - 0.05) }}>
      <World kind="week" t={t} blur={14} wash={0.82} zoom={1.2} spin={-10} tilt={55} />
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 300, 90) }}>
        <Slam t={t} at={e.at + 0.05} lines={[[[e.headline[0]]], [[e.headline[1]]], [[e.headline[2], true]]]} base={{ ...display(pick(F, 132, 118)), lineHeight: 0.98 }} emStyle={{ ...em(pick(F, 140, 126)), lineHeight: 1.04 }} size={pick(F, 132, 118)} dot stagger={0.06} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 740, 490), textAlign: "center" }}>
        <Slam t={t} at={e.offer} lines={[[["See Vallamo on your website"]], [["in "], ["ten minutes.", true]]]} base={{ ...display(pick(F, 56, 50)), color: C.ink2, lineHeight: 1.16 }} emStyle={em(pick(F, 60, 54))} size={pick(F, 56, 50)} stagger={0.035} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 920, 650), display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", opacity: Math.min(1, cta * 2), filter: cta < 0.97 ? `blur(${(1 - cta) * 12}px)` : undefined, transform: `translateY(${(1 - cta) * 60}px) scale(${(0.8 + 0.2 * cta) * (1 + 0.025 * beat)})` }}>
          {[0, 0.4].map((dd) => {
            const u = Math.min(1, Math.max(0, (t - e.cta - 0.15 - dd) / 0.9));
            if (u <= 0 || u >= 1) return null;
            const g = 1 - Math.pow(1 - u, 3);
            return <div key={dd} style={{ position: "absolute", inset: -g * 34, borderRadius: 999, border: `${4 - 2 * u}px solid ${C.clay}`, opacity: 0.6 * (1 - u) }} />;
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
              boxShadow: "0 2px 4px rgb(44 37 32 / .1), 0 26px 60px -20px rgb(44 37 32 / .6)",
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
        <div style={{ marginTop: pick(F, 56, 40), display: "flex", alignItems: "center", gap: 22 * s, opacity: tween(t, e.url, 0.3), filter: `blur(${(1 - tween(t, e.url, 0.3)) * 10}px)`, transform: `translateY(${(1 - tween(t, e.url, 0.3)) * 20}px)` }}>
          <Logo file="vallamo-mark" w={pick(F, 84, 72)} h={pick(F, 84, 72)} />
          {!domainButton && <div style={{ ...display(pick(F, 80, 70)), lineHeight: 1 }}>vallamo.com</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
}
