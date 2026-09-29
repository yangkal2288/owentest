import { AbsoluteFill } from "remotion";

import { C, FONT, SH } from "../../../brand";
import { blurIn, mix, settle, tween } from "../../meet/motion";
import { pick, useF } from "../../meta/format";
import { Breakable, shake } from "../../meta/shatter";
import { display, em, eyebrow, RED } from "../../meta/type";
import { useCut } from "../timing";

/**
 * The paid enquiry, and how it was lost. Whole headline on the first frame; the path
 * (Your ad → New enquiry → Another clinic); the enquiry from the ad lands. "You're with
 * a client." The clock runs to 10:00 and settles on "10 minutes without a reply", the
 * card shaking harder as it goes; the customer says she booked with another clinic.
 * The card cracks and shatters, and in its place: one deep-red X, £120, BOOKING LOST.
 * The example label stays readable through the whole loss.
 */
const DEEP = "#A8261B";
const mixHex = (a: string, b: string, u: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * u)).join(",")})`;
};
const mmss = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

function Icon({ d, size, color }: { d: string; size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const ICON = {
  ad: "M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13",
  chat: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z",
  clinic: "M4 21V8l8-5 8 5v13M9 21v-6h6v6M12 8v4M10 10h4",
};

/** The enquiry from the ad, drawn in the film's own type (the "before" is not Vallamo). */
function Enquiry({ t, s }: { t: number; s: number }) {
  const cut = useCut();
  const reply = tween(t, cut.reply, 0.3);
  const red = cut.timer ? tween(t, cut.timer.to, 0.25) : tween(t, cut.reply, 0.3);
  const elapsed = cut.timer ? 600 * Math.pow(tween(t, cut.timer.from, cut.timer.to - cut.timer.from), 1) : 0;
  const waiting = cut.timer && t >= cut.timer.from;
  const status =
    cut.card.status === "noReply"
      ? "No reply · You’re with a client"
      : !waiting
        ? "You’re with a client"
        : t < cut.timer!.to
          ? `No reply · ${Math.max(1, Math.ceil(elapsed / 60))} min`
          : "No reply · 10 minutes";
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  const bubble = { background: "#F4EEE4", borderRadius: 30 * s, borderBottomLeftRadius: 10 * s, padding: `${24 * s}px ${32 * s}px`, fontSize: 46 * s, lineHeight: 1.28, color: C.ink, letterSpacing: "-0.01em" } as const;
  return (
    <div style={{ position: "relative", width: 936, background: C.paper, border: `${1.5 + 2.5 * red}px solid ${mixHex(C.line, RED, red)}`, borderRadius: 40 * s, padding: 40 * s, boxSizing: "border-box", boxShadow: SH.float, fontFamily: FONT.sans, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: RED, opacity: 0.06 * red }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22 * s }}>
        <div style={{ width: 80 * s, height: 80 * s, borderRadius: "50%", background: C.clayWash, border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICON.ad} size={40 * s} color={C.clay} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 38 * s, color: C.ink, letterSpacing: "-0.02em" }}>Enquiry from your ad</div>
          <div style={{ fontWeight: 500, fontSize: 28 * s, color: C.ink3, marginTop: 2 }}>Website · new customer</div>
        </div>
        <div style={{ fontSize: 28 * s, color: C.ink3 }}>2:14pm</div>
      </div>
      <div style={{ position: "relative", marginTop: 28 * s, ...bubble }}>Can I book the £120 laser session this week?</div>
      <div style={{ position: "relative", height: reply * 190 * s, overflow: "hidden" }}>
        <div style={{ marginTop: 20 * s, display: "inline-block", ...bubble, fontWeight: 600, opacity: reply, transform: `translateY(${(1 - reply) * 30}px)` }}>{cut.replyText}</div>
      </div>
      <div style={{ position: "relative", marginTop: 28 * s, display: "flex", alignItems: "center", gap: 14 * s, fontSize: 32 * s, fontWeight: red > 0.5 ? 700 : 600, color: mixHex(C.clayInk, RED, red) }}>
        <div style={{ width: 16 * s, height: 16 * s, borderRadius: "50%", background: mixHex(C.clay, RED, red), boxShadow: `0 0 0 ${(6 + 6 * pulse) * s}px ${red > 0.5 ? "rgba(194,65,47,.14)" : "rgba(164,127,84,.16)"}` }} />
        {status}
      </div>
    </div>
  );
}

export function Loss({ t }: { t: number }) {
  const F = useF();
  const cut = useCut();
  const s = F.type;
  const X = 72;
  const client = cut.card.client;
  const tm = cut.timer;
  // Where the card sits: under the hook, then up for "You're with a client", then down under the clock.
  const land = settle(t, cut.card.in, 13);
  const toClient = client !== null ? settle(t, client, 10) : 0;
  const toTimer = tm ? settle(t, tm.from - 0.2, 10) : 0;
  const yHook = pick(F, 1000, 700);
  const yClient = pick(F, 450, 250);
  const yTimer = pick(F, 660, 440);
  const scHook = cut.id === "short" ? 1 : 0.8;
  const y = mix(mix(yHook, yClient, toClient), yTimer, toTimer) + (1 - land) * 300;
  const sc = mix(scHook, 1, toClient);
  // The hook stays until the story moves on.
  const hookOut = client !== null ? tween(t, client - 0.05, 0.35) : 0;
  // Shake: grows with the clock (or through the wait), jolts on the reply, violent before it breaks.
  const grow = tm ? tween(t, tm.from, tm.to - tm.from) : tween(t, cut.card.in + 0.5, cut.crack - cut.card.in - 0.5);
  const amp =
    (t > (tm ? tm.from : cut.card.in + 0.5) ? 1.5 + 12 * grow * grow : 0) +
    (tm && t > tm.to ? 30 * Math.exp(-(t - tm.to) * 6) + 3 : 0) +
    (t > cut.reply ? 14 * Math.exp(-(t - cut.reply) * 5) : 0) +
    (t > cut.crack - 0.15 && t < cut.x ? 22 : 0);
  const sh = shake(t, t < cut.x ? amp : 0);
  const flash = tween(t, cut.x, 0.04) - tween(t, cut.x + 0.06, 0.5);
  const xOut = tween(t, cut.xOut, 0.35);
  const lossOn = t >= cut.x;
  // From "You're with a client" (the short cut: from the card) until the loss clears.
  const label = tween(t, (client ?? cut.card.in) + 0.3, 0.3) * (1 - xOut);
  const labelY = lossOn ? pick(F, 1150, 1040) : y - 64;
  // The clock.
  const elapsed = tm ? 600 * Math.pow(tween(t, tm.from, tm.to - tm.from), 1.6) : 0;
  const timerIn = tm ? tween(t, tm.from - 0.25, 0.3) : 0;
  const timerRed = tm ? tween(t, tm.to, 0.25) : 0;
  const timerPop = tm && t > tm.to ? 1 + 0.12 * (1 - settle(t, tm.to, 12)) : 1;
  const timerOut = tween(t, cut.x - 0.1, 0.2);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden", perspective: 1800 }}>
      <AbsoluteFill style={{ background: DEEP, opacity: 0.12 * flash }} />

      {/* The hook, whole on frame one. */}
      {hookOut < 1 && t < cut.x && (
        <div style={{ position: "absolute", left: X, top: F.top, opacity: 1 - hookOut, filter: hookOut > 0 ? `blur(${hookOut * 16}px)` : undefined, transform: `translateY(${-hookOut * 60}px) scale(${1 + 0.04 * (1 - settle(t, 0, 14))})`, transformOrigin: "0 0" }}>
          <div style={eyebrow(28 * s)}>Clinic owners</div>
          <div style={{ ...display(pick(F, 124, 112)), lineHeight: 1.0, marginTop: 26 * s, whiteSpace: "nowrap" }}>
            {cut.hook.map((line, i) => (
              <div key={i}>
                {line.map(([w, e]) => (
                  <span key={w} style={e ? { ...em(pick(F, 132, 120)), color: C.clay } : undefined}>
                    {w}
                  </span>
                ))}
              </div>
            ))}
          </div>
          {cut.path && (
            <div style={{ display: "flex", alignItems: "center", gap: 18 * s, marginTop: pick(F, 56, 40) }}>
              {([["Your ad", ICON.ad], ["New enquiry", ICON.chat], ["Another clinic", ICON.clinic]] as const).map(([label, icon], i) => {
                const u = settle(t, cut.path![i], 14);
                const last = i === 2;
                const col = last ? RED : C.clayInk;
                return (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 18 * s }}>
                    {i > 0 && (
                      <svg width={46 * s} height={20 * s} viewBox="0 0 46 20" style={{ opacity: tween(t, cut.path![i] - 0.2, 0.2) }}>
                        <path d="M2 10h38M32 3l8 7-8 7" fill="none" stroke={C.ink4} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tween(t, cut.path![i] - 0.2, 0.2)} />
                      </svg>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10 * s,
                        height: 70 * s,
                        padding: `0 ${24 * s}px 0 ${18 * s}px`,
                        borderRadius: 999,
                        background: last ? "#FBEDEA" : C.clayWash,
                        border: `1.5px solid ${last ? "#EDC6BF" : C.line}`,
                        fontFamily: FONT.sans,
                        fontWeight: 600,
                        fontSize: 30 * s,
                        color: col,
                        opacity: Math.min(1, u * 2),
                        transform: `scale(${0.8 + 0.2 * u})`,
                        filter: u < 0.97 ? `blur(${(1 - u) * 8}px)` : undefined,
                      }}
                    >
                      <Icon d={icon} size={30 * s} color={col} />
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* "You're with a client." */}
      {client !== null && tm && t > client - 0.05 && t < tm.from + 0.3 && (
        <div style={{ position: "absolute", left: X, top: F.top, ...display(pick(F, 104, 96)), ...blurIn(t, client + 0.1, tm.from - 0.35, 20) }}>
          You’re with a <span style={{ ...em(pick(F, 110, 100)), color: C.clay }}>client.</span>
        </div>
      )}

      {/* The clock. */}
      {tm && t > tm.from - 0.3 && t < cut.x + 0.3 && (
        <div style={{ position: "absolute", left: X, top: F.top - 10, opacity: timerIn * (1 - timerOut), filter: timerOut > 0 ? `blur(${timerOut * 12}px)` : undefined }}>
          <div
            style={{
              ...display(pick(F, 240, 214)),
              color: mixHex(C.ink, DEEP, timerRed),
              fontVariantNumeric: "lining-nums tabular-nums",
              letterSpacing: "-0.03em",
              lineHeight: 0.95,
              transform: `translate(${sh.x * 0.3}px, 0) scale(${timerPop})`,
              transformOrigin: "0 80%",
            }}
          >
            {mmss(t >= tm.to ? 600 : elapsed)}
          </div>
          <div style={{ ...display(pick(F, 60, 54)), color: C.ink2, marginTop: 6, ...blurIn(t, tm.settle, null, 14) }}>
            <span style={{ ...em(pick(F, 64, 58)), color: DEEP }}>10 minutes</span> without a reply
          </div>
        </div>
      )}

      {/* The example label. */}
      <div style={{ position: "absolute", left: lossOn ? 0 : X, right: lossOn ? 0 : undefined, top: labelY, textAlign: lossOn ? "center" : "left", fontFamily: FONT.sans, fontWeight: 600, fontSize: 28 * s, letterSpacing: "0.02em", color: C.ink3, opacity: label }}>
        Example scenario · £120 appointment
      </div>

      {/* The enquiry: whole, then in pieces. */}
      {t < cut.x + 1.2 && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            left: X,
            top: 0,
            // Under the red X: the shards clear out fast behind it.
            opacity: Math.min(1, land * 2) * (1 - 0.7 * tween(t, cut.x + 0.1, 0.25)),
            filter: land < 0.97 ? `blur(${(1 - land) * 12}px)` : undefined,
            transform: `translate3d(${sh.x}px, ${y + sh.y}px, 0) rotate(${sh.r}deg) scale(${sc})`,
            transformOrigin: "0 0",
            transformStyle: "preserve-3d",
          }}
        >
          <Breakable t={t} crackAt={cut.crack} shatterAt={cut.x} radius={40 * s}>
            <Enquiry t={t} s={s} />
          </Breakable>
        </div>
      )}

      {/* The loss: one X, one price, one outcome. */}
      {lossOn && xOut < 1 && (
        <div style={{ position: "absolute", zIndex: 2, left: 0, right: 0, top: pick(F, 300, 130), display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - xOut, filter: xOut > 0 ? `blur(${xOut * 14}px)` : undefined, transform: `translateY(${-xOut * 40}px)` }}>
          <svg width={pick(F, 330, 280)} height={pick(F, 330, 280)} viewBox="0 0 100 100" style={{ transform: `scale(${1 + 0.35 * (1 - settle(t, cut.x, 16))})` }}>
            {[
              ["M18 18L82 82", 0],
              ["M82 18L18 82", 0.08],
            ].map(([d, delay]) => (
              <path key={d as string} d={d as string} stroke={DEEP} strokeWidth={15} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tween(t, cut.x + (delay as number), 0.1)} />
            ))}
          </svg>
          <div style={{ ...display(pick(F, 230, 200)), color: DEEP, lineHeight: 0.95, marginTop: pick(F, 10, 0), ...blurIn(t, cut.x + 0.1, null, 20, 0.2) }}>£120</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: pick(F, 66, 58), letterSpacing: "0.08em", color: DEEP, marginTop: 16, ...blurIn(t, cut.x + 0.22, null, 14, 0.2) }}>BOOKING LOST</div>
          <div style={{ ...display(pick(F, 60, 54)), color: C.ink2, marginTop: pick(F, 56, 40), ...blurIn(t, cut.x + 0.85, null, 14) }}>
            Your marketing. <span style={em(pick(F, 64, 58))}>Their booking.</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
export const DEEP_RED = DEEP;
