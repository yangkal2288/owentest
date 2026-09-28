import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

// The UI world: the real app at a desktop viewport (snapshots are 1440 wide).
export const WORLD = { width: 1440, height: 1400 };

/**
 * One real Vallamo screen: a static DOM snapshot of the app (scripts/snapshot.mjs)
 * in an iframe at the desktop viewport, so the app's own breakpoints apply.
 * Motion is written per frame into the snapshot's <style id="film-dyn">, so
 * every state is a pure function of time.
 */
export function UIFrame({ snap, css, style }: { snap: string; css: string; style?: CSSProperties }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [handle] = useState(() => delayRender(`ui:${snap}`, { timeoutInMilliseconds: 60000 }));
  const latest = useRef(css);
  latest.current = css;

  const apply = () => {
    const el = ref.current?.contentDocument?.getElementById("film-dyn");
    if (el && el.textContent !== latest.current) el.textContent = latest.current;
  };
  useLayoutEffect(apply);

  return (
    <iframe
      ref={ref}
      src={staticFile(`ui/snaps/${snap}.html`)}
      onLoad={async () => {
        apply();
        try {
          await ref.current?.contentDocument?.fonts.ready;
        } finally {
          continueRender(handle);
        }
      }}
      style={{ position: "absolute", left: 0, top: 0, width: WORLD.width, height: WORLD.height, border: 0, background: "transparent", ...style }}
    />
  );
}
