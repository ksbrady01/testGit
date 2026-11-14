/*
 * Optional GoHighLevel sync for reminders.
 *
 * When VITE_GHL_WEBHOOK_URL is set, every change to a learner's progress is
 * sent (debounced) to that URL. Point it at a GoHighLevel "Inbound Webhook"
 * workflow trigger, then use the fields below to create/update the contact,
 * tag people with unfinished classes, and send reminder emails or texts on
 * the schedule each learner chose (nextReminderAt).
 *
 * Payload:
 *   { event, learnerId, email, name, xp, level, completedCount,
 *     incomplete: [{ courseId, title, pct, next, resumeUrl }],
 *     reminderFrequency, emailReminders, nextReminderAt, lastActive }
 */
import { levelFor } from "../lib/levels.js";

const URL_ = import.meta.env.VITE_GHL_WEBHOOK_URL;
const timers = new Map();

export function notifyLearnerChange(learnerId, learner) {
  if (!URL_ || !learner) return;
  clearTimeout(timers.get(learnerId));
  timers.set(learnerId, setTimeout(() => send(learnerId, learner), 4000));
}

function send(learnerId, l) {
  const base = location.origin + location.pathname;
  const lv = levelFor(l.xp || 0);
  const body = {
    event: "learner.progress",
    learnerId,
    email: l.email || null,
    name: l.name || "",
    xp: l.xp || 0,
    level: lv.n + " - " + lv.name,
    completedCount: Object.values(l.enrolled || {}).filter(e => e.completedAt).length,
    incomplete: (l.incomplete || []).map(x => ({ ...x, resumeUrl: base + "#learn-" + x.courseId })),
    reminderFrequency: l.reminders ? l.reminders.freq : null,
    emailReminders: !!(l.reminders && l.reminders.email),
    nextReminderAt: l.nextReminderAt || null,
    lastActive: l.lastActive || null
  };
  fetch(URL_, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true })
    .catch(() => { /* reminders are best-effort; the app keeps working offline */ });
}
