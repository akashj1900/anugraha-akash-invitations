// Approved invitation details. All displayed event context comes from here.
import { CLOSING_NAME } from './edition';
export const COUPLE = {
  bride: { label: "The Bride", name: "Anugraha", tagline: "Grace in every step" },
  groom: { label: "The Groom", name: "Akash", tagline: "Joy in every beat" },
};

export const INVITATION_NAME = `${COUPLE.bride.name} & ${COUPLE.groom.name}`;
export const MONOGRAM = "A ∞ A";

const mapsSearch = (venue: string, address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${address}, India`)}`;

export const EVENTS = [
  {
    id: "marriage",
    title: "Marriage",
    tagline: "With blessings, our forever begins",
    when: "Sunday, 25 October 2026",
    time: "Muhurtham · 7:30 AM – 9:00 AM",
    startISO: "2026-10-25T07:30:00+05:30",
    endISO: "2026-10-25T09:00:00+05:30",
    venue: "Mohana Mahal",
    address: "Kelambakkam, Chennai – 603103",
    city: "Chennai",
    shortDate: "25 October 2026",
    mapsUrl: mapsSearch("Mohana Mahal", "Kelambakkam, Chennai 603103"),
  },
  {
    id: "reception",
    title: "Reception",
    tagline: "An evening to celebrate together",
    when: "Sunday, 1 November 2026",
    time: "6:00 PM onwards",
    startISO: "2026-11-01T18:00:00+05:30",
    endISO: null,
    venue: "Adhirtaa Banquet Hall",
    address: "Dombivli East, Maharashtra – 421203",
    city: "Dombivli East, Maharashtra",
    shortDate: "1 November 2026",
    mapsUrl: mapsSearch("Adhirtaa Banquet Hall", "Dombivli East, Maharashtra 421203"),
  },
] as const;

export const MARRIAGE = EVENTS[0];
export const RECEPTION = EVENTS[1];
// Countdown to the START of the approved Muhurtham, explicitly in IST.
export const WEDDING_DATE_ISO = MARRIAGE.startISO;

export const HERO = {
  dateLocation: `${MARRIAGE.shortDate} · ${MARRIAGE.city}`,
  brideName: COUPLE.bride.name,
  groomName: COUPLE.groom.name,
  joiner: "&",
  subtitle: "Two souls · Seven vows · One forever",
  scrollHint: "Scroll to unfold our celebration",
};

export const COUNTDOWN = {
  eyebrow: "The sacred day draws near",
  title: "Until forever begins",
  dateLabel: MARRIAGE.when,
  muhurtham: `${MARRIAGE.time} IST`,
  venueLabel: `${MARRIAGE.venue} · ${MARRIAGE.city}`,
};

export const FILM = {
  eyebrow: "The Wedding Film",
  uri: "https://customer-assets-4nw71qhi.emergentagent.net/job_invite-craft-hub-1/artifacts/271e3a6c72c147f9_InShot_20261009_141349784.mp4",
  // Complete original supplied MP4: 1920×1080, 20.574s; no edits or transcoding.
  aspectRatio: 1920 / 1080,
};

export const RSVP = {
  eyebrow: "Together with our families",
  title: "Celebrate with us",
  note: "Your presence will make our celebrations even more special.",
  locations: "Chennai, Tamilnadu & Dombivli East, Maharashtra",
};

export const CLOSING = {
  eyebrow: "WITH LOVE",
  farewell: "We cannot wait to celebrate with you",
  compliments: { intro: "Best compliments from", names: CLOSING_NAME },
};