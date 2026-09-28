import { AbsoluteFill } from "remotion";

import { C } from "../../../brand";
import { useTime } from "../../../kit/time";
import { blurIn, mix, tween } from "../motion";
import { accent, Logo } from "../parts";

/**
 * Shot 3 · Meet (0:06–0:09). "Meet Vallamo… your new front desk."
 * The dot from shot 1 rises and opens into the mark (a circular mask draw, never a spin),
 * the wordmark writes on left to right, then the tagline.
 * Out: a blur dissolve up into the channels.
 */
export const S03_LENGTH = 3;

export function S03Meet() {
  const t = useTime();
  const rise = tween(t, 0, 0.35);
  const draw = tween(t, 0.25, 0.7);
  const write = tween(t, 0.8, 0.7);
  const out = tween(t, 2.72, 0.28);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, filter: out > 0 ? `blur(${out * 12}px)` : undefined, transform: `translateY(${-out * 30}px)` }}>
        {/* The dot is the mark's centre: it stays until the mask has opened past it. */}
        <div style={{ position: "absolute", left: 951, top: mix(531, 331, rise), width: 18, height: 18, borderRadius: 9, background: C.clay, opacity: 1 - draw }} />
        <div style={{ position: "absolute", left: 960 - 125, top: 215, clipPath: `circle(${draw * 72}% at 50% 50%)` }}>
          <Logo file="vallamo-mark" w={250} h={251} />
        </div>
        <div style={{ position: "absolute", left: 960 - 200, top: 488, clipPath: `inset(-10% ${(1 - write) * 100}% -10% 0)` }}>
          <Logo file="vallamo-wordmark" w={400} h={130} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", ...accent(76), ...blurIn(t, 1.35) }}>
          Your new front desk.
        </div>
      </div>
    </AbsoluteFill>
  );
}
