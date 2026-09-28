import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { continueRender, delayRender, Img, staticFile } from "remotion";

import PIECES from "../../pieces.json";

export type PieceName = keyof typeof PIECES;
export const pieceSize = (name: PieceName) => PIECES[name] as { w: number; h: number };

/**
 * One real Vallamo UI element (scripts/pieces.mjs): the app's own markup and CSS.
 * By default it is shown as its 4x transparent render (scripts/pieces-png.mjs),
 * which moves at sub-pixel precision. With `css` it is the live DOM in an
 * iframe (CSS zoom, vector-crisp) and `css` is written per frame into its
 * <style id="film-dyn">; live pieces snap to whole pixels, so never glide them slowly.
 */
export function Piece({ name, w, css, style }: { name: PieceName; w: number; css?: string; style?: CSSProperties }) {
  if (css === undefined) {
    const size = pieceSize(name);
    return <Img src={staticFile(`ui/pieces/png/${name}.png`)} style={{ display: "block", width: w, height: (w * size.h) / size.w, ...style }} />;
  }
  return <LivePiece name={name} w={w} css={css} style={style} />;
}

function LivePiece({ name, w, css, style }: { name: PieceName; w: number; css: string; style?: CSSProperties }) {
  const size = pieceSize(name);
  const zoom = w / size.w;
  const ref = useRef<HTMLIFrameElement>(null);
  const [handle] = useState(() => delayRender(`piece:${name}`, { timeoutInMilliseconds: 60000 }));
  const latest = useRef({ zoom, css });
  latest.current = { zoom, css };

  const apply = () => {
    const doc = ref.current?.contentDocument;
    if (!doc?.documentElement) return;
    const z = String(latest.current.zoom);
    if (doc.documentElement.style.zoom !== z) doc.documentElement.style.zoom = z;
    const dyn = doc.getElementById("film-dyn");
    if (dyn && dyn.textContent !== latest.current.css) dyn.textContent = latest.current.css;
  };
  useLayoutEffect(apply);

  return (
    <iframe
      ref={ref}
      src={staticFile(`ui/pieces/${name}.html`)}
      scrolling="no"
      onLoad={async () => {
        apply();
        try {
          await ref.current?.contentDocument?.fonts.ready;
        } finally {
          continueRender(handle);
        }
      }}
      style={{ display: "block", border: 0, background: "transparent", width: Math.ceil(size.w * zoom), height: Math.ceil(size.h * zoom), colorScheme: "light", ...style }}
    />
  );
}
