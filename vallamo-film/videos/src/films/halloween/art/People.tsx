import type { CSSProperties } from "react";

/**
 * Maya, the clinic owner: mid-thirties, warm brown skin, dark hair in a low bun, cream
 * clinical tunic, charcoal trousers. Drawn facing left in three-quarter, 400 x 900.
 * Poses move her arms and head: tend (at the headrest), phone (reading it), type (laptop),
 * and `look` turns her head towards camera.
 */
const SKIN = "#8C5A3C";
const SKIN_D = "#6E432D";
const HAIR = "#211815";
const TUNIC = "#F6F0E6";
const TUNIC_D = "#E3D8C8";
const TROUSER = "#3A3A40";

export type MayaPose = {
  arms?: "tend" | "phone" | "type" | "rest";
  look?: number; // 0 profile-ish … 1 towards camera
  lean?: number; // degrees, forward is negative
  blink?: number; // 0 … 1
  mouth?: number; // 0 closed … 1 speaking
  exhale?: number; // shoulders drop
};

function Arm({ shoulder, elbow, sleeve = TUNIC }: { shoulder: number; elbow: number; sleeve?: string }) {
  return (
    <g transform={`rotate(${shoulder})`}>
      <path d="M-18 0 C-20 60 -16 110 -12 150 L14 150 C18 110 20 60 18 0 Z" fill={sleeve} />
      <g transform={`translate(1 146) rotate(${elbow})`}>
        <path d="M-11 0 C-11 44 -9 88 -7 118 L9 118 C11 88 11 44 11 0 Z" fill={SKIN} />
        <ellipse cx={0} cy={128} rx={13} ry={17} fill={SKIN} />
      </g>
    </g>
  );
}

export function Maya({ pose = {}, t = 0, style }: { pose?: MayaPose; t?: number; style?: CSSProperties }) {
  const { arms = "rest", look = 0, lean = 0, blink = 0, mouth = 0, exhale = 0 } = pose;
  const breathe = Math.sin(t * 1.7) * 1.5 + exhale * 6;
  const A = {
    rest: { back: [6, -6], front: [10, -10] },
    tend: { back: [-58, -30], front: [-40, -50] },
    phone: { back: [18, -110], front: [-8, -120] },
    type: { back: [-20, -70], front: [-8, -84] },
  }[arms];
  const hx = -8 * look; // face turns towards camera
  return (
    <svg viewBox="0 0 400 900" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id="m-tunic" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={TUNIC} />
          <stop offset="1" stopColor={TUNIC_D} />
        </linearGradient>
      </defs>
      <g transform={`rotate(${lean} 200 560)`}>
        {/* Back arm */}
        <g transform="translate(236 272)">
          <Arm shoulder={A.back[0]} elbow={A.back[1]} sleeve={TUNIC_D} />
        </g>
        {/* Trousers and shoes */}
        <path d="M150 540 L140 860 L186 860 L204 600 L220 860 L266 860 L256 540 Z" fill={TROUSER} />
        <path d="M130 858 C130 876 150 884 190 882 L190 858 Z M214 858 L214 882 C250 884 272 876 272 858 Z" fill="#2A2A2E" />
        {/* Tunic */}
        <path d={`M142 ${258 + breathe} C160 244 196 238 218 240 C246 242 264 254 272 ${270 + breathe} L284 560 C250 574 176 576 132 560 Z`} fill="url(#m-tunic)" />
        <path d="M196 244 L204 540" stroke={TUNIC_D} strokeWidth={2} />
        {[300, 350, 400, 450].map((y) => (
          <circle key={y} cx={210} cy={y} r={3.5} fill="#D8CBB6" />
        ))}
        {/* Neck and mandarin collar */}
        <path d="M184 206 L186 248 L220 248 L218 206 Z" fill={SKIN_D} />
        <path d="M178 238 C190 252 214 252 226 238 L226 252 C212 262 192 262 178 252 Z" fill={TUNIC} />
        {/* Head, turned three-quarters left, with the low bun */}
        <g transform={`translate(${hx} ${breathe * 0.4})`}>
          <ellipse cx={228} cy={196} rx={30} ry={28} fill={HAIR} />
          <ellipse cx={200} cy={150} rx={50} ry={62} fill={SKIN} />
          <path d="M150 150 C146 98 176 82 206 84 C238 86 256 108 252 150 C244 124 226 108 200 108 C180 108 162 122 156 146 Z" fill={HAIR} />
          <path d="M156 146 C150 128 158 112 170 104" stroke="#3A2A24" strokeWidth={3} fill="none" />
          {/* Ear with a small gold stud */}
          <ellipse cx={236} cy={158} rx={8} ry={13} fill={SKIN_D} />
          <circle cx={237} cy={172} r={3} fill="#D9B77A" />
          {/* Eye, brow, nose, lips */}
          <path d={`M172 ${146} q10 ${-6 + blink * 6} 20 0`} stroke="#1E1512" strokeWidth={3.2} fill={blink > 0.5 ? "none" : "#1E1512"} strokeLinecap="round" />
          <path d="M168 132 q12 -8 26 -3" stroke={HAIR} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M156 150 q-6 16 4 22" stroke={SKIN_D} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d={`M162 ${186} q10 ${4 + mouth * 6} 20 0`} stroke="#6E2F28" strokeWidth={3.4} fill={mouth > 0.2 ? "#5A2520" : "none"} strokeLinecap="round" />
        </g>
        {/* Front arm */}
        <g transform="translate(160 276)">
          <Arm shoulder={A.front[0]} elbow={A.front[1]} />
        </g>
      </g>
    </svg>
  );
}

/** A client reclined in the treatment chair, seen from the side, head to the left. */
export function Client({ hair = "#3B2A22", skin = "#D9A987", t = 0, nod = 0, style }: { hair?: string; skin?: string; t?: number; nod?: number; style?: CSSProperties }) {
  const breathe = Math.sin(t * 1.3) * 2;
  return (
    <svg viewBox="0 0 800 360" style={{ overflow: "visible", ...style }}>
      {/* Chair */}
      <path d="M40 210 C40 180 70 170 110 170 L700 200 C740 204 760 230 750 260 L60 250 C48 246 40 232 40 210 Z" fill="#E7D8C3" />
      <rect x={300} y={255} width={40} height={90} fill="#B8925A" />
      <rect x={200} y={335} width={260} height={16} rx={8} fill="#9C7A48" />
      <path d="M40 206 C30 160 60 120 110 124 L150 130 L140 190 Z" fill="#DCCAB2" />
      {/* Client: blanket, shoulders, head on the headrest with a towel band */}
      <path d={`M200 ${176 - breathe} C300 150 520 160 700 190 L700 230 L200 226 Z`} fill="#F4EEE4" />
      <path d={`M150 ${170 - breathe} C170 150 210 148 230 160 L236 214 L150 214 Z`} fill="#EDE4D6" />
      <g transform={`rotate(${-nod * 8} 120 160)`}>
        <ellipse cx={116} cy={150} rx={46} ry={40} fill={skin} />
        <path d="M76 140 C80 108 116 100 146 116 C130 112 110 116 96 130 Z" fill={hair} />
        <path d="M80 128 C100 110 140 108 160 124 L156 136 C136 124 104 124 84 140 Z" fill="#FFFFFF" />
        <path d="M150 150 q8 -3 12 2" stroke="#6E432D" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M146 176 q8 4 14 -1" stroke="#9A4B3E" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
