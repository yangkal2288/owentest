import { AbsoluteFill } from "remotion";

import { C } from "../../../brand";
import { useTime } from "../../../kit/time";
import { blurIn, settle, tween } from "../motion";
import { accent, Logo } from "../parts";

/**
 * Shot 3 · Meet (0:06–0:09). "Meet Vallamo… your new front desk."
 * The enquiries from shot 1 rush into the centre; the mark opens there with a pop
 * and two clay rings (a circular mask draw, never a spin),
 * the wordmark writes on left to right, then the tagline.
 * Out: a blur dissolve up into the channels.
 */
export const S03_LENGTH = 3;

export function S03Meet() {
  const t = useTime();
  // In: the enquiries from shot 1 have just rushed into this point; the mark opens with a pop and two clay rings.
  const draw = tween(t, 0, 0.35);
  const pop = settle(t, 0, 11);
  const rings = [0, 0.14].map((d) => Math.max(0, Math.min(1, (t - d) / 0.75)));
  const write = tween(t, 0.8, 0.7);
  const out = tween(t, 2.72, 0.28);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, filter: out > 0 ? `blur(${out * 12}px)` : undefined, transform: `translateY(${-out * 30}px)` }}>
        {rings.map((u, i) =>
          u > 0 && u < 1 ? (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 - (125 + 380 * (1 - Math.pow(1 - u, 3))),
                top: 340 - (125 + 380 * (1 - Math.pow(1 - u, 3))),
                width: 2 * (125 + 380 * (1 - Math.pow(1 - u, 3))),
                height: 2 * (125 + 380 * (1 - Math.pow(1 - u, 3))),
                borderRadius: "50%",
                border: `${6 - 4 * u}px solid ${C.clay}`,
                opacity: (i ? 0.3 : 0.55) * (1 - u),
              }}
            />
          ) : null,
        )}
        <div style={{ position: "absolute", left: 960 - 125, top: 215, clipPath: `circle(${draw * 72}% at 50% 50%)`, transform: `scale(${1.25 - 0.25 * pop})` }}>
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
