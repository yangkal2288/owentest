import type { CSSProperties } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

import { C, FONT } from "../../../brand";
import { accent, Bit, Browser, Card, DemoLabel, eyebrow, FloorShadow, giant, Logo } from "../parts";

/**
 * Gate 4 style frames: six stills, one per frame, for Owen's approval before any
 * motion. Every UI pixel is a capture of the real Vallamo app (public/ui/bits).
 *   0 shot 2 hook · 1 shot 4 channels · 2 shot 5 into one inbox
 *   3 shot 6 booked · 4 shot 8 diary fills · 5 shot 12 end card
 */
export const STYLE_FRAMES = 6;

const abs = (style: CSSProperties): CSSProperties => ({ position: "absolute", ...style });

// ------------------------------------------------------------------ shot 2
const DRIFT = [
  { bit: "row-1", x: 90, y: 110, z: -700, r: -4 },
  { bit: "row-5", x: 1320, y: 90, z: -900, r: 3 },
  { bit: "msg-1", x: 1150, y: 760, z: -500, r: -2, w: 466 },
  { bit: "row-3", x: 140, y: 780, z: -380, r: 2 },
  { bit: "row-0", x: 700, y: 20, z: -1200, r: 1 },
  { bit: "row-7", x: 1480, y: 470, z: -1100, r: -3 },
  { bit: "row-2", x: -60, y: 470, z: -1000, r: 4 },
  { bit: "row-8", x: 760, y: 880, z: -1000, r: -2 },
  { bit: "row-4", x: 520, y: 300, z: -1500, r: 2 },
];

function Hook() {
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", perspective: 1400, overflow: "hidden" }}>
      {DRIFT.map((d) => (
        <div
          key={d.bit}
          style={abs({
            left: d.x,
            top: d.y,
            transform: `translateZ(${d.z}px) rotateZ(${d.r}deg) rotateX(8deg)`,
            filter: `blur(${Math.round(-d.z / 90)}px)`,
            opacity: 0.9,
          })}
        >
          <Card radius={16}>
            <Bit name={d.bit} w={(d.w ?? 343) * 1.5} />
          </Card>
        </div>
      ))}
      {/* The clay dot from shot 1, now the line the type sits on. */}
      <div style={abs({ left: 150, right: 150, top: 539, height: 3, background: C.clay })} />
      <div style={abs({ right: 142, top: 532, width: 17, height: 17, borderRadius: 9, background: C.clay })} />
      <div style={abs({ left: 0, right: 0, top: 322, textAlign: "center", ...giant(230) })}>You’re with</div>
      <div style={abs({ left: 0, right: 0, top: 574, textAlign: "center", ...giant(230) })}>a client.</div>
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ shot 4
function Channels() {
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", perspective: 1800, overflow: "hidden" }}>
      <div style={abs({ left: 150, top: 330 })}>
        <div style={eyebrow}>Your channels</div>
        <div style={{ ...giant(116), marginTop: 30 }}>Answers on</div>
        <div style={{ ...giant(116), display: "flex", alignItems: "center", gap: 26, marginTop: 8 }}>
          <Img src={staticFile("ui/bits/badge-wa.png")} style={{ width: 92, height: 92 }} />
          <span>
            WhatsApp<span style={{ color: C.clay }}>.</span>
          </span>
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 38, color: C.ink3, marginTop: 40, letterSpacing: "-0.02em" }}>One inbox. One memory.</div>
      </div>
      {/* Next channels waiting underneath, the Skydive stack. */}
      <FloorShadow x={1120} y={610} w={600} h={48} height={90} />
      <div style={abs({ left: 1010, top: 380, transformStyle: "preserve-3d", transform: "rotateY(-16deg) rotateX(6deg)" })}>
        <div style={abs({ left: 40, top: -44, transform: "translateZ(-120px)", opacity: 0.5, filter: "blur(2px)" })}>
          <Card>
            <Bit name="row-5" w={760} />
          </Card>
        </div>
        <div style={abs({ left: 20, top: -22, transform: "translateZ(-60px)", opacity: 0.75, filter: "blur(1px)" })}>
          <Card>
            <Bit name="row-0" w={760} />
          </Card>
        </div>
        <div style={{ position: "relative" }}>
          <Card>
            <Bit name="row-1" w={760} />
          </Card>
        </div>
      </div>
      <DemoLabel />
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ shot 5
// Inbox rows in the captured screen (css px, 1440 viewport): x 253, y 202 + 86n, 343 x 86.
const S5 = 1480 / 1440;
const BAR = 52;
const slot = (n: number) => ({ x: 253 * S5, y: 202 * S5 + BAR + 86 * S5 * n, w: 343 * S5, h: 86 * S5 });
const FALLING = [
  { name: "slot-sarah", n: 0, z: 40, dx: -4, dy: -34, r: -1, blur: 0, s: 1.04, lift: 40 },
  { name: "slot-web", n: 1, z: 90, dx: -110, dy: -330, r: 2.5, blur: 0.8, s: 1.1, lift: 220 },
  { name: "slot-priya", n: 2, z: 140, dx: -120, dy: -640, r: -4, blur: 1.6, s: 1.18, lift: 420 },
];

