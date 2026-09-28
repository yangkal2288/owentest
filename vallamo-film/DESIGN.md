# Meet Vallamo: world and design rules

**World:** Vallamo's own clean white. Real product UI lifts off the page in 3D and lands where it belongs. The film's story is objects arriving in their place: enquiries fall into the inbox, a booking card flies into the diary, the grid collapses into the mark.

## Colour has meaning
| Colour | Hex | Meaning |
|---|---|---|
| White | `#FFFFFF` | The world. |
| Paper | `#FFFDF9` | Product surfaces only. |
| Ink | `#2C2520` | Headlines and text only. No ink backgrounds: the film stays all white (Owen, 28 Sep). |
| Clay | `#A47F54` | The one accent: the dot and line, accent words, the logo, the one CTA pill. |
| Sage | `#7C8A6E` | Only where the real UI uses it (booked blocks). |
| WA / IG / web | `#12805A` / `#D86A93` / `#3A7BD5` | Channel badges only. |

## Type has jobs
- Inter 700, tracking −0.035em: kinetic lines (88–230 px).
- Playfair Display italic, clay: the accent word or line.
- Inter 600 uppercase 20 px, 0.14em, clay: eyebrows.
- UI text is the product's own, inside captured UI only.

## Depth
- Floating objects get a floor contact shadow (blurred ellipse), never a box-shadow.
- Depth of field: background layers blur with distance.
- Floating UI cards: paper, 1.5 px `#E7DFD1` hairline, product radius.

## Motifs
1. The clay dot → line (opens and closes the film).
2. The Vallamo mark (reveal as a mask draw, never a spin).
3. Real inbox rows and booking blocks.
4. The THU 24 card (the booking that travels through the film).

## Banned (no-slop-motion defaults, plus this brief)
Radial gradients, glows, vignettes, coloured worlds · card grids or icon lists as explanation (the tilted grids in shots 7 and 11 are allowed) · static screens · text parked at the top · hard pops, flashes, black dips · glitch or shader transitions · linear moves · overshoot or bounce on UI · CSS colour filters · more than one CTA · a sound on every landing · mocked, redrawn or AI-generated UI · "every channel" wording while voice is out (eyebrow reads "Your channels").

## Copy checked against vallamo.com (28 Sep 2026)
- Live site: "Your entire front desk. Handled by Vallamo." · "Answers from your own information" · "Books into the calendar you already run" · "Follows up when enquiries go cold" (off by default) · "Protects appointments with a deposit" (optional) · "Hands over the moment it matters" · "Live in ten minutes, not months" · "Voice coming in October".
- Channel order on the site: website, WhatsApp, Instagram.
- CTA style: clay pill, white text, ↗.

## Sources of every UI pixel
Captured from `videos/public/ui/source.html` (demo tenant North House Aesthetics) by `videos/scripts/snapshot.mjs`, `fragments*.mjs` and `capture-stills.mjs`. Frames showing demo data carry "Demo clinic · illustrative figures".
