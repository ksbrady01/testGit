/*
 * Backend entry point. The app only talks to what this file exports:
 *
 *   db        - document store (see localBackend.js for the API)
 *   user      - who is signed in: me(), profiles(ids)
 *   auth      - signIn({ name, email }), signOut()
 *   assets    - file uploads for PDFs and videos, or null to hide upload buttons
 *   assetUrl  - turns a stored asset id into a URL
 *   downloads - save({ filename, data }) for certificate downloads
 *
 * Today everything is stored in the browser. To move to a real database,
 * keep these exports and change their insides (see README).
 */
import { db } from "./localBackend.js";
import { ADMIN_EMAILS } from "../config.js";

const SESSION_KEY = "cu-session";
const PEOPLE_KEY = "cu-people";

function read(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || "null"); return v == null ? fallback : v; } catch (e) { return fallback; }
}
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ } }

/* A stable learner id from an email address, so signing in with the same email brings back the same progress. */
function idFor(email) {
  let h = 5381;
  const s = email.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return "u_" + h.toString(36) + s.length.toString(36);
}

const PALETTE = ["#2447A6", "#18865A", "#B97A08", "#8E3BA8", "#C0392F", "#0F7C8C"];
function avatarFor(name, id) {
  const initials = (name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join("");
  let n = 0; for (const c of id) n += c.charCodeAt(0);
  const color = PALETTE[n % PALETTE.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="${color}"/><text x="32" y="41" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#fff" text-anchor="middle">${initials.replace(/[<&>]/g, "")}</text></svg>`;
  return { url: "data:image/svg+xml;utf8," + encodeURIComponent(svg), color };
}

function profileOf(id) {
  const people = read(PEOPLE_KEY, {});
  const p = people[id];
  const name = p ? p.name : "";
  const av = avatarFor(name || "?", id);
  return { id, name, email: p ? p.email : null, avatarUrl: av.url, color: av.color, isMe: !!(read(SESSION_KEY, null) && read(SESSION_KEY, null).id === id), guest: false };
}

export const auth = {
  signIn({ name, email }) {
    const clean = String(email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) throw new Error("Enter a valid email address.");
    const id = idFor(clean);
    const people = read(PEOPLE_KEY, {});
    const known = people[id];
    const finalName = String(name || "").trim() || (known && known.name) || clean.split("@")[0];
    people[id] = { name: finalName, email: clean };
    write(PEOPLE_KEY, people);
    write(SESSION_KEY, { id, name: finalName, email: clean });
    return id;
  },
  signOut() { try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ } },
  isReturning(email) {
    const clean = String(email || "").trim().toLowerCase();
    return !!read(PEOPLE_KEY, {})[idFor(clean)];
  }
};

export const user = {
  async me() {
    const s = read(SESSION_KEY, null);
    if (!s) return null;
    const isAdmin = ADMIN_EMAILS.includes(s.email);
    const av = avatarFor(s.name, s.id);
    return { id: s.id, name: s.name, email: s.email, avatarUrl: av.url, color: av.color, isOwner: isAdmin, canEdit: isAdmin };
  },
  async profiles(ids) {
    const out = {};
    for (const id of [].concat(ids)) out[id] = profileOf(id);
    return out;
  }
};

/* No file storage yet: upload buttons are hidden and lessons use YouTube or PDF links. */
export const assets = null;
export const assetUrl = (id) => id;

export const downloads = {
  async save({ filename, data }) {
    const blob = data instanceof Blob ? data : new Blob([data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return { status: "saved" };
  }
};

export { db };
