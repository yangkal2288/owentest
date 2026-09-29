import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { mix, settle, tween } from "../../meet/motion";
import { Piece, pieceSize } from "../../meet/Piece";
import { Float, SHADOW, Slam, Sweep } from "../../cinema/kit";
import { pick, useF } from "../../meta/format";
import { Block as Highlight, Widget, WIDGET_W, widgetHeight } from "../../meta/parts";
import { display, em } from "../../meta/type";
import { CHANNELS, EnquiryCard, Flow } from "../parts";
import { useGrowth } from "../timing";

/** "Vallamo ALWAYS replies instantly." (the exact line), ALWAYS on its clay block with a light across it. */
function Always({ t, at, out, size }: { t: number; at: number; out: number; size: number }) {
  const o = tween(t, out, 0.3);
  if (o >= 1) return null;
  return (
    <div style={{ ...display(size), textAlign: "center", lineHeight: 1.04, whiteSpace: "nowrap", opacity: 1 - o, filter: o > 0 ? `blur(${o * 18}px)` : undefined, transform: `scale(${1 + o * 0.25})` }}>
      <div>
        <Slam t={t} at={at + 0.05} lines={[[["Vallamo"]]]} base={display(size)} emStyle={em(size)} size={size} style={{ display: "inline-block" }} />{" "}
        <span style={{ display: "inline-block", marginLeft: "0.1em", transform: `scale(${1 + 0.18 * (1 - settle(t, at + 0.2, 14))})`, transformOrigin: "30% 70%", opacity: tween(t, at + 0.16, 0.08) }}>
          <Highlight u={tween(t, at + 0.2, 0.26)}>
            ALWAYS
            <span style={{ position: "absolute", inset: "0.06em -0.12em -0.04em", borderRadius: "0.1em", background: "linear-gradient(100deg, transparent 35%, rgba(255,240,215,0.6) 50%, transparent 65%)", backgroundSize: "300% 100%", backgroundPosition: `${mix(100, -50, tween(t, at + 0.6, 0.9))}% 0`, mixBlendMode: "screen" }} />
          </Highlight>
        </span>
      </div>
      <Slam t={t} at={at + 0.35} lines={[[["replies "], ["instantly", true]]]} base={display(size)} emStyle={em(size + 8)} size={size} dot />
    </div>
  );
}

/**
 * Enquiries answered: WhatsApp, Instagram and the website land as three enquiry cards (main cut);
 * the website one comes forward and becomes the real chat widget. The £120 facial enquiry gets a
 * useful answer from the clinic's service list, the customer says yes, gives their details, and
 * it is booked: the header turns into ENQUIRY → ANSWER → BOOKING, and the result bursts forward.
 */
