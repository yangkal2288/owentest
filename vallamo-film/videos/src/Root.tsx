import { Composition } from "remotion";

import "./fonts";
import { MeetFilm, type MeetProps } from "./films/meet/MeetFilm";
import { S04_LENGTH, S04Channels } from "./films/meet/scenes/S04Channels";
import { PieceTest } from "./films/meet/dev/PieceTest";
import { STYLE_FRAMES, StyleFrames } from "./films/meet/style/StyleFrames";
import { FILM_LENGTH } from "./films/meet/timeline";
import { MetaAd, metaLength, type MetaProps } from "./films/meta/MetaAd";
import { PaidAd, paidLength, type PaidProps } from "./films/paid/PaidAd";
import { CineTest } from "./films/cinema/Test";
import { HalloweenTest } from "./films/halloween/Test";
import { HalloweenFilm, halloweenLength, type HalloweenProps } from "./films/halloween/Film";

// "Meet Vallamo", the X film: one 1920x1080 composition. `fps` is a prop so
// scripts/render-film.sh can render the 240 fps master for motion blur.
// See ~/vallamo-film/HANDOFF-launch-film-3d.md §8 and §11.
const film = ({ props }: { props: MeetProps }) => {
  const fps = props.fps ?? 60;
  return { fps, durationInFrames: Math.round(FILM_LENGTH * fps) };
};

const meta = ({ props }: { props: MetaProps }) => {
  const fps = props.fps ?? 60;
  return { fps, durationInFrames: Math.round(metaLength(props.cut ?? "30") * fps) };
};

const paid = ({ props }: { props: PaidProps }) => {
  const fps = props.fps ?? 60;
  return { fps, durationInFrames: Math.round(paidLength(props.cut ?? "main") * fps) };
};

const halloween = ({ props }: { props: HalloweenProps }) => {
  const fps = props.fps ?? 60;
  return { fps, durationInFrames: Math.round(halloweenLength(props.cut ?? "70") * fps) };
};

