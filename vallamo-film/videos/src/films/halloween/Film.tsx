import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { tween } from "../meet/motion";
import { FORMATS, FormatCtx, type Format, pick, useF } from "../meta/format";
import type { Msg } from "../meta/parts";
import { display, em, eyebrow } from "../meta/type";
import { TreatmentGlass } from "./art/Set";
import { Fog, Night, Shade } from "./art/Spectre";
import { AlwaysLine, BookedShot, ClockShot, DarkShot, DawnShot, type Enquiry, FarewellShot, Headline, Line, LostShot, OfferCard } from "./Horror";
import { ChatShot } from "./Shots";

/**
 * "The Booking Thief": the Halloween film (VALLAMO_HALLOWEEN_SELF_SERVE_AD_BRIEF.md), made
 * as a cinematic horror ad. Three cuts share the shots: 35 s (the paid ad), 15 s and the
 * longer story (~65 s). The dark half is scored with a low drone; when Vallamo's light
 * arrives the warm music takes over.
 */
export type HalloweenCut = "70" | "35" | "15";
type Spoken = { at: number; to: number; who: string | null; text: string };
type Shot = { len: number; render: (u: number) => ReactNode; lines?: Spoken[]; sfx?: { at: number; file: string; volume: number }[]; warm?: boolean };

const LUCY: Enquiry = { who: "Lucy", channel: "From your Instagram ad", icon: "m-ch-ig", text: "Can I book the £120 facial this week?" };
const JESS: Enquiry = { who: "Jess", channel: "Website chat · new enquiry", icon: "m-ch-web", text: "I’d like the £120 facial. Anything Thursday?" };
const ISLA = "Thursday at 3pm is available. Would you like that?";
const BOOKED_ELSEWHERE = "Thanks, I’ve booked with another clinic.";

function Opening({ u, to }: { u: number; to: number }) {
  const F = useF();
  return (
    <Headline u={u} at={-1} to={to}>
      <div style={{ ...eyebrow(28), color: "#D9B774" }}>Clinic owners</div>
      <div style={{ ...display(pick(F, 130, 116)), color: "#F6EEE3", lineHeight: 1.0, marginTop: 10 }}>
        Your ads.
        <br />
        <span style={{ ...em(pick(F, 138, 124)), color: "#E0453A" }}>Their booking.</span>
      </div>
    </Headline>
  );
}
function WithClient({ u, at, to }: { u: number; at: number; to: number }) {
  const F = useF();
  return (
    <Headline u={u} at={at} to={to}>
      <div style={{ ...display(pick(F, 104, 94)), color: "#F6EEE3" }}>
        You’re with a <span style={{ ...em(pick(F, 110, 100)), color: "#D9B774" }}>client.</span>
      </div>
    </Headline>
  );
}
const waiting = (from: number, to: number) => (u: number) => (u < from ? "Awaiting reply" : `No reply · ${Math.min(10, Math.max(1, Math.ceil(((u - from) / (to - from)) * 10)))} min`);

/** Maya, behind the glass, decides; the shade gives his little bow. */
function DecideShot({ u }: { u: number }) {
  const F = useF();
  return (
    <AbsoluteFill>
      <Night t={u}>
        <TreatmentGlass t={u} x={(F.W - 620) / 2} y={pick(F, 520, 300)} w={620} h={760} client={0} style={{ boxShadow: "0 0 160px rgba(255,200,130,.4)", filter: "brightness(.9)" }} />
        <div style={{ position: "absolute", left: -80, top: pick(F, 260, 60), width: 520, filter: "blur(1px)" }}>
          <Shade t={u} reveal={1} eyes={1} recoil={-0.15 * (tween(u, 0.6, 0.4) - tween(u, 1.6, 0.4))} style={{ width: "100%" }} />
        </div>
        <Fog t={u} density={0.5} />
      </Night>
    </AbsoluteFill>
  );
}

const JESS_CHAT: Msg[] = [
  { name: "h-u1", at: 0.4 },
  { name: "h-i1", at: 0.75 },
  { name: "h-u2", at: 2.0 },
  { name: "p-idet", at: 2.6 },
  { name: "h-u3", at: 3.2 },
  { name: "m-dots", at: 3.6, out: 3.9 },
  { name: "h-i2", at: 3.9 },
];

