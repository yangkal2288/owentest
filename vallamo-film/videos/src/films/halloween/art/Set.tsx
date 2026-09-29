import type { CSSProperties, ReactNode } from "react";

/**
 * Maya's clinic at dusk, in layers the camera can move through. Drawn on a 1080 x 1920
 * stage (the 4:5 cut frames the middle of it). Cool blue evening in the window, warm
 * practical light inside, cream and brushed gold, one small pumpkin.
 */
export const GOLD = "#B8925A";
export const CREAM = "#F4EBDF";

/** The back wall, the dusk window, the sconces. */
export function Room({ t, warm = 0 }: { t: number; warm?: number }) {
  return (
    <svg viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="r-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9C8B4" />
          <stop offset="0.55" stopColor="#E9DCCB" />
          <stop offset="1" stopColor="#D6C3AC" />
        </linearGradient>
        <linearGradient id="r-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B2440" />
          <stop offset="0.55" stopColor="#4B4566" />
          <stop offset="0.85" stopColor="#B7847A" />
          <stop offset="1" stopColor="#E0A77C" />
        </linearGradient>
        <radialGradient id="r-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE3B0" stopOpacity={0.85} />
          <stop offset="0.4" stopColor="#FFD493" stopOpacity={0.28} />
          <stop offset="1" stopColor="#FFD493" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="r-warm" cx="0.5" cy="0.6" r="0.6">
          <stop offset="0" stopColor="#FFD79B" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FFD79B" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#r-wall)" />
      {/* The window: dusk over the rooftops. */}
      <g>
        <rect x={60} y={260} width={330} height={760} rx={14} fill="url(#r-dusk)" />
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={80 + ((i * 97) % 300)} cy={290 + ((i * 53) % 300)} r={i % 3 ? 1.4 : 2.2} fill="#FFFFFF" opacity={0.35 + 0.35 * Math.sin(t * 2 + i)} />
        ))}
        <path d="M300 360 a34 34 0 1 0 22 60 a28 28 0 1 1 -22 -60 Z" fill="#F4E6C8" opacity={0.9} />
        <path d="M60 880 L60 820 L110 820 L110 790 L150 790 L150 840 L200 840 L200 770 L230 750 L260 770 L260 830 L320 830 L320 800 L390 800 L390 1020 L60 1020 Z" fill="#2A2438" opacity={0.85} />
        {[[128, 840], [236, 790], [350, 850]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={10} height={14} fill="#FFC872" opacity={0.7 + 0.3 * Math.sin(t * 1.3 + i * 2)} />
        ))}
        <rect x={60} y={260} width={330} height={760} rx={14} fill="none" stroke={GOLD} strokeWidth={10} />
        <line x1={225} y1={260} x2={225} y2={1020} stroke={GOLD} strokeWidth={6} />
        <line x1={60} y1={560} x2={390} y2={560} stroke={GOLD} strokeWidth={6} />
      </g>
      {/* Sconces */}
      {[470, 1010].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={430} r={260} fill="url(#r-lamp)" opacity={0.85 + 0.08 * Math.sin(t * 3.1 + i)} />
          <rect x={x - 14} y={400} width={28} height={50} rx={10} fill="#FFF3DC" />
          <rect x={x - 4} y={450} width={8} height={30} fill={GOLD} />
        </g>
      ))}
      {/* Vallamo's arrival: warm light fills the room. */}
      <rect width={1080} height={1920} fill="url(#r-warm)" opacity={warm} />
    </svg>
  );
}

/**
 * The treatment room through frosted glass: soft shapes of Maya at the chair and her
 * client. `who` changes the client (Nina, then a later client); `empty` after Nina leaves.
 */
export function TreatmentGlass({ t, x = 470, y = 300, w = 560, h = 720, maya = 1, client = 1, lean = 0, style }: { t: number; x?: number; y?: number; w?: number; h?: number; maya?: number; client?: number; lean?: number; style?: CSSProperties }) {
  const bob = Math.sin(t * 1.4) * 4;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 10, overflow: "hidden", border: `8px solid ${GOLD}`, boxShadow: "inset 0 0 60px rgba(255,220,170,.35)", ...style }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #F6E6CE 0%, #EFD6B4 60%, #E2C29C 100%)" }} />
      <div style={{ position: "absolute", inset: 0, filter: "blur(7px)" }}>
        {/* Lamp glow */}
        <div style={{ position: "absolute", left: w * 0.62, top: 40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,180,1) 0%, rgba(255,230,180,0) 70%)" }} />
        {/* Treatment chair and the client, reclined */}
        <div style={{ position: "absolute", left: w * 0.12, top: h * 0.56, width: w * 0.7, height: 70, borderRadius: 40, background: "#CDB293" }} />
        <div style={{ position: "absolute", left: w * 0.14, top: h * 0.5, width: 86, height: 70, borderRadius: "50%", background: "#8A6752", opacity: client }} />
        <div style={{ position: "absolute", left: w * 0.24, top: h * 0.53, width: w * 0.52, height: 56, borderRadius: 30, background: "#E9E2D6", opacity: client }} />
        {/* Maya, standing at the head of the chair */}
        <div style={{ position: "absolute", left: w * 0.1, top: h * 0.2 + bob, opacity: maya, transform: `rotate(${lean}deg)`, transformOrigin: "50% 100%" }}>
          <div style={{ width: 70, height: 84, borderRadius: "50%", background: "#6E4A36", marginLeft: 36 }} />
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2E231E", marginLeft: 62, marginTop: -100 }} />
          <div style={{ width: 150, height: 230, borderRadius: "60px 60px 20px 20px", background: "#F5EEE3", marginTop: 70 }} />
        </div>
      </div>
      {/* The frosting */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,.28) 0%, rgba(255,255,255,.1) 40%, rgba(255,255,255,.22) 100%)" }} />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (i + 1) * (h / 4), height: 2, background: "rgba(255,255,255,.35)" }} />
      ))}
    </div>
  );
}

