/** @type {import('tailwindcss').Config} */
// =============================================================
// Vallamo design tokens → Tailwind (v49.450 redesign)
// =============================================================
// Every colour is an RGB-triplet CSS variable from src/app/tokens.css, so
// `/alpha` utilities work (bg-ink/10) and dark mode is a variable swap, not a
// second set of classes. The token table is generated; edit it there.
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  // Classes built from variables (pill-${tone}, btn-${variant}) must be kept.
  safelist: [{ pattern: /^pill-(good|warn|alert|info|muted|mist|outline)$/ }, { pattern: /^btn-(primary|brand|secondary|ghost|danger|danger-solid|sm|lg|icon)$/ }],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "rgb(var(--ink-c) / <alpha-value>)", 2: "rgb(var(--ink-2-c) / <alpha-value>)", 3: "rgb(var(--ink-3-c) / <alpha-value>)", 4: "rgb(var(--ink-4-c) / <alpha-value>)", hover: "rgb(var(--ink-hover-c) / <alpha-value>)" },
        "on-ink": "rgb(var(--on-ink-c) / <alpha-value>)",
        // v49.452: soft/faint/rich (and the tofu/buff/midnight families that sat
        // beside them) were the old palette's names for screens not yet
        // redesigned. Every such screen is now ported, so DEFAULT — which IS
        // still used (bg-espresso/text-espresso, e.g. the toast host) — is all
        // that remains.
        espresso: { DEFAULT: "rgb(var(--espresso-c) / <alpha-value>)" },
        rust: { DEFAULT: "rgb(var(--rose-c) / <alpha-value>)", soft: "rgb(var(--rose-soft-c) / <alpha-value>)" },
        "clay-ring": "var(--clay-ring)",
        brand: { DEFAULT: "var(--brand)", dark: "var(--brand-dark)", light: "var(--brand-light)", 50: "var(--brand-50)", 100: "var(--brand-100)", 200: "var(--brand-200)" },
        code: "rgb(var(--code-c) / <alpha-value>)",
        scrim: "rgb(var(--scrim-c) / <alpha-value>)",
        danger: "rgb(var(--danger-c) / <alpha-value>)",
        paper: { DEFAULT: "rgb(var(--paper-c) / <alpha-value>)", pure: "#ffffff" },
        canvas: { DEFAULT: "rgb(var(--canvas-c) / <alpha-value>)", deep: "rgb(var(--canvas-deep-c) / <alpha-value>)", sunk: "rgb(var(--canvas-sunk-c) / <alpha-value>)" },
        line: { DEFAULT: "rgb(var(--line-c) / <alpha-value>)", soft: "rgb(var(--line-soft-c) / <alpha-value>)", strong: "rgb(var(--line-strong-c) / <alpha-value>)" },
        clay: { DEFAULT: "rgb(var(--clay-c) / <alpha-value>)", deep: "rgb(var(--clay-deep-c) / <alpha-value>)", ink: "rgb(var(--clay-ink-c) / <alpha-value>)", soft: "rgb(var(--clay-soft-c) / <alpha-value>)", tint: "rgb(var(--clay-tint-c) / <alpha-value>)", wash: "rgb(var(--clay-wash-c) / <alpha-value>)" },
        sage: { DEFAULT: "rgb(var(--sage-c) / <alpha-value>)", ink: "rgb(var(--sage-ink-c) / <alpha-value>)", soft: "rgb(var(--sage-soft-c) / <alpha-value>)", wash: "rgb(var(--sage-wash-c) / <alpha-value>)" },
        rose: { DEFAULT: "rgb(var(--rose-c) / <alpha-value>)", ink: "rgb(var(--rose-ink-c) / <alpha-value>)", soft: "rgb(var(--rose-soft-c) / <alpha-value>)", wash: "rgb(var(--rose-wash-c) / <alpha-value>)" },
        amber: { DEFAULT: "rgb(var(--amber-c) / <alpha-value>)", ink: "rgb(var(--amber-ink-c) / <alpha-value>)", soft: "rgb(var(--amber-soft-c) / <alpha-value>)" },
        mist: { DEFAULT: "rgb(var(--mist-c) / <alpha-value>)", ink: "rgb(var(--mist-ink-c) / <alpha-value>)", soft: "rgb(var(--mist-soft-c) / <alpha-value>)" },
        ch: { ig: "rgb(var(--ch-ig-c) / <alpha-value>)", wa: "rgb(var(--ch-wa-c) / <alpha-value>)", web: "rgb(var(--ch-web-c) / <alpha-value>)", sms: "rgb(var(--ch-sms-c) / <alpha-value>)" },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", '"Times New Roman"', "serif"],
        display: ["var(--font-display)"],
        // Literal Inter first (same stack as --font-sans in globals.css): pinned by dashboard_overview_insights.
        sans: ['"Inter"', "ui-sans-serif", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "2xs": ["11px", "16px"],
        xs: ["12px", "16px"],
        sm: ["13px", "18px"],
        base: ["14px", "20px"],
        md: ["15px", "22px"],
        lg: ["17px", "24px"],
        xl: ["20px", "28px"],
      },
      borderRadius: { xl: "12px", "2xl": "16px", "3xl": "22px" },
      boxShadow: {
        xs: "var(--sh-xs)",
        sm: "var(--sh-sm)",
        card: "var(--sh-card)",
        pop: "var(--sh-pop)",
        float: "var(--sh-float)",
        ring: "0 0 0 3px var(--clay-ring)",
      },
      keyframes: {
        rise: { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "none" } },
        fade: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideL: { from: { transform: "translateX(24px)", opacity: 0 }, to: { transform: "none", opacity: 1 } },
        pop: { from: { opacity: 0, transform: "scale(.97) translateY(4px)" }, to: { opacity: 1, transform: "none" } },
        pulse2: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.35 } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
        blurIn: { from: { opacity: 0, filter: "blur(10px)", transform: "translateY(8px)" }, to: { opacity: 1, filter: "blur(0)", transform: "none" } },
      },
      animation: {
        rise: "rise .22s cubic-bezier(.2,.7,.2,1) both",
        fade: "fade .18s ease both",
        slideL: "slideL .24s cubic-bezier(.2,.7,.2,1) both",
        pop: "pop .16s cubic-bezier(.2,.7,.2,1) both",
        pulse2: "pulse2 1.6s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        blurIn: "blurIn .5s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [],
};
