import { useNavigate } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as backend from "../backend";
import type { Assets, Downloads, Store } from "../backend/types";
import { BADGES, DEFAULT_CATS, XP, levelFor } from "../constants";
import type {
  Course,
  CourseData,
  Learner,
  LeaderRow,
  Me,
  Modal,
  Progress,
  Toast,
  ToastKind,
} from "../types";
import {
  clone,
  confetti,
  dayKey,
  daysSince,
  freqDays,
  newLearner,
  normalizeLearner,
  nowIso,
  progressOf,
  uidGen,
} from "../utils";

export interface Services {
  db: Store;
  user: backend.UserApi;
  assets: Assets | null;
  downloads: Downloads;
  uid: string;
  me: Me;
  canEdit: boolean;
}

type Status = "loading" | "signedOut" | "ready";

export interface DueItem {
  c: Course;
  p: Progress;
  away: number;
  due: boolean;
}

export interface Actions {
  enroll(course: Course): void;
  openLesson(course: Course, lessonId: string): void;
  completeLesson(course: Course, lessonId: string): { finished: boolean };
  saveVideoPos(course: Course, lessonId: string, sec: number): void;
  setReminders(patch: Partial<Learner["reminders"]>): void;
  saveCourse(existing: Course | null, data: CourseData): Promise<boolean>;
  deleteCourse(course: Course): Promise<void>;
}

export interface AppState {
  status: Status;
  svc: Services | null;
  courses: Course[] | null;
  learner: Learner | null;
  board: LeaderRow[] | null;
  learnersAll: (Learner & { id: string })[] | null;
  loadNote: string;
  cats: string[];
  dueList: DueItem[];
  theme: "light" | "dark";
  toggleTheme(): void;
  toasts: Toast[];
  toast(text: string, icon?: string, kind?: ToastKind): void;
  modal: Modal | null;
  setModal(m: Modal | null): void;
  actions: Actions;
  canManage(c: Course | null | undefined): boolean;
}

const Ctx = createContext<AppState | null>(null);

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider>");
  return v;
}

/** Ready-state services; only call from components rendered once the app is ready. */
export function useServices(): Services {
  const { svc } = useApp();
  if (!svc) throw new Error("Services are not ready yet");
  return svc;
}

