import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { C, FONT } from "../../brand";
import { settle, tween } from "../meet/motion";
import { Logo } from "../meet/parts";
import { pushIn, Slam, World } from "../cinema/kit";
import { display, em, eyebrow } from "../meta/type";
import { Reveal } from "../growth/parts";
import { Shots, SHOT_SFX } from "./Shots";
import { END_LENGTH, LOWER_THIRD_LENGTH, PREVIEW, previewLength, SHOTS } from "./timing";

export type FounderProps = { fps?: number; sfx?: boolean };

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Script scenes 2 to 4: the product shots, as one clip to cut between Owen's pieces to camera. */
export function FounderShots({ sfx = false }: FounderProps) {
  const t = useT();
  const { fps } = useVideoConfig();
  return (
    <>
      <Shots t={t} />
      {sfx &&
        SHOT_SFX.map((x, i) => (
          <Sequence key={i} from={Math.round(x.at * fps)} durationInFrames={Math.round(1.5 * fps)} layout="none">
            <Audio src={staticFile(`audio/sfx/${x.file}.wav`)} volume={x.volume} />
          </Sequence>
        ))}
    </>
  );
}

/**
 * The end card: Vallamo, "Free personal demo · 15 minutes", and an arrow down to the lead
 * form's button (Meta draws it under the safe area). Everything sits between y 262 and 1250.
 */
export function End({ t }: { t: number }) {
  const logo = settle(t, 0.05, 11);
  const tap = settle(t, 0.95, 12);
  const bob = t > 1.2 ? Math.sin((t - 1.2) * 4.2) : 0;
  return (
    <AbsoluteFill style={{ background: "#FBF8F2" }}>
      <World kind="week" t={t + 20} blur={16} wash={0.86} zoom={1.22} spin={-10} tilt={55} />
      <AbsoluteFill style={pushIn(t, -0.05)}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", opacity: Math.min(1, logo * 1.6), filter: logo < 0.97 ? `blur(${(1 - logo) * 14}px)` : undefined, transform: `scale(${0.9 + 0.1 * logo})` }}>
          <Logo file="vallamo-wordmark" w={500} h={162} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 660 }}>
          <Slam t={t} at={0.3} lines={[[["Free personal demo"]], [["15 minutes", true]]]} base={display(96)} emStyle={em(108)} size={96} stagger={0.06} dot />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: Math.min(1, tap * 2), transform: `translateY(${(1 - tap) * 30}px)` }}>
          <div style={eyebrow(28)}>Tap below</div>
          <div style={{ width: 104, height: 104, borderRadius: "50%", background: C.clay, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px -14px rgba(138,106,68,.65)", transform: `translateY(${bob * 12}px)` }}>
            <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export function FounderEnd(_: FounderProps) {
  return <End t={useT()} />;
}

/**
 * "Owen · Co-founder, Vallamo", for scene 1: a paper card on a transparent frame, rendered with
 * alpha so the editor can lay it over the footage (lower left, inside the safe area, above subtitles).
 */
export function LowerThird({ t, length = LOWER_THIRD_LENGTH }: { t: number; length?: number }) {
  const card = settle(t, 0.05, 12);
  const out = tween(t, length - 0.45, 0.35);
  if (out >= 1) return null;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 1010,
          display: "flex",
          alignItems: "stretch",
          gap: 26,
          padding: "26px 44px 28px 26px",
          borderRadius: 30,
          background: C.paper,
          border: `1.5px solid ${C.line}`,
          boxShadow: "0 2px 4px rgb(44 37 32 / .06), 0 18px 40px -16px rgb(44 37 32 / .30)",
          opacity: Math.min(1, card * 2) * (1 - out),
          filter: out > 0 ? `blur(${out * 10}px)` : undefined,
          transform: `translateX(${(1 - card) * -40}px)`,
        }}
      >
        <div style={{ width: 8, borderRadius: 4, background: C.clay, transform: `scaleY(${tween(t, 0.15, 0.4)})`, transformOrigin: "50% 0" }} />
        <div>
          <Reveal t={t} at={0.2}>
            <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 52, letterSpacing: "-0.025em", color: C.ink, lineHeight: 1.1 }}>Owen</div>
          </Reveal>
          <Reveal t={t} at={0.32}>
            <div style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 34, letterSpacing: "-0.01em", color: C.ink2, lineHeight: 1.3 }}>
              Co-founder, <span style={{ ...em(38), color: C.clayDeep }}>Vallamo</span>
            </div>
          </Reveal>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function FounderLowerThird(_: FounderProps) {
  return <LowerThird t={useT()} />;
}

