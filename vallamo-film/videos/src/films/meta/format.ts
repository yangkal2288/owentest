import { createContext, useContext } from "react";

/**
 * The two Meta placements. Every scene is laid out for both from these numbers.
 * 9:16 (Reels, Stories): Meta covers the top 14% and bottom 35% with its own UI,
 * so headlines, ALWAYS, the logo and the CTA stay between `top` and `safe`.
 * 4:5 (Feed): no overlay, a shorter frame; the UI shrinks to fit under the headline.
 */
export type Format = {
  id: "916" | "45";
  W: number;
  H: number;
  /** First line of key text. */
  top: number;
  /** Key text ends above this. */
  safe: number;
  /** Where the product UI sits (its top) and its scale (px per css px of the widget). */
  uiTop: number;
  ui: number;
  /** Headline sizes scale with this. */
  type: number;
};

export const FORMATS: Record<Format["id"], Format> = {
  "916": { id: "916", W: 1080, H: 1920, top: 262, safe: 1250, uiTop: 590, ui: 2.3, type: 1 },
  "45": { id: "45", W: 1080, H: 1350, top: 84, safe: 1290, uiTop: 330, ui: 1.9, type: 0.86 },
};

export const FormatCtx = createContext<Format>(FORMATS["916"]);
export const useF = () => useContext(FormatCtx);
/** Pick a value per format. */
export const pick = <T,>(f: Format, tall: T, feed: T) => (f.id === "916" ? tall : feed);
