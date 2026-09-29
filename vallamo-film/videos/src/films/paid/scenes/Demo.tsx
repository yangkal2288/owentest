import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../../brand";
import { blurIn, settle, tween } from "../../meet/motion";
import { Piece, pieceSize, type PieceName } from "../../meet/Piece";
import { pick, useF } from "../../meta/format";
import { Block, type Msg, Widget, WIDGET_W } from "../../meta/parts";
import { display, em, eyebrow } from "../../meta/type";
import { useCut } from "../timing";

/**
 * A new enquiry, with Vallamo (labelled, so it never reads as the lost customer coming
 * back). The real website chat widget: the same question, a useful answer with a real
 * slot, her yes, the details step (at 2x, labelled), Isla's confirmation. Then the real
 * Booked outcome and the Thursday 3pm booking replace the chat on white, and the
 * confirmation lands in gold: Appointment booked · Thursday, 3pm.
 */
const BODY = 250;

export function Demo({ t }: { t: number }) {
  const F = useF();
  const cut = useCut();
  const d = cut.demo;
  const s = F.type;
  const k = F.ui;
  const wx = (F.W - WIDGET_W * k) / 2;
  const uiTop = pick(F, 560, 330);
  const rise = settle(t, d.at + 0.1, 11);
  const cleared = tween(t, d.booked - 0.05, 0.3);
  const out = tween(t, d.out - 0.05, 0.3);
  const R = pick(F, 3.0, 2.6);
  const ry = pick(F, 560, 350);
  const oh = pieceSize("p-outcome").h * R;
  const uh = pieceSize("p-upcoming").h * R;
  const booked = t >= d.booked;
  const fast = d.fast;
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden", perspective: 2000 }}>
      <div style={{ position: "absolute", left: 72, top: F.top, opacity: 1 - out }}>
        <div style={{ ...eyebrow(28 * s), ...blurIn(t, d.at, null, 10) }}>A new enquiry, with Vallamo</div>
        {cut.id === "main" ? (
          <div style={{ ...display(pick(F, 84, 78)), marginTop: 16, ...blurIn(t, d.at + 0.12, null, 16) }}>
            Answered while you’re
            <br />
            with a <span style={em(pick(F, 90, 84))}>client.</span>
          </div>
        ) : (
          <div style={{ ...display(pick(F, 92, 84)), marginTop: 16, whiteSpace: "nowrap", ...blurIn(t, d.at + 0.12, null, 16) }}>
            Vallamo{" "}
            <span style={{ display: "inline-block", marginLeft: "0.1em", transform: `scale(${1 + 0.14 * (1 - settle(t, d.at + 0.2, 14))})`, transformOrigin: "30% 70%" }}>
              <Block u={tween(t, d.at + 0.2, 0.3)}>ALWAYS</Block>
            </span>
            <br />
            replies <span style={em(pick(F, 98, 90))}>instantly.</span>
          </div>
        )}
      </div>

      {/* The real widget. */}
      {cleared < 1 && (
        <div style={{ position: "absolute", left: wx, top: uiTop, opacity: Math.min(1, rise * 1.5) * (1 - cleared), transform: `translate3d(0, ${(1 - rise) * 900}px, 0)` }}>
          <Widget t={t} msgs={d.msgs as Msg[]} body={BODY} style={{ transform: `scale(${k})`, transformOrigin: "0 0" }} />
        </div>
      )}
      {fast && (
        <div
          style={{
            position: "absolute",
            left: wx + WIDGET_W * k - 150,
            top: uiTop - 50,
            height: 76,
            padding: "0 28px",
            borderRadius: 38,
            background: C.paper,
            border: `1.5px solid ${C.line}`,
            boxShadow: "0 12px 40px -12px rgb(44 37 32 / .28)",
            display: "flex",
            alignItems: "center",
            fontFamily: FONT.sans,
            fontWeight: 650,
            fontSize: 40,
            color: C.ink,
            ...blurIn(t, fast[0], fast[1], 10),
          }}
        >
          2×
        </div>
      )}

      {/* The result, in the product's own cards, then the confirmation in gold. */}
      {booked && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: 1 - out, filter: out > 0 ? `blur(${out * 12}px)` : undefined }}>
          <div style={{ position: "absolute", left: (F.W - 263 * R) / 2, top: ry }}>
            {[0.1, 0.48].map((dd) => {
              const u = Math.min(1, Math.max(0, (t - d.booked - dd) / 1.0));
              if (u <= 0 || u >= 1) return null;
              const g = 1 - Math.pow(1 - u, 3);
              return (
                <div key={dd} style={{ position: "absolute", left: -g * 60, top: -g * 40, width: 263 * R + g * 120, height: oh + g * 80, borderRadius: 14 * R + g * 40, border: `${3 - 2 * u}px solid ${C.clay}`, opacity: 0.45 * (1 - u) }} />
              );
            })}
            {(["p-outcome", "p-upcoming"] as PieceName[]).map((name, i) => {
              const u = settle(t, d.booked + i * 0.2, 12);
              return (
                <div
                  key={name}
                  style={{
                    marginTop: i ? 26 * s : 0,
                    opacity: Math.min(1, u * 2),
                    filter: u < 0.97 ? `blur(${(1 - u) * 12}px)` : undefined,
                    transform: `translate3d(0, ${(1 - u) * pick(F, 480, 340)}px, ${(1 - u) * -300}px) rotateX(${(1 - u) * 30}deg)`,
                    borderRadius: 12 * R,
                    background: C.paper,
                    boxShadow: "0 30px 80px -28px rgb(44 37 32 / .32)",
                  }}
                >
                  <Piece name={name} w={263 * R} />
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: ry + oh + 26 * s + uh + pick(F, 70, 50), textAlign: "center" }}>
            <div style={{ ...em(pick(F, 110, 100)), color: C.clay, lineHeight: 1.02, ...blurIn(t, d.booked + 0.45, null, 18) }}>Appointment booked</div>
            <div style={{ ...display(pick(F, 76, 68)), marginTop: 6, ...blurIn(t, d.booked + 0.6, null, 14) }}>Thursday, 3pm</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
