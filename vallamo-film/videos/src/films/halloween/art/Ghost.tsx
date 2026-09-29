import type { CSSProperties } from "react";

/**
 * Mr Elsewhere, the booking thief: a tall, courteous Victorian receptionist ghost.
 * Charcoal tailcoat, muted-gold waistcoat, white gloves, round gold spectacles, silver
 * moustache; translucent, fading into mist below the waist. Drawn in his own 400 x 900 box.
 * Every performance beat is a prop: brows (−1 frown … 1 raised), eyes (0 open … 1 narrowed),
 * the right arm's pose (rest, watch, reach, pinch, bow), the head tilt, the fade.
 */
export type GhostPose = {
  brow?: number; // -1 … 1
  browL?: number; // one eyebrow on its own
  squint?: number; // 0 … 1
  smile?: number; // 0 … 1 (the moustache lifts)
  tilt?: number; // head, degrees
  lean?: number; // body, degrees
  arm?: { shoulder: number; elbow: number; hand: "open" | "pinch" | "fist" | "watch" | "rest" };
  fade?: number; // 0 solid-ish … 1 gone
  t?: number; // for the mist
};

const COAT = "#3A3A40";
const COAT_D = "#2A2A30";
const GOLD = "#B8925A";
const GOLD_D = "#8E6C3E";
const SKIN = "#E8EEF2";
const SKIN_S = "#C9D4DC";
const SILVER = "#C3C8CE";
const SILVER_D = "#9AA1A8";
const GLOVE = "#FBFBF8";

function Hand({ pose }: { pose: "open" | "pinch" | "fist" | "watch" | "rest" }) {
  // Drawn pointing down the forearm (+y), wrist at 0,0.
  if (pose === "pinch")
    return (
      <g>
        <path d="M-17 0 C-22 14 -20 30 -10 38 L6 40 C16 34 20 18 16 2 Z" fill={GLOVE} stroke="#D9DCDC" strokeWidth={1.5} />
        <path d="M6 38 C10 50 8 60 2 64 C-2 60 -2 50 0 40" fill={GLOVE} stroke="#D9DCDC" strokeWidth={1.5} />
        <path d="M-10 36 C-16 46 -12 58 -2 62" fill="none" stroke="#D9DCDC" strokeWidth={9} strokeLinecap="round" />
        <path d="M-10 36 C-16 46 -12 58 -2 62" fill="none" stroke={GLOVE} strokeWidth={6.5} strokeLinecap="round" />
      </g>
    );
  if (pose === "fist")
    return <path d="M-17 0 C-22 14 -20 32 -8 40 C4 44 16 36 17 20 C18 10 16 4 15 0 Z" fill={GLOVE} stroke="#D9DCDC" strokeWidth={1.5} />;
  if (pose === "open")
    return (
      <g>
        <path d="M-17 0 C-22 12 -21 26 -14 34 L12 34 C18 24 19 10 15 0 Z" fill={GLOVE} stroke="#D9DCDC" strokeWidth={1.5} />
        {[-12, -4, 4, 11].map((x, i) => (
          <path key={i} d={`M${x} 30 L${x + (i - 1.5) * 2} ${58 - Math.abs(i - 1.5) * 5}`} stroke="#D9DCDC" strokeWidth={9} strokeLinecap="round" />
        ))}
        {[-12, -4, 4, 11].map((x, i) => (
          <path key={i} d={`M${x} 30 L${x + (i - 1.5) * 2} ${58 - Math.abs(i - 1.5) * 5}`} stroke={GLOVE} strokeWidth={6.6} strokeLinecap="round" />
        ))}
        <path d="M-17 10 C-26 18 -28 28 -24 34" stroke={GLOVE} strokeWidth={8} strokeLinecap="round" fill="none" />
      </g>
    );
  // rest / watch: a relaxed gloved hand
  return <path d="M-17 0 C-22 16 -18 36 -4 42 C10 44 19 32 17 14 C16 8 15 3 15 0 Z" fill={GLOVE} stroke="#D9DCDC" strokeWidth={1.5} />;
}

export function PocketWatch({ size = 60, open = 1, hands = 0 }: { size?: number; open?: number; hands?: number }) {
  // hands: elapsed minutes on the dial
  const m = (hands % 60) * 6;
  const h = (hands / 60) * 30 + 300;
  return (
    <svg width={size} height={size * 1.25} viewBox="-50 -70 100 125" style={{ overflow: "visible" }}>
      <path d="M0 -58 C-8 -58 -8 -50 0 -50 C8 -50 8 -58 0 -58" fill="none" stroke={GOLD} strokeWidth={4} />
      <rect x={-6} y={-52} width={12} height={8} rx={2} fill={GOLD_D} />
      <circle r={44} fill={GOLD} />
      <circle r={44} fill="none" stroke={GOLD_D} strokeWidth={3} />
      <circle r={37} fill="#FBF6EC" opacity={open} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={0} y1={-31} x2={0} y2={i % 3 === 0 ? -25 : -28} stroke="#3A3A40" strokeWidth={i % 3 === 0 ? 2.4 : 1.3} transform={`rotate(${i * 30})`} opacity={open} />
      ))}
      <g opacity={open}>
        <line x1={0} y1={0} x2={0} y2={-17} stroke="#2C2520" strokeWidth={3.2} strokeLinecap="round" transform={`rotate(${h})`} />
        <line x1={0} y1={0} x2={0} y2={-27} stroke="#2C2520" strokeWidth={2} strokeLinecap="round" transform={`rotate(${m})`} />
        <circle r={2.6} fill="#2C2520" />
      </g>
      {/* The lid, swinging open to the left. */}
      <ellipse cx={-44 * (1 - open) - 2 * open} cy={0} rx={44 * (1 - open) + 3} ry={44} fill={GOLD} stroke={GOLD_D} strokeWidth={2} opacity={1 - open * 0.85} />
    </svg>
  );
}

