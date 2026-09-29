import { AbsoluteFill, Img, staticFile } from "remotion";

import { C, FONT } from "../../brand";
import { mix, settle, tween } from "../meet/motion";
import { Piece } from "../meet/Piece";
import { pick, useF } from "../meta/format";
import { Block, type Msg, Widget, WIDGET_W } from "../meta/parts";
import { display, em, eyebrow, RED } from "../meta/type";
import { Ghost, type GhostPose, PocketWatch } from "./art/Ghost";
import { Client, Maya, type MayaPose } from "./art/People";
import { Desk, GOLD, Ledger, Phone, Pumpkin, Room, Stamp, TreatmentGlass } from "./art/Set";
import { camAt, ChannelIcon, EnquiryCard, type Key, Stage, Title } from "./parts";

/**
 * The shots of "The Booking Thief". Each takes `u`, seconds into the shot. They are laid
 * out as a 3D production would shoot them (same desk composition, same lens for the two
 * reaches), so rendered 3D clips can replace the illustrated ones shot for shot.
 */

// ---------------------------------------------------------------- the desk
// Stage positions (1080 x 1920): the ghost stands behind the desk on the right; the phone
// and its floating card are on the left; the ledger lies between them.
const GHOST = { x: 600, y: 560, w: 440 };
const CARD = { x: 70, y: 700, w: 520 };
const LEDGER = { x: 360, y: 1068, w: 330 };

export type DeskScript = {
  cam: Key[];
  /** The waiting enquiry: who, text, when it rises, when the ghost pinches it, when it's filed. */
  card?: { who: string; channel: string; icon: "m-ch-ig" | "m-ch-web"; text: string; rise: number; status: (u: number) => string; pinch?: number; file?: number; missAt?: number };
  /** Vallamo's reply arrives beside it (the miss). */
  reply?: { at: number; text: string };
  ghost: (u: number) => GhostPose;
  ledger?: { slide?: number; open?: number; stamp?: number; close?: number };
  glass?: { client?: number; maya?: number };
  warm?: number;
  retreat?: number; // the ghost floats away
};

