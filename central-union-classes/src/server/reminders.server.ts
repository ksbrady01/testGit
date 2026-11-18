// Server-only: forwards learner progress to a GoHighLevel Inbound Webhook workflow
// (GHL_REMINDER_WEBHOOK_URL secret) so it can email or text reminders.

const RATE_LIMIT = 30; // updates per IP per window
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

/** Reads a server secret without depending on Node's type definitions. */
const env = (key: string): string | undefined =>
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[key];

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : null);
const num = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : 0);

export async function handleReminder(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many updates." }, { status: 429 });
  }

  const email = str(body["email"], 200);
  const incomplete = Array.isArray(body["incomplete"])
    ? (body["incomplete"] as unknown[]).slice(0, 50).map((x) => {
        const r = (x ?? {}) as Record<string, unknown>;
        return {
          courseId: str(r["courseId"], 80),
          title: str(r["title"], 200),
          pct: num(r["pct"]),
          next: str(r["next"], 200),
          resumeUrl: str(r["resumeUrl"], 500),
        };
      })
    : [];

  const payload = {
    event: "learner.progress",
    learnerId: str(body["learnerId"], 80),
    email: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null,
    name: str(body["name"], 120) ?? "",
    xp: num(body["xp"]),
    level: str(body["level"], 60),
    completedCount: num(body["completedCount"]),
    incomplete,
    hasIncomplete: incomplete.length > 0,
    reminderFrequency: str(body["reminderFrequency"], 20),
    emailReminders: body["emailReminders"] === true,
    nextReminderAt: str(body["nextReminderAt"], 40),
    lastActive: str(body["lastActive"], 40),
    receivedAt: new Date().toISOString(),
  };

  const webhook = env("GHL_REMINDER_WEBHOOK_URL");
  if (!webhook) {
    if (import.meta.env.DEV) console.info("[reminders] no webhook configured (dev only)", payload);
    return Response.json({ ok: true, delivered: false });
  }
  try {
    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      console.error("[reminders] webhook failed", r.status);
      return Response.json({ ok: false, delivered: false }, { status: 502 });
    }
  } catch {
    console.error("[reminders] webhook unreachable");
    return Response.json({ ok: false, delivered: false }, { status: 502 });
  }
  return Response.json({ ok: true, delivered: true });
}
