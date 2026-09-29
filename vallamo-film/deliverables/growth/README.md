# Ad 4 · "More bookings. More revenue. Less admin."

From `VALLAMO_CLINIC_GROWTH_AD_BRIEF.md`. A direct product ad about what clinics gain: one
website enquiry for the £120 facial becomes a confirmed booking in the real diary, the diary
keeps filling from day into night, then the Autumn deal.

| File | What it is |
|---|---|
| `Ad4-MoreBookings-35s-9x16-1080x1920-v1.mp4` / `…-35s-4x5-1080x1350-v1.mp4` | **Main cut**, Reels/Stories (9:16) and Feed (4:5), laid out separately. 35.5 s, 60 fps, H.264, music and restrained SFX at −14 LUFS. |
| `Ad4-MoreBookings-15s-9x16-1080x1920-v1.mp4` / `…-15s-4x5-1080x1350-v1.mp4` | **15 s cut**, both layouts. |
| `Vallamo-Growth-35s.srt`, `Vallamo-Growth-15s.srt` | Captions (the brief's narration, timed to the picture). |
| `VO-script-for-recording.md` | The narration with start times, ready to record and drop in. |

## Main cut (every scene change on a downbeat)

| Time | Picture |
|---|---|
| 0–2.8 | CLINIC OWNERS · **More bookings. More revenue.** (gold, underlined as it lands) **Less admin.** Legible from the first frame; the real booking result rises out of depth behind. |
| 2.8–4.1 | **Vallamo ALWAYS replies instantly.** WhatsApp, Instagram and Website enquiries land as three cards. |
| 4.1–10.9 | The website card becomes the real chat widget: "Is the £120 facial available this week?" · a useful answer from the service list · "Yes, please." · details (shown at 2×) · confirmed. The header becomes **ENQUIRY → ANSWER → BOOKING**; BOOKING lights gold as the real Booked result bursts forward. |
| 10.9–16.3 | **Booked straight into your diary.** The real week view swings in; the appointment flies along a gold connector into Thursday 3pm; **£120 appointment** above it. |
| 16.3–24.3 | Day → evening → night, the facial kept lit: **A fuller diary.** (2:40pm · with a client) · **Less time answering messages.** (7:15pm · relaxing) · **Bookings after you've finished for the day.** (11:48pm · asleep). Each lands with a booking made at that hour dropping into a free daytime slot. Dawn breaks into the offer. |
| 24.3–35.5 | A lens iris from the booked facial opens the offer: **AUTUMN DEAL** · First 30 new paying clinics · Setup **£399 → £0** in one wipe · *Save £399 on Growth setup* · **Growth £399/month** (stationary and readable throughout) · **Get started online** · vallamo.com · *New monthly subscriptions. Setup fee waived; monthly subscription applies. Full terms at vallamo.com/pricing.* Held 5 s. |

The 15 s cut: the headline over the enquiry and reply, ALWAYS, the booking (details at 2×) into the diary with **£120 appointment**, then the offer held for over 3.5 s.

## What's real, what's staged

- Real product UI throughout, captured from the app's own markup and CSS (the demo clinic, North House Aesthetics): the website chat widget, the Booked result and upcoming card, the week view.
- Staged for the ad: the conversation text (fictional customer Chloe Reid, 07700 900512, chloe.reid@example.com), the Signature Facial at £120 / 60 minutes, and the four new diary blocks (Chloe's facial and three out-of-hours bookings). The three channel enquiry cards are graphics with the channels' real icons.
- No revenue figures, counters or conversion claims; £120 is the appointment's service price. Phone answering is coming and is not shown.
- Per Owen's direction on the earlier ads, there is no "Example conversation" label on screen.

## Before it runs

- Verify the checkout honours the setup-only waiver, keeps £399/month, shows the correct tax and continues into the setup wizard. Growth signup: https://vallamo.app/signup?plan=growth
- The first-30 allocation is shared across the campaign; replace the offer card when it is used up.
- Check placement previews; key text sits inside Meta's 9:16 safe area (clear of the top 14% and bottom 35%).

## Meta ad copy (from the brief)

**Primary text:** More bookings. More revenue. Less admin. Make more from the enquiries your clinic already receives. Vallamo always replies instantly on your website, WhatsApp and Instagram. It answers using your clinic's information and helps customers book into your diary, while you're with clients, relaxing or asleep. **Autumn deal: setup fees waived for the first 30 new paying clinics on monthly plans.** Growth is £399/month. Save £399 on setup and get started online.

**Headline:** More bookings. Less admin. · **Description:** Autumn deal: first 30 clinics get £0 setup. Growth £399/month. · **In-film action:** Get started online

## Re-render

```
cd videos && node scripts/meta-pieces.mjs && node scripts/growth-week.mjs && node scripts/pieces-png.mjs
REMOTION_BROWSER=/path/to/chromium scripts/render-growth.sh main 916 v1   # main|short, 916|45
```

Music: Soundsurfer "Product Video" (Pixabay, free for commercial use), fitted on its downbeats.
