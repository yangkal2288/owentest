import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { FilmClock } from "../meet/motion";
import { FORMATS, FormatCtx, type Format } from "./format";
import { End } from "./scenes/End";
import { LOST_TICKS, Lost } from "./scenes/Lost";
import { Product, WIPE } from "./scenes/Product";
import { CUT, DOWNBEAT, LENGTH } from "./timeline";

export type MetaProps = { fps?: number; format?: Format["id"]; music?: boolean; sfx?: boolean };

/** Sound: soft, few, on the picture's events. */
const SFX: { at: number; file: string; volume: number }[] = [
  { at: 0.42, file: "chime", volume: 0.16 }, // the enquiry lands
  ...LOST_TICKS.map((at, i) => ({ at, file: "click", volume: i === 9 ? 0 : 0.07 + i * 0.01 })),
  { at: LOST_TICKS[9], file: "thud", volume: 0.26 }, // ten
  { at: 6.55, file: "click", volume: 0.18 }, // "booked somewhere else"
  { at: 7.8, file: "whoosh", volume: 0.2 },
  { at: 8.5, file: "click", volume: 0.2 }, // her enquiry
  { at: 9.04, file: "click", volume: 0.22 }, // Isla, straight away
  { at: DOWNBEAT(4), file: "whoosh", volume: 0.16 },
  { at: DOWNBEAT(4) + 0.2, file: "thud", volume: 0.12 },
  { at: DOWNBEAT(4) + 0.54, file: "thud", volume: 0.12 },
  { at: DOWNBEAT(4) + 0.87, file: "thud", volume: 0.12 },
  { at: DOWNBEAT(5), file: "whoosh", volume: 0.14 },
  { at: 16.45, file: "click", volume: 0.2 },
  { at: 17.02, file: "click", volume: 0.22 },
  { at: DOWNBEAT(7), file: "chime", volume: 0.3 }, // booked
  { at: WIPE, file: "whoosh", volume: 0.2 },
  { at: DOWNBEAT(9) + 2 * (60 / 89.1), file: "thud", volume: 0.2 }, // the CTA
];

export function MetaAd({ format = "916", music = false, sfx = false }: MetaProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const F = FORMATS[format];
  return (
    <FormatCtx.Provider value={F}>
      <FilmClock.Provider value={t}>
        <AbsoluteFill style={{ background: "#FFFFFF" }}>
          {t < CUT.product + 0.4 && <Lost t={t} />}
          {t > CUT.product - 0.4 && t < CUT.end + 0.6 && <Product t={t} />}
          {t >= WIPE && <End t={t} />}
        </AbsoluteFill>
        {music && <Audio src={staticFile("audio/music-meta.wav")} volume={0.5} />}
        {sfx &&
          SFX.filter((c) => c.volume > 0).map((c, i) => (
            <Sequence key={i} from={Math.round(c.at * fps)} durationInFrames={Math.round(1.5 * fps)} layout="none">
              <Audio src={staticFile(`audio/sfx/${c.file}.wav`)} volume={c.volume} />
            </Sequence>
          ))}
      </FilmClock.Provider>
    </FormatCtx.Provider>
  );
}
export const META_LENGTH = LENGTH;
