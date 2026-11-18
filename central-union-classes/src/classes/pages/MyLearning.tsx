import { Link } from "@tanstack/react-router";
import * as backend from "../backend";
import { Icon } from "../components/Icon";
import { Bar, Cover, Ring } from "../components/ui";
import { BADGES, FREQS, levelFor } from "../constants";
import { useApp } from "../state/AppProvider";
import { fmtDate, progressOf, relDays } from "../utils";

export function MyLearningPage() {
  const { courses, learner, actions, svc } = useApp();
  if (!learner || !courses) return null;
  const lv = levelFor(learner.xp);
  const rows = courses.map((c) => ({ c, p: progressOf(learner, c) })).filter((x) => x.p.enrolled);
  const inProg = rows
    .filter((x) => !x.p.completed)
    .sort((a, b) => String(b.p.e?.updatedAt ?? "").localeCompare(String(a.p.e?.updatedAt ?? "")));
  const done = rows
    .filter((x) => x.p.completed)
    .sort((a, b) =>
      String(b.p.e?.completedAt ?? "").localeCompare(String(a.p.e?.completedAt ?? "")),
    );
  const freq = learner.reminders.freq;
  const email = svc?.me.email ?? null;
  const signOut = () => {
    backend.auth.signOut();
    window.location.assign("/");
  };
  const stats: [string, number, string][] = [
    ["flame", learner.streak.count, "day streak"],
    ["book", inProg.length, "in progress"],
    ["check", done.length, "completed"],
    ["award", done.length, "certificates"],
  ];

  return (
    <div className="page">
      <div className="section-h" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">Your dashboard</div>
          <h1>My learning</h1>
        </div>
        <div className="row" style={{ gap: "10px" }}>
          {email ? (
            <span className="small muted row" style={{ gap: "6px" }}>
              <Icon n="mail" s={15} />
              Signed in as {email}
            </span>
          ) : null}
          <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
      <div className="ml-top">
        <div className="card level-card rise">
          <Ring pct={lv.pct} size={128} stroke={12}>
            <div>
              <div className="tiny muted">LEVEL</div>
              <b style={{ fontFamily: "var(--font-display)", fontSize: "38px", lineHeight: 1 }}>
                {lv.n}
              </b>
            </div>
          </Ring>
          <div className="stack" style={{ gap: "6px", flex: 1, minWidth: "200px" }}>
            <h2>{lv.name}</h2>
            <div className="num">
              <b style={{ fontSize: "20px" }}>{learner.xp}</b>{" "}
              <span className="muted">XP total</span>
            </div>
            <Bar pct={lv.pct} kind="gold" />
            <span className="small muted">
              {lv.next
                ? `${lv.toNext} XP until ${lv.next.name} (Level ${lv.n + 1})`
                : "You've reached the top level. Well done!"}
            </span>
          </div>
        </div>
        <div className="stat-grid">
          {stats.map(([ic, v, l], i) => (
            <div key={l} className="card stat rise" style={{ animationDelay: `${(i + 1) * 60}ms` }}>
              <b className="num">{v}</b>
              <span>
                <Icon n={ic} s={15} />
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-h">
        <div>
          <div className="eyebrow">Pick up where you left off</div>
          <h2>In progress</h2>
        </div>
      </div>
      {inProg.length ? (
        <div className="card">
          {inProg.map(({ c, p }, i) => {
            const next = c.lessons.find((l) => l.id === p.e?.last);
            return (
              <div
                key={c.id}
                className="prog-row rise"
                style={{
                  borderTop: i ? "1px solid var(--line)" : "0",
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <Cover course={c} className="prog-cover" height="72px" />
                <div className="stack" style={{ gap: "6px", minWidth: 0 }}>
                  <Link
                    to="/classes/$courseId"
                    params={{ courseId: c.id }}
                    style={{ color: "var(--ink)", textDecoration: "none" }}
                  >
                    <h3>{c.title}</h3>
                  </Link>
                  <div className="tiny muted">
                    Next: {next ? next.title : "—"} · last active {relDays(p.e?.updatedAt)}
                  </div>
                  <div className="row" style={{ gap: "10px" }}>
                    <div style={{ flex: 1, minWidth: "120px" }}>
                      <Bar pct={p.pct} />
                    </div>
                    <span className="tiny muted num">
                      {p.done}/{p.total}
                    </span>
                  </div>
                </div>
                <Link
                  className="btn btn-primary btn-sm act"
                  to="/learn/$courseId"
                  params={{ courseId: c.id }}
                >
                  Resume
                  <Icon n="right" s={15} />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card empty">
          <div className="ico-wrap">
            <Icon n="mylearn" s={28} />
          </div>
          <h3>Nothing in progress</h3>
          <p className="muted">
            Start a class and it will show up here so you can come back any time.
          </p>
          <Link className="btn btn-primary" to="/">
            Browse classes
          </Link>
        </div>
      )}

      <div className="section-h">
        <div>
          <div className="eyebrow">Certificates</div>
          <h2>Completed classes</h2>
        </div>
      </div>
      {done.length ? (
        <div className="grid">
          {done.map(({ c, p }, i) => (
            <div
              key={c.id}
              className="card rise"
              style={{ overflow: "hidden", animationDelay: `${i * 50}ms` }}
            >
              <Cover course={c} height="90px">
                <span className="cover-done">
                  <Icon n="check" s={13} w={3} />
                  Completed
                </span>
              </Cover>
              <div className="cbody">
                <h3>{c.title}</h3>
                <span className="tiny muted">Finished {fmtDate(p.e?.completedAt)}</span>
                <Link
                  className="btn btn-gold btn-sm"
                  to="/certificate/$courseId"
                  params={{ courseId: c.id }}
                >
                  <Icon n="award" s={15} />
                  Certificate
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card pad muted small">Finish a class to earn your first certificate.</div>
      )}

      <div className="section-h">
        <div>
          <div className="eyebrow">Achievements</div>
          <h2>Badges</h2>
        </div>
        <span className="small muted num">
          {learner.badges.length} of {BADGES.length} earned
        </span>
      </div>
      <div className="badges">
        {BADGES.map((b, i) => {
          const got = learner.badges.includes(b.id);
          return (
            <div
              key={b.id}
              className={`card badge rise${got ? " got" : ""}`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="medal">
                <Icon n={b.icon} s={24} />
              </div>
              <b className="small">{b.name}</b>
              <span className="tiny muted">{b.desc}</span>
            </div>
          );
        })}
      </div>

      <div className="section-h">
        <div>
          <div className="eyebrow">Notifications</div>
          <h2>Reminder settings</h2>
        </div>
      </div>
      <div className="card pad stack" style={{ gap: "16px" }}>
        <div className="row between">
          <div>
            <b>How often should we nudge you?</b>
            <div className="small muted">
              When a class is unfinished, you'll get a reminder after this much time away.
            </div>
          </div>
          <div className="seg" role="group" aria-label="Reminder frequency">
            {FREQS.map((f) => (
              <button
                type="button"
                key={f.id}
                className={freq === f.id ? "on" : ""}
                onClick={() => actions.setReminders({ freq: f.id })}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="row between">
          <div>
            <b>Email reminders</b>
            <div className="small muted">
              {email
                ? `Sent to ${email} with a link straight back to your lesson.`
                : "Add an email to your account to get reminders by email."}
            </div>
          </div>
          <button
            type="button"
            className={`switch${learner.reminders.email && email ? " on" : ""}`}
            aria-pressed={!!(learner.reminders.email && email)}
            aria-label="Email reminders"
            disabled={!email}
            onClick={() => actions.setReminders({ email: !learner.reminders.email })}
          />
        </div>
        <div className="row tiny muted" style={{ gap: "6px" }}>
          <Icon n="bell" s={14} />
          In-app reminders appear under the bell icon whenever a class is due.
        </div>
      </div>
    </div>
  );
}