export function DeskShot({ u, s }: { u: number; s: DeskScript }) {
  const cam = camAt(s.cam, u);
  const card = s.card;
  const rise = card ? settle(u, card.rise, 11) : 0;
  const pinched = card?.pinch !== undefined ? tween(u, card.pinch, 0.25) : 0;
  const filed = card?.file !== undefined ? tween(u, card.file, 0.45) : 0;
  const L = s.ledger ?? {};
  const slide = L.slide !== undefined ? settle(u, L.slide, 10) : 1;
  const open = (L.open !== undefined ? tween(u, L.open, 0.5) : 0) * (1 - (L.close !== undefined ? tween(u, L.close, 0.6) : 0));
  const stamp = L.stamp !== undefined ? tween(u, L.stamp, 0.12) : 0;
  const retreat = s.retreat !== undefined ? tween(u, s.retreat, 1.2) : 0;
  const pose = s.ghost(u);
  // The card, pinched, travels into the ledger's right page and fades into the paper.
  const into = { x: LEDGER.x + LEDGER.w * 0.62, y: LEDGER.y - 30 };
  const cx = mix(CARD.x, into.x - CARD.w * 0.1, filed);
  const cy = mix(CARD.y - (1 - rise) * -120, into.y, filed);
  return (
    <Stage cam={cam}>
      <Room t={u} warm={s.warm ?? 0} />
      <TreatmentGlass t={u} maya={s.glass?.maya ?? 1} client={s.glass?.client ?? 1} />
      <div style={{ position: "absolute", left: GHOST.x + retreat * 380, top: GHOST.y - 12 * Math.sin(u * 1.3) - retreat * 120, width: GHOST.w, opacity: 1 - retreat }}>
        <Ghost pose={{ ...pose, t: u, fade: retreat * 0.6 }} style={{ width: GHOST.w }} />
      </div>
      <Desk y={1180}>
        <Pumpkin size={104} style={{ position: "absolute", left: 60, top: -84 }} />
        <div style={{ position: "absolute", left: 190, top: -150 }}>
          <Phone glow={card ? 0.4 + 0.6 * rise * (1 - filed) : 0.3} style={{ width: 120, height: 232 }} />
        </div>
        <div style={{ position: "absolute", left: LEDGER.x + (1 - slide) * 520, top: -118, transform: `rotate(${-3 + (1 - slide) * 8}deg)` }}>
          <Ledger
            open={open}
            w={LEDGER.w}
            stamp={stamp}
            page={
              <div style={{ position: "absolute", left: 16, right: 12, top: 18, fontFamily: "Georgia, serif", fontSize: 15, letterSpacing: "0.14em", color: "#6E4228", fontWeight: 700 }}>
                BOOKED ELSEWHERE
                <div style={{ marginTop: 10, height: 34, borderRadius: 6, background: `rgba(244,238,228,${filed})`, border: `1px solid rgba(110,66,40,${0.3 * filed})` }} />
              </div>
            }
          />
        </div>
        {L.stamp !== undefined && (
          <div style={{ position: "absolute", left: LEDGER.x + LEDGER.w * 0.66, top: -200 + (u > L.stamp - 0.35 && u < L.stamp + 0.3 ? Math.sin(Math.PI * Math.min(1, Math.max(0, (u - L.stamp + 0.35) / 0.65))) * -60 : 0), opacity: u > L.stamp - 1.2 ? 1 : 0 }}>
            <Stamp size={64} />
          </div>
        )}
      </Desk>
      {/* The waiting enquiry, floating above the phone. */}
      {card && rise > 0.01 && filed < 1 && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            opacity: Math.min(1, rise * 1.5) * (1 - filed),
            transform: `scale(${(0.9 + 0.1 * rise) * (1 - 0.72 * filed) * (1 + 0.04 * pinched * (1 - filed))}) rotate(${filed * 6}deg)`,
            transformOrigin: "85% 50%",
            filter: rise < 0.97 ? `blur(${(1 - rise) * 10}px)` : undefined,
          }}
        >
          <EnquiryCard who={card.who} channel={card.channel} icon={card.icon} text={card.text} status={card.status(u)} w={CARD.w} />
        </div>
      )}
      {/* Vallamo answers first: the reply lands under the enquiry, gold-edged. */}
      {s.reply && u > s.reply.at - 0.05 && (
        <div style={{ position: "absolute", left: CARD.x + 70, top: CARD.y + 250, opacity: tween(u, s.reply.at, 0.2), transform: `translateY(${(1 - settle(u, s.reply.at, 14)) * 30}px)` }}>
          <div style={{ width: CARD.w - 40, boxSizing: "border-box", padding: "18px 24px", borderRadius: 22, background: "#FFFCF6", border: `3px solid ${GOLD}`, boxShadow: `0 16px 40px -14px rgba(40,30,20,.45), 0 0 40px rgba(214,170,90,.45)`, fontFamily: FONT.sans }}>
            <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8E6C3E" }}>Isla · Vallamo</div>
            <div style={{ fontSize: 28, lineHeight: 1.3, color: C.ink, marginTop: 6 }}>{s.reply.text}</div>
          </div>
        </div>
      )}
    </Stage>
  );
}

