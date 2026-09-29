import { AbsoluteFill } from "remotion";

import { C } from "../../../brand";
import { settle, tween } from "../../meet/motion";
import { Piece, pieceSize, type PieceName } from "../../meet/Piece";
import { Dot, Float, SHADOW, Sweep } from "../../cinema/kit";
import { pick, useF } from "../../meta/format";
import { display, em, eyebrow } from "../../meta/type";
import { Reveal, Swash } from "../parts";
import { useGrowth } from "../timing";

/**
 * The gain, legible from the first frame: CLINIC OWNERS / More bookings. / More revenue. (gold,
 * underlined as it lands) / Less admin. Big editorial type, left-aligned, rising out of its own
 * baseline on the beat. Behind it (main cut) the real booking result rises out of depth.
 */
export function Open({ t }: { t: number }) {
  const F = useF();
  const g = useGrowth();
  const o = g.open;
  const size = pick(F, 146, 124);
  const lh = size * 1.06;
  const x = pick(F, 84, 84);
  const top = pick(F, 330, 150);
  const lines: [string, "plain" | "gold" | "dot"][] = [
    ["More bookings.", "plain"],
    ["More revenue.", "gold"],
    ["Less admin", "dot"],
  ];
  const shown = lines.slice(0, o.lines.length);
  const out = (i: number) => o.out + i * 0.05;
  const R = pick(F, 3.0, 2.4);
  const cardsTop = pick(F, 1010, 640);
  const leave = tween(t, o.out, 0.35);
  return (
    <AbsoluteFill>
      {/* The real booking result, rising out of depth behind the words. */}
      {t > o.booking - 0.1 && (
        <div style={{ position: "absolute", left: (F.W - 263 * R) / 2, top: cardsTop, perspective: 1600, opacity: 1 - leave, transform: `translateY(${leave * 220}px) scale(${1 + leave * 0.15})`, filter: leave > 0 ? `blur(${leave * 18}px)` : undefined }}>
          {(["g-outcome", "g-upcoming"] as PieceName[]).map((name, i) => {
            const u = settle(t, o.booking + i * 0.16, 8);
            return (
              <div key={name} style={{ marginTop: i ? 24 : 0, opacity: Math.min(1, u * 1.8), filter: u < 0.97 ? `blur(${(1 - u) * 18}px)` : undefined, transform: `translate3d(0, ${(1 - u) * 180}px, ${(1 - u) * -600}px) rotateX(${(1 - u) * 30}deg)` }}>
                <Float t={t + i * 1.3} sway={0.6}>
                  <div style={{ borderRadius: 12 * R, background: C.paper, boxShadow: SHADOW.lift }}>
                    <Piece name={name} w={pieceSize(name).w * R} />
                  </div>
                </Float>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ position: "absolute", left: x, right: x, top: top - pick(F, 70, 60) }}>
        <Reveal t={t} at={-0.3} out={o.out} len={0.4}>
          <div style={{ ...eyebrow(pick(F, 34, 30)) }}>Clinic owners</div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", left: x, right: 0, top }}>
        {shown.map(([text, kind], i) => (
          <div key={text} style={{ height: lh }}>
            <Reveal t={t} at={o.lines[i]} out={out(i)} len={0.5}>
              <div style={{ ...display(size), lineHeight: 1.02, whiteSpace: "nowrap", position: "relative", display: "inline-block" }}>
                {kind === "gold" ? (
                  <span style={{ position: "relative", display: "inline-block" }}>
                    <span style={{ color: C.clay }}>More </span>
                    <span style={{ ...em(size + 6), color: C.clay }}>revenue.</span>
                    <Swash u={tween(t, o.revenue + 0.2, 0.5)} width={size * 5.6} thick={size * 0.07} />
                  </span>
                ) : kind === "dot" ? (
                  <span>
                    {text}
                    <Dot t={t} at={o.lines[i] + 0.3} size={size * 0.2} />
                  </span>
                ) : (
                  text
                )}
              </div>
            </Reveal>
          </div>
        ))}
      </div>
      {/* A warm light crossing the words as the last line lands. */}
      <Sweep t={t} at={o.lines[o.lines.length - 1] + 0.25} len={1.0} strength={0.4} />
    </AbsoluteFill>
  );
}
