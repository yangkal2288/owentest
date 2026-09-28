import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { blurIn, mix, settle, tween } from "../../meet/motion";
import { accent, giant, Logo } from "../../meet/parts";
import { Piece, pieceSize } from "../../meet/Piece";
import { pick, useF } from "../format";
import { Block, ChannelPill, type Msg, Widget, WIDGET_W, widgetHeight } from "../parts";
import { BEAT, CUT, DOWNBEAT } from "../timeline";

/**
 * 8.2–21.6 s · the product, one continuous shot around the real website chat widget.
 *  8.18  "Vallamo always replies instantly."  The widget rises; the enquiry lands and
 *        Isla answers straight away. ALWAYS in the clay block, a light running across it.
 * 10.87  "Meet Vallamo, your all-in-one front desk."  The wordmark; the widget steps back
 *        and the three live channels land around it on the half-beats.
 * 13.56  "Answers from your clinic's information."  The real "Why Isla said this"
 *        for that reply: the service it answered from, the playbook, the live diary check.
 * 16.26  "Enquiries answered."  She picks 12:30; Isla books it.
 * 18.95  "Appointments booked."  The real Booked outcome and the Tuesday 12:30 booking
 *        lift out of the chat, with two clay rings. Hold.
 */
export const P = CUT.product; // 8.18
const MEET = DOWNBEAT(4); // 10.87
const PROOF = DOWNBEAT(5); // 13.56
const ANSWERED = DOWNBEAT(6); // 16.26
const BOOKED = DOWNBEAT(7); // 18.95
export const WIPE = 21.25;

const MSGS: Msg[] = [
  { name: "m-u1", at: 8.5 },
  { name: "m-dots", at: 8.76, out: 9.04 },
  { name: "m-i1", at: 9.04 },
  { name: "m-u2", at: 16.45 },
  { name: "m-dots", at: 16.74, out: 17.02 },
  { name: "m-i2", at: 17.02 },
];
const BODY = 250;
const PILLS = [
  // A stack down the left, overlapping the widget's edge.
  { card: "m-ch-wa", label: "WhatsApp", at: MEET + 0.2, tall: [48, 700, -2], feed: [48, 400, -2], from: [-520, 0] },
  { card: "m-ch-ig", label: "Instagram", at: MEET + 0.2 + BEAT / 2, tall: [84, 860, 1.5], feed: [84, 540, 1.5], from: [-520, 0] },
  { card: "m-ch-web", label: "Website", at: MEET + 0.2 + BEAT, tall: [48, 1020, -1], feed: [48, 680, -1], from: [-520, 0] },
] as const;

/** One headline beat, left aligned at the top of the safe area. */
function Head({ t, at, out, children }: { t: number; at: number; out: number; children: React.ReactNode }) {
  const F = useF();
  if (t < at - 0.01 || t > out + 0.3) return null;
  return <div style={{ position: "absolute", left: 72, top: F.top, ...blurIn(t, at, out, 24, 0.32) }}>{children}</div>;
}