// ---------------------------------------------------------------- the treatment room
export function TreatmentShot({ u, maya, client = "nina", nod, ghostWatch = true }: { u: number; maya: (u: number) => MayaPose; client?: "nina" | "next"; nod?: number; ghostWatch?: boolean }) {
  const F = useF();
  const cam = { x: 600, y: pick(F, 1060, 1080), zoom: pick(F, 1.22, 1.3) + 0.025 * u };
  return (
    <Stage cam={cam}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #E8D8C2 0%, #F0E3D1 55%, #D9C3A6 100%)" }} />
      <div style={{ position: "absolute", left: 640, top: 380, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,226,170,.9) 0%, rgba(255,226,170,0) 70%)" }} />
      {/* The doorway to reception: the ghost waits there, checking his watch. */}
      <div style={{ position: "absolute", left: 60, top: 520, width: 300, height: 760, background: "linear-gradient(180deg, #C9B292, #B89E7C)", borderRadius: 8, border: `8px solid ${GOLD}` }}>
        {ghostWatch && (
          <div style={{ position: "absolute", left: 40, top: 110, width: 210, filter: "blur(1.2px)" }}>
            <Ghost pose={{ t: u, smile: 0.5, tilt: -8, brow: 0.2, arm: { shoulder: 30, elbow: -128, hand: "watch" } }} style={{ width: 210 }} />
            <div style={{ position: "absolute", left: 104, top: 262 }}>
              <PocketWatch size={36} open={1} hands={u * 40} />
            </div>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 250, top: 1000, width: 820 }}>
        <Client t={u} nod={nod ?? 0} hair={client === "nina" ? "#3B2A22" : "#C9A05E"} skin={client === "nina" ? "#D9A987" : "#EBC3A4"} style={{ width: 820 }} />
      </div>
      <div style={{ position: "absolute", left: 360, top: 560, width: 380 }}>
        <Maya pose={maya(u)} t={u} style={{ width: 380 }} />
      </div>
    </Stage>
  );
}

// ---------------------------------------------------------------- the pocket watch
export function WatchShot({ u, len, minutes = 10 }: { u: number; len: number; minutes?: number }) {
  const F = useF();
  const run = tween(u, 0.25, len - 0.8);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #5B4A3E 0%, #2A211C 70%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: "46%", transform: `translate(-50%, -50%) scale(${1 + 0.06 * (u / len)}) rotate(${-6 + 4 * (u / len)}deg)` }}>
        <svg width={420} height={520} viewBox="0 0 420 520" style={{ position: "absolute", left: 0, top: -440, overflow: "visible" }}>
          <path d="M210 520 C200 420 250 330 230 230 C214 150 250 60 238 -40" fill="none" stroke="#D9BE88" strokeWidth={5} strokeDasharray="10 5" strokeLinecap="round" />
        </svg>
        <PocketWatch size={420} open={1} hands={run * minutes + 0.001} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 300, 110), textAlign: "center", opacity: tween(u, 0.5, 0.3) }}>
        <div style={{ ...display(pick(F, 120, 104)), color: "#FBF4E8" }}>
          <span style={{ fontVariantNumeric: "lining-nums tabular-nums" }}>{Math.min(minutes, Math.floor(run * minutes + 0.001))}</span> minutes
        </div>
        <div style={{ ...em(pick(F, 64, 58)), color: "#E3C28C" }}>without a reply</div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- Lucy's message, front-on
export function MessageShot({ u }: { u: number }) {
  const F = useF();
  const a = settle(u, 0.1, 12);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(18px)", transform: "scale(1.1)" }}>
        <Room t={u} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(30,24,40,.25)" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: pick(F, 620, 420), opacity: Math.min(1, a * 1.6), transform: `translateY(${(1 - a) * 80}px) scale(${0.94 + 0.06 * a})`, filter: a < 0.97 ? `blur(${(1 - a) * 12}px)` : undefined }}>
        <div style={{ background: "#FFFDF9", borderRadius: 40, padding: 44, boxShadow: "0 40px 90px -30px rgba(20,10,5,.6)", fontFamily: FONT.sans }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <ChannelIcon card="m-ch-ig" size={72} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 40, color: C.ink, letterSpacing: "-0.02em" }}>Lucy</div>
              <div style={{ fontWeight: 500, fontSize: 28, color: C.ink3 }}>From your Instagram ad</div>
            </div>
          </div>
          <div style={{ marginTop: 28, background: "#F4EEE4", borderRadius: 30, borderBottomLeftRadius: 10, padding: "26px 32px", fontSize: 50, lineHeight: 1.25, color: C.ink, fontWeight: 600 }}>Thanks, I’ve booked with another clinic.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- £120 booking lost
