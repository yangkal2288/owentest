import { createContext, useContext } from "react";

import type { Msg } from "../meta/parts";

/**
 * "More bookings. More revenue. Less admin." (VALLAMO_CLINIC_GROWTH_AD_BRIEF.md). One website
 * enquiry for the £120 facial becomes a booking in the real diary; the diary keeps filling from
 * day into night; the Autumn deal. Music: Soundsurfer "Product Video", 89.1 BPM, downbeats every
 * 2.694 s from 2.79 s; every scene change lands on one.
 */
const BEAT = 60 / 89.1;
const DB = (n: number) => 2.79 + (n - 1) * BEAT * 4;
const B = (n: number, beats: number) => DB(n) + beats * BEAT;

export type GrowthCut = {
  id: "main" | "short";
  length: number;
  music: string;
  /** The opening headline: its lines' times (the first is already landing on frame 0) and when it leaves. */
  open: { lines: number[]; revenue: number; booking: number; out: number };
  /** WhatsApp, Instagram and the website enquiry arriving; the website card becoming the chat. */
  channels: { at: number; cards: number[]; focus: number } | null;
  /** The chat widget: in, messages, the "2×" fast-forward, the booking result, out to the diary. */
  chat: { at: number; head: number; flow: number | null; msgs: Msg[]; fast: [number, number] | null; booked: number; out: number };
  /** The diary: in, the booking landing in Thursday 3pm, "£120 appointment". */
  diary: { at: number; land: number; price: number; out: number };
  /** Day, evening, night: the benefit lines, each with a booking made at that hour. */
  benefits: { at: number; drop: number }[];
  offer: { at: number; card: number; wipe: number; cta: number; url: number };
};

export const GROWTH: Record<GrowthCut["id"], GrowthCut> = {
  main: {
    id: "main",
    length: 35.5,
    music: "audio/music-paid35.wav",
    open: { lines: [-0.14, B(1, -3), B(1, -2)], revenue: B(1, -2.7), booking: B(1, -3.4), out: DB(1) - 0.2 },
    channels: { at: DB(1) - 0.05, cards: [B(1, 0.15), B(1, 0.45), B(1, 0.75)], focus: B(1, 1.9) },
    chat: {
      at: B(1, 1.9),
      head: DB(1),
      flow: DB(3),
      msgs: [
        { name: "g-u1", at: B(1, 1.9) },
        { name: "m-dots", at: B(1, 2.5), out: B(1, 3.1) },
        { name: "g-i1", at: B(1, 3.1) },
        { name: "g-u2", at: B(2, 3.2) },
        { name: "g-idet", at: B(3, 0.5) },
        { name: "g-u3", at: B(3, 1.3) },
        { name: "m-dots", at: B(3, 1.75), out: B(3, 2.15) },
        { name: "g-i2", at: B(3, 2.15) },
      ],
      fast: [B(3, 0.35), B(3, 2.0)],
      booked: B(3, 3.2),
      out: DB(4) + 0.1,
    },
    diary: { at: DB(4) - 0.1, land: B(4, 2), price: B(4, 3), out: DB(9) - 0.2 },
    benefits: [
      { at: DB(6), drop: B(6, 1) },
      { at: DB(7), drop: B(7, 1) },
      { at: DB(8), drop: B(8, 1) },
    ],
    offer: { at: DB(9) - 0.2, card: DB(9), wipe: DB(10), cta: DB(11), url: B(11, 1) },
  },
  short: {
    id: "short",
    length: 15.2,
    music: "audio/music-paid15.wav",
    open: { lines: [-0.14, B(1, -3.2)], revenue: B(1, -2.9), booking: 99, out: DB(1) - 0.2 },
    channels: null,
    chat: {
      at: B(1, -2.6),
      head: DB(1),
      flow: null,
      msgs: [
        { name: "g-u1", at: B(1, -2.4) },
        { name: "m-dots", at: B(1, -1.9), out: B(1, -1.3) },
        { name: "g-i1", at: B(1, -1.3) },
        { name: "g-u2", at: B(1, 1.8) },
        { name: "g-idet", at: B(1, 2.2) },
        { name: "g-u3", at: B(1, 2.6) },
        { name: "m-dots", at: B(1, 2.9), out: B(1, 3.15) },
        { name: "g-i2", at: B(1, 3.15) },
      ],
      fast: [B(1, 1.7), B(1, 3.3)],
      booked: B(2, 0.3),
      out: B(2, 1.05),
    },
    diary: { at: B(2, 0.9), land: B(2, 2.1), price: B(2, 2.9), out: B(3, 1.1) },
    benefits: [],
    offer: { at: B(3, 1.1), card: B(3, 1.3), wipe: DB(4) - 0.35, cta: B(4, 0.6), url: B(4, 1.2) },
  },
};

export const GrowthCtx = createContext<GrowthCut>(GROWTH.main);
export const useGrowth = () => useContext(GrowthCtx);
export { BEAT, B, DB };
