import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { tween } from "../meet/motion";
import { FORMATS, FormatCtx, type Format } from "../meta/format";
import type { Msg } from "../meta/parts";
import type { GhostPose } from "./art/Ghost";
import { Caption } from "./parts";
import { CalendarShot, ChatShot, DecideShot, type DeskScript, DeskShot, LaptopShot, LostOverlay, MessageShot, OfferShot, OpeningTitle, TreatmentShot, WatchShot } from "./Shots";

/**
 * "The Booking Thief": the Halloween film (VALLAMO_HALLOWEEN_SELF_SERVE_AD_BRIEF.md),
 * built as a timed, illustrated animatic of the 3D film: every shot is in the brief's
 * order and composition, so rendered 3D clips can replace it shot for shot.
 * Three cuts share the shots: 70 s (the story), 35 s (the paid ad), 15 s.
 */
export type HalloweenCut = "70" | "35" | "15";
type Line = { at: number; to: number; who: string | null; text: string };
type Shot = { len: number; render: (u: number) => ReactNode; lines?: Line[]; sfx?: { at: number; file: string; volume: number }[] };

const LUCY = { who: "Lucy", channel: "From your Instagram ad", icon: "m-ch-ig" as const, text: "Can I book the £120 facial this week?" };
const JESS = { who: "Jess", channel: "Website chat · new enquiry", icon: "m-ch-web" as const, text: "I’d like the £120 facial. Anything Thursday?" };

/** The ghost's performance, beat by beat. */
const rest = (smile = 0.5, brow = 0.15): GhostPose => ({ smile, brow, arm: { shoulder: 8, elbow: -20, hand: "rest" } });
const reach = (u: number, at: number, hand: "open" | "pinch" | "fist"): GhostPose["arm"] => {
  const k = tween(u, at - 0.45, 0.45);
  return { shoulder: 8 + 70 * k, elbow: -20 + 18 * k, hand: k > 0.9 ? hand : "rest" };
};

const DESK_WIDE = { x: 560, y: 920, zoom: 1.08 };

function deskOpening(): DeskScript {
  return {
    cam: [
      { at: 0, x: 380, y: 940, zoom: 1.3 },
      { at: 1.7, x: 400, y: 930, zoom: 1.26 },
      { at: 3.7, ...DESK_WIDE },
    ],
    card: { ...LUCY, rise: 0.3, status: () => "Awaiting reply" },
    ledger: { slide: 0.9 },
    ghost: (u) => ({ ...rest(u > 2.6 ? 0.75 : 0.5, u > 2.6 ? 0.35 : 0.1), arm: u > 0.5 && u < 1.9 ? { shoulder: 40, elbow: -30, hand: "open" } : { shoulder: 8, elbow: -20, hand: "rest" } }),
    glass: { client: 1, maya: 1 },
  };
}

function lossDesk(pinch: number, file: number, stamp: number, close: number, text = LUCY.text): DeskScript {
  return {
    cam: [
      { at: 0, x: 520, y: 980, zoom: 1.28 },
      { at: close + 0.6, x: 560, y: 960, zoom: 1.2 },
    ],
    card: { ...LUCY, text, rise: -1, status: () => "Booked with another clinic", pinch, file },
    ledger: { open: -1, stamp, close },
    ghost: (u) => ({ smile: u > file ? 0.9 : 0.6, brow: 0.3, tilt: u > close ? 6 : 0, arm: u < file + 0.5 ? reach(u, pinch, "pinch") : { shoulder: 8, elbow: -20, hand: "rest" } }),
  };
}

function missDesk(rise: number, grab: number, reply: number): DeskScript {
  return {
    cam: [
      { at: 0, ...DESK_WIDE },
      { at: grab + 2, x: 600, y: 900, zoom: 1.18 },
    ],
    card: { ...JESS, rise, status: (u) => (u > reply ? "Answered instantly" : "New enquiry") },
    reply: { at: reply, text: "Thursday at 3pm is available. Would you like that?" },
    ledger: { open: -1 },
    ghost: (u) => ({ smile: u < reply + 0.1 ? 0.7 : 0.05, brow: u > reply + 0.35 ? -0.2 : 0.2, browL: u > reply + 0.35 ? 1 : undefined, tilt: u > reply + 0.35 ? -8 : 0, arm: u < reply + 1.4 ? reach(u, grab, u > reply + 0.1 ? "fist" : "open") : { shoulder: 40, elbow: -110, hand: "fist" } }),
    glass: { client: 1, maya: 1 },
    warm: 0.3,
  };
}

