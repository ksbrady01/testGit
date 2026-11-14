// Server-only: inquiry validation, spam protection and delivery (Resend email and/or webhook).
import { inquiryLabels, normalizeUrl, validateInquiry, type InquiryPayload, type InquiryType } from "../lib/inquiry";

const TYPES: InquiryType[] = ["contact", "seo-evaluation", "website-evaluation", "careers", "live-concepts"];
const MIN_FILL_MS = 2500; // humans take longer than this to fill a form
const RATE_LIMIT = 5; // submissions per IP per window
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

const clean = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function handleInquiry(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const type = TYPES.includes(body.type as InquiryType) ? (body.type as InquiryType) : "contact";
  const payload: InquiryPayload = {
    type,
    name: clean(body.name, 120) || "",
    email: clean(body.email, 200) || "",
    company: clean(body.company, 200),
    website: clean(body.website, 300),
    phone: clean(body.phone, 40),
    service: clean(body.service, 120),
    budget: clean(body.budget, 60),
    timeline: clean(body.timeline, 60),
    message: clean(body.message, 5000),
    keywords: clean(body.keywords, 500),
    location: clean(body.location, 200),
    goals: Array.isArray(body.goals) ? (body.goals as unknown[]).filter((g) => typeof g === "string").slice(0, 12).map((g) => (g as string).slice(0, 80)) : undefined,
  };

  // --- Spam prevention: honeypot + minimum fill time + rate limit ---
  const hp = clean(body.hp, 200);
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  if (hp || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    // Pretend success so bots learn nothing.
    return Response.json({ ok: true });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
  }

  const errors = validateInquiry(payload);
  if (Object.keys(errors).length) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }
  if (payload.website) payload.website = normalizeUrl(payload.website);

  const record = { ...payload, receivedAt: new Date().toISOString() };
  const subject = `${inquiryLabels[type]} — ${payload.name}${payload.company ? ` (${payload.company})` : ""}`;

  const resendKey = env("RESEND_API_KEY");
  const toEmail = env("INQUIRY_TO_EMAIL");
  const webhook = env("INQUIRY_WEBHOOK_URL");
  let delivered = false;
  const failures: string[] = [];

  if (resendKey && toEmail) {
    const rows = Object.entries(record)
      .filter(([k, v]) => v !== undefined && v !== "" && k !== "type")
      .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#6e4127;font:12px monospace;text-transform:uppercase">${escapeHtml(k)}</td><td style="padding:6px 12px">${escapeHtml(Array.isArray(v) ? v.join(", ") : String(v)).replace(/\n/g, "<br>")}</td></tr>`)
      .join("");
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: env("INQUIRY_FROM_EMAIL") || "CleverHouse Website <onboarding@resend.dev>",
          to: toEmail.split(",").map((s) => s.trim()),
          reply_to: payload.email,
          subject,
          html: `<h2 style="font-family:sans-serif">${escapeHtml(subject)}</h2><table>${rows}</table>`,
        }),
      });
      if (r.ok) delivered = true;
      else failures.push(`resend:${r.status}`);
    } catch {
      failures.push("resend:network");
    }
  }

  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, ...record }),
      });
      if (r.ok) delivered = true;
      else failures.push(`webhook:${r.status}`);
    } catch {
      failures.push("webhook:network");
    }
  }

  if (!delivered && import.meta.env.DEV) {
    // Development fallback: log the submission so the form is fully testable without secrets.
    console.info(`[inquiry] ${subject} (no delivery configured; dev only)\n${JSON.stringify(record, null, 2)}`);
    delivered = true;
  }

  if (!delivered) {
    console.error("[inquiry] delivery failed", failures.join(", ") || "no delivery configured");
    return Response.json(
      { ok: false, error: "We couldn’t send your message just now. Please email us directly instead." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
