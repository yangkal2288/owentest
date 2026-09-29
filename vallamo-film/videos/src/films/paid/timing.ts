import { createContext, useContext } from "react";

import type { Msg } from "../meta/parts";

/**
 * "You're with a client. An enquiry for £120 comes in. What happens? You lose them to a
 * competitor. Your marketing spend. Their booking. Meet Vallamo…" (Owen's story over
 * VALLAMO_MARKETING_SPEND_AD_PRODUCTION_BRIEF.md). Music: Soundsurfer "Product Video",
 * 89.1 BPM, downbeats every 2.694 s from 2.79 s; the scene changes land on them.
 */
const BEAT = 60 / 89.1;
const DB = (n: number) => 2.79 + (n - 1) * BEAT * 4;
const B = (n: number, beats: number) => DB(n) + beats * BEAT;

export type Cut = {
  id: "main" | "short";
  length: number;
  music: string;
  client: { out: number };
  enquiry: { at: number; drop: number };
  what: number | null; // "What happens?"
  count: [number, number]; // the unanswered minutes run
  reply: number; // "I've booked with another clinic."
  lose: number; // "You lose them to a competitor."
  crack: number;
  shatter: number;
  spend: { at: number; price: number; their: number; out: number };
  meet: { at: number; out: number } | null;
  always: { at: number; pills: number[]; out: number } | null;
  /** `head`: the main cut's "Answered while you're with a client", or the short cut's product line. */
  demo: { at: number; head: "answered" | "always"; msgs: Msg[]; fast: [number, number] | null; booked: number; out: number };
  end: { at: number; headline: [string, string, string]; offer: number; cta: number; url: number; ctaText: string | null };
};

export const CUTS: Record<Cut["id"], Cut> = {
  main: {
    id: "main",
    length: 30.04,
    music: "audio/music-meta.wav",
    client: { out: DB(1) - 0.15 },
    enquiry: { at: DB(1), drop: B(1, 0.6) },
    what: DB(2),
    count: [B(2, 0.2), B(2, 2.6)],
    reply: B(2, 3.05),
    lose: B(2, 3.3),
    crack: B(3, 1.6),
    shatter: B(3, 1.85),
    spend: { at: B(3, 2), price: B(3, 2.75), their: DB(4), out: B(4, 2.9) },
    meet: { at: B(4, 3.1), out: DB(6) - 0.1 },
    always: { at: DB(6), pills: [B(6, 1.3), B(6, 1.8), B(6, 2.3)], out: DB(7) - 0.15 },
    demo: {
      at: DB(7),
      head: "answered",
      msgs: [
        { name: "p-u1", at: B(7, 0.7) },
        { name: "m-dots", at: B(7, 1.1), out: B(7, 1.5) },
        { name: "p-i1", at: B(7, 1.5) },
        { name: "p-u2", at: B(7, 2.9) },
        { name: "p-idet", at: B(7, 3.4) },
        { name: "p-u3", at: B(7, 3.9) },
        { name: "m-dots", at: B(7, 4.3), out: B(7, 4.6) },
        { name: "p-i2", at: B(7, 4.6) },
      ],
      fast: [B(7, 3.2), B(7, 4.8)],
      booked: B(8, 2),
      out: DB(9) - 0.15,
    },
    end: { at: DB(9), headline: ["Stop losing", "business to", "competitors"], offer: B(9, 1.2), cta: B(9, 2), url: B(9, 3), ctaText: "See it with your clinic’s details" },
  },
  short: {
    id: "short",
    length: 15.2,
    music: "audio/music-paid15.wav",
    client: { out: 1.3 },
    enquiry: { at: 1.44, drop: 1.7 },
    what: null,
    count: [2.2, 3.2],
    reply: 3.4,
    lose: 3.55,
    crack: 4.7,
    shatter: 4.86,
    spend: { at: 4.95, price: 5.3, their: DB(2), out: 6.65 },
    meet: null,
    always: null,
    demo: {
      at: B(2, 2),
      head: "always",
      msgs: [
        { name: "p-u1", at: B(2, 2.6) },
        { name: "m-dots", at: B(2, 3.0), out: B(2, 3.35) },
        { name: "p-i1", at: B(2, 3.35) },
      ],
      fast: null,
      booked: B(3, 1.4),
      out: B(4, -0.9),
    },
    end: { at: B(4, -0.6), headline: ["See it with", "your clinic’s", "details"], offer: B(4, 0.5), cta: B(4, 1.2), url: B(4, 2), ctaText: null },
  },
};

export const CutCtx = createContext<Cut>(CUTS.main);
export const useCut = () => useContext(CutCtx);
