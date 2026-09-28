// Vallamo light-theme tokens, copied from dashboard/src/app/tokens.css (v49.456).
// Every colour that animates is a hex token here.
export const C = {
  canvas: "#F6F1E9", // --canvas-c 246 241 233
  paper: "#FFFDF9", // --paper-c 255 253 249
  ink: "#2C2520", // --ink-c 44 37 32
  ink2: "#625850", // --ink-2-c 98 88 80
  ink3: "#776C62", // --ink-3-c 119 108 98
  ink4: "#A0968B", // --ink-4-c
  line: "#E7DFD1", // --line-c
  lineSoft: "#F0EADF",
  clay: "#A47F54", // --clay-c 164 127 84
  clayDeep: "#8A6A44",
  clayInk: "#7A5C38", // --clay-ink-c 122 92 56
  clayWash: "#F8F2E9",
  sage: "#7C8A6E",
  espresso: "#2C2520",
  ig: "#D86A93", // --ch-ig-c
  wa: "#12805A", // --ch-wa-c
  web: "#3A7BD5", // --ch-web-c
} as const;

// Shadows from tokens.css
export const SH = {
  pop: "0 12px 40px -12px rgb(44 37 32 / .28), 0 2px 6px rgb(44 37 32 / .06)",
  float: "0 24px 64px -24px rgb(44 37 32 / .35)",
  card: "0 1px 2px rgb(44 37 32 / .04), 0 4px 16px -8px rgb(44 37 32 / .06)",
} as const;

export const FONT = {
  serif: '"Playfair Display", Georgia, serif',
  sans: '"Inter", ui-sans-serif, -apple-system, sans-serif',
} as const;
