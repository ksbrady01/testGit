/*
 * Local backend: a small document store saved in the browser (localStorage).
 *
 * It implements the same API the app calls everywhere:
 *   db.doc("courses/abc").get() / set() / update() / delete() / onSnapshot()
 *   db.collection("courses").orderBy("xp", "desc").limit(25).onSnapshot()
 *
 * Data saved here stays in one browser on one device. To share classes and
 * progress across devices, replace this file with a server-backed version that
 * keeps the same API (see README: "Connecting a real database").
 */
import seed from "../content/seed.json";
import { notifyLearnerChange } from "./webhook.js";

const DB_KEY = "cu-db-v1";

function load() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* storage unavailable */ }
  const docs = {};
  for (const c of seed.courses) {
    const { id, ...data } = c;
    docs["courses/" + id] = data;
  }
  return { docs };
}

const state = load();
function persist() {
  try { localStorage.setItem(DB_KEY, JSON.stringify(state)); } catch (e) { /* quota or private mode */ }
}
persist();

const listeners = new Set(); // { kind: "doc"|"query", path, fire }
function emit(changedPath) {
  for (const l of listeners) {
    if (l.kind === "doc" && l.path === changedPath) l.fire();
    if (l.kind === "query" && parentOf(changedPath) === l.path) l.fire();
  }
}
function parentOf(path) { return path.split("/").slice(0, -1).join("/"); }
function lastSeg(path) { const p = path.split("/"); return p[p.length - 1]; }

const META = Object.freeze({ fromCache: false, hasPendingWrites: false });
function snap(path) {
  const d = state.docs[path];
  return { id: lastSeg(path), exists: d !== undefined, data: () => (d === undefined ? undefined : JSON.parse(JSON.stringify(d))), metadata: META };
}
function deepMerge(a, b) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = v && typeof v === "object" && !Array.isArray(v) && a[k] && typeof a[k] === "object" && !Array.isArray(a[k]) ? deepMerge(a[k], v) : v;
  }
  return out;
}

function docRef(path) {
  const segs = path.split("/");
  if (segs.length % 2 !== 0) throw new TypeError("Document paths need an even number of segments: " + path);
  const write = (data) => {
    state.docs[path] = JSON.parse(JSON.stringify(data));
    persist(); emit(path);
    if (segs[0] === "learners") notifyLearnerChange(lastSeg(path), state.docs[path]);
  };
  return {
    id: lastSeg(path), path,
    async get() { return snap(path); },
    async set(data) { write(data); },
    async update(data) {
      if (state.docs[path] === undefined) throw { code: "invalid_argument", message: "Document does not exist" };
      write(deepMerge(state.docs[path], data));
    },
    async delete() { delete state.docs[path]; persist(); emit(path); },
    onSnapshot(next) {
      const l = { kind: "doc", path, fire: () => next(snap(path)) };
      listeners.add(l); setTimeout(l.fire, 0);
      return () => listeners.delete(l);
    },
    collection(sub) { return collectionRef(path + "/" + sub); }
  };
}

function queryRef(path, opts) {
  const run = () => {
    let docs = Object.keys(state.docs).filter(p => parentOf(p) === path).sort().map(snap);
    for (const [field, op, value] of opts.where) {
      docs = docs.filter(d => {
        const v = d.data()[field];
        switch (op) {
          case "==": return v === value; case "!=": return v !== value;
          case "<": return v < value; case "<=": return v <= value;
          case ">": return v > value; case ">=": return v >= value;
          case "in": return value.includes(v); case "not-in": return !value.includes(v);
          case "array-contains": return Array.isArray(v) && v.includes(value);
          default: return true;
        }
      });
    }
    if (opts.orderBy) {
      const [f, dir] = opts.orderBy;
      docs.sort((a, b) => {
        const x = a.data()[f], y = b.data()[f];
        if (x === undefined) return 1; if (y === undefined) return -1;
        return (x < y ? -1 : x > y ? 1 : 0) * (dir === "desc" ? -1 : 1);
      });
    }
    if (opts.limit) docs = docs.slice(0, opts.limit);
    return { docs, size: docs.length, empty: !docs.length, metadata: META, docChanges: () => [] };
  };
  return {
    where: (f, op, v) => queryRef(path, { ...opts, where: opts.where.concat([[f, op, v]]) }),
    orderBy: (f, dir = "asc") => queryRef(path, { ...opts, orderBy: [f, dir] }),
    limit: (n) => queryRef(path, { ...opts, limit: n }),
    async get() { return run(); },
    onSnapshot(next) {
      const l = { kind: "query", path, fire: () => next(run()) };
      listeners.add(l); setTimeout(l.fire, 0);
      return () => listeners.delete(l);
    }
  };
}

function collectionRef(path) {
  if (path.split("/").length % 2 !== 1) throw new TypeError("Collection paths need an odd number of segments: " + path);
  const q = queryRef(path, { where: [] });
  return {
    ...q, path,
    doc: (id) => docRef(path + "/" + (id || Math.random().toString(36).slice(2, 12))),
    async add(data) { const r = docRef(path + "/" + Math.random().toString(36).slice(2, 12)); await r.set(data); return r; }
  };
}

export const db = {
  doc: docRef,
  collection: collectionRef
};
