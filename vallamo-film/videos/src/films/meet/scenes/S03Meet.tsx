import { AbsoluteFill } from "remotion";

import { useTime } from "../../../kit/time";
import { blurIn, tween } from "../motion";
import { accent, Logo } from "../parts";

/**
 * Shot 3 · Meet (0:06–0:09). "Meet Vallamo… your new front desk."
 * The mark opens from its centre (a circular mask draw, never a spin),
 * the wordmark writes on left to right, then the tagline.
 * Out: a blur dissolve up into the channels.
 */
export const S03_LENGTH = 3;

export function S03Meet() {
  const t = useTime();
  const draw = tween(t, 0.05, 0.7);
  const write = tween(t, 0.8, 0.7);
  const out = tween(t, 2.72, 0.28);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, filter: out > 0 ? `blur(${out * 12}px)` : undefined, transform: `translateY(${-out * 30}px)` }}>
        <div style={{ position: "absolute", left: 960 - 125, top: 215, clipPath: `circle(${draw * 72}% at 50% 50%)` }}>
          <Logo file="vallamo-mark" w={250} h={251} />
        </div>
        <div style={{ position: "absolute", left: 960 - 200, top: 488, clipPath: `inset(-10% ${(1 - write) * 100}% -10% 0)` }}>
          <Logo file="vallamo-wordmark" w={400} h={130} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", ...accent(76), ...blurIn(t, 1.2) }}>
          Your new front desk.
        </div>
      </div>
    </AbsoluteFill>
  );
}
