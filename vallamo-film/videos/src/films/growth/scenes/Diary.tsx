import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { mix, settle, tween } from "../../meet/motion";
import { Piece, pieceSize } from "../../meet/Piece";
import { Float, SHADOW, Slam, Sweep } from "../../cinema/kit";
import { pick, useF, type Format } from "../../meta/format";
import { display, em } from "../../meta/type";
import { Block, DiaryView, diaryPoint, Reveal, slotY, TimeChip, WEEK } from "../parts";
import { useGrowth, type GrowthCut } from "../timing";

const FROM = 12;
const TO = 17;
/** Where the diary card sits, and its scale. */
export const diaryFrame = (F: Format) => {
  const k = pick(F, 2.0, 1.9);
  const w = (WEEK.labels + WEEK.cols.Sat - WEEK.cols.Wed) * k;
  return { k, left: (F.W - w) / 2, top: pick(F, 610, 350), w };
};
/** The facial's slot, Thursday 3pm, on screen (px). */
export const facialSlot = (F: Format) => {
  const d = diaryFrame(F);
  const p = diaryPoint(d.k, FROM, WEEK.cols.Thu + 4, slotY(15));
  return { x: d.left + p.x, y: d.top + p.y, w: 142 * d.k, h: pieceSize("g-bk-facial").h * d.k };
};

type Run = [string, boolean?];
const BENEFITS: { lines: Run[][]; time: string; what: string; block: "g-bk-wed" | "g-bk-fri" | "g-bk-sat"; x: number; y: number }[] = [
  { lines: [[["A fuller "], ["diary.", true]]], time: "2:40pm", what: "with a client", block: "g-bk-wed", x: WEEK.cols.Wed + 4, y: slotY(13) },
  { lines: [[["Less time answering"]], [["messages.", true]]], time: "7:15pm", what: "relaxing", block: "g-bk-fri", x: WEEK.cols.Fri + 4, y: slotY(12) },
  { lines: [[["Bookings after you’ve"]], [["finished for the day.", true]]], time: "11:48pm", what: "asleep", block: "g-bk-sat", x: WEEK.cols.Fri + 4, y: slotY(13.5) },
];

