import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { CourseCard } from "../components/CourseBits";
import { Bar, Cover, Ring, Skeletons } from "../components/ui";
import { BRAND, ORG, XP, levelFor } from "../constants";
import { useApp } from "../state/AppProvider";
import { progressOf } from "../utils";

export function ExplorePage() {
  const { courses, learner, cats, loadNote, svc } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [tag, setTag] = useState<string | null>(null);
  const lv = levelFor(learner?.xp ?? 0);

  const inProg = useMemo(
    () =>
      (courses ?? [])
        .map((c) => ({ c, p: progressOf(learner, c) }))
        .filter((x) => x.p.enrolled && !x.p.completed)
        .sort((a, b) =>
          String(b.p.e?.updatedAt ?? "").localeCompare(String(a.p.e?.updatedAt ?? "")),
        ),
    [courses, learner],
  );
  const allTags = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of courses ?? []) for (const t of c.tags || []) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .map((x) => x[0])
      .slice(0, 14);
  }, [courses]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (courses ?? [])
      .filter(
        (c) =>
          (cat === "All" || c.category === cat) &&
          (!tag || (c.tags || []).includes(tag)) &&
          (!s ||
            `${c.title} ${c.description} ${(c.tags || []).join(" ")} ${c.category}`
              .toLowerCase()
              .includes(s)),
      )
      .sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));
  }, [courses, q, cat, tag]);

  const completed = learner
    ? Object.values(learner.enrolled).filter((e) => e.completedAt).length
    : 0;
  const first = (svc?.me.name ?? "").split(" ")[0];
  const resume = inProg[0];
  const total = (courses ?? []).length;

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-main rise">
          <div>
            <div className="eyebrow" style={{ color: "inherit", opacity: 0.8 }}>
              {ORG}
            </div>
            <h1 style={{ marginTop: "8px" }}>
              {first ? `Welcome back, ${first}.` : "Grow in faith, one lesson at a time."}
            </h1>
            <p>
              Classes for every season of life. Pick up where you left off, earn certificates, and
              level up as you learn.
            </p>
            <div className="hero-stats">
              <div>
                <b className="num">{total}</b>
                <span>classes</span>
              </div>
              <div>
                <b className="num">{learner?.xp ?? 0}</b>
                <span>your XP</span>
              </div>
              <div>
                <b className="num">{completed}</b>
                <span>completed</span>
              </div>
              <div>
                <b className="num">{learner?.streak.count ?? 0}</b>
                <span>day streak</span>
              </div>
            </div>
          </div>
          <img className="hero-logo" src={BRAND.logo} alt="Central Union Church of Christ logo" />
        </div>
        <div className="card resume rise" style={{ animationDelay: "90ms" }}>
          {resume ? (
            <>
              <div className="row between">
                <span className="eyebrow">Continue learning</span>
                <span className="lvl-pill">
                  Lv {lv.n} · {lv.name}
                </span>
              </div>
              <Cover course={resume.c} className="cover resume-cover" height="88px" />
              <h3>{resume.c.title}</h3>
              <div className="small muted">
                Next up:{" "}
                {resume.c.lessons.find((l) => l.id === resume.p.e?.last)?.title ??
                  "your next lesson"}
              </div>
              <Bar pct={resume.p.pct} />
              <div className="row between">
                <span className="tiny muted num">
                  {resume.p.done} of {resume.p.total} lessons · {resume.p.pct}%
                </span>
                <Link
                  className="btn btn-primary btn-sm"
                  to="/learn/$courseId"
                  params={{ courseId: resume.c.id }}
                >
                  Resume
                  <Icon n="right" s={15} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="row between">
                <span className="eyebrow">Your level</span>
                <span className="lvl-pill">Lv {lv.n}</span>
              </div>
              <div className="row" style={{ gap: "18px" }}>
                <Ring pct={lv.pct} size={96}>
                  <div>
                    <b style={{ fontFamily: "var(--font-display)", fontSize: "22px" }}>{lv.n}</b>
                    <div className="tiny muted">level</div>
                  </div>
                </Ring>
                <div className="stack" style={{ gap: "4px" }}>
                  <h3>{lv.name}</h3>
                  <span className="small muted">
                    {lv.next ? `${lv.toNext} XP to ${lv.next.name}` : "Top level reached"}
                  </span>
                </div>
              </div>
              <p className="small muted">
                Start any class below. Each lesson earns {XP.lesson} XP and finishing a class earns{" "}
                {XP.course} XP plus a certificate.
              </p>
            </>
          )}
        </div>
      </section>

      <div className="section-h">
        <div>
          <div className="eyebrow">Catalog</div>
          <h2>Explore classes</h2>
        </div>
        <Link className="btn btn-ghost btn-sm" to="/create">
          <Icon n="plus" s={16} />
          Add a class
        </Link>
      </div>
      {loadNote ? <div className="banner warn">{loadNote}</div> : null}
      <div className="toolbar">
        <label className="search">
          <Icon n="search" s={18} />
          <input
            id="search"
            placeholder="Search classes, topics or tags"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search classes"
          />
        </label>
      </div>
      <div className="chips" style={{ marginBottom: "10px" }}>
        {["All", ...cats].map((c) => (
          <button
            type="button"
            key={c}
            className={`chip${cat === c ? " on" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {allTags.length ? (
        <div className="chips" style={{ marginBottom: "20px", gap: "6px" }}>
          <span className="tiny muted" style={{ alignSelf: "center", marginRight: "4px" }}>
            Tags
          </span>
          {allTags.map((t) => (
            <button
              type="button"
              key={t}
              className={`tag${tag === t ? " on" : ""}`}
              onClick={() => setTag(tag === t ? null : t)}
            >
              #{t}
            </button>
          ))}
        </div>
      ) : null}
      {courses === null ? (
        <Skeletons />
      ) : list.length ? (
        <div className="grid">
          {list.map((c, i) => (
            <CourseCard key={c.id} course={c} learner={learner} i={i} onTag={setTag} />
          ))}
        </div>
      ) : (
        <div className="card empty">
          <div className="ico-wrap">
            <Icon n="book" s={28} />
          </div>
          <h3>{total ? "No classes match" : "No classes yet"}</h3>
          <p className="muted">
            {total
              ? "Try another search, category or tag."
              : "Create the first class for your church family."}
          </p>
          {total ? (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setQ("");
                setCat("All");
                setTag(null);
              }}
            >
              Clear filters
            </button>
          ) : (
            <Link className="btn btn-primary" to="/create">
              Create a class
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