export function Product({ t }: { t: number }) {
  const F = useF();
  const s = F.type;
  const k = F.ui;
  const wx = (F.W - WIDGET_W * k) / 2;
  // The widget: rises in, steps back for the channels, returns for the proof, dims under the result.
  const rise = settle(t, P - 0.26, 11);
  const back = tween(t, MEET, 0.5) * (1 - tween(t, PROOF - 0.1, 0.5));
  const wScale = 1 - 0.28 * back;
  const wDrop = pick(F, 40, 30) * back;
  const wSide = pick(F, 160, 190) * back;
  const dim = tween(t, BOOKED, 0.4);
  // "Why Isla said this", over the widget's header while it is there.
  const why = settle(t, PROOF + 0.3, 12);
  const whyOut = tween(t, ANSWERED - 0.25, 0.3);
  const wk = pick(F, 1.72, 1.5);
  const whyY = pick(F, 480, 262);
  // The widget steps back while the panel is up, and returns for her answer.
  const whyDim = tween(t, PROOF + 0.3, 0.4) * (1 - whyOut);
  // The result.
  const R = pick(F, 3.0, 2.6);
  const ry = pick(F, 640, 392);
  const oh = pieceSize("m-outcome").h * R;
  const pop = (d: number) => settle(t, BOOKED + d, 12);
  // Isla's first reply, in frame px (widget at rest), for the knowledge ring.
  const i1 = { x: wx + k * 17, y: F.uiTop + k * (1 + 64 + 32 + 16 + 58 + 10), w: k * 269, h: k * 58 };

  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 2000 }}>
      {/* The headlines. */}
      <Head t={t} at={P} out={MEET - 0.2}>
        <div style={{ ...giant(98 * s), lineHeight: 1.08, whiteSpace: "nowrap" }}>
          <div>
            Vallamo{" "}
            <span style={{ display: "inline-block", marginLeft: "0.14em", transform: `scale(${1 + 0.14 * (1 - settle(t, P + 0.1, 14))})`, transformOrigin: "20% 70%" }}>
              <Block u={tween(t, P + 0.1, 0.3)} style={{ letterSpacing: "-0.01em" }}>
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
          <div style={blurIn(t, P + 0.28, null, 16)}>replies instantly.</div>
        </div>
      </Head>
      <Head t={t} at={MEET} out={PROOF - 0.2}>
        <Logo file="vallamo-wordmark" w={400 * s} h={130 * s} style={{ marginLeft: -6 * s }} />
        <div style={{ ...giant(68 * s), lineHeight: 1.1, marginTop: 18 * s, ...blurIn(t, MEET + 0.2, null, 14) }}>
          Your all-in-one <span style={{ ...accent(80 * s) }}>front desk.</span>
        </div>
      </Head>
      <Head t={t} at={PROOF} out={ANSWERED - 0.2}>
        <div style={{ ...giant(84 * s), lineHeight: 1.08 }}>Answers from your</div>
        <div style={{ ...accent(98 * s), lineHeight: 1.05 }}>clinic’s information.</div>
      </Head>
      <Head t={t} at={ANSWERED} out={BOOKED - 0.2}>
        <div style={{ ...giant(96 * s), lineHeight: 1.05 }}>Enquiries</div>
        <div style={{ ...accent(112 * s), lineHeight: 1.05 }}>answered.</div>
      </Head>
      <Head t={t} at={BOOKED} out={WIPE + 0.1}>
        <div style={{ ...giant(96 * s), lineHeight: 1.05 }}>Appointments</div>
        <div style={{ ...accent(112 * s), lineHeight: 1.05 }}>booked.</div>
      </Head>

      {/* The real website chat widget. */}
      <div
        style={{
          position: "absolute",
          left: wx,
          top: F.uiTop,
          transformOrigin: `${(WIDGET_W * k) / 2}px 0px`,
          transform: `translate3d(${wSide}px, ${(1 - rise) * 900 + wDrop}px, 0) scale(${wScale})`,
          opacity: Math.min(1, rise * 1.5) * (1 - 0.6 * dim) * (1 - 0.8 * whyDim),
          filter: dim + whyDim > 0.01 ? `blur(${dim * 5 + whyDim * 3}px)` : undefined,
        }}
      >
        <Widget t={t} msgs={MSGS} body={BODY} style={{ transform: `scale(${k})`, transformOrigin: "0 0" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: F.uiTop + widgetHeight(BODY) * k + pick(F, 26, 16),
          textAlign: "center",
          fontFamily: FONT.sans,
          fontSize: 26 * s,
          color: C.ink3,
          opacity: rise * (1 - back) * (1 - dim),
        }}
      >
        Example conversation
      </div>

      {/* Knowledge: a clay ring on the reply it explains, then the real panel. */}
      {t > PROOF && t < ANSWERED + 0.2 && (
        <div
          style={{
            position: "absolute",
            left: i1.x - 10,
            top: i1.y - 10,
            width: i1.w + 20,
            height: i1.h + 20,
            borderRadius: 18 * k,
            border: `${5 * s}px solid ${C.clay}`,
            opacity: tween(t, PROOF + 0.35, 0.25) * (1 - whyOut),
            transform: `scale(${1 + 0.04 * Math.sin((t - PROOF) * 5)})`,
          }}
        />
      )}
      {t > PROOF && t < ANSWERED + 0.2 && (
        <div
          style={{
            position: "absolute",
            left: (F.W - 590 * wk) / 2,
            top: whyY,
            opacity: Math.min(1, why * 1.6) * (1 - whyOut),
            filter: why < 0.97 || whyOut > 0 ? `blur(${(1 - why) * 12 + whyOut * 12}px)` : undefined,
            transform: `translate3d(${(1 - why) * 120 + whyOut * -80}px, ${(1 - why) * -40}px, ${(1 - why) * 200}px) rotateY(${(1 - why) * -14}deg)`,
          }}
        >
          <div style={{ borderRadius: 16 * wk, boxShadow: "0 30px 80px -30px rgb(44 37 32 / .45)" }}>
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
              opacity: tween(t, PROOF + 0.9, 0.25),
            }}
          />
        </div>
      )}

      {/* The three live channels. */}
      {t > MEET && t < PROOF + 0.4 &&
        PILLS.map((p) => {
          const u = settle(t, p.at, 13);
          const o = tween(t, PROOF - 0.15, 0.35);
          const [x, y, r] = pick<readonly number[]>(F, p.tall, p.feed);
          const bob = Math.sin((t - p.at) * 2.2 + x) * 6;
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
              <ChannelPill card={p.card} label={p.label} scale={s} />
            </div>
          );
        })}

      {/* Booked: the real outcome and the booking, out of the chat. */}
      {t > BOOKED && (
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
                  borderRadius: 14 * R,
                  boxShadow: "0 30px 80px -28px rgb(44 37 32 / .42)",
                }}
              >
                <Piece name={name} w={263 * R} />
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
}
export const RESULT_CENTRE = (F: { id: string }) => (F.id === "916" ? { x: 540, y: 640 + 105 } : { x: 540, y: 392 + 91 });
