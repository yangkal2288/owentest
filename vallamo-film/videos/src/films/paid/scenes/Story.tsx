import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { settle, tween } from "../../meet/motion";
import { SHADOW, Float, Slam, World } from "../../cinema/kit";
import { pick, useF } from "../../meta/format";
import { Breakable, shake } from "../../meta/shatter";
import { display, em, RED } from "../../meta/type";
import { useCut } from "../timing";

/**
 * The story, one continuous camera over the real Vallamo UI in depth:
 * "You're with a client." over the week's diary. "An enquiry for £120 comes in." and it
 * drops in from above. "What happens?" The minutes run and it starts to shake. The
 * customer books with another clinic: "You lose them to a competitor." It shatters.
 * "Your marketing spend. £120. Their booking."
 */
export const DEEP = "#A8261B";
const mixHex = (a: string, b: string, u: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * u)).join(",")})`;
};
const AD_ICON = "M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13";

/** The enquiry from the ad, in the film's own type (the "before" is not Vallamo). */
function Enquiry({ t, s }: { t: number; s: number }) {
  const cut = useCut();
  const [c0, c1] = cut.count;
  const run = tween(t, c0, c1 - c0);
  const mins = Math.max(1, Math.ceil(10 * run));
  const reply = tween(t, cut.reply, 0.3);
  const red = tween(t, cut.reply, 0.3);
  const status = t < c0 ? "Just now" : t < cut.reply + 0.2 ? `No reply · ${mins} min` : "Booked elsewhere";
  const bubble = { background: "#F4EEE4", borderRadius: 30 * s, borderBottomLeftRadius: 10 * s, padding: `${24 * s}px ${32 * s}px`, fontSize: 46 * s, lineHeight: 1.28, color: C.ink, letterSpacing: "-0.01em" } as const;
  return (
    <div style={{ position: "relative", width: 936, background: C.paper, border: `${1.5 + 2.5 * red}px solid ${mixHex(C.line, RED, red)}`, borderRadius: 40 * s, padding: 40 * s, boxSizing: "border-box", boxShadow: SHADOW.lift, fontFamily: FONT.sans, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: RED, opacity: 0.06 * red }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22 * s }}>
        <div style={{ width: 80 * s, height: 80 * s, borderRadius: "50%", background: C.clayWash, border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={40 * s} height={40 * s} viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d={AD_ICON} />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 38 * s, color: C.ink, letterSpacing: "-0.02em" }}>Enquiry from your ad</div>
          <div style={{ fontWeight: 500, fontSize: 28 * s, color: C.ink3, marginTop: 2 }}>Website · new customer</div>
        </div>
        <div style={{ fontSize: 28 * s, color: C.ink3 }}>2:14pm</div>
      </div>
      <div style={{ position: "relative", marginTop: 28 * s, ...bubble }}>Can I book the £120 laser session this week?</div>
      <div style={{ position: "relative", height: reply * 124 * s, overflow: "hidden" }}>
        <div style={{ marginTop: 20 * s, display: "inline-block", ...bubble, fontWeight: 600, opacity: reply, transform: `translateY(${(1 - reply) * 30}px)` }}>I’ve booked with another clinic.</div>
      </div>
      <div style={{ position: "relative", marginTop: 28 * s, display: "flex", alignItems: "center", gap: 14 * s, fontSize: 32 * s, fontWeight: 650, color: mixHex(C.clayInk, RED, red) }}>
        <div style={{ width: 16 * s, height: 16 * s, borderRadius: "50%", background: mixHex(C.clay, RED, Math.max(red, run * 0.6)) }} />
        {status}
      </div>
      <div style={{ position: "relative", marginTop: 18 * s, height: 10 * s, borderRadius: 5 * s, background: C.lineSoft, overflow: "hidden" }}>
        <div style={{ height: "100%", background: mixHex(C.clay, RED, Math.max(red, run)), transform: `scaleX(${run})`, transformOrigin: "0 50%" }} />
      </div>
    </div>
  );
}

export function Story({ t }: { t: number }) {
  const F = useF();
  const cut = useCut();
  const s = F.type;
  const mid = pick(F, 760, 640);
  const top = pick(F, 290, 96);
  // The world: the week's diary for "with a client", the inbox once the enquiry arrives.
  const swap = tween(t, cut.enquiry.at - 0.2, 0.45);
  const spike = Math.sin(Math.PI * swap);
  // The camera: a slow push all the way, a push-in on the waiting card, a knock when it lands.
  const land = settle(t, cut.enquiry.drop, 11);
  const knock = t > cut.enquiry.drop + 0.22 ? Math.exp(-(t - cut.enquiry.drop - 0.22) * 9) * Math.sin((t - cut.enquiry.drop - 0.22) * 40) * 8 : 0;
  const lean = tween(t, cut.count[0], cut.shatter - cut.count[0]);
  // Shake: grows with the minutes, jolts on the reply, violent before it breaks.
  const run = tween(t, cut.count[0], cut.count[1] - cut.count[0]);
  const amp = (t > cut.count[0] ? 1 + 10 * run * run : 0) + (t > cut.reply ? 16 * Math.exp(-(t - cut.reply) * 5) + 3 : 0) + (t > cut.crack - 0.15 ? 20 : 0);
  const sh = shake(t, t < cut.shatter ? amp : 0);
  const cardTop = pick(F, 640, 470);
  const broken = t >= cut.shatter;
  const flash = tween(t, cut.shatter, 0.04) - tween(t, cut.shatter + 0.05, 0.45);
  const sp = cut.spend;
  const spendOut = tween(t, sp.out, 0.3);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* The worlds. */}
      <World kind="week" t={t} blur={6 + spike * 24} zoom={1 + 0.02 * t} opacity={1 - swap} />
      {swap > 0 && <World kind="inbox" t={t} blur={8 + spike * 24 + 10 * tween(t, cut.shatter, 0.3)} wash={0.55 + 0.3 * tween(t, cut.shatter, 0.4)} zoom={1.05 + 0.015 * t + 0.08 * lean} opacity={swap} />}
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: 0.35 * tween(t, cut.shatter, 0.3) }} />
      <AbsoluteFill style={{ background: DEEP, opacity: 0.14 * flash }} />

      <AbsoluteFill style={{ transform: `translate3d(${knock * 0.4}px, ${knock}px, 0)` }}>
        {/* "You're with a client." Whole on frame one. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: mid - pick(F, 170, 150) }}>
          <Slam t={t} at={-0.6} out={cut.client.out} lines={[[["You’re with"]], [["a "], ["client", true]]]} base={display(pick(F, 158, 146))} emStyle={em(pick(F, 168, 156))} size={pick(F, 158, 146)} dot />
        </div>

        {/* "An enquiry for £120 comes in." */}
        <div style={{ position: "absolute", left: 0, right: 0, top }}>
          <Slam t={t} at={cut.enquiry.at} out={cut.what ?? cut.lose - 0.12} lines={[[["An enquiry for "], ["£120", true]], [["comes in."]]]} base={display(pick(F, 98, 90))} emStyle={em(pick(F, 104, 96))} size={pick(F, 98, 90)} />
        </div>
        {cut.what !== null && (
          <div style={{ position: "absolute", left: 0, right: 0, top: top + pick(F, 30, 20) }}>
            <Slam t={t} at={cut.what} out={cut.lose - 0.12} lines={[[["What "], ["happens?", true]]]} base={display(pick(F, 120, 112))} emStyle={em(pick(F, 128, 118))} size={pick(F, 120, 112)} />
          </div>
        )}
        <div style={{ position: "absolute", left: 0, right: 0, top }}>
          <Slam t={t} at={cut.lose} out={cut.shatter + 0.05} lines={[[["You lose them to"]], [["a "], ["competitor", true]]]} base={display(pick(F, 98, 90))} emStyle={{ ...em(pick(F, 106, 98)), color: DEEP }} size={pick(F, 98, 90)} dot />
        </div>

        {/* The enquiry: drops in, waits, shakes, breaks. */}
        {t > cut.enquiry.drop - 0.05 && t < cut.shatter + 1.3 && (
          <div style={{ position: "absolute", left: 72, top: cardTop, perspective: 1600 }}>
            <div
              style={{
                transform: `translate3d(${sh.x}px, ${(1 - land) * -1300 + sh.y}px, ${(1 - land) * 300}px) rotateX(${(1 - land) * 38}deg) rotate(${sh.r + (1 - land) * -6}deg) scale(${1 + 0.05 * lean})`,
                transformOrigin: "50% 0%",
                filter: land < 0.96 ? `blur(${(1 - land) * 16}px)` : undefined,
                transformStyle: "preserve-3d",
              }}
            >
              <Float t={t} sway={broken ? 0 : 0.6}>
                <Breakable t={t} crackAt={cut.crack} shatterAt={cut.shatter} radius={40 * s}>
                  <Enquiry t={t} s={s} />
                </Breakable>
              </Float>
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* "Your marketing spend. £120. Their booking." */}
      {t > sp.at - 0.05 && spendOut < 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: mid - pick(F, 330, 300), textAlign: "center", opacity: 1 - spendOut, filter: spendOut > 0 ? `blur(${spendOut * 20}px)` : undefined, transform: `scale(${1 + spendOut * 0.3})` }}>
          <Slam t={t} at={sp.at} lines={[[["Your marketing spend."]]]} base={display(pick(F, 86, 78))} emStyle={em(86)} size={pick(F, 86, 78)} />
          <div style={{ position: "relative", display: "inline-block", marginTop: pick(F, 10, 4) }}>
            <Slam t={t} at={sp.price} lines={[[["£120"]]]} base={{ ...display(pick(F, 300, 270)), color: DEEP, letterSpacing: "-0.04em", lineHeight: 1 }} emStyle={em(300)} size={pick(F, 300, 270)} />
            {/* Struck through. */}
            <div style={{ position: "absolute", left: "-6%", right: "-6%", top: "52%", height: pick(F, 16, 14), borderRadius: 8, background: DEEP, transform: `rotate(-7deg) scaleX(${tween(t, sp.price + 0.22, 0.16)})`, transformOrigin: "0 50%" }} />
          </div>
          <Slam t={t} at={sp.their} lines={[[["Their "], ["booking", true]]]} base={display(pick(F, 104, 96))} emStyle={{ ...em(pick(F, 112, 104)), color: DEEP }} size={pick(F, 104, 96)} dot style={{ marginTop: pick(F, 6, 0) }} />
        </div>
      )}
    </AbsoluteFill>
  );
}
