# Free AI voiceover with Kokoro-82M (Apache-2.0: commercial use allowed), British English.
#   python3 kokoro_vo.py <voice> <out.wav> [speed] [text-file]
import sys
import numpy as np
import soundfile as sf
from kokoro import KPipeline

voice, out = sys.argv[1], sys.argv[2]
speed = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
text = open(sys.argv[4]).read() if len(sys.argv) > 4 else "Meet [Vallamo](/vəlˈɑːməʊ/)… your new front desk."
pipe = KPipeline(lang_code="b")  # b = British English
parts = [audio for _, _, audio in pipe(text, voice=voice, speed=speed, split_pattern=r"\n+")]
gap = np.zeros(int(24000 * 0.35), dtype=np.float32)  # a breath between lines
audio = np.concatenate([np.concatenate([p.numpy() if hasattr(p, "numpy") else p, gap]) for p in parts])
sf.write(out, audio, 24000)
print(out, round(len(audio) / 24000, 2), "s")
