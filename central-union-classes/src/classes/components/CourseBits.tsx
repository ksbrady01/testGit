import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { APP_URL } from "../constants";
import type { UserApi } from "../backend";
import type { Course, Learner, Profile } from "../types";
import { courseMinutes, plural, progressOf } from "../utils";
import { Icon } from "./Icon";
import { Bar, Cover } from "./ui";

export function CourseCard({
  course,
  learner,
  i,
  onTag,
}: {
  course: Course;
  learner: Learner | null;
  i: number;
  onTag?: (tag: string) => void;
}) {
  const pr = progressOf(learner, course);
  const n = (course.lessons || []).length;
  return (
    <Link
      to="/classes/$courseId"
      params={{ courseId: course.id }}
      className="card ccard rise"
      style={{ animationDelay: `${Math.min(i, 10) * 55}ms` }}
    >
      <Cover course={course}>
        <span className="cover-cat">{course.category || "General"}</span>
        {pr.completed ? (
          <span className="cover-done">
            <Icon n="check" s={13} w={3} />
            Completed
          </span>
        ) : null}
      </Cover>
      <div className="cbody">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        {(course.tags || []).length ? (
          <div className="chips" style={{ gap: "6px" }}>
            {course.tags.slice(0, 4).map((t) => (
              <button
                type="button"
                key={t}
                className="tag"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTag?.(t);
                }}
              >
                #{t}
              </button>
            ))}
          </div>
        ) : null}
        <div style={{ flex: 1 }} />
        <div className="meta">
          <span>
            <Icon n="book" s={14} />
            {plural(n, "lesson")}
          </span>
          <span>
            <Icon n="clock" s={14} />
            {courseMinutes(course)} min
          </span>
        </div>
        {pr.enrolled && !pr.completed ? (
          <div className="stack" style={{ gap: "6px" }}>
            <Bar pct={pr.pct} />
            <span className="tiny muted num">{pr.pct}% complete</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export function ShareButton({
  course,
  toast,
}: {
  course: Course;
  toast: (t: string, icon?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const base = APP_URL || window.location.origin;
  const link = `${base.replace(/\/$/, "")}/classes/${course.id}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast("Class link copied", "link");
      setOpen(false);
    } catch {
      setOpen(true);
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        className="btn btn-ghost"
        style={{ width: "100%" }}
        onClick={() => void copy()}
      >
        <Icon n="link" s={16} />
        Share class
      </button>
      {open ? (
        <div className="card pop" style={{ width: "320px", padding: "12px" }}>
          <div className="small" style={{ fontWeight: 650, marginBottom: "6px" }}>
            Copy this link
          </div>
          <input
            className="input"
            readOnly
            value={link}
            onFocus={(e) => e.target.select()}
            id="share-link"
          />
          <div className="hint" style={{ marginTop: "6px" }}>
            Anyone with this link can open the class.
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Resolve display names/avatars for a set of learner ids. */
export function useProfiles(user: UserApi | undefined, ids: string[]): Record<string, Profile> {
  const key = ids.filter(Boolean).sort().join(",");
  const [map, setMap] = useState<Record<string, Profile>>({});
  useEffect(() => {
    let alive = true;
    if (!user || !key) return;
    user
      .profiles(key.split(","))
      .then((ps) => {
        if (alive) setMap(ps);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [user, key]);
  return map;
}

export function NotFound() {
  return (
    <div className="card empty page">
      <div className="ico-wrap">
        <Icon n="search" s={28} />
      </div>
      <h3>We couldn't find that class</h3>
      <p className="muted">It may have been removed, or the link is incomplete.</p>
      <Link className="btn btn-primary" to="/">
        Browse classes
      </Link>
    </div>
  );
}
