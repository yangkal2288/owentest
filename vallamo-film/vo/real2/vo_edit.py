# Cut the recorded take into the script's lines (on its own silences), tighten
# long pauses inside a line, and place each line on the film timeline.
# Writes vo-lines.json (per line: source spans, film start, word times in
# line-relative seconds) for timeline.ts, and each line as lines/NN.wav (48 kHz).
import json, os
import numpy as np, soundfile as sf

y, sr = sf.read("recording.wav", dtype="float32")
words = json.load(open("words.json"))
os.makedirs("lines", exist_ok=True)
# (line, source start, source end, pauses to tighten [(from, to)] → kept at MAXP). Take 2: no pauses tightened.
LINES = [
    (1, 0.45, 1.71, []),
    (2, 1.98, 3.27, []),
    (3, 3.83, 6.05, []),
    (4, 6.40, 10.79, []),
    (5, 11.14, 15.23, []),
    (6, 15.61, 16.66, []),  # "Connect your calendar"
    (7, 16.76, 17.73, []),  # "and watch it fill up"
    (8, 18.22, 25.50, []),
    (9, 25.72, 27.88, []),
    (10, 28.42, 32.60, []),
]
MAXP = 0.18
FADE = int(sr * 0.012)
out = []
for n, a, b, pauses in LINES:
    spans, t = [], a
    for p0, p1 in pauses:
        mid = (p0 + p1) / 2
        spans.append((t, mid - MAXP / 2)); t = mid + MAXP / 2
    spans.append((t, b))
    clip = []
    for s0, s1 in spans:
        seg = y[int(s0 * sr):int(s1 * sr)].copy()
        seg[:FADE] *= np.linspace(0, 1, FADE); seg[-FADE:] *= np.linspace(1, 0, FADE)
        clip.append(seg)
    clip = np.concatenate(clip)
    sf.write(f"lines/{n:02d}.wav", clip, sr)
    # word times → line-relative after the pause cuts
    def remap(ts):
        rel, off = None, 0.0
        for s0, s1 in spans:
            if ts < s0: return off
            if ts <= s1: return off + ts - s0
            off += s1 - s0
        return off
    ws = [dict(w=w["w"].strip(), t=round(remap(w["s"]), 3)) for w in words if a - 0.3 <= w["s"] < b]
    out.append(dict(line=n, length=round(len(clip) / sr, 3), words=ws))
    print(n, round(len(clip) / sr, 2), " ".join(f"{w['w']}@{w['t']}" for w in ws))
json.dump(out, open("vo-lines.json", "w"), indent=1)
