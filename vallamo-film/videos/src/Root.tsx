import { Composition } from "remotion";

import "./fonts";
import { MeetFilm, type MeetProps } from "./films/meet/MeetFilm";
import { S04_LENGTH, S04Channels } from "./films/meet/scenes/S04Channels";
import { PieceTest } from "./films/meet/dev/PieceTest";
import { STYLE_FRAMES, StyleFrames } from "./films/meet/style/StyleFrames";
import { FILM_LENGTH } from "./films/meet/timeline";
import { META_LENGTH, MetaAd, type MetaProps } from "./films/meta/MetaAd";

// "Meet Vallamo", the X film: one 1920x1080 composition. `fps` is a prop so
// scripts/render-film.sh can render the 240 fps master for motion blur.
// See ~/vallamo-film/HANDOFF-launch-film-3d.md §8 and §11.
const film = ({ props }: { props: MeetProps }) => {
  const fps = props.fps ?? 60;
  return { fps, durationInFrames: Math.round(FILM_LENGTH * fps) };
};

const meta = ({ props }: { props: MetaProps }) => {
  const fps = props.fps ?? 60;
  return { fps, durationInFrames: Math.round(META_LENGTH * fps) };
};

export function Root() {
  return (
    <>
      <Composition id="Meet-x" component={MeetFilm} width={1920} height={1080} fps={60} durationInFrames={Math.round(FILM_LENGTH * 60)} defaultProps={{ fps: 60 } as MeetProps} calculateMetadata={film} />
      {/* Gate 6: the animatic, with the VO guide line and the TEMP music bed. */}
      <Composition id="Meet-animatic" component={MeetFilm} width={1920} height={1080} fps={60} durationInFrames={Math.round(FILM_LENGTH * 60)} defaultProps={{ fps: 60, guide: true, music: true, sfx: true, vo: true } as MeetProps} calculateMetadata={film} />
      {/* The Meta ad (VALLAMO_META_AD_PRODUCTION_BRIEF.md): 9:16 for Reels and Stories, 4:5 for Feed. */}
      <Composition id="Meta-916" component={MetaAd} width={1080} height={1920} fps={60} durationInFrames={Math.round(META_LENGTH * 60)} defaultProps={{ fps: 60, format: "916" } as MetaProps} calculateMetadata={meta} />
      <Composition id="Meta-45" component={MetaAd} width={1080} height={1350} fps={60} durationInFrames={Math.round(META_LENGTH * 60)} defaultProps={{ fps: 60, format: "45" } as MetaProps} calculateMetadata={meta} />
      <Composition id="Meta-mix" component={MetaAd} width={1080} height={1920} fps={60} durationInFrames={Math.round(META_LENGTH * 60)} defaultProps={{ fps: 60, format: "916", music: true, sfx: true } as MetaProps} calculateMetadata={meta} />
      {/* Scene previews, one per shot. */}
      <Composition id="Meet-s04" component={S04Channels} width={1920} height={1080} fps={60} durationInFrames={Math.round(S04_LENGTH * 60)} />
      <Composition id="Meet-pieces" component={PieceTest} width={1920} height={1080} fps={60} durationInFrames={1} />
      {/* Gate 4: one style frame per frame. */}
      <Composition id="Meet-style" component={StyleFrames} width={1920} height={1080} fps={60} durationInFrames={STYLE_FRAMES} />
    </>
  );
}
