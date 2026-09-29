import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { FilmClock } from "../meet/motion";
import { World } from "../cinema/kit";
import { FORMATS, FormatCtx, type Format } from "../meta/format";
import { Chat } from "./scenes/Chat";
import { Diary } from "./scenes/Diary";
import { Offer } from "./scenes/Offer";
import { Open } from "./scenes/Open";
import { GROWTH, GrowthCtx, type GrowthCut } from "./timing";

export type GrowthProps = { fps?: number; format?: Format["id"]; cut?: GrowthCut["id"]; music?: boolean; sfx?: boolean };

/** Restrained sound: soft landings for the words, a click per message, one confirmation per booking. */
function sfxFor(g: GrowthCut) {
  const list: { at: number; file: string; volume: number }[] = [];
  g.open.lines.forEach((at, i) => list.push({ at: Math.max(0, at + 0.1), file: "thud", volume: 0.1 + i * 0.02 }));
  list.push({ at: g.open.revenue + 0.2, file: "whoosh", volume: 0.1 });
  if (g.channels) {
    list.push({ at: g.channels.at, file: "whoosh", volume: 0.14 });
    for (const c of g.channels.cards) list.push({ at: c + 0.1, file: "click", volume: 0.16 });
    list.push({ at: g.channels.focus, file: "whoosh", volume: 0.14 });
  }
  list.push({ at: g.chat.head, file: "whoosh", volume: 0.12 });
  for (const m of g.chat.msgs) if (m.name !== "m-dots") list.push({ at: m.at, file: "click", volume: 0.15 });
  list.push({ at: g.chat.booked, file: "chime", volume: 0.26 });
  list.push({ at: g.diary.at, file: "whoosh", volume: 0.14 });
  list.push({ at: g.diary.land, file: "thud", volume: 0.2 }, { at: g.diary.land + 0.02, file: "chime", volume: 0.16 });
  list.push({ at: g.diary.price, file: "click", volume: 0.18 });
  for (const b of g.benefits) list.push({ at: b.at, file: "whoosh", volume: 0.1 }, { at: b.drop, file: "chime", volume: 0.12 });
  list.push({ at: g.offer.at, file: "whoosh", volume: 0.18 });
  list.push({ at: g.offer.card, file: "thud", volume: 0.14 });
  list.push({ at: g.offer.wipe, file: "whoosh", volume: 0.14 }, { at: g.offer.wipe + 0.35, file: "chime", volume: 0.2 });
  list.push({ at: g.offer.cta, file: "thud", volume: 0.18 });
  return list;
}

export function GrowthAd({ format = "45", cut = "main", music = false, sfx = false }: GrowthProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const F = FORMATS[format];
  const g = GROWTH[cut];
  const chatFrom = g.channels ? g.channels.at - 0.05 : g.chat.at - 0.05;
  return (
    <FormatCtx.Provider value={F}>
      <GrowthCtx.Provider value={g}>
        <FilmClock.Provider value={t}>
          <AbsoluteFill style={{ background: "#FBF8F2" }}>
            {/* One world under the whole story: the real diary, in depth, drifting. */}
            {t < g.offer.at + 0.8 && <World kind="week" t={t} blur={16} wash={0.84} zoom={1.2 + 0.004 * t} spin={-12} tilt={56} />}
            {t < g.open.out + 0.5 && <Open t={t} />}
            {t >= chatFrom && t < g.chat.out + 0.5 && <Chat t={t} />}
            {t >= g.diary.at - 0.05 && t < g.offer.at + 0.8 && <Diary t={t} />}
            {t >= g.offer.at && <Offer t={t} />}
          </AbsoluteFill>
          {music && <Audio src={staticFile(g.music)} volume={(f) => 0.5 * Math.min(1, Math.max(0, (g.length - f / fps) / 0.9))} />}
          {sfx &&
            sfxFor(g).map((x, i) => (
              <Sequence key={i} from={Math.round(x.at * fps)} durationInFrames={Math.round(1.5 * fps)} layout="none">
                <Audio src={staticFile(`audio/sfx/${x.file}.wav`)} volume={x.volume} />
              </Sequence>
            ))}
        </FilmClock.Provider>
      </GrowthCtx.Provider>
    </FormatCtx.Provider>
  );
}
export const growthLength = (cut: GrowthCut["id"]) => GROWTH[cut].length;
