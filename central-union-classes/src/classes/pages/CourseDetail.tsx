import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Icon } from "../components/Icon";
import { NotFound, ShareButton, useProfiles } from "../components/CourseBits";
import { Bar, Cover, TypeBadge } from "../components/ui";
import { XP } from "../constants";
import { useApp } from "../state/AppProvider";
import { courseMinutes, fmtDate, lessonMinutes, plural, progressOf, relDays } from "../utils";

export function CourseDetailPage({ courseId }: { courseId: string }) {
  const { courses, learner, actions, canManage, toast, svc } = useApp();
  const navigate = useNavigate();
  const [confirmDel, setConfirmDel] = useState(false);
  const course = courses?.find((c) => c.id === courseId);
  const authorPs = useProfiles(svc?.user, course?.authorId ? [course.authorId] : []);
  if (!course) return <NotFound />;

  const pr = progressOf(learner, course);
  const lessons = course.lessons || [];
  const authorName = course.authorId ? authorPs[course.authorId]?.name : "";
  const learn = () => void navigate({ to: "/learn/$courseId", params: { courseId: course.id } });
  const start = () => {
    actions.enroll(course);
    learn();
  };

  return (
    <div className="page">
      <Link to="/" className="btn btn-ghost btn-sm" style={{ marginBottom: "14px" }}>
        <Icon n="left" s={15} />
        All classes
      </Link>
      <Cover course={course} className="detail-cover rise" height="220px">
        <div style={{ position: "relative" }}>
          <div
            className="cover-cat"
            style={{ position: "static", display: "inline-block", marginBottom: "10px" }}
          >
            {course.category}
          </div>
          <h1>{course.title}</h1>
        </div>
      </Cover>
      <div className="detail-grid">
        <div className="stack" style={{ gap: "18px" }}>
          <div className="card pad rise" style={{ animationDelay: "60ms" }}>
            <p style={{ fontSize: "17px", maxWidth: "65ch" }}>{course.description}</p>
            <div className="meta" style={{ marginTop: "14px" }}>
              <span>
                <Icon n="book" s={14} />
                {plural(lessons.length, "lesson")}
              </span>
              <span>
                <Icon n="clock" s={14} />
                {courseMinutes(course)} min
              </span>
              <span>
                <Icon n="users" s={14} />
                By {authorName || "Central Union"}
              </span>
            </div>
            {(course.tags || []).length ? (
              <div className="chips" style={{ marginTop: "12px", gap: "6px" }}>
                {course.tags.map((t) => (
                  <span key={t} className="tag" style={{ cursor: "default" }}>
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="card rise" style={{ animationDelay: "120ms" }}>
            <div className="pad" style={{ paddingBottom: "8px" }}>
              <h3>Class outline</h3>
            </div>
            <ol className="outline">
              {lessons.map((l, i) => {
                const done = !!pr.e?.done.includes(l.id);
                return (
                  <li key={l.id} className="oitem">
                    <span className={`onum${done ? " done" : ""}`}>
                      {done ? <Icon n="check" s={15} w={3} /> : i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>{l.title}</div>
                      <div className="tiny muted">{lessonMinutes(l)} min</div>
                    </div>
                    <TypeBadge type={l.type} />
                  </li>
                );
              })}
              {!lessons.length ? (
                <li className="oitem muted">This class has no lessons yet.</li>
              ) : null}
            </ol>
          </div>
        </div>
        <div
          className="card pad side-card stack rise"
          style={{ animationDelay: "160ms", gap: "14px" }}
        >
          {pr.completed ? (
            <>
              <div className="row">
                <div
                  style={{
                    background: "radial-gradient(circle at 35% 30%,var(--gold-bright),var(--gold))",
                    color: "#2A1B00",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon n="award" s={24} />
                </div>
                <div>
                  <b>Completed</b>
                  <div className="tiny muted">{fmtDate(pr.e?.completedAt)}</div>
                </div>
              </div>
              <Link
                className="btn btn-gold"
                to="/certificate/$courseId"
                params={{ courseId: course.id }}
              >
                <Icon n="award" s={17} />
                View certificate
              </Link>
              <Link
                className="btn btn-ghost"
                to="/learn/$courseId"
                params={{ courseId: course.id }}
              >
                Review lessons
              </Link>
            </>
          ) : pr.enrolled ? (
            <>
              <div className="row between">
                <b>Your progress</b>
                <span className="num small muted">
                  {pr.done}/{pr.total}
                </span>
              </div>
              <Bar pct={pr.pct} />
              <button
                type="button"
                className="btn btn-primary"
                onClick={learn}
                disabled={!lessons.length}
              >
                Resume where you left off
                <Icon n="right" s={16} />
              </button>
              <div className="tiny muted">Last active {relDays(pr.e?.updatedAt)}</div>
            </>
          ) : (
            <>
              <b>Ready to start?</b>
              <div className="small muted">
                Earn {lessons.length * XP.lesson + XP.course} XP and a certificate when you finish.
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={start}
                disabled={!lessons.length}
              >
                Start class
                <Icon n="right" s={16} />
              </button>
            </>
          )}
          <ShareButton course={course} toast={toast} />
          {canManage(course) ? (
            <div className="row" style={{ gap: "8px" }}>
              <Link
                className="btn btn-ghost btn-sm"
                to="/edit/$courseId"
                params={{ courseId: course.id }}
                style={{ flex: 1 }}
              >
                <Icon n="edit" s={15} />
                Edit
              </Link>
              {confirmDel ? (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => void actions.deleteCourse(course)}
                >
                  Confirm delete
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => setConfirmDel(true)}
                >
                  <Icon n="trash" s={15} />
                  Delete
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
