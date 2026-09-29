import type { CSSProperties } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

/**
 * Mr Elsewhere, as he should be: a presence in the dark. A tall Victorian silhouette in a
 * tailcoat, round spectacles catching the light, pale eyes, smoke where his legs should
 * be; and the one bright thing about him, the white-gloved hand that takes bookings.
 */

/** Rolling fog: a tileable baked texture, drifting. `density` 0 … 1. */
export function Fog({ t, density = 0.6, speed = 1, tint = "none", style }: { t: number; density?: number; speed?: number; tint?: string; style?: CSSProperties }) {
  const layer = (k: number, dir: number, scale: number, o: number) => (
    <div
      style={{
        position: "absolute",
        inset: "-20%",
        backgroundImage: `url(${staticFile("halloween/fog.png")})`,
        backgroundSize: `${1024 * scale}px ${1024 * scale}px`,
        backgroundPosition: `${(t * 38 * speed * dir * k) % (1024 * scale)}px ${(t * 9 * speed * k) % (1024 * scale)}px`,
        opacity: o * density,
        filter: tint,
      }}
    />
  );
  return (
    // Pooled low, thinning upwards.
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", maskImage: "linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.55) 45%, #000 80%)", WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.55) 45%, #000 80%)", ...style }}>
      {layer(1, 1, 2.2, 0.9)}
      {layer(1.6, -1, 1.5, 0.6)}
    </AbsoluteFill>
  );
}

/**
 * The shade: `reveal` 0 … 1 brings him out of the dark; `eyes` lights his eyes; `recoil`
 * pushes him back into the smoke; `fade` dissolves him.
 */
