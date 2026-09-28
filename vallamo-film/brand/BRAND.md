# Vallamo brand package

Everything here is taken from the deployed codebase (`../sources/vallamo-deploy-ready-v49.456.zip`: `dashboard/public/` and `dashboard/src/app/tokens.css`) and the live site, vallamo.com.

## Logo (`logo/`)

| File | Use |
|---|---|
| `vallamo-logo-lockup.svg` | Mark stacked over the wordmark. End cards and hero moments. |
| `vallamo-mark.svg` | The circular knot mark alone. Logo reveals, favicon-sized moments. |
| `vallamo-wordmark.svg` | The italic script "Vallamo" alone. |
| `vallamo-logo.png`, `icon-512.png`, `favicon.svg` | Raster and favicon versions. |

- The SVGs use **`currentColor`**. Colour them **clay `#A47F54`** on light backgrounds. In Remotion, draw them as a CSS mask filled with the colour (as in the existing films).
- Don't stretch, recolour outside the palette, add effects, or rebuild the mark.

## Colour (light theme, from `tokens.css`)

| Token | Hex | Use |
|---|---|---|
| paper | `#FFFDF9` | Vallamo's white: surfaces, the film's world |
| canvas | `#F6F1E9` | Warm off-white app background |
| ink | `#2C2520` | Primary text, dark buttons |
| ink-2 | `#625850` | Secondary text |
| ink-3 | `#776C62` | Muted text |
| line | `#E7DFD1` | Hairline borders |
| **clay** | **`#A47F54`** | **The one accent:** logo, accent words, CTA pill |
| clay-ink | `#7A5C38` | Clay text on light surfaces |
| clay-wash | `#F8F2E9` | Soft clay surfaces |
| sage | `#7C8A6E` | Success / "Booked" |
| channel · Instagram | `#D86A93` | Instagram badges only |
| channel · WhatsApp | `#12805A` | WhatsApp badges only |
| channel · Web | `#3A7BD5` | Web-chat badges only |

The dark theme is also in `tokens.css`, but the film uses the light theme.

## Type (`fonts/`)

- **Inter** for UI and bold headlines. For film headlines: weight 700, tracking about `-0.035em`.
- **Playfair Display** and **Playfair Display Italic** for the display serif. On vallamo.com the hero sets its second line in the serif, in clay ("Handled by Vallamo."). In the films, the accent line or word is set in **Playfair Italic, clay**.
- Small uppercase eyebrows: Inter 600, tracking 0.14em, clay (as on the site: "THE AI RECEPTIONIST FOR SERVICE BUSINESSES").

## Shape and depth

- Radius: 12 / 16 / 22 px (xl / 2xl / 3xl). CTA buttons are fully rounded pills.
- Shadows (`--sh-card`, `--sh-pop`, `--sh-float`) are soft and warm-tinted (`rgb(44 37 32 / …)`).

## Motion (from `tailwind.config.mjs`)

- The product's easing is **`cubic-bezier(.2,.7,.2,1)`**, used for rise, pop, slide and blur-in.
- Keyframe styles: `rise` (fade + 6 px up), `pop` (fade + scale .97 → 1), `blurIn` (fade + blur 10 px → 0 + 8 px up).
- No bounce on UI.

## Voice (from vallamo.com)

- **Headline:** "Your entire front desk. Handled by Vallamo."
- **Eyebrow:** "THE AI RECEPTIONIST FOR SERVICE BUSINESSES"
- **Tone:** plain, warm and confident, in British English ("enquiries", "diary"). Concrete claims only: "answers from your own information", "books into the calendar you already run", "hands over the moment it matters", "live in ten minutes".
- **CTA style:** a clay pill with white text and an arrow ("Book a demo ↗", "Try the interactive demo ↗").
- **Pronunciation of "Vallamo":** **va-lah-mo**, one fluid word with no syllable stressed.