const JESS_CHAT: Msg[] = [
  { name: "h-u1", at: 0.5 },
  { name: "m-dots", at: 0.85, out: 1.15 },
  { name: "h-i1", at: 1.15 },
  { name: "h-u2", at: 2.6 },
  { name: "p-idet", at: 3.2 },
  { name: "h-u3", at: 3.8 },
  { name: "m-dots", at: 4.25, out: 4.55 },
  { name: "h-i2", at: 4.55 },
];
const JESS_CHAT_FAST: Msg[] = [
  { name: "h-u1", at: 0.15 },
  { name: "h-i1", at: 0.5 },
  { name: "h-u2", at: 1.3 },
  { name: "p-idet", at: 1.65 },
  { name: "h-u3", at: 1.95 },
  { name: "h-i2", at: 2.35 },
];

const CUTS: Record<HalloweenCut, Shot[]> = {
  "70": [
    {
      len: 4,
      render: (u) => (
        <>
          <DeskShot u={u} s={deskOpening()} />
          <OpeningTitle u={u} to={3.6} />
        </>
      ),
      lines: [{ at: 2.2, to: 3.9, who: "Mr Elsewhere", text: "Busy, are we?" }],
      sfx: [{ at: 0.3, file: "chime", volume: 0.2 }],
    },
    {
      len: 6,
      render: (u) => <TreatmentShot u={u} maya={(v) => ({ arms: "tend", lean: -6 + Math.sin(v * 1.5) * 2, mouth: v > 0.3 && v < 1.1 ? 0.5 + 0.5 * Math.sin(v * 24) : 0 })} nod={tween(u, 1.3, 0.3) * (1 - tween(u, 1.8, 0.3))} />,
      lines: [
        { at: 0.3, to: 1.4, who: "Maya", text: "Comfortable?" },
        { at: 1.8, to: 5.8, who: null, text: "Meet Maya. Her ads are working. She’s with a client." },
      ],
    },
    { len: 2.6, render: (u) => <WatchShot u={u} len={2.6} />, sfx: Array.from({ length: 8 }, (_, i) => ({ at: 0.3 + i * 0.25, file: "click", volume: 0.1 })) },
    {
      len: 3.4,
      render: (u) => (
        <DeskShot
          u={u}
          s={{
            cam: [{ at: 0, x: 560, y: 950, zoom: 1.12 }, { at: 3.4, x: 540, y: 960, zoom: 1.18 }],
            card: { ...LUCY, rise: -1, status: () => "No reply · 10 min" },
            ledger: { open: 0.3, stamp: undefined },
            ghost: (v) => ({ smile: 0.65, brow: 0.2, tilt: -4, arm: v > 2.1 ? reach(v, 2.6, "open") : { shoulder: 8, elbow: -20, hand: "rest" } }),
          }}
        />
      ),
      lines: [{ at: 0.3, to: 3.2, who: "Mr Elsewhere", text: "Take your time. I’ll take the booking." }],
    },
    { len: 2.2, render: (u) => <MessageShot u={u} />, sfx: [{ at: 0.1, file: "click", volume: 0.22 }] },
    {
      len: 3.8,
      render: (u) => (
        <>
          <DeskShot u={u} s={lossDesk(0.4, 0.8, 1.6, 3.3)} />
          {u > 2.2 && u < 3.3 && <LostOverlay u={u - 2.2} len={1.1} />}
        </>
      ),
      lines: [{ at: 0.3, to: 3.6, who: null, text: "She paid for the enquiry. Another clinic got the booking." }],
      sfx: [
        { at: 1.6, file: "thud", volume: 0.4 },
        { at: 2.2, file: "buzzer", volume: 0.3 },
      ],
    },
    {
      len: 5,
      render: (u) => <DecideShot u={u} look={1.0} bow={1.7} turn={3.6} />,
      lines: [{ at: 2.6, to: 3.5, who: "Maya", text: "Not the next one." }],
    },
    {
      len: 9,
      render: (u) => <LaptopShot u={u} len={9} />,
      lines: [{ at: 0.4, to: 6.4, who: null, text: "Meet Vallamo, your all-in-one front desk. Set it up online using your clinic’s details." }],
      sfx: [{ at: 7.1, file: "whoosh", volume: 0.18 }],
    },
    {
      len: 4,
      render: (u) => <DeskShot u={u} s={missDesk(0.3, 1.3, 1.8)} />,
      sfx: [
        { at: 0.3, file: "chime", volume: 0.18 },
        { at: 1.8, file: "click", volume: 0.24 },
      ],
    },
    {
      len: 8,
      render: (u) => <ChatShot u={u} msgs={JESS_CHAT} />,
      lines: [{ at: 0.6, to: 3.0, who: null, text: "Vallamo always replies instantly." }],
    },
    {
      len: 4.5,
      render: (u) => <CalendarShot u={u} />,
      lines: [{ at: 0.3, to: 4.4, who: null, text: "Your clinic’s answers. An appointment in your diary. While you’re with a client." }],
      sfx: [{ at: 0.1, file: "chime", volume: 0.28 }],
    },
    {
      len: 2.5,
      render: (u) => (
        <DeskShot
          u={u}
          s={{
            cam: [{ at: 0, x: 700, y: 900, zoom: 1.3 }, { at: 2.5, x: 720, y: 880, zoom: 1.36 }],
            ledger: { open: -1 },
            ghost: () => ({ smile: 0, brow: -0.4, tilt: 10, squint: 0.3, arm: { shoulder: 8, elbow: -20, hand: "rest" } }),
            glass: { client: 1, maya: 1 },
            warm: 0.6,
          }}
        />
      ),
    },
    {
      len: 3,
      render: (u) => (
        <DeskShot
          u={u}
          s={{
            cam: [{ at: 0, x: 820, y: 780, zoom: 1.7 }, { at: 3, x: 860, y: 760, zoom: 1.75 }],
            ledger: { open: -1, close: 0.9 },
            ghost: (v) => ({ smile: 0, browL: tween(v, 0.2, 0.3), brow: -0.1, tilt: -4, arm: { shoulder: 8, elbow: -20, hand: "rest" } }),
            warm: 1,
            retreat: 1.7,
          }}
        />
      ),
      lines: [{ at: 0.3, to: 2.5, who: "Mr Elsewhere", text: "Oh. Somebody’s answering." }],
    },
    { len: 12, render: (u) => <OfferShot u={u} len={12} />, sfx: [{ at: 1.9, file: "thud", volume: 0.22 }] },
  ],
  "35": [
    {
      len: 4,
      render: (u) => (
        <>
          <DeskShot u={u} s={deskOpening()} />
          <OpeningTitle u={u} to={3.6} />
        </>
      ),
      lines: [{ at: 1.5, to: 3.9, who: "Mr Elsewhere", text: "Take your time. I’ll take the booking." }],
      sfx: [{ at: 0.3, file: "chime", volume: 0.2 }],
    },
    { len: 1.1, render: (u) => <WatchShot u={u} len={1.1} />, sfx: Array.from({ length: 4 }, (_, i) => ({ at: 0.2 + i * 0.2, file: "click", volume: 0.1 })) },
    { len: 1.4, render: (u) => <MessageShot u={u} />, lines: [{ at: 0.1, to: 3.3, who: null, text: "Your enquiry. Another clinic’s booking." }], sfx: [{ at: 0.1, file: "click", volume: 0.22 }] },
    {
      len: 2.1,
      render: (u) => (
        <>
          <DeskShot u={u} s={lossDesk(0.1, 0.35, 0.75, 9)} />
          {u > 1.1 && <LostOverlay u={u - 1.1} len={1.0} />}
        </>
      ),
      sfx: [
        { at: 0.75, file: "thud", volume: 0.4 },
        { at: 1.1, file: "buzzer", volume: 0.3 },
      ],
    },
    { len: 5.8, render: (u) => <LaptopShot u={u} len={5.8} />, lines: [{ at: 0.3, to: 3.4, who: null, text: "Meet Vallamo, your all-in-one front desk." }], sfx: [{ at: 4.1, file: "whoosh", volume: 0.18 }] },
    { len: 2.2, render: (u) => <DeskShot u={u} s={missDesk(0.1, 0.55, 0.95)} />, sfx: [{ at: 0.1, file: "chime", volume: 0.18 }, { at: 0.95, file: "click", volume: 0.24 }] },
    { len: 3.8, render: (u) => <ChatShot u={u} msgs={JESS_CHAT_FAST} />, lines: [{ at: 0.2, to: 2.6, who: null, text: "Vallamo always replies instantly." }] },
    { len: 1.6, render: (u) => <CalendarShot u={u} />, sfx: [{ at: 0.1, file: "chime", volume: 0.28 }] },
    {
      len: 1.8,
      render: (u) => (
        <DeskShot
          u={u}
          s={{
            cam: [{ at: 0, x: 820, y: 780, zoom: 1.7 }, { at: 1.8, x: 850, y: 770, zoom: 1.74 }],
            ledger: { open: -1, close: 0.6 },
            ghost: (v) => ({ smile: 0, browL: tween(v, 0.1, 0.25), brow: -0.1, tilt: -4 }),
            warm: 1,
            retreat: 1.1,
          }}
        />
      ),
      lines: [{ at: 0.1, to: 1.7, who: "Mr Elsewhere", text: "Oh. Somebody’s answering." }],
    },
    { len: 11.2, render: (u) => <OfferShot u={u} len={11.2} />, sfx: [{ at: 1.9, file: "thud", volume: 0.22 }] },
  ],
  "15": [
    {
      len: 2.6,
      render: (u) => (
        <>
          <DeskShot u={u} s={{ ...lossDesk(0.9, 1.25, 1.8, 9, "Thanks, I’ve booked with another clinic."), cam: [{ at: 0, x: 440, y: 980, zoom: 1.2 }, { at: 2.6, x: 540, y: 980, zoom: 1.24 }] }} />
          <OpeningTitle u={u} to={2.4} />
        </>
      ),
      lines: [{ at: 1.0, to: 2.5, who: "Mr Elsewhere", text: "Another one." }],
      sfx: [{ at: 1.8, file: "thud", volume: 0.4 }],
    },
    {
      len: 1.0,
      render: (u) => (
        <>
          <DeskShot u={2.6 + u} s={lossDesk(0.9, 1.25, 1.8, 9)} />
          <LostOverlay u={u} len={1.0} />
        </>
      ),
      sfx: [{ at: 0, file: "buzzer", volume: 0.3 }],
    },
    { len: 1.0, render: (u) => <LaptopShot u={4.0 + u} len={5.0} offer={false} /> },
    { len: 1.8, render: (u) => <DeskShot u={u} s={missDesk(0.05, 0.45, 0.8)} />, sfx: [{ at: 0.8, file: "click", volume: 0.24 }] },
    { len: 2.6, render: (u) => <ChatShot u={u + 0.3} msgs={JESS_CHAT_FAST} />, lines: [{ at: -1.6, to: 2.4, who: null, text: "Vallamo always replies instantly." }] },
    { len: 0.9, render: (u) => <CalendarShot u={u + 1.2} />, sfx: [{ at: 0, file: "chime", volume: 0.26 }] },
    { len: 5.1, render: (u) => <OfferShot u={u + 0.4} len={5.1} /> },
  ],
};

