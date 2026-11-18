/*
 * The data API the app uses. The included implementation (localStore.ts)
 * saves in the browser; a server-backed version only has to match these types.
 */
export type DocData = Record<string, unknown>;

export interface SnapshotMeta {
  fromCache: boolean;
  hasPendingWrites: boolean;
}

export interface DocSnapshot {
  id: string;
  exists: boolean;
  data(): DocData | undefined;
  metadata: SnapshotMeta;
}

export interface QuerySnapshot {
  docs: DocSnapshot[];
  size: number;
  empty: boolean;
  metadata: SnapshotMeta;
}

export interface StoreError {
  code: string;
  message: string;
}

export type Unsubscribe = () => void;

export interface DocRef {
  id: string;
  path: string;
  get(): Promise<DocSnapshot>;
  set(data: DocData): Promise<void>;
  update(data: DocData): Promise<void>;
  delete(): Promise<void>;
  onSnapshot(next: (s: DocSnapshot) => void, error?: (e: StoreError) => void): Unsubscribe;
  collection(path: string): CollectionRef;
}

export type WhereOp = "==" | "!=" | "<" | "<=" | ">" | ">=" | "in" | "not-in" | "array-contains";

export interface Query {
  where(field: string, op: WhereOp, value: unknown): Query;
  orderBy(field: string, dir?: "asc" | "desc"): Query;
  limit(n: number): Query;
  get(): Promise<QuerySnapshot>;
  onSnapshot(next: (s: QuerySnapshot) => void, error?: (e: StoreError) => void): Unsubscribe;
}

export interface CollectionRef extends Query {
  path: string;
  doc(id?: string): DocRef;
  add(data: DocData): Promise<DocRef>;
}

export interface Store {
  doc(path: string): DocRef;
  collection(path: string): CollectionRef;
}

export interface Assets {
  upload(file: File): Promise<{ id: string; url: string }>;
}

export interface Downloads {
  save(req: { filename: string; data: Blob | string }): Promise<{ status: "saved" }>;
}