const CUTS: Record<HalloweenCut, Shot[]> = {
  "35": [
    {
      len: 5.6,
      render: (u) => (
        <DarkShot u={u} len={5.6} s={{ e: LUCY, status: waiting(3.2, 5.6), cardIn: 0.25, shade: { in: 0.5, eyes: 1.5, near: [2.8, 5.6] }, glass: true, push: 0.08 }}>
          <Opening u={u} to={3.0} />
          <WithClient u={u} at={3.2} to={5.4} />
        </DarkShot>
      ),
      lines: [{ at: 3.5, to: 5.5, who: "Mr Elsewhere", text: "Take your time. I’ll take the booking." }],
      sfx: [{ at: 0.25, file: "chime", volume: 0.18 }],
    },
    { len: 1.4, render: (u) => <ClockShot u={u} len={1.4} />, sfx: Array.from({ length: 5 }, (_, i) => ({ at: 0.1 + i * 0.25, file: "click", volume: 0.14 })) },
    {
      len: 2.6,
      render: (u) => (
        <DarkShot u={u} len={2.6} s={{ e: { ...LUCY, reply: { at: 0.1, text: BOOKED_ELSEWHERE } }, status: (v) => (v > 0.35 ? "Booked with another clinic" : "No reply · 10 min"), cardIn: -1, shade: { in: -1, eyes: -1, near: [-2, -1] }, hand: { in: 0.45, pinch: 1.0, stamp: 1.2, drag: 1.65 } }} />
      ),
      lines: [{ at: 0.2, to: 2.5, who: null, text: "Your enquiry. Another clinic’s booking." }],
      sfx: [
        { at: 0.1, file: "click", volume: 0.22 },
        { at: 0.45, file: "whoosh", volume: 0.2 },
        { at: 1.2, file: "thud", volume: 0.45 },
        { at: 1.65, file: "whoosh", volume: 0.2 },
      ],
    },
    { len: 1.2, render: (u) => <LostShot u={u} />, sfx: [{ at: 0, file: "buzzer", volume: 0.32 }] },
    { len: 3.7, warm: true, render: (u) => <DawnShot u={u} len={3.7} screens={3} />, lines: [{ at: 0.4, to: 3.5, who: null, text: "Meet Vallamo, your all-in-one front desk." }], sfx: [{ at: 0, file: "whoosh", volume: 0.24 }] },
    {
      len: 5.0,
      render: (u) => (
        <DarkShot u={u} len={5} s={{ e: JESS, status: (v) => (v > 1.35 ? "Answered instantly" : "New enquiry"), cardIn: 0.15, shade: { in: 0.1, eyes: 0.3, near: [-2, -1], recoil: 1.6 }, hand: { in: 0.8, miss: 1.5, gone: 2.0 }, vallamo: { at: 1.3, text: ISLA }, light: [1.3, 2.6] }}>
          <AlwaysLine u={u} at={2.3} to={4.8} />
        </DarkShot>
      ),
      lines: [{ at: 2.3, to: 4.7, who: null, text: "Vallamo always replies instantly." }],
      sfx: [
        { at: 0.15, file: "chime", volume: 0.16 },
        { at: 0.8, file: "whoosh", volume: 0.18 },
        { at: 1.3, file: "chime", volume: 0.3 },
      ],
    },
    { len: 2.3, warm: true, render: (u) => <BookedShot u={u} />, sfx: [{ at: 0.5, file: "thud", volume: 0.18 }] },
    { len: 1.8, render: (u) => <FarewellShot u={u} len={1.8} />, lines: [{ at: 0.1, to: 1.7, who: "Mr Elsewhere", text: "Oh. Somebody’s answering." }] },
    { len: 11.4, warm: true, render: (u) => <OfferCard u={u} />, sfx: [{ at: 1.65, file: "thud", volume: 0.22 }] },
  ],
  "15": [
    {
      len: 3.4,
      render: (u) => (
        <DarkShot u={u} len={3.4} s={{ e: { ...LUCY, reply: { at: -1, text: BOOKED_ELSEWHERE } }, status: () => "Booked with another clinic", cardIn: -1, shade: { in: -1, eyes: -1, near: [-2, -1] }, hand: { in: 0.6, pinch: 1.1, stamp: 1.35, drag: 1.9 } }}>
          <Opening u={u} to={3.1} />
        </DarkShot>
      ),
      lines: [{ at: 1.2, to: 3.1, who: "Mr Elsewhere", text: "Another one." }],
      sfx: [
        { at: 0.6, file: "whoosh", volume: 0.2 },
        { at: 1.35, file: "thud", volume: 0.45 },
      ],
    },
    { len: 1.0, render: (u) => <LostShot u={u} />, sfx: [{ at: 0, file: "buzzer", volume: 0.32 }] },
    {
      len: 4.2,
      render: (u) => (
        <DarkShot u={u} len={4.2} s={{ e: JESS, status: (v) => (v > 1.0 ? "Answered instantly" : "New enquiry"), cardIn: 0.1, shade: { in: -1, eyes: -1, near: [-2, -1], recoil: 1.2 }, hand: { in: 0.5, miss: 1.15, gone: 1.6 }, vallamo: { at: 0.95, text: ISLA }, light: [0.95, 2.0] }}>
          <AlwaysLine u={u} at={1.5} to={4.0} />
        </DarkShot>
      ),
      lines: [{ at: 1.5, to: 4.0, who: null, text: "Vallamo always replies instantly." }],
      sfx: [{ at: 0.95, file: "chime", volume: 0.3 }],
    },
    { len: 1.2, warm: true, render: (u) => <BookedShot u={u + 0.3} /> },
    { len: 5.4, warm: true, render: (u) => <OfferCard u={u + 0.2} />, lines: [{ at: 0.6, to: 4.8, who: null, text: "First thirty clinics: setup fee waived. Get started online." }] },
  ],
  "70": [
    {
      len: 8,
      render: (u) => (
        <DarkShot u={u} len={8} s={{ e: LUCY, status: waiting(4.2, 8.5), cardIn: 0.3, shade: { in: 0.8, eyes: 1.8, near: [4.5, 8] }, glass: true, push: 0.1 }}>
          <Opening u={u} to={3.8} />
          <WithClient u={u} at={4.0} to={7.8} />
        </DarkShot>
      ),
      lines: [
        { at: 2.2, to: 3.8, who: "Mr Elsewhere", text: "Busy, are we?" },
        { at: 4.2, to: 7.8, who: null, text: "Meet Maya. Her ads are working. She’s with a client." },
      ],
      sfx: [{ at: 0.3, file: "chime", volume: 0.18 }],
    },
    { len: 4, render: (u) => <ClockShot u={u} len={4} />, lines: [{ at: 0.4, to: 3.8, who: "Mr Elsewhere", text: "Take your time. I’ll take the booking." }], sfx: Array.from({ length: 14 }, (_, i) => ({ at: 0.2 + i * 0.27, file: "click", volume: 0.12 })) },
    {
      len: 5,
      render: (u) => (
        <DarkShot u={u} len={5} s={{ e: { ...LUCY, reply: { at: 0.3, text: BOOKED_ELSEWHERE } }, status: (v) => (v > 0.6 ? "Booked with another clinic" : "No reply · 10 min"), cardIn: -1, shade: { in: -1, eyes: -1, near: [-2, -1] }, hand: { in: 1.3, pinch: 2.1, stamp: 2.4, drag: 3.0 } }} />
      ),
      lines: [{ at: 0.6, to: 4.8, who: null, text: "She paid for the enquiry. Another clinic got the booking." }],
      sfx: [
        { at: 0.3, file: "click", volume: 0.22 },
        { at: 1.3, file: "whoosh", volume: 0.2 },
        { at: 2.4, file: "thud", volume: 0.45 },
        { at: 3.0, file: "whoosh", volume: 0.2 },
      ],
    },
    { len: 1.6, render: (u) => <LostShot u={u} />, sfx: [{ at: 0, file: "buzzer", volume: 0.32 }] },
    { len: 3.4, render: (u) => <DecideShot u={u} />, lines: [{ at: 1.0, to: 3.2, who: "Maya", text: "Not the next one." }] },
    {
      len: 8,
      warm: true,
      render: (u) => (
        <>
          <DawnShot u={u} len={8} screens={5} />
          <Headline u={u} at={6.8} to={9}>
            <div style={{ ...display(84), color: "#3A2A1C" }}>
              Setup <span style={{ ...em(90), color: "#8A6436" }}>complete.</span>
            </div>
          </Headline>
        </>
      ),
      lines: [{ at: 0.5, to: 6.5, who: null, text: "Meet Vallamo, your all-in-one front desk. Set it up online using your clinic’s details." }],
      sfx: [{ at: 0, file: "whoosh", volume: 0.24 }],
    },
    {
      len: 6.5,
      render: (u) => (
        <DarkShot u={u} len={6.5} s={{ e: JESS, status: (v) => (v > 1.9 ? "Answered instantly" : "New enquiry"), cardIn: 0.3, shade: { in: 0.1, eyes: 0.6, near: [0.6, 1.4], recoil: 2.2 }, hand: { in: 1.2, miss: 2.1, gone: 2.7 }, vallamo: { at: 1.85, text: ISLA }, light: [1.85, 3.2], glass: true }}>
          <AlwaysLine u={u} at={3.0} to={6.3} />
        </DarkShot>
      ),
      lines: [{ at: 3.0, to: 6.2, who: null, text: "Vallamo always replies instantly." }],
      sfx: [
        { at: 0.3, file: "chime", volume: 0.16 },
        { at: 1.2, file: "whoosh", volume: 0.18 },
        { at: 1.85, file: "chime", volume: 0.3 },
      ],
    },
    { len: 5.5, warm: true, render: (u) => <ChatShot u={u} msgs={JESS_CHAT} head={false} />, lines: [{ at: 0.6, to: 5.4, who: null, text: "Your clinic’s answers." }] },
    { len: 4, warm: true, render: (u) => <BookedShot u={u} />, lines: [{ at: 0.3, to: 3.9, who: null, text: "An appointment in your diary. While you’re with a client." }], sfx: [{ at: 0.5, file: "thud", volume: 0.18 }] },
    { len: 3.5, render: (u) => <FarewellShot u={u} len={3.5} />, lines: [{ at: 0.4, to: 2.9, who: "Mr Elsewhere", text: "Oh. Somebody’s answering." }] },
    { len: 13, warm: true, render: (u) => <OfferCard u={u} />, sfx: [{ at: 1.65, file: "thud", volume: 0.22 }] },
  ],
};

