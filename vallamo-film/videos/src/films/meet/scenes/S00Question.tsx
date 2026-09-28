import { AbsoluteFill } from "remotion";

import { C } from "../../../brand";
import { useTime } from "../../../kit/time";
import { BEAT, blurIn, settle, tween } from "../motion";
import { Bit, Card, eyebrow, FloorShadow, giant, Logo } from "../parts";
import { Piece, type PieceName } from "../Piece";

/**
 * Shot 0 · The question (4.2 s, no VO). From Owen's mockup, rebuilt in the
 * film's world and made to stop the scroll (Owen: "way more poppy… eye catching").
 * The words slam in; "unanswered" gets a solid clay block wiped in behind it and
 * turns white. On the right, real enquiries fly in on the music's beats and pile
 * up at angles, eight of them, with a blurred haze of more behind: the pain,
 * visible. A slow push-in throughout. Out: the pile bursts back into depth,
 * where shot 1's blurred enquiries pick up.
 */
export const S00_LENGTH = 4.2;

const LINES = [["How", "many", "enquiries"], ["go", "unanswered", "while"], ["you’re", "with", "a", "client?"]];
const TYPE = 100;

type Pile = { piece?: PieceName; bit?: string; x: number; y: number; z: number; r: number; from: [number, number] };
// The pile, in arrival order (newest on top). Pieces are live-rendered rows; bits are real 4x row captures.
const PILE: Pile[] = [
  { piece: "row-1", x: 60, y: 40, z: 0, r: -5, from: [700, -300] }, // Priya · WhatsApp
  { piece: "row-0", x: 150, y: 230, z: 30, r: 4, from: [800, 100] }, // Sarah · Instagram
  { bit: "row-3", x: -40, y: 400, z: 10, r: -3, from: [600, 500] }, // Imogen · Instagram
  { piece: "row-5", x: 120, y: 560, z: 40, r: 6, from: [700, 600] }, // Grace · web chat
  { bit: "row-7", x: 10, y: 150, z: 60, r: 2, from: [900, -100] }, // Zara · WhatsApp
  { bit: "row-4", x: 190, y: 470, z: 70, r: -7, from: [800, 400] }, // Aisha · WhatsApp
  { bit: "row-8", x: -20, y: 640, z: 90, r: 3, from: [700, 700] }, // Melissa · web chat
  { bit: "row-2", x: 90, y: 320, z: 110, r: -2, from: [1000, 0] }, // Jasmine · web chat
];
// Arrivals lock to the music: first beat at 2.79 s, so beats in this shot fall at 0.77, 1.44, 2.12, 2.79…
const beatAt = (n: number) => 2.79 - 3 * BEAT + n * (BEAT / 2);
const HAZE = ["row-6", "row-2", "row-4", "row-7", "row-3", "row-8"];
const CW = 470;