export function LostOverlay({ u, len }: { u: number; len: number }) {
  const F = useF();
  const a = tween(u, 0, 0.12);
  const o = tween(u, len - 0.2, 0.2);
  const DEEP = "#A8261B";
  return (
    <AbsoluteFill style={{ background: `rgba(250,244,236,${0.86 * a * (1 - o)})`, opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 560, 330), display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width={260} height={260} viewBox="0 0 100 100" style={{ transform: `scale(${1 + 0.35 * (1 - settle(u, 0, 16))})` }}>
          {[["M18 18L82 82", 0], ["M82 18L18 82", 0.06]].map(([d, dl]) => (
            <path key={d as string} d={d as string} stroke={DEEP} strokeWidth={15} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tween(u, dl as number, 0.08)} />
          ))}
        </svg>
        <div style={{ ...display(pick(F, 200, 180)), color: DEEP, lineHeight: 0.95, opacity: tween(u, 0.08, 0.12) }}>£120</div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: pick(F, 60, 54), letterSpacing: "0.08em", color: DEEP, marginTop: 14, opacity: tween(u, 0.16, 0.12) }}>BOOKING LOST</div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- Maya decides
export function DecideShot({ u, look, bow, turn }: { u: number; look: number; bow: number; turn: number }) {
  const F = useF();
  const cam = { x: 560, y: pick(F, 960, 940), zoom: pick(F, 1.3, 1.36) + 0.03 * (u / 5) };
  const b = tween(u, bow, 0.5) * (1 - tween(u, bow + 1.1, 0.5));
  const lk = tween(u, look, 0.4);
  const ty = tween(u, turn, 0.5);
  const pose: MayaPose = { arms: ty > 0.5 ? "type" : "phone", look: lk * (1 - ty), exhale: tween(u, 0.3, 0.6) * (1 - tween(u, 1.5, 0.5)), mouth: u > turn - 0.9 && u < turn - 0.2 ? 0.5 + 0.5 * Math.sin(u * 22) : 0 };
  return (
    <Stage cam={cam}>
      <Room t={u} />
      <TreatmentGlass t={u} maya={0} client={0} />
      <div style={{ position: "absolute", left: 660, top: 600, width: 400 }}>
        <Ghost pose={{ t: u, smile: 0.7, lean: 14 * b, tilt: 10 * b, brow: 0.3 }} style={{ width: 400 }} />
      </div>
      <div style={{ position: "absolute", left: 150, top: 470, width: 470, transform: `scaleX(${ty > 0.5 ? -1 : 1})`, transformOrigin: "50% 50%" }}>
        <Maya pose={pose} t={u} style={{ width: 470 }} />
      </div>
      <Desk y={1180}>
        <Pumpkin size={104} style={{ position: "absolute", left: 900, top: -84 }} />
        <Laptop open={tween(u, turn, 0.6)} x={120} />
      </Desk>
    </Stage>
  );
}

function Laptop({ open, x }: { open: number; x: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: -250, width: 420, height: 280, perspective: 900 }}>
      <div style={{ position: "absolute", left: 20, top: 0, width: 380, height: 240, borderRadius: 14, background: "#2B2826", transformOrigin: "50% 100%", transform: `rotateX(${(1 - open) * 88}deg)`, padding: 10, boxSizing: "border-box" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 6, background: `linear-gradient(135deg, rgba(250,232,214,${open}), rgba(236,226,214,${open}))` }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 238, width: 420, height: 22, borderRadius: "0 0 14px 14px", background: "linear-gradient(180deg, #CFC8BF, #A9A198)" }} />
    </div>
  );
}

