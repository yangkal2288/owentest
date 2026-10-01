import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

import { C, FONT } from "../../brand";
import { Logo } from "../meet/parts";
import type { PieceName } from "../meet/Piece";
import { SHADOW } from "../cinema/kit";
import { ChannelIcon } from "../meta/parts";
import { Bolt, Check, D, Moon } from "./Pins";

/**
 * Vallamo's story highlights (1080 x 1920): About, Demo and FAQ, every word from vallamo.com
 * (the about page, the product and clinic FAQs, the live demo). Each set ends on the same card:
 * book a demo. Content stays inside Instagram's story safe area (y 250 to 1650), so the
 * progress bar, the profile row and the reply bar never sit on anything.
 * Brand rules (DESIGN.md, BRAND.md): warm canvas, ink headlines, the clay Playfair italic accent,
 * real UI from the live demo, floor shadows.
 */
export type StoryProps = { set?: keyof typeof SETS; i?: number };
export type HighlightProps = { which?: "about" | "demo" | "faq" };

const M = 80; // side margin

// ---------------------------------------------------------------- type

/** The clay italic accent inside a headline. */
const A = ({ children }: { children: ReactNode }) => <span style={{ fontStyle: "italic", color: C.clay }}>{children}</span>;

function Title({ children, size = 100 }: { children: ReactNode; size?: number }) {
  return <div style={{ fontFamily: FONT.serif, fontWeight: 500, fontSize: size, lineHeight: 1.06, letterSpacing: "-0.028em", color: C.ink }}>{children}</div>;
}
function Body({ children, size = 38, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return <div style={{ marginTop: 34, fontFamily: FONT.sans, fontWeight: 500, fontSize: size, lineHeight: 1.42, letterSpacing: "-0.012em", color: C.ink2, ...style }}>{children}</div>;
}
const B = ({ children }: { children: ReactNode }) => <b style={{ fontWeight: 650, color: C.ink }}>{children}</b>;

// ---------------------------------------------------------------- pieces

const card: CSSProperties = { background: C.paper, border: `1.5px solid ${C.line}`, borderRadius: 30, boxShadow: SHADOW.card };

/** A live-demo capture, in the flow, with its floor shadow. */
function Shot({ name, k, radius = 0, lift = false, cropH, style }: { name: keyof typeof SHOTS; k: number; radius?: number; lift?: boolean; cropH?: number; style?: CSSProperties }) {
  const s = SHOTS[name];
  const h = (cropH ?? s.h) * k;
  const fade = cropH ? "linear-gradient(180deg, #000 78%, transparent 100%)" : undefined;
  return (
    <div style={{ position: "relative", flex: "none", width: s.w * k, height: h, ...style }}>
      {!cropH && <div style={{ position: "absolute", left: -30, right: -30, bottom: -34, height: 70, borderRadius: "50%", background: "rgba(44,37,32,.24)", filter: "blur(26px)" }} />}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: radius, boxShadow: lift && !cropH ? SHADOW.lift : undefined, maskImage: fade, WebkitMaskImage: fade }}>
        <Img src={staticFile(`ui/demo/${name}.png`)} style={{ position: "absolute", left: 0, top: 0, width: s.w * k, height: s.h * k }} />
      </div>
    </div>
  );
}
const SHOTS = { "phone-chat": D.phone, "phone-booked": D.phone, inbox: D.inbox, diary: D.diary, handover: D.handover, "handover-narrow": { w: 524, h: 268 } };

/** A pill, like the product's own chips. */
function Pill({ children, gold = false, size = 32, style }: { children: ReactNode; gold?: boolean; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, height: size * 2.3, padding: `0 ${size}px 0 ${size * 0.75}px`, borderRadius: 999, background: gold ? C.clay : C.paper, color: gold ? "#FFFFFF" : C.ink, border: gold ? "none" : `1.5px solid ${C.line}`, boxShadow: SHADOW.card, fontFamily: FONT.sans, fontWeight: 650, fontSize: size, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...style }}>
      {children}
    </div>
  );
}

