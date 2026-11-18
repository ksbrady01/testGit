/*
 * Browser document store (localStorage), seeded with the starter classes.
 *
 * Data stays in one browser on one device. To share classes and progress
 * across devices, replace this with a server-backed store that implements the
 * same `Store` type (see README: "Connecting a real database").
 */
import { seedCourses } from "../content/seed";
import { notifyLearnerChange } from "./reminders";
import type {
  CollectionRef,
  DocData,
  DocRef,
  DocSnapshot,
  Query,
  QuerySnapshot,
  SnapshotMeta,
  Store,
  WhereOp,
} from "./types";

const DB_KEY = "cu-db-v1";

interface State {
  docs: Record<string, DocData>;
}

let state: State | null = null;

function getState(): State {
  if (state) return state;
  let loaded: State | null = null;
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) loaded = JSON.parse(raw) as State;
  } catch {
    /* storage unavailable */
  }
  if (!loaded) {
    const docs: Record<string, DocData> = {};
    for (const c of seedCourses) {
      const { id, ...data } = c;
      docs[`courses/${id}`] = data as unknown as DocData;
    }
    loaded = { docs };
  }
  state = loaded;
  persist();
  return state;
}

function persist() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode */
  }
}

interface Listener {
  kind: "doc" | "query";
  path: string;
  fire: () => void;
}
const listeners = new Set<Listener>();

const parentOf = (path: string) => path.split("/").slice(0, -1).join("/");
const lastSeg = (path: string) => path.split("/").pop() ?? "";

function emit(changedPath: string) {
  for (const l of listeners) {
    if (l.kind === "doc" && l.path === changedPath) l.fire();
    if (l.kind === "query" && parentOf(changedPath) === l.path) l.fire();
  }
}

const META: SnapshotMeta = Object.freeze({ fromCache: false, hasPendingWrites: false });

function snap(path: string): DocSnapshot {
  const d = getState().docs[path];
  return {
    id: lastSeg(path),
    exists: d !== undefined,
    data: () => (d === undefined ? undefined : (JSON.parse(JSON.stringify(d)) as DocData)),
    metadata: META,
  };
}

const isObj = (v: unknown): v is DocData => !!v && typeof v === "object" && !Array.isArray(v);

function deepMerge(a: DocData, b: DocData): DocData {
  const out: DocData = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const prev = a[k];
    out[k] = isObj(v) && isObj(prev) ? deepMerge(prev, v) : v;
  }
  return out;
}

function compare(x: unknown, y: unknown): number {
  if (typeof x === "number" && typeof y === "number") return x - y;
  return String(x).localeCompare(String(y));
}

function matches(v: unknown, op: WhereOp, value: unknown): boolean {
  switch (op) {
    case "==":
      return v === value;
    case "!=":
      return v !== value;
    case "<":
      return compare(v, value) < 0;
    case "<=":
      return compare(v, value) <= 0;
    case ">":
      return compare(v, value) > 0;
    case ">=":
      return compare(v, value) >= 0;
    case "in":
      return Array.isArray(value) && value.includes(v);
    case "not-in":
      return Array.isArray(value) && !value.includes(v);
    case "array-contains":
      return Array.isArray(v) && v.includes(value);
  }
}

function docRef(path: string): DocRef {
  const segs = path.split("/");
  if (segs.length % 2 !== 0)
    throw new TypeError(`Document paths need an even number of segments: ${path}`);
  const write = (data: DocData) => {
    const s = getState();
    s.docs[path] = JSON.parse(JSON.stringify(data)) as DocData;
    persist();
    emit(path);
    if (segs[0] === "learners") notifyLearnerChange(lastSeg(path), s.docs[path]);
  };
  return {
    id: lastSeg(path),
    path,
    async get() {
      return snap(path);
    },
    async set(data) {
      write(data);
    },
    async update(data) {
      const prev = getState().docs[path];
      if (prev === undefined)
        throw { code: "invalid_argument", message: "Document does not exist" };
      write(deepMerge(prev, data));
    },
    async delete() {
      delete getState().docs[path];
      persist();
      emit(path);
    },
    onSnapshot(next) {
      const l: Listener = { kind: "doc", path, fire: () => next(snap(path)) };
      listeners.add(l);
      setTimeout(l.fire, 0);
      return () => {
        listeners.delete(l);
      };
    },
    collection(sub) {
      return collectionRef(`${path}/${sub}`);
    },
  };
}

interface QueryOpts {
  where: [string, WhereOp, unknown][];
  orderBy?: [string, "asc" | "desc"] | undefined;
  limit?: number | undefined;
}

function queryRef(path: string, opts: QueryOpts): Query {
  const run = (): QuerySnapshot => {
    let docs = Object.keys(getState().docs)
      .filter((p) => parentOf(p) === path)
      .sort()
      .map(snap);
    for (const [field, op, value] of opts.where) {
      docs = docs.filter((d) => matches(d.data()?.[field], op, value));
    }
    if (opts.orderBy) {
      const [f, dir] = opts.orderBy;
      docs.sort((a, b) => {
        const x = a.data()?.[f];
        const y = b.data()?.[f];
        if (x === undefined) return 1;
        if (y === undefined) return -1;
        return compare(x, y) * (dir === "desc" ? -1 : 1);
      });
    }
    if (opts.limit) docs = docs.slice(0, opts.limit);
    return { docs, size: docs.length, empty: !docs.length, metadata: META };
  };
  return {
    where: (f, op, v) => queryRef(path, { ...opts, where: [...opts.where, [f, op, v]] }),
    orderBy: (f, dir = "asc") => queryRef(path, { ...opts, orderBy: [f, dir] }),
    limit: (n) => queryRef(path, { ...opts, limit: n }),
    async get() {
      return run();
    },
    onSnapshot(next) {
      const l: Listener = { kind: "query", path, fire: () => next(run()) };
      listeners.add(l);
      setTimeout(l.fire, 0);
      return () => {
        listeners.delete(l);
      };
    },
  };
}

const randomId = () => Math.random().toString(36).slice(2, 12);

function collectionRef(path: string): CollectionRef {
  if (path.split("/").length % 2 !== 1) {
    throw new TypeError(`Collection paths need an odd number of segments: ${path}`);
  }
  const q = queryRef(path, { where: [] });
  return {
    ...q,
    path,
    doc: (id) => docRef(`${path}/${id || randomId()}`),
    async add(data) {
      const r = docRef(`${path}/${randomId()}`);
      await r.set(data);
      return r;
    },
  };
}

export const localStore: Store = {
  doc: docRef,
  collection: collectionRef,
};
