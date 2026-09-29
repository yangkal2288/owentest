import type { CSSProperties } from "react";

import { C, FONT } from "../../brand";

/**
 * The ad's type, as vallamo.com sets it: headlines in Playfair Display 500 with tight
 * tracking (".hero h1{font:500 …/1.08 var(--serif);letter-spacing:-2.4px}" at 68px),
 * the emphasis in the italic, clay-deep ("Your entire front desk. <em>Handled by Vallamo.</em>").
 */
export const display = (size: number): CSSProperties => ({
  fontFamily: FONT.serif,
  fontWeight: 500,
  fontSize: size,
  letterSpacing: "-0.035em",
  lineHeight: 1.08,
  color: C.ink,
});

export const em = (size: number): CSSProperties => ({
  fontFamily: FONT.serif,
  fontStyle: "italic",
  fontWeight: 500,
  fontSize: size,
  letterSpacing: "-0.02em",
  color: C.clayDeep,
});

/** The site's eyebrow: small caps sans, 650, 0.16em, clay-deep. */
export const eyebrow = (size: number): CSSProperties => ({
  fontFamily: FONT.sans,
  fontWeight: 650,
  fontSize: size,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: C.clayDeep,
});

/** The loss colour: a warm brick red that sits with the clay. */
export const RED = "#C2412F";
