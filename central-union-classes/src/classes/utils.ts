import { FREQS } from "./constants";
import type { Course, CourseData, Learner, Lesson, LessonType, Progress } from "./types";

export const nowIso = () => new Date().toISOString();
export const dayKey = (d: Date = new Date()) => d.toLocaleDateString("en-CA");
export const uidGen = (prefix: string) =>
  prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const clone = <T>(o: T): T => JSON.parse(JSON.stringify(o)) as T;
export const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export function daysSince(iso: string | null | undefined): number {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / 864e5;
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function relDays(iso: string | null | undefined): string {
  const d = Math.floor(daysSince(iso));
  if (!isFinite(d)) return "never";
  if (d < 1) return "today";
  if (d < 2) return "yesterday";
  return `${d} days ago`;
}

export function fmtTime(sec: number | undefined): string {
  const t = Math.floor(sec || 0);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

export function coverBg(hue: number | undefined): string {
  const h = Number(hue) || 222;
  return `radial-gradient(90% 120% at 90% 10%, hsl(${h + 35} 80% 64% / .85) 0%, transparent 55%), linear-gradient(135deg, hsl(${h} 58% 34%) 0%, hsl(${h + 18} 62% 48%) 100%)`;
}

/** The 11-character video id from any common YouTube link, or null. */
export function ytId(url: string | undefined): string | null {
  if (!url) return null;
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m?.[1] ?? null;
}

export function lessonMinutes(l: Pick<Lesson, "minutes" | "type">): number {
  return Number(l.minutes) || (l.type === "video" ? 10 : l.type === "pdf" ? 15 : 8);
}

export function courseMinutes(c: Pick<CourseData, "lessons">): number {
  return (c.lessons || []).reduce((a, l) => a + lessonMinutes(l), 0);
}

export function progressOf(learner: Learner | null, course: Course): Progress {
  const e = learner?.enrolled[course.id];
  const total = (course.lessons || []).length;
  if (!e) return { enrolled: false, done: 0, total, pct: 0, completed: false, e: undefined };
  const ids = new Set((course.lessons || []).map((l) => l.id));
  const done = (e.done || []).filter((id) => ids.has(id)).length;
  return {
    enrolled: true,
    done,
    total,
    pct: total ? Math.round((done / total) * 100) : 0,
    completed: !!e.completedAt,
    e,
  };
}

export function newLearner(): Learner {
  return {
    xp: 0,
    enrolled: {},
    streak: { count: 0, best: 0, last: null },
    reminders: { freq: "3days", email: true },
    badges: [],
    createdAt: nowIso(),
  };
}

export function normalizeLearner(d: Partial<Learner> | null | undefined): Learner {
  const base = newLearner();
  const l: Learner = { ...base, ...(d ?? {}) };
  l.enrolled = d?.enrolled ?? {};
  l.streak = { ...base.streak, ...(d?.streak ?? {}) };
  l.reminders = { ...base.reminders, ...(d?.reminders ?? {}) };
  l.badges = d?.badges ?? [];
  l.xp = Number(d?.xp) || 0;
  return l;
}

export function freqDays(id: string): number | null {
  const f = FREQS.find((x) => x.id === id);
  return f ? f.days : 3;
}

export function blankLesson(type: LessonType = "text"): Lesson {
  return {
    id: uidGen("l"),
    title: "",
    type,
    minutes: "",
    body: "",
    url: "",
    assetId: "",
    fileName: "",
  };
}

/** A short celebratory confetti burst on the page's #confetti canvas. */
export function confetti(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.getElementById("confetti") as HTMLCanvasElement | null;
  const ctx = cv?.getContext("2d");
  if (!cv || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const W = (cv.width = window.innerWidth * dpr);
  const H = (cv.height = window.innerHeight * dpr);
  cv.style.width = `${window.innerWidth}px`;
  cv.style.height = `${window.innerHeight}px`;
  const cols = ["#2447A6", "#E8A92A", "#3A63D6", "#18865A", "#F6C66A", "#E3342F", "#86A3FF"];
  const ps = Array.from({ length: 170 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.3,
    y: H * 0.35,
    vx: (Math.random() - 0.5) * 26 * dpr,
    vy: (-Math.random() * 22 - 8) * dpr,
    r: (4 + Math.random() * 6) * dpr,
    c: cols[Math.floor(Math.random() * cols.length)] ?? "#E8A92A",
    a: Math.random() * 6,
    va: (Math.random() - 0.5) * 0.4,
  }));
  const t0 = performance.now();
  const frame = (t: number) => {
    const el = t - t0;
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.vy += 0.6 * dpr;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.va;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.globalAlpha = Math.max(0, 1 - el / 3200);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 3, p.r, p.r * 0.6);
      ctx.restore();
    }
    if (el < 3200) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  };
  requestAnimationFrame(frame);
}
