import { AbsoluteFill, Freeze, Sequence, useCurrentFrame, useVideoConfig } from "remotion";

import { MeetFilm } from "../meet/MeetFilm";
import { FILM_LENGTH } from "../meet/timeline";
import { MeetReframe } from "./MeetReframe";

/** "x" is the original 16:9 film itself; "916" and "45" are the reframed tall versions. */
export type CoverProps = { fps?: number; format?: "916" | "45" | "11" | "x" };

/**
 * The reframed film with its cover built in, as one file: the first frame is the cover (the
 * question at its fullest, every unanswered enquiry piled up), held so it is what shows before
 * play and what a thumbnail picks; then it lifts to white and the film starts exactly as made.
 */
export const COVER_FREEZE = 3.5; // film seconds: the headline complete, the pile at its fullest
export const COVER_HOLD = 0.3; // the cover, held
export const COVER_FADE = 0.2; // into the film's white first frame
export const COVER_LENGTH = COVER_HOLD + COVER_FADE;
export const coverFilmLength = FILM_LENGTH + COVER_LENGTH;

export function MeetCover({ format = "916" }: CoverProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const fade = Math.min(1, Math.max(0, (t - COVER_HOLD) / COVER_FADE));
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <Sequence from={Math.round(COVER_LENGTH * fps)}>
        {format === "x" ? <MeetFilm /> : <MeetReframe format={format} />}
      </Sequence>
      {t < COVER_LENGTH && (
        <AbsoluteFill style={{ opacity: 1 - fade * fade * (3 - 2 * fade) }}>
          <Freeze frame={Math.round(COVER_FREEZE * fps)}>
            {format === "x" ? <MeetFilm /> : <MeetReframe format={format} />}
          </Freeze>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
