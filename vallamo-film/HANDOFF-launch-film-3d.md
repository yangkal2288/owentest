# Handover: "Meet Vallamo", the launch film

**Read this whole file first.** It covers the brief, the reference study, the treatment, the shot list, production rules, and the file map. The decision maker is **Owen** (founder).

> **The bar:** the same level of craft as the reference films in §3: Tessel, Skydive, Shotbase. It should never look "made in Paint", like a slideshow, or like a screen recording. The look is Vallamo's own: clean white, warm, premium, a single clay accent, and the Vallamo logo. **Every piece of product UI is real Vallamo UI.** Never redraw it, mock it, or have AI generate it.
>
> **Voiceover is recorded externally by Owen's team.** The film ships **silent** (captions plus music bed optional) along with a timed **guide track**. The VO script lives in **`~/vallamo-film/Meet-Vallamo-VO-Script.md`**. Keep the picture and that script in sync. When the real VO arrives, re-time the picture to it.

---

## 0. Setup (on the new laptop)

This film is built on **a different Mac and Claude account**. Everything it needs is in **`vallamo-film-bundle.zip`** (or the two parts, `vallamo-film-part1-project.zip` + `vallamo-film-part2-references.zip`). Follow **`SETUP.md`** in the bundle, top to bottom (about 20–30 minutes). In short:

1. Unzip the bundle to the **home folder**, so these paths exist: `~/vallamo-film/videos` (starter project), `~/vallamo-film/brand`, `~/vallamo-film/sources`, `~/vallamo-film/reference`, and this file at `~/vallamo-film/HANDOFF-launch-film-3d.md`.
2. Install Node, Python packages, ffmpeg and Playwright's Chromium, then `npm install` in `~/vallamo-film/videos`.
3. Install the skills: `product-film`, `no-slop-motion` and the Remotion skills.
4. Open Claude Code in the home folder and paste the prompt in §13.

---

## 1. Skills the building session must use

