# Expressive free AI voiceover with Chatterbox (MIT licence: commercial use allowed),
# performed in the timbre of a reference clip (here: Kokoro's British "Lily").
#   <venv>/bin/python chatterbox_vo.py <ref.wav> <out dir> [exaggeration] [cfg] [seed]
import os, sys
import torch, torchaudio
from chatterbox.tts import ChatterboxTTS

ref, out = sys.argv[1], sys.argv[2]
exag = float(sys.argv[3]) if len(sys.argv) > 3 else 0.55
cfg = float(sys.argv[4]) if len(sys.argv) > 4 else 0.4
seed = int(sys.argv[5]) if len(sys.argv) > 5 else 7
os.makedirs(out, exist_ok=True)
model = ChatterboxTTS.from_pretrained(device="cpu")
lines = [l.replace("[Vallamo](/vəlˈɑːməʊ/)", "Va-lah-mo") for l in open("script.txt").read().strip().split("\n")]
for i, line in enumerate(lines, 1):
    torch.manual_seed(seed + i)
    wav = model.generate(line, audio_prompt_path=ref, exaggeration=exag, cfg_weight=cfg)
    torchaudio.save(f"{out}/line{i:02d}.wav", wav, model.sr)
    print(f"{i:2d} {wav.shape[-1] / model.sr:5.2f}s  {line[:60]}", flush=True)
