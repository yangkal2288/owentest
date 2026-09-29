import { createContext, useContext } from "react";

/**
 * "You paid for the enquiry. Your competitor got the booking."
 * (VALLAMO_MARKETING_SPEND_AD_PRODUCTION_BRIEF.md). Two cuts share every scene; this
 * table is the only place their timings differ. Music: Soundsurfer "Product Video",
 * 89.1 BPM, downbeats every 2.694 s from 2.79 s. The big moments land on beats.
 */
const BEAT = 60 / 89.1;
const DB = (n: number) => 2.79 + (n - 1) * BEAT * 4; // downbeat n
const B = (n: number, beats: number) => DB(n) + beats * BEAT;

export type Cut = {
  id: "main" | "short";
  length: number;
  music: string;
  /** Hook, whole on the first frame: lines of [text, emphasised] runs. */
  hook: [string, boolean][][];
  /** The opening path (Your ad → New enquiry → Another clinic); main only. */
  path: number[] | null;
  card: { in: number; client: number | null; status: "client" | "noReply" };
  timer: { from: number; to: number; settle: number } | null;
  reply: number; // "I've booked the appointment with another clinic."
  replyText: string;
  crack: number;
  x: number; // shatter, red X, buzzer
  xOut: number;
  /** Meet Vallamo; main only. */
  meet: { at: number; always: number; pills: number[]; out: number } | null;
  demo: { at: number; msgs: { name: string; at: number; out?: number }[]; fast: [number, number] | null; booked: number; out: number };
  /** `ctaText` null: the button is the domain itself (the short cut, where the headline is the action). */
  end: { at: number; headline: [string, string, string]; offer: number; cta: number; url: number; ctaText: string | null };
};

export const CUTS: Record<Cut["id"], Cut> = {
  main: {
    id: "main",
    length: 35.45,
    music: "audio/music-paid35.wav",
    hook: [[["You paid for", false]], [["the enquiry.", false]], [["Your ", false], ["competitor", true]], [["got the booking.", false]]],
    path: [0.55, 1.25, 1.95],
    card: { in: 1.3, client: B(1, 3), status: "client" }, // 4.81
    timer: { from: 7.45, to: 8.85, settle: 8.95 },
    reply: 9.35,
    replyText: "I’ve booked the appointment with another clinic.",
    crack: B(4, 0) + 0.44, // 11.31
    x: B(4, 1), // 11.54
    xOut: B(5, 2) - 0.2, // 14.71
    meet: { at: B(5, 2), always: B(6, 2), pills: [B(6, 3), B(6, 3.5), B(6, 4)], out: B(7, 2) - 0.2 },
    demo: {
      at: B(7, 2), // 20.30
      msgs: [
        { name: "p-u1", at: 20.7 },
        { name: "m-dots", at: 21.0, out: 21.3 },
        { name: "p-i1", at: 21.3 },
        { name: "p-u2", at: 22.55 },
        { name: "p-idet", at: 23.0 },
        { name: "p-u3", at: 23.35 },
        { name: "m-dots", at: 23.6, out: 23.82 },
        { name: "p-i2", at: 23.82 },
      ],
      fast: [22.85, 23.9], // the details step plays at 2x, labelled
      booked: B(9, 1), // 25.01
      out: 28.4,
    },
    end: { at: 28.4, headline: ["Stop losing", "business to", "competitors."], offer: B(10, 4) - 0.02, cta: B(11, 1) - 0.4, url: B(11, 2) - 0.4, ctaText: "See it with your clinic’s details" },
  },
  short: {
    id: "short",
    length: 15.2,
    music: "audio/music-paid15.wav",
    hook: [[["Your paid", false]], [["enquiry waited.", false]], [["They booked", false]], [["elsewhere.", true]]],
    path: null,
    card: { in: 0.25, client: null, status: "noReply" },
    timer: null,
    reply: 1.55,
    replyText: "Booked with another clinic.",
    crack: 3.12,
    x: B(1, 0.9), // 3.4
    xOut: B(2, 0) - 0.2, // 5.28
    meet: null,
    demo: {
      at: B(2, 0), // 5.48
      msgs: [
        { name: "p-u1", at: 5.85 },
        { name: "m-dots", at: 6.15, out: 6.4 },
        { name: "p-i1", at: 6.4 },
      ],
      fast: null,
      booked: B(3, 0) - 0.3, // 7.88
      out: 9.45,
    },
    end: { at: 9.45, headline: ["See it with", "your clinic’s", "details."], offer: 10.2, cta: 10.87, url: 11.54, ctaText: null },
  },
};

export const CutCtx = createContext<Cut>(CUTS.main);
export const useCut = () => useContext(CutCtx);
