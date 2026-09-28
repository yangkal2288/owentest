import type { ComponentType, ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";

import { C, FONT } from "../../brand";
import { useTime } from "../../kit/time";
import { ease, FilmClock } from "./motion";
import { DemoLabel } from "./parts";
import { S01Open } from "./scenes/S01Open";
import { S03Meet } from "./scenes/S03Meet";
import { S04Channels } from "./scenes/S04Channels";
import { S05Inbox } from "./scenes/S05Inbox";
import { S06Booked } from "./scenes/S06Booked";
import { S07Connect } from "./scenes/S07Connect";
import { S08Fill } from "./scenes/S08Fill";
import { S09Rules } from "./scenes/S09Rules";
import { S11Handled } from "./scenes/S11Handled";
import { S12End } from "./scenes/S12End";
import { SHOTS, START, VO } from "./timeline";

export type MeetProps = {
  fps?: number;
  /** Animatic aid: the VO script line under the picture and the shot name. Off for delivery. */
  guide?: boolean;
  /** TEMP music bed (public/audio/temp-bed.wav). Off for delivery. */
  music?: boolean;
  /** The few subtle SFX (send, land, clicks, booked chime). */
  sfx?: boolean;
};

// A slow held camera on every shot that doesn't hand exact positions to the
// next (S04 → S05 is a measured magic move, so those two stay locked).
const DRIFT = new Set(["S03", "S06", "S07", "S09", "S11", "S12"]);
function Drift({ id, length, children }: { id: string; length: number; children: ReactNode }) {
  const t = useTime();
  if (!DRIFT.has(id)) return <>{children}</>;
  const u = ease(Math.min(1, t / length));
  return <AbsoluteFill style={{ transform: `scale(${1 + 0.035 * u}) translateY(${-6 * u}px)`, transformOrigin: "50% 48%" }}>{children}</AbsoluteFill>;
}

// Sound: few, soft, and never one on every landing (no-slop-motion). Shot-relative seconds.
const SFX = [
  { shot: "S05", at: 0.12, file: "whoosh", volume: 0.18 }, // the three enquiries lift off
  { shot: "S05", at: 1.05, file: "thud", volume: 0.22 }, // Sarah lands first
  { shot: "S05", at: 3.85, file: "click", volume: 0.35 }, // cursor on Sarah
  { shot: "S06", at: 1.45, file: "click", volume: 0.2 }, // Sarah sends
  { shot: "S06", at: 3.95, file: "chime", volume: 0.32 }, // booked: confetti
  { shot: "S06", at: 5.2, file: "whoosh", volume: 0.2 }, // circle wipe
  { shot: "S07", at: 3.6, file: "whoosh", volume: 0.24 }, // whip to the diary
  { shot: "S09", at: 3.9 + 0.62, file: "click", volume: 0.3 }, // follow-ups switched on
  { shot: "S09", at: 5.2 + 0.62, file: "click", volume: 0.3 }, // "I'm on it"
].map((c) => ({ ...c, at: START[c.shot] + c.at }));

const SCENES: Record<string, ComponentType> = {
  S01: S01Open,
  S03: S03Meet,
  S04: S04Channels,
  S05: S05Inbox,
  S06: S06Booked,
  S07: S07Connect,
  S08: S08Fill,
  S09: S09Rules,
  S11: S11Handled,
  S12: S12End,
};

function Guide() {
  const t = useTime();
  const line = VO.find((v) => t >= v.from && t < v.to);
  const shot = SHOTS.find((s) => t >= START[s.id] && t < START[s.id] + s.length) ?? SHOTS[SHOTS.length - 1];
  return (
    <>
      <div style={{ position: "absolute", right: 24, top: 18, fontFamily: FONT.sans, fontSize: 18, color: C.ink3, letterSpacing: "0.04em" }}>
        ANIMATIC · {shot.id} {shot.name} · {t.toFixed(1)}s
      </div>
      {line && (
        <div style={{ position: "absolute", left: 420, right: 420, bottom: 18, textAlign: "center", fontFamily: FONT.sans, fontSize: 24, color: C.ink2, background: "rgb(255 255 255 / .85)", borderRadius: 8, padding: "6px 14px" }}>
          VO: {line.text}
        </div>
      )}
    </>
  );
}

export function MeetFilm({ guide = false, music = false, sfx = false }: MeetProps) {
  const { fps } = useVideoConfig();
  const t = useTime();
  const ui = t >= START.S04 && t < START.S11;
  return (
    <FilmClock.Provider value={t}>
      <AbsoluteFill style={{ background: "#FFFFFF" }}>
        {SHOTS.map((s) => {
          const Scene = SCENES[s.id];
          return (
            <Sequence key={s.id} from={Math.round(START[s.id] * fps)} durationInFrames={Math.round(s.length * fps)} name={`${s.id} ${s.name}`}>
              <Drift id={s.id} length={s.length}>
                <Scene />
              </Drift>
            </Sequence>
          );
        })}
        {ui && <DemoLabel />}
        {guide && <Guide />}
        {music && <Audio src={staticFile("audio/temp-bed.wav")} volume={0.8} />}
        {sfx &&
          SFX.map((c, i) => (
            <Sequence key={i} from={Math.round(c.at * fps)} durationInFrames={Math.round(1.5 * fps)} layout="none">
              <Audio src={staticFile(`audio/sfx/${c.file}.wav`)} volume={c.volume} />
            </Sequence>
          ))}
      </AbsoluteFill>
    </FilmClock.Provider>
  );
}
