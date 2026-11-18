import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Icon } from "../components/Icon";
import { NotFound } from "../components/CourseBits";
import { Cover } from "../components/ui";
import { HUES, XP } from "../constants";
import { useApp } from "../state/AppProvider";
import type { Course, CourseData, Lesson, LessonType } from "../types";
import { blankLesson, clone, courseMinutes, coverBg, lessonMinutes, plural, ytId } from "../utils";

type Draft = Pick<CourseData, "title" | "description" | "category" | "tags" | "hue" | "lessons">;

const TYPE_OPTIONS: [LessonType, string, string][] = [
  ["text", "text", "Text"],
  ["video", "play", "Video"],
  ["pdf", "file", "PDF"],
];
const ADD_OPTIONS: [LessonType, string, string][] = [
  ["text", "text", "Add text lesson"],
  ["video", "play", "Add video"],
  ["pdf", "file", "Add PDF"],
];

/** Create (no courseId) or edit (courseId) a class. */
export function EditorPage({ courseId }: { courseId?: string }) {
  const { courses, canManage } = useApp();
  if (!courseId) return <EditorForm key="new" course={null} />;
  const course = courses?.find((c) => c.id === courseId);
  if (!course) return <NotFound />;
  if (!canManage(course)) {
    return (
      <div className="card empty">
        <h3>Only the class author or an editor can change this class</h3>
        <Link className="btn btn-ghost" to="/classes/$courseId" params={{ courseId: course.id }}>
          Back to class
        </Link>
      </div>
    );
  }
  return <EditorForm key={course.id} course={course} />;
}

