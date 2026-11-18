import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { assetUrl } from "../backend";
import { Icon } from "../components/Icon";
import { NotFound } from "../components/CourseBits";
import { Bar, RichText, TypeBadge } from "../components/ui";
import { XP } from "../constants";
import { useApp } from "../state/AppProvider";
import type { Lesson } from "../types";
import { fmtTime, lessonMinutes, progressOf, ytId } from "../utils";

function VideoPlayer({
  lesson,
  startAt,
  onEnded,
  onPos,
}: {
  lesson: Lesson;
  startAt: number;
  onEnded: () => void;
  onPos: (sec: number) => void;
}) {
  const vref = useRef<HTMLVideoElement | null>(null);
  const last = useRef(startAt || 0);
  const [ended, setEnded] = useState(false);
  const id = ytId(lesson.url);
  const posRef = useRef(onPos);
  posRef.current = onPos;

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    const meta = () => {
      if (startAt && v.duration && startAt < v.duration - 5) v.currentTime = startAt;
    };
    v.addEventListener("loadedmetadata", meta);
    return () => {
      v.removeEventListener("loadedmetadata", meta);
      const t = Math.floor(v.currentTime || 0);
      if (!v.ended && t > 3 && Math.abs(t - last.current) > 3) posRef.current(t);
    };
    // re-bind only when the lesson changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const pause = () => {
    const v = vref.current;
    if (!v || v.ended) return;
    const t = Math.floor(v.currentTime);
    if (Math.abs(t - last.current) > 3) {
      last.current = t;
      posRef.current(t);
    }
  };
  const end = () => {
    setEnded(true);
    last.current = 0;
    onEnded();
  };

  if (lesson.assetId) {
    return (
      <div className="stack" style={{ gap: "10px" }}>
        {startAt > 3 ? (
          <div className="video-help">
            <span className="row" style={{ gap: "6px" }}>
              <Icon n="clock" s={14} />
              Resuming at {fmtTime(startAt)}
            </span>
          </div>
        ) : null}
        <video
          ref={vref}
          className="video-frame"
          src={assetUrl(lesson.assetId)}
          controls
          playsInline
          preload="metadata"
          onPause={pause}
          onEnded={end}
        />
        {ended ? (
          <div className="video-done">
            <Icon n="check" s={16} w={3} />
            Video finished. This lesson is marked complete.
          </div>
        ) : null}
      </div>
    );
  }

  const href = id ? `https://www.youtube.com/watch?v=${id}` : lesson.url;
  if (!id) {
    return (
      <a
        className="video-stage"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open this video"
      >
        <div className="play">
          <Icon n="play" s={34} />
        </div>
        <div className="video-cap">
          <span>Opens in a new tab</span>
          <span>{lessonMinutes(lesson)} min</span>
        </div>
      </a>
    );
  }
  return (
    <div className="stack" style={{ gap: "10px" }}>
      <iframe
        className="video-frame"
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`}
        title={lesson.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <div className="video-help">
        <span>Watch the video, then mark this lesson complete.</span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="row"
          style={{ gap: "5px" }}
        >
          <Icon n="ext" s={13} />
          Trouble playing? Open on YouTube
        </a>
      </div>
    </div>
  );
}

function LessonContent({
  lesson,
  startAt,
  onEnded,
  onPos,
}: {
  lesson: Lesson;
  startAt: number;
  onEnded: () => void;
  onPos: (sec: number) => void;
}) {
  if (lesson.type === "video") {
    return (
      <div className="stack" style={{ gap: "16px" }}>
        <VideoPlayer
          key={lesson.id}
          lesson={lesson}
          startAt={startAt}
          onEnded={onEnded}
          onPos={onPos}
        />
        {lesson.body ? <RichText body={lesson.body} /> : null}
      </div>
    );
  }
  if (lesson.type === "pdf") {
    const src = lesson.assetId ? assetUrl(lesson.assetId) : lesson.url;
    return (
      <div className="stack" style={{ gap: "16px" }}>
        <div className="pdf-card">
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "var(--surface)",
              display: "grid",
              placeItems: "center",
              color: "var(--gold)",
            }}
          >
            <Icon n="file" s={26} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b style={{ color: "var(--ink)" }}>{lesson.fileName || "Lesson PDF"}</b>
            <div className="tiny muted">Read the document, then mark this lesson complete.</div>
          </div>
          {src ? (
            <a className="btn btn-gold btn-sm" href={src} target="_blank" rel="noopener noreferrer">
              <Icon n="ext" s={15} />
              Open PDF
            </a>
          ) : null}
        </div>
        {lesson.assetId && src ? (
          <iframe className="pdf-frame" src={src} title={lesson.title} />
        ) : null}
        {lesson.body ? <RichText body={lesson.body} /> : null}
      </div>
    );
  }
  return <RichText body={lesson.body} />;
}

export function PlayerPage({ courseId }: { courseId: string }) {
  const { courses, learner, actions } = useApp();
  const navigate = useNavigate();
  const course = courses?.find((c) => c.id === courseId);
  const pr = course ? progressOf(learner, course) : null;
  const lessons = course?.lessons ?? [];

  const initial = useMemo(() => {
    const last = pr?.e?.last ? lessons.find((l) => l.id === pr.e?.last) : undefined;
    return last?.id ?? lessons[0]?.id ?? null;
    // pick the starting lesson once per class
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id]);
  const [cur, setCur] = useState<string | null>(initial);
  const [resumed] = useState(() => !!(pr?.e?.last && pr.done > 0 && !pr.completed));

  useEffect(() => {
    if (course && !pr?.enrolled) actions.enroll(course);
    // enroll once when the class opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id]);
  useEffect(() => {
    setCur(initial);
  }, [initial]);

  if (!course || !pr) return <NotFound />;
  const idx = Math.max(
    0,
    lessons.findIndex((l) => l.id === cur),
  );
  const lesson = lessons[idx];
  if (!lesson) {
    return (
      <div className="card empty">
        <h3>This class has no lessons yet</h3>
        <Link className="btn btn-ghost" to="/classes/$courseId" params={{ courseId: course.id }}>
          Back to class
        </Link>
      </div>
    );
  }
  const done = !!pr.e?.done.includes(lesson.id);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const open = (id: string) => {
    setCur(id);
    actions.openLesson(course, id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const complete = () => {
    const res = actions.completeLesson(course, lesson.id);
    if (res.finished) return;
    if (next) open(next.id);
  };
  const afterLast = () =>
    void navigate(
      pr.completed
        ? { to: "/certificate/$courseId", params: { courseId: course.id } }
        : { to: "/classes/$courseId", params: { courseId: course.id } },
    );

  return (
    <div className="page">
      <div className="row between" style={{ marginBottom: "16px" }}>
        <Link
          to="/classes/$courseId"
          params={{ courseId: course.id }}
          className="btn btn-ghost btn-sm"
        >
          <Icon n="left" s={15} />
          {course.title}
        </Link>
        <div className="row" style={{ gap: "10px", minWidth: "200px", flex: "0 1 300px" }}>
          <div style={{ flex: 1 }}>
            <Bar pct={pr.pct} />
          </div>
          <span className="tiny muted num">{pr.pct}%</span>
        </div>
      </div>
      <div className="player">
        <aside className="card lesson-nav">
          <div className="pad" style={{ paddingBottom: "10px" }}>
            <div className="eyebrow">{course.category}</div>
            <h3 style={{ marginTop: "4px" }}>{course.title}</h3>
            <div className="tiny muted num" style={{ marginTop: "4px" }}>
              {pr.done} of {pr.total} lessons complete
            </div>
          </div>
          <div>
            {lessons.map((l, i) => {
              const d = !!pr.e?.done.includes(l.id);
              return (
                <button
                  type="button"
                  key={l.id}
                  className={`lnav-item${l.id === lesson.id ? " on" : ""}`}
                  onClick={() => open(l.id)}
                >
                  <span className={`check${d ? " done" : ""}`}>
                    {d ? (
                      <Icon n="check" s={13} w={3.2} />
                    ) : (
                      <span className="tiny muted">{i + 1}</span>
                    )}
                  </span>
                  <span className="t">
                    {l.title}
                    <div className="tiny muted" style={{ fontWeight: 500 }}>
                      {lessonMinutes(l)} min
                    </div>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
        <div className="card" key={lesson.id}>
          <div className="lesson-body page">
            {resumed && lesson.id === initial ? (
              <div className="resume-note">
                <Icon n="bolt" s={16} />
                Welcome back! You're picking up where you left off.
              </div>
            ) : null}
            <div className="row" style={{ marginBottom: "10px" }}>
              <span className="tiny muted num">
                Lesson {idx + 1} of {lessons.length}
              </span>
              <TypeBadge type={lesson.type} />
            </div>
            <h2 style={{ marginBottom: "18px" }}>{lesson.title}</h2>
            <LessonContent
              lesson={lesson}
              startAt={pr.e?.vpos?.[lesson.id] ?? 0}
              onEnded={() => {
                if (!done) actions.completeLesson(course, lesson.id);
              }}
              onPos={(t) => actions.saveVideoPos(course, lesson.id, t)}
            />
          </div>
          <div className="player-foot">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!prev}
              onClick={() => prev && open(prev.id)}
            >
              <Icon n="left" s={16} />
              Previous
            </button>
            {done ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => (next ? open(next.id) : afterLast())}
              >
                {next ? "Next lesson" : pr.completed ? "View certificate" : "Back to class"}
                <Icon n="right" s={16} />
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={complete}>
                <Icon n="check" s={16} w={2.6} />
                {next ? "Mark complete & continue" : "Complete class"}
                <span className="tiny" style={{ opacity: 0.8 }}>
                  +{XP.lesson} XP
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
