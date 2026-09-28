# Each script line as its own clip, with its length: python3 lines.py <voice> [speed]
import sys, os
import soundfile as sf
from kokoro import KPipeline
voice = sys.argv[1]; speed = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
pipe = KPipeline(lang_code="b")
os.makedirs(f"lines/{voice}", exist_ok=True)
for i, line in enumerate(open("script.txt").read().strip().split("\n"), 1):
    audio = [a for _, _, a in pipe(line, voice=voice, speed=speed, split_pattern=None)]
    import numpy as np
    y = np.concatenate([a.numpy() for a in audio])
    sf.write(f"lines/{voice}/line{i:02d}.wav", y, 24000)
    print(f"{i:2d} {len(y)/24000:5.2f}s  {line[:60]}")
