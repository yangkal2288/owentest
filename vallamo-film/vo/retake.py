# Retakes of single lines with different seeds; each checked by Whisper.
#   <venv>/bin/python retake.py <ref.wav> <out dir> <line no> "<text>" <seeds...>
import os, sys
import torch, torchaudio
from chatterbox.tts import ChatterboxTTS
ref, out, n, text = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
os.makedirs(out, exist_ok=True)
model = ChatterboxTTS.from_pretrained(device="cpu")
for seed in map(int, sys.argv[5:]):
    torch.manual_seed(seed)
    wav = model.generate(text, audio_prompt_path=ref, exaggeration=0.55, cfg_weight=0.4)
    torchaudio.save(f"{out}/line{n:02d}-s{seed}.wav", wav, model.sr)
    print(n, seed, round(wav.shape[-1] / model.sr, 2), flush=True)
