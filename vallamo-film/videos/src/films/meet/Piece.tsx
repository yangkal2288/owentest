import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

import PIECES from "../../pieces.json";

export type PieceName = keyof typeof PIECES;
export const pieceSize = (name: PieceName) => PIECES[name] as { w: number; h: number };

/**
 * One real Vallamo UI element as live DOM (scripts/pieces.mjs): the app's own
 * markup and CSS in a transparent iframe, sized with CSS zoom so text and
 * edges are vector-crisp at any scale. `w` is the on-screen width; `css` is
 * written per frame into the piece's <style id="film-dyn"> (pure function of time).
 */
export function Piece({ name, w, css = "", style }: { name: PieceName; w: number; css?: string; style?: CSSProperties }) {
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
