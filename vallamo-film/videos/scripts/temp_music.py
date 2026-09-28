# TEMP music bed for the animatic only (never shipped): 100 BPM, soft kick,
# offbeat hats, warm pad chords. Owen supplies the licensed track later.
#   python3 scripts/temp_music.py public/audio/temp-bed.wav 48.5
import sys, wave
import numpy as np

out, length = sys.argv[1], float(sys.argv[2])
sr, bpm = 48000, 100
beat = 60 / bpm
n = int(sr * length)
t = np.arange(n) / sr
mix = np.zeros(n)
rng = np.random.default_rng(7)

def add(sig, at):
    i = int(at * sr)
    if i >= n: return
    j = min(n, i + len(sig))
    mix[i:j] += sig[: j - i]

# Pad: Cmaj9 · Am9 · Fmaj7 · G6, two bars each, soft sines with slow attack.
chords = [[48, 55, 59, 62, 64], [45, 52, 55, 59, 60], [41, 48, 52, 57, 60], [43, 50, 55, 59, 64]]
bar = beat * 4
k = 0
at = 0.0
while at < length:
    notes = chords[k % 4]
    d = bar * 2
    tt = np.arange(int(d * sr)) / sr
    env = np.minimum(1, tt / 0.6) * np.minimum(1, (d - tt) / 0.4)
    sig = sum(np.sin(2 * np.pi * 440 * 2 ** ((m - 69) / 12) * tt) for m in notes) / len(notes)
    add(0.22 * env * sig, at)
    at += d; k += 1

# Kick on every beat from 2.0 s (the hook), off for the end card's last bars.
kt = np.arange(int(0.35 * sr)) / sr
kick = np.sin(2 * np.pi * (48 + 80 * np.exp(-kt * 30)) * kt) * np.exp(-kt * 9)
hat_t = np.arange(int(0.05 * sr)) / sr
hat = rng.standard_normal(len(hat_t)) * np.exp(-hat_t * 90)
hat = np.diff(hat, prepend=0)  # brighter
b = 2.0
while b < length - 3.0:
    add(0.5 * kick, b)
    add(0.06 * hat, b + beat / 2)
    b += beat

# Fade in / out.
env = np.minimum(1, t / 0.8) * np.minimum(1, (length - t) / 2.5)
mix *= env
mix /= np.max(np.abs(mix)) / 0.5  # peak about -6 dBFS
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())
print(out, length, "s")