/** The reception desk, front and top, with a slot for props. */
export function Desk({ y = 1180, children }: { y?: number; children?: ReactNode }) {
  return (
    <div style={{ position: "absolute", left: -40, right: -40, top: y }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: "linear-gradient(180deg, #FBF6EE 0%, #EFE4D4 100%)", borderRadius: "30px 30px 0 0", boxShadow: "0 -2px 0 rgba(255,255,255,.6) inset" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 66, height: 8, background: `linear-gradient(90deg, #9C7A48, ${GOLD}, #E4C38C, ${GOLD}, #9C7A48)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 74, height: 1000, background: "linear-gradient(180deg, #E8DCCB 0%, #D9C8B2 40%, #C9B59C 100%)" }} />
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ position: "absolute", top: 90, height: 900, left: 60 + i * 96, width: 2, background: "rgba(255,255,255,.18)" }} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: -30 }}>{children}</div>
    </div>
  );
}

export function Pumpkin({ size = 110, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <defs>
        <radialGradient id="pk" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#E7A767" />
          <stop offset="1" stopColor="#B96A34" />
        </radialGradient>
      </defs>
      <ellipse cx={50} cy={96} rx={40} ry={5} fill="#000" opacity={0.15} />
      {[-26, -12, 12, 26].map((dx, i) => (
        <ellipse key={i} cx={50 + dx} cy={62} rx={20} ry={32} fill="url(#pk)" stroke="#A55C2B" strokeWidth={1} />
      ))}
      <ellipse cx={50} cy={62} rx={22} ry={34} fill="url(#pk)" stroke="#A55C2B" strokeWidth={1} />
      <path d="M50 30 C48 20 52 14 58 12" stroke="#5B6B45" strokeWidth={6} strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** A smartphone lying on the desk, seen from the front at a slight angle, screen glowing. */
export function Phone({ glow = 1, style }: { glow?: number; style?: CSSProperties }) {
  return (
    <div style={{ width: 150, height: 290, borderRadius: 30, background: "#231F1D", padding: 9, boxSizing: "border-box", boxShadow: "0 20px 40px -10px rgba(40,30,20,.5)", transform: "perspective(900px) rotateX(38deg)", transformOrigin: "50% 100%", ...style }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 22, background: `linear-gradient(180deg, rgba(255,246,230,${0.25 + 0.75 * glow}), rgba(236,222,200,${0.2 + 0.6 * glow}))` }} />
    </div>
  );
}

/** The leather appointment ledger. `open` 0 … 1; the right page can carry a label and a stamp. */
export function Ledger({ open = 0, page, stamp = 0, w = 420, style }: { open?: number; page?: ReactNode; stamp?: number; w?: number; style?: CSSProperties }) {
  const h = w * 0.68;
  return (
    <div style={{ position: "relative", width: w, height: h, perspective: 1400, ...style }}>
      <div style={{ position: "absolute", left: "50%", top: 0, width: w / 2, height: h, background: "#F7EEDD", borderRadius: "0 6px 6px 0", boxShadow: "0 18px 30px -12px rgba(40,25,10,.5)", overflow: "hidden" }}>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 20, right: 20, top: 30 + i * (h - 50) / 9, height: 1, background: "rgba(120,90,60,.25)" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, opacity: open }}>{page}</div>
        {stamp > 0 && (
          <div style={{ position: "absolute", left: "12%", top: "52%", padding: "6px 14px", border: "4px solid #9E2A1F", borderRadius: 6, color: "#9E2A1F", fontFamily: "Georgia, serif", fontWeight: 700, letterSpacing: "0.12em", fontSize: w * 0.05, transform: `rotate(-9deg) scale(${1 + (1 - stamp) * 0.8})`, opacity: stamp }}>ELSEWHERE</div>
        )}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: w / 2, height: h, background: "#F2E7D4", borderRadius: "6px 0 0 6px", opacity: open }} />
      {/* The cover swings from closed (over the right page) to open (flat to the left). */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -4,
          width: w / 2 + 6,
          height: h + 8,
          background: "linear-gradient(135deg, #6E4228 0%, #4E2E1B 100%)",
          borderRadius: "4px 10px 10px 4px",
          transformOrigin: "0 50%",
          transform: `rotateY(${-180 * open}deg)`,
          backfaceVisibility: "hidden",
          boxShadow: "0 18px 30px -12px rgba(40,25,10,.6)",
        }}
      >
        <div style={{ position: "absolute", inset: 14, border: `2px solid ${GOLD}`, borderRadius: 6, opacity: 0.8 }} />
      </div>
    </div>
  );
}

export function Stamp({ size = 90, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 60 78" style={style}>
      <ellipse cx={30} cy={16} rx={13} ry={13} fill="#6E4228" />
      <rect x={25} y={24} width={10} height={24} fill={GOLD} />
      <rect x={10} y={46} width={40} height={14} rx={3} fill={GOLD} />
      <rect x={8} y={58} width={44} height={10} rx={2} fill="#8E6C3E" />
    </svg>
  );
}
