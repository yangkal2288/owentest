import { Composition } from "remotion";

import "./fonts";
import { STYLE_FRAMES, StyleFrames } from "./films/meet/style/StyleFrames";

// Register the "Meet Vallamo" X film here (e.g. a 1920x1080 composition "Meet-x" with fps as a prop).
// See ~/vallamo-film/HANDOFF-launch-film-3d.md §8 and §11.
export function Root() {
  return (
    <>
      {/* Gate 4: one style frame per frame. */}
      <Composition id="Meet-style" component={StyleFrames} width={1920} height={1080} fps={60} durationInFrames={STYLE_FRAMES} />
    </>
  );
}
