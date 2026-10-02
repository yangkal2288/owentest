/**
 * The founder ad (Owen on camera, the product in between), ~30 s, 9:16. This file times the
 * product shots: script scenes 2 to 4 as one continuous clip, cut in between Owen's two pieces
 * to camera. Seconds from the clip's first frame. No VO is recorded yet: each scene is long
 * enough for Owen's line at a natural pace, and the reply plays at real speed.
 */

/**
 * Seconds from Ellie's message landing to Vallamo's reply. Played at real speed and shown on
 * screen ("Replied in 6 seconds"). Set it to the measured reply time before the ad runs.
 */
export const REPLY = 6;

/** Her message has landed; the reply timer starts. */
const SENT = 0.6;

export const SHOTS = {
  /** Scene 2: the enquiry arrives at 9:04pm, Isla types, and replies with the price and two slots. */
  chip: 0,
  head: 0.1,
  u1: 0.3,
  sent: SENT,
  dots: SENT + 0.45,
  i1: SENT + REPLY,
  timerOut: SENT + REPLY + 2.3,
  /** Scene 3: "2pm please." The diary rises, the booking flies into Thursday 2pm, the confirmation goes out. */
  u2: SENT + REPLY + 2.7,
  diary: SENT + REPLY + 3.3,
  lift: SENT + REPLY + 4.2,
  land: SENT + REPLY + 4.95,
  i2: SENT + REPLY + 5.5,
  /** Scene 4: the booking stays; Instagram, WhatsApp, Website land above it. */
  channels: SENT + REPLY + 7.9,
  length: SENT + REPLY + 11.4,
};

/** The end card, and Owen's lower third (an overlay for the editor). */
export const END_LENGTH = 3.6;
export const LOWER_THIRD_LENGTH = 4;

/** The preview: Owen's pieces to camera as slates, around the shots and the end card. */
export const PREVIEW = {
  intro: 5.6,
  outro: 4.6,
};
export const previewLength = () => PREVIEW.intro + SHOTS.length + PREVIEW.outro + END_LENGTH;