export const halloweenLength = (cut: HalloweenCut) => CUTS[cut].reduce((n, s) => n + s.len, 0);

export type HalloweenProps = { fps?: number; format?: Format["id"]; cut?: HalloweenCut; music?: boolean; sfx?: boolean };

export function HalloweenFilm({ format = "45", cut = "35", music = false, sfx = false }: HalloweenProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const shots = CUTS[cut];
  const starts: number[] = [];
  shots.reduce((n, s) => (starts.push(n), n + s.len), 0);
  const i = Math.max(0, starts.filter((s0) => t >= s0).length - 1);
  const length = halloweenLength(cut);
  // The drone plays until Vallamo's light first arrives; then the warm score takes over.
  const firstWarm = starts[shots.findIndex((s) => s.warm)] ?? length;
  return (
    <FormatCtx.Provider value={FORMATS[format]}>
      <AbsoluteFill style={{ background: "#07060A" }}>
        {shots[i].render(t - starts[i])}
        {shots.map((s, k) =>
          (s.lines ?? []).map((l, j) => (
            <Line key={`${k}-${j}`} u={t - starts[k]} at={l.at} to={l.to} who={l.who}>
              {l.text}
            </Line>
          )),
        )}
      </AbsoluteFill>
      {music && (
        <>
          <Audio src={staticFile("audio/drone-halloween.wav")} volume={(f) => 0.55 * (1 - Math.min(1, Math.max(0, (f / fps - firstWarm + 0.2) / 0.8)))} />
          <Sequence from={Math.round((firstWarm - 0.1) * fps)} layout="none">
            <Audio src={staticFile("audio/music-meta.wav")} startFrom={Math.round(2.79 * fps)} volume={(f) => 0.45 * Math.min(1, f / fps / 0.6) * Math.min(1, Math.max(0, (length - firstWarm - f / fps) / 1.2))} />
          </Sequence>
        </>
      )}
      {sfx &&
        shots.flatMap((s, k) =>
          (s.sfx ?? []).map((x, j) => (
            <Sequence key={`${k}-${j}`} from={Math.round((starts[k] + x.at) * fps)} durationInFrames={Math.round(1.5 * fps)} layout="none">
              <Audio src={staticFile(`audio/sfx/${x.file}.wav`)} volume={x.volume} />
            </Sequence>
          )),
        )}
    </FormatCtx.Provider>
  );
}
