import { AbsoluteFill } from "remotion";

import { blurIn, mix, settle, tween } from "../../meet/motion";
import { Logo } from "../../meet/parts";
import { pick, useF } from "../../meta/format";
import { Block, ChannelPill } from "../../meta/parts";
import { display, em } from "../../meta/type";
import { useCut } from "../timing";

/**
 * Back to white and gold. "Meet Vallamo, your all-in-one front desk." The wordmark and
 * the line; then the exact product sentence, ALWAYS in the clay block with a light
 * running across it, and the three live channels land underneath on the half-beats.
 */
export function Meet({ t }: { t: number }) {
  const F = useF();
  const cut = useCut();
  const m = cut.meet!;
  const s = F.type;
  const lift = tween(t, m.always - 0.1, 0.35);
  const out = tween(t, m.out, 0.3);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 470, 230), display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - lift, filter: lift > 0 ? `blur(${lift * 14}px)` : undefined, transform: `translateY(${-lift * 60}px)` }}>
        <div style={{ ...blurIn(t, m.at, null, 20), transform: `${blurIn(t, m.at, null, 20).transform} scale(${1 + 0.08 * (1 - settle(t, m.at, 12))})` }}>
          <Logo file="vallamo-wordmark" w={pick(F, 540, 480)} h={pick(F, 175, 156)} />
        </div>
        <div style={{ ...display(pick(F, 76, 68)), marginTop: 30, ...blurIn(t, m.at + 0.3, null, 14) }}>
          Your all-in-one <span style={em(pick(F, 80, 72))}>front desk.</span>
        </div>
      </div>
      {t > m.always - 0.1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: pick(F, 500, 250), textAlign: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 14}px)` : undefined }}>
          <div style={{ ...display(pick(F, 124, 112)), lineHeight: 1.04 }}>
            <div style={blurIn(t, m.always, null, 20)}>
              Vallamo{" "}
              <span style={{ display: "inline-block", marginLeft: "0.1em", transform: `scale(${1 + 0.14 * (1 - settle(t, m.always + 0.1, 14))})`, transformOrigin: "30% 70%" }}>
                <Block u={tween(t, m.always + 0.1, 0.3)}>
                  ALWAYS
                  <span
                    style={{
                      position: "absolute",
                      inset: "0.06em -0.12em -0.04em",
                      borderRadius: "0.1em",
                      background: "linear-gradient(100deg, transparent 35%, rgba(255,240,215,0.55) 50%, transparent 65%)",
                      backgroundSize: "300% 100%",
                      backgroundPosition: `${mix(100, -50, tween(t, m.always + 0.55, 0.9))}% 0`,
                      mixBlendMode: "screen",
                    }}
                  />
                </Block>
              </span>
            </div>
            <div style={blurIn(t, m.always + 0.25, null, 16)}>
              replies <span style={em(pick(F, 130, 118))}>instantly.</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: pick(F, 90, 70) }}>
            {([["m-ch-wa", "WhatsApp"], ["m-ch-ig", "Instagram"], ["m-ch-web", "Website"]] as const).map(([card, label], i) => {
              const u = settle(t, m.pills[i], 13);
              return (
                <div key={label} style={{ opacity: Math.min(1, u * 2), filter: u < 0.97 ? `blur(${(1 - u) * 10}px)` : undefined, transform: `translateY(${(1 - u) * 60}px) scale(${0.75 + 0.2 * u})` }}>
                  <ChannelPill card={card} label={label} scale={0.84 * s} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