const asCourse = (id: string, d: unknown): Course => ({ ...(d as CourseData), id });

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  /* theme: the inline head script applies it before paint; state syncs after mount */
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "dark" || t === "light") setTheme(t);
    else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) setTheme("dark");
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("cu-theme", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((text: string, icon = "check", kind?: ToastKind) => {
    const id = Math.random();
    setToasts((t) => [...t, { id, text, icon, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const [modal, setModal] = useState<Modal | null>(null);

  /* services */
  const [status, setStatus] = useState<Status>("loading");
  const [svc, setSvc] = useState<Services | null>(null);
  useEffect(() => {
    let alive = true;
    void backend.user.me().then((me) => {
      if (!alive) return;
      if (!me) {
        setStatus("signedOut");
        return;
      }
      setSvc({
        db: backend.db,
        user: backend.user,
        assets: backend.assets,
        downloads: backend.downloads,
        uid: me.id,
        me,
        canEdit: me.canEdit,
      });
      setStatus("ready");
    });
    return () => {
      alive = false;
    };
  }, []);

  /* courses */
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loadNote, setLoadNote] = useState("");
  useEffect(() => {
    if (!svc) return;
    const t = setTimeout(
      () =>
        setLoadNote(
          "Classes can't be reached yet. Check your connection; this will update on its own.",
        ),
      10000,
    );
    const un = svc.db.collection("courses").onSnapshot(
      (s) => {
        if (!s.metadata.fromCache) {
          clearTimeout(t);
          setLoadNote("");
        }
        setCourses(s.docs.map((d) => asCourse(d.id, d.data())));
      },
      (e) => {
        clearTimeout(t);
        setLoadNote(`Classes couldn't load (${e.code}).`);
        setCourses((c) => c ?? []);
      },
    );
    return () => {
      clearTimeout(t);
      un();
    };
  }, [svc]);

  /* this learner */
  const [learner, setLearner] = useState<Learner | null>(null);
  const learnerRef = useRef<Learner | null>(null);
  useEffect(() => {
    learnerRef.current = learner;
  }, [learner]);
  useEffect(() => {
    if (!svc) return;
    return svc.db.doc(`learners/${svc.uid}`).onSnapshot(
      (s) => setLearner(normalizeLearner(s.exists ? (s.data() as Partial<Learner>) : null)),
      () => setLearner((l) => l ?? newLearner()),
    );
  }, [svc]);

  /* leaderboard */
  const [board, setBoard] = useState<LeaderRow[] | null>(null);
  useEffect(() => {
    if (!svc) return;
    return svc.db
      .collection("leaderboard")
      .orderBy("xp", "desc")
      .limit(25)
      .onSnapshot(
        (s) => setBoard(s.docs.map((d) => ({ ...(d.data() as Omit<LeaderRow, "id">), id: d.id }))),
        () => setBoard([]),
      );
  }, [svc]);

  /* all learners (editors only) */
  const [learnersAll, setLearnersAll] = useState<(Learner & { id: string })[] | null>(null);
  useEffect(() => {
    if (!svc?.canEdit) return;
    return svc.db.collection("learners").onSnapshot(
      (s) =>
        setLearnersAll(
          s.docs.map((d) => ({ ...normalizeLearner(d.data() as Partial<Learner>), id: d.id })),
        ),
      () => setLearnersAll([]),
    );
  }, [svc]);

  const coursesRef = useRef<Course[]>([]);
  useEffect(() => {
    coursesRef.current = courses ?? [];
  }, [courses]);
  const chain = useRef<Promise<void>>(Promise.resolve());
  const lbChain = useRef<Promise<void>>(Promise.resolve());
  const warned = useRef(false);

  /* ---- progress bookkeeping ---- */
  const finalize = useCallback(
    (l: Learner): Learner => {
      const byId = new Map(coursesRef.current.map((c) => [c.id, c]));
      const inc: NonNullable<Learner["incomplete"]> = [];
      let last: string | null = null;
      for (const [cid, e] of Object.entries(l.enrolled)) {
        if (e.updatedAt && (!last || e.updatedAt > last)) last = e.updatedAt;
        const c = byId.get(cid);
        if (!c || e.completedAt) continue;
        const p = progressOf(l, c);
        const nx = (c.lessons || []).find((x) => x.id === e.last);
        inc.push({
          courseId: cid,
          title: c.title,
          pct: p.pct,
          next: nx ? nx.title : "",
          updatedAt: e.updatedAt ?? null,
        });
      }
      l.incomplete = inc;
      l.lastActive = last ?? l.lastActive ?? null;
      const days = freqDays(l.reminders.freq);
      l.nextReminderAt =
        days && inc.length && l.lastActive
          ? new Date(new Date(l.lastActive).getTime() + days * 864e5).toISOString()
          : null;
      l.email = l.reminders.email && svc?.me.email ? svc.me.email : null;
      l.name = svc?.me.name ?? "";
      l.updatedAt = nowIso();
      return l;
    },
    [svc],
  );

  const commit = useCallback(
    (input: Learner, updateBoard: boolean) => {
      if (!svc) return;
      const l = finalize(input);
      learnerRef.current = l;
      setLearner(l);
      const snapshot = clone(l);
      chain.current = chain.current
        .then(() =>
          svc.db.doc(`learners/${svc.uid}`).set(snapshot as unknown as Record<string, unknown>),
        )
        .catch(() => {
          if (!warned.current) {
            warned.current = true;
            toast("Progress didn't save. We'll retry on your next step.", "x");
          }
        });
      if (updateBoard) {
        const completed = Object.values(l.enrolled).filter((e) => e.completedAt).length;
        const row = { xp: l.xp, completed, updatedAt: l.updatedAt };
        lbChain.current = lbChain.current
          .then(() => svc.db.doc(`leaderboard/${svc.uid}`).set(row))
          .catch(() => undefined);
      }
    },
    [svc, finalize, toast],
  );

  const award = useCallback(
    (l: Learner, levelBefore: number, badgesBefore: string[]) => {
      const cs = coursesRef.current;
      const byId = new Map(cs.map((c) => [c.id, c]));
      let lessons = 0;
      let done = 0;
      const cats = new Set<string>();
      for (const [cid, e] of Object.entries(l.enrolled)) {
        lessons += (e.done || []).length;
        if (e.completedAt) done++;
        const c = byId.get(cid);
        if ((e.done || []).length && c) cats.add(c.category);
      }
      const stats = {
        lessons,
        courses: done,
        bestStreak: l.streak.best || 0,
        cats: cats.size,
        created: cs.filter((c) => c.authorId && c.authorId === svc?.uid).length,
      };
      const earned = BADGES.filter((b) => b.test(stats)).map((b) => b.id);
      l.badges = Array.from(new Set([...badgesBefore, ...earned]));
      const fresh = l.badges.filter((b) => !badgesBefore.includes(b));
      return { fresh, levelUp: levelFor(l.xp).idx > levelBefore };
    },
    [svc],
  );

  const touchStreak = (l: Learner): number => {
    const today = dayKey();
    if (l.streak.last === today) return 0;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    l.streak.count = l.streak.last === dayKey(y) ? l.streak.count + 1 : 1;
    l.streak.best = Math.max(l.streak.best || 0, l.streak.count);
    l.streak.last = today;
    l.xp += XP.streakDay;
    return XP.streakDay;
  };

  const announceBadges = useCallback(
    (fresh: string[], delay = 600) => {
      fresh.forEach((id, k) =>
        setTimeout(
          () => {
            const b = BADGES.find((x) => x.id === id);
            if (b) toast(`Badge earned: ${b.name}`, "award", "xp");
          },
          delay + k * 500,
        ),
      );
    },
    [toast],
  );

  const current = () => clone(learnerRef.current ?? newLearner());

  const actions: Actions = {
    enroll(course) {
      const l = current();
      if (l.enrolled[course.id]) return;
      l.enrolled[course.id] = {
        startedAt: nowIso(),
        updatedAt: nowIso(),
        done: [],
        last: course.lessons[0]?.id ?? null,
      };
      commit(l, false);
    },
    openLesson(course, lessonId) {
      const l = current();
      const e = l.enrolled[course.id];
      if (!e || e.last === lessonId) return;
      e.last = lessonId;
      e.updatedAt = nowIso();
      commit(l, false);
    },
    completeLesson(course, lessonId) {
      const l = current();
      const before = levelFor(l.xp).idx;
      const bb = l.badges.slice();
      const e = l.enrolled[course.id] ?? { startedAt: nowIso(), done: [] };
      let gained = 0;
      if (!(e.done || []).includes(lessonId)) {
        e.done = [...(e.done || []), lessonId];
        l.xp += XP.lesson;
        gained += XP.lesson;
      }
      gained += touchStreak(l);
      const ids = (course.lessons || []).map((x) => x.id);
      let finished = false;
      if (ids.length && ids.every((i) => e.done.includes(i)) && !e.completedAt) {
        e.completedAt = nowIso();
        e.certId = `CU-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
        l.xp += XP.course;
        gained += XP.course;
        finished = true;
      }
      const i0 = ids.indexOf(lessonId);
      e.last =
        ids.slice(i0 + 1).find((i) => !e.done.includes(i)) ??
        ids.find((i) => !e.done.includes(i)) ??
        lessonId;
      if (e.vpos && e.vpos[lessonId] != null) {
        const vpos = { ...e.vpos };
        delete vpos[lessonId];
        e.vpos = vpos;
      }
      e.updatedAt = nowIso();
      l.enrolled[course.id] = e;
      const { fresh, levelUp } = award(l, before, bb);
      commit(l, true);
      if (gained) toast(`+${gained} XP`, "bolt", "xp");
      announceBadges(fresh);
      if (finished) {
        confetti();
        setModal({ kind: "complete", course, levelUp: levelUp ? levelFor(l.xp) : null });
      } else if (levelUp) {
        confetti();
        setModal({ kind: "level", lv: levelFor(l.xp) });
      }
      return { finished };
    },
    saveVideoPos(course, lessonId, sec) {
      const l = current();
      const e = l.enrolled[course.id];
      if (!e) return;
      e.vpos = { ...(e.vpos ?? {}), [lessonId]: sec };
      e.last = lessonId;
      e.updatedAt = nowIso();
      commit(l, false);
    },
    setReminders(patch) {
      const l = current();
      l.reminders = { ...l.reminders, ...patch };
      commit(l, false);
      toast("Reminder settings saved", "bell");
    },
    async saveCourse(existing, data) {
      if (!svc) {
        toast("Sign in to publish classes.", "x");
        return false;
      }
      const id = existing ? existing.id : uidGen("c");
      const { id: _drop, ...rest } = { ...(existing ?? {}), ...data, id };
      const doc: CourseData = { ...rest, updatedAt: nowIso() };
      if (!existing) {
        doc.createdAt = nowIso();
        doc.authorId = svc.uid;
      }
      try {
        await svc.db.doc(`courses/${id}`).set(doc as unknown as Record<string, unknown>);
      } catch {
        return false;
      }
      if (!existing) {
        const l = current();
        const before = levelFor(l.xp).idx;
        const bb = l.badges.slice();
        l.xp += XP.create;
        coursesRef.current = [...coursesRef.current, { ...doc, id }];
        const { fresh, levelUp } = award(l, before, bb);
        commit(l, true);
        toast(`Class published · +${XP.create} XP`, "check", "xp");
        announceBadges(fresh, 700);
        if (levelUp) {
          confetti();
          setModal({ kind: "level", lv: levelFor(l.xp) });
        }
      } else {
        toast("Changes saved", "check");
      }
      void navigate({ to: "/classes/$courseId", params: { courseId: id } });
      return true;
    },
    async deleteCourse(course) {
      if (!svc) return;
      try {
        await svc.db.doc(`courses/${course.id}`).delete();
        toast("Class deleted", "trash");
        void navigate({ to: "/" });
      } catch {
        toast("Couldn't delete this class.", "x");
      }
    },
  };

  /* in-app reminders */
  const dueList = useMemo<DueItem[]>(() => {
    if (!learner || !courses) return [];
    const days = freqDays(learner.reminders.freq);
    return courses
      .map((c) => ({ c, p: progressOf(learner, c) }))
      .filter((x) => x.p.enrolled && !x.p.completed && (x.c.lessons || []).length)
      .map((x) => {
        const away = daysSince(x.p.e?.updatedAt);
        return { ...x, away, due: days ? away >= days : false };
      })
      .sort((a, b) => (b.due ? 1 : 0) - (a.due ? 1 : 0) || b.away - a.away);
  }, [learner, courses]);

  const nudged = useRef(false);
  useEffect(() => {
    if (nudged.current) return;
    const d = dueList.find((x) => x.due);
    if (!d) return;
    nudged.current = true;
    const t = setTimeout(
      () =>
        toast(`Reminder: ${d.c.title} is ${d.p.pct}% done. Pick up where you left off!`, "bell"),
      1200,
    );
    return () => clearTimeout(t);
  }, [dueList, toast]);

  const cats = useMemo(
    () =>
      Array.from(
        new Set([...DEFAULT_CATS, ...(courses ?? []).map((c) => c.category).filter(Boolean)]),
      ),
    [courses],
  );

  const canManage = useCallback(
    (c: Course | null | undefined) =>
      !!c && !!svc && (svc.canEdit || (!!c.authorId && c.authorId === svc.uid)),
    [svc],
  );

  const value: AppState = {
    status,
    svc,
    courses,
    learner,
    board,
    learnersAll,
    loadNote,
    cats,
    dueList,
    theme,
    toggleTheme,
    toasts,
    toast,
    modal,
    setModal,
    actions,
    canManage,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
