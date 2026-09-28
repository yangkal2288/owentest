// Writes the SRT for the VO script lines on the current timeline.
//   npx tsx scripts/srt.ts out/meet/Vallamo-Meet-X.srt
import { writeFileSync } from "node:fs";

import { VO } from "../src/films/meet/timeline";

const stamp = (s: number) => {
  const ms = Math.round(s * 1000);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
const out = process.argv[2] ?? "out/meet/Vallamo-Meet-X.srt";
writeFileSync(out, VO.map((v, i) => `${i + 1}\n${stamp(v.from)} --> ${stamp(v.to)}\n${v.text}\n`).join("\n"));
console.log(out);