// ---------------------------------------------------------------- the preview: the whole ad, Owen as slates

/** Owen's lines, as a guide: the editor replaces these with his recorded takes. */
const GUIDE: { from: number; to: number; text: string }[] = [
  { from: 0.3, to: 3.9, text: "It’s 9pm. Someone’s just messaged your clinic about lip filler. Who’s replying?" },
  { from: 4.0, to: PREVIEW.intro - 0.1, text: "If no one is, they’re booking somewhere else." },
  { from: PREVIEW.intro + SHOTS.dots + 1.3, to: PREVIEW.intro + SHOTS.i1 + 0.3, text: "Vallamo replies in seconds, with your prices and your free slots." },
  { from: PREVIEW.intro + SHOTS.u2 + 0.1, to: PREVIEW.intro + SHOTS.i2 + 0.6, text: "She picks a time. Vallamo books her in and sends the confirmation." },
  { from: PREVIEW.intro + SHOTS.channels + 0.1, to: PREVIEW.intro + SHOTS.length - 0.3, text: "Instagram, WhatsApp and your website. Even at 9pm." },
  { from: PREVIEW.intro + SHOTS.length + 0.3, to: PREVIEW.intro + SHOTS.length + PREVIEW.outro - 0.1, text: "Want to see it working for your clinic? Tap below and we’ll show you." },
];

/** A stand-in for Owen's footage: which scene, and his line. */
function Slate({ t, scene, line }: { t: number; scene: string; line: string }) {
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #E9DED0 0%, #D9C8B4 100%)" }}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 420, textAlign: "center", opacity: tween(t, 0, 0.3) }}>
        <div style={{ ...eyebrow(28), color: C.clayInk }}>{scene} · Owen on camera</div>
        <div style={{ ...display(64), marginTop: 36, color: C.ink2, lineHeight: 1.2 }}>{line}</div>
      </div>
    </AbsoluteFill>
  );
}

function Guide({ t }: { t: number }) {
  const g = GUIDE.find((x) => t >= x.from && t < x.to);
  if (!g) return null;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1160, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "14px 26px", borderRadius: 18, background: "rgba(44,37,32,.82)", color: "#FFFFFF", fontFamily: FONT.sans, fontWeight: 600, fontSize: 36, lineHeight: 1.3, textAlign: "center" }}>{g.text}</div>
    </div>
  );
}

export function FounderPreview({ sfx = false }: FounderProps) {
  const t = useT();
  const { fps } = useVideoConfig();
  const a = PREVIEW.intro;
  const b = a + SHOTS.length;
  const c = b + PREVIEW.outro;
  return (
    <AbsoluteFill>
      {t < a && (
        <>
          <Slate t={t} scene="Scene 1" line="It’s 9pm. Someone’s just messaged your clinic about lip filler. Who’s replying? If no one is, they’re booking somewhere else." />
          <LowerThird t={t - 0.8} />
        </>
      )}
      {t >= a && t < b && <Shots t={t - a} />}
      {t >= b && t < c && <Slate t={t - b} scene="Scene 5" line="Want to see it working for your clinic? Tap below and we’ll show you." />}
      {t >= c && <End t={t - c} />}
      <Guide t={t} />
      {sfx &&
        SHOT_SFX.map((x, i) => (
          <Sequence key={i} from={Math.round((a + x.at) * fps)} durationInFrames={Math.round(1.5 * fps)} layout="none">
            <Audio src={staticFile(`audio/sfx/${x.file}.wav`)} volume={x.volume} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
}

export const founderLengths = { shots: SHOTS.length, end: END_LENGTH, lowerThird: LOWER_THIRD_LENGTH, preview: previewLength() };