export function Chat({ t }: { t: number }) {
  const F = useF();
  const g = useGrowth();
  const c = g.chat;
  const ch = g.channels;
  const s = F.type;
  const k = F.ui;
  const W = WIDGET_W * k;
  const uiTop = pick(F, 600, 330);
  const headTop = pick(F, 280, 80);
  const hs = pick(F, 104, 92);
  // Short cut: the widget sits lower under the opening headline, then rises into place.
  const early = ch === null ? 1 - settle(t, c.head - 0.1, 9) : 0;
  const kk = mix(k, pick(F, 2.0, 1.55), early);
  const top = mix(uiTop, pick(F, 820, 560), early);
  const wx = (F.W - WIDGET_W * kk) / 2;

  const enter = ch ? tween(t, ch.focus - 0.05, 0.4) : settle(t, c.at, 10);
  const recede = tween(t, c.out - 0.1, 0.45);
  const burst = t > c.booked - 0.05;
  const R = pick(F, 2.6, 2.2);
  const flowAt = c.flow ?? Infinity;

  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      {/* The header: the exact line, then (main) the mechanism in three words. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: headTop }}>
        {t >= c.head - 0.05 && <Always t={t} at={c.head} out={Math.min(flowAt - 0.25, c.out)} size={hs} />}
        {t >= flowAt - 0.05 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 110, 80), opacity: 1 - tween(t, c.out, 0.3) }}>
            <Flow t={t} at={flowAt} lit={[flowAt, flowAt + 0.25, c.booked]} size={pick(F, 40, 36)} />
          </div>
        )}
      </div>

      {/* Three channels, three enquiries (main cut). */}
      {ch &&
        t < ch.focus + 0.5 &&
        CHANNELS.map((e, i) => {
          const u = settle(t, ch.cards[i], 10);
          const cw = pick(F, 860, 720);
          const y = pick(F, 580, 330) + i * pick(F, 250, 230);
          const lx = (F.W - cw) / 2 + [-36, 36, 0][i];
          const web = i === 2;
          const f = tween(t, ch.focus - 0.1, 0.4);
          // The two other channels leave sideways; the website card comes forward into the widget.
          const dx = web ? 0 : (i === 0 ? -1 : 1) * f * 1000;
          const dy = web ? f * (uiTop + pick(F, 150, 120) - y) : 0;
          return (
            <div
              key={e.label}
              style={{
                position: "absolute",
                left: lx,
                top: y,
                opacity: Math.min(1, u * 2) * (web ? 1 - tween(t, ch.focus + 0.05, 0.3) : 1 - f),
                filter: u < 0.97 || f > 0 ? `blur(${(1 - u) * 14 + f * 10}px)` : undefined,
                transform: `translate3d(${dx + (1 - u) * (i === 1 ? 400 : -400)}px, ${dy + (1 - u) * 200}px, ${(1 - u) * -700 + (web ? f * 200 : 0)}px) rotateY(${(1 - u) * (i === 1 ? -30 : 30)}deg) rotateX(${(1 - u) * 20}deg)`,
              }}
            >
              <Float t={t + i * 1.1} sway={0.5}>
                <EnquiryCard card={e.card} label={e.label} text={e.text} w={cw} style={{ boxShadow: SHADOW.lift }} />
              </Float>
            </div>
          );
        })}

      {/* The real website chat widget. */}
      {recede < 1 && t >= (ch ? ch.focus - 0.1 : c.at - 0.05) && (
        <div
          style={{
            position: "absolute",
            left: wx,
            top,
            opacity: Math.min(1, enter * 1.5) * (1 - recede),
            transform: `translate3d(0, ${(1 - enter) * (ch ? 40 : 320) + recede * 80}px, ${(1 - enter) * (ch ? 120 : -800) - recede * 600}px) rotateX(${mix(ch ? 0 : 16, 0, enter) + recede * 12}deg) rotateY(${mix(ch ? 0 : -24, 0, enter) - recede * 20}deg)`,
            filter: enter < 0.97 || recede > 0 ? `blur(${(1 - enter) * 12 + recede * 18}px)` : undefined,
          }}
        >
          <Float t={t} sway={0.45}>
            <div style={{ width: WIDGET_W * kk, height: widgetHeight(250) * kk, borderRadius: 22 * kk, boxShadow: SHADOW.lift }}>
              <Widget t={t} msgs={c.msgs} body={250} style={{ transform: `scale(${kk})`, transformOrigin: "0 0", boxShadow: "none", width: WIDGET_W }} />
            </div>
          </Float>
        </div>
      )}
      {c.fast && (
        <div style={{ position: "absolute", left: wx + W - 140, top: top - 46, height: 80, padding: "0 30px", borderRadius: 40, background: C.ink, color: "#FFFFFF", boxShadow: SHADOW.card, display: "flex", alignItems: "center", gap: 12, fontFamily: FONT.sans, fontWeight: 650, fontSize: 40, opacity: tween(t, c.fast[0], 0.2) * (1 - tween(t, c.fast[1], 0.2)), transform: `scale(${0.8 + 0.2 * settle(t, c.fast[0], 14)})` }}>
          <svg width={34} height={34} viewBox="0 0 24 24" fill="#FFFFFF"><path d="M3 5l9 7-9 7zM12 5l9 7-9 7z" /></svg>2×
        </div>
      )}

      {/* It is booked: the real result bursts forward over the chat. */}
      {burst && (
        <div style={{ position: "absolute", left: (F.W - 263 * R) / 2, top: top + pick(F, 560, 440), opacity: 1 - tween(t, c.out + 0.05, 0.25) }}>
          {[0.1, 0.45].map((dd) => {
            const u = Math.min(1, Math.max(0, (t - c.booked - dd) / 0.9));
            if (u <= 0 || u >= 1) return null;
            const e = 1 - Math.pow(1 - u, 3);
            return <div key={dd} style={{ position: "absolute", left: -e * 70, top: -e * 50, width: 263 * R + e * 140, height: 70 * R + e * 100, borderRadius: 14 * R + e * 40, border: `${3 - 2 * u}px solid ${C.clay}`, opacity: 0.55 * (1 - u) }} />;
          })}
          {(() => {
            const u = settle(t, c.booked, 12);
            return (
              <div style={{ opacity: Math.min(1, u * 2), filter: u < 0.97 ? `blur(${(1 - u) * 12}px)` : undefined, transform: `translate3d(0, ${(1 - u) * 160}px, ${(1 - u) * 500}px) rotateX(${(1 - u) * -30}deg)` }}>
                <div style={{ borderRadius: 12 * R, background: C.paper, boxShadow: SHADOW.lift }}>
                  <Piece name="g-outcome" w={pieceSize("g-outcome").w * R} />
                </div>
              </div>
            );
          })()}
        </div>
      )}
      <Sweep t={t} at={c.head + 0.55} len={1.0} strength={0.4} />
    </AbsoluteFill>
  );
}
