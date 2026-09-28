# Vallamo: Meta ad, "Vallamo always replies instantly"

Built to `VALLAMO_META_AD_PRODUCTION_BRIEF.md` (main 30 s version), in the same world as the X film:
white, clay `#A47F54`, Inter bold with Playfair italic, the real Vallamo UI.

| File | What |
|---|---|
| `Vallamo-Meta-1080x1920-v1.mp4` | **Reels and Stories (9:16).** 30 s, 60 fps, H.264, music and soft SFX at −14 LUFS. Headlines, ALWAYS, logo and CTA stay inside Meta's safe area (clear of the top 14% and bottom 35%). |
| `Vallamo-Meta-1080x1350-v1.mp4` | **Feed (4:5).** Laid out separately for the shorter frame, not cropped. |
| `cover-1080x1920.png` / `cover-1080x1350.png` | Covers: the opening question with the enquiry. |
| `Vallamo-Meta.srt` | Captions, the brief's script. |
| `VO-script-for-recording.md` | The script with timings, for the voice session. |

## The cut (every cut on a downbeat of the music)

| Time | Line | Picture |
|---|---|---|
| 0–2.8 | Have you lost a customer to a competitor? | Whole question on frame one, "Clinic owners", "lost" in the clay block; a booking enquiry lands. |
| 2.8–8.2 | The average customer waits ten minutes… | A counter runs to **10 minutes**, the enquiry's bar fills, then "Never mind, I've booked somewhere else." → *Lost to a competitor*. |
| 8.2–10.9 | Vallamo **always** replies instantly. | The real website chat widget rises; the enquiry arrives and Isla answers straight away. ALWAYS in the clay block. |
| 10.9–13.6 | Meet Vallamo, your all-in-one front desk. | Wordmark; WhatsApp, Instagram and Website (the live channels' own icons) land beside the assistant. |
| 13.6–21.6 | Answers from your clinic's information. Enquiries answered. Appointments booked. | The real "Why Isla said this" for that reply (the service it used, the playbook, the live diary check); she picks 12:30; Isla books it; the real **Booked** outcome and **Tue 22 · 12:30pm** booking lift out of the chat. |
| 21.6–30 | Stop losing business to competitors. See Vallamo on your website in ten minutes. vallamo.com | Headline, the offer, **Get your free website demo**, wordmark and vallamo.com; the widget as it sits on a website. Held to the music's real ending. |

## What's real, what's staged

- All product UI is the real app (North House Aesthetics demo tenant, fictional people): the website chat widget from Channels › Website chat, the channel icons, "Why Isla said this", the Booked outcome and the upcoming booking. Captured by `videos/scripts/meta-pieces.mjs`.
- Staged for the brief (presentation only): the conversation text, the widget tagline ("Replies instantly", a setting in the app), the Knowledge line in the Why panel, the outcome summary, and the booking's day and time. "Example conversation" sits under the widget, as the brief asks.
- The "before" enquiry (Emma Clarke) is drawn in the film's own type, not as any real app.
- Music: Soundsurfer "Product Video" (Pixabay, free for commercial use), fitted to 30.04 s on its downbeats and ending on its real ending.
- **No voiceover yet.** The ad reads fully muted (most Meta views are). When the VO is recorded, I'll lock it to the picture as with the X film.

## Before it runs

- The 10-minute statistic is Owen's; keep its source in the production notes (brief §Confirmed ten-minute line).
- The "ten minutes" website offer must match what the form or booking page actually delivers (brief §Match the ten-minute offer).

## Re-render

```bash
cd videos
node scripts/meta-pieces.mjs && node scripts/pieces-png.mjs
REMOTION_BROWSER=/path/to/chromium scripts/render-meta.sh 916 v1   # and 45
```