export function Ghost({ pose = {}, style }: { pose?: GhostPose; style?: CSSProperties }) {
  const { brow = 0, browL, squint = 0, smile = 0.3, tilt = 0, lean = 0, fade = 0, t = 0 } = pose;
  const arm = pose.arm ?? { shoulder: 8, elbow: -20, hand: "rest" as const };
  const bl = browL ?? brow;
  const eyeH = 5.5 * (1 - 0.7 * squint);
  const wisp = (i: number) => Math.sin(t * 1.6 + i * 1.7) * 10;
  return (
    <svg viewBox="0 0 400 900" style={{ overflow: "visible", opacity: 0.93 * (1 - fade), ...style }}>
      <defs>
        <linearGradient id="g-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COAT} stopOpacity={1} />
          <stop offset="0.35" stopColor="#5A6470" stopOpacity={0.6} />
          <stop offset="1" stopColor="#C9D6E0" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="g-aura" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#DCEBF5" stopOpacity={0.5} />
          <stop offset="0.6" stopColor="#DCEBF5" stopOpacity={0.16} />
          <stop offset="1" stopColor="#DCEBF5" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="g-coat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={COAT_D} />
          <stop offset="0.45" stopColor={COAT} />
          <stop offset="1" stopColor="#4A4A52" />
        </linearGradient>
        <linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#CDA86E" />
          <stop offset="1" stopColor={GOLD_D} />
        </linearGradient>
        <radialGradient id="g-face" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#F6F9FB" />
          <stop offset="1" stopColor={SKIN_S} />
        </radialGradient>
        <filter id="g-wisp" x="-40%" y="-20%" width="180%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="g-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feColorMatrix in="b" type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.93  0 0 0 0 0.98  0 0 0 0.55 0" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx={200} cy={360} rx={280} ry={440} fill="url(#g-aura)" />
      <g filter="url(#g-glow)" transform={`rotate(${lean} 200 560)`}>
        {/* Mist: the tails and legs dissolve into wisps. */}
        <g filter="url(#g-wisp)">
          <path
            d={`M128 520 C122 600 ${118 + wisp(0)} 660 ${140 + wisp(1)} 730 C${156 + wisp(2)} 790 ${186 + wisp(3)} 830 ${204 + wisp(3)} 860 C${216 + wisp(4)} 820 ${250 + wisp(4)} 780 ${262 + wisp(5)} 720 C${280 + wisp(5)} 650 276 590 272 520 Z`}
            fill="url(#g-mist)"
          />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${170 + i * 30} 700 C${150 + i * 34 + wisp(i + 6)} 760 ${190 + i * 20 + wisp(i + 2)} 800 ${170 + i * 32 + wisp(i + 4)} 870`}
              stroke="#AEBBC6"
              strokeOpacity={0.35}
              strokeWidth={14 - i * 3}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>
        {/* Tailcoat body */}
        {/* The tails, behind */}
        <path d={`M132 500 C124 580 ${118 + wisp(7) * 0.4} 650 ${138 + wisp(7) * 0.4} 700 L184 560 Z`} fill={COAT_D} opacity={0.85} />
        <path d={`M268 500 C276 580 ${282 + wisp(8) * 0.4} 650 ${262 + wisp(8) * 0.4} 700 L216 560 Z`} fill={COAT_D} opacity={0.85} />
        <path d="M112 252 C134 232 166 226 200 226 C234 226 266 232 288 252 L294 400 C290 460 280 510 270 548 L130 548 C120 510 110 460 106 400 Z" fill="url(#g-coat)" />
        {/* Waistcoat */}
        <path d="M172 262 L200 300 L228 262 L240 510 C228 530 214 538 200 538 C186 538 172 530 160 510 Z" fill="url(#g-gold)" />
        {[330, 375, 420, 465].map((y) => (
          <circle key={y} cx={200} cy={y} r={4.5} fill={GOLD_D} stroke="#6E532F" strokeWidth={1} />
        ))}
        {/* Watch chain */}
        <path d="M200 380 C214 404 236 404 244 392" fill="none" stroke="#D9BE88" strokeWidth={2.2} />
        {/* Lapels */}
        <path d="M172 262 L200 300 L186 320 L156 252 Z" fill={COAT_D} />
        <path d="M228 262 L200 300 L214 320 L244 252 Z" fill={COAT_D} />
        <path d="M156 252 L126 410 L150 392 L186 320 Z" fill="#33333A" />
        <path d="M244 252 L274 410 L250 392 L214 320 Z" fill="#33333A" />
        {/* Wing collar and cravat */}
        <path d="M176 222 L200 250 L224 222 L218 206 L182 206 Z" fill="#FFFFFF" />
        <path d="M188 238 L200 272 L212 238 L200 246 Z" fill="#2A2A30" />
        <ellipse cx={200} cy={240} rx={8} ry={6} fill="#2A2A30" />
        {/* Left arm (his right, viewer's left): resting along the side */}
        <path d="M116 258 C98 310 94 380 100 460 L124 460 C122 390 126 320 136 272 Z" fill={COAT_D} />
        <rect x={98} y={456} width={28} height={12} rx={5} fill="#FFFFFF" />
        <g transform="translate(112 468) scale(0.85)">
          <Hand pose="rest" />
        </g>
        {/* Right arm (viewer's right): performs */}
        <g transform={`translate(282 262) rotate(${arm.shoulder})`}>
          <path d="M-13 -4 C-16 50 -14 110 -9 156 L13 156 C16 110 16 50 13 -4 Z" fill={COAT} />
          <g transform={`translate(2 154) rotate(${arm.elbow})`}>
            <path d="M-11 0 C-12 44 -10 90 -8 128 L10 128 C12 90 12 44 11 0 Z" fill={COAT} />
            <rect x={-12} y={124} width={24} height={12} rx={5} fill="#FFFFFF" />
            <g transform="translate(0 136) scale(0.85)">
              <Hand pose={arm.hand} />
            </g>
          </g>
        </g>
        {/* Head */}
        <g transform={`rotate(${tilt} 200 200)`}>
          <ellipse cx={200} cy={152} rx={54} ry={72} fill="url(#g-face)" />
          <ellipse cx={147} cy={156} rx={8} ry={15} fill={SKIN_S} />
          <ellipse cx={253} cy={156} rx={8} ry={15} fill={SKIN_S} />
          {/* Silver hair, neatly side-parted */}
          <path d="M146 134 C142 94 168 76 200 76 C236 76 258 96 256 136 C250 112 236 100 214 98 C196 97 172 104 154 120 Z" fill={SILVER} />
          <path d="M172 78 C188 86 200 92 214 94" stroke={SILVER_D} strokeWidth={2} fill="none" />
          {/* Eyes behind the spectacles */}
          <ellipse cx={177} cy={146} rx={4.2} ry={eyeH} fill="#2E3440" />
          <ellipse cx={223} cy={146} rx={4.2} ry={eyeH} fill="#2E3440" />
          <circle cx={178.5} cy={144} r={1.3} fill="#FFFFFF" />
          <circle cx={224.5} cy={144} r={1.3} fill="#FFFFFF" />
          {/* Brows */}
          <path d={`M160 ${126 - bl * 9} Q177 ${116 - bl * 12} 192 ${125 - bl * 6}`} stroke={SILVER_D} strokeWidth={5} strokeLinecap="round" fill="none" />
          <path d={`M208 ${125 - brow * 6} Q223 ${116 - brow * 12} 240 ${126 - brow * 9}`} stroke={SILVER_D} strokeWidth={5} strokeLinecap="round" fill="none" />
          {/* Spectacles */}
          <circle cx={177} cy={146} r={16} fill="rgba(220,235,245,.18)" stroke={GOLD} strokeWidth={2.6} />
          <circle cx={223} cy={146} r={16} fill="rgba(220,235,245,.18)" stroke={GOLD} strokeWidth={2.6} />
          <path d="M193 144 Q200 139 207 144" stroke={GOLD} strokeWidth={2.4} fill="none" />
          <path d="M161 144 L142 140 M239 144 L258 140" stroke={GOLD} strokeWidth={2} />
          {/* Nose */}
          <path d="M200 150 C196 162 194 170 200 174 C204 175 207 173 208 171" stroke={SKIN_S} strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* The moustache: waxed, silver, curled; it lifts when he is pleased */}
          <path
            d={`M200 182 C188 176 172 176 160 ${184 - smile * 6} C150 ${190 - smile * 8} 144 ${184 - smile * 10} 146 ${176 - smile * 10} C148 ${186 - smile * 8} 160 ${194 - smile * 4} 176 ${192 - smile * 2} C188 191 196 189 200 188 C204 189 212 191 224 ${192 - smile * 2} C240 ${194 - smile * 4} 252 ${186 - smile * 8} 254 ${176 - smile * 10} C256 ${184 - smile * 10} 250 ${190 - smile * 8} 240 ${184 - smile * 6} C228 176 212 176 200 182 Z`}
            fill={SILVER}
            stroke={SILVER_D}
            strokeWidth={1.2}
          />
          {/* A thin, pleased mouth */}
          <path d={`M188 ${203 - smile * 2} Q200 ${206 + smile * 3} 212 ${203 - smile * 2}`} stroke="#8F9AA4" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
