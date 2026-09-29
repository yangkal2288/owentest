/**
 * "Vallamo always replies instantly", the Meta ad (VALLAMO_META_AD_PRODUCTION_BRIEF.md).
 * The music is Soundsurfer "Product Video" fitted to 30.04 s on its downbeats
 * (music/fit-soundsurfer-meta30-report.md): 89.1 BPM, downbeats every 2.694 s from 2.79 s.
 * Every cut lands on a downbeat.
 */
export const BEAT = 60 / 89.1;
export const BAR = BEAT * 4;
export const DOWNBEAT = (n: number) => 2.79 + (n - 1) * BAR; // bar 1 = 2.79

export const CUT = {
  lost: 0, // 0–3 the question, 3–8 ten minutes
  tenMin: DOWNBEAT(1), // 2.79
  product: DOWNBEAT(3), // 8.18: Vallamo always replies instantly
  end: DOWNBEAT(8), // 21.65: stop losing business
};
export const LENGTH = 30.04;

/** The voiceover as written in the brief, with where each line should sit (for the SRT and the VO session). */
export const SCRIPT: { at: number; to: number; text: string }[] = [
  { at: 0.25, to: 2.6, text: "Have you lost a customer to a competitor?" },
  { at: 3.0, to: 7.7, text: "The average customer waits ten minutes for a reply before trying a competitor." },
  { at: 8.3, to: 10.5, text: "Vallamo always replies instantly." },
  { at: 11.0, to: 13.4, text: "Meet Vallamo, your all-in-one front desk." },
  { at: 13.8, to: 20.9, text: "Answers from your clinic's information. Enquiries answered. Appointments booked." },
  { at: 21.8, to: 28.6, text: "Stop losing business to competitors. See Vallamo on your website in ten minutes. Vallamo dot com." },
];

// ---------------------------------------------------------------- cuts
import { createContext, useContext } from "react";

import type { Msg } from "./parts";

/**
 * The 30 s ad and its 15 s cut (brief §15-second Meta alternative) share every scene;
 * only these timings differ. A phase set to Infinity never happens in that cut.
 */
export type MetaCut = {
  id: "30" | "15";
  length: number;
  music: string;
  lost: { tenMin: number; ticks: number[]; reply: number; crack: number; shatter: number; out: number };
  product: { P: number; MEET: number; PROOF: number; ANSWERED: number; BOOKED: number; WIPE: number; backEnd: number; meetOut: number; pillsOut: number; msgs: Msg[]; pills: number[] };
  end: { head: number; offer: number; cta: number; url: number; voice: number };
};

const ticks = (from: number, span: number) => Array.from({ length: 10 }, (_, i) => from + span * (1 - Math.pow(1 - (i + 1) / 10, 1.7)));

export const META_CUTS: Record<MetaCut["id"], MetaCut> = {
  "30": {
    id: "30",
    length: LENGTH,
    music: "audio/music-meta.wav",
    lost: { tenMin: CUT.tenMin, ticks: ticks(3.05, 2.35), reply: 5.85, crack: 6.42, shatter: 6.6, out: 7.8 },
    product: {
      P: CUT.product,
      MEET: DOWNBEAT(4),
      PROOF: DOWNBEAT(5),
      ANSWERED: DOWNBEAT(6),
      BOOKED: DOWNBEAT(7),
      WIPE: 21.25,
      backEnd: DOWNBEAT(5) + 0.3,
      meetOut: DOWNBEAT(5) - 0.2,
      pillsOut: DOWNBEAT(5) - 0.15,
      msgs: [
        { name: "m-u1", at: 8.5 },
        { name: "m-dots", at: 8.76, out: 9.04 },
        { name: "m-i1", at: 9.04 },
        { name: "m-u2", at: 16.45 },
        { name: "m-dots", at: 16.74, out: 17.02 },
        { name: "m-i2", at: 17.02 },
      ],
      pills: [DOWNBEAT(4) + 0.2, DOWNBEAT(4) + 0.2 + BEAT / 2, DOWNBEAT(4) + 0.2 + BEAT],
    },
    end: { head: 21.55, offer: DOWNBEAT(8) + BEAT, cta: DOWNBEAT(8) + 2 * BEAT, url: DOWNBEAT(8) + 3 * BEAT, voice: DOWNBEAT(9) },
  },
  // "Have you lost a customer to a competitor? / Vallamo always replies instantly. /
  //  Your all-in-one front desk. / See it on your website in ten minutes."
  "15": {
    id: "15",
    length: 15.2,
    music: "audio/music-paid15.wav",
    // The minutes race by in the card itself; no statistic in the short cut.
    lost: { tenMin: Infinity, ticks: ticks(1.05, 1.3), reply: 2.7, crack: 3.22, shatter: 3.4, out: 3.95 },
    product: {
      P: DOWNBEAT(1) + 2 * BEAT, // 4.14
      MEET: DOWNBEAT(2), // 5.48
      PROOF: Infinity,
      ANSWERED: Infinity,
      BOOKED: DOWNBEAT(3), // 8.18
      WIPE: 9.75,
      backEnd: DOWNBEAT(3) - 0.2,
      meetOut: DOWNBEAT(3) - 0.2,
      pillsOut: DOWNBEAT(3) - 0.25,
      msgs: [
        { name: "m-u1", at: 4.42 },
        { name: "m-dots", at: 4.66, out: 4.9 },
        { name: "m-i1", at: 4.9 },
        { name: "m-u2", at: 6.85 },
        { name: "m-dots", at: 7.08, out: 7.3 },
        { name: "m-i2", at: 7.3 },
      ],
      pills: [DOWNBEAT(2) + 0.2, DOWNBEAT(2) + 0.2 + BEAT / 2, DOWNBEAT(2) + 0.2 + BEAT],
    },
    end: { head: 10.05, offer: DOWNBEAT(4), cta: DOWNBEAT(4) + BEAT, url: DOWNBEAT(4) + 2 * BEAT, voice: DOWNBEAT(4) + 3 * BEAT },
  },
};

export const MetaCutCtx = createContext<MetaCut>(META_CUTS["30"]);
export const useMetaCut = () => useContext(MetaCutCtx);
