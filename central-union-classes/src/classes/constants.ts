import type { FreqId, Level } from "./types";

export const ORG = "Central Union Church of Christ";

/** XP awarded for each kind of progress. */
export const XP = { lesson: 20, course: 100, streakDay: 5, create: 50 } as const;

export const LEVELS = [
  { name: "Newcomer", xp: 0 },
  { name: "Seeker", xp: 100 },
  { name: "Learner", xp: 250 },
  { name: "Disciple", xp: 500 },
  { name: "Servant", xp: 900 },
  { name: "Steward", xp: 1400 },
  { name: "Shepherd", xp: 2100 },
  { name: "Elder", xp: 3000 },
] as const;

export function levelFor(xp: number): Level {
  let idx = 0;
  LEVELS.forEach((l, i) => {
    if (xp >= l.xp) idx = i;
  });
  const cur = LEVELS[idx] ?? LEVELS[0];
  const next = LEVELS[idx + 1];
  const pct = next ? Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100) : 100;
  return {
    idx,
    n: idx + 1,
    name: cur.name,
    next: next ? { name: next.name, xp: next.xp } : undefined,
    pct,
    toNext: next ? next.xp - xp : 0,
  };
}

export const DEFAULT_CATS = [
  "Church Life",
  "Bible Study",
  "Faith Foundations",
  "Serving & Volunteering",
  "Leadership",
  "Family & Youth",
];

export const CAT_ICON: Record<string, string> = {
  "Church Life": "home",
  "Bible Study": "book",
  "Faith Foundations": "flame",
  "Serving & Volunteering": "heart",
  Leadership: "users",
  "Family & Youth": "sprout",
};

export const HUES = [222, 200, 168, 140, 38, 18, 350, 280];

export const FREQS: { id: FreqId; label: string; days: number | null }[] = [
  { id: "daily", label: "Daily", days: 1 },
  { id: "3days", label: "Every 3 days", days: 3 },
  { id: "weekly", label: "Weekly", days: 7 },
  { id: "off", label: "Off", days: null },
];

export interface BadgeStats {
  lessons: number;
  courses: number;
  bestStreak: number;
  cats: number;
  created: number;
}

export const BADGES: {
  id: string;
  name: string;
  desc: string;
  icon: string;
  test: (s: BadgeStats) => boolean;
}[] = [
  {
    id: "first-step",
    name: "First Step",
    desc: "Finish your first lesson",
    icon: "check",
    test: (s) => s.lessons >= 1,
  },
  {
    id: "finisher",
    name: "Finisher",
    desc: "Complete a class",
    icon: "award",
    test: (s) => s.courses >= 1,
  },
  {
    id: "devoted",
    name: "Devoted",
    desc: "Complete 3 classes",
    icon: "star",
    test: (s) => s.courses >= 3,
  },
  {
    id: "streak-3",
    name: "On a Roll",
    desc: "Learn 3 days in a row",
    icon: "flame",
    test: (s) => s.bestStreak >= 3,
  },
  {
    id: "streak-7",
    name: "Faithful Week",
    desc: "Learn 7 days in a row",
    icon: "flame",
    test: (s) => s.bestStreak >= 7,
  },
  {
    id: "explorer",
    name: "Explorer",
    desc: "Learn in 3 categories",
    icon: "compass",
    test: (s) => s.cats >= 3,
  },
  {
    id: "teacher",
    name: "Teacher",
    desc: "Publish a class",
    icon: "users",
    test: (s) => s.created >= 1,
  },
];

/** Brand assets served from /public/brand. */
export const BRAND = {
  logo: "/brand/logo.png", // full logo, for dark backgrounds
  logoDeep: "/brand/logo-deep.png", // deep-gold logo, for light backgrounds (certificates)
  emblem: "/brand/emblem.png", // cross + globe + Bible mark (header, favicon)
} as const;

/** Emails with editor rights (edit/delete any class, Learners page). */
export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

/** Public URL used in "Share class" links. Defaults to the current site. */
export const APP_URL = import.meta.env.VITE_APP_URL ?? "";