// ---------------------------------------------------------------- the laptop: the real setup
const SCREENS = ["pricing", "scan", "review", "booking", "live"] as const;
export function LaptopShot({ u, len, offer = true, later = true }: { u: number; len: number; offer?: boolean; later?: boolean }) {
  const F = useF();
  const per = (len - (later ? 1.1 : 0.3)) / SCREENS.length;
  const idx = Math.min(SCREENS.length - 1, Math.floor(u / per));
  const local = u - idx * per;
  const sweep = tween(u, len - (later ? 1.9 : 1.1), 0.9);
  const lt = later ? tween(u, len - 1.0, 0.25) : 0;
  const scrW = 960;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(16px)", transform: "scale(1.1)" }}>
        <Room t={u} warm={sweep} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: (F.W - scrW) / 2 - 20, top: pick(F, 560, 300), width: scrW + 40, perspective: 2200 }}>
        <div style={{ transform: `rotateX(${6 - 4 * (u / len)}deg) rotateY(${-6 + 8 * (u / len)}deg)`, borderRadius: 28, background: "#2B2826", padding: 20, boxShadow: "0 50px 100px -40px rgba(20,10,5,.7)" }}>
          <div style={{ position: "relative", width: scrW, height: scrW * (1000 / 1440), borderRadius: 10, overflow: "hidden", background: "#FFF" }}>
            {SCREENS.map((name, i) => {
              const a = i === idx ? tween(local, 0, 0.18) : i === idx - 1 ? 1 : 0;
              if (i > idx || i < idx - 1) return null;
              return <Img key={name} src={staticFile(`ui/halloween/${name}.png`)} style={{ position: "absolute", inset: 0, width: "100%", opacity: i === idx ? a : 1, transform: `scale(${i === idx ? 1.02 - 0.02 * a : 1})` }} />;
            })}
            {/* Vallamo's arrival: a warm gold light travels across the screen and the desk. */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, transparent 30%, rgba(255,215,140,.55) 50%, transparent 70%)", backgroundSize: "300% 100%", backgroundPosition: `${mix(110, -20, sweep)}% 0`, opacity: sweep > 0 && sweep < 1 ? 1 : 0 }} />
          </div>
        </div>
        {offer && idx === 0 && (
          <div style={{ position: "absolute", right: 60, top: -46, padding: "14px 26px", borderRadius: 999, background: C.ink, color: "#FFF", fontFamily: FONT.sans, fontWeight: 700, fontSize: 30, boxShadow: "0 16px 40px -14px rgba(20,10,5,.6)", opacity: tween(local, 0.3, 0.25), transform: `rotate(-3deg) scale(${0.9 + 0.1 * settle(local, 0.3, 14)})` }}>
            Halloween offer · <span style={{ color: "#E3C28C" }}>£0 setup</span>
          </div>
        )}
      </div>
      {later && lt > 0 && (
        <AbsoluteFill style={{ background: `rgba(30,24,20,${0.7 * lt})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", opacity: lt, transform: `scale(${1.1 - 0.1 * lt})` }}>
            <div style={{ ...eyebrow(30), color: "#E3C28C" }}>Later</div>
            <div style={{ ...display(96), color: "#FBF4E8", marginTop: 10 }}>
              Setup <span style={{ ...em(100), color: "#E3C28C" }}>complete.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- Jess, answered: the real website chat
export function ChatShot({ u, msgs, head = true }: { u: number; msgs: Msg[]; head?: boolean }) {
  const F = useF();
  const k = F.ui;
  const wx = (F.W - WIDGET_W * k) / 2;
  const enter = settle(u, 0.05, 10);
  return (
    <AbsoluteFill style={{ overflow: "hidden", perspective: 1800 }}>
      <AbsoluteFill style={{ filter: "blur(18px)", transform: "scale(1.1)" }}>
        <Room t={u} warm={0.6} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(255,250,242,.35)" }} />
      {head && (
        <div style={{ position: "absolute", left: 0, right: 0, top: F.top, textAlign: "center", ...display(pick(F, 92, 84)), lineHeight: 1.04, whiteSpace: "nowrap", opacity: tween(u, 0.1, 0.25) }}>
          Vallamo{" "}
          <span style={{ display: "inline-block", marginLeft: "0.1em", transform: `scale(${1 + 0.15 * (1 - settle(u, 0.2, 14))})` }}>
            <Block u={tween(u, 0.2, 0.26)}>ALWAYS</Block>
          </span>
          <br />
          replies <span style={em(pick(F, 98, 90))}>instantly.</span>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 18, opacity: tween(u, 0.6, 0.3) }}>
            {([["m-ch-web", "Website"], ["m-ch-wa", "WhatsApp"], ["m-ch-ig", "Instagram"]] as const).map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, height: 58, padding: "0 22px 0 12px", borderRadius: 29, background: "#FFFDF9", boxShadow: "0 10px 30px -12px rgba(40,30,20,.35)", fontFamily: FONT.sans, fontWeight: 650, fontSize: 26, color: C.ink }}>
                <ChannelIcon card={c} size={36} />
                {l}
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: wx, top: pick(F, 640, 400), opacity: Math.min(1, enter * 1.5), transform: `translate3d(0, ${(1 - enter) * 200}px, ${(1 - enter) * -600}px) rotateY(${(1 - enter) * -24}deg)` }}>
        <Widget t={u} msgs={msgs} body={250} style={{ transform: `scale(${k})`, transformOrigin: "0 0", boxShadow: "0 1px 2px rgb(44 37 32 / .06), 0 8px 20px -6px rgb(44 37 32 / .12), 0 40px 90px -24px rgb(44 37 32 / .30)" }} />
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- the booking, in Maya's diary
// Thursday's column and the 3pm row in the real week view (css px of the 1114 px piece).
const THU_3PM = { x: 514, y: 511, w: 142, h: 29 };
export function CalendarShot({ u }: { u: number }) {
  const F = useF();
  const W = 1114;
  const k = 0.92;
  const land = settle(u, 0.9, 9);
  const confirm = settle(u, 0.1, 12);
  const left = (F.W - W * k) / 2;
  const top = pick(F, 720, 470);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "linear-gradient(180deg, #F7EFE3, #EFE3D2)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: F.top, display: "flex", justifyContent: "center", opacity: Math.min(1, confirm * 1.5), transform: `translateY(${(1 - confirm) * -30}px)` }}>
        <div style={{ padding: "22px 34px", borderRadius: 26, background: "#FFFCF6", border: `3px solid ${GOLD}`, boxShadow: "0 0 50px rgba(214,170,90,.45), 0 20px 50px -20px rgba(40,30,20,.4)", fontFamily: FONT.sans, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8E6C3E" }}>Jess · Appointment confirmed</div>
          <div style={{ ...display(66), marginTop: 4 }}>
            Thursday · <span style={em(70)}>3pm</span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left, top, width: W * k, perspective: 2000 }}>
        <div style={{ transform: `rotateX(${14 - 6 * tween(u, 0, 4)}deg)`, transformOrigin: "50% 0" }}>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 90px -30px rgba(40,30,20,.45)" }}>
            <Piece name="week" w={W * k} />
          </div>
          {/* The gold-edged appointment settles into Thursday at 3pm. */}
          <div
            style={{
              position: "absolute",
              left: mix(THU_3PM.x * k - 180, THU_3PM.x * k, land),
              top: mix(THU_3PM.y * k - 420, THU_3PM.y * k, land),
              width: mix(420, THU_3PM.w * k, land),
              height: mix(120, THU_3PM.h * k + 4, land),
              borderRadius: mix(20, 6, land),
              background: "#FFF8EA",
              border: `${mix(4, 2.5, land)}px solid ${GOLD}`,
              boxShadow: `0 0 ${mix(50, 18, land)}px rgba(214,170,90,.7)`,
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: mix(34, 12, land),
              color: C.ink,
              display: "flex",
              alignItems: "center",
              paddingLeft: mix(24, 6, land),
              boxSizing: "border-box",
              opacity: tween(u, 0.5, 0.2),
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Jess · Facial · 3pm
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- the offer
export function OfferShot({ u, len }: { u: number; len: number }) {
  const F = useF();
  const s = F.type;
  const bg = tween(u, 0.2, 0.9);
  const at = (d: number) => ({ opacity: tween(u, d, 0.3), transform: `translateY(${(1 - tween(u, d, 0.3)) * 24}px)`, filter: tween(u, d, 0.3) < 1 ? `blur(${(1 - tween(u, d, 0.3)) * 10}px)` : undefined });
  const strike = tween(u, 1.6, 0.25);
  const zero = settle(u, 1.9, 14);
  void len;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `blur(${6 + 20 * bg}px)`, transform: "scale(1.08)", opacity: 1 - 0.7 * bg }}>
        <Room t={u} warm={1} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, rgba(255,250,240,${0.6 + 0.35 * bg}) 0%, rgba(246,234,214,${0.7 + 0.3 * bg}) 100%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 240, 70), textAlign: "center" }}>
        <div style={{ ...eyebrow(30 * s), ...at(0.3) }}>Halloween launch offer</div>
        <div style={{ ...display(pick(F, 76, 66)), marginTop: 18, ...at(0.5) }}>
          First 30 new <span style={em(pick(F, 80, 70))}>paying clinics</span>
        </div>
        <div style={{ ...at(1.0), marginTop: pick(F, 40, 24), display: "flex", justifyContent: "center", alignItems: "baseline", gap: 30 }}>
          <span style={{ position: "relative", ...display(pick(F, 110, 96)), color: C.ink3 }}>
            £399
            <span style={{ position: "absolute", left: "-6%", right: "-6%", top: "52%", height: 8, borderRadius: 4, background: RED, transform: `rotate(-8deg) scaleX(${strike})`, transformOrigin: "0 50%" }} />
          </span>
          <span style={{ ...display(pick(F, 230, 200)), color: C.clay, lineHeight: 1, display: "inline-block", transform: `scale(${0.6 + 0.4 * zero})`, opacity: Math.min(1, zero * 2) }}>£0</span>
        </div>
        <div style={{ ...display(pick(F, 56, 50)), marginTop: -6, ...at(2.2) }}>
          setup · <span style={em(pick(F, 58, 52))}>save £399 on Growth setup</span>
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 650, fontSize: 36 * s, color: C.ink2, marginTop: 18, ...at(2.5) }}>Growth £399/month</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: pick(F, 50, 32), ...at(2.9) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, height: 124 * s, padding: `0 ${22 * s}px 0 ${52 * s}px`, borderRadius: 999, background: C.ink, color: "#FFF", fontFamily: FONT.sans, fontWeight: 700, fontSize: 44 * s, letterSpacing: "0.02em", boxShadow: "0 26px 60px -20px rgba(44,37,32,.6)" }}>
            GET STARTED ONLINE
            <div style={{ width: 86 * s, height: 86 * s, borderRadius: "50%", background: C.clay, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={40 * s} height={40 * s} viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ ...display(pick(F, 72, 62)), marginTop: pick(F, 34, 20), ...at(3.2) }}>vallamo.com</div>
        <div style={{ fontFamily: FONT.sans, fontSize: 24 * s, color: C.ink3, marginTop: 14, ...at(3.4) }}>New monthly subscriptions. Setup fee waived; monthly subscription applies.</div>
        <div style={{ ...em(pick(F, 44, 40)), color: C.clayDeep, marginTop: pick(F, 40, 22), ...at(4.0) }}>Keep the bookings. Lose the ghost.</div>
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- the opening headline
export function OpeningTitle({ u, to }: { u: number; to: number }) {
  const F = useF();
  const o = tween(u, to, 0.3);
  return (
    <>
    {/* Dusk falls over the top of the frame so the headline reads. */}
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(22,18,32,.78) 0%, rgba(22,18,32,.55) ${pick(F, 34, 42)}%, rgba(22,18,32,0) ${pick(F, 52, 64)}%)`, opacity: 1 - o }} />
    <Title u={u} at={-1} to={to} top={F.top}>
      <div style={{ ...eyebrow(28), color: "#F3DDB8", textShadow: "0 2px 12px rgba(0,0,0,.35)" }}>Clinic owners</div>
      <div style={{ ...display(pick(F, 118, 106)), color: "#FFFDF9", textShadow: "0 4px 30px rgba(20,15,30,.45)", marginTop: 8, lineHeight: 1.02 }}>
        Your ads.
        <br />
        <span style={{ ...em(pick(F, 126, 114)), color: "#F0CF96" }}>Their booking.</span>
      </div>
    </Title>
    </>
  );
}