/** Ink → white as the clay block arrives. */
function mixInk(u: number) {
  const c = [0x2c, 0x25, 0x20].map((v) => Math.round(v + (255 - v) * u));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

export function S00Question() {
  const t = useTime();
  const push = tween(t, 0, S00_LENGTH);
  const out = tween(t, S00_LENGTH - 0.5, 0.45);
  const block = tween(t, 1.12, 0.3);
  const mark = tween(t, 1.9, 0.6);
  let k = 0;

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden", perspective: 1600 }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.06 * push})`, transformOrigin: "60% 50%" }}>
        {/* A haze of more enquiries far behind: there are always more. */}
        {HAZE.map((b, i) => {
          const u = tween(t, 0.1 + i * 0.25, 0.6);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 1150 + ((i * 173) % 560),
                top: 40 + ((i * 331) % 900),
                opacity: 0.35 * u * (1 - out),
                filter: "blur(9px)",
                transform: `translate3d(${-t * 20}px, ${-t * 8}px, -600px) rotateZ(${(i % 2 ? 1 : -1) * 5}deg)`,
              }}
            >
              <Card radius={16}>
                <Bit name={b} w={420} />
              </Card>
            </div>
          );
        })}

        {/* The pile: each enquiry flies in on a beat and lands at an angle. */}
        <FloorShadow x={1200} y={960} w={600} h={46} height={160} style={{ opacity: 0.2 * tween(t, 0.8, 0.6) * (1 - out) }} />
        <div style={{ position: "absolute", left: 1190, top: 110, transformStyle: "preserve-3d", transform: `rotateY(${-16 + 6 * push}deg) rotateX(5deg)` }}>
          {PILE.map((c, i) => {
            const u = settle(t, beatAt(i), 16);
            if (u <= 0) return null;
            const burst = out * (1 + i * 0.15);
            const x = c.x + (1 - u) * c.from[0] + burst * (c.x - 120) * 2.2;
            const y = c.y + (1 - u) * c.from[1] + burst * (c.y - 340) * 1.6;
            const z = c.z + (1 - u) * 300 - burst * 900;
            const bob = Math.sin(t * 2 + i) * 4 * u * (1 - out);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  zIndex: i,
                  opacity: Math.min(1, u * 2) * (1 - out),
                  filter: u < 0.98 || out > 0 ? `blur(${(1 - u) * 14 + out * 10}px)` : undefined,
                  transform: `translate3d(${x}px, ${y + bob}px, ${z}px) rotateZ(${c.r * u + (1 - u) * c.r * 3}deg) scale(${1 + (1 - u) * 0.25})`,
                }}
              >
                <Card radius={18}>{c.piece ? <Piece name={c.piece} w={CW} /> : <Bit name={c.bit!} w={CW} />}</Card>
              </div>
            );
          })}
        </div>

        {/* The question: each word slams in; "unanswered" gets the clay block. */}
        <div
          style={{
            position: "absolute",
            left: 130,
            top: 270,
            opacity: 1 - out,
            filter: out > 0 ? `blur(${out * 14}px)` : undefined,
            transform: `translateY(${-out * 40}px)`,
          }}
        >
          <div style={{ ...eyebrow, fontSize: 24, letterSpacing: "0.32em", ...blurIn(t, 0.02, null, 10, 0.2) }}>Clinic owners</div>
          <div style={{ marginTop: 34 }}>
            {LINES.map((line, i) => (
              <div key={i} style={{ ...giant(TYPE), lineHeight: 1.12, whiteSpace: "nowrap" }}>
                {line.map((w) => {
                  const u = tween(t, 0.12 + k++ * 0.075, 0.2);
                  const hl = w === "unanswered";
                  return (
                    <span
                      key={w}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginRight: "0.22em",
                        opacity: u,
                        filter: u < 1 ? `blur(${(1 - u) * 12}px)` : undefined,
                        transform: `scale(${1 + (1 - u) * 0.35})`,
                        transformOrigin: "50% 70%",
                      }}
                    >
                      {hl && (
                        <span
                          style={{
                            position: "absolute",
                            left: -14,
                            right: -14,
                            top: "0.1em",
                            bottom: "-0.06em",
                            background: C.clay,
                            borderRadius: 10,
                            transform: `scaleX(${block})`,
                            transformOrigin: "0 50%",
                          }}
                        />
                      )}
                      {/* The word turns white as the block passes under it. */}
                      <span style={{ position: "relative", color: hl ? mixInk(block) : undefined }}>{w}</span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Vallamo between hairlines, at the foot. */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 84, display: "flex", alignItems: "center", justifyContent: "center", gap: 36, opacity: mark * (1 - out) }}>
          <div style={{ width: 300 * mark, height: 1.5, background: C.clay, opacity: 0.6 }} />
          <Logo file="vallamo-wordmark" w={170} h={55} />
          <div style={{ width: 300 * mark, height: 1.5, background: C.clay, opacity: 0.6 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
