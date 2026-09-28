# Contact sheet of review stills: python3 scripts/sheet.py <dir> <out.png> [cols] [width]
import sys, glob, os, re
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
w = int(sys.argv[4]) if len(sys.argv) > 4 else 300
files = sorted(glob.glob(os.path.join(d, "f*.png")), key=lambda f: int(re.findall(r"f(\d+)", f)[-1]))
ims = [Image.open(f).convert("RGB") for f in files]
h = int(w * ims[0].height / ims[0].width)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 8) + 8, rows * (h + 30) + 8), (40, 40, 40))
dr = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = 8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 30)
    sheet.paste(im.resize((w, h), Image.LANCZOS), (x, y + 22))
    n = int(re.findall(r"f(\d+)", f)[-1])
    dr.text((x, y + 4), f"f{n}  {n/30:.2f}s", fill=(230, 230, 230))
sheet.save(out)
print(out, sheet.size)
