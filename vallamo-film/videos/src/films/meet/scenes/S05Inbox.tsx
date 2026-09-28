import { AbsoluteFill, Img, staticFile } from "remotion";

import { C } from "../../../brand";
import { cursorAt, UserCursor } from "../../../kit/cursor";
import { useTime } from "../../../kit/time";
import { mix, settle, tween } from "../motion";
import { Bit, Browser, Card, FloorShadow } from "../parts";
import { CARD_H, CARD_W, GAP, STACK_TOP, STACK_X } from "./S04Channels";

/**
 * Shot 5 · Into one inbox (4.5 s). No new VO; line 4 finishes over it.
 * The three enquiries from shot 4 are picked up where they rest, the white
 * browser rises under them and tilts back, and each card falls into its real
 * slot at the top of the Inbox (magic move: measured rects, shrinking to row
 * size). The browser turns face-on, the cursor clicks Sarah: push-in.
 */
export const S05_LENGTH = 4.5;

// The plane: the browser's own space. At tilt 0 it maps 1:1 onto the screen from (PX, PY).
const PX = 220;
const PY = 250;
const BW = 1480;
const BH = 900;
const S = BW / 1440; // captured inbox is 1440 css px wide
const BAR = 52;
// Inbox rows in the capture (css px): x 253, y 202 + 86n, 343 x 86 (scripts/snapshot.mjs staging).
const slot = (n: number) => ({ x: 253 * S, y: BAR + 202 * S + 86 * S * n, w: 343 * S, h: 86 * S });
// Shot 4 order → inbox slot. Staging: the web-chat slot shows Grace (shot 4's website card).
const CARDS = [
  { bit: "row-1", slot: 2, order: 2 }, // Priya · WhatsApp
  { bit: "row-0", slot: 0, order: 0 }, // Sarah · Instagram
  { bit: "row-5", slot: 1, order: 1 }, // Grace · web chat
];
const CLICK = 3.85;

export function S05Inbox() {
  const t = useTime();
  const rise = settle(t, 0, 6);
  const tilt = 22 * tween(t, 0.1, 0.8) * (1 - tween(t, 2.65, 0.8));
  const push = tween(t, CLICK + 0.1, 0.55);
  const sarah = slot(0);
  const focus = { x: PX + sarah.x + sarah.w / 2, y: PY + sarah.y + sarah.h / 2 };
  const cursor = cursorAt(
    t,
    [
      { t: 2.3, x: 1560, y: 980 },
      { t: CLICK, x: focus.x + 40, y: focus.y + 6, click: true },
    ],
    (x, y) => ({ x, y }),
  );

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: 2200,
          transform: `scale(${1 + 1.6 * push})`,
          transformOrigin: `${focus.x}px ${focus.y}px`,
          filter: push > 0.4 ? `blur(${(push - 0.4) * 16}px)` : undefined,
          opacity: 1 - tween(t, 4.25, 0.25),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: PX,
            top: PY,
            width: BW,
            height: BH,
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - rise) * 950}px)` }}>
            <Browser w={BW} h={BH}>
              <Img src={staticFile("ui/bits/screen-inbox.png")} style={{ width: BW, display: "block" }} />
              {/* The top three slots wait, empty, for the enquiries. */}
              <div style={{ position: "absolute", left: sarah.x, top: sarah.y - BAR, width: sarah.w, height: sarah.h * 3, background: C.paper }} />
            </Browser>
          </div>
          {CARDS.map((c, i) => {
            const u = settle(t, 0.55 + c.order * 0.3, 7);
            const from = { x: STACK_X - PX, y: STACK_TOP + i * (CARD_H + GAP) - PY, w: CARD_W };
            const to = slot(c.slot);
            const z = 240 * (1 - u);
            const landed = u > 0.985;
            const bit = c.slot === 0 && t >= CLICK ? "row-0-selected" : c.bit;
            return (
              <div key={c.bit}>
                <FloorShadow x={to.x + 12} y={to.y + to.h * 0.2} w={to.w - 24} h={to.h * 0.6} height={z} style={{ transform: "translateZ(1px)", opacity: landed ? 0 : 0.3 * u }} />
                <div style={{ position: "absolute", left: mix(from.x, to.x, u), top: mix(from.y, to.y, u), transform: `translateZ(${z}px)` }}>
                  <Card radius={mix(22, 0, u)} style={{ borderColor: landed ? "transparent" : C.line }}>
                    <Bit name={bit} w={mix(from.w, to.w, u)} />
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {t > 2.3 && t < CLICK + 0.45 && (
        <div style={{ position: "absolute", inset: 0, opacity: tween(t, 2.3, 0.3) * (1 - tween(t, CLICK + 0.2, 0.25)) }}>
          <UserCursor {...cursor} />
        </div>
      )}
    </AbsoluteFill>
  );
}
