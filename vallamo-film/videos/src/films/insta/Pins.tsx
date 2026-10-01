import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";

import { C, FONT } from "../../brand";
import { Logo } from "../meet/parts";
import { Piece, pieceSize, type PieceName } from "../meet/Piece";
import { SHADOW } from "../cinema/kit";
import { Block, DiaryView, slotY, WEEK } from "../growth/parts";
import { ChannelIcon, Widget, WIDGET_W } from "../meta/parts";

/**
 * Vallamo's three pinned Instagram posts (1080 x 1350): one word, one phone, the real product.
 * ANSWERS. (the website chat replying) · BOOKS. (the appointment in the diary) · HANDLED. (every
 * channel in one inbox, and a handover when it matters). The same clay field, type and phone on
 * all three, so the top row of the grid reads as one wall.
 */
export type PinProps = { which?: "answers" | "books" | "handled" };

const CREAM = "#FFF8EE";
const serif = '"Playfair Display", Georgia, serif';
const PH = { x: 270, y: 300, w: 540, h: 1000, bezel: 14 };
const SCREEN = { w: PH.w - PH.bezel * 2, h: PH.h - PH.bezel * 2 };

function Phone({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "absolute", left: PH.x, top: PH.y, width: PH.w, height: PH.h, borderRadius: 84, background: "linear-gradient(160deg, #3A302A 0%, #1B1613 40%, #120E0C 100%)", boxShadow: "0 2px 0 1px rgba(255,255,255,.06) inset, 0 40px 90px -20px rgba(40,25,10,.55), 0 120px 160px -60px rgba(40,25,10,.5)" }}>
      <div style={{ position: "absolute", left: PH.bezel, top: PH.bezel, width: SCREEN.w, height: SCREEN.h, borderRadius: 70, overflow: "hidden", background: C.paper }}>
        {children}
        {/* the island */}
        <div style={{ position: "absolute", left: (SCREEN.w - 150) / 2, top: 18, width: 150, height: 40, borderRadius: 20, background: "#0E0B09" }} />
      </div>
    </div>
  );
}

/** A floating callout chip over the phone, like the product's own pills. */
function Chip({ x, y, children, gold = false, style }: { x: number; y: number; children: ReactNode; gold?: boolean; style?: CSSProperties }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, height: 74, padding: "0 30px 0 22px", borderRadius: 999, background: gold ? `linear-gradient(135deg, #BE9760 0%, ${C.clay} 55%, #86653F 100%)` : C.paper, color: gold ? "#FFFFFF" : C.ink, border: gold ? "none" : `1.5px solid ${C.line}`, boxShadow: SHADOW.lift, fontFamily: FONT.sans, fontWeight: 650, fontSize: 30, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...style }}>
      {children}
    </div>
  );
}

const Bolt = ({ c = C.clay }: { c?: string }) => (
  <svg width={30} height={30} viewBox="0 0 24 24" fill={c}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
);
const Check = ({ c = "#FFFFFF" }: { c?: string }) => (
  <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
);

/** A status bar, so the screen reads as a phone. */
function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 76, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 52px 0", fontFamily: FONT.sans, fontWeight: 650, fontSize: 24, color: dark ? "#FFFFFF" : C.ink, zIndex: 2 }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <svg width={30} height={20} viewBox="0 0 30 20" fill="currentColor"><rect x="0" y="12" width="5" height="8" rx="1.5" /><rect x="8" y="8" width="5" height="12" rx="1.5" /><rect x="16" y="4" width="5" height="16" rx="1.5" /><rect x="24" y="0" width="5" height="20" rx="1.5" /></svg>
        <svg width={44} height={22} viewBox="0 0 44 22"><rect x="1" y="1" width="38" height="20" rx="6" fill="none" stroke="currentColor" strokeWidth="2" opacity=".5" /><rect x="4" y="4" width="28" height="14" rx="3.5" fill="currentColor" /><rect x="41" y="7" width="3" height="8" rx="1.5" fill="currentColor" opacity=".5" /></svg>
      </span>
    </div>
  );
}

// ---------------------------------------------------------------- the three screens

function AnswersScreen() {
  const k = SCREEN.w / WIDGET_W;
  const body = SCREEN.h / k - pieceSize("m-head").h - pieceSize("m-sub").h - pieceSize("m-input").h - 2;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN.w, height: 76, background: C.clay }} />
      <StatusBar dark />
      <div style={{ position: "absolute", left: 0, top: 60 }}>
        <Widget t={100} body={body - 60 / k} msgs={[{ name: "g-u1", at: 0 }, { name: "g-i1", at: 0 }, { name: "g-u2", at: 0 }, { name: "g-idet", at: 0 }]} style={{ transform: `scale(${k})`, transformOrigin: "0 0", borderRadius: 0, border: "none", boxShadow: "none" }} />
      </div>
    </>
  );
}

