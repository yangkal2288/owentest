import type { ComponentType, ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";

import { C, FONT } from "../../brand";
import { useTime } from "../../kit/time";
import { ease, FilmClock, ShotSpeed } from "./motion";
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
import { SHOTS, shotLength, shotSpeed, START, VO, VO_LINES } from "./timeline";

export type MeetProps = {
  fps?: number;
  /** Animatic aid: the VO script line under the picture and the shot name. Off for delivery. */
  guide?: boolean;
  /** The music bed: Soundsurfer "Product Video" (Pixabay licence), fitted on downbeats to the film. */
  music?: boolean;
  /** The few subtle SFX (send, land, clicks, booked chime). */
  sfx?: boolean;
  /** The recorded voiceover (public/audio/vo). */
  vo?: boolean;
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

// The music sits under the voice: it ducks while a line plays (0.2 s ramps) and comes back between lines.
// Owen: "make the music quieter".
const MUSIC = 0.45;
const DUCKED = 0.16;
// Lines closer than 1.5 s share one duck, so the music never pumps up between them.
const DUCKS = VO_LINES.reduce<{ from: number; to: number }[]>((acc, l) => {
  const last = acc[acc.length - 1];
  if (last && l.from - last.to < 1.5) last.to = l.to;
  else acc.push({ from: l.from, to: l.to });
  return acc;
}, []);
function musicVolume(t: number, vo: boolean) {
  if (!vo) return MUSIC;
  let d = 0;
  for (const k of DUCKS) d = Math.max(d, Math.min(1, (t - (k.from - 0.4)) / 0.35, (k.to + 0.5 - t) / 0.45));
  return MUSIC - (MUSIC - DUCKED) * Math.max(0, Math.min(1, d));
}
// The speaker's own room tone under the whole read, so the voice never drops to digital silence between lines.
const ROOM = { from: VO_LINES[0].from - 0.4, to: VO_LINES[VO_LINES.length - 1].to + 0.6 };
const roomVolume = (t: number) => Math.max(0, Math.min(1, (t - ROOM.from) / 0.4, (ROOM.to - t) / 0.6));

// Sound: few, soft, and never one on every landing (no-slop-motion). Shot-relative seconds.
const SFX = [
  { shot: "S05", at: 0.12, file: "whoosh", volume: 0.18 }, // the three enquiries lift off
  { shot: "S05", at: 1.05, file: "thud", volume: 0.22 }, // Sarah lands first
  { shot: "S05", at: 3.85, file: "click", volume: 0.35 }, // cursor on Sarah
  { shot: "S06", at: 1.45, file: "click", volume: 0.2 }, // Sarah sends
  { shot: "S06", at: 3.95, file: "chime", volume: 0.32 }, // booked: the pop
  { shot: "S06", at: 4.8, file: "whoosh", volume: 0.2 }, // circle wipe
  { shot: "S07", at: 3.6, file: "whoosh", volume: 0.24 }, // whip to the diary
  { shot: "S09", at: 4.72 + 0.55, file: "click", volume: 0.3 }, // follow-ups switched on
  { shot: "S09", at: 7.65, file: "click", volume: 0.3 }, // "I'm on it"
].map((c) => ({ ...c, at: START[c.shot] + c.at / shotSpeed(SHOTS.find((s) => s.id === c.shot)!) }));

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
  const shot = SHOTS.find((s) => t >= START[s.id] && t < START[s.id] + shotLength(s)) ?? SHOTS[SHOTS.length - 1];
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

export function MeetFilm({ guide = false, music = false, sfx = false, vo = false }: MeetProps) {
  const { fps } = useVideoConfig();
  const t = useTime();
  const ui = t >= START.S04 && t < START.S11;
  return (
    <FilmClock.Provider value={t}>
      <AbsoluteFill style={{ background: "#FFFFFF" }}>
        {SHOTS.map((s) => {
          const Scene = SCENES[s.id];
          return (
            <Sequence key={s.id} from={Math.round(START[s.id] * fps)} durationInFrames={Math.round(shotLength(s) * fps)} name={`${s.id} ${s.name}`}>
              <ShotSpeed.Provider value={shotSpeed(s)}>
                <Drift id={s.id} length={shotLength(s)}>
                  <Scene />
                </Drift>
              </ShotSpeed.Provider>
            </Sequence>
          );
        })}
        {ui && <DemoLabel />}
        {guide && <Guide />}
        {music && <Audio src={staticFile("audio/music.wav")} volume={(f) => musicVolume(f / fps, vo)} />}
        {vo && (
          <Sequence from={Math.round(ROOM.from * fps)} durationInFrames={Math.round((ROOM.to - ROOM.from) * fps)} layout="none">
            <Audio src={staticFile("audio/roomtone.wav")} volume={(f) => roomVolume(ROOM.from + f / fps)} />
          </Sequence>
        )}
      {vo &&
        VO_LINES.map((l) => (
          <Sequence key={l.file} from={Math.round(l.from * fps)} durationInFrames={Math.ceil((l.to - l.from + 0.2) * fps)} layout="none">
            <Audio src={staticFile(l.file)} volume={1} />
          </Sequence>
        ))}
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