| Skill | Use for |
|---|---|
| `no-slop-motion` | Process and taste: the gates (script → style frames → animatic → build → sound → QA), `LOVES-HATES.md`, grounding every choice, the banned list (with this brief's overrides, §7). **Read its SKILL.md and references first.** |
| `product-film` | Remotion engine rules: every frame a pure function of time, measure rather than guess, cursor and click cues, cameras, magic moves, stills and contact sheets, verified renders. Its kit is already in `src/kit/`. |
| `remotion-best-practices`, `remotion-saas`, `remotion-captions`, `remotion-render` | Remotion APIs, SaaS-launch composition patterns, captions, render settings. |

**Engine:** Remotion, in the existing project. **Do not switch to HyperFrames**, even though no-slop-motion defaults to it.

---

## 2. The product (show only what's true)

Vallamo is an AI front desk for appointment businesses (clinics first; also salons, spas, physios, trades).

**Live and showable:**
- WhatsApp, Instagram and website-chat enquiries in **one inbox**
- **Answers from the business's own information** (built from their website)
- **Checks live availability and books** into the connected calendar
- **Booking-system integrations:** Cliniko connected; Google Calendar, Outlook/M365, Microsoft Bookings, Cal.com, Acuity, Square, Boulevard, Pabau and Phorest listed
- **Works inside your rules:** practitioner hours, time off, service durations, minimum notice, gap between appointments
- Deposits
- Text confirmations and reminders
- Follow-ups on quiet enquiries
- **Hands over to your team,** with live takeover
- Insights
- Live in about 10 minutes, built from your website

**Voice (phone answering)** launches in about 2 weeks. **Show it only if it is live and tested before picture lock.** Otherwise the optional voice beat stays out.

**Claims (hard rules):**
- No "never makes mistakes", "100% accurate", "impossible to double-book", "24/7 human".
- Use demonstrable lines: "checks your diary before it books", "only offers times that are free", "answers from your own information", "hands over when it matters".
- "Every channel" means WhatsApp, Instagram and web until voice ships.
- **All data is the fictional North House Aesthetics demo tenant.** Label metrics "Demo clinic · illustrative figures".

---

## 3. Reference study: what to steal (and what not to)

All downloaded with Owen's OK to `~/vallamo-film/reference/`, with frame sheets. **Watch all three before designing.**

### Tessel: `lexnlin.mp4` (33 s) + `lexnlin-sheet.png`, `lexnlin-hero-detail.png`
*The closest to Vallamo: a white calendar product, one accent colour.*

| Time | Technique | Steal for Vallamo |
|---|---|---|
| 0:00–0:06 | White void. A single **red accent dot** grows into a timeline line; calendar grid lines draw in; UI fragments at depth. **Giant kinetic type** over blurred UI: "Your week / doesn't fit." | The opening. One **clay dot** becomes a line; real enquiry rows appear at depth; giant type: **"You're with a client."** / **"Enquiries don't wait."** |
| 0:06–0:09 | **Logo reveal** built from its mark (blocks plus a dot), then the tagline "The calendar that plans itself." | Vallamo **mark reveal** (clay) → wordmark → tagline **"Your new front desk."** On white, not black: Vallamo is warm white. |
| 0:10–0:14 | Calendar in focus, then background **blur**. A **prompt bar** in sharp focus **types** a sentence (key words highlighted), the **send button** is pressed, and an accent **circle wipe** expands. | The hero trigger: a **customer's real message** types into a chat bubble ("Hi, do you have anything after 5:30 this week…"), Vallamo's reply sends, and a **clay circle wipe** reveals the booking happening. |
| 0:13–0:18 | **Tilted 3D calendar**, blocks **rearranging and landing**, an accent "now" band sweeping. | **"Watch your diary fill up":** the real week view tilted, with booking blocks **dropping into place** one after another. |
| 0:18–0:24 | **Left caption, right UI crop**, beat by beat: "Meetings move over." "Mornings stay yours." "Overruns fit too." | The **rules and features beats**, left caption with right real-UI crop: "Your hours. Your rules." "Deposits taken." "Reminders sent." "Quiet leads followed up." |
| 0:24–0:28 | Macro zoom, **whip / motion-blur transitions**, an infinite **tilted grid of blocks**, "Everything fits." | Macro whip into an **infinite tilted grid of real booking blocks / inbox rows** → **"Every enquiry. Handled."** |
| 0:28–0:33 | Blocks collapse into the logo, the lockup plus URL, the dot fades out. | **End:** the grid collapses into the Vallamo mark, then the lockup, **vallamo.com**, and one clay CTA pill. |

**Take:** monochrome UI with **one accent** (their red, our **clay `#A47F54`**), giant tight type, blur and depth-of-field for focus, 3D tilt, motion blur, music-locked pacing (a change about every 0.6–1 s).
**Don't take:** the black interlude (keep Vallamo warm white; a single deep-ink `#2C2520` beat is allowed at most once), or the red.

### Skydive: `shiri.mp4` (20 s) + `shiri-sheet.png`, `shiri-channels-detail.png`

| Time | Technique | Steal for Vallamo |
|---|---|---|
| 0:00–0:03 | "You log off." / "They don't." Dark to light, with avatars orbiting the text. | Hook alternative: **"You close at six."** / **"Your front desk doesn't."** |
| 0:06–0:08 | Small eyebrow ("CHAT ANYWHERE"), then **"Talk to them on [icon] iMessage."** The **channel word and icon swap** (iMessage → Slack → Email) while a **real message card** on the right updates per channel. Sub: "One identity. One memory." | **The channel beat:** eyebrow **"EVERY CHANNEL"**, then **"Answers on [WA] WhatsApp. / [IG] Instagram. / [web] your website."**, with the real bubble or row for that channel on the right. Sub: **"One inbox. One memory."** |
| 0:12–0:14 | A **tilted grid of integration cards** with a counting number ("603+ integrations"). | **"Connect your calendar":** a tilted grid of the **real booking-system cards** (Cliniko, Google Calendar, Outlook, Microsoft Bookings, Cal.com, Acuity, Square, Boulevard, Pabau, Phorest). **No invented counter.** Use real cards only, and optionally "Works with the calendar you already run". |
| 0:15–0:17 | Avatars in a ring: "Agents that work as a team." | Optional: **customer channel badges orbiting** the Vallamo mark. |
| 0:17–0:20 | Hero image, "Let's fly.", a small CTA pill, URL. | End card with one clay CTA pill. |

### Shotbase: `miguel.mp4` (58 s) + `miguel-sheet.png`

| Technique | Steal for Vallamo |
|---|---|
| **Cursor-led storytelling** with small **captions that appear next to the cursor** as it acts ("screenshot", "or you just paste"). | In the hero booking and handover beats, a small caption rides beside the cursor ("take over"). **Don't overuse it:** 2–3 times at most. |
| Big UI pill toggles ("Static" / "Motion") shown huge, then clicked. | A huge **"In progress" → "Booked"** outcome flip, shown at poster size. |
| Type morphs ("When you're done" → "Share you're done"). | "Enquiry" **morphs** into "Booking". |
| Tagline end card: "Capture beautifully. Share instantly." | **"Every enquiry answered. Every booking made."** or the site line "Your entire front desk. Handled." |
| **Don't take:** busy gradient wallpapers, the pixel-dissolve transition, the saturated cyan frame, the 58 s length. | – |

---

## 4. The film

- **One deliverable only: an X/Twitter post video.** 16:9, **1920×1080, 60 fps, about 45 s**, H.264 MP4, well under X's 512 MB limit (target under 50 MB). **No other sizes and no cutdowns.**
- **Audio:** ship silent plus a music-bed version. **VO is recorded externally** from `Meet-Vallamo-VO-Script.md`. Time the picture to a scratch guide (TTS for timing only, never shipped), then re-time to the real VO. Music is licensed (Owen supplies it); cut on downbeats. A few subtle SFX (send, land, booked chime), never one on every landing.

### Look

- **World:** white `#FFFFFF`, with Vallamo paper `#FFFDF9` for surfaces. No gradients, glows or coloured backgrounds.
- **One accent:** clay `#A47F54`. Sage `#7C8A6E` only for "Booked" / success. Channel colours (IG `#D86A93`, WA `#12805A`, web `#3A7BD5`) only on channel badges.
- **Browser:** a white, Apple-style (Safari-like) 3D window.
  - Chrome and panel: white chrome, three grey traffic lights, a `vallamo.app` URL pill, 18 px radius, hairline `#E7DFD1`.
  - The real UI lives inside it, as a live DOM snapshot.
- **Depth:** real 3D (CSS 3D), soft **floor contact shadows** under floating objects (blurred ellipse planes, not box-shadows), **depth-of-field blur** on background layers, parallax, and **motion blur** on every fast move (from the 240 fps master).
- **Type:**
  - **Inter** bold, tracking `-0.035em`, at **giant** scale for kinetic lines (Tessel-scale, 180–260 px on 1080p).
  - An accent line in **Playfair Display Italic**, clay (Vallamo's hero style).
  - Small uppercase eyebrows at 18–20 px, tracking 0.14em, clay.
- **Logo:** the real Vallamo mark and wordmark (SVGs, currentColor → clay). The **mark reveal** is a signature beat; animate it as a mask draw or assemble, never as a spin or bounce.
- **Motion:**
  - The product's easing `cubic-bezier(.2,.7,.2,1)` for UI.
  - Critically damped springs for camera and 3D (no bounce on UI).
  - **Motion-matched transitions**: the element leaving one shot enters the next.
  - Whip moves with motion blur.
  - Change every ~0.6–1 s in energetic sections; hold 1.5 s or more on anything the viewer must read.

---

## 5. Script

**See `~/vallamo-film/Meet-Vallamo-VO-Script.md`.** It holds the timed VO lines, captions, delivery notes and recording spec.

**Owen approves the script (gate 2) before any motion is built.**

---

## 6. Shot list (master, about 45 s)

Timings are targets that follow the script's guide timings. **Re-time to the real VO.** Every cut has a named transition.

| # | Time | Shot | Real UI | Transition out |
|---|---|---|---|---|
| **1. Dot** | 0:00–0:02 | White. A single **clay dot** appears centre, then stretches into a thin horizontal line (Tessel). | – | The line becomes the baseline for the type. |
| **2. Hook** | 0:02–0:06 | **Giant kinetic type:** "You're with a client." Blurred real **enquiry rows and bubbles** (WhatsApp, Instagram, web) drift behind at depth, multiplying. Then: "Enquiries don't wait." | `row-*.png`, `msg-1.png`, `pg-ask.png` | The type slides out; the rows sharpen as the camera racks focus to them. |
| **3. Meet** | 0:06–0:09 | The rows part. The **Vallamo mark** draws in (clay), resolves to the wordmark, then the tagline **"Your new front desk."** | `vallamo-mark.svg`, `vallamo-wordmark.svg` | The mark shrinks into the browser's favicon position as the **white 3D browser** rises in. |
| **4. Channels** | 0:09–0:14 | Eyebrow **"EVERY CHANNEL"**. Left: **"Answers on [badge] WhatsApp."**, where the word and badge swap to **Instagram**, then **your website** (Skydive). Right: the matching **real row or bubble** for each channel, in a floating 3D card. Sub: "One inbox. One memory." | `row-1` (WA), `row-0` (IG), `row-5` (web), badges | The three cards lift off towards the browser. |
| **5. Into one inbox (hero 1)** | 0:14–0:18 | The browser, tilted about 12°, shows the **real Inbox** with the top of the list empty. The floating enquiries **fly and fall into their exact slots** (magic move, measured rects), each landing crisp and settling. The browser turns face-on. Caption **"Every enquiry. One inbox."** | `snaps/inbox-before.html` + `row-*` + `layout.json` | The cursor clicks the top row (Sarah, Instagram): **push-in**. |
| **6. Booked (hero 2)** | 0:18–0:25 | The background **blurs**. Sarah's **message types in**, in focus (Tessel prompt style): "Hi, do you have anything after 5:30 this week for an anti-wrinkle consultation?" Vallamo's reply appears (Thursday 6pm or Friday 5:30 with Dr Maya), with a tasteful **"2×"** chip as the rest plays at double speed. Sarah: "Thursday at 6 please." Then a **clay circle wipe**, and at poster size the **outcome flips "In progress" → "Booked"** (sage). Caption: "Answers. Checks your diary. **Books it.**" | `snaps/inbox-sarah.html`, `outcome-pre/booked` | The **"THU 24 · Anti-Wrinkle Consultation" card lifts out** in 3D towards camera. |
| **7. Connect your calendar** | 0:25–0:29 | **A tilted grid of real booking-system cards** (Skydive), with Cliniko "Healthy · Synced 3 minutes ago" lit in front. A thin clay line **draws from the Vallamo mark to Cliniko**. Caption **"Connect your calendar."** | `int-cliniko.png`, `int-0…5.png` (+ capture Square, Boulevard, Pabau, Phorest) | Whip with motion blur to the calendar. |
| **8. Watch it fill up** | 0:29–0:34 | The real **week view**, tilted (Tessel). The floating THU 24 card from shot 6 **flies into Thursday 6pm and becomes the block** (morph). Then **the week fills**: real demo bookings drop into place in a staggered cascade, and a sage "now" line sweeps. Caption **"Watch your diary fill up."** | **To capture:** Bookings week view (blocks tagged) + `upcoming-card` → `bk-sarah` | Push into one block. |
| **9. Rules and features** | 0:34–0:39 | **Left caption, right real-UI crop,** each beat about 1.2 s (Tessel): "Your hours. **Your rules.**" (`maya-hours`), "Deposits **taken.**" (`booking-drawer` deposit row), "Reminders **sent.**" (reminder template, to capture), "Quiet leads **followed up.**" (Follow-ups row, to capture), "Hands over **when it matters.**" (Take-over button click, cursor caption "take over"). | `maya-hours`, `rules-when`, `booking-drawer`, captures | Macro whip. |
| **10. (Optional) Voice** | – | Only if live: "And now, **it answers your phone.**" with the real call card. | Capture when live | – |
| **11. Handled** | 0:39–0:42 | An **infinite tilted grid of real inbox rows / booking blocks** drifts (Tessel), then the giant type: **"Your entire front desk."** / **"Handled."** (Playfair italic, clay). | `row-*`, `bk-*` | The grid collapses into the Vallamo mark. |
| **12. End** | 0:42–0:45 | The Vallamo **lockup** (clay), "See yours in 10 minutes. **Built from your website.**", and one clay pill: **vallamo.com**. The clay dot from shot 1 returns and fades. Hold 2 s. | `vallamo-logo-lockup.svg` | – |

*(No cutdowns. One 16:9 film for X.)*

---

## 7. Rules and taste

**Keep all of no-slop-motion's bans:**
- no radial gradients, glows or vignettes, and no coloured worlds
- no card grids or icon lists standing in for an explanation
- no static screens
- no text parked at the top while the action happens below
- no hard pops, flashes or black dips
- no glitch or shader transitions
- no linear moves
- **no overshoot or bounce on UI**
- no CSS colour filters
- one CTA
- no sound on every landing

**Overrides (Owen's brief and the references):**
- **Depth is wanted** for floating 3D objects: floor contact shadows and depth-of-field blur. Still no box-shadows on UI containers.
- **The tilted grids** in shots 7 and 11 are allowed: they show real breadth (real integrations, real bookings), not decoration.
- **One ink `#2C2520` beat** is allowed at most (e.g. behind the logo), if it helps rhythm. The default is white.

**Readability:**
- Readable UI text at 24 px or more on 1080p.
- 1.5 s or more per line to read.
- Nothing ever covers text.

**Owen's loves (seed `LOVES-HATES.md`):**
- real UI on white, popping out in 3D
- the Apple-style browser
- floating enquiries falling into place in the real inbox
- the 2× booking
- the card flying into the calendar
- bold Inter with a Playfair italic accent
- AIDA
- "every channel, one inbox" energy
- the professionalism of the reference films

**Owen's hates:**
- "made in Paint" or slideshow looks
- flat full-screen screen recordings
- generic purple SaaS styling
- fake UI
- over-long videos
- anything that looks cheap or AI-made

---

## 8. Technical approach

- **Project:** `~/vallamo-film/videos` (Remotion 4.0.529, React 18, TS). Always run `export PATH=~/.local/node/bin:$PATH` first. Playwright + Chromium, Pillow and imageio-ffmpeg are installed.
- **3D:** CSS 3D in Remotion (`perspective`, `preserve-3d`, `rotateX/Y`, `translateZ`), which keeps **UI text vector-crisp**. Don't put UI text on WebGL textures.
- **Camera:** extend `src/kit/camera.ts` to 3D (position, target, FOV as critically damped springs).
- **Depth of field:** CSS `filter: blur()` on background layers, driven by their distance from a focus plane. That is a lens effect, not a colour filter, so it's allowed.
- **Browser:** HTML/CSS chrome around a **live UI snapshot iframe** (`src/kit/UIFrame.tsx`, with per-frame CSS in `#film-dyn`).
- **Pop-outs / magic moves:** 4× PNG bits (`public/ui/bits/`). **Measure each element's rect** in its snapshot (`scripts/measure.mjs` → `src/layout.json`) so every lift and landing is pixel-exact (`src/kit/move.ts`).
- **Typing:** reveal characters per frame (pure function of time), with a caret. Highlight key words in clay.
- **Circle wipe:** an SVG circle mask, with scale eased, from the send button's measured position.
- **Floor shadows:** a blurred ellipse element under each floating object, with opacity and scale driven by its height.
- **Captions and kinetic type:** frame-accurate. Use `remotion-captions` with word timings from the real VO (transcribe with Whisper) once it arrives.
- **Render:** `scripts/render-film.sh <CompositionPrefix> <out dir> <format> <version>`. This renders a 240 fps master → 4-subframe motion blur → 60 fps → BT.709 limited range. Register a single 1920×1080 composition (e.g. `Meet-x`) and call it with format `x`. **Time the first full render** and plan review loops around it.
- **Verify every render:**
  - duration, fps and size
  - decode frame 0 and check the colours match the tokens
  - contact sheets (`scripts/sheet.py`, ffmpeg tile)
  - no-slop-motion's `scripts/qa/pop-scan.py` + `lint-slop.ts`
- **Stills:** `npx tsx scripts/stills.ts out/stills/x <frames…> --composition <Id>`

---

## 9. File map (everything in the bundle)

**Starter project:** `~/vallamo-film/videos/`

| Path | What |
|---|---|
| `package.json`, `tsconfig.json` | Remotion 4.0.529, React 18, TS. Run `npm install` first (see SETUP.md). |
| `src/index.ts`, `src/Root.tsx` | Entry. **Register the film in `Root.tsx`** and build it in **`src/films/meet/`**. |
| `src/fonts.ts` | Loads Inter and Playfair (Regular and Italic) from `public/fonts/` before any frame renders. |
| `src/brand.ts` | Brand tokens as hex (see also `~/vallamo-film/brand/BRAND.md`). |
| `src/kit/` | product-film kit: `camera.ts` (camera springs, clamp, project), `spring.ts`, `move.ts` (magic move), `cursor.tsx` (macOS cursor with click), `time.ts`, `debug.tsx`, plus **`UIFrame.tsx`**: a live UI snapshot in an iframe, animated per frame via `#film-dyn` CSS. |
| `src/bits.json` | Sizes and metadata of the real UI pieces in `public/ui/bits/`. |
| `src/layout.json` | Measured element rects inside the snapshots (1440×1400 viewport). |
| `public/ui/source.html` | **The Vallamo UI prototype** (demo tenant North House Aesthetics). Routes: `#/inbox`, `#/inbox/cv_0001`, `#/bookings`, `#/insights`, `#/integrations`, `#/bookings?settings=rules`, `#/settings/team`, `#/playground`, `#/follow-ups`, `#/knowledge`, `#/handover-rules`. **In every capture, remove the "Design review" button and the "Welcome to the new Vallamo" banner** (see `scripts/snapshot.mjs` → `common()`). |
| `public/ui/snaps/*.html` | Tagged static DOM snapshots (`data-film=…`): `inbox-before`, `inbox-sarah`, `bookings`, `bookings-drawer`, `insights`. |
| `public/ui/bits/*.png` | **Real UI pieces at 4×:** inbox rows `row-0…8` (each customer's own first message, fresh time), `row-0-selected`, `inbox-head`, messages `msg-1…6`, `outcome-pre/booked`, `upcoming-card`, `bk-sarah`, `calendar`, `booking-drawer`, Integrations `int-cliniko`, `int-0…5`, rules `rules-when`, `rules-services`, `maya-hours`, `maya-services`, `maya-link`, Playground `pg-ask`, `pg-reply`, `pg-trace`, `pg-chosen`, pills `pill-unavailable/available/checked`, `cal-maya-head`, Insights `kpi-*`. |
| `public/fonts/`, `public/brand/` | Fonts and logo SVGs, ready to use in Remotion. |
| `scripts/snapshot.mjs` | Opens `source.html` headless, stages states, saves tagged snapshots. **Extend it** for new captures. |
| `scripts/fragments.mjs`, `scripts/fragments-rules.mjs` | Capture single UI elements as 4× PNG bits. **Extend them.** |
| `scripts/measure.mjs` | Writes `src/layout.json` (rects of tagged elements). |
| `scripts/check-static.mjs` | Renders snapshots to PNG, to check they match the live UI. |
| `scripts/stills.ts` | Bundles once, renders many review stills: `npx tsx scripts/stills.ts out/stills/x 30 90 --composition Meet-x`. |
| `scripts/sheet.py` | Contact sheet from a folder of stills. |
| `scripts/render-film.sh` | Final render: 240 fps master → 4-subframe motion blur → 60 fps → BT.709. Usage: `scripts/render-film.sh Meet out-dir x v1` (needs a composition id `Meet-x` that takes `fps` as a prop). |

**Brand package:** `~/vallamo-film/brand/`
- `BRAND.md`: colours, type, logo usage, motion, voice
- `logo/`: lockup, mark and wordmark SVGs, plus PNGs
- `fonts/`: Inter and Playfair Display, Regular and Italic
- `tokens.css`: every design token, light and dark
- `tailwind.config.mjs`: easing, keyframes, radii, shadows

**Sources:** `~/vallamo-film/sources/`

| Path | What |
|---|---|
| `vallamo-deploy-ready-v49.456.zip` | The current deployed codebase. Look in `dashboard/src/views/` (real screens), `dashboard/src/app/tokens.css`, `backend/scripts/data/north_house_demo_seed.json` (all demo data, fictional) and `DEMO_NORTH_HOUSE_v49_432_NOTES.md`. |
| `vallamo-ui-prototype.html` | The original UI demo HTML (same file as `videos/public/ui/source.html`). |
| https://vallamo.com | Live site copy, CTA style, testimonials, "Voice coming in October". |

**References:** `~/vallamo-film/reference/`
- `lexnlin.mp4` (Tessel) + `lexnlin-sheet.png`, `lexnlin-hero-detail.png`
- `shiri.mp4` (Skydive) + `shiri-sheet.png`, `shiri-channels-detail.png`
- `miguel.mp4` (Shotbase) + `miguel-sheet.png`

**VO script:** `~/vallamo-film/Meet-Vallamo-VO-Script.md`

**New captures needed:**
1. Bookings **week view** (week of Thu 24 Sep 2026), every block tagged
2. Integrations cards for Square, Boulevard, Pabau and Phorest
3. Booking settings › **Reminders & messages** (the reminder preview) and **› Deposits**
4. **Follow-ups**: one revived row
5. A **non-medical handover** conversation with the "Take over" button
6. Voice UI (only if live)

---

## 10. Process (no-slop-motion gates)

1. **Inputs:**
   - read this file, both skills, `brand/BRAND.md` and the VO script
   - watch all three references
   - write `LOVES-HATES.md` (from §7) and `DESIGN.md` (world rules, bans, overrides)
2. **Script lock:** Owen approves `Meet-Vallamo-VO-Script.md`.
3. **Guide track:** a scratch TTS read at the target pace, for timing only.
4. **Style frames (the key gate):**
   - render **6 stills**: shot 2 (giant type over rows), shot 4 (channel swap), shot 5 (mid-fall into the inbox), shot 6 (the Booked flip), shot 8 (the diary filling), shot 12 (end card)
   - present them as a contact sheet
   - get Owen's approval before any motion
5. **Animatic:** every shot on the guide timeline, with temp music and a named transition per cut. Lock story and timing.
6. **Build:** one scene per file in `src/films/meet/scenes/`. Measure every rect. Review stills continuously.
7. **Real VO in:** re-time to Owen's recording. Captions from its word timings.
8. **Sound:** licensed music cut on downbeats, a few subtle SFX.
9. **QA and export:**
   - pop-scan, lint, contact sheets, colour check
   - adversarial self-review against `LOVES-HATES.md`
   - deliverables (§11)

**Hand over every cut** as the file, a frame grid, and a 3-line "what changed" note.

---

## 11. Deliverables

- `Vallamo-Meet-X-1920x1080.mp4`: about 45 s, 60 fps, H.264, BT.709, **silent**, picture-locked for the external VO
- `Vallamo-Meet-X-1920x1080-music.mp4`: the same with the licensed music bed (if Owen supplies the track)
- `Vallamo-Meet-X.srt`: timecoded captions matching the VO script lines
- `poster.png`: a strong frame for the X preview
- A final version with Owen's VO mixed in, once the recording arrives (−14 LUFS)
- README notes: what's real, what's staged, how to re-render

---

## 12. Open questions for Owen (ask first)

1. Approve or edit the VO script and captions.
2. Voice: in or out? (Only if live and tested before picture lock.)
3. Music: which licensed track or library?
4. Is the "2×" speed chip OK? (Recommended: it's honest.)
5. Is one ink-coloured beat behind the logo OK, or white only?

---

## 13. Prompt to paste into the new session

```
Read ~/vallamo-film/HANDOFF-launch-film-3d.md fully, then ~/vallamo-film/Meet-Vallamo-VO-Script.md and ~/vallamo-film/brand/BRAND.md. Watch the three reference films in ~/vallamo-film/reference/ (videos and frame sheets).

Use the no-slop-motion skill for process and taste, the product-film skill for the Remotion engine rules, and the Remotion skills (remotion-best-practices, remotion-saas, remotion-captions, remotion-render) for the build.

One deliverable only: a 16:9 1920x1080 60fps video for an X/Twitter post, about 45 seconds. No other sizes or cutdowns.

Make the "Meet Vallamo" launch film described in the handoff, at the craft level of the Tessel, Skydive and Shotbase references but with Vallamo's clean white aesthetic, clay accent and real logo. Real Vallamo UI only. The voiceover will be recorded externally from the VO script, so ship a picture-locked silent version plus an SRT.

Start with gate 1: confirm the script with me and ask the open questions in section 12. Then produce the 6 style frames for approval before building any motion.
```
