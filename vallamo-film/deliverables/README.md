# Meet Vallamo: X launch film

| File | What |
|---|---|
| `Vallamo-Meet-X-FINAL-v8.mp4` | **The film** (final WhatsApp voiceover, cleaned). 52.3 s, 1920×1080, 60 fps, H.264, BT.709. Voiceover, music and a few soft SFX, mixed to −14 LUFS. |
| `Vallamo-Meet-X-1920x1080-music-only.mp4` | The same picture with music and SFX, no voice. |
| `Vallamo-Meet-X-1920x1080-silent.mp4` | Picture only. |
| `Vallamo-Meet-X.srt` | Captions timed to the recorded voiceover (the script's wording). |
| `poster.png` | Preview frame for the X post ("Answers. Checks your diary. Books it."). |

## What's real

- **Every piece of product UI is the real Vallamo app** (the North House Aesthetics demo tenant, fictional data; the on-screen "demo" label was dropped at Owen's request). Pieces are the app's own HTML and CSS, captured from `videos/public/ui/source.html`. Nothing is redrawn, mocked or AI-generated.
- **Logo, colours and type** come from the brand package (`brand/`).
- **Voiceover:** the final read (`vo/final/`, from the WhatsApp video of 28 Sep), cut on its own pauses into the script's lines, with rumble removed, the level evened out, and EQ and light compression for clarity and her own room tone under the whole read (`vo/final/vo_build.py`). Word timings come from Whisper, and each visual beat is placed on its word.
- **Music:** Soundsurfer, "Product Video" (Pixabay, free for commercial use, no attribution required). Joined on downbeats to fit, ending on its real ending, and ducked under the voice.

## What's staged (presentation only)

- Inbox rows show each customer's own first message with a fresh time ("now", "2 min").
- In shot 5 the web-chat slot shows Grace Morgan's row, so the three enquiries from shot 4 are the ones that land.
- Shot 8: the week's real bookings are hidden, then dropped back into their own slots.
- Shot 9: the handover card is captured with the app at a 1100 px window, so it reads at film size. The follow-up switch is flipped in the real UI.
- The "Design review" button and the launch banner are removed from every capture.
- Em dashes in the app's text are shown as commas ("GBP (£)" for currency).
- The back half of Sarah's conversation plays at double speed, and a "2×" label says so on screen.

## Re-render

```bash
cd videos && npm install
export REMOTION_BROWSER=/path/to/chromium   # only if Remotion can't download its own
node scripts/pieces.mjs && node scripts/pieces-png.mjs   # re-capture the UI pieces
scripts/render-film.sh Meet meet x v7                    # 240 fps master → motion blur → 60 fps
npx remotion render src/index.ts Meet-animatic out/mix.wav --codec=wav \
  --props '{"fps":60,"guide":false,"music":true,"sfx":true,"vo":true}'
# then mux out/mix.wav onto the video with loudnorm=I=-14 (see git history for the exact command)
npx tsx scripts/srt.ts out/meet/Vallamo-Meet-X.srt
```

- Timing lives in `videos/src/films/meet/timeline.ts`. Each VO line is placed there, and shots that play sped up have a `speed`.
- To swap in a new VO read: cut it with `vo/final/vo_edit.py`, write `vo-lines.json`, and adjust the placements.
