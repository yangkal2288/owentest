import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { blurIn, mix, settle, tween } from "../../meet/motion";
import { Logo } from "../../meet/parts";
import { Piece, pieceSize } from "../../meet/Piece";
import { pick, useF } from "../format";
import { Block, ChannelPill, type Msg, Widget, WIDGET_W, widgetHeight } from "../parts";
import { useMetaCut } from "../timeline";
import { display, em } from "../type";
import { Float, pushIn, SHADOW, World } from "../../cinema/kit";

/**
 * 8.2–21.6 s · the product, one continuous shot around the real website chat widget.
 *  8.18  "Vallamo always replies instantly."  The widget rises; the enquiry lands and
 *        Isla answers straight away. ALWAYS in the clay block, a light running across it.
 * 10.87  "Meet Vallamo, your all-in-one front desk."  The wordmark; the widget steps back
 *        and the three live channels land around it on the half-beats.
 * 13.56  "Answers from your clinic's information."  Isla's reply lifts out of the chat onto
 *        white, highlighted, over the real "Why Isla said this" for it: the service it
 *        answered from, the playbook, the live diary check. Then it drops back in.
 * 16.26  "Enquiries answered."  She picks 12:30; Isla books it.
 * 18.95  "Appointments booked."  The real Booked outcome and the Tuesday 12:30 booking
 *        replace the chat on white, with two clay rings, and "Straight into your booking system".
 */
const BODY = 250;
const PILLS = [
  // A stack down the left, overlapping the widget's edge.
  { card: "m-ch-wa", label: "WhatsApp", tall: [48, 700, -2], feed: [48, 400, -2], from: [-520, 0] },
  { card: "m-ch-ig", label: "Instagram", tall: [84, 860, 1.5], feed: [84, 540, 1.5], from: [-520, 0] },
  { card: "m-ch-web", label: "Website", tall: [48, 1020, -1], feed: [48, 680, -1], from: [-520, 0] },
] as const;