function EditorForm({ course }: { course: Course | null }) {
  const { cats, actions, svc } = useApp();
  const assets = svc?.assets ?? null;
  const isNew = !course;
  const [f, setF] = useState<Draft>(() =>
    course
      ? clone({
          title: course.title,
          description: course.description,
          category: course.category,
          tags: course.tags ?? [],
          hue: course.hue,
          lessons: course.lessons ?? [],
        })
      : {
          title: "",
          description: "",
          category: cats[0] ?? "Church Life",
          tags: [],
          hue: HUES[0] ?? 222,
          lessons: [blankLesson("text")],
        },
  );
  const [newCat, setNewCat] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setF((o) => ({ ...o, [k]: v }));
  const patchLesson = (i: number, patch: Partial<Lesson>) =>
    setF((o) => ({ ...o, lessons: o.lessons.map((l, k) => (k === i ? { ...l, ...patch } : l)) }));
  const move = (i: number, d: number) =>
    setF((o) => {
      const j = i + d;
      const a = o.lessons[i];
      const b = o.lessons[j];
      if (!a || !b) return o;
      const ls = o.lessons.slice();
      ls[i] = b;
      ls[j] = a;
      return { ...o, lessons: ls };
    });
  const remove = (i: number) =>
    setF((o) => ({ ...o, lessons: o.lessons.filter((_, k) => k !== i) }));
  const addTag = () => {
    const t = tagDraft.trim().toLowerCase().replace(/^#/, "").replace(/\s+/g, "-").slice(0, 30);
    if (t && !f.tags.includes(t)) set("tags", [...f.tags, t]);
    setTagDraft("");
  };

  const upload = async (i: number, file: File | undefined, kind: "video" | "pdf") => {
    if (!file) return;
    if (kind === "video") {
      if (!/^video\/(mp4|webm|quicktime|ogg)/.test(file.type)) {
        setErr("Please choose an MP4, WebM or MOV video file.");
        return;
      }
    } else if (file.type !== "application/pdf") {
      setErr("Please choose a PDF file.");
      return;
    }
    if (!assets) {
      setErr("File upload isn't set up yet. Paste a link instead.");
      return;
    }
    setUploading(i);
    setErr("");
    try {
      const r = await assets.upload(file);
      patchLesson(i, { assetId: r.id, fileName: file.name, url: "" });
    } catch (e) {
      setErr(`Upload failed: ${e instanceof Error ? e.message : "please try again."}`);
    }
    setUploading(null);
  };

  const save = async () => {
    const category = newCat.trim() || f.category;
    if (!f.title.trim()) return setErr("Give the class a title.");
    if (!f.description.trim())
      return setErr("Add a short description so people know what they'll learn.");
    if (!f.lessons.length) return setErr("Add at least one lesson.");
    for (const [i, l] of f.lessons.entries()) {
      const n = i + 1;
      if (!l.title.trim()) return setErr(`Lesson ${n} needs a title.`);
      if (l.type === "video" && !l.assetId && !ytId(l.url)) {
        return setErr(
          `Lesson ${n}: paste a full YouTube link (youtube.com/watch?v=… or youtu.be/…).`,
        );
      }
      if (l.type === "pdf" && !l.assetId && !/^https?:\/\//.test(l.url || "")) {
        return setErr(`Lesson ${n}: upload a PDF or paste a link to one.`);
      }
      if (l.type === "text" && !l.body.trim())
        return setErr(`Lesson ${n} needs some text content.`);
    }
    setErr("");
    setBusy(true);
    const data: CourseData = {
      title: f.title.trim(),
      description: f.description.trim(),
      category,
      tags: f.tags,
      hue: f.hue,
      lessons: f.lessons.map((l) => ({
        id: l.id,
        title: l.title.trim(),
        type: l.type,
        minutes: Number(l.minutes) || 0,
        body: l.body || "",
        url: l.type !== "text" && !l.assetId ? (l.url || "").trim() : "",
        assetId: l.type !== "text" ? l.assetId || "" : "",
        fileName: l.type !== "text" ? l.fileName || "" : "",
      })),
    };
    const ok = await actions.saveCourse(course, data);
    setBusy(false);
    if (!ok) setErr("Couldn't save the class. Please try again.");
  };

  return (
    <div className="page">
      <div className="section-h" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">{isNew ? "New class" : "Edit class"}</div>
          <h1>{isNew ? "Create a class" : f.title || "Edit class"}</h1>
        </div>
        {course ? (
          <Link
            className="btn btn-ghost btn-sm"
            to="/classes/$courseId"
            params={{ courseId: course.id }}
          >
            Cancel
          </Link>
        ) : (
          <Link className="btn btn-ghost btn-sm" to="/">
            Cancel
          </Link>
        )}
      </div>
      <div className="detail-grid" style={{ marginTop: 0 }}>
        <div className="stack" style={{ gap: "18px" }}>
          <div className="card pad stack" style={{ gap: "14px" }}>
            <div className="field">
              <label htmlFor="c-title">Class title</label>
              <input
                id="c-title"
                className="input"
                value={f.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Foundations of Prayer"
                maxLength={90}
              />
            </div>
            <div className="field">
              <label htmlFor="c-desc">Description</label>
              <textarea
                id="c-desc"
                className="textarea"
                style={{ minHeight: "90px" }}
                value={f.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="What will people learn, and who is it for?"
                maxLength={400}
              />
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="c-cat">Category</label>
                <select
                  id="c-cat"
                  className="select"
                  value={f.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {cats.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="c-newcat">Or create a new category</label>
                <input
                  id="c-newcat"
                  className="input"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="e.g. Missions"
                  maxLength={40}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="c-tag">Tags</label>
              <div className="tag-input">
                {f.tags.map((t) => (
                  <span key={t} className="tag on">
                    #{t}
                    <button
                      type="button"
                      aria-label={`Remove tag ${t}`}
                      onClick={() =>
                        set(
                          "tags",
                          f.tags.filter((x) => x !== t),
                        )
                      }
                      style={{
                        border: 0,
                        background: "none",
                        cursor: "pointer",
                        color: "inherit",
                        padding: 0,
                        display: "grid",
                      }}
                    >
                      <Icon n="x" s={12} w={3} />
                    </button>
                  </span>
                ))}
                <input
                  id="c-tag"
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  onBlur={addTag}
                  placeholder="Type a tag and press Enter"
                />
              </div>
            </div>
            <div className="field">
              <span className="label-text">Cover color</span>
              <div className="hue-pick">
                {HUES.map((h) => (
                  <button
                    type="button"
                    key={h}
                    aria-label={`Cover color ${h}`}
                    className={f.hue === h ? "on" : ""}
                    style={{ background: coverBg(h) }}
                    onClick={() => set("hue", h)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="row between">
            <h2>Lessons</h2>
            <span className="small muted">{plural(f.lessons.length, "lesson")}</span>
          </div>
          {f.lessons.map((l, i) => (
            <div key={l.id} className="lesson-edit">
              <div className="row between">
                <b>Lesson {i + 1}</b>
                <div className="row" style={{ gap: "6px" }}>
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: "34px", height: "34px" }}
                    aria-label="Move up"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                  >
                    <Icon n="up" s={16} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: "34px", height: "34px" }}
                    aria-label="Move down"
                    onClick={() => move(i, 1)}
                    disabled={i === f.lessons.length - 1}
                  >
                    <Icon n="down" s={16} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: "34px", height: "34px", color: "var(--bad)" }}
                    aria-label="Remove lesson"
                    onClick={() => remove(i)}
                  >
                    <Icon n="trash" s={16} />
                  </button>
                </div>
              </div>
              <div className="type-pick" role="group" aria-label="Lesson type">
                {TYPE_OPTIONS.map(([t, ic, lab]) => (
                  <button
                    type="button"
                    key={t}
                    className={l.type === t ? "on" : ""}
                    onClick={() =>
                      patchLesson(
                        i,
                        l.type === t ? { type: t } : { type: t, assetId: "", fileName: "" },
                      )
                    }
                  >
                    <Icon n={ic} s={14} />
                    {lab}
                  </button>
                ))}
              </div>
              <div className="form-grid" style={{ gridTemplateColumns: "1fr 120px" }}>
                <div className="field">
                  <label htmlFor={`lt-${l.id}`}>Lesson title</label>
                  <input
                    id={`lt-${l.id}`}
                    className="input"
                    value={l.title}
                    onChange={(e) => patchLesson(i, { title: e.target.value })}
                    maxLength={100}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`lm-${l.id}`}>Minutes</label>
                  <input
                    id={`lm-${l.id}`}
                    className="input num"
                    type="number"
                    min={1}
                    max={600}
                    value={l.minutes}
                    onChange={(e) => patchLesson(i, { minutes: e.target.value })}
                    placeholder={String(lessonMinutes(l))}
                  />
                </div>
              </div>
              {l.type === "video" ? (
                <div className="stack" style={{ gap: "8px" }}>
                  {l.assetId ? (
                    <div className="row small">
                      <Icon n="play" s={16} />
                      <b>{l.fileName || "Uploaded video"}</b>
                      <span className="hint">Plays right in the lesson</span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => patchLesson(i, { assetId: "", fileName: "" })}
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <div className="field">
                      <label htmlFor={`lu-${l.id}`}>YouTube link</label>
                      <div className="row">
                        <input
                          id={`lu-${l.id}`}
                          className="input"
                          style={{ flex: 1, minWidth: "220px" }}
                          value={l.url}
                          onChange={(e) => patchLesson(i, { url: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=…"
                        />
                        {assets ? (
                          <>
                            <span className="tiny muted">or</span>
                            <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }}>
                              <Icon n="upload" s={15} />
                              {uploading === i ? "Uploading…" : "Upload video file"}
                              <input
                                type="file"
                                accept="video/mp4,video/webm,video/quicktime"
                                style={{ display: "none" }}
                                onChange={(e) => void upload(i, e.target.files?.[0], "video")}
                              />
                            </label>
                          </>
                        ) : null}
                      </div>
                      {l.url && !ytId(l.url) ? (
                        <span className="err">That doesn't look like a YouTube video link.</span>
                      ) : l.url ? (
                        <span className="hint" style={{ color: "var(--good)" }}>
                          Video found. It plays right inside the lesson.
                        </span>
                      ) : (
                        <span className="hint">
                          Paste a YouTube link; the video plays right inside the lesson.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
              {l.type === "pdf" ? (
                <div className="stack" style={{ gap: "8px" }}>
                  {l.assetId ? (
                    <div className="row small">
                      <Icon n="file" s={16} />
                      <b>{l.fileName || "Uploaded PDF"}</b>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => patchLesson(i, { assetId: "", fileName: "" })}
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <div className="row">
                      {assets ? (
                        <>
                          <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }}>
                            <Icon n="upload" s={15} />
                            {uploading === i ? "Uploading…" : "Upload PDF"}
                            <input
                              type="file"
                              accept="application/pdf"
                              style={{ display: "none" }}
                              onChange={(e) => void upload(i, e.target.files?.[0], "pdf")}
                            />
                          </label>
                          <span className="tiny muted">or</span>
                        </>
                      ) : null}
                      <input
                        className="input"
                        style={{ flex: 1, minWidth: "200px" }}
                        aria-label="PDF link"
                        value={l.url}
                        onChange={(e) => patchLesson(i, { url: e.target.value })}
                        placeholder="Paste a link to a PDF (https://…)"
                      />
                    </div>
                  )}
                </div>
              ) : null}
              <div className="field">
                <label htmlFor={`lb-${l.id}`}>
                  {l.type === "text" ? "Lesson content" : "Notes (optional)"}
                </label>
                <textarea
                  id={`lb-${l.id}`}
                  className="textarea"
                  style={{ minHeight: l.type === "text" ? "180px" : "80px" }}
                  value={l.body}
                  onChange={(e) => patchLesson(i, { body: e.target.value })}
                  placeholder={
                    l.type === "text"
                      ? "Write the lesson. Use # for a heading, - for bullet points, **bold** for emphasis."
                      : "Anything to read alongside the video or PDF"
                  }
                />
              </div>
            </div>
          ))}
          <div className="row">
            {ADD_OPTIONS.map(([t, ic, lab]) => (
              <button
                type="button"
                key={t}
                className="btn btn-ghost"
                onClick={() => set("lessons", [...f.lessons, blankLesson(t)])}
              >
                <Icon n={ic} s={15} />
                {lab}
              </button>
            ))}
          </div>
        </div>
        <div className="card pad side-card stack" style={{ gap: "14px" }}>
          <b>Preview</b>
          <div className="card" style={{ overflow: "hidden", boxShadow: "none" }}>
            <Cover course={{ hue: f.hue, category: newCat || f.category }} height="110px">
              <span className="cover-cat">{newCat || f.category}</span>
            </Cover>
            <div className="cbody">
              <h3>{f.title || "Class title"}</h3>
              <p>{f.description || "Description"}</p>
              <div className="meta">
                <span>
                  <Icon n="book" s={14} />
                  {plural(f.lessons.length, "lesson")}
                </span>
                <span>
                  <Icon n="clock" s={14} />
                  {courseMinutes(f)} min
                </span>
              </div>
            </div>
          </div>
          {err ? (
            <div className="err" role="alert">
              {err}
            </div>
          ) : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void save()}
            disabled={busy}
          >
            {busy ? "Saving…" : isNew ? "Publish class" : "Save changes"}
          </button>
          {isNew ? (
            <span className="tiny muted">
              Publishing earns you {XP.create} XP and the Teacher badge. The class appears in the
              catalog right away.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
