import { S01_LENGTH } from "./scenes/S01Open";
import { S03_LENGTH } from "./scenes/S03Meet";
import { S04_LENGTH } from "./scenes/S04Channels";
import { S05_LENGTH } from "./scenes/S05Inbox";
import { S06_LENGTH } from "./scenes/S06Booked";
import { S07_LENGTH } from "./scenes/S07Connect";
import { S08_LENGTH } from "./scenes/S08Fill";
import { S09_LENGTH } from "./scenes/S09Rules";
import { S11_LENGTH } from "./scenes/S11Handled";
import { S12_LENGTH } from "./scenes/S12End";
import VO_REC from "./vo-lines.json";

/**
 * The master timeline (seconds), timed to the final VO read (vo/final, vo-lines.json).
 * `speed` plays a shot faster than it was built, to fit the read; every cut names its transition.
 */
export const SHOTS = [
  { id: "S01", speed: 1.07, length: S01_LENGTH, name: "Dot + hook", out: "line retracts into the dot" },
  { id: "S03", length: S03_LENGTH, name: "Meet", out: "blur dissolve up" },
  { id: "S04", length: S04_LENGTH, name: "Channels", out: "cards turn face-on (picked up by S05)" },
  { id: "S05", speed: 1.2, length: S05_LENGTH, name: "Into one inbox", out: "click + push-in to Sarah" },
  { id: "S06", length: S06_LENGTH, name: "Booked", out: "THU 24 card lifts to camera" },
  { id: "S07", speed: 1.111, length: S07_LENGTH, name: "Connect your calendar", out: "whip left" },
  { id: "S08", speed: 1.136, length: S08_LENGTH, name: "Watch it fill up", out: "push into Sarah's block" },
  { id: "S09", length: S09_LENGTH, name: "Rules and features", out: "blur out" },
  { id: "S11", length: S11_LENGTH, name: "Handled", out: "grid collapses to centre" },
  { id: "S12", length: S12_LENGTH, name: "End card", out: "hold" },
] as const;

/** Seconds a shot occupies on the film (its built length over its speed). */
export const shotLength = (s: (typeof SHOTS)[number]) => s.length / ("speed" in s ? s.speed : 1);
export const shotSpeed = (s: (typeof SHOTS)[number]) => ("speed" in s ? s.speed : 1);

export const START: Record<string, number> = {};
{
  let at = 0;
  for (const s of SHOTS) {
    START[s.id] = at;
    at += shotLength(s);
  }
}
export const FILM_LENGTH = SHOTS.reduce((sum, s) => sum + shotLength(s), 0);

/** The script's lines (captions and SRT use this wording). */
const SCRIPT = [
  "You're with a client.",
  "Enquiries don't wait.",
  "Meet Vallamo… your new front desk.",
  "It answers on WhatsApp… Instagram… and your website… all in one inbox.",
  "It replies from your own information, checks your diary… and books the appointment.",
  "Connect your calendar…",
  "…and watch it fill up.",
  "Your hours. Your rules. Deposits taken, reminders sent, quiet leads followed up… and when it matters, it hands over to you.",
  "Your entire front desk… Handled.",
  "See yours in ten minutes, built from your website. vallamo.com",
];
/** Where each recorded line starts: [shot, seconds into the shot on the film]. */
const PLACE: [string, number][] = [
  ["S01", 1.87], ["S01", 3.7], ["S03", 0.15], ["S04", 0.1], ["S06", 0.3],
  ["S07", 0.25], ["S08", 0.3], ["S09", 0.15], ["S11", 0.0], ["S12", 0.35],
];
/** The recorded VO, placed: file, film time, length, and the words' film times. */
export const VO_LINES = VO_REC.map((l, i) => {
  const from = START[PLACE[i][0]] + PLACE[i][1];
  return { file: `audio/vo/${String(l.line).padStart(2, "0")}.wav`, from, to: from + l.length, text: SCRIPT[i], words: l.words.map((w) => ({ w: w.w, t: from + w.t })) };
});
/** Caption timing (the guide strip and the SRT). */
export const VO = VO_LINES.map((l) => ({ from: l.from, to: l.to, text: l.text }));