/** One headline beat, left aligned at the top of the safe area. */
function Head({ t, at, out, children }: { t: number; at: number; out: number; children: React.ReactNode }) {
  const F = useF();
  if (t < at - 0.01 || t > out + 0.3) return null;
  // Slams in from larger and blurred; leaves through the lens.
  const u = tween(t, at, 0.24);
  const o = tween(t, out, 0.24);
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        top: F.top,
        opacity: Math.min(1, u * 1.6) * (1 - o),
        transform: `translate3d(0, ${(1 - u) * 40}px, 0) scale(${1 + (1 - u) * 0.35 + o * o * 0.5})`,
        transformOrigin: "0% 50%",
        filter: u < 0.99 || o > 0 ? `blur(${(1 - u) * 16 + o * 20}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function Product({ t }: { t: number }) {
  const F = useF();
  const { P, MEET, PROOF, ANSWERED, BOOKED, WIPE, backEnd, meetOut, pillsOut, msgs: MSGS, pills } = useMetaCut().product;
  const s = F.type;
  const k = F.ui;
  const wx = (F.W - WIDGET_W * k) / 2;
  const ox = (WIDGET_W * k) / 2;
  // The widget: rises in, steps back for the channels, hands its reply over for the proof,
  // comes back for her answer, and clears for the result. Never half-visible behind anything.
  const rise = settle(t, P - 0.26, 11);
  const back = tween(t, MEET, 0.5) * (1 - tween(t, backEnd, 0.3));
  const wScale = 1 - 0.28 * back;
  const wDrop = pick(F, 40, 30) * back;
  const wSide = pick(F, 160, 190) * back;
  const away = tween(t, PROOF - 0.02, 0.2) * (1 - tween(t, ANSWERED - 0.05, 0.2));
  const cleared = tween(t, BOOKED, 0.3);
  const wOp = Math.min(1, rise * 1.5) * (1 - away) * (1 - cleared);

  // Isla's first reply, as its own piece: widget slot (stepped back) → hero → widget slot.
  const kh = pick(F, 2.9, 2.5);
  const heroY = pick(F, 540, 292);
  const slotBack = { x: wx + ox + (17 * k - ox) * 0.72 + pick(F, 160, 190), y: F.uiTop + 181 * k * 0.72 + pick(F, 40, 30), w: 316 * k * 0.72 };
  const hero = { x: (F.W - 269 * kh) / 2, y: heroY, w: 316 * kh };
  const slot = { x: wx + 17 * k, y: F.uiTop + 181 * k, w: 316 * k };
  const go = settle(t, PROOF, 11);
  const ret = settle(t, ANSWERED - 0.45, 11);
  const at = (key: "x" | "y" | "w") => mix(mix(slotBack[key], hero[key], go), slot[key], ret);
  const heroOn = t >= PROOF - 0.02 && t < ANSWERED + 0.2;
  const hs = at("w") / 316;
  const ring = tween(t, PROOF + 0.45, 0.25) * (1 - tween(t, ANSWERED - 0.65, 0.2));

  // "Why Isla said this", under it.
  const wk = pick(F, 1.72, 1.5);
  const whyY = heroY + 58 * kh + pick(F, 90, 60);
  const why = settle(t, PROOF + 0.5, 12);
  const whyOut = tween(t, ANSWERED - 0.65, 0.3);

  // The result.
  const R = pick(F, 3.0, 2.6);
  const ry = pick(F, 600, 380);
  const oh = pieceSize("m-outcome").h * R;
  const uh = pieceSize("m-upcoming").h * R;
  const pop = (d: number) => settle(t, BOOKED + d, 12);
  const caption = { ...display(46 * s), color: C.ink2, textAlign: "center" as const, position: "absolute" as const, left: 0, right: 0 };

  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 2000, ...pushIn(t, P - 0.3) }}>
      {/* The inbox in depth; it lifts towards white when the proof and the result need clean ground. */}
      <World kind="inbox" t={t} blur={10} wash={0.62 + 0.26 * Math.max(away, cleared)} zoom={1.1} spin={-18} tilt={46} />
      {/* The headlines. */}
      <Head t={t} at={P} out={MEET - 0.2}>
        <div style={{ ...display(104 * s), lineHeight: 1.04, whiteSpace: "nowrap" }}>
          <div>
            Vallamo{" "}
            <span style={{ display: "inline-block", marginLeft: "0.14em", transform: `scale(${1 + 0.14 * (1 - settle(t, P + 0.1, 14))})`, transformOrigin: "20% 70%" }}>
              <Block u={tween(t, P + 0.1, 0.3)} style={{ letterSpacing: "0.01em" }}>
                ALWAYS
                {/* A light runs across the clay. */}
                <span
                  style={{
                    position: "absolute",
                    inset: "0.06em -0.12em -0.04em",
                    borderRadius: "0.1em",
                    background: "linear-gradient(100deg, transparent 35%, rgba(255,240,215,0.55) 50%, transparent 65%)",
                    backgroundSize: "300% 100%",
                    backgroundPosition: `${mix(100, -50, tween(t, P + 0.55, 0.9))}% 0`,
                    mixBlendMode: "screen",
                  }}
                />
              </Block>
            </span>
          </div>
          <div style={blurIn(t, P + 0.28, null, 16)}>
            replies <span style={em(108 * s)}>instantly.</span>
          </div>
        </div>
      </Head>
      <Head t={t} at={MEET} out={meetOut}>
        <Logo file="vallamo-wordmark" w={400 * s} h={130 * s} style={{ marginLeft: -6 * s }} />
        <div style={{ ...display(72 * s), marginTop: 18 * s, ...blurIn(t, MEET + 0.2, null, 14) }}>
          Your all-in-one <span style={em(76 * s)}>front desk.</span>
        </div>
      </Head>
      <Head t={t} at={PROOF} out={ANSWERED - 0.2}>
        <div style={display(90 * s)}>Answers from your</div>
        <div style={{ ...em(94 * s), lineHeight: 1.05 }}>clinic’s information.</div>
      </Head>
      <Head t={t} at={ANSWERED} out={BOOKED - 0.2}>
        <div style={{ ...display(104 * s), lineHeight: 1 }}>Enquiries</div>
        <div style={{ ...em(112 * s), lineHeight: 1.05 }}>answered.</div>
      </Head>
      <Head t={t} at={BOOKED} out={WIPE + 0.1}>
        <div style={{ ...display(104 * s), lineHeight: 1 }}>Appointments</div>
        <div style={{ ...em(112 * s), lineHeight: 1.05 }}>booked.</div>
      </Head>

      {/* The real website chat widget. */}
      {wOp > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: wx,
            top: F.uiTop,
            transformOrigin: `${ox}px 0px`,
            // Swings in from depth and settles with a slight turn.
            transform: `translate3d(${wSide}px, ${(1 - rise) * 300 + wDrop}px, ${(1 - rise) * -900}px) rotateY(${mix(-38, -4, rise)}deg) rotateX(${mix(16, 2, rise)}deg) scale(${wScale})`,
            opacity: wOp,
            filter: rise < 0.97 ? `blur(${(1 - rise) * 16}px)` : undefined,
            transformStyle: "preserve-3d",
          }}
        >
          <Float t={t} sway={0.45}>
            <Widget t={t} msgs={MSGS} body={BODY} style={{ transform: `scale(${k})`, transformOrigin: "0 0", boxShadow: SHADOW.card }} />
          </Float>
        </div>
      )}
      <div style={{ ...caption, top: F.uiTop + widgetHeight(BODY) * k + pick(F, 30, 18), opacity: rise * (1 - back) * (1 - away) * (1 - cleared) }}>
        Straight into your <span style={em(48 * s)}>booking system.</span>
      </div>

      {/* Proof: the reply, sharp and highlighted, over what it was built from. */}
      {heroOn && (
        <div style={{ position: "absolute", left: at("x"), top: at("y") }}>
          <Piece name="m-i1" w={at("w")} />
          <div
            style={{
              position: "absolute",
              left: -10 * hs,
              top: -10 * hs,
              width: 289 * hs,
              height: 78 * hs,
              borderRadius: 24 * hs,
              border: `${5 * s}px solid ${C.clay}`,
              opacity: ring,
              transform: `scale(${1 + 0.02 * Math.sin((t - PROOF) * 5)})`,
            }}
          />
        </div>
      )}
      {t > PROOF + 0.3 && t < ANSWERED && (
        <>
          <div
            style={{
              position: "absolute",
              left: F.W / 2 - 2.5 * s,
              top: heroY + 58 * kh + 14,
              width: 5 * s,
              height: whyY - (heroY + 58 * kh) - 28,
              borderRadius: 3,
              background: C.clay,
              transform: `scaleY(${tween(t, PROOF + 0.55, 0.3)})`,
              transformOrigin: "50% 0",
              opacity: 1 - whyOut,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: (F.W - 590 * wk) / 2,
              top: whyY,
              opacity: Math.min(1, why * 1.6) * (1 - whyOut),
              filter: why < 0.97 || whyOut > 0 ? `blur(${(1 - why) * 12 + whyOut * 12}px)` : undefined,
              transform: `translate3d(0, ${(1 - why) * 80}px, ${(1 - why) * -200}px) rotateX(${(1 - why) * -16}deg)`,
            }}
          >
            <div style={{ borderRadius: 16 * wk, boxShadow: SHADOW.lift, background: C.paper }}>
              <Piece name="m-why" w={590 * wk} />
            </div>
            {/* The line that matters: what it answered from. */}
            <div
              style={{
                position: "absolute",
                left: 8 * wk,
                top: 42 * wk,
                width: 470 * wk,
                height: 26 * wk,
                borderRadius: 8 * wk,
                border: `${3 * s}px solid ${C.clay}`,
                opacity: tween(t, PROOF + 1.0, 0.25),
              }}
            />
          </div>
        </>
      )}

      {/* The three live channels. */}
      {t > MEET && t < pillsOut + 0.55 &&
        PILLS.map((p, i) => {
          const at = pills[i];
          const u = settle(t, at, 13);
          const o = tween(t, pillsOut, 0.35);
          const [x, y, r] = pick<readonly number[]>(F, p.tall, p.feed);
          const bob = Math.sin((t - at) * 2.2 + x) * 6;
          if (u <= 0) return null;
          return (
            <div
              key={p.label}
              style={{
                position: "absolute",
                left: x,
                top: y,
                opacity: Math.min(1, u * 2) * (1 - o),
                filter: u < 0.97 || o > 0 ? `blur(${(1 - u) * 14 + o * 12}px)` : undefined,
                transform: `translate3d(${(1 - u) * p.from[0] + o * p.from[0] * 0.6}px, ${(1 - u) * p.from[1] + bob}px, 0) rotate(${r * u}deg) scale(${0.7 + 0.3 * u})`,
              }}
            >
              <ChannelPill card={p.card} label={p.label} scale={s} style={{ boxShadow: SHADOW.card }} />
            </div>
          );
        })}

      {/* Booked: the real outcome and the booking, on clean white. */}
      {t > BOOKED && (
        <>
          <div style={{ position: "absolute", left: (F.W - 263 * R) / 2, top: ry }}>
            {[0.1, 0.48].map((d) => {
              const u = Math.min(1, Math.max(0, (t - BOOKED - d) / 1.0));
              if (u <= 0 || u >= 1) return null;
              const g = 1 - Math.pow(1 - u, 3);
              return (
                <div
                  key={d}
                  style={{
                    position: "absolute",
                    left: -g * 60,
                    top: -g * 40,
                    width: 263 * R + g * 120,
                    height: oh + g * 80,
                    borderRadius: 14 * R + g * 40,
                    border: `${3 - 2 * u}px solid ${C.clay}`,
                    opacity: 0.45 * (1 - u),
                  }}
                />
              );
            })}
            {(["m-outcome", "m-upcoming"] as const).map((name, i) => {
              const u = pop(i * 0.22);
              return (
                <div
                  key={name}
                  style={{
                    marginTop: i ? 28 * s : 0,
                    opacity: Math.min(1, u * 2),
                    filter: u < 0.97 ? `blur(${(1 - u) * 12}px)` : undefined,
                    transform: `translate3d(0, ${(1 - u) * pick(F, 520, 360)}px, ${(1 - u) * -300}px) rotateX(${(1 - u) * 30}deg) scale(${1 + 0.035 * (tween(t, BOOKED + 0.25 + i * 0.22, 0.12) - tween(t, BOOKED + 0.37 + i * 0.22, 0.4))})`,
                    borderRadius: 12 * R,
                    background: C.paper,
                    boxShadow: SHADOW.lift,
                  }}
                >
                  <Piece name={name} w={263 * R} />
                </div>
              );
            })}
          </div>
          <div style={{ ...caption, top: ry + oh + 28 * s + uh + pick(F, 70, 44), ...blurIn(t, BOOKED + 0.6, null, 14) }}>
            Straight into your <span style={em(48 * s)}>booking system.</span>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
}
export const RESULT_CENTRE = (F: { id: string }) => (F.id === "916" ? { x: 540, y: 600 + 105 } : { x: 540, y: 380 + 91 });
