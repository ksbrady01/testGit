/** Shared validation for every inquiry form (client + server). */

export type InquiryType = "contact" | "seo-evaluation" | "website-evaluation" | "careers" | "live-concepts";

export type InquiryPayload = {
  type: InquiryType;
  name: string;
  email: string;
  company?: string;
  website?: string;
  phone?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  keywords?: string;
  location?: string;
  goals?: string[];
  /** spam traps */
  hp?: string;
  startedAt?: number;
};

export type FieldErrors = Partial<Record<keyof InquiryPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeUrl(value: string) {
  const v = value.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function isUrl(value: string) {
  try {
    const u = new URL(normalizeUrl(value));
    return !!u.hostname && u.hostname.includes(".");
  } catch {
    return false;
  }
}

export function validateInquiry(p: Partial<InquiryPayload>): FieldErrors {
  const e: FieldErrors = {};
  const name = (p.name || "").trim();
  const email = (p.email || "").trim();
  if (name.length < 2) e.name = "Please tell us your name.";
  if (name.length > 120) e.name = "That name is a little long.";
  if (!EMAIL_RE.test(email)) e.email = "Please enter a valid email address.";

  const needsWebsite = p.type === "seo-evaluation" || p.type === "website-evaluation";
  if (needsWebsite && !(p.website || "").trim()) e.website = "We need your website address to evaluate it.";
  if ((p.website || "").trim() && !isUrl(p.website!)) e.website = "That doesn’t look like a website address.";

  if (p.type === "contact") {
    if (!p.service) e.service = "Choose what you’re interested in.";
    if ((p.message || "").trim().length < 10) e.message = "A sentence or two about your project helps a lot.";
  }
  if (p.type === "careers" && (p.message || "").trim().length < 10) e.message = "Tell us a little about yourself.";
  if ((p.message || "").length > 5000) e.message = "Please keep it under 5,000 characters.";
  return e;
}

export const inquiryLabels: Record<InquiryType, string> = {
  contact: "New project inquiry",
  "seo-evaluation": "SEO evaluation request",
  "website-evaluation": "Website evaluation request",
  careers: "Careers inquiry",
  "live-concepts": "Live concepts inquiry",
};