export function Shade({ t, reveal = 1, eyes = 1, recoil = 0, fade = 0, style }: { t: number; reveal?: number; eyes?: number; recoil?: number; fade?: number; style?: CSSProperties }) {
  const sway = Math.sin(t * 0.9) * 6;
  const glint = 0.55 + 0.45 * Math.max(0, Math.sin(t * 1.7 + 1));
  const w = (i: number) => Math.sin(t * 1.3 + i * 1.9) * 16;
  return (
    <svg viewBox="0 0 500 1100" style={{ overflow: "visible", opacity: reveal * (1 - fade), ...style }}>
      <defs>
        <linearGradient id="sh-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0C0B10" />
          <stop offset="0.55" stopColor="#111118" />
          <stop offset="0.8" stopColor="#1B1E28" stopOpacity={0.7} />
          <stop offset="1" stopColor="#2A3040" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="sh-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9FB8D6" stopOpacity={0.55} />
          <stop offset="0.12" stopColor="#9FB8D6" stopOpacity={0} />
          <stop offset="0.88" stopColor="#E0B77A" stopOpacity={0} />
          <stop offset="1" stopColor="#E0B77A" stopOpacity={0.35} />
        </linearGradient>
        <filter id="sh-smoke" x="-30%" y="-10%" width="160%" height="130%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="sh-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="sh-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g transform={`translate(${sway} ${recoil * 60}) scale(${1 - recoil * 0.12})`} style={{ transformOrigin: "250px 500px" }}>
        {/* Smoke below the waist, rolling. */}
        <g filter="url(#sh-smoke)" opacity={0.85}>
          <path d={`M150 640 C120 760 ${110 + w(0)} 860 ${160 + w(1)} 960 C${200 + w(2)} 1040 ${250 + w(3)} 1080 ${260 + w(3)} 1100 C${290 + w(4)} 1040 ${330 + w(5)} 980 ${350 + w(5)} 900 C370 800 360 720 350 640 Z`} fill="#171A22" />
          <path d={`M180 900 C${150 + w(6)} 980 ${200 + w(7)} 1040 ${170 + w(8)} 1100`} stroke="#3B4454" strokeWidth={30} fill="none" strokeLinecap="round" opacity={0.5} />
          <path d={`M320 880 C${350 + w(8)} 960 ${300 + w(6)} 1030 ${340 + w(7)} 1100`} stroke="#3B4454" strokeWidth={24} fill="none" strokeLinecap="round" opacity={0.45} />
        </g>
        <g filter="url(#sh-soft)">
          {/* Tails */}
          <path d={`M170 560 C150 680 ${140 + w(9) * 0.5} 800 ${170 + w(9) * 0.5} 880 L230 640 Z`} fill="#0E0D13" />
          <path d={`M330 560 C350 680 ${360 + w(10) * 0.5} 800 ${330 + w(10) * 0.5} 880 L270 640 Z`} fill="#0E0D13" />
          {/* Tailcoat */}
          <path d="M126 300 C160 268 205 258 250 258 C295 258 340 268 374 300 L386 470 C380 560 368 620 356 660 L144 660 C132 620 120 560 114 470 Z" fill="url(#sh-body)" />
          {/* Collar and the pale shirt front, just catching the light */}
          <path d="M226 262 L250 300 L274 262 L266 244 L234 244 Z" fill="#5E6674" opacity={0.55} />
          <path d="M238 290 L250 360 L262 290 Z" fill="#1E2029" />
          {/* Head: slicked hair, long face in shadow */}
          <ellipse cx={250} cy={180} rx={58} ry={76} fill="#0E0D12" />
          <path d="M194 170 C190 120 218 98 250 98 C286 98 310 120 306 172 C298 140 280 128 250 128 C222 128 204 142 196 168 Z" fill="#1C1E26" />
        </g>
        {/* Rim light down both edges */}
        <path d="M126 300 C160 268 205 258 250 258 C295 258 340 268 374 300 L386 470 C380 560 368 620 356 660 L144 660 C132 620 120 560 114 470 Z" fill="url(#sh-rim)" />
        <ellipse cx={250} cy={180} rx={58} ry={76} fill="url(#sh-rim)" />
        {/* Spectacles catching the light */}
        <g opacity={0.35 + 0.65 * glint * reveal}>
          <circle cx={226} cy={178} r={17} fill="none" stroke="#D9B774" strokeWidth={2.2} />
          <circle cx={274} cy={178} r={17} fill="none" stroke="#D9B774" strokeWidth={2.2} />
          <path d="M243 176 Q250 171 257 176" stroke="#D9B774" strokeWidth={2} fill="none" />
          <path d="M214 166 L220 162" stroke="#FFF1D2" strokeWidth={3} strokeLinecap="round" opacity={glint} />
          <path d="M262 166 L268 162" stroke="#FFF1D2" strokeWidth={3} strokeLinecap="round" opacity={glint} />
        </g>
        {/* Eyes: pale, steady, lit from within */}
        <g filter="url(#sh-glow)" opacity={eyes}>
          <ellipse cx={226} cy={180} rx={5} ry={3.4 * eyes + 0.4} fill="#DDF3FF" />
          <ellipse cx={274} cy={180} rx={5} ry={3.4 * eyes + 0.4} fill="#DDF3FF" />
        </g>
        {/* The moustache, a pale curl in the dark */}
        <path d="M250 214 C238 208 222 210 212 220 C206 226 204 218 208 212 C204 224 214 230 228 228 C238 227 246 224 250 222 C254 224 262 227 272 228 C286 230 296 224 292 212 C296 218 294 226 288 220 C278 210 262 208 250 214 Z" fill="#8C95A3" opacity={0.75} />
      </g>
    </svg>
  );
}

/**
 * The spectral hand: a white glove, pointing left, sleeve trailing into smoke on the right.
 * `curl` 0 open … 1 closed fist; `pinch` 0 … 1 brings the index finger and thumb together.
 * Drawn in a 900 x 420 box; the fingertips reach x ≈ 40 when open.
 */
