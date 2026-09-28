import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { useTime } from "../../../kit/time";
import { blurIn, tween } from "../motion";
import { accent, giant, Logo } from "../parts";

/**
 * Shot 12 · End card (6.4 s): each line lands on its words in the VO. "See yours in ten minutes, built from your website. vallamo.com"
 * The lockup opens from the centre where shot 11's grid collapsed, the line,
 * one clay pill.
 */
export const S12_LENGTH = 6.4;

export function S12End() {
  const t = useTime();
  const open = tween(t, 0, 0.6);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", alignItems: "center" }}>
      <div style={{ marginTop: 170, clipPath: `circle(${open * 75}% at 50% 40%)` }}>
        <Logo file="vallamo-logo-lockup" w={320} h={310} />
      </div>
      <div style={{ ...giant(64), marginTop: 70, textAlign: "center", ...blurIn(t, 0.45) }}>See yours in 10 minutes.</div>
      <div style={{ ...accent(68), marginTop: 10, textAlign: "center", ...blurIn(t, 2.25) }}>Built from your website.</div>
      <div
        style={{
          marginTop: 54,
          height: 76,
          padding: "0 40px",
          borderRadius: 38,
          background: C.clay,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: 32,
          letterSpacing: "-0.015em",
          ...blurIn(t, 4.08, null, 14), // on "vallamo.com"
        }}
      >
        vallamo.com <span style={{ fontSize: 28 }}>↗</span>
      </div>
    </AbsoluteFill>
  );
}