function IntoInbox() {
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", perspective: 2200, overflow: "hidden" }}>
      <div style={abs({ left: 220, top: 250, width: 1480, height: 900, transformStyle: "preserve-3d", transform: "rotateX(22deg)", transformOrigin: "50% 100%" })}>
        <Browser w={1480} h={900}>
          <Img src={staticFile("ui/bits/screen-inbox.png")} style={{ width: 1480, display: "block" }} />
          {/* The top three slots wait, empty. */}
          <div style={abs({ left: slot(0).x, top: slot(0).y - BAR, width: slot(0).w, height: slot(0).h * 3, background: C.paper })} />
        </Browser>
        {FALLING.map((f) => {
          const s = slot(f.n);
          return (
            <div key={f.name}>
              <FloorShadow x={s.x + 10} y={s.y + s.h * 0.2} w={s.w - 20} h={s.h * 0.6} height={f.lift} style={{ transform: "translateZ(1px)" }} />
              <div
                style={abs({
                  left: s.x + f.dx,
                  top: s.y + f.dy,
                  transform: `translateZ(${f.z}px) rotateZ(${f.r}deg) scale(${f.s})`,
                  filter: f.blur ? `blur(${f.blur}px)` : undefined,
                })}
              >
                <Card radius={12}>
                  <Bit name={f.name} w={s.w} />
                </Card>
              </div>
            </div>
          );
        })}
      </div>
      <DemoLabel />
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ shot 6
function Booked() {
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", perspective: 1800, overflow: "hidden" }}>
      {/* Sarah's conversation, racked out of focus behind the outcome. */}
      <Img
        src={staticFile("ui/bits/screen-sarah.png")}
        style={abs({ left: -300, top: -260, width: 2400, filter: "blur(18px)", opacity: 0.55 })}
      />
      <div style={abs({ left: 140, top: 340 })}>
        <div style={giant(92)}>Answers.</div>
        <div style={{ ...giant(92), marginTop: 12 }}>Checks your diary.</div>
        <div style={{ ...accent(112), marginTop: 10 }}>Books it.</div>
      </div>
      <FloorShadow x={1110} y={820} w={620} h={70} height={200} />
      <div style={abs({ left: 1080, top: 300, transformStyle: "preserve-3d", transform: "rotateY(-14deg) rotateX(8deg)" })}>
        <Card radius={24} style={{ border: `1.5px solid ${C.line}` }}>
          <Bit name="outcome-booked" w={263 * 2.6} />
        </Card>
        <div style={{ marginTop: 34, marginLeft: 70, transform: "translateZ(120px) rotateZ(-2deg)" }}>
          <Bit name="upcoming-card" w={263 * 2.1} />
        </div>
      </div>
      <DemoLabel />
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ shot 8
// Week card: css rect x285 y385 of the Bookings week view; blocks measured by scripts/measure-week.mjs.
const W8 = 1.12;
const blk = (x: number, y: number) => ({ x: (x - 285) * W8, y: (y - 385) * W8, w: 142 * W8, h: 29 * W8 });
const DROPS = [
  { name: "wk-harriet", at: blk(950, 592), z: 150 },
  { name: "wk-phoebe", at: blk(1101, 720), z: 330 },
];

function DiaryFills() {
  const sarah = blk(800, 1088);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", perspective: 2400, overflow: "hidden" }}>
      <div style={abs({ left: 140, top: 390 })}>
        <div style={giant(88)}>Watch your</div>
        <div style={{ ...giant(88), marginTop: 6 }}>diary <span style={accent(108)}>fill up.</span></div>
      </div>
      <div
        style={abs({
          left: 860,
          top: 90,
          width: 1114 * W8,
          height: 769 * W8,
          transformStyle: "preserve-3d",
          transform: "rotateX(40deg) rotateZ(-13deg)",
          transformOrigin: "30% 60%",
        })}
      >
        <Card radius={22} style={{ position: "absolute", inset: 0 }}>
          <Img src={staticFile("ui/bits/week-card.png")} style={{ width: 1114 * W8, display: "block" }} />
        </Card>
        {/* Slots still to fill. */}
        {[...DROPS.map((d) => d.at), sarah].map((r, i) => (
          <div key={i} style={abs({ left: r.x, top: r.y + 2, width: r.w, height: r.h - 2, background: C.paper })} />
        ))}
        {DROPS.map((d) => (
          <div key={d.name}>
            <FloorShadow x={d.at.x} y={d.at.y} w={d.at.w} h={d.at.h} height={d.z} style={{ transform: "translateZ(1px)" }} />
            <div style={abs({ left: d.at.x, top: d.at.y, transform: `translateZ(${d.z}px)` })}>
              <Bit name={d.name} w={d.at.w} />
            </div>
          </div>
        ))}
        {/* The THU 24 card from shot 6, about to become Sarah's block. */}
        <FloorShadow x={sarah.x - 30} y={sarah.y - 10} w={sarah.w + 60} h={sarah.h + 30} height={120} style={{ transform: "translateZ(1px)" }} />
        <div style={abs({ left: sarah.x - 170, top: sarah.y - 70, transform: "translateZ(110px) rotateX(-40deg)", transformOrigin: "50% 100%" })}>
          <Card radius={16}>
            <Bit name="upcoming-card" w={263 * 1.5} />
          </Card>
        </div>
      </div>
      <DemoLabel />
    </AbsoluteFill>
  );
}

// ------------------------------------------------------------------ shot 12
function EndCard() {
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", alignItems: "center" }}>
      <Logo file="vallamo-logo-lockup" w={320} h={310} style={{ marginTop: 170 }} />
      <div style={{ ...giant(64), marginTop: 70, textAlign: "center" }}>See yours in 10 minutes.</div>
      <div style={{ ...accent(68), marginTop: 10, textAlign: "center" }}>Built from your website.</div>
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
        }}
      >
        vallamo.com <span style={{ fontSize: 28 }}>↗</span>
      </div>
    </AbsoluteFill>
  );
}

const SHOTS = [Hook, Channels, IntoInbox, Booked, DiaryFills, EndCard];

export function StyleFrames() {
  const Shot = SHOTS[Math.min(useCurrentFrame(), SHOTS.length - 1)];
  return <Shot />;
}
