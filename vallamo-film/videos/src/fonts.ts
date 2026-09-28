import { continueRender, delayRender, staticFile } from "remotion";

// The product's own fonts (dashboard/public/fonts), loaded before any frame renders.
const faces = [
  new FontFace("Inter", `url(${staticFile("fonts/Inter.woff2")})`, { weight: "100 900" }),
  new FontFace("Playfair Display", `url(${staticFile("fonts/PlayfairDisplay.woff2")})`, { weight: "400 900" }),
  new FontFace("Playfair Display", `url(${staticFile("fonts/PlayfairDisplay-Italic.woff2")})`, { weight: "400 900", style: "italic" }),
];
const handle = delayRender("fonts");
Promise.all(faces.map((f) => f.load().then((l) => (document.fonts as unknown as Set<FontFace>).add(l))))
  .then(() => continueRender(handle))
  .catch((e) => { console.error(e); continueRender(handle); });
