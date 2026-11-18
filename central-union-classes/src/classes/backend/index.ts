/*
 * Backend entry point. The app only talks to what this file exports:
 *
 *   db        - document store (see types.ts for the API)
 *   user      - who is signed in: me(), profiles(ids)
 *   auth      - signIn({ name, email }), signOut(), isReturning(email)
 *   assets    - file uploads for PDFs and videos, or null to hide upload buttons
 *   assetUrl  - turns a stored asset id into a URL
 *   downloads - save({ filename, data }) for certificate downloads
 *
 * Today everything is stored in the browser. To move to a real database,
 * keep these exports and change their insides (see README).
 */
import { ADMIN_EMAILS } from "../constants";
import type { Me, Profile } from "../types";
import { localStore } from "./localStore";
import type { Assets, Downloads, Store } from "./types";

const SESSION_KEY = "cu-session";
const PEOPLE_KEY = "cu-people";

interface Session {
  id: string;
  name: string;
  email: string;
}
type People = Record<string, { name: string; email: string }>;

function read<T>(key: string, fallback: T): T {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null") as T | null;
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

/** A stable learner id from an email, so the same email brings back the same progress. */
function idFor(email: string): string {
  let h = 5381;
  const s = email.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return `u_${h.toString(36)}${s.length.toString(36)}`;
}

const PALETTE = ["#2447A6", "#18865A", "#B97A08", "#8E3BA8", "#C0392F", "#0F7C8C"];
function avatarFor(name: string, id: string): { url: string; color: string } {
  const initials = (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("")
    .replace(/[<&>"]/g, "");
  let n = 0;
  for (const c of id) n += c.charCodeAt(0);
  const color = PALETTE[n % PALETTE.length] ?? "#2447A6";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="${color}"/><text x="32" y="41" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
  return { url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, color };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const auth = {
  signIn({ name, email }: { name: string; email: string }): string {
    const clean = String(email || "")
      .trim()
      .toLowerCase();
    if (!EMAIL_RE.test(clean)) throw new Error("Enter a valid email address.");
    const id = idFor(clean);
    const people = read<People>(PEOPLE_KEY, {});
    const known = people[id];
    const finalName = String(name || "").trim() || known?.name || clean.split("@")[0] || clean;
    people[id] = { name: finalName, email: clean };
    write(PEOPLE_KEY, people);
    write(SESSION_KEY, { id, name: finalName, email: clean } satisfies Session);
    return id;
  },
  signOut(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  },
  isReturning(email: string): boolean {
    const clean = String(email || "")
      .trim()
      .toLowerCase();
    return !!read<People>(PEOPLE_KEY, {})[idFor(clean)];
  },
};

export const user = {
  async me(): Promise<Me | null> {
    const s = read<Session | null>(SESSION_KEY, null);
    if (!s) return null;
    const isAdmin = ADMIN_EMAILS.includes(s.email);
    const av = avatarFor(s.name, s.id);
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      avatarUrl: av.url,
      color: av.color,
      isOwner: isAdmin,
      canEdit: isAdmin,
    };
  },
  async profiles(ids: string[]): Promise<Record<string, Profile>> {
    const people = read<People>(PEOPLE_KEY, {});
    const me = read<Session | null>(SESSION_KEY, null);
    const out: Record<string, Profile> = {};
    for (const id of ids) {
      const p = people[id];
      const av = avatarFor(p?.name || "?", id);
      out[id] = {
        id,
        name: p?.name ?? "",
        email: p?.email ?? null,
        avatarUrl: av.url,
        color: av.color,
        isMe: me?.id === id,
      };
    }
    return out;
  },
};

export type UserApi = typeof user;

export const db: Store = localStore;

/** No file storage yet: upload buttons are hidden and lessons use YouTube or PDF links. */
export const assets: Assets | null = null;
export const assetUrl = (id: string): string => id;

export const downloads: Downloads = {
  async save({ filename, data }) {
    const blob = data instanceof Blob ? data : new Blob([data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return { status: "saved" };
  },
};
