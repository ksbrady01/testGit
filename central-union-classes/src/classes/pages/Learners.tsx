import { Link } from "@tanstack/react-router";
import { Icon } from "../components/Icon";
import { useProfiles } from "../components/CourseBits";
import { Skeletons } from "../components/ui";
import { levelFor } from "../constants";
import { useApp } from "../state/AppProvider";
import { fmtDate, plural, relDays } from "../utils";

export function LearnersPage() {
  const { learnersAll, courses, svc, toast } = useApp();
  const ps = useProfiles(
    svc?.user,
    (learnersAll ?? []).map((l) => l.id),
  );
  if (!svc?.canEdit) {
    return (
      <div className="card empty">
        <h3>This page is for class editors</h3>
        <p className="muted">Ask an administrator to add your email to the editors list.</p>
        <Link className="btn btn-primary" to="/">
          Browse classes
        </Link>
      </div>
    );
  }
  if (!learnersAll) return <Skeletons count={1} />;

  const rows = learnersAll
    .map((l) => {
      const inc = l.incomplete ?? [];
      const due =
        !!l.nextReminderAt &&
        new Date(l.nextReminderAt).getTime() <= Date.now() &&
        inc.length > 0 &&
        l.reminders.freq !== "off";
      return { ...l, inc, due };
    })
    .sort((a, b) => (b.due ? 1 : 0) - (a.due ? 1 : 0) || b.xp - a.xp);
  const dueEmails = rows.filter((r) => r.due && r.email).map((r) => r.email as string);
  const copyDue = async () => {
    try {
      await navigator.clipboard.writeText(dueEmails.join(", "));
      toast(`Copied ${plural(dueEmails.length, "email")}`, "copy");
    } catch {
      toast("Copy isn't allowed here", "x");
    }
  };
  const completions = (r: (typeof rows)[number]) =>
    Object.values(r.enrolled).filter((e) => e.completedAt).length;
  const totalCompletions = rows.reduce((a, r) => a + completions(r), 0);
  const stats: [string, number, string][] = [
    ["users", rows.length, "learners"],
    ["book", (courses ?? []).length, "classes"],
    ["award", totalCompletions, "completions"],
    ["bell", rows.filter((r) => r.due).length, "reminders due"],
  ];

  return (
    <div className="page">
      <div className="section-h" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">Editors only</div>
          <h1>Learner overview</h1>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => void copyDue()}
          disabled={!dueEmails.length}
        >
          <Icon n="copy" s={15} />
          Copy emails due for a reminder ({dueEmails.length})
        </button>
      </div>
      <div
        className="stat-grid"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", marginBottom: "18px" }}
      >
        {stats.map(([ic, v, l]) => (
          <div key={l} className="card stat">
            <b className="num">{v}</b>
            <span>
              <Icon n={ic} s={15} />
              {l}
            </span>
          </div>
        ))}
      </div>
      <div className="card tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Level</th>
              <th>In progress</th>
              <th>Completed</th>
              <th>Last active</th>
              <th>Reminder</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <b>{ps[r.id]?.name || r.name || "Learner"}</b>
                  <div className="tiny muted">{r.email || "no email on file"}</div>
                </td>
                <td className="num">
                  Lv {levelFor(r.xp).n} · {r.xp} XP
                </td>
                <td>
                  {r.inc.length ? (
                    r.inc.map((x) => (
                      <div key={x.courseId} className="tiny">
                        {x.title} <span className="muted num">{x.pct}%</span>
                      </div>
                    ))
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
                <td className="num">{completions(r)}</td>
                <td className="small">{relDays(r.lastActive)}</td>
                <td>
                  {!r.inc.length || r.reminders.freq === "off" ? (
                    <span className="pill off">{r.inc.length ? "Off" : "None needed"}</span>
                  ) : r.due ? (
                    <span className="pill due">Due now</span>
                  ) : (
                    <span className="pill ok">{fmtDate(r.nextReminderAt)}</span>
                  )}
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={6} className="muted">
                  No learners yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="small muted" style={{ marginTop: "12px", maxWidth: "70ch" }}>
        Each learner chooses a reminder frequency on their My learning page. A learner is "due" once
        they've been away from an unfinished class for that long. With the GoHighLevel webhook
        connected, reminders go out automatically.
      </p>
    </div>
  );
}
