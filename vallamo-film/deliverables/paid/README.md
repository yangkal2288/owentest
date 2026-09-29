# Vallamo: "You paid for the enquiry. Your competitor got the booking."

Built to `VALLAMO_MARKETING_SPEND_AD_PRODUCTION_BRIEF.md` in the same world as the "always replies instantly" ad (v2): white and clay, vallamo.com's type (Playfair Display with its italic for emphasis), the real Vallamo widget and booking cards, the same shatter. New: the deep-red loss card.

| File | What |
|---|---|
| `Vallamo-PaidEnquiry-35s-1080x1350-v1.mp4` | **Main cut, Feed (4:5).** 35.5 s, 60 fps, music and restrained SFX at −14 LUFS. |
| `Vallamo-PaidEnquiry-35s-1080x1920-v1.mp4` | **Main cut, Reels and Stories (9:16).** Recomposed for the tall frame; key text inside Meta's safe area. |
| `Vallamo-PaidEnquiry-15s-1080x1350-v1.mp4` / `…-1080x1920-v1.mp4` | **15 s cut**, both layouts. |
| `cover-*.png` | Covers: the hook with its path and the enquiry. |
| `*.srt` | Captions (the brief's script). |
| `VO-script-for-recording.md` | Both scripts with timings. |

## Main cut

| Time | Picture |
|---|---|
| 0–4.8 | **Clinic owners** · "You paid for the enquiry. Your *competitor* got the booking." whole on frame one; **Your ad → New enquiry → Another clinic** builds; the enquiry from the ad lands (one notification). |
| 4.8–7.4 | "You're with a *client.*" The enquiry, large: **"Can I book the £120 laser session this week?"** · status *You're with a client*. **Example scenario · £120 appointment** stays readable to the end of the loss. |
| 7.4–11.5 | The clock accelerates **00:00 → 10:00** and settles on **10 minutes without a reply**, the card shaking harder as it runs; **"I've booked the appointment with another clinic."** holds for two seconds. |
| 11.5–14.9 | The card cracks and shatters into one deep-red **X**, **£120**, **BOOKING LOST**; "Your marketing. *Their booking.*" One buzzer; the music ducks. |
| 14.9–20.3 | White and gold: the wordmark, "Your all-in-one *front desk*", then **Vallamo ALWAYS replies *instantly*.** with **WhatsApp · Instagram · Website**. |
| 20.3–28.4 | **A new enquiry, with Vallamo** · "Answered while you're with a *client*." The real widget: the question, "Thursday at 3pm is available. Would you like that?", "Yes, please.", the details step (at 2×, labelled), Isla's confirmation; then the real **Booked** outcome and **Thu 24 · Laser Session · 3:00pm** on white, with **Appointment booked · Thursday, 3pm** in gold. |
| 28.4–35.5 | "Stop losing business to *competitors.*" · "See Vallamo on your website in *ten minutes.*" · **See it with your clinic's details** · the Vallamo mark and **vallamo.com**. The whole card holds for the last four seconds. |

## 15 s cut

"Your paid enquiry waited. They booked *elsewhere.*" over the enquiry (*No reply · You're with a client*) → "Booked with another clinic." → the shatter into **X · £120 · BOOKING LOST** → **Vallamo ALWAYS replies *instantly*** with the reply and the booking → "See it with your clinic's *details*." with the offer, the mark and a **vallamo.com** button.

## Staged, and why

- **The demo clinic has no £120 laser session** (its real laser service is a £20 Laser Consultation with Nina Patel, with a deposit). The brief's £120 appointment is staged in the conversation text, the outcome summary and the booking card. The rest is the real product UI.
- The "before" enquiry is drawn in the film's own type, not as Vallamo.
- The "Example conversation" label is left off, as Owen asked for the last ad; the demo is labelled **A new enquiry, with Vallamo** so it never reads as the lost customer returning.
- No payment is shown: the result is **Appointment booked**.
- No "Voice, coming in October" here: the brief keeps phone for its own treatment. Easy to add.

## Before it runs

- £120 is an illustrative appointment price, not a measured loss (brief §What £120 means). The label says so on screen.
- Match the Meta button to the destination; the ten-minute website offer must match what the link delivers.
- **No voiceover yet**: the cut reads fully muted.

## Re-render

```bash
cd videos
node scripts/meta-pieces.mjs && node scripts/pieces-png.mjs
REMOTION_BROWSER=/path/to/chromium scripts/render-paid.sh main 45 v1   # main|short, 45|916
```
