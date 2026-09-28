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

/**
 * The master timeline (seconds), following the VO script's guide timings.
 * Re-time to the real VO when it arrives. Every cut names its transition.
 */
export const SHOTS = [
  { id: "S01", length: S01_LENGTH, name: "Dot + hook", out: "line retracts into the dot" },
  { id: "S03", length: S03_LENGTH, name: "Meet", out: "blur dissolve up" },
  { id: "S04", length: S04_LENGTH, name: "Channels", out: "cards turn face-on (picked up by S05)" },
  { id: "S05", length: S05_LENGTH, name: "Into one inbox", out: "click + push-in to Sarah" },
  { id: "S06", length: S06_LENGTH, name: "Booked", out: "THU 24 card lifts to camera" },
  { id: "S07", length: S07_LENGTH, name: "Connect your calendar", out: "whip left" },
  { id: "S08", length: S08_LENGTH, name: "Watch it fill up", out: "push into Sarah's block" },
  { id: "S09", length: S09_LENGTH, name: "Rules and features", out: "blur out" },
  { id: "S11", length: S11_LENGTH, name: "Handled", out: "grid collapses to centre" },
  { id: "S12", length: S12_LENGTH, name: "End card", out: "hold" },
] as const;

export const START: Record<string, number> = {};
{
  let at = 0;
  for (const s of SHOTS) {
    START[s.id] = at;
    at += s.length;
  }
}
export const FILM_LENGTH = SHOTS.reduce((sum, s) => sum + s.length, 0);

/** The VO script's lines on the guide timeline (captions and SRT come from here). */
export const VO = [
  { from: 2.0, to: 4.0, text: "You're with a client." },
  { from: 4.0, to: 6.0, text: "Enquiries don't wait." },
  { from: 6.0, to: 9.0, text: "Meet Vallamo… your new front desk." },
  { from: 9.0, to: 15.0, text: "It answers on WhatsApp… Instagram… and your website… all in one inbox." },
  { from: 18.0, to: 25.0, text: "It replies from your own information, checks your diary… and books the appointment." },
  { from: 25.0, to: 29.0, text: "Connect your calendar…" },
  { from: 29.0, to: 34.0, text: "…and watch it fill up." },
  { from: 34.0, to: 40.5, text: "Your hours. Your rules. Deposits taken, reminders sent, quiet leads followed up… and when it matters, it hands over to you." },
  { from: 40.5, to: 43.5, text: "Your entire front desk… Handled." },
  { from: 43.5, to: 48.5, text: "See yours in ten minutes, built from your website. vallamo.com" },
];