function BooksScreen() {
  const k = 2.4;
  return (
    <>
      <StatusBar />
      <div style={{ position: "absolute", left: 30, top: 96, fontFamily: FONT.sans }}>
        <div style={{ fontSize: 22, fontWeight: 650, letterSpacing: "0.14em", textTransform: "uppercase", color: C.clayDeep }}>Bookings</div>
        <div style={{ fontFamily: serif, fontWeight: 500, fontSize: 46, letterSpacing: "-0.02em", color: C.ink, marginTop: 2 }}>This week</div>
      </div>
      <div style={{ position: "absolute", left: 6, top: 210 }}>
        <DiaryView k={k} from={13} to={17} x0={WEEK.cols.Thu} x1={WEEK.cols.Fri} style={{ boxShadow: "none", border: "none", borderRadius: 0 }}>
          <Block name="g-bk-facial" x={WEEK.cols.Thu} y={slotY(15)} k={k} glow={1} />
        </DiaryView>
      </div>
    </>
  );
}

function HandledScreen() {
  const rows: PieceName[] = ["row-0", "row-1", "row-5"];
  const k = (SCREEN.w - 20) / pieceSize("row-0").w;
  return (
    <>
      <StatusBar />
      <div style={{ position: "absolute", left: 32, top: 96, fontFamily: FONT.sans }}>
        <div style={{ fontSize: 22, fontWeight: 650, letterSpacing: "0.14em", textTransform: "uppercase", color: C.clayDeep }}>All channels</div>
        <div style={{ fontFamily: serif, fontWeight: 500, fontSize: 46, letterSpacing: "-0.02em", color: C.ink, marginTop: 2 }}>Inbox</div>
      </div>
      <div style={{ position: "absolute", left: 10, top: 214 }}>
        {rows.map((r) => (
          <div key={r} style={{ borderBottom: `1px solid ${C.lineSoft}` }}>
            <Piece name={r} w={pieceSize(r).w * k} />
          </div>
        ))}
      </div>
    </>
  );
}

const PINS = {
  answers: { title: "ANSWERS", screen: <AnswersScreen /> },
  books: { title: "BOOKS", screen: <BooksScreen /> },
  handled: { title: "HANDLED", screen: <HandledScreen /> },
};

export function Pin({ which = "answers" }: PinProps) {
  const p = PINS[which];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 70% at 50% 42%, #BE9A6C 0%, ${C.clay} 48%, #87663F 100%)`, overflow: "hidden" }}>
      {/* soft light behind the phone */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 62%, rgba(255,236,205,.35) 0%, rgba(255,236,205,0) 45%)" }} />
      {/* the title */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 92, textAlign: "center", fontFamily: serif, fontWeight: 500, fontSize: 132, lineHeight: 1, letterSpacing: "0.01em", color: CREAM }}>
        {p.title}
        <span style={{ display: "inline-block", width: 26, height: 26, marginLeft: 8, borderRadius: "50%", background: CREAM }} />
      </div>
      <Phone>{p.screen}</Phone>
      {which === "answers" && (
        <>
          <Chip x={40} y={1070}><Bolt />Replied instantly</Chip>
          <Chip x={560} y={930} gold><Check />From your price list</Chip>
        </>
      )}
      {which === "books" && (
        <>
          <Chip x={560} y={1170} gold>
            <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 36 }}>£120</span> appointment
          </Chip>
          <Chip x={580} y={720}><Check c={C.clay} />Booked in the diary</Chip>
        </>
      )}
      {which === "handled" && (
        <>
          <Chip x={610} y={440} style={{ gap: 10 }}>
            {(["m-ch-wa", "m-ch-ig", "m-ch-web"] as PieceName[]).map((c) => <ChannelIcon key={c} card={c} size={40} />)}
            <span style={{ marginLeft: 6 }}>One inbox</span>
          </Chip>
          <div style={{ position: "absolute", left: 300, top: 1000, width: 740, borderRadius: 22, background: C.paper, boxShadow: SHADOW.lift, overflow: "hidden" }}>
            <Piece name="handover" w={740} />
          </div>
          <Chip x={40} y={910}><Check c={C.clay} />Hands over when it matters</Chip>
        </>
      )}
      {/* the mark, quietly */}
      <div style={{ position: "absolute", right: 46, bottom: 40, opacity: 0.85 }}>
        <Logo file="vallamo-mark" w={56} h={56} color={CREAM} />
      </div>
    </AbsoluteFill>
  );
}
