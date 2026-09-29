import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { FilmClock } from "../meet/motion";
import { FORMATS, FormatCtx, type Format } from "../meta/format";
import { Story } from "./scenes/Story";
import { Always, Demo, End, MeetClay } from "./scenes/Vallamo";
import { CUTS, CutCtx, type Cut } from "./timing";

export type PaidProps = { fps?: number; format?: Format["id"]; cut?: Cut["id"]; music?: boolean; sfx?: boolean };

/** Restrained sound: one notification, a light tick, the break, one buzzer, one confirmation. */
function sfxFor(c: Cut) {
  const list: { at: number; file: string; volume: number }[] = [
    { at: c.enquiry.drop + 0.2, file: "chime", volume: 0.2 }, // the enquiry lands
    { at: c.enquiry.drop + 0.22, file: "thud", volume: 0.16 },
  ];
  for (let i = 1; i <= 10; i++) list.push({ at: c.count[0] + ((c.count[1] - c.count[0]) * i) / 10, file: "click", volume: 0.05 + i * 0.008 });
  list.push({ at: c.reply, file: "click", volume: 0.2 });
  list.push({ at: c.crack, file: "click", volume: 0.24 });
  list.push({ at: c.shatter, file: "thud", volume: 0.36 }, { at: c.shatter, file: "whoosh", volume: 0.22 });
  list.push({ at: c.spend.price, file: "buzzer", volume: 0.3 }); // the one buzzer
  if (c.meet) list.push({ at: c.meet.at, file: "whoosh", volume: 0.2 }, { at: c.meet.at + 0.3, file: "chime", volume: 0.14 });
  if (c.always) {
    list.push({ at: c.always.at, file: "whoosh", volume: 0.16 });
    for (const p of c.always.pills) list.push({ at: p, file: "thud", volume: 0.1 });
  }
  list.push({ at: c.demo.at, file: "whoosh", volume: 0.14 });
  for (const m of c.demo.msgs) if (m.name !== "m-dots") list.push({ at: m.at, file: "click", volume: 0.15 });
  list.push({ at: c.demo.booked, file: "chime", volume: 0.28 }); // the one confirmation
  list.push({ at: c.end.at, file: "whoosh", volume: 0.16 });
  list.push({ at: c.end.cta, file: "thud", volume: 0.18 });
  return list;
}

/** Music: ducked under the loss so the buzzer and the price have space, back up with Vallamo. */
function musicVolume(c: Cut, t: number) {
  const base = 0.5;
  const from = c.spend.price - 0.1;
  const back = c.meet ? c.meet.at : c.demo.at;
  const duck = t < from ? 0 : t < from + 0.1 ? (t - from) / 0.1 : t < back - 0.5 ? 1 : t < back ? 1 - (t - (back - 0.5)) / 0.5 : 0;
  const tail = Math.min(1, Math.max(0, (c.length - t) / 0.9));
  return base * (1 - 0.75 * duck) * tail;
}

export function PaidAd({ format = "45", cut = "main", music = false, sfx = false }: PaidProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const F = FORMATS[format];
  const c = CUTS[cut];
  const afterStory = c.meet ? c.meet.at : c.always ? c.always.at : c.demo.at;
  return (
    <FormatCtx.Provider value={F}>
      <CutCtx.Provider value={c}>
        <FilmClock.Provider value={t}>
          <AbsoluteFill style={{ background: "#FFFFFF" }}>
            {t < afterStory + 0.6 && <Story t={t} />}
            {c.meet && t >= c.meet.at && t < c.meet.out + 0.4 && <MeetClay t={t} />}
            {c.always && t >= c.always.at - 0.1 && t < c.always.out + 0.35 && <Always t={t} />}
            {t >= c.demo.at - 0.1 && t < c.demo.out + 0.35 && <Demo t={t} />}
            {t >= c.end.at - 0.1 && <End t={t} />}
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