/** Day → evening → night, behind the diary: warm daylight, a low amber evening, a deep blue night. */
function Sky({ t, g, moon }: { t: number; g: GrowthCut; moon: boolean }) {
  const b = g.benefits;
  if (b.length < 3) return null;
  const eve = tween(t, b[1].at - 0.35, 0.9);
  // Dawn just before the offer opens, so night doesn't cut straight to cream.
  const dawn = tween(t, g.offer.at - 0.55, 0.7);
  const night = tween(t, b[2].at - 0.35, 0.9) * (1 - 0.75 * dawn);
  const stars = Array.from({ length: 26 }, (_, i) => {
    const r = (k: number) => {
      const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    return { x: r(1) * 1080, y: r(2) * 1920 * 0.6, s: 2 + r(3) * 3, tw: r(4) };
  });
  return (
    <>
      {/* daylight from the top right */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 88% 6%, rgba(255,226,170,.55) 0%, rgba(255,226,170,0) 42%)", opacity: 1 - eve }} />
      {/* evening */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #E7B48C 0%, #F1CFB0 45%, #F6E3CF 100%)", opacity: eve * (1 - night) * 0.82 }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 18% 12%, rgba(255,190,120,.55) 0%, rgba(255,190,120,0) 45%)", opacity: eve * (1 - night) }} />
      {/* dawn, warm from below */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(255,205,150,.9) 0%, rgba(255,205,150,0) 70%)", opacity: dawn }} />
      {/* night */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #151A2A 0%, #1F2438 55%, #2A2C3E 100%)", opacity: night * 0.96 }} />
      <AbsoluteFill style={{ opacity: night }}>
        {stars.map((st, i) => (
          <div key={i} style={{ position: "absolute", left: st.x, top: st.y, width: st.s, height: st.s, borderRadius: "50%", background: "#FFF6E6", opacity: 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.2 + st.tw * 6.28)) }} />
        ))}
        {moon && <div style={{ position: "absolute", right: 110, top: 150, width: 90, height: 90, borderRadius: "50%", boxShadow: "-22px 10px 0 0 #F3DDB0", transform: "rotate(-20deg)", filter: "drop-shadow(0 0 30px rgba(243,221,176,.5))" }} />}
      </AbsoluteFill>
    </>
  );
}

/**
 * Straight into the diary: the real week view swings in; the confirmed facial flies along a gold
 * connector and lands in Thursday 3pm; "£120 appointment" beside it. Then (main cut) the day passes:
 * each benefit line lands with a booking made at that hour, into the week's free slots, while the
 * facial stays lit as the evidence.
 */
export function Diary({ t }: { t: number }) {
  const F = useF();
  const g = useGrowth();
  const d = g.diary;
  const D = diaryFrame(F);
  const slot = facialSlot(F);
  const enter = settle(t, d.at, 9);
  const night = g.benefits.length === 3 ? tween(t, g.benefits[2].at - 0.35, 0.9) : 0;
  const ink = night > 0 ? `rgb(${[44, 37, 32].map((v, i) => Math.round(mix(v, [246, 235, 221][i], night))).join(",")})` : C.ink;
  const headTop = pick(F, 280, 70);
  const hs = pick(F, 100, 86);
  const firstBenefit = g.benefits.length ? g.benefits[0].at : Infinity;

  // The flight: from where the result burst over the chat, along an arc, into the slot.
  const R = pick(F, 2.6, 2.2);
  const fromW = pieceSize("g-upcoming").w * R;
  const start = { x: (F.W - fromW) / 2, y: pick(F, 600 + 560, 330 + 440) + 70 * R + 30 };
  const fl = tween(t, d.at + 0.35, d.land - d.at - 0.35);
  const arc = (u: number) => {
    const x = mix(start.x, slot.x, u);
    const y = mix(start.y, slot.y, u) - Math.sin(u * Math.PI) * pick(F, 260, 200);
    return { x, y };
  };
  const pos = arc(fl);
  const size = mix(fromW, slot.w, fl);
  const landed = tween(t, d.land - 0.08, 0.2);
  const pulse = t > d.land ? Math.exp(-(t - d.land) * 2.2) : 0;
  const hold = t > d.land ? 0.35 : 0;

  return (
    <AbsoluteFill>
      <Sky t={t} g={g} moon={F.id === "916"} />

      {/* Header: into the diary, then the benefits (main). */}
      <div style={{ position: "absolute", left: 0, right: 0, top: headTop }}>
        {t < firstBenefit + 0.3 && (
          <Slam t={t} at={d.at + 0.15} out={Math.min(firstBenefit - 0.3, d.out)} lines={[[["Booked straight into"]], [["your "], ["diary", true]]]} base={display(hs)} emStyle={em(hs + 6)} size={hs} dot />
        )}
        {g.benefits.map((b, i) => {
          const next = g.benefits[i + 1]?.at ?? d.out;
          const B = BENEFITS[i];
          const isNight = i === 2;
          return (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center" }}>
              {B.lines.map((runs, li) => {
                return (
                  <div key={li} style={{ display: "flex", justifyContent: "center" }}>
                    <Reveal t={t} at={b.at + li * 0.12} out={next - 0.3 + li * 0.04}>
                      <div style={{ ...display(hs), color: isNight ? "#F6EBDD" : ink, whiteSpace: "nowrap", lineHeight: 1.06 }}>
                        {runs.map(([txt, e], ri) => (
                          <span key={ri} style={e ? { ...em(hs + 6), color: isNight ? "#E9C98F" : C.clayDeep } : undefined}>
                            {txt}
                          </span>
                        ))}
                      </div>
                    </Reveal>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {g.benefits.map((b, i) => {
        const next = g.benefits[i + 1]?.at ?? d.out;
        const v = tween(t, next - 0.3, 0.3);
        if (t < b.at || v >= 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: D.top - pick(F, 100, 86), display: "flex", justifyContent: "center", opacity: 1 - v }}>
            <TimeChip t={t} at={b.at + 0.3} time={BENEFITS[i].time} what={BENEFITS[i].what} night={i === 2} size={pick(F, 36, 32)} />
          </div>
        );
      })}

      {/* The real week view. */}
      <div
        style={{
          position: "absolute",
          left: D.left,
          top: D.top,
          opacity: Math.min(1, enter * 1.6),
          transform: `perspective(2000px) translate3d(0, ${(1 - enter) * 260}px, ${(1 - enter) * -900}px) rotateX(${mix(38, 4, enter)}deg)`,
          transformOrigin: "50% 100%",
          filter: enter < 0.97 ? `blur(${(1 - enter) * 14}px)` : undefined,
        }}
      >
        <Float t={t} sway={0.25}>
          <DiaryView k={D.k} from={FROM} to={TO} style={{ boxShadow: `${SHADOW.lift}${night > 0 ? `, 0 0 140px rgba(255,214,160,${0.28 * night})` : ""}` }}>
            {t > d.land - 0.1 && <Block name="g-bk-facial" x={WEEK.cols.Thu} y={slotY(15)} k={D.k} u={landed} glow={Math.max(hold, pulse)} />}
            {g.benefits.map((b, i) => (t > b.drop - 0.05 ? <Block key={i} name={BENEFITS[i].block} x={BENEFITS[i].x - 4} y={BENEFITS[i].y} k={D.k} u={settle(t, b.drop, 12)} glow={t > b.drop ? Math.exp(-(t - b.drop) * 1.6) : 0} /> : null))}
          </DiaryView>
        </Float>
      </div>

      {/* Drop rings where each booking lands. */}
      {[{ at: d.land, x: slot.x, y: slot.y, w: slot.w, h: slot.h }, ...g.benefits.map((b, i) => {
        const p = diaryPoint(D.k, FROM, BENEFITS[i].x, BENEFITS[i].y);
        return { at: b.drop, x: D.left + p.x, y: D.top + p.y, w: 142 * D.k, h: pieceSize(BENEFITS[i].block).h * D.k };
      })].map((r, i) =>
        [0.05, 0.35].map((dd) => {
          const u = Math.min(1, Math.max(0, (t - r.at - dd) / 0.8));
          if (u <= 0 || u >= 1) return null;
          const e = 1 - Math.pow(1 - u, 3);
          return <div key={`${i}-${dd}`} style={{ position: "absolute", left: r.x - e * 40, top: r.y - e * 30, width: r.w + e * 80, height: r.h + e * 60, borderRadius: 14 + e * 20, border: `${3 - 2 * u}px solid ${i === 3 ? "#E9C98F" : C.clay}`, opacity: 0.7 * (1 - u) }} />;
        }),
      )}

      {/* The flight: the confirmed appointment, along a gold connector, into its slot. */}
      {t > d.at && t < d.land + 0.9 && (
        <svg width={F.W} height={F.H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - tween(t, d.land + 0.2, 0.6) }}>
          {(() => {
            // Drawn from the chat towards the slot, a dotted gold line through the centres.
            const drawn = tween(t, d.at + 0.2, d.land - d.at - 0.25);
            const n = Math.max(2, Math.round(40 * drawn));
            const pts = Array.from({ length: n + 1 }, (_, i) => {
              const u = (i / n) * drawn;
              const p = arc(u);
              return `${i ? "L" : "M"} ${p.x + mix(fromW, slot.w, u) / 2} ${p.y + mix(54 * R, slot.h, u) / 2}`;
            });
            return drawn > 0 ? <path d={pts.join(" ")} fill="none" stroke={C.clay} strokeWidth={6} strokeLinecap="round" strokeDasharray="1 18" /> : null;
          })()}
        </svg>
      )}
      {t > d.at + 0.1 && landed < 1 && (
        <div style={{ position: "absolute", left: pos.x, top: pos.y, width: size, opacity: Math.min(1, tween(t, d.at + 0.1, 0.25)) * (1 - landed), transform: `rotate(${Math.sin(fl * Math.PI) * -4}deg)` }}>
          <div style={{ borderRadius: 12 * (size / 263), background: C.paper, boxShadow: SHADOW.lift, outline: `${Math.max(2, 3 * (size / fromW))}px solid rgba(164,127,84,.9)` }}>
            <Piece name="g-upcoming" w={size} />
          </div>
        </div>
      )}

      {/* £120 appointment: the service's value, beside the booking. */}
      {t > d.price - 0.05 && (
        <div
          style={{
            position: "absolute",
            // Above the booking, in Thursday's free early afternoon, centred on the slot.
            left: slot.x + slot.w / 2,
            top: slot.y - pick(F, 104, 96),
            display: "flex",
            alignItems: "center",
            gap: 14,
            height: pick(F, 76, 68),
            padding: `0 ${pick(F, 30, 26)}px`,
            borderRadius: 999,
            background: `linear-gradient(135deg, #B8925A 0%, ${C.clay} 55%, #8C6A43 100%)`,
            color: "#FFFFFF",
            fontFamily: FONT.sans,
            fontWeight: 650,
            fontSize: pick(F, 34, 30),
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            boxShadow: `0 10px 30px -8px rgba(138,106,68,.6), 0 0 ${40 * pulse}px rgba(214,170,100,.7)`,
            overflow: "hidden",
            opacity: Math.min(1, settle(t, d.price, 12) * 2) * (1 - tween(t, d.out, 0.3)),
            transform: `translate(-50%, ${(1 - settle(t, d.price, 12)) * 30}px) scale(${0.85 + 0.15 * settle(t, d.price, 12)})`,
            transformOrigin: "50% 100%",
          }}
        >
          <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, fontSize: pick(F, 40, 36) }}>£120</span> appointment
          <Sweep t={t} at={d.price + 0.3} len={0.8} strength={0.6} />
        </div>
      )}
    </AbsoluteFill>
  );
}
