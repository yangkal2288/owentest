# Vallamo: "You're with a client" (the marketing-spend ad)

Owen's story over `VALLAMO_MARKETING_SPEND_AD_PRODUCTION_BRIEF.md`: *You're with a client. An enquiry for £120 comes in. What happens? You lose them to a competitor. Your marketing spend. Their booking. Meet Vallamo…*

Made after the reference Owen chose (a launch film where nothing sits on empty white): the real Vallamo UI as a tilted world in depth behind every shot, big type that slams in with motion blur, push-through cuts, layered soft shadows, the clay full stop as the connecting motif. vallamo.com's type throughout (Playfair Display, its italic for emphasis).

| File | What |
|---|---|
| `Vallamo-PaidEnquiry-30s-1080x1350-v2.mp4` / `…-1080x1920-v2.mp4` | **Main cut**, Feed (4:5) and Reels/Stories (9:16). 30 s, 60 fps, music and restrained SFX at −14 LUFS. |
| `Vallamo-PaidEnquiry-15s-1080x1350-v2.mp4` / `…-1080x1920-v2.mp4` | **15 s cut**, both layouts. |
| `*.srt` · `VO-script-for-recording.md` | Captions and the script with timings. |

## Main cut

| Time | Shot |
|---|---|
| 0–2.8 | "You're with a *client*." over the week's real diary in depth, whole on frame one. |
| 2.8–5.5 | Push through onto the inbox. "An enquiry for *£120* comes in." The enquiry drops in from above and lands (one notification). |
| 5.5–7.5 | "What *happens*?" The camera leans in; the minutes run (No reply · 1 → 10 min) and it shakes harder. |
| 7.5–9.4 | "I've booked with another clinic." "You lose them to a *competitor*." It cracks and shatters towards camera. |
| 9.5–12.8 | "Your marketing spend." **£120**, struck through (one buzzer, music ducks). "Their *booking*." |
| 13–16.2 | A clay field opens: the Vallamo wordmark, "Your all-in-one *front desk*." |
| 16.3–18.9 | Onto the inbox: "Vallamo **ALWAYS** replies *instantly*." WhatsApp · Instagram · Website land from depth. |
| 19–24.2 | "Answered while you're with a *client*." The real widget swings in from depth: the question, Thursday at 3pm, yes please, the details (2×), confirmed. The real **Booked** outcome and **Thu 24 · Laser Session · 3:00pm** burst forward: "Appointment *booked*." "Thursday, 3pm". |
| 24.3–30 | "Stop losing business to *competitors*." · "See Vallamo on your website in *ten minutes*." · **See it with your clinic's details** · the mark and **vallamo.com**. Holds four seconds. |

## Staged

- The demo clinic has no £120 laser session (its real one is a £20 Laser Consultation); the brief's £120 appointment is staged in the conversation, the outcome summary and the booking card. Everything else is the real product UI.
- The "before" enquiry is drawn in the film's own type, not as Vallamo. No "example" labels, as Owen asked.

## Before it runs

- £120 is an illustrative appointment price (brief §What £120 means).
- Match the Meta button to the destination; the ten-minute website offer must match what the link delivers.
- No voiceover yet: it reads fully muted.

## Re-render

```bash
cd videos && REMOTION_BROWSER=/path/to/chromium scripts/render-paid.sh main 45 v2   # main|short, 45|916
```
