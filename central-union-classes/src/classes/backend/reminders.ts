/*
 * Sends learner progress to the app's own /api/reminders server route, which
 * forwards it to GoHighLevel (GHL_REMINDER_WEBHOOK_URL secret) so a workflow
 * can email or text reminders. Debounced so a burst of clicks sends once.
 */
import { levelFor } from "../constants";
import type { DocData } from "./types";
import type { Learner } from "../types";

const timers = new Map<string, ReturnType<typeof setTimeout>>();

export function notifyLearnerChange(learnerId: string, data: DocData | undefined): void {
  if (typeof window === "undefined" || !data) return;
  const prev = timers.get(learnerId);
  if (prev) clearTimeout(prev);
  timers.set(
    learnerId,
    setTimeout(() => send(learnerId, data as unknown as Learner), 4000),
  );
}

function send(learnerId: string, l: Learner) {
  const origin = window.location.origin;
  const lv = levelFor(l.xp || 0);
  const body = {
    event: "learner.progress",
    learnerId,
    email: l.email ?? null,
    name: l.name ?? "",
    xp: l.xp || 0,
    level: `${lv.n} - ${lv.name}`,
    completedCount: Object.values(l.enrolled || {}).filter((e) => e.completedAt).length,
    incomplete: (l.incomplete || []).map((x) => ({
      ...x,
      resumeUrl: `${origin}/learn/${x.courseId}`,
    })),
    reminderFrequency: l.reminders?.freq ?? null,
    emailReminders: !!l.reminders?.email,
    nextReminderAt: l.nextReminderAt ?? null,
    lastActive: l.lastActive ?? null,
  };
  fetch("/api/reminders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    /* reminders are best-effort; the app keeps working offline */
  });
}
