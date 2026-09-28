import { AbsoluteFill } from "remotion";

import { useTime } from "../../../kit/time";
import PIECES from "../../../pieces.json";
import { blurIn, mix, settle, tween } from "../motion";
import { accent, FloorShadow, giant } from "../parts";
import { Piece, pieceSize } from "../Piece";

/**
 * Shot 8 · Watch it fill up (5 s). "…and watch it fill up."
 * The real Bookings week view (21–27 Sep) as live app DOM, tilted. The THU 24
 * card from shot 6 flies in and becomes Sarah's block at Thursday 6pm; then the
 * rest of the week's real bookings drop into their own slots, staggered.
 * Every block is the app's own element, animated per frame through film-dyn.
 * Out: push into Sarah's block.
 */
export const S08_LENGTH = 5;

const W8 = 1.12;
const BLOCKS = PIECES.week.blocks;
const KEEP = new Set(["Emily Carter", "Megan Carter"]); // already booked when we arrive (the first of each)
const isSarah = (who: string) => who.startsWith("Sarah Mitchell");
const kept = new Set<string>();
for (const b of BLOCKS) {
  const name = b.who.replace(/\d.*$/, "").trim();
  if (KEEP.has(name) && ![...kept].some((id) => BLOCKS.find((x) => x.id === id)!.who.startsWith(name))) kept.add(b.id);
}
const CASCADE = BLOCKS.filter((b) => !kept.has(b.id) && !isSarah(b.who)).sort((p, q) => p.x - q.x || p.y - q.y);
const SARAH = BLOCKS.find((b) => isSarah(b.who))!;
const r8 = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x * W8, y: b.y * W8, w: b.w * W8, h: b.h * W8 });

export function S08Fill() {
  const t = useTime();
  const enter = tween(t, 0, 0.45);
  const push = tween(t, 4.5, 0.5);
  const sr = r8(SARAH);
  const fly = settle(t, 0.25, 5.5);
  const from = { x: sr.x + 520, y: sr.y - 900, w: 263 * 1.5 };
  const morph = tween(fly, 0.8, 0.2);

  // Per-frame CSS for the blocks inside the live week view.
  let css = "";
  CASCADE.forEach((b, k) => {
    const u = settle(t, 1.2 + k * 0.085, 9);
    css += `[data-film="${b.id}"]{opacity:${Math.min(1, u * 3).toFixed(3)};transform:translateY(${(-36 * (1 - u)).toFixed(2)}px) scale(${(1 + 0.22 * (1 - u)).toFixed(4)});filter:blur(${(4 * (1 - u)).toFixed(2)}px)}`;
  });
  css += `[data-film="${SARAH.id}"]{opacity:${morph.toFixed(3)}}`;

  const size = pieceSize("week");
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + push * 0.8})`, transformOrigin: "1380px 760px", opacity: 1 - tween(t, 4.75, 0.25) }}>
        <div style={{ position: "absolute", left: 140, top: 390 }}>
          <div style={{ ...giant(88), ...blurIn(t, 0.5) }}>Watch your</div>
          <div style={{ ...giant(88), marginTop: 6, ...blurIn(t, 0.62) }}>
            diary <span style={accent(108)}>fill up.</span>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, perspective: 2400, transform: `translateX(${(1 - enter) * (1 - enter) * 1400}px)`, filter: enter < 1 ? `blur(${(1 - enter) * 24}px)` : undefined }}>
          <div
            style={{
              position: "absolute",
              left: 860,
              top: 90,
              width: size.w * W8,
              height: size.h * W8,
              transformStyle: "preserve-3d",
              transform: "rotateX(40deg) rotateZ(-13deg)",
              transformOrigin: "30% 60%",
            }}
          >
            <Piece name="week" w={size.w * W8} css={css} />
            {/* THU 24 · Anti-Wrinkle Consultation → Sarah's block at Thursday 6pm. */}
            <FloorShadow x={sr.x} y={sr.y} w={sr.w} h={sr.h} height={300 * (1 - fly)} style={{ transform: "translateZ(1px)", opacity: 0.3 * (1 - fly) }} />
            <div
              style={{
                position: "absolute",
                left: mix(from.x, sr.x, fly),
                top: mix(from.y, sr.y, fly),
                transform: `translateZ(${300 * (1 - fly)}px) rotateX(${-40 * (1 - fly)}deg)`,
                transformOrigin: "50% 100%",
                opacity: 1 - morph,
              }}
            >
              <Piece name="upcoming-card" w={mix(from.w, sr.w, fly)} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
