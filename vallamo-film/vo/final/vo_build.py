# Final VO build: one consistent treatment, pauses tightened inside the
# speaker's own room tone (equal-power crossfades, no digital silence), a
# room-tone bed for the gaps. Word times: Whisper medium.en on each built line.
#   python3 vo_build.py   → built/NN.wav, built/roomtone.wav, vo-lines.json
import json, os, subprocess
import numpy as np, soundfile as sf

FF = subprocess.check_output(["python3", "-c", "import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())"]).decode().strip()
# Gentle clarity EQ + light compression on the whole take, so every line matches.
EQ = ("highpass=f=90,equalizer=f=320:t=q:w=0.9:g=-3.5,equalizer=f=3000:t=q:w=1.2:g=3.5,"
      "highshelf=f=8500:g=2.5,acompressor=threshold=-24dB:ratio=2.2:attack=10:release=160")
subprocess.run([FF, "-v", "error", "-y", "-i", "recording.wav", "-af", EQ, "-ar", "48000", "treated.wav"], check=True)
y, sr = sf.read("treated.wav", dtype="float32")

# Energy envelope (10 ms) and silence map.
hop = sr // 100
env = np.array([np.sqrt(np.mean(y[i * hop:(i + 1) * hop] ** 2)) for i in range(len(y) // hop)])
db = 20 * np.log10(env + 1e-9)
floor = np.percentile(db, 10)
quiet = db < floor + 10

LINES = [(1, 1.85, 3.04), (2, 3.73, 5.05), (3, 5.78, 8.16), (4, 8.66, 13.92), (5, 14.39, 18.72),
         (6, 19.59, 20.66), (7, 21.00, 22.29), (8, 23.17, 31.99), (9, 32.35, 35.08), (10, 35.69, 40.71)]
KEEP = 0.22   # a tightened pause keeps this much of its room tone
MIN = 0.30    # only pauses longer than this are tightened
XF = int(sr * 0.04)
words = json.load(open("words.json"))

def pauses(a, b):
    out, i = [], int(a * 100)
    while i < int(b * 100):
        if quiet[i]:
            j = i
            while j < int(b * 100) and quiet[j]: j += 1
            if (j - i) / 100 >= MIN and i > int(a * 100) + 5 and j < int(b * 100) - 5: out.append((i / 100, j / 100))
            i = j
        else: i += 1
    return out

def join(parts):
    out = parts[0]
    for p in parts[1:]:
        t = np.linspace(0, np.pi / 2, XF)
        mid = out[-XF:] * np.cos(t) + p[:XF] * np.sin(t)
        out = np.concatenate([out[:-XF], mid, p[XF:]])
    return out

os.makedirs("built", exist_ok=True)
meta = []
for n, a, b in LINES:
    cuts = pauses(a, b)
    spans, t = [], a
    for p0, p1 in cuts:
        m = (p0 + p1) / 2
        spans.append((t, m - KEEP / 2 + 0.02)); t = m + KEEP / 2 - 0.02
    spans.append((t, b))
    clip = join([y[int(s0 * sr):int(s1 * sr)].copy() for s0, s1 in spans])
    f = int(sr * 0.06)
    clip[:f] *= np.sin(np.linspace(0, np.pi / 2, f)); clip[-f:] *= np.cos(np.linspace(0, np.pi / 2, f))
    def remap(ts):
        off = 0.0
        for k, (s0, s1) in enumerate(spans):
            if ts < s0: return off
            if ts <= s1: return off + ts - s0
            off += s1 - s0 - (XF / sr if k < len(spans) - 1 else 0)
        return off
    # Word times are re-derived afterwards by Whisper medium.en on each built line (more accurate than remapping).
    ws = [dict(w=w["w"].strip(), t=round(remap(w["s"]), 3)) for w in words if a - 0.3 <= w["s"] < b]
    meta.append(dict(line=n, length=round(len(clip) / sr, 3), words=ws, tightened=[[round(p0, 2), round(p1, 2)] for p0, p1 in cuts]))
    sf.write(f"built/{n:02d}.wav", clip, sr)
    print(n, f"{b - a:.2f}s → {len(clip) / sr:.2f}s", " ".join(f"{w['w']}@{w['t']}" for w in ws))

# Room tone: the take's own quiet head (before "You're"), looped with crossfades into a 70 s bed.
rt = y[int(0.2 * sr):int(1.75 * sr)]
bed = rt
while len(bed) < 70 * sr: bed = join([bed, rt])
sf.write("built/roomtone.wav", bed[:70 * sr], sr)
json.dump(meta, open("vo-lines.json", "w"), indent=1)
