import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

import { C, FONT } from "../../brand";
import { settle, tween } from "../meet/motion";
import { Logo } from "../meet/parts";
import { SHADOW, World } from "../cinema/kit";
import { FORMATS, type Format } from "../meta/format";
import { display } from "../meta/type";
import CAPTIONS from "./captions.json";

export const MEET_FRAME_LENGTH = 56.45;
export type MeetFrameProps = { format?: Format["id"] };

/**
 * "Meet Vallamo" (the finished X film, v12) for Reels/Stories and Feed: the 16:9 film plays
 * whole, in a floating card on the ads' cream world, the wordmark above it and the voiceover
 * as captions under it (vertical feeds mostly play muted). Key text inside Meta's 9:16 safe area.
 */
export function MeetFrame({ format = "916" }: MeetFrameProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const F = FORMATS[format];
  const tall = F.id === "916";
  const vw = 1010;
  const vh = (vw * 9) / 16;
  const vTop = tall ? 440 : 250;
  const cap = CAPTIONS.find((c) => t >= c.from - 0.05 && t < c.to + 0.35);
  const capIn = cap ? tween(t, cap.from - 0.05, 0.25) * (1 - tween(t, cap.to + 0.1, 0.25)) : 0;
  const enter = settle(t, 0, 10);
  return (
    <AbsoluteFill style={{ background: "#FBF8F2" }}>
      <World kind="week" t={t} blur={16} wash={0.86} zoom={1.2 + 0.002 * t} spin={-12} tilt={56} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 40% at 50% ${((vTop + vh / 2) / F.H) * 100}%, rgba(255,236,205,.6) 0%, rgba(255,236,205,0) 70%)` }} />

      {/* The wordmark. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: tall ? 270 : 90, display: "flex", justifyContent: "center", opacity: Math.min(1, enter * 2) }}>
        <Logo file="vallamo-wordmark" w={tall ? 400 : 360} h={tall ? 130 : 117} />
      </div>

      {/* The film. */}
      <div style={{ position: "absolute", left: (F.W - vw) / 2, top: vTop, width: vw, height: vh, borderRadius: 30, overflow: "hidden", boxShadow: SHADOW.lift, border: `1.5px solid ${C.line}`, background: "#FFFFFF", transform: `scale(${0.96 + 0.04 * enter})` }}>
        <OffthreadVideo src={staticFile("film/meet-x-final-v12.mp4")} style={{ width: vw, height: vh, display: "block" }} />
      </div>

      {/* The voiceover, captioned. */}
      <div style={{ position: "absolute", left: 60, right: 60, top: vTop + vh + (tall ? 56 : 44), display: "flex", justifyContent: "center" }}>
        {cap && (
          <div style={{ maxWidth: 940, textAlign: "center", ...display(tall ? 52 : 48), lineHeight: 1.18, color: C.ink, opacity: capIn, transform: `translateY(${(1 - capIn) * 14}px)`, filter: capIn < 1 ? `blur(${(1 - capIn) * 6}px)` : undefined }}>
            {cap.text}
          </div>
        )}
      </div>

      {/* The address, quietly, for the whole film (4:5; in 9:16 the captions need the room above Meta's overlay). */}
      {!tall && <div style={{ position: "absolute", left: 0, right: 0, top: 1190, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, opacity: 0.85 * Math.min(1, enter * 2), fontFamily: FONT.sans, fontWeight: 600, fontSize: 30, color: C.ink2, letterSpacing: "-0.01em" }}>
        <Logo file="vallamo-mark" w={34} h={34} />
        vallamo.com
      </div>}
    </AbsoluteFill>
  );
}
