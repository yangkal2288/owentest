#!/usr/bin/env python3
"""Build the two index.html versions from the live page.

  A  (index-a-mid-and-closing.html): the mid-section and the closing card only.
  B  (index-b-full-refresh.html):    A, plus cosmetic polish above it
                                     (hero background, preview frame, testimonials).
"""
import pathlib, sys
here = pathlib.Path(__file__).parent
src, out_dir = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
page = src.read_text()
wa = here.joinpath("wa_path.txt").read_text().strip()

start = page.index('<section class="section wrap" aria-labelledby="features-heading">')
cta = page.index('<section class="wrap" aria-labelledby="cta-heading">')
end = page.index("</section>", cta) + len("</section>")
mid = here.joinpath("mid_and_cta.html").read_text().replace("{{WA_PATH}}", wa)

css = here.joinpath("refresh.css").read_text()
js = here.joinpath("refresh.js").read_text()
cosmetic = here.joinpath("cosmetic.css").read_text()

def build(extra_css=""):
    html = page[:start] + mid.rstrip() + "\n" + page[end:]
    style = f'<style class="vallamo-2026-refresh">\n{css.strip()}\n</style>\n'
    if extra_css:
        style += f'<style class="vallamo-2026-cosmetic">\n{extra_css.strip()}\n</style>\n'
    assert html.count("</head>") == 1 and html.count("</body>") == 1
    html = html.replace("</head>", style + "</head>", 1)
    html = html.replace("</body>", f"<script>\n{js.strip()}\n</script>\n</body>", 1)
    return html

out_dir.mkdir(parents=True, exist_ok=True)
(out_dir / "index-a-mid-and-closing.html").write_text(build())
(out_dir / "index-b-full-refresh.html").write_text(build(cosmetic))
print("built", out_dir)
