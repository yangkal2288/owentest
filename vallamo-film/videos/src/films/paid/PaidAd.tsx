import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { FilmClock } from "../meet/motion";
import { FORMATS, FormatCtx, type Format } from "../meta/format";
import { Demo } from "./scenes/Demo";
import { End } from "./scenes/End";
import { Loss } from "./scenes/Loss";
import { Meet } from "./scenes/Meet";
import { CUTS, CutCtx, type Cut } from "./timing";

export type PaidProps = { fps?: number; format?: Format["id"]; cut?: Cut["id"]; music?: boolean; sfx?: boolean };

/** Restrained sound, per the brief: one notification, one incoming message, a light tick, one buzzer, one confirmation. */
function sfxFor(c: Cut) {
  const list: { at: number; file: string; volume: number }[] = [{ at: c.card.in, file: "chime", volume: 0.16 }];
  if (c.card.client !== null) list.push({ at: c.card.client, file: "click", volume: 0.18 });
  if (c.timer) for (let i = 1; i <= 10; i++) list.push({ at: c.timer.from + (c.timer.to - c.timer.from) * Math.pow(i / 10, 1 / 1.6), file: "click", volume: 0.06 + i * 0.008 });
  list.push({ at: c.reply, file: "click", volume: 0.2 });
  list.push({ at: c.crack, file: "click", volume: 0.22 });
  list.push({ at: c.x, file: "buzzer", volume: 0.3 }); // the one buzzer, with the X
  if (c.meet) list.push({ at: c.meet.at, file: "whoosh", volume: 0.14 });
  list.push({ at: c.demo.at, file: "whoosh", volume: c.meet ? 0.1 : 0.14 });
  for (const m of c.demo.msgs) if (m.name.startsWith("p-i")) list.push({ at: m.at, file: "click", volume: 0.16 });
  list.push({ at: c.demo.booked, file: "chime", volume: 0.28 }); // the one confirmation
  list.push({ at: c.end.at - 0.3, file: "whoosh", volume: 0.18 });
  list.push({ at: c.end.cta, file: "thud", volume: 0.18 });
  return list;
}

/** Music: ducked under the X so the buzzer and price have space, back up with Vallamo; out on the track's own ending. */
function musicVolume(c: Cut, t: number) {
  const base = 0.5;
  const back = c.meet ? c.meet.at : c.demo.at;
  const duck = t < c.x - 0.08 ? 0 : t < c.x ? (t - (c.x - 0.08)) / 0.08 : t < back - 0.6 ? 1 : t < back ? 1 - (t - (back - 0.6)) / 0.6 : 0;
  const tail = Math.min(1, Math.max(0, (c.length - t) / 0.9));
  return base * (1 - 0.8 * duck) * tail;
}

export function PaidAd({ format = "45", cut = "main", music = false, sfx = false }: PaidProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const F = FORMATS[format];
  const c = CUTS[cut];
  return (
    <FormatCtx.Provider value={F}>
      <CutCtx.Provider value={c}>
        <FilmClock.Provider value={t}>
          <AbsoluteFill style={{ background: "#FFFFFF" }}>
            {t < c.xOut + 0.45 && <Loss t={t} />}
            {c.meet && t >= c.meet.at - 0.05 && t < c.demo.at + 0.1 && <Meet t={t} />}
            {t >= c.demo.at - 0.05 && t < c.end.at + 0.5 && <Demo t={t} />}
            {t >= c.end.at - 0.32 && <End t={t} />}
          </AbsoluteFill>
          {music && <Audio src={staticFile(c.music)} volume={(f) => musicVolume(c, f / fps)} />}
          {sfx &&
            sfxFor(c).map((x, i) => (
              <Sequence key={i} from={Math.round(x.at * fps)} durationInFrames={Math.round(1.5 * fps)} layout="none">
                <Audio src={staticFile(`audio/sfx/${x.file}.wav`)} volume={x.volume} />
              </Sequence>
            ))}
        </FilmClock.Provider>
      </CutCtx.Provider>
    </FormatCtx.Provider>
  );
}
export const paidLength = (cut: Cut["id"]) => CUTS[cut].length;