const Tick = ({ size = 34 }: { size?: number }) => (
  <div style={{ flex: "none", width: size * 1.5, height: size * 1.5, borderRadius: "50%", background: C.clayWash, border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
  </div>
);

/** A list of short points, each with a clay tick. */
function Points({ items, size = 36 }: { items: ReactNode[]; size?: number }) {
  return (
    <div style={{ ...card, width: "100%", boxSizing: "border-box", padding: "18px 44px" }}>
      {items.map((it, j) => (
        <div key={j} style={{ display: "flex", alignItems: "center", gap: 28, padding: "26px 0", borderTop: j ? `1.5px solid ${C.lineSoft}` : "none", fontFamily: FONT.sans, fontWeight: 600, fontSize: size, lineHeight: 1.3, letterSpacing: "-0.01em", color: C.ink }}>
          <Tick />
          <div>{it}</div>
        </div>
      ))}
    </div>
  );
}

/** Numbered steps, as the website's "How it works". */
function Steps({ items }: { items: [string, string][] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26, width: "100%" }}>
      {items.map(([h, p], j) => (
        <div key={h} style={{ ...card, display: "flex", gap: 34, padding: "40px 44px" }}>
          <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontWeight: 500, fontSize: 64, lineHeight: 1, color: C.clay }}>{String(j + 1).padStart(2, "0")}</div>
          <div style={{ fontFamily: FONT.sans }}>
            <div style={{ fontWeight: 700, fontSize: 40, letterSpacing: "-0.02em", color: C.ink }}>{h}</div>
            <div style={{ marginTop: 10, fontWeight: 500, fontSize: 32, lineHeight: 1.4, color: C.ink2 }}>{p}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const Stars = ({ size = 34 }: { size?: number }) => <div style={{ fontSize: size, letterSpacing: "0.12em", color: C.clay }}>★★★★★</div>;

/** A client's words, as on vallamo.com. */
function Quote({ text, name, role, size = 40 }: { text: string; name: string; role: string; size?: number }) {
  return (
    <div style={{ ...card, padding: "48px 50px", width: "100%", boxSizing: "border-box" }}>
      <Stars />
      <div style={{ marginTop: 22, fontFamily: FONT.serif, fontWeight: 500, fontSize: size, lineHeight: 1.36, letterSpacing: "-0.01em", color: C.ink }}>“{text}”</div>
      <div style={{ marginTop: 28, fontFamily: FONT.sans, fontSize: 30 }}>
        <span style={{ fontWeight: 700, color: C.ink }}>{name}</span>
        <span style={{ fontWeight: 500, color: C.ink3 }}>{"  ·  "}{role}</span>
      </div>
    </div>
  );
}

const TEAM = [
  { photo: "alexander", name: "Alexander Hildebrant", role: "Co-founder", city: "Lugano, Switzerland" },
  { photo: "owen", name: "Owen Asher Wharton", role: "Co-founder", city: "Manchester, UK" },
  { photo: "anna", name: "Anna Fetisova", role: "Head of Marketing", city: "Berlin, Germany" },
  { photo: "sophia", name: "Sophia Irja Baxandall", role: "Software Engineering Consultant", city: "Helsinki, Finland" },
];
function Face({ photo, size, ring = 0 }: { photo: string; size: number; ring?: number }) {
  return <Img src={staticFile(`ui/team/${photo}-sq.jpg`)} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", boxShadow: ring ? `0 0 0 ${ring}px ${C.canvas}, ${SHADOW.card}` : SHADOW.card }} />;
}

/** The channel icons, in a row. */
function Channels({ size = 64 }: { size?: number }) {
  return (
    <div style={{ display: "flex", gap: size * 0.3 }}>
      {(["m-ch-web", "m-ch-wa", "m-ch-ig"] as PieceName[]).map((c) => <ChannelIcon key={c} card={c} size={size} />)}
    </div>
  );
}

// ---------------------------------------------------------------- the frame

type Story = { kicker: string; title: ReactNode; body?: ReactNode; art?: ReactNode; size?: number; artAlign?: "center" | "start" | "end" };

function Frame({ s }: { s: Story }) {
  return (
    <AbsoluteFill style={{ background: C.canvas, overflow: "hidden" }}>
      {/* kicker, with the wordmark opposite */}
      <div style={{ position: "absolute", left: M, right: M, top: 250, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT.sans, fontWeight: 650, fontSize: 26, letterSpacing: "0.16em", textTransform: "uppercase", color: C.clayDeep }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.clay }} />
          {s.kicker}
        </div>
        <Logo file="vallamo-wordmark" w={150} h={49} />
      </div>
      <div style={{ position: "absolute", left: M, right: M, top: 360, bottom: 270, display: "flex", flexDirection: "column" }}>
        <Title size={s.size}>{s.title}</Title>
        {s.body && <Body>{s.body}</Body>}
        {s.art && <div style={{ flex: 1, minHeight: 0, marginTop: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: s.artAlign ?? "center" }}>{s.art}</div>}
      </div>
    </AbsoluteFill>
  );
}

// ---------------------------------------------------------------- the last card of every set

function BookCard({ kicker, title, body }: { kicker: string; title: ReactNode; body: ReactNode }): Story {
  return {
    kicker,
    title,
    body,
    artAlign: "start",
    art: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginTop: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: 132, padding: "0 60px", borderRadius: 999, background: C.clay, boxShadow: SHADOW.lift, fontFamily: FONT.sans, fontWeight: 700, fontSize: 52, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
          Book a demo
          <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
        </div>
        <div style={{ marginTop: 34, fontFamily: FONT.sans, fontWeight: 600, fontSize: 32, color: C.ink3 }}>vallamo.com/book-a-demo</div>
        {/* room for Instagram's link sticker, pointed to */}
        <svg width={60} height={110} viewBox="0 0 60 110" style={{ marginTop: 40 }} fill="none" stroke={C.clay} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M30 4v96M10 80l20 22 20-22" />
        </svg>
      </div>
    ),
  };
}

// ---------------------------------------------------------------- About

const ABOUT: Story[] = [
  {
    kicker: "About us",
    title: <>Built by people who believed AI should <A>feel human.</A></>,
    body: <>Four people, four countries: Switzerland, the United Kingdom, Germany and Finland. <B>One product.</B></>,
    art: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex" }}>
          {TEAM.map((t, j) => <div key={t.photo} style={{ marginLeft: j ? -50 : 0 }}><Face photo={t.photo} size={230} ring={10} /></div>)}
        </div>
      </div>
    ),
  },
  {
    kicker: "Our story",
    title: <>It began with a conversation <A>between friends.</A></>,
    body: (
      <>
        We met studying for our Master’s degrees at <B>Warwick Business School</B>, with backgrounds across engineering, science and law.
        <div style={{ marginTop: 30 }}>AI was improving fast. Yet businesses were putting up basic chatbots that felt cold, robotic and disconnected from the customers they were meant to help.</div>
      </>
    ),
    art: (
      <div style={{ ...card, width: "100%", boxSizing: "border-box", padding: "56px 54px", borderLeft: `8px solid ${C.clay}` }}>
        <div style={{ fontFamily: FONT.serif, fontWeight: 500, fontSize: 62, lineHeight: 1.18, letterSpacing: "-0.02em", color: C.ink }}>
          The technology was improving. <A>The experience was not.</A>
        </div>
      </div>
    ),
  },
  {
    kicker: "Our story",
    title: <>We believed businesses <A>deserved better.</A></>,
    body: <>AI shouldn’t be another barrier between a business and its customers. It should create conversations that feel <B>natural, helpful and genuinely valuable.</B></>,
    art: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <Logo file="vallamo-mark" w={190} h={190} />
        <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontWeight: 500, fontSize: 64, color: C.clay }}>That belief became Vallamo.</div>
      </div>
    ),
  },
  {
    kicker: "The team",
    title: <>Who’s behind <A>Vallamo.</A></>,
    size: 96,
    art: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, width: "100%" }}>
        {TEAM.map((t) => (
          <div key={t.photo} style={{ ...card, padding: "40px 26px 36px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", fontFamily: FONT.sans }}>
            <Face photo={t.photo} size={210} />
            <div style={{ marginTop: 26, fontWeight: 700, fontSize: 32, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.2 }}>{t.name}</div>
            <div style={{ marginTop: 8, fontWeight: 600, fontSize: 25, color: C.clayDeep, lineHeight: 1.3 }}>{t.role}</div>
            <div style={{ marginTop: 6, fontWeight: 500, fontSize: 24, color: C.ink3 }}>{t.city}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    kicker: "The team",
    title: <>Nine languages, and <A>real people.</A></>,
    body: <>Between us, we work in nine languages. And we answer support emails ourselves: if something breaks, <B>you’re talking to us, not a ticket queue.</B></>,
    art: (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
        {["English", "Danish", "Italian", "German", "French", "Spanish", "Russian", "Ukrainian", "Finnish"].map((l) => <Pill key={l} size={42}>{l}</Pill>)}
      </div>
    ),
  },
  {
    kicker: "From our clients",
    title: <>In <A>their</A> words.</>,
    art: (
      <div style={{ display: "flex", flexDirection: "column", gap: 30, width: "100%" }}>
        <Quote size={38} text="Having Vallamo on our website has allowed me to focus on providing the best possible care to our clients, while ensuring new enquiries are responded to straight away." name="Francesca" role="Director, Enhance Lives" />
        <Quote size={38} text="As a solo owner, Vallamo has effectively become my receptionist. It helps me stay on top of Instagram enquiries, respond quickly and make sure new opportunities don’t slip through the cracks." name="Ella" role="Owner, JazzElla Dance" />
      </div>
    ),
  },
  {
    kicker: "What’s next",
    title: <>We’re not building AI to replace human connection. We’re building it to make every interaction <A>better.</A></>,
    size: 86,
    body: <><B>Voice AI is launching soon.</B> The same assistant that answers your website, WhatsApp and Instagram will pick up the phone too.</>,
    art: (
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <Channels size={120} />
        <div style={{ width: 120, height: 120, borderRadius: 30, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={64} height={64} viewBox="0 0 24 24" fill="#FFFFFF"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" /></svg>
        </div>
      </div>
    ),
  },
  BookCard({ kicker: "Meet us", title: <>Come and <A>meet the team.</A></>, body: <>Book a 15-minute demo with us. We’ll show you Vallamo live, <B>on your own business.</B></> }),
];

// ---------------------------------------------------------------- Demo

const DEMO: Story[] = [
  {
    kicker: "Live demo",
    title: <>Watch your front desk <A>work while you sleep.</A></>,
    body: <>A real enquiry at a clinic, start to finish. A message becomes a <B>paid booking</B>, before you’re back at your desk.</>,
    art: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <Pill size={40}><Moon />Sunday, 1:23am</Pill>
        {["A new enquiry", "Answered in seconds", "Deposit taken", "In the diary"].map((w, j) => (
          <div key={w} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <svg width={30} height={40} viewBox="0 0 30 40" fill="none" stroke={C.clay} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 3v32M5 26l10 10 10-10" /></svg>
            <div style={{ fontFamily: FONT.sans, fontWeight: 650, fontSize: 40, letterSpacing: "-0.015em", color: j === 3 ? C.clay : C.ink }}>{w}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    kicker: "Sunday, 1:23am",
    title: <>Answered <A>in seconds.</A></>,
    body: <>The price from your own list, the consultation included, and an opening offered. <B>While you were asleep.</B></>,
    art: (
      <div style={{ position: "relative" }}>
        <Shot name="phone-chat" k={1.45} />
        <Pill gold size={32} style={{ position: "absolute", right: -60, bottom: 90 }}><Bolt c="#FFFFFF" />Answered instantly</Pill>
      </div>
    ),
  },
  {
    kicker: "Sunday, 1:24am",
    title: <>Deposit paid. <A>Slot locked.</A></>,
    body: <>She pays the deposit in the chat, and the appointment is confirmed with a reminder on the way.</>,
    art: <Shot name="phone-booked" k={1.4} />,
  },
  {
    kicker: "Monday, 9am",
    title: <>Straight into <A>the diary.</A></>,
    body: <>It reads your real availability and books directly. <B>No double-booking, no second calendar.</B></>,
    art: <Shot name="diary" k={1.72} radius={34} lift style={{ marginBottom: 20 }} />,
  },
  {
    kicker: "Every channel",
    title: <>One inbox. <A>One calendar.</A></>,
    body: <>Website chat, WhatsApp and Instagram, all answered with the same knowledge, all in one place.</>,
    art: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ ...card, borderRadius: 28, padding: 18 }}><Channels size={66} /></div>
        <Shot name="inbox" k={1.6} cropH={400} radius={34} style={{ ...card }} />
      </div>
    ),
  },
  {
    kicker: "Human handover",
    title: <>Hands over <A>when it matters.</A></>,
    body: <>A medical question, a complaint, something sensitive: it goes <B>straight to your team</B>, conversation attached.</>,
    art: <Shot name="handover-narrow" k={1.72} radius={30} lift />,
  },
  {
    kicker: "The result",
    title: <>Booked in 90 seconds, <A>while you were closed.</A></>,
    art: (
      <div style={{ display: "flex", flexDirection: "column", gap: 26, width: "100%" }}>
        {[["90s", "Booked in"], ["£50", "Deposit secured"], ["£299", "Service value"]].map(([v, l]) => (
          <div key={l} style={{ ...card, display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "40px 54px" }}>
            <div style={{ fontFamily: FONT.serif, fontWeight: 500, fontSize: 120, lineHeight: 1, letterSpacing: "-0.03em", color: C.ink }}>{v}</div>
            <div style={{ fontFamily: FONT.sans, fontWeight: 650, fontSize: 30, letterSpacing: "0.12em", textTransform: "uppercase", color: C.clayDeep }}>{l}</div>
          </div>
        ))}
        <div style={{ marginTop: 14, textAlign: "center", fontFamily: FONT.sans, fontWeight: 500, fontSize: 34, color: C.ink2 }}>Try it yourself at <b style={{ color: C.ink }}>vallamo.com/demo</b></div>
      </div>
    ),
  },
  BookCard({ kicker: "See it live", title: <>See it on <A>your</A> business.</>, body: <>Book a 15-minute demo with the team and watch Vallamo answer <B>your real questions.</B></> }),
];

// ---------------------------------------------------------------- FAQ

const QS = [
  "Will clients know it’s an AI?",
  "Will it guess a price?",
  "What about medical questions?",
  "Does it work with my booking system?",
  "Will it replace my front desk?",
  "How long does setup take?",
  "What about my clients’ data?",
  "Does it speak other languages?",
];

const FAQ: Story[] = [
  {
    kicker: "FAQ",
    title: <>Your questions, <A>answered.</A></>,
    art: (
      <div style={{ ...card, width: "100%", boxSizing: "border-box", padding: "14px 44px" }}>
        {QS.map((q, j) => (
          <div key={q} style={{ display: "flex", alignItems: "center", gap: 26, padding: "24px 0", borderTop: j ? `1.5px solid ${C.lineSoft}` : "none", fontFamily: FONT.sans, fontWeight: 600, fontSize: 34, letterSpacing: "-0.01em", color: C.ink }}>
            <div style={{ width: 52, fontFamily: FONT.serif, fontStyle: "italic", fontWeight: 500, fontSize: 40, color: C.clay }}>{String(j + 1).padStart(2, "0")}</div>
            {q}
          </div>
        ))}
      </div>
    ),
  },
  {
    kicker: "FAQ 01",
    title: <>Will my clients know it’s <A>an AI?</A></>,
    body: <><B>Yes.</B> It’s upfront about what it is from the very first message, and a client can ask for a person at any point.</>,
    art: (
      <div style={{ ...card, width: "100%", boxSizing: "border-box", padding: "56px 54px", borderLeft: `8px solid ${C.clay}` }}>
        <div style={{ fontFamily: FONT.serif, fontWeight: 500, fontSize: 52, lineHeight: 1.25, letterSpacing: "-0.015em", color: C.ink }}>
          Clients care far more about a fast, accurate answer than who’s answering. <A>What they dislike is being misled.</A>
        </div>
      </div>
    ),
  },
  {
    kicker: "FAQ 02",
    title: <>Will it guess <A>a price?</A></>,
    body: <><B>Never.</B> It only answers from the knowledge you’ve approved. If a treatment or price isn’t in there, it says so and takes the enquiry.</>,
    art: (
      <div style={{ position: "relative" }}>
        <Shot name="phone-chat" k={1.42} />
        <Pill gold size={30} style={{ position: "absolute", left: -70, bottom: 110 }}><Check />From your approved prices</Pill>
      </div>
    ),
  },
  {
    kicker: "FAQ 03",
    title: <>What about <A>medical</A> questions?</>,
    body: <>It never answers them. Contraindications, sensitive skin, reactions and suitability go <B>straight to your team</B>, conversation attached. You choose the words that always trigger a handover.</>,
    art: <Shot name="handover-narrow" k={1.72} radius={30} lift />,
  },
  {
    kicker: "FAQ 04",
    title: <>Does it work with <A>my booking system?</A></>,
    body: <>It reads your real availability and books straight in, so there’s <B>no double-booking</B> and no second calendar.</>,
    art: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
          {["Cliniko", "Fresha", "Pabau", "Phorest", "Treatwell", "Google Calendar", "Outlook", "Cal.com", "Calendly", "Acuity", "Square"].map((p) => <Pill key={p} size={38}>{p}</Pill>)}
        </div>
        <div style={{ textAlign: "center", fontFamily: FONT.sans, fontWeight: 500, fontSize: 32, lineHeight: 1.4, color: C.ink3 }}>Not on the list? It takes the request<br />and shares your booking link instead.</div>
      </div>
    ),
  },
  {
    kicker: "FAQ 05",
    title: <>Will it replace <A>my front desk?</A></>,
    body: <><B>No.</B> It covers the hours your team can’t, and takes the repetitive questions off their plate. Anything sensitive or complex still goes to a person.</>,
    art: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <Pill size={46}><Moon />Evenings</Pill>
        <Pill size={46}><svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth={2.4} strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>Weekends</Pill>
        <Pill size={46}><svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth={2.4} strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>Mid-appointment</Pill>
      </div>
    ),
  },
  {
    kicker: "FAQ 06",
    title: <>How long does <A>setup</A> take?</>,
    body: <>Live in minutes, not months. <B>No onboarding project, nothing to build.</B></>,
    art: (
      <Steps
        items={[
          ["Enter your website", "Vallamo drafts what your front desk should know: services, prices, hours and policies."],
          ["Check what it learned", "Approve or correct anything before it goes live."],
          ["Go live everywhere", "Connect your calendar, paste one line of code, switch on WhatsApp and Instagram."],
        ]}
      />
    ),
  },
  {
    kicker: "FAQ 07",
    title: <>What about my <A>clients’ data?</A></>,
    art: (
      <Points
        items={[
          "Stored encrypted",
          "Isolated per business",
          <>Never used to train AI models</>,
          "Retention period you control",
          "Export or delete any client’s data",
          "Every change logged in an audit trail",
        ]}
      />
    ),
  },
  {
    kicker: "FAQ 08",
    title: <>Does it speak <A>other languages?</A></>,
    body: <><B>Yes.</B> It detects your client’s language and replies in it. You can review its greetings and key messages per language.</>,
    art: (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
        {["Hello", "Bonjour", "Hola", "Ciao", "Hallo", "Olá", "Hej", "Привіт"].map((w) => (
          <Pill key={w} size={44} style={{ fontFamily: FONT.serif, fontStyle: "italic", fontWeight: 500 }}>{w}</Pill>
        ))}
      </div>
    ),
  },
  BookCard({ kicker: "Still curious?", title: <>Ask us <A>face to face.</A></>, body: <>Book a 15-minute demo with the team. Bring your questions, and we’ll show you Vallamo <B>live on your business.</B></> }),
];

const SETS = { about: ABOUT, demo: DEMO, faq: FAQ };
export const STORY_COUNTS = { about: ABOUT.length, demo: DEMO.length, faq: FAQ.length };

export function Story({ set = "about", i = 0 }: StoryProps) {
  return <Frame s={SETS[set][i]} />;
}

// ---------------------------------------------------------------- highlight covers

/** The highlight cover: Instagram shows the middle as a circle, so the icon sits dead centre. */
export function Highlight({ which = "about" }: HighlightProps) {
  const icon = {
    about: <Logo file="vallamo-mark" w={330} h={330} />,
    demo: (
      <svg width={330} height={330} viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth={1.3} strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="2.6" />
        <path d="M10.4 9.2v5.6l4.6-2.8z" fill={C.clay} />
      </svg>
    ),
    faq: <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontWeight: 500, fontSize: 470, lineHeight: 1, color: C.clay, transform: "translateY(-20px)" }}>?</div>,
  }[which];
  return <AbsoluteFill style={{ background: C.canvas, alignItems: "center", justifyContent: "center" }}>{icon}</AbsoluteFill>;
}