export const halloweenLength = (cut: HalloweenCut) => CUTS[cut].reduce((n, s) => n + s.len, 0);

export type HalloweenProps = { fps?: number; format?: Format["id"]; cut?: HalloweenCut; music?: boolean; sfx?: boolean };

export function HalloweenFilm({ format = "45", cut = "70", music = false, sfx = false }: HalloweenProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const shots = CUTS[cut];
  const starts: number[] = [];
  shots.reduce((n, s) => (starts.push(n), n + s.len), 0);
  const i = Math.max(0, starts.filter((s0) => t >= s0).length - 1);
  const u = t - starts[i];
  const length = halloweenLength(cut);
  return (
    <FormatCtx.Provider value={FORMATS[format]}>
      <AbsoluteFill style={{ background: "#1E1A18" }}>
        {shots[i].render(u)}
        {/* Subtitles: the lines of every shot, placed in film time (a narrator line can run over a cut). */}
        {shots.map((s, k) =>
          (s.lines ?? []).map((l, j) => (
            <Caption key={`${k}-${j}`} u={t - starts[k]} at={l.at} to={l.to} who={l.who}>
              {l.text}
            </Caption>
          )),
        )}
      </AbsoluteFill>
      {music && <Audio src={staticFile("audio/music-halloween.wav")} volume={(f) => 0.45 * Math.min(1, Math.max(0, (length - f / fps) / 1.2))} />}
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