export function Root() {
  return (
    <>
      <Composition id="Meet-x" component={MeetFilm} width={1920} height={1080} fps={60} durationInFrames={Math.round(FILM_LENGTH * 60)} defaultProps={{ fps: 60 } as MeetProps} calculateMetadata={film} />
      {/* Gate 6: the animatic, with the VO guide line and the TEMP music bed. */}
      <Composition id="Meet-animatic" component={MeetFilm} width={1920} height={1080} fps={60} durationInFrames={Math.round(FILM_LENGTH * 60)} defaultProps={{ fps: 60, guide: true, music: true, sfx: true, vo: true } as MeetProps} calculateMetadata={film} />
      {/* The Meta ad (VALLAMO_META_AD_PRODUCTION_BRIEF.md): 9:16 for Reels and Stories, 4:5 for Feed. */}
      <Composition id="Meta-916" component={MetaAd} width={1080} height={1920} fps={60} durationInFrames={Math.round(metaLength("30") * 60)} defaultProps={{ fps: 60, format: "916" } as MetaProps} calculateMetadata={meta} />
      <Composition id="Meta-45" component={MetaAd} width={1080} height={1350} fps={60} durationInFrames={Math.round(metaLength("30") * 60)} defaultProps={{ fps: 60, format: "45" } as MetaProps} calculateMetadata={meta} />
      <Composition id="Meta-mix" component={MetaAd} width={1080} height={1920} fps={60} durationInFrames={Math.round(metaLength("30") * 60)} defaultProps={{ fps: 60, format: "916", music: true, sfx: true } as MetaProps} calculateMetadata={meta} />
      <Composition id="Meta15-916" component={MetaAd} width={1080} height={1920} fps={60} durationInFrames={Math.round(metaLength("15") * 60)} defaultProps={{ fps: 60, format: "916", cut: "15" } as MetaProps} calculateMetadata={meta} />
      <Composition id="Meta15-45" component={MetaAd} width={1080} height={1350} fps={60} durationInFrames={Math.round(metaLength("15") * 60)} defaultProps={{ fps: 60, format: "45", cut: "15" } as MetaProps} calculateMetadata={meta} />
      <Composition id="Meta15-mix" component={MetaAd} width={1080} height={1920} fps={60} durationInFrames={Math.round(metaLength("15") * 60)} defaultProps={{ fps: 60, format: "916", cut: "15", music: true, sfx: true } as MetaProps} calculateMetadata={meta} />
      {/* "You paid for the enquiry" (VALLAMO_MARKETING_SPEND_AD_PRODUCTION_BRIEF.md): main ~35 s and 15 s cuts, 4:5 and 9:16. */}
      <Composition id="Paid-main-45" component={PaidAd} width={1080} height={1350} fps={60} durationInFrames={Math.round(paidLength("main") * 60)} defaultProps={{ fps: 60, format: "45", cut: "main" } as PaidProps} calculateMetadata={paid} />
      <Composition id="Paid-main-916" component={PaidAd} width={1080} height={1920} fps={60} durationInFrames={Math.round(paidLength("main") * 60)} defaultProps={{ fps: 60, format: "916", cut: "main" } as PaidProps} calculateMetadata={paid} />
      <Composition id="Paid-main-mix" component={PaidAd} width={1080} height={1350} fps={60} durationInFrames={Math.round(paidLength("main") * 60)} defaultProps={{ fps: 60, format: "45", cut: "main", music: true, sfx: true } as PaidProps} calculateMetadata={paid} />
      <Composition id="Paid-short-45" component={PaidAd} width={1080} height={1350} fps={60} durationInFrames={Math.round(paidLength("short") * 60)} defaultProps={{ fps: 60, format: "45", cut: "short" } as PaidProps} calculateMetadata={paid} />
      <Composition id="Paid-short-916" component={PaidAd} width={1080} height={1920} fps={60} durationInFrames={Math.round(paidLength("short") * 60)} defaultProps={{ fps: 60, format: "916", cut: "short" } as PaidProps} calculateMetadata={paid} />
      <Composition id="Paid-short-mix" component={PaidAd} width={1080} height={1350} fps={60} durationInFrames={Math.round(paidLength("short") * 60)} defaultProps={{ fps: 60, format: "45", cut: "short", music: true, sfx: true } as PaidProps} calculateMetadata={paid} />
      {/* "The Booking Thief", the Halloween film (VALLAMO_HALLOWEEN_SELF_SERVE_AD_BRIEF.md): 70, 35 and 15 s, 4:5 and 9:16. */}
      <Composition id="Halloween-70-45" component={HalloweenFilm} width={1080} height={1350} fps={60} durationInFrames={Math.round(halloweenLength("70") * 60)} defaultProps={{ fps: 60, format: "45", cut: "70" } as HalloweenProps} calculateMetadata={halloween} />
      <Composition id="Halloween-70-916" component={HalloweenFilm} width={1080} height={1920} fps={60} durationInFrames={Math.round(halloweenLength("70") * 60)} defaultProps={{ fps: 60, format: "916", cut: "70" } as HalloweenProps} calculateMetadata={halloween} />
      <Composition id="Halloween-70-mix" component={HalloweenFilm} width={1080} height={1350} fps={60} durationInFrames={Math.round(halloweenLength("70") * 60)} defaultProps={{ fps: 60, format: "45", cut: "70", music: true, sfx: true } as HalloweenProps} calculateMetadata={halloween} />
      <Composition id="Halloween-35-45" component={HalloweenFilm} width={1080} height={1350} fps={60} durationInFrames={Math.round(halloweenLength("35") * 60)} defaultProps={{ fps: 60, format: "45", cut: "35" } as HalloweenProps} calculateMetadata={halloween} />
      <Composition id="Halloween-35-916" component={HalloweenFilm} width={1080} height={1920} fps={60} durationInFrames={Math.round(halloweenLength("35") * 60)} defaultProps={{ fps: 60, format: "916", cut: "35" } as HalloweenProps} calculateMetadata={halloween} />
      <Composition id="Halloween-35-mix" component={HalloweenFilm} width={1080} height={1350} fps={60} durationInFrames={Math.round(halloweenLength("35") * 60)} defaultProps={{ fps: 60, format: "45", cut: "35", music: true, sfx: true } as HalloweenProps} calculateMetadata={halloween} />
      <Composition id="Halloween-15-45" component={HalloweenFilm} width={1080} height={1350} fps={60} durationInFrames={Math.round(halloweenLength("15") * 60)} defaultProps={{ fps: 60, format: "45", cut: "15" } as HalloweenProps} calculateMetadata={halloween} />
      <Composition id="Halloween-15-916" component={HalloweenFilm} width={1080} height={1920} fps={60} durationInFrames={Math.round(halloweenLength("15") * 60)} defaultProps={{ fps: 60, format: "916", cut: "15" } as HalloweenProps} calculateMetadata={halloween} />
      <Composition id="Halloween-15-mix" component={HalloweenFilm} width={1080} height={1350} fps={60} durationInFrames={Math.round(halloweenLength("15") * 60)} defaultProps={{ fps: 60, format: "45", cut: "15", music: true, sfx: true } as HalloweenProps} calculateMetadata={halloween} />
      <Composition id="Halloween-test" component={HalloweenTest} width={1080} height={1920} fps={60} durationInFrames={60} />
      <Composition id="Cine-test" component={CineTest} width={1080} height={1350} fps={60} durationInFrames={60} />
      {/* Scene previews, one per shot. */}
      <Composition id="Meet-s04" component={S04Channels} width={1920} height={1080} fps={60} durationInFrames={Math.round(S04_LENGTH * 60)} />
      <Composition id="Meet-pieces" component={PieceTest} width={1920} height={1080} fps={60} durationInFrames={1} />
      {/* Gate 4: one style frame per frame. */}
      <Composition id="Meet-style" component={StyleFrames} width={1920} height={1080} fps={60} durationInFrames={STYLE_FRAMES} />
    </>
  );
}