export function Hand({ t, curl = 0, pinch = 0, glow = 1, style }: { t: number; curl?: number; pinch?: number; glow?: number; style?: CSSProperties }) {
  // Long, thin, slightly spread fingers: index to little finger, knuckles along the hand's front edge.
  const fingers = [
    { x: 262, y: 172, len: 172, wb: 24, spread: 7, pinchable: true },
    { x: 256, y: 196, len: 186, wb: 25, spread: 1 },
    { x: 260, y: 220, len: 172, wb: 23, spread: -5 },
    { x: 270, y: 243, len: 138, wb: 20, spread: -12 },
  ];
  const w = (i: number) => Math.sin(t * 1.4 + i * 2.1) * 12;
  const seg = (len: number, wb: number, wt: number) => `M4 ${-wb / 2} L${-len} ${-wt / 2} A${wt / 2} ${wt / 2} 0 0 0 ${-len} ${wt / 2} L4 ${wb / 2} Z`;
  const finger = (f: (typeof fingers)[number], i: number) => {
    // Palm down: fingers curl under (tips downwards); a pinch brings the index down to the thumb.
    const idle = Math.sin(t * 2.2 + i) * 2;
    const b1 = f.spread + idle - curl * (55 + i * 5) - (f.pinchable ? pinch * 30 : pinch * 48);
    const b2 = -curl * 75 - (f.pinchable ? pinch * 34 : pinch * 60);
    const l1 = f.len * 0.52;
    const l2 = f.len * 0.48;
    return (
      <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${b1})`}>
        <path d={seg(l1, f.wb, f.wb * 0.8)} fill="url(#hd-glove)" />
        <g transform={`translate(${-l1 + 3} 0) rotate(${b2})`}>
          <circle r={f.wb * 0.42} fill="url(#hd-glove)" />
          <path d={seg(l2, f.wb * 0.8, f.wb * 0.5)} fill="url(#hd-glove)" />
        </g>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 900 420" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id="hd-glove" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.96} />
          <stop offset="0.55" stopColor="#E8EEF3" stopOpacity={0.92} />
          <stop offset="1" stopColor="#B9C6D2" stopOpacity={0.9} />
        </linearGradient>
        <linearGradient id="hd-sleeve" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1A1B22" />
          <stop offset="0.6" stopColor="#15161C" stopOpacity={0.9} />
          <stop offset="1" stopColor="#15161C" stopOpacity={0} />
        </linearGradient>
        <filter id="hd-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="16" result="b" />
          <feColorMatrix in="b" type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.9  0 0 0 0 1  0 0 0 0.75 0" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hd-smoke" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <g filter="url(#hd-smoke)">
        <path d={`M420 162 C560 ${150 + w(0)} 700 ${140 + w(1)} 900 ${160 + w(2)} L900 ${290 + w(3)} C700 ${300 + w(4)} 560 ${290 + w(5)} 420 280 Z`} fill="url(#hd-sleeve)" />
      </g>
      <g filter={glow > 0 ? "url(#hd-glow)" : undefined}>
        <path d="M416 166 C460 158 494 166 516 178 L516 272 C494 284 460 290 416 282 Z" fill="#17181E" />
        <rect x={394} y={160} width={34} height={128} rx={9} fill="#E6EBF0" />
        {/* The back of the hand: long and narrow */}
        <path d="M398 170 C356 158 300 156 266 164 C246 170 240 190 242 212 C244 236 252 252 272 262 C312 276 360 278 398 272 Z" fill="url(#hd-glove)" />
        {[196, 218].map((y) => (
          <path key={y} d={`M388 ${y} C356 ${y - 3} 326 ${y - 3} 298 ${y}`} stroke="#B8C4CF" strokeWidth={1.6} fill="none" opacity={0.7} />
        ))}
        {fingers.map(finger).reverse()}
        {/* Thumb, underneath; it rises to meet the index finger in a pinch */}
        <g transform={`translate(298 258) rotate(${-26 + pinch * 34 - curl * 10})`}>
          <path d="M4 -13 L-70 -10 A10 10 0 0 0 -70 10 L4 13 Z" fill="url(#hd-glove)" />
          <g transform={`translate(-68 0) rotate(${8 + pinch * 22})`}>
            <circle r={9} fill="url(#hd-glove)" />
            <path d="M4 -10 L-52 -7 A7 7 0 0 0 -52 7 L4 10 Z" fill="url(#hd-glove)" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/** Night in the clinic: the real inbox, far away in the dark, cold and out of focus. */
export function Night({ t, lift = 0, children }: { t: number; lift?: number; children?: React.ReactNode }) {
  // A practical light that flickers now and then.
  const flick = 1 - 0.18 * Math.max(0, Math.sin(t * 13.7) * Math.sin(t * 3.1) * Math.sin(t * 0.7 + 1)) ;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#07060A" }}>
      <AbsoluteFill style={{ opacity: 0.32 + 0.5 * lift }}>
        <Img src={staticFile("ui/bits/world-inbox-list-b16.jpg")} style={{ position: "absolute", left: "50%", top: "50%", width: 1600, marginLeft: -800, marginTop: -1300, transform: `perspective(1400px) rotateX(48deg) rotateZ(-14deg) translateY(${-t * 20}px) scale(1.4)`, filter: "grayscale(.5) brightness(.55) sepia(.2) hue-rotate(180deg)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 55% at 50% 45%, rgba(40,48,70,${0.2 * flick}) 0%, rgba(7,6,10,.9) 100%)` }} />
      {children}
    </AbsoluteFill>
  );
}
