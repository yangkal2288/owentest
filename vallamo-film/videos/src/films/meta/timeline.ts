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
