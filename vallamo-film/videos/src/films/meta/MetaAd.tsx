import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { FilmClock } from "../meet/motion";
import { Sweep } from "../cinema/kit";
import { FORMATS, FormatCtx, type Format } from "./format";
import { End } from "./scenes/End";
import { Lost } from "./scenes/Lost";
import { Product } from "./scenes/Product";
import { META_CUTS, MetaCutCtx, type MetaCut } from "./timeline";

export type MetaProps = { fps?: number; format?: Format["id"]; cut?: MetaCut["id"]; music?: boolean; sfx?: boolean };

/** Sound: soft, few, on the picture's events. */
function sfxFor(c: MetaCut) {
  const { lost: l, product: p, end: e } = c;
  const list: { at: number; file: string; volume: number }[] = [
    { at: 0.42, file: "chime", volume: 0.16 }, // the enquiry lands
    ...l.ticks.slice(0, 9).map((at, i) => ({ at, file: "click", volume: 0.07 + i * 0.01 })),
    { at: l.ticks[9], file: "thud", volume: 0.26 }, // ten
    { at: l.reply, file: "click", volume: 0.2 }, // "booked somewhere else"
    { at: l.crack, file: "click", volume: 0.3 }, // it cracks
    { at: l.shatter, file: "thud", volume: 0.42 }, // and shatters
    { at: l.shatter, file: "whoosh", volume: 0.24 },
    { at: p.P - 0.38, file: "whoosh", volume: 0.2 },
    { at: p.MEET, file: "whoosh", volume: 0.16 },
    ...p.pills.map((at) => ({ at, file: "thud", volume: 0.12 })),
    { at: p.BOOKED, file: "chime", volume: 0.3 }, // booked
    { at: p.WIPE, file: "whoosh", volume: 0.2 },
    { at: e.cta, file: "thud", volume: 0.2 }, // the CTA
    { at: e.voice, file: "chime", volume: 0.14 }, // voice, coming in October
  ];
  for (const m of p.msgs) if (m.name !== "m-dots") list.push({ at: m.at, file: "click", volume: m.name.startsWith("m-i") ? 0.22 : 0.2 });
  if (Number.isFinite(p.PROOF)) list.push({ at: p.PROOF, file: "whoosh", volume: 0.14 });
  return list;
}

export function MetaAd({ format = "916", cut = "30", music = false, sfx = false }: MetaProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const F = FORMATS[format];
  const c = META_CUTS[cut];
  return (
    <FormatCtx.Provider value={F}>
      <MetaCutCtx.Provider value={c}>
        <FilmClock.Provider value={t}>
          <AbsoluteFill style={{ background: "#FFFFFF" }}>
            {t < c.product.P + 0.4 && <Lost t={t} />}
            {t > c.product.P - 0.4 && t < c.product.WIPE + 1 && <Product t={t} />}
            {t >= c.product.WIPE && <End t={t} />}
            <Sweep t={t} at={c.product.P + 0.6} len={1.0} strength={0.4} />
            <Sweep t={t} at={c.product.BOOKED + 0.15} len={1.0} strength={0.45} />
          </AbsoluteFill>
          {music && <Audio src={staticFile(c.music)} volume={(f) => (cut === "30" ? 0.5 : 0.5 * Math.min(1, Math.max(0, (c.length - f / fps) / 0.9)))} />}
          {sfx &&
            sfxFor(c).map((x, i) => (
              <Sequence key={i} from={Math.round(x.at * fps)} durationInFrames={Math.round(1.5 * fps)} layout="none">
                <Audio src={staticFile(`audio/sfx/${x.file}.wav`)} volume={x.volume} />
              </Sequence>
            ))}
        </FilmClock.Provider>
      </MetaCutCtx.Provider>
    </FormatCtx.Provider>
  );
}
export const metaLength = (cut: MetaCut["id"]) => META_CUTS[cut].length;
