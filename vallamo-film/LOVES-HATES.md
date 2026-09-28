# Loves and hates (Owen)

Re-read before every render. Newest notes at the top.

## 2026-09-28: new opening (v11)
- **Add a question before "You're with a client"**, from Owen's mockup ("How many enquiries go unanswered while you're with a client?"). The mockup is a layout only: redesign and animate it.
  - Fix: shot 0 (4.2 s, no VO) in the film's world. White, Inter bold, words rise in, a clay highlighter swipes under "unanswered", and real enquiries (not "New enquiry" placeholders) stack up in 3D in front of a slow clay ring, with the Vallamo wordmark between hairlines. Out: the type blurs and the enquiries sink into shot 1's blurred depth.

## 2026-09-28: final VO notes (v8 → v9)
- Music "slightly" quieter again (0.45 → 0.36, ducked 0.16 → 0.12).
- **Hates em dashes on screen.** Fix: pieces.mjs rewrites " — " to ", " (and "GBP — £" to "GBP (£)") in every captured piece.
- **Drop the "Demo clinic · illustrative figures" label** ("everyone watching will know"). Removed. This overrides the brief's §2 label rule, on Owen's call.
- **Remove the line at the start.** Fix: no clay dot or line in shot 1 (enquiries drift in from the first frame); the mark opens from its centre in shot 3, and the end card's returning dot is gone with it.
- **The inbox flashed sharp for a moment when clicking into Sarah's conversation.** Fix: shot 5 pushes in and blurs straight into shot 6's already-blurred thread; no white fade, no sharp frame.

## 2026-09-28: v2 review cut
- **Hated:** some UI "cut outs look a bit dodgy… not a cutout of a screenshot". **Wanted:** "much nicer/smoother".
  - Fix (v3): every foreground UI piece is now live app DOM (scripts/pieces.mjs → Piece.tsx): the app's own markup and CSS on a transparent page, zoomed so text and edges are vector-crisp, with real radii and borders. No rectangular crops, no double borders. Panels without their own container sit on the product's card surface; the deposits panel is framed with a soft scroll fade, not a hard cut.
- **Wanted:** hold on the final booking confirmation, with celebration confetti from its edges.
  - Fix (v3): shot 6 holds 1.3 s on Isla's "you're booked" message, the camera leans in and brand-colour confetti bursts from the message's edges (beneath it, never over text), with the booked chime. Shot 6 is 7.9 s; the end card is trimmed to 4.4 s to keep the film at 48.8 s.
- Music: Owen to pick a free licensed track (Pixabay or Mixkit), see chat.

## 2026-09-28: animatic v1
- **Hated:** the thin line in "Connect your calendar". **Wanted:** "much less thin… make it pulsate." Overall: "make it 10x better."
  - Fix (v2): the line is 10 px clay, draws on, then pulses on the beat (width swell, travelling beads Vallamo → Cliniko, a ring at the Cliniko end every other beat).
  - Fix (v2): real motion blur (240 fps master, 4-subframe blend) on every move; a slow held camera on the calm shots; Sarah's message types into her real bubble; bigger chat and a readable 2× label; the handover card captured at a narrower window so it reads; larger crops for the rules beats; a deeper dolly through the opening enquiries; a few soft SFX (lift, land, clicks, a booked chime).

## 2026-09-28: shot 4 v2
- **Loved:** "much better" (the 4.5 s pace).

## 2026-09-28: shot 4 v1
- **Loved:** the channel swap with the messages stacking. **Note:** "it can be quicker."
  - Fix: shot 4 cut from 7 s to 4.5 s; a new channel about every 0.85 s; faster pop-ins. Keep this pace as the default for energetic beats.

## 2026-09-28: style frames approved
- **Loves:** the style frames (approved). "Meet Vallamo… your new front desk" (shot 3): keep it.
- **Shot 4 note:** keep "Answers on" fixed; the channel word swaps WhatsApp → Instagram → your website, and each channel's real message pops in as its word lands, so all three are on screen at the end.
  - Fix: `scenes/S04Channels.tsx`. Priya (WhatsApp), Sarah (Instagram) and Grace (web chat) stack on the right; ends on *One inbox.*

## 2026-09-28: gate 1 answers
- VO script approved as written.
- Phone answering is **out** (the optional voice line and shot 10 stay out).
- Music: temporary bed for now; licensed track later.
- The "2×" speed chip: **yes**.
- One ink beat behind the logo: **no. Stay all white.**

## From the brief (§7)
**Loves:** real UI on white popping out in 3D · the Apple-style browser · floating enquiries falling into place in the real inbox · the 2× booking · the card flying into the calendar · bold Inter with a Playfair italic accent · AIDA · "every channel, one inbox" energy · the professionalism of Tessel, Skydive and Shotbase.

**Hates:** "made in Paint" or slideshow looks · flat full-screen screen recordings · generic purple SaaS styling · fake UI · over-long videos · anything that looks cheap or AI-made.
