import type { ComponentType } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";

import { C, FONT } from "../../brand";
import { useTime } from "../../kit/time";
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
};

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

export function MeetFilm({ guide = false, music = false }: MeetProps) {
  const { fps } = useVideoConfig();
  const t = useTime();
  const ui = t >= START.S04 && t < START.S11;
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      {SHOTS.map((s) => {
        const Scene = SCENES[s.id];
        return (
          <Sequence key={s.id} from={Math.round(START[s.id] * fps)} durationInFrames={Math.round(s.length * fps)} name={`${s.id} ${s.name}`}>
            <Scene />
          </Sequence>
        );
      })}
      {ui && <DemoLabel />}
      {guide && <Guide />}
      {music && <Audio src={staticFile("audio/temp-bed.wav")} />}
    </AbsoluteFill>
  );
}
