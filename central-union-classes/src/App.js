import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import htm from "htm";
import * as backend from "./backend/index.js";
import { ORG, APP_URL, BRAND } from "./config.js";
import { LEVELS, levelFor } from "./lib/levels.js";

const html = htm.bind(React.createElement);

/* ---------- constants ---------- */
const XP = { lesson: 20, course: 100, streakDay: 5, create: 50 };
const DEFAULT_CATS = ["Church Life", "Bible Study", "Faith Foundations", "Serving & Volunteering", "Leadership", "Family & Youth"];
const CAT_ICON = { "Church Life": "home", "Bible Study": "book", "Faith Foundations": "flame", "Serving & Volunteering": "heart", "Leadership": "users", "Family & Youth": "sprout" };
const HUES = [222, 200, 168, 140, 38, 18, 350, 280];
const FREQS = [{ id: "daily", label: "Daily", days: 1 }, { id: "3days", label: "Every 3 days", days: 3 }, { id: "weekly", label: "Weekly", days: 7 }, { id: "off", label: "Off", days: null }];
const BADGES = [
  { id: "first-step", name: "First Step", desc: "Finish your first lesson", icon: "check", test: s => s.lessons >= 1 },
  { id: "finisher", name: "Finisher", desc: "Complete a class", icon: "award", test: s => s.courses >= 1 },
  { id: "devoted", name: "Devoted", desc: "Complete 3 classes", icon: "star", test: s => s.courses >= 3 },
  { id: "streak-3", name: "On a Roll", desc: "Learn 3 days in a row", icon: "flame", test: s => s.bestStreak >= 3 },
  { id: "streak-7", name: "Faithful Week", desc: "Learn 7 days in a row", icon: "flame", test: s => s.bestStreak >= 7 },
  { id: "explorer", name: "Explorer", desc: "Learn in 3 categories", icon: "compass", test: s => s.cats >= 3 },
  { id: "teacher", name: "Teacher", desc: "Publish a class", icon: "users", test: s => s.created >= 1 }
];

/* ---------- icons ---------- */
const IC = {
  compass: { c: [[12, 12, 10]], p: ["16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"] },
  book: { d: ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"] },
  trophy: { d: ["M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"] },
  plus: { d: ["M12 5v14M5 12h14"] },
  shield: { d: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"] },
  bell: { d: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"] },
  sun: { c: [[12, 12, 4.5]], d: ["M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"] },
  moon: { d: ["M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"] },
  play: { fill: true, p: ["6 4 20 12 6 20 6 4"] },
  file: { d: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6M9 13h6M9 17h4"] },
  text: { d: ["M4 6h16M4 11h16M4 16h10"] },
  check: { d: ["M20 6L9 17l-5-5"] },
  link: { d: ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"] },
  edit: { d: ["M12 20h9", "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"] },
  trash: { d: ["M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"] },
  right: { d: ["M5 12h14M12 5l7 7-7 7"] },
  left: { d: ["M19 12H5M12 19l-7-7 7-7"] },
  clock: { c: [[12, 12, 10]], d: ["M12 6v6l4 2"] },
  flame: { d: ["M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"] },
  award: { c: [[12, 8, 6]], d: ["M8.21 13.89L7 23l5-3 5 3-1.21-9.12"] },
  x: { d: ["M18 6L6 18M6 6l12 12"] },
  upload: { d: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"] },
  download: { d: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"] },
  search: { c: [[11, 11, 7]], d: ["M21 21l-4.35-4.35"] },
  users: { c: [[9, 7, 4]], d: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"] },
  up: { d: ["M18 15l-6-6-6 6"] },
  down: { d: ["M6 9l6 6 6-6"] },
  star: { p: ["12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"] },
  home: { d: ["M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"] },
  heart: { d: ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"] },
  sprout: { d: ["M7 20h10M12 20v-9", "M12 11c0-4 3-6 7-6 0 4-3 6-7 6z", "M12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"] },
  tag: { d: ["M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"], c: [[7, 7, 1.2]] },
  mylearn: { d: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"] },
  mail: { d: ["M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M22 6l-10 7L2 6"] },
  copy: { d: ["M9 9h11v11H9z", "M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"] },
  ext: { d: ["M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"] },
  bolt: { p: ["13 2 3 14 12 14 11 22 21 10 12 10 13 2"] }
};
function Icon({ n, s = 18, w = 2, style }) {
  const spec = IC[n] || IC.book;
  return html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill=${spec.fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth=${w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style=${style}>
    ${(spec.c || []).map((c, i) => html`<circle key=${"c" + i} cx=${c[0]} cy=${c[1]} r=${c[2]} />`)}
    ${(spec.d || []).map((d, i) => html`<path key=${"d" + i} d=${d} />`)}
    ${(spec.p || []).map((p, i) => html`<polygon key=${"p" + i} points=${p} />`)}
  </svg>`;
}

/* ---------- helpers ---------- */
const nowIso = () => new Date().toISOString();
const dayKey = (d = new Date()) => d.toLocaleDateString("en-CA");
const uidGen = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clone = (o) => JSON.parse(JSON.stringify(o));
const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");
function daysSince(iso) { if (!iso) return Infinity; return (Date.now() - new Date(iso).getTime()) / 864e5; }
function fmtDate(iso) { if (!iso) return ""; try { return new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }); } catch (e) { return ""; } }
function relDays(iso) { const d = Math.floor(daysSince(iso)); if (!isFinite(d)) return "never"; if (d < 1) return "today"; if (d < 2) return "yesterday"; return d + " days ago"; }
function coverBg(h) { h = Number(h) || 222; return `radial-gradient(90% 120% at 90% 10%, hsl(${h + 35} 80% 64% / .85) 0%, transparent 55%), linear-gradient(135deg, hsl(${h} 58% 34%) 0%, hsl(${h + 18} 62% 48%) 100%)`; }
function ytId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
function lessonMinutes(l) { return Number(l.minutes) || (l.type === "video" ? 10 : l.type === "pdf" ? 15 : 8); }
function courseMinutes(c) { return (c.lessons || []).reduce((a, l) => a + lessonMinutes(l), 0); }
function progressOf(learner, course) {
  const e = learner && learner.enrolled && learner.enrolled[course.id];
  const total = (course.lessons || []).length;
  if (!e) return { enrolled: false, done: 0, total, pct: 0 };
  const ids = new Set((course.lessons || []).map(l => l.id));
  const done = (e.done || []).filter(id => ids.has(id)).length;
  return { enrolled: true, done, total, pct: total ? Math.round(done / total * 100) : 0, completed: !!e.completedAt, e };
}
function newLearner() {
  return { xp: 0, enrolled: {}, streak: { count: 0, best: 0, last: null }, reminders: { freq: "3days", email: true }, badges: [], createdAt: nowIso() };
}
function normalizeLearner(d) {
  const b = newLearner();
  const l = Object.assign(b, d || {});
  l.enrolled = l.enrolled || {}; l.streak = Object.assign({ count: 0, best: 0, last: null }, l.streak || {});
  l.reminders = Object.assign({ freq: "3days", email: true }, l.reminders || {}); l.badges = l.badges || [];
  l.xp = Number(l.xp) || 0;
  return l;
}
function freqDays(id) { const f = FREQS.find(x => x.id === id); return f ? f.days : 3; }

/* Simple safe text format: "# Heading", "- bullet", blank line = paragraph, **bold** */
function inline(text, k) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => p.startsWith("**") && p.endsWith("**") && p.length > 4 ? html`<strong key=${k + "-" + i}>${p.slice(2, -2)}</strong>` : p);
}
function RichText({ body }) {
  const lines = String(body || "").replace(/\r/g, "").split("\n");
  const out = []; let para = [], list = [];
  const flushP = () => { if (para.length) { out.push(html`<p key=${"p" + out.length}>${inline(para.join(" "), "p" + out.length)}</p>`); para = []; } };
  const flushL = () => { if (list.length) { const k = "l" + out.length; out.push(html`<ul key=${k}>${list.map((t, i) => html`<li key=${i}>${inline(t, k + i)}</li>`)}</ul>`); list = []; } };
  lines.forEach(raw => {
    const line = raw.trim();
    if (!line) { flushP(); flushL(); return; }
    if (/^#{1,3}\s/.test(line)) { flushP(); flushL(); out.push(html`<h3 key=${"h" + out.length}>${line.replace(/^#{1,3}\s/, "")}</h3>`); return; }
    if (/^[-*]\s/.test(line)) { flushP(); list.push(line.slice(2)); return; }
    flushL(); para.push(line);
  });
  flushP(); flushL();
  return html`<div>${out}</div>`;
}


/* ---------- confetti ---------- */
function confetti() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.getElementById("confetti"); const ctx = cv.getContext("2d");
  const W = cv.width = innerWidth * devicePixelRatio, H = cv.height = innerHeight * devicePixelRatio;
  cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
  const cols = ["#2447A6", "#E8A92A", "#3A63D6", "#18865A", "#F6C66A", "#E3342F", "#86A3FF"];
  const ps = Array.from({ length: 170 }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 26 * devicePixelRatio, vy: (-Math.random() * 22 - 8) * devicePixelRatio, r: (4 + Math.random() * 6) * devicePixelRatio, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6, va: (Math.random() - .5) * .4 }));
  const t0 = performance.now();
  (function frame(t) {
    const el = t - t0; ctx.clearRect(0, 0, W, H);
    ps.forEach(p => { p.vy += .6 * devicePixelRatio; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = Math.max(0, 1 - el / 3200); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 3, p.r, p.r * .6); ctx.restore(); });
    if (el < 3200) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
  })(t0);
}

/* ---------- routing ---------- */
function parseHash() {
  const h = decodeURIComponent((location.hash || "").slice(1));
  const m = h.match(/^(course|learn|edit|certificate)-([A-Za-z0-9]+)$/);
  if (m) return { page: m[1], id: m[2] };
  if (["explore", "my-learning", "leaderboard", "create", "admin"].includes(h)) return { page: h };
  return { page: "explore" };
}
const go = (h) => { if (location.hash === "#" + h) window.dispatchEvent(new HashChangeEvent("hashchange")); else location.hash = h; };

/* ---------- small components ---------- */
function Ring({ pct, size = 110, stroke = 10, color = "var(--gold-bright)", children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => { const t = setTimeout(() => setShown(pct), 60); return () => clearTimeout(t); }, [pct]);
  return html`<div style=${{ position: "relative", width: size, height: size, flexShrink: 0 }}>
    <svg width=${size} height=${size} className="ring" aria-hidden="true">
      <circle cx=${size / 2} cy=${size / 2} r=${r} fill="none" stroke="var(--surface-2)" strokeWidth=${stroke} />
      <circle cx=${size / 2} cy=${size / 2} r=${r} fill="none" stroke=${color} strokeWidth=${stroke} strokeLinecap="round" strokeDasharray=${c} strokeDashoffset=${c - (c * Math.min(100, shown)) / 100} />
    </svg>
    <div style=${{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>${children}</div>
  </div>`;
}
function Bar({ pct, kind }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 50); return () => clearTimeout(t); }, [pct]);
  return html`<div className=${"bar " + (kind || "")} role="progressbar" aria-valuenow=${pct} aria-valuemin="0" aria-valuemax="100"><i style=${{ width: w + "%" }}></i></div>`;
}
function TypeBadge({ type }) {
  const map = { video: ["play", "Video"], pdf: ["file", "PDF"], text: ["text", "Reading"] };
  const [ic, label] = map[type] || map.text;
  return html`<span className=${"type-badge t-" + (type || "text")}><${Icon} n=${ic} s=${12} w=${2.5} />${label}</span>`;
}
function Cover({ course, height, children, className }) {
  const ic = CAT_ICON[course.category] || "book";
  return html`<div className=${className || "cover"} style=${{ background: coverBg(course.hue), height }}>
    <div className="cover-ico"><${Icon} n=${ic} s=${120} w=${1.4} /></div>
    ${children}
  </div>`;
}

function useProfiles(user, ids) {
  const key = (ids || []).filter(Boolean).sort().join(",");
  const [map, setMap] = useState({});
  useEffect(() => {
    let alive = true;
    if (!user || !key) return;
    user.profiles(key.split(",")).then(ps => { if (alive) setMap(ps || {}); }).catch(() => {});
    return () => { alive = false; };
  }, [user, key]);
  return map;
}

/* ---------- Course card ---------- */
function CourseCard({ course, learner, i, onTag }) {
  const pr = progressOf(learner, course);
  const n = (course.lessons || []).length;
  return html`<a href=${"#course-" + course.id} className="card ccard rise" style=${{ animationDelay: Math.min(i, 10) * 55 + "ms" }}>
    <${Cover} course=${course}>
      <span className="cover-cat">${course.category || "General"}</span>
      ${pr.completed ? html`<span className="cover-done"><${Icon} n="check" s=${13} w=${3} />Completed</span>` : null}
    <//>
    <div className="cbody">
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      ${(course.tags || []).length ? html`<div className="chips" style=${{ gap: "6px" }}>${course.tags.slice(0, 4).map(t => html`<button key=${t} className="tag" onClick=${(e) => { e.preventDefault(); e.stopPropagation(); onTag && onTag(t); }}>#${t}</button>`)}</div>` : null}
      <div style=${{ flex: 1 }}></div>
      <div className="meta"><span><${Icon} n="book" s=${14} />${plural(n, "lesson")}</span><span><${Icon} n="clock" s=${14} />${courseMinutes(course)} min</span></div>
      ${pr.enrolled && !pr.completed ? html`<div className="stack" style=${{ gap: "6px" }}><${Bar} pct=${pr.pct} /><span className="tiny muted num">${pr.pct}% complete</span></div>` : null}
    </div>
  </a>`;
}

/* ---------- Explore ---------- */
function Explore({ courses, learner, cats, loadNote, me, preview }) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All"); const [tag, setTag] = useState(null);
  const lv = levelFor(learner ? learner.xp : 0);
  const inProg = useMemo(() => (courses || []).map(c => ({ c, p: progressOf(learner, c) })).filter(x => x.p.enrolled && !x.p.completed).sort((a, b) => String(b.p.e.updatedAt || "").localeCompare(String(a.p.e.updatedAt || ""))), [courses, learner]);
  const allTags = useMemo(() => { const m = {}; (courses || []).forEach(c => (c.tags || []).forEach(t => m[t] = (m[t] || 0) + 1)); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(x => x[0]).slice(0, 14); }, [courses]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (courses || []).filter(c => (cat === "All" || c.category === cat) && (!tag || (c.tags || []).includes(tag)) && (!s || (c.title + " " + c.description + " " + (c.tags || []).join(" ") + " " + c.category).toLowerCase().includes(s)))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }, [courses, q, cat, tag]);
  const completed = learner ? Object.values(learner.enrolled).filter(e => e.completedAt).length : 0;
  const first = (me && me.name || "").split(" ")[0];
  const resume = inProg[0];
  return html`<div className="page">
    <section className="hero">
      <div className="hero-main rise"><div>
        <div className="eyebrow" style=${{ color: "inherit", opacity: .8 }}>${ORG}</div>
        <h1 style=${{ marginTop: "8px" }}>${first ? "Welcome back, " + first + "." : "Grow in faith, one lesson at a time."}</h1>
        <p>Classes for every season of life. Pick up where you left off, earn certificates, and level up as you learn.</p>
        <div className="hero-stats">
          <div><b className="num">${(courses || []).length}</b><span>classes</span></div>
          <div><b className="num">${learner ? learner.xp : 0}</b><span>your XP</span></div>
          <div><b className="num">${completed}</b><span>completed</span></div>
          <div><b className="num">${learner ? learner.streak.count : 0}</b><span>day streak</span></div>
        </div>
      </div>
        <img className="hero-logo" src=${BRAND.logo} alt="Central Union Church of Christ logo" />
      </div>
      <div className="card resume rise" style=${{ animationDelay: "90ms" }}>
        ${resume ? html`
          <div className="row between"><span className="eyebrow">Continue learning</span><span className="lvl-pill">Lv ${lv.n} · ${lv.name}</span></div>
          <${Cover} course=${resume.c} className="cover resume-cover" height="88px" />
          <h3>${resume.c.title}</h3>
          <div className="small muted">Next up: ${((resume.c.lessons || []).find(l => l.id === resume.p.e.last) || {}).title || "your next lesson"}</div>
          <${Bar} pct=${resume.p.pct} />
          <div className="row between"><span className="tiny muted num">${resume.p.done} of ${resume.p.total} lessons · ${resume.p.pct}%</span>
            <a className="btn btn-primary btn-sm" href=${"#learn-" + resume.c.id}>Resume<${Icon} n="right" s=${15} /></a></div>
        ` : html`
          <div className="row between"><span className="eyebrow">Your level</span><span className="lvl-pill">Lv ${lv.n}</span></div>
          <div className="row" style=${{ gap: "18px" }}>
            <${Ring} pct=${lv.pct} size=${96}><div><b style=${{ fontFamily: "var(--font-display)", fontSize: "22px" }}>${lv.n}</b><div className="tiny muted">level</div></div><//>
            <div className="stack" style=${{ gap: "4px" }}><h3>${lv.name}</h3><span className="small muted">${lv.next ? lv.toNext + " XP to " + lv.next.name : "Top level reached"}</span></div>
          </div>
          <p className="small muted">Start any class below. Each lesson earns ${XP.lesson} XP and finishing a class earns ${XP.course} XP plus a certificate.</p>
        `}
      </div>
    </section>

    <div className="section-h"><div><div className="eyebrow">Catalog</div><h2>Explore classes</h2></div>
      <a className="btn btn-ghost btn-sm" href="#create"><${Icon} n="plus" s=${16} />Add a class</a></div>
    ${loadNote ? html`<div className="banner warn">${loadNote}</div>` : null}
    <div className="toolbar">
      <label className="search"><${Icon} n="search" s=${18} /><input id="search" placeholder="Search classes, topics or tags" value=${q} onChange=${e => setQ(e.target.value)} aria-label="Search classes" /></label>
    </div>
    <div className="chips" style=${{ marginBottom: "10px" }}>
      ${["All", ...cats].map(c => html`<button key=${c} className=${"chip" + (cat === c ? " on" : "")} onClick=${() => setCat(c)}>${c}</button>`)}
    </div>
    ${allTags.length ? html`<div className="chips" style=${{ marginBottom: "20px", gap: "6px" }}>
      <span className="tiny muted" style=${{ alignSelf: "center", marginRight: "4px" }}>Tags</span>
      ${allTags.map(t => html`<button key=${t} className=${"tag" + (tag === t ? " on" : "")} onClick=${() => setTag(tag === t ? null : t)}>#${t}</button>`)}
    </div>` : null}
    ${courses === null ? html`<div className="grid">${[0, 1, 2].map(i => html`<div key=${i} className="skel"></div>`)}</div>`
      : list.length ? html`<div className="grid">${list.map((c, i) => html`<${CourseCard} key=${c.id} course=${c} learner=${learner} i=${i} onTag=${setTag} />`)}</div>`
      : html`<div className="card empty"><div className="ico-wrap"><${Icon} n="book" s=${28} /></div><h3>${(courses || []).length ? "No classes match" : "No classes yet"}</h3>
          <p className="muted">${(courses || []).length ? "Try another search, category or tag." : "Create the first class for your church family."}</p>
          ${(courses || []).length ? html`<button className="btn btn-ghost" onClick=${() => { setQ(""); setCat("All"); setTag(null); }}>Clear filters</button>` : html`<a className="btn btn-primary" href="#create">Create a class</a>`}</div>`}
  </div>`;
}

/* ---------- Share button ---------- */
function ShareButton({ course, toast }) {
  const [open, setOpen] = useState(false);
  const base = APP_URL || location.href.split("#")[0];
  const link = base + "#course-" + course.id;
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); toast("Class link copied", "link"); setOpen(false); }
    catch (e) { setOpen(true); }
  };
  return html`<div style=${{ position: "relative" }}>
    <button className="btn btn-ghost" onClick=${copy}><${Icon} n="link" s=${16} />Share class</button>
    ${open ? html`<div className="card pop" style=${{ width: "320px", padding: "12px" }}>
      <div className="small" style=${{ fontWeight: 650, marginBottom: "6px" }}>Copy this link</div>
      <input className="input" readOnly value=${link} onFocus=${e => e.target.select()} id="share-link" />
      <div className="hint" style=${{ marginTop: "6px" }}>Anyone with this link can open the class.</div>
    </div>` : null}
  </div>`;
}

/* ---------- Course detail ---------- */
function CourseDetail({ course, learner, actions, canManage, toast, authorName }) {
  const [confirmDel, setConfirmDel] = useState(false);
  if (!course) return html`<${NotFound} />`;
  const pr = progressOf(learner, course);
  const lessons = course.lessons || [];
  const start = () => { actions.enroll(course); go("learn-" + course.id); };
  return html`<div className="page">
    <a href="#explore" className="btn btn-ghost btn-sm" style=${{ marginBottom: "14px" }}><${Icon} n="left" s=${15} />All classes</a>
    <${Cover} course=${course} className="detail-cover rise" height="220px">
      <div style=${{ position: "relative" }}>
        <div className="cover-cat" style=${{ position: "static", display: "inline-block", marginBottom: "10px" }}>${course.category}</div>
        <h1>${course.title}</h1>
      </div>
    <//>
    <div className="detail-grid">
      <div className="stack" style=${{ gap: "18px" }}>
        <div className="card pad rise" style=${{ animationDelay: "60ms" }}>
          <p style=${{ fontSize: "17px", maxWidth: "65ch" }}>${course.description}</p>
          <div className="meta" style=${{ marginTop: "14px" }}>
            <span><${Icon} n="book" s=${14} />${plural(lessons.length, "lesson")}</span>
            <span><${Icon} n="clock" s=${14} />${courseMinutes(course)} min</span>
            <span><${Icon} n="users" s=${14} />By ${authorName || "Central Union"}</span>
          </div>
          ${(course.tags || []).length ? html`<div className="chips" style=${{ marginTop: "12px", gap: "6px" }}>${course.tags.map(t => html`<span key=${t} className="tag" style=${{ cursor: "default" }}>#${t}</span>`)}</div>` : null}
        </div>
        <div className="card rise" style=${{ animationDelay: "120ms" }}>
          <div className="pad" style=${{ paddingBottom: "8px" }}><h3>Class outline</h3></div>
          <ol className="outline">
            ${lessons.map((l, i) => { const done = pr.e && (pr.e.done || []).includes(l.id); return html`<li key=${l.id} className="oitem">
              <span className=${"onum" + (done ? " done" : "")}>${done ? html`<${Icon} n="check" s=${15} w=${3} />` : i + 1}</span>
              <div style=${{ flex: 1, minWidth: 0 }}><div style=${{ fontWeight: 600 }}>${l.title}</div><div className="tiny muted">${lessonMinutes(l)} min</div></div>
              <${TypeBadge} type=${l.type} />
            </li>`; })}
            ${!lessons.length ? html`<li className="oitem muted">This class has no lessons yet.</li>` : null}
          </ol>
        </div>
      </div>
      <div className="card pad side-card stack rise" style=${{ animationDelay: "160ms", gap: "14px" }}>
        ${pr.completed ? html`
          <div className="row"><div className="medal" style=${{ background: "radial-gradient(circle at 35% 30%,var(--gold-bright),var(--gold))", color: "#2A1B00", width: "48px", height: "48px", borderRadius: "50%", display: "grid", placeItems: "center" }}><${Icon} n="award" s=${24} /></div>
            <div><b>Completed</b><div className="tiny muted">${fmtDate(pr.e.completedAt)}</div></div></div>
          <a className="btn btn-gold" href=${"#certificate-" + course.id}><${Icon} n="award" s=${17} />View certificate</a>
          <a className="btn btn-ghost" href=${"#learn-" + course.id}>Review lessons</a>
        ` : pr.enrolled ? html`
          <div className="row between"><b>Your progress</b><span className="num small muted">${pr.done}/${pr.total}</span></div>
          <${Bar} pct=${pr.pct} />
          <button className="btn btn-primary" onClick=${() => go("learn-" + course.id)} disabled=${!lessons.length}>Resume where you left off<${Icon} n="right" s=${16} /></button>
          <div className="tiny muted">Last active ${relDays(pr.e.updatedAt)}</div>
        ` : html`
          <b>Ready to start?</b>
          <div className="small muted">Earn ${lessons.length * XP.lesson + XP.course} XP and a certificate when you finish.</div>
          <button className="btn btn-primary" onClick=${start} disabled=${!lessons.length}>Start class<${Icon} n="right" s=${16} /></button>
        `}
        <${ShareButton} course=${course} toast=${toast} />
        ${canManage ? html`<div className="row" style=${{ gap: "8px" }}>
          <a className="btn btn-ghost btn-sm" href=${"#edit-" + course.id} style=${{ flex: 1 }}><${Icon} n="edit" s=${15} />Edit</a>
          ${confirmDel ? html`<button className="btn btn-danger btn-sm" style=${{ flex: 1 }} onClick=${() => actions.deleteCourse(course)}>Confirm delete</button>`
            : html`<button className="btn btn-danger btn-sm" style=${{ flex: 1 }} onClick=${() => setConfirmDel(true)}><${Icon} n="trash" s=${15} />Delete</button>`}
        </div>` : null}
      </div>
    </div>
  </div>`;
}

/* ---------- Lesson player ---------- */
function fmtTime(t) { t = Math.floor(t || 0); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); }
function VideoPlayer({ lesson, startAt, onEnded, onPos }) {
  const vref = useRef(null); const last = useRef(startAt || 0);
  const [blocked, setBlocked] = useState(false); const [ended, setEnded] = useState(false);
  const id = ytId(lesson.url);
  const posRef = useRef(onPos); posRef.current = onPos;
  useEffect(() => {
    if (lesson.assetId || !id) return;
    const f = (e) => { if (String(e.blockedURI || "").indexOf("youtube") !== -1) setBlocked(true); };
    document.addEventListener("securitypolicyviolation", f);
    return () => document.removeEventListener("securitypolicyviolation", f);
  }, [id, lesson.assetId]);
  useEffect(() => {
    const v = vref.current; if (!v) return;
    const meta = () => { if (startAt && v.duration && startAt < v.duration - 5) v.currentTime = startAt; };
    v.addEventListener("loadedmetadata", meta);
    return () => { v.removeEventListener("loadedmetadata", meta); const t = Math.floor(v.currentTime || 0); if (!v.ended && t > 3 && Math.abs(t - last.current) > 3) posRef.current(t); };
  }, [lesson.id]);
  const pause = () => { const v = vref.current; if (!v || v.ended) return; const t = Math.floor(v.currentTime); if (Math.abs(t - last.current) > 3) { last.current = t; posRef.current(t); } };
  const end = () => { setEnded(true); last.current = 0; onEnded(); };

  if (lesson.assetId) return html`<div className="stack" style=${{ gap: "10px" }}>
    ${startAt > 3 ? html`<div className="video-help"><span className="row" style=${{ gap: "6px" }}><${Icon} n="clock" s=${14} />Resuming at ${fmtTime(startAt)}</span></div>` : null}
    <video ref=${vref} className="video-frame" src=${backend.assetUrl(lesson.assetId)} controls playsInline preload="metadata" onPause=${pause} onEnded=${end}></video>
    ${ended ? html`<div className="video-done"><${Icon} n="check" s=${16} w=${3} />Video finished. This lesson is marked complete.</div>` : null}
  </div>`;

  const href = id ? "https://www.youtube.com/watch?v=" + id : lesson.url;
  if (!id || blocked) return html`<div className="stack" style=${{ gap: "10px" }}>
    <a className="video-stage" href=${href} target="_blank" rel="noopener noreferrer" aria-label="Watch this video on YouTube">
      <div className="play"><${Icon} n="play" s=${34} /></div>
      <div className="video-cap"><span>${blocked ? "YouTube can't play inside this page here. Opens on YouTube." : "Opens on YouTube"}</span><span>${lessonMinutes(lesson)} min</span></div>
    </a>
  </div>`;
  const src = "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&modestbranding=1&playsinline=1";
  return html`<div className="stack" style=${{ gap: "10px" }}>
    <iframe className="video-frame" src=${src} title=${lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"></iframe>
    <div className="video-help"><span>Watch the video, then mark this lesson complete.</span>
      <a href=${href} target="_blank" rel="noopener noreferrer" className="row" style=${{ gap: "5px" }}><${Icon} n="ext" s=${13} />Trouble playing? Open on YouTube</a></div>
  </div>`;
}

function LessonContent({ lesson, startAt, onEnded, onPos }) {
  if (lesson.type === "video") {
    return html`<div className="stack" style=${{ gap: "16px" }}>
      <${VideoPlayer} key=${lesson.id} lesson=${lesson} startAt=${startAt} onEnded=${onEnded} onPos=${onPos} />
      ${lesson.body ? html`<${RichText} body=${lesson.body} />` : null}
    </div>`;
  }
  if (lesson.type === "pdf") {
    const src = lesson.assetId ? backend.assetUrl(lesson.assetId) : lesson.url;
    return html`<div className="stack" style=${{ gap: "16px" }}>
      <div className="pdf-card">
        <div style=${{ width: "52px", height: "52px", borderRadius: "14px", background: "var(--surface)", display: "grid", placeItems: "center", color: "var(--gold)" }}><${Icon} n="file" s=${26} /></div>
        <div style=${{ flex: 1, minWidth: 0 }}><b style=${{ color: "var(--ink)" }}>${lesson.fileName || "Lesson PDF"}</b><div className="tiny muted">Read the document, then mark this lesson complete.</div></div>
        ${src ? html`<a className="btn btn-gold btn-sm" href=${src} target="_blank" rel="noopener noreferrer"><${Icon} n="ext" s=${15} />Open PDF</a>` : null}
      </div>
      ${lesson.assetId ? html`<iframe className="pdf-frame" src=${src} title=${lesson.title}></iframe>` : null}
      ${lesson.body ? html`<${RichText} body=${lesson.body} />` : null}
    </div>`;
  }
  return html`<${RichText} body=${lesson.body} />`;
}

function Player({ course, learner, actions }) {
  const pr = course ? progressOf(learner, course) : null;
  const lessons = course ? course.lessons || [] : [];
  const initial = useMemo(() => {
    if (!course) return null;
    const e = pr && pr.e; const last = e && e.last && lessons.find(l => l.id === e.last);
    return last ? last.id : (lessons[0] && lessons[0].id);
  }, [course && course.id]);
  const [cur, setCur] = useState(initial);
  const [resumed] = useState(() => !!(pr && pr.e && pr.e.last && pr.done > 0 && !pr.completed));
  useEffect(() => { if (course && !(pr && pr.enrolled)) actions.enroll(course); }, [course && course.id]);
  useEffect(() => { setCur(initial); }, [initial]);
  if (!course) return html`<${NotFound} />`;
  const idx = Math.max(0, lessons.findIndex(l => l.id === cur));
  const lesson = lessons[idx];
  if (!lesson) return html`<div className="card empty"><h3>This class has no lessons yet</h3><a className="btn btn-ghost" href=${"#course-" + course.id}>Back to class</a></div>`;
  const done = !!(pr.e && (pr.e.done || []).includes(lesson.id));
  const open = (id) => { setCur(id); actions.openLesson(course, id); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const complete = () => {
    const res = actions.completeLesson(course, lesson.id);
    if (res && res.finished) return;
    if (idx < lessons.length - 1) open(lessons[idx + 1].id);
  };
  return html`<div className="page">
    <div className="row between" style=${{ marginBottom: "16px" }}>
      <a href=${"#course-" + course.id} className="btn btn-ghost btn-sm"><${Icon} n="left" s=${15} />${course.title}</a>
      <div className="row" style=${{ gap: "10px", minWidth: "200px", flex: "0 1 300px" }}><div style=${{ flex: 1 }}><${Bar} pct=${pr.pct} /></div><span className="tiny muted num">${pr.pct}%</span></div>
    </div>
    <div className="player">
      <aside className="card lesson-nav">
        <div className="pad" style=${{ paddingBottom: "10px" }}><div className="eyebrow">${course.category}</div><h3 style=${{ marginTop: "4px" }}>${course.title}</h3>
          <div className="tiny muted num" style=${{ marginTop: "4px" }}>${pr.done} of ${pr.total} lessons complete</div></div>
        <div>${lessons.map((l, i) => { const d = pr.e && (pr.e.done || []).includes(l.id); return html`<button key=${l.id} className=${"lnav-item" + (l.id === lesson.id ? " on" : "")} onClick=${() => open(l.id)}>
          <span className=${"check" + (d ? " done" : "")}>${d ? html`<${Icon} n="check" s=${13} w=${3.2} />` : html`<span className="tiny muted">${i + 1}</span>`}</span>
          <span className="t">${l.title}<div className="tiny muted" style=${{ fontWeight: 500 }}>${lessonMinutes(l)} min</div></span>
        </button>`; })}</div>
      </aside>
      <div className="card" key=${lesson.id}>
        <div className="lesson-body page">
          ${resumed && idx === lessons.findIndex(l => l.id === initial) ? html`<div className="resume-note"><${Icon} n="bolt" s=${16} />Welcome back! You're picking up where you left off.</div>` : null}
          <div className="row" style=${{ marginBottom: "10px" }}><span className="tiny muted num">Lesson ${idx + 1} of ${lessons.length}</span><${TypeBadge} type=${lesson.type} /></div>
          <h2 style=${{ marginBottom: "18px" }}>${lesson.title}</h2>
          <${LessonContent} lesson=${lesson} startAt=${(pr.e && pr.e.vpos && pr.e.vpos[lesson.id]) || 0} onEnded=${() => { if (!done) actions.completeLesson(course, lesson.id); }} onPos=${(t) => actions.saveVideoPos(course, lesson.id, t)} />
        </div>
        <div className="player-foot">
          <button className="btn btn-ghost" disabled=${idx === 0} onClick=${() => open(lessons[idx - 1].id)}><${Icon} n="left" s=${16} />Previous</button>
          ${done ? html`<button className="btn btn-ghost" onClick=${() => idx < lessons.length - 1 ? open(lessons[idx + 1].id) : go(pr.completed ? "certificate-" + course.id : "course-" + course.id)}>
              ${idx < lessons.length - 1 ? "Next lesson" : pr.completed ? "View certificate" : "Back to class"}<${Icon} n="right" s=${16} /></button>`
            : html`<button className="btn btn-primary" onClick=${complete}><${Icon} n="check" s=${16} w=${2.6} />${idx < lessons.length - 1 ? "Mark complete & continue" : "Complete class"}<span className="tiny" style=${{ opacity: .8 }}>+${XP.lesson} XP</span></button>`}
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------- My learning ---------- */
function MyLearning({ courses, learner, actions, me, uid }) {
  if (!learner || !courses) return html`<div className="grid"><div className="skel"></div><div className="skel"></div></div>`;
  const lv = levelFor(learner.xp);
  const rows = courses.map(c => ({ c, p: progressOf(learner, c) })).filter(x => x.p.enrolled);
  const inProg = rows.filter(x => !x.p.completed).sort((a, b) => String(b.p.e.updatedAt || "").localeCompare(String(a.p.e.updatedAt || "")));
  const done = rows.filter(x => x.p.completed).sort((a, b) => String(b.p.e.completedAt).localeCompare(String(a.p.e.completedAt)));
  const freq = learner.reminders.freq;
  const email = me && me.email;
  return html`<div className="page">
    <div className="section-h" style=${{ marginTop: 0 }}><div><div className="eyebrow">Your dashboard</div><h1>My learning</h1></div>
      <div className="row" style=${{ gap: "10px" }}>${email ? html`<span className="small muted row" style=${{ gap: "6px" }}><${Icon} n="mail" s=${15} />Signed in as ${email}</span>` : null}
        <button className="btn btn-ghost btn-sm" onClick=${() => { backend.auth.signOut(); location.hash = ""; location.reload(); }}>Sign out</button></div></div>
    <div className="ml-top">
      <div className="card level-card rise">
        <${Ring} pct=${lv.pct} size=${128} stroke=${12}>
          <div><div className="tiny muted">LEVEL</div><b style=${{ fontFamily: "var(--font-display)", fontSize: "38px", lineHeight: 1 }}>${lv.n}</b></div>
        <//>
        <div className="stack" style=${{ gap: "6px", flex: 1, minWidth: "200px" }}>
          <h2>${lv.name}</h2>
          <div className="num"><b style=${{ fontSize: "20px" }}>${learner.xp}</b> <span className="muted">XP total</span></div>
          <${Bar} pct=${lv.pct} kind="gold" />
          <span className="small muted">${lv.next ? lv.toNext + " XP until " + lv.next.name + " (Level " + (lv.n + 1) + ")" : "You've reached the top level. Well done!"}</span>
        </div>
      </div>
      <div className="stat-grid">
        ${[["flame", learner.streak.count, "day streak"], ["book", inProg.length, "in progress"], ["check", done.length, "completed"], ["award", done.length, "certificates"]].map(([ic, v, l], i) => html`
          <div key=${l} className="card stat rise" style=${{ animationDelay: (i + 1) * 60 + "ms" }}><b className="num">${v}</b><span><${Icon} n=${ic} s=${15} />${l}</span></div>`)}
      </div>
    </div>

    <div className="section-h"><div><div className="eyebrow">Pick up where you left off</div><h2>In progress</h2></div></div>
    ${inProg.length ? html`<div className="card">${inProg.map(({ c, p }, i) => { const next = (c.lessons || []).find(l => l.id === p.e.last); return html`
      <div key=${c.id} className="prog-row rise" style=${{ borderTop: i ? "1px solid var(--line)" : "0", animationDelay: i * 50 + "ms" }}>
        <${Cover} course=${c} className="prog-cover" height="72px" />
        <div className="stack" style=${{ gap: "6px", minWidth: 0 }}>
          <a href=${"#course-" + c.id} style=${{ color: "var(--ink)", textDecoration: "none" }}><h3>${c.title}</h3></a>
          <div className="tiny muted">Next: ${next ? next.title : "—"} · last active ${relDays(p.e.updatedAt)}</div>
          <div className="row" style=${{ gap: "10px" }}><div style=${{ flex: 1, minWidth: "120px" }}><${Bar} pct=${p.pct} /></div><span className="tiny muted num">${p.done}/${p.total}</span></div>
        </div>
        <a className="btn btn-primary btn-sm act" href=${"#learn-" + c.id}>Resume<${Icon} n="right" s=${15} /></a>
      </div>`; })}</div>`
      : html`<div className="card empty"><div className="ico-wrap"><${Icon} n="mylearn" s=${28} /></div><h3>Nothing in progress</h3><p className="muted">Start a class and it will show up here so you can come back any time.</p><a className="btn btn-primary" href="#explore">Browse classes</a></div>`}

    <div className="section-h"><div><div className="eyebrow">Certificates</div><h2>Completed classes</h2></div></div>
    ${done.length ? html`<div className="grid">${done.map(({ c, p }, i) => html`<div key=${c.id} className="card rise" style=${{ overflow: "hidden", animationDelay: i * 50 + "ms" }}>
        <${Cover} course=${c} height="90px"><span className="cover-done"><${Icon} n="check" s=${13} w=${3} />Completed</span><//>
        <div className="cbody"><h3>${c.title}</h3><span className="tiny muted">Finished ${fmtDate(p.e.completedAt)}</span>
          <a className="btn btn-gold btn-sm" href=${"#certificate-" + c.id}><${Icon} n="award" s=${15} />Certificate</a></div>
      </div>`)}</div>`
      : html`<div className="card pad muted small">Finish a class to earn your first certificate.</div>`}

    <div className="section-h"><div><div className="eyebrow">Achievements</div><h2>Badges</h2></div><span className="small muted num">${learner.badges.length} of ${BADGES.length} earned</span></div>
    <div className="badges">${BADGES.map((b, i) => { const got = learner.badges.includes(b.id); return html`<div key=${b.id} className=${"card badge rise" + (got ? " got" : "")} style=${{ animationDelay: i * 40 + "ms" }}>
      <div className="medal"><${Icon} n=${b.icon} s=${24} /></div><b className="small">${b.name}</b><span className="tiny muted">${b.desc}</span></div>`; })}</div>

    <div className="section-h"><div><div className="eyebrow">Notifications</div><h2>Reminder settings</h2></div></div>
    <div className="card pad stack" style=${{ gap: "16px" }}>
      <div className="row between"><div><b>How often should we nudge you?</b><div className="small muted">When a class is unfinished, you'll get a reminder after this much time away.</div></div>
        <div className="seg" role="group" aria-label="Reminder frequency">${FREQS.map(f => html`<button key=${f.id} className=${freq === f.id ? "on" : ""} onClick=${() => actions.setReminders({ freq: f.id })}>${f.label}</button>`)}</div></div>
      <div className="row between"><div><b>Email reminders</b><div className="small muted">${email ? "Sent to " + email + " with a link straight back to your lesson." : "Your account email isn't available to this app, so reminders show in the app only."}</div></div>
        <button className=${"switch" + (learner.reminders.email && email ? " on" : "")} aria-pressed=${!!(learner.reminders.email && email)} aria-label="Email reminders" disabled=${!email} onClick=${() => actions.setReminders({ email: !learner.reminders.email })}></button></div>
      <div className="row tiny muted" style=${{ gap: "6px" }}><${Icon} n="bell" s=${14} />In-app reminders appear under the bell icon whenever a class is due.</div>
    </div>
  </div>`;
}

/* ---------- Leaderboard ---------- */
function Leaderboard({ board, user, uid }) {
  const ids = (board || []).map(r => r.id);
  const ps = useProfiles(user, ids);
  const nm = (id) => (ps[id] && ps[id].name) || (id === uid ? "You" : "Learner");
  const av = (id) => ps[id] && ps[id].avatarUrl;
  if (!board) return html`<div className="skel"></div>`;
  const top = board.slice(0, 3);
  const order = top.length === 3 ? [top[1], top[0], top[2]] : top;
  return html`<div className="page">
    <div className="section-h" style=${{ marginTop: 0 }}><div><div className="eyebrow">Community</div><h1>Leaderboard</h1></div><span className="small muted">Ranked by XP earned</span></div>
    ${!board.length ? html`<div className="card empty"><div className="ico-wrap"><${Icon} n="trophy" s=${28} /></div><h3>No one on the board yet</h3><p className="muted">Complete a lesson to claim the first spot.</p></div>` : html`
    ${top.length === 3 ? html`<div className="podium">${order.map((r) => { const rank = board.indexOf(r) + 1; return html`<div key=${r.id} className=${"card pod rise p" + rank} style=${{ animationDelay: rank * 90 + "ms" }}>
        <div className="lb-rank" style=${{ color: rank === 1 ? "var(--gold)" : "var(--muted)" }}>${rank === 1 ? html`<${Icon} n="trophy" s=${22} />` : "#" + rank}</div>
        ${av(r.id) ? html`<img className="av" src=${av(r.id)} alt="" />` : html`<div className="av" style=${{ background: "var(--surface-2)" }}></div>`}
        <b className="small">${nm(r.id)}</b><span className="lvl-pill">Lv ${levelFor(r.xp).n} · ${r.xp} XP</span></div>`; })}</div>` : null}
    <div className="card">${board.map((r, i) => html`<div key=${r.id} className=${"lb-row" + (i === 0 ? " top1" : "") + (r.id === uid ? " me" : "")}>
      <div className="lb-rank num">${i + 1}</div>
      <div className="row" style=${{ gap: "12px", minWidth: 0 }}>${av(r.id) ? html`<img className="av" src=${av(r.id)} alt="" />` : html`<div className="av" style=${{ background: "var(--surface-2)" }}></div>`}
        <div style=${{ minWidth: 0 }}><b>${nm(r.id)}</b><div className="tiny muted">${levelFor(r.xp).name} · ${plural(r.completed || 0, "class")} completed</div></div></div>
      <div className="num" style=${{ fontWeight: 700 }}>${r.xp} XP</div>
    </div>`)}</div>`}
  </div>`;
}

/* ---------- Certificate ---------- */
function drawCertificate(name, course, date, certId, logoImg) {
  const W = 2000, H = 1414, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const x = cv.getContext("2d");
  x.fillStyle = "#FFFDF6"; x.fillRect(0, 0, W, H);
  x.strokeStyle = "#C9A34A"; x.lineWidth = 6; x.strokeRect(40, 40, W - 80, H - 80);
  x.strokeStyle = "#E3CF97"; x.lineWidth = 2; x.strokeRect(62, 62, W - 124, H - 124);
  x.textAlign = "center"; x.fillStyle = "#7A6328";
  if (logoImg) { const lh = 200, lw = lh * logoImg.width / logoImg.height; x.drawImage(logoImg, W / 2 - lw / 2, 110, lw, lh); }
  else { x.font = "700 30px 'Instrument Sans', sans-serif"; x.fillText(ORG.toUpperCase(), W / 2, 250); }
  x.fillStyle = "#1B2340"; x.font = "800 110px 'Bricolage Grotesque', sans-serif"; x.fillText("Certificate of Completion", W / 2, 430);
  x.fillStyle = "#4A536B"; x.font = "400 38px 'Instrument Sans', sans-serif"; x.fillText("This certifies that", W / 2, 520);
  x.fillStyle = "#2447A6"; x.font = "700 100px 'Bricolage Grotesque', sans-serif"; x.fillText(name, W / 2, 660);
  x.strokeStyle = "#C9A34A"; x.lineWidth = 3; x.beginPath(); x.moveTo(W / 2 - 520, 700); x.lineTo(W / 2 + 520, 700); x.stroke();
  x.fillStyle = "#4A536B"; x.font = "400 38px 'Instrument Sans', sans-serif"; x.fillText("has successfully completed the online class", W / 2, 790);
  x.fillStyle = "#1B2340"; x.font = "700 60px 'Instrument Sans', sans-serif"; x.fillText(course, W / 2, 880);
  x.textAlign = "left"; x.fillStyle = "#4A536B"; x.font = "500 32px 'Instrument Sans', sans-serif";
  x.fillText("Awarded " + date, 180, 1220); x.fillText("Certificate ID " + certId, 180, 1270);
  x.beginPath(); x.arc(W - 300, 1180, 120, 0, Math.PI * 2); const g = x.createRadialGradient(W - 340, 1140, 10, W - 300, 1180, 120); g.addColorStop(0, "#F3C55C"); g.addColorStop(1, "#B9860F"); x.fillStyle = g; x.fill();
  x.textAlign = "center"; x.fillStyle = "#3A2600"; x.font = "800 34px 'Bricolage Grotesque', sans-serif"; x.fillText("CENTRAL", W - 300, 1170); x.fillText("UNION", W - 300, 1210);
  return cv;
}
function Certificate({ course, learner, me, downloads, toast }) {
  if (!course) return html`<${NotFound} />`;
  const pr = progressOf(learner, course);
  if (!pr.completed) return html`<div className="page card empty"><div className="ico-wrap"><${Icon} n="award" s=${28} /></div><h3>Certificate locked</h3><p className="muted">Finish all ${pr.total} lessons of ${course.title} to earn this certificate. You're at ${pr.pct}%.</p><a className="btn btn-primary" href=${"#learn-" + course.id}>Continue class</a></div>`;
  const name = (me && me.name) || "Central Union Learner";
  const date = fmtDate(pr.e.completedAt); const certId = pr.e.certId || "CU-" + course.id.toUpperCase();
  const save = async () => {
    try {
      await document.fonts.ready;
      const logoImg = await new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = BRAND.logoDeep; });
      const cv = drawCertificate(name, course.title, date, certId, logoImg);
      const blob = await new Promise(r => cv.toBlob(r, "image/png"));
      await downloads.save({ filename: "Certificate - " + course.title.replace(/[^\w\s-]/g, "") + ".png", data: blob });
      toast("Certificate saved", "download");
    } catch (e) { if (e && e.code !== "declined") toast("Couldn't save the certificate (" + ((e && e.code) || "error") + ")", "x"); }
  };
  return html`<div className="page stack" style=${{ gap: "18px" }}>
    <div className="row between"><a href="#my-learning" className="btn btn-ghost btn-sm"><${Icon} n="left" s=${15} />My learning</a>
      ${downloads ? html`<button className="btn btn-gold" onClick=${save}><${Icon} n="download" s=${17} />Download PNG</button>` : null}</div>
    <div className="cert-wrap"><div className="cert">
      <img className="c-org" src=${BRAND.logoDeep} alt="Central Union Church of Christ" />
      <div className="c-title">Certificate of Completion</div>
      <div className="muted" style=${{ color: "#4A536B" }}>This certifies that</div>
      <div className="c-name">${name}</div>
      <div style=${{ color: "#4A536B" }}>has successfully completed the online class</div>
      <div className="c-course">${course.title}</div>
      <div className="c-foot"><span>Awarded ${date}</span><span>Certificate ID ${certId}</span></div>
      <div className="seal"><${Icon} n="award" s=${40} /></div>
    </div></div>
  </div>`;
}

/* ---------- Course editor ---------- */
function blankLesson(type) { return { id: uidGen("l"), title: "", type: type || "text", minutes: "", body: "", url: "", assetId: "", fileName: "" }; }
function Editor({ course, cats, actions, assets, uid, canManage }) {
  const isNew = !course;
  const [f, setF] = useState(() => course ? clone(course) : { title: "", description: "", category: cats[0] || "Church Life", tags: [], hue: HUES[0], lessons: [blankLesson("text")] });
  const [newCat, setNewCat] = useState(""); const [tagDraft, setTagDraft] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [uploading, setUploading] = useState(null);
  if (course && !canManage) return html`<div className="card empty"><h3>Only the class author or an editor can change this class</h3><a className="btn btn-ghost" href=${"#course-" + course.id}>Back to class</a></div>`;
  const set = (k, v) => setF(o => Object.assign({}, o, { [k]: v }));
  const setL = (i, k, v) => setF(o => { const ls = o.lessons.slice(); ls[i] = Object.assign({}, ls[i], { [k]: v }); return Object.assign({}, o, { lessons: ls }); });
  const move = (i, d) => setF(o => { const ls = o.lessons.slice(); const j = i + d; if (j < 0 || j >= ls.length) return o; [ls[i], ls[j]] = [ls[j], ls[i]]; return Object.assign({}, o, { lessons: ls }); });
  const remove = (i) => setF(o => Object.assign({}, o, { lessons: o.lessons.filter((_, k) => k !== i) }));
  const addTag = () => { const t = tagDraft.trim().toLowerCase().replace(/^#/, "").replace(/\s+/g, "-").slice(0, 30); if (t && !f.tags.includes(t)) set("tags", f.tags.concat(t)); setTagDraft(""); };
  const upload = async (i, file, kind) => {
    if (!file) return;
    if (kind === "video") {
      if (!/^video\/(mp4|webm|quicktime|ogg)/.test(file.type)) { setErr("Please choose an MP4, WebM or MOV video file."); return; }
      if (file.size > 20 * 1024 * 1024) { setErr("Video files must be under 20 MB. For longer videos, paste a YouTube link instead."); return; }
    } else if (file.type !== "application/pdf") { setErr("Please choose a PDF file."); return; }
    if (!assets) { setErr("File upload isn't available for your account here. Paste a link instead."); return; }
    setUploading(i); setErr("");
    try { const r = await assets.upload(file); setF(o => { const ls = o.lessons.slice(); ls[i] = Object.assign({}, ls[i], { assetId: r.id, fileName: file.name, url: "" }); return Object.assign({}, o, { lessons: ls }); }); }
    catch (e) { setErr("Upload failed: " + ((e && e.message) || "please try again.")); }
    setUploading(null);
  };
  const save = async () => {
    const category = newCat.trim() || f.category;
    if (!f.title.trim()) return setErr("Give the class a title.");
    if (!f.description.trim()) return setErr("Add a short description so people know what they'll learn.");
    if (!f.lessons.length) return setErr("Add at least one lesson.");
    for (let i = 0; i < f.lessons.length; i++) {
      const l = f.lessons[i];
      if (!l.title.trim()) return setErr("Lesson " + (i + 1) + " needs a title.");
      if (l.type === "video" && !l.assetId && !ytId(l.url)) return setErr("Lesson " + (i + 1) + ": paste a full YouTube link (youtube.com/watch?v=… or youtu.be/…) or upload a video file.");
      if (l.type === "pdf" && !l.assetId && !/^https?:\/\//.test(l.url || "")) return setErr("Lesson " + (i + 1) + ": upload a PDF or paste a link to one.");
      if (l.type === "text" && !l.body.trim()) return setErr("Lesson " + (i + 1) + " needs some text content.");
    }
    setErr(""); setBusy(true);
    const data = { title: f.title.trim(), description: f.description.trim(), category, tags: f.tags, hue: f.hue,
      lessons: f.lessons.map(l => ({ id: l.id, title: l.title.trim(), type: l.type, minutes: Number(l.minutes) || 0, body: l.body || "", url: (l.type === "video" || l.type === "pdf") && !l.assetId ? (l.url || "").trim() : "", assetId: l.type !== "text" ? l.assetId || "" : "", fileName: l.type !== "text" ? l.fileName || "" : "" })) };
    const ok = await actions.saveCourse(course, data);
    setBusy(false);
    if (!ok) setErr("Couldn't save the class. You may need Contributor access to this app; ask the person who shared it.");
  };
  return html`<div className="page">
    <div className="section-h" style=${{ marginTop: 0 }}><div><div className="eyebrow">${isNew ? "New class" : "Edit class"}</div><h1>${isNew ? "Create a class" : f.title || "Edit class"}</h1></div>
      <a className="btn btn-ghost btn-sm" href=${isNew ? "#explore" : "#course-" + course.id}>Cancel</a></div>
    <div className="detail-grid" style=${{ marginTop: 0 }}>
      <div className="stack" style=${{ gap: "18px" }}>
        <div className="card pad stack" style=${{ gap: "14px" }}>
          <div className="field"><label htmlFor="c-title">Class title</label><input id="c-title" className="input" value=${f.title} onChange=${e => set("title", e.target.value)} placeholder="e.g. Foundations of Prayer" maxLength="90" /></div>
          <div className="field"><label htmlFor="c-desc">Description</label><textarea id="c-desc" className="textarea" style=${{ minHeight: "90px" }} value=${f.description} onChange=${e => set("description", e.target.value)} placeholder="What will people learn, and who is it for?" maxLength="400"></textarea></div>
          <div className="form-grid">
            <div className="field"><label htmlFor="c-cat">Category</label>
              <select id="c-cat" className="select" value=${f.category} onChange=${e => set("category", e.target.value)}>${cats.map(c => html`<option key=${c} value=${c}>${c}</option>`)}</select></div>
            <div className="field"><label htmlFor="c-newcat">Or create a new category</label><input id="c-newcat" className="input" value=${newCat} onChange=${e => setNewCat(e.target.value)} placeholder="e.g. Missions" maxLength="40" /></div>
          </div>
          <div className="field"><label htmlFor="c-tag">Tags</label>
            <div className="tag-input">${f.tags.map(t => html`<span key=${t} className="tag on">#${t}<button aria-label=${"Remove tag " + t} onClick=${() => set("tags", f.tags.filter(x => x !== t))} style=${{ border: 0, background: "none", cursor: "pointer", color: "inherit", padding: 0, display: "grid" }}><${Icon} n="x" s=${12} w=${3} /></button></span>`)}
              <input id="c-tag" value=${tagDraft} onChange=${e => setTagDraft(e.target.value)} onKeyDown=${e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }} onBlur=${addTag} placeholder="Type a tag and press Enter" /></div></div>
          <div className="field"><label>Cover color</label><div className="hue-pick">${HUES.map(h => html`<button key=${h} aria-label=${"Cover color " + h} className=${f.hue === h ? "on" : ""} style=${{ background: coverBg(h) }} onClick=${() => set("hue", h)}></button>`)}</div></div>
        </div>

        <div className="row between"><h2>Lessons</h2><span className="small muted">${plural(f.lessons.length, "lesson")}</span></div>
        ${f.lessons.map((l, i) => html`<div key=${l.id} className="lesson-edit">
          <div className="row between">
            <b>Lesson ${i + 1}</b>
            <div className="row" style=${{ gap: "6px" }}>
              <button className="icon-btn" style=${{ width: "34px", height: "34px" }} aria-label="Move up" onClick=${() => move(i, -1)} disabled=${i === 0}><${Icon} n="up" s=${16} /></button>
              <button className="icon-btn" style=${{ width: "34px", height: "34px" }} aria-label="Move down" onClick=${() => move(i, 1)} disabled=${i === f.lessons.length - 1}><${Icon} n="down" s=${16} /></button>
              <button className="icon-btn" style=${{ width: "34px", height: "34px", color: "var(--bad)" }} aria-label="Remove lesson" onClick=${() => remove(i)}><${Icon} n="trash" s=${16} /></button>
            </div>
          </div>
          <div className="type-pick" role="group" aria-label="Lesson type">${[["text", "text", "Text"], ["video", "play", "YouTube video"], ["pdf", "file", "PDF"]].map(([t, ic, lab]) => html`<button key=${t} className=${l.type === t ? "on" : ""} onClick=${() => { if (l.type !== t) { setL(i, "assetId", ""); setL(i, "fileName", ""); } setL(i, "type", t); }}><${Icon} n=${ic} s=${14} />${lab}</button>`)}</div>
          <div className="form-grid" style=${{ gridTemplateColumns: "1fr 120px" }}>
            <div className="field"><label htmlFor=${"lt-" + l.id}>Lesson title</label><input id=${"lt-" + l.id} className="input" value=${l.title} onChange=${e => setL(i, "title", e.target.value)} maxLength="100" /></div>
            <div className="field"><label htmlFor=${"lm-" + l.id}>Minutes</label><input id=${"lm-" + l.id} className="input num" type="number" min="1" max="600" value=${l.minutes} onChange=${e => setL(i, "minutes", e.target.value)} placeholder=${String(lessonMinutes(l))} /></div>
          </div>
          ${l.type === "video" ? html`<div className="stack" style=${{ gap: "8px" }}>
            ${l.assetId ? html`<div className="row small"><${Icon} n="play" s=${16} /><b>${l.fileName || "Uploaded video"}</b><span className="hint">Plays right in the lesson</span><button className="btn btn-ghost btn-sm" onClick=${() => { setL(i, "assetId", ""); setL(i, "fileName", ""); }}>Replace</button></div>`
              : html`<div className="field"><label htmlFor=${"lu-" + l.id}>YouTube link</label>
                <div className="row"><input id=${"lu-" + l.id} className="input" style=${{ flex: 1, minWidth: "220px" }} value=${l.url} onChange=${e => setL(i, "url", e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
                ${assets ? html`<span className="tiny muted">or</span><label className="btn btn-ghost btn-sm" style=${{ cursor: "pointer" }}><${Icon} n="upload" s=${15} />${uploading === i ? "Uploading…" : "Upload video file"}<input type="file" accept="video/mp4,video/webm,video/quicktime" style=${{ display: "none" }} onChange=${e => upload(i, e.target.files[0], "video")} /></label>` : null}</div>
                ${l.url && !ytId(l.url) ? html`<span className="err">That doesn't look like a YouTube video link.</span>` : l.url ? html`<span className="hint" style=${{ color: "var(--good)" }}>Video found.</span>` : html`<span className="hint">Uploaded files (MP4, WebM or MOV, under 20 MB) play right in the lesson and remember where each person stopped.</span>`}</div>`}
          </div>` : null}
          ${l.type === "pdf" ? html`<div className="stack" style=${{ gap: "8px" }}>
            ${l.assetId ? html`<div className="row small"><${Icon} n="file" s=${16} /><b>${l.fileName || "Uploaded PDF"}</b><button className="btn btn-ghost btn-sm" onClick=${() => { setL(i, "assetId", ""); setL(i, "fileName", ""); }}>Replace</button></div>`
              : html`<div className="row">
                ${assets ? html`<label className="btn btn-ghost btn-sm" style=${{ cursor: "pointer" }}><${Icon} n="upload" s=${15} />${uploading === i ? "Uploading…" : "Upload PDF"}<input type="file" accept="application/pdf" style=${{ display: "none" }} onChange=${e => upload(i, e.target.files[0], "pdf")} /></label><span className="tiny muted">or</span>` : null}
                <input className="input" style=${{ flex: 1, minWidth: "200px" }} aria-label="PDF link" value=${l.url} onChange=${e => setL(i, "url", e.target.value)} placeholder="Paste a link to a PDF (https://…)" /></div>`}
          </div>` : null}
          <div className="field"><label htmlFor=${"lb-" + l.id}>${l.type === "text" ? "Lesson content" : "Notes (optional)"}</label>
            <textarea id=${"lb-" + l.id} className="textarea" style=${{ minHeight: l.type === "text" ? "180px" : "80px" }} value=${l.body} onChange=${e => setL(i, "body", e.target.value)} placeholder=${l.type === "text" ? "Write the lesson. Use # for a heading, - for bullet points, **bold** for emphasis." : "Anything to read alongside the video or PDF"}></textarea></div>
        </div>`)}
        <div className="row">${[["text", "text", "Add text lesson"], ["video", "play", "Add video"], ["pdf", "file", "Add PDF"]].map(([t, ic, lab]) => html`<button key=${t} className="btn btn-ghost" onClick=${() => set("lessons", f.lessons.concat(blankLesson(t)))}><${Icon} n=${ic} s=${15} />${lab}</button>`)}</div>
      </div>
      <div className="card pad side-card stack" style=${{ gap: "14px" }}>
        <b>Preview</b>
        <div className="card" style=${{ overflow: "hidden", boxShadow: "none" }}>
          <${Cover} course=${{ hue: f.hue, category: newCat || f.category }} height="110px"><span className="cover-cat">${newCat || f.category}</span><//>
          <div className="cbody"><h3>${f.title || "Class title"}</h3><p>${f.description || "Description"}</p>
            <div className="meta"><span><${Icon} n="book" s=${14} />${plural(f.lessons.length, "lesson")}</span><span><${Icon} n="clock" s=${14} />${courseMinutes(f)} min</span></div></div>
        </div>
        ${err ? html`<div className="err" role="alert">${err}</div>` : null}
        <button className="btn btn-primary" onClick=${save} disabled=${busy}>${busy ? "Saving…" : isNew ? "Publish class" : "Save changes"}</button>
        ${isNew ? html`<span className="tiny muted">Publishing earns you ${XP.create} XP and the Teacher badge. The class appears for everyone right away.</span>` : null}
      </div>
    </div>
  </div>`;
}

/* ---------- Admin ---------- */
function Admin({ learnersAll, courses, user, toast }) {
  const ids = (learnersAll || []).map(l => l.id);
  const ps = useProfiles(user, ids);
  if (!learnersAll) return html`<div className="skel"></div>`;
  const rows = learnersAll.map(l => {
    const inc = (l.incomplete || []);
    const due = l.nextReminderAt && new Date(l.nextReminderAt).getTime() <= Date.now() && inc.length && l.reminders && l.reminders.freq !== "off";
    return Object.assign({}, l, { inc, due });
  }).sort((a, b) => (b.due ? 1 : 0) - (a.due ? 1 : 0) || (b.xp || 0) - (a.xp || 0));
  const dueEmails = rows.filter(r => r.due && r.email).map(r => r.email);
  const copyDue = async () => { try { await navigator.clipboard.writeText(dueEmails.join(", ")); toast("Copied " + plural(dueEmails.length, "email"), "copy"); } catch (e) { toast("Copy isn't allowed here", "x"); } };
  const totalCompletions = rows.reduce((a, r) => a + Object.values(r.enrolled || {}).filter(e => e.completedAt).length, 0);
  return html`<div className="page">
    <div className="section-h" style=${{ marginTop: 0 }}><div><div className="eyebrow">Editors only</div><h1>Learner overview</h1></div>
      <button className="btn btn-ghost btn-sm" onClick=${copyDue} disabled=${!dueEmails.length}><${Icon} n="copy" s=${15} />Copy emails due for a reminder (${dueEmails.length})</button></div>
    <div className="stat-grid" style=${{ gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", marginBottom: "18px" }}>
      ${[["users", rows.length, "learners"], ["book", (courses || []).length, "classes"], ["award", totalCompletions, "completions"], ["bell", rows.filter(r => r.due).length, "reminders due"]].map(([ic, v, l]) => html`<div key=${l} className="card stat"><b className="num">${v}</b><span><${Icon} n=${ic} s=${15} />${l}</span></div>`)}
    </div>
    <div className="card tbl-wrap"><table>
      <thead><tr><th>Learner</th><th>Level</th><th>In progress</th><th>Completed</th><th>Last active</th><th>Reminder</th></tr></thead>
      <tbody>${rows.map(r => html`<tr key=${r.id}>
        <td><b>${(ps[r.id] && ps[r.id].name) || "Learner"}</b><div className="tiny muted">${r.email || "no email on file"}</div></td>
        <td className="num">Lv ${levelFor(r.xp || 0).n} · ${r.xp || 0} XP</td>
        <td>${r.inc.length ? r.inc.map(x => html`<div key=${x.courseId} className="tiny">${x.title} <span className="muted num">${x.pct}%</span></div>`) : html`<span className="muted">—</span>`}</td>
        <td className="num">${Object.values(r.enrolled || {}).filter(e => e.completedAt).length}</td>
        <td className="small">${relDays(r.lastActive)}</td>
        <td>${!r.inc.length || (r.reminders && r.reminders.freq === "off") ? html`<span className="pill off">${r.inc.length ? "Off" : "None needed"}</span>` : r.due ? html`<span className="pill due">Due now</span>` : html`<span className="pill ok">${fmtDate(r.nextReminderAt)}</span>`}</td>
      </tr>`)}
      ${!rows.length ? html`<tr><td colSpan="6" className="muted">No learners yet.</td></tr>` : null}</tbody>
    </table></div>
    <p className="small muted" style=${{ marginTop: "12px", maxWidth: "70ch" }}>Each learner chooses a reminder frequency on their My learning page. A learner is "due" once they've been away from an unfinished class for that long. Email reminders go to learners who opted in.</p>
  </div>`;
}

function NotFound() {
  return html`<div className="card empty page"><div className="ico-wrap"><${Icon} n="search" s=${28} /></div><h3>We couldn't find that class</h3><p className="muted">It may have been removed, or the link is incomplete.</p><a className="btn btn-primary" href="#explore">Browse classes</a></div>`;
}


/* ---------- Sign in (by email) ---------- */
function SignIn() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [err, setErr] = useState("");
  const returning = email.includes("@") && backend.auth.isReturning(email);
  const submit = (e) => {
    e.preventDefault();
    try { backend.auth.signIn({ name, email }); location.reload(); }
    catch (x) { setErr(x.message || "Couldn't sign you in."); }
  };
  return html`<div className="signin-wrap page">
    <div className="hero-main signin-hero rise">
      <div>
        <div className="eyebrow" style=${{ color: "inherit", opacity: .8 }}>${ORG}</div>
        <h1 style=${{ marginTop: "8px" }}>Grow in faith, one lesson at a time.</h1>
        <p>Sign in with your email to start a class, or to pick up right where you left off.</p>
      </div>
      <img className="hero-logo" src=${BRAND.logo} alt="Central Union Church of Christ logo" />
    </div>
    <form className="card pad stack signin-card rise" style=${{ gap: "14px", animationDelay: "90ms" }} onSubmit=${submit}>
      <h2>${returning ? "Welcome back" : "Sign in to your classes"}</h2>
      <div className="field"><label htmlFor="si-email">Email</label><input id="si-email" className="input" type="email" autoComplete="email" required value=${email} onChange=${e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
      <div className="field"><label htmlFor="si-name">Your name ${returning ? html`<span className="muted">(optional)</span>` : null}</label><input id="si-name" className="input" autoComplete="name" value=${name} onChange=${e => setName(e.target.value)} placeholder="Shown on your certificates" /></div>
      ${err ? html`<div className="err" role="alert">${err}</div>` : null}
      <button className="btn btn-primary" type="submit">${returning ? "Continue learning" : "Start learning"}<${Icon} n="right" s=${16} /></button>
      <span className="tiny muted">Use the same email each time and your progress, levels and certificates come right back.</span>
    </form>
  </div>`;
}

/* ---------- App ---------- */
function initialTheme() {
  try { const t = localStorage.getItem("cu-theme"); if (t === "dark" || t === "light") return t; } catch (e) {}
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function App() {
  const [theme, setTheme] = useState(initialTheme);
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); try { localStorage.setItem("cu-theme", theme); } catch (e) {} }, [theme]);
  const [route, setRoute] = useState(parseHash);
  useEffect(() => { const f = () => { setRoute(parseHash()); window.scrollTo({ top: 0, behavior: "smooth" }); }; window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);

  const [toasts, setToasts] = useState([]);
  const toast = useCallback((text, icon, kind) => { const id = Math.random(); setToasts(t => t.concat({ id, text, icon, kind })); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200); }, []);
  const [modal, setModal] = useState(null);

  const [svc, setSvc] = useState({ ready: false });
  useEffect(() => { (async () => {
    const me = await backend.user.me();
    if (!me) { setSvc({ ready: true, signedOut: true }); return; }
    setSvc({ ready: true, db: backend.db, user: backend.user, assets: backend.assets, downloads: backend.downloads, uid: me.id, me, canEdit: !!me.canEdit });
  })(); }, []);

  const [courses, setCourses] = useState(null); const [loadNote, setLoadNote] = useState("");
  useEffect(() => {
    if (!svc.ready) return;
    if (!svc.db) return;
    const t = setTimeout(() => setLoadNote("Classes can't be reached yet. Check your connection; this will update on its own."), 10000);
    const un = svc.db.collection("courses").onSnapshot(s => { if (!s.metadata.fromCache) { clearTimeout(t); setLoadNote(""); } setCourses(s.docs.map(d => Object.assign({}, d.data(), { id: d.id }))); },
      e => { clearTimeout(t); setLoadNote("Classes couldn't load (" + e.code + ")."); setCourses(c => c || []); });
    return () => { clearTimeout(t); un(); };
  }, [svc.ready, svc.db]);

  const [learner, setLearner] = useState(null);
  const learnerRef = useRef(null);
  useEffect(() => { learnerRef.current = learner; }, [learner]);
  useEffect(() => {
    if (!svc.ready) return;
    if (!svc.db) return;
    const un = svc.db.doc("learners/" + svc.uid).onSnapshot(s => setLearner(normalizeLearner(s.exists ? s.data() : null)), () => setLearner(l => l || newLearner()));
    return un;
  }, [svc.ready, svc.db, svc.uid]);

  const [board, setBoard] = useState(null);
  useEffect(() => {
    if (!svc.ready) return;
    if (!svc.db) { setBoard([]); return; }
    const un = svc.db.collection("leaderboard").orderBy("xp", "desc").limit(25).onSnapshot(s => setBoard(s.docs.map(d => Object.assign({}, d.data(), { id: d.id }))), () => setBoard([]));
    return un;
  }, [svc.ready, svc.db]);

  const [learnersAll, setLearnersAll] = useState(null);
  useEffect(() => {
    if (!svc.db || !svc.canEdit) return;
    const un = svc.db.collection("learners").onSnapshot(s => setLearnersAll(s.docs.map(d => Object.assign({}, d.data(), { id: d.id }))), () => setLearnersAll([]));
    return un;
  }, [svc.db, svc.canEdit]);

  const coursesRef = useRef([]); useEffect(() => { coursesRef.current = courses || []; }, [courses]);
  const chain = useRef(Promise.resolve()); const lbChain = useRef(Promise.resolve());
  const warned = useRef(false);

  const finalize = (l) => {
    const cs = coursesRef.current; const byId = {}; cs.forEach(c => byId[c.id] = c);
    const inc = []; let last = null;
    Object.entries(l.enrolled).forEach(([cid, e]) => {
      if (e.updatedAt && (!last || e.updatedAt > last)) last = e.updatedAt;
      const c = byId[cid]; if (!c || e.completedAt) return;
      const p = progressOf(l, c); const nx = (c.lessons || []).find(x => x.id === e.last);
      inc.push({ courseId: cid, title: c.title, pct: p.pct, next: nx ? nx.title : "", updatedAt: e.updatedAt || null });
    });
    l.incomplete = inc; l.lastActive = last || l.lastActive || null;
    const days = freqDays(l.reminders.freq);
    l.nextReminderAt = days && inc.length && l.lastActive ? new Date(new Date(l.lastActive).getTime() + days * 864e5).toISOString() : null;
    l.email = l.reminders.email && svc.me && svc.me.email ? svc.me.email : null;
    l.name = (svc.me && svc.me.name) || "";
    l.updatedAt = nowIso();
    return l;
  };
  const commit = (l, lb) => {
    l = finalize(l); learnerRef.current = l; setLearner(l);
    if (!svc.db) { try { localStorage.setItem("cu-learner", JSON.stringify(l)); } catch (e) {} return; }
    const snapshot = clone(l);
    chain.current = chain.current.then(() => svc.db.doc("learners/" + svc.uid).set(snapshot)).catch(e => {
      if (!warned.current) { warned.current = true; toast(e && e.code === "invalid_argument" ? "Progress can't be saved: ask for Contributor access to this app." : "Progress didn't save. We'll retry on your next step.", "x"); }
    });
    if (lb) {
      const done = Object.values(l.enrolled).filter(e => e.completedAt).length;
      const row = { xp: l.xp, completed: done, updatedAt: l.updatedAt };
      lbChain.current = lbChain.current.then(() => svc.db.doc("leaderboard/" + svc.uid).set(row)).catch(() => {});
    }
  };
  const stats = (l) => {
    const cs = coursesRef.current; const byId = {}; cs.forEach(c => byId[c.id] = c);
    let lessons = 0, coursesDone = 0; const cats = new Set();
    Object.entries(l.enrolled).forEach(([cid, e]) => { lessons += (e.done || []).length; if (e.completedAt) coursesDone++; if ((e.done || []).length && byId[cid]) cats.add(byId[cid].category); });
    return { lessons, courses: coursesDone, bestStreak: l.streak.best || 0, cats: cats.size, created: cs.filter(c => c.authorId && c.authorId === svc.uid).length };
  };
  const award = (l, before, beforeBadges) => {
    const s = stats(l);
    const earned = BADGES.filter(b => b.test(s)).map(b => b.id);
    l.badges = Array.from(new Set(beforeBadges.concat(earned)));
    const fresh = l.badges.filter(b => !beforeBadges.includes(b));
    const after = levelFor(l.xp).idx;
    return { fresh, levelUp: after > before };
  };
  const touchStreak = (l) => {
    const today = dayKey(); if (l.streak.last === today) return 0;
    const y = new Date(); y.setDate(y.getDate() - 1);
    l.streak.count = l.streak.last === dayKey(y) ? l.streak.count + 1 : 1;
    l.streak.best = Math.max(l.streak.best || 0, l.streak.count); l.streak.last = today;
    l.xp += XP.streakDay; return XP.streakDay;
  };

  const actions = {
    enroll(course) {
      const l = clone(learnerRef.current || newLearner());
      if (l.enrolled[course.id]) return;
      l.enrolled[course.id] = { startedAt: nowIso(), updatedAt: nowIso(), done: [], last: (course.lessons[0] || {}).id || null };
      commit(l, false);
    },
    openLesson(course, lessonId) {
      const l = clone(learnerRef.current || newLearner()); const e = l.enrolled[course.id];
      if (!e || e.last === lessonId) return;
      e.last = lessonId; e.updatedAt = nowIso(); commit(l, false);
    },
    completeLesson(course, lessonId) {
      const l = clone(learnerRef.current || newLearner());
      const before = levelFor(l.xp).idx; const bb = l.badges.slice();
      const e = l.enrolled[course.id] || { startedAt: nowIso(), done: [] };
      let gained = 0;
      if (!(e.done || []).includes(lessonId)) { e.done = (e.done || []).concat(lessonId); l.xp += XP.lesson; gained += XP.lesson; }
      gained += touchStreak(l);
      const ids = (course.lessons || []).map(x => x.id);
      let finished = false;
      if (ids.length && ids.every(i => e.done.includes(i)) && !e.completedAt) {
        e.completedAt = nowIso(); e.certId = "CU-" + Date.now().toString(36).toUpperCase().slice(-6) + "-" + Math.random().toString(36).slice(2, 5).toUpperCase();
        l.xp += XP.course; gained += XP.course; finished = true;
      }
      const i0 = ids.indexOf(lessonId);
      e.last = ids.slice(i0 + 1).find(i => !e.done.includes(i)) || ids.find(i => !e.done.includes(i)) || lessonId;
      if (e.vpos && e.vpos[lessonId] != null) { e.vpos = Object.assign({}, e.vpos); delete e.vpos[lessonId]; }
      e.updatedAt = nowIso(); l.enrolled[course.id] = e;
      const { fresh, levelUp } = award(l, before, bb);
      commit(l, true);
      if (gained) toast("+" + gained + " XP", "bolt", "xp");
      fresh.forEach((b, k) => setTimeout(() => { const bd = BADGES.find(x => x.id === b); toast("Badge earned: " + bd.name, "award", "xp"); }, 600 + k * 500));
      if (finished) { confetti(); setModal({ kind: "complete", course, levelUp: levelUp ? levelFor(l.xp) : null }); }
      else if (levelUp) { confetti(); setModal({ kind: "level", lv: levelFor(l.xp) }); }
      return { finished };
    },
    saveVideoPos(course, lessonId, sec) {
      const l = clone(learnerRef.current || newLearner()); const e = l.enrolled[course.id];
      if (!e) return;
      e.vpos = Object.assign({}, e.vpos || {}, { [lessonId]: sec }); e.last = lessonId; e.updatedAt = nowIso();
      commit(l, false);
    },
    setReminders(patch) {
      const l = clone(learnerRef.current || newLearner()); l.reminders = Object.assign({}, l.reminders, patch);
      commit(l, false); toast("Reminder settings saved", "bell");
    },
    async saveCourse(existing, data) {
      if (!svc.db) { toast("Sign in to publish classes.", "x"); return false; }
      const id = existing ? existing.id : uidGen("c");
      const doc = Object.assign({}, existing || {}, data, { updatedAt: nowIso() });
      delete doc.id;
      if (!existing) { doc.createdAt = nowIso(); doc.authorId = svc.uid; }
      try { await svc.db.doc("courses/" + id).set(doc); }
      catch (e) { return false; }
      if (!existing) {
        const l = clone(learnerRef.current || newLearner()); const before = levelFor(l.xp).idx; const bb = l.badges.slice();
        l.xp += XP.create; coursesRef.current = coursesRef.current.concat(Object.assign({ id }, doc));
        const { fresh, levelUp } = award(l, before, bb); commit(l, true);
        toast("Class published · +" + XP.create + " XP", "check", "xp");
        fresh.forEach(b => setTimeout(() => toast("Badge earned: " + BADGES.find(x => x.id === b).name, "award", "xp"), 700));
        if (levelUp) { confetti(); setModal({ kind: "level", lv: levelFor(l.xp) }); }
      } else toast("Changes saved", "check");
      go("course-" + id); return true;
    },
    async deleteCourse(course) {
      try { await svc.db.doc("courses/" + course.id).delete(); toast("Class deleted", "trash"); go("explore"); }
      catch (e) { toast("Couldn't delete this class.", "x"); }
    }
  };

  /* reminders due (in-app) */
  const dueList = useMemo(() => {
    if (!learner || !courses) return [];
    const days = freqDays(learner.reminders.freq);
    return courses.map(c => ({ c, p: progressOf(learner, c) })).filter(x => x.p.enrolled && !x.p.completed && (x.c.lessons || []).length)
      .map(x => Object.assign(x, { away: daysSince(x.p.e.updatedAt), due: days ? daysSince(x.p.e.updatedAt) >= days : false }))
      .sort((a, b) => (b.due ? 1 : 0) - (a.due ? 1 : 0) || b.away - a.away);
  }, [learner, courses]);
  const dueCount = dueList.filter(x => x.due).length;
  const [bellOpen, setBellOpen] = useState(false);
  const nudged = useRef(false);
  useEffect(() => {
    if (nudged.current || !dueList.length) return;
    const d = dueList.find(x => x.due); if (!d) return;
    nudged.current = true;
    setTimeout(() => toast("Reminder: " + d.c.title + " is " + d.p.pct + "% done. Pick up where you left off!", "bell"), 1200);
  }, [dueList]);
  useEffect(() => { if (!bellOpen) return; const f = (e) => { if (!e.target.closest || !e.target.closest(".bell-wrap")) setBellOpen(false); }; document.addEventListener("click", f); return () => document.removeEventListener("click", f); }, [bellOpen]);

  const cats = useMemo(() => Array.from(new Set(DEFAULT_CATS.concat((courses || []).map(c => c.category).filter(Boolean)))), [courses]);
  const course = route.id && courses ? courses.find(c => c.id === route.id) : null;
  const canManage = (c) => !!c && !!svc.db && (svc.canEdit || (c.authorId && c.authorId === svc.uid));
  const authorIds = course && course.authorId ? [course.authorId] : [];
  const authorPs = useProfiles(svc.user, authorIds);
  const lv = levelFor(learner ? learner.xp : 0);

  let view;
  if (svc.signedOut) view = html`<${SignIn} />`;
  else if (!svc.ready || learner === null || (route.id && courses === null)) view = html`<div className="grid">${[0, 1, 2].map(i => html`<div key=${i} className="skel"></div>`)}</div>`;
  else if (route.page === "course") view = html`<${CourseDetail} course=${course} learner=${learner} actions=${actions} canManage=${canManage(course)} toast=${toast} authorName=${course && course.authorId && authorPs[course.authorId] && authorPs[course.authorId].name} />`;
  else if (route.page === "learn") view = html`<${Player} key=${route.id} course=${course} learner=${learner} actions=${actions} />`;
  else if (route.page === "certificate") view = html`<${Certificate} course=${course} learner=${learner} me=${svc.me} downloads=${svc.downloads} toast=${toast} />`;
  else if (route.page === "edit") view = course ? html`<${Editor} key=${course.id} course=${course} cats=${cats} actions=${actions} assets=${svc.assets} uid=${svc.uid} canManage=${canManage(course)} />` : html`<${NotFound} />`;
  else if (route.page === "create") view = html`<${Editor} key="new" course=${null} cats=${cats} actions=${actions} assets=${svc.assets} uid=${svc.uid} canManage=${true} />`;
  else if (route.page === "my-learning") view = html`<${MyLearning} courses=${courses} learner=${learner} actions=${actions} me=${svc.me} uid=${svc.uid} />`;
  else if (route.page === "leaderboard") view = html`<${Leaderboard} board=${board} user=${svc.user} uid=${svc.uid} />`;
  else if (route.page === "admin" && svc.canEdit) view = html`<${Admin} learnersAll=${learnersAll} courses=${courses} user=${svc.user} toast=${toast} />`;
  else view = html`<${Explore} courses=${courses} learner=${learner} cats=${cats} loadNote=${loadNote} me=${svc.me} />`;

  const navItems = svc.signedOut ? [] : [["explore", "compass", "Explore"], ["my-learning", "mylearn", "My learning"], ["leaderboard", "trophy", "Leaderboard"], ["create", "plus", "Create"]].concat(svc.canEdit ? [["admin", "shield", "Learners"]] : []);
  const activeNav = route.page === "course" || route.page === "learn" ? "explore" : route.page === "certificate" ? "my-learning" : route.page === "edit" ? "create" : route.page;

  return html`<${React.Fragment}>
    <header className="topbar"><div className="topbar-in">
      <a className="brand" href="#explore" aria-label="Central Union Online Classes home">
        <span className="brand-mark"><img src=${BRAND.emblem} alt="" /></span>
        <span className="brand-txt"><div className="brand-t">Central Union</div><div className="brand-s">Online Classes</div></span>
      </a>
      <nav className="nav" aria-label="Main">${navItems.map(([h, ic, lab]) => html`<a key=${h} href=${"#" + h} className=${activeNav === h ? "on" : ""}><${Icon} n=${ic} s=${16} />${lab}</a>`)}</nav>
      <div className="tb-right">
        <div className="bell-wrap" style=${{ position: "relative" }}>
          <button className="icon-btn" aria-label=${"Reminders" + (dueCount ? ", " + dueCount + " due" : "")} onClick=${() => setBellOpen(o => !o)}><${Icon} n="bell" s=${18} />${dueCount ? html`<span className="dot num">${dueCount}</span>` : null}</button>
          ${bellOpen ? html`<div className="card pop">
            <div className="row between" style=${{ padding: "8px 10px" }}><b>Reminders</b><a href="#my-learning" className="tiny" onClick=${() => setBellOpen(false)}>Settings</a></div>
            ${dueList.length ? dueList.slice(0, 6).map(x => html`<a key=${x.c.id} className="pop-item" href=${"#learn-" + x.c.id} onClick=${() => setBellOpen(false)}>
              <span style=${{ width: "10px", height: "10px", borderRadius: "50%", marginTop: "6px", flexShrink: 0, background: x.due ? "var(--bad)" : "var(--line)" }}></span>
              <span style=${{ flex: 1, minWidth: 0 }}><b className="small">${x.c.title}</b><div className="tiny muted">${x.p.pct}% done · ${x.due ? "you've been away " + Math.floor(x.away) + " " + (Math.floor(x.away) === 1 ? "day" : "days") : "last active " + relDays(x.p.e.updatedAt)}</div></span>
              <span className="tiny" style=${{ color: "var(--primary)", fontWeight: 700 }}>Resume</span></a>`)
              : html`<div className="small muted" style=${{ padding: "10px" }}>You're all caught up. Unfinished classes will show up here as reminders.</div>`}
          </div>` : null}
        </div>
        <button className="icon-btn" aria-label=${theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick=${() => setTheme(t => t === "dark" ? "light" : "dark")}>
          <span className="theme-ico" key=${theme} style=${{ display: "grid", animation: "spinIn .5s cubic-bezier(.3,1.4,.5,1)" }}><${Icon} n=${theme === "dark" ? "sun" : "moon"} s=${18} /></span></button>
        <a className="me-chip" href="#my-learning" aria-label="My learning">
          ${svc.me && svc.me.avatarUrl ? html`<img src=${svc.me.avatarUrl} alt="" />` : html`<span className="av" style=${{ width: "30px", height: "30px", background: "var(--surface-2)" }}></span>`}
          <span className="lvl-pill">Lv ${lv.n}<span className="lvl-txt"> · ${lv.name}</span></span>
        </a>
      </div>
    </div></header>
    <main key=${route.page + (route.id || "")}>${view}</main>
    <div className="toasts" aria-live="polite">${toasts.map(t => html`<div key=${t.id} className=${"toast " + (t.kind || "")}><${Icon} n=${t.icon || "check"} s=${17} />${t.text}</div>`)}</div>
    ${modal ? html`<div className="scrim" onClick=${() => setModal(null)}><div className="card modal" role="dialog" aria-modal="true" onClick=${e => e.stopPropagation()}>
      ${modal.kind === "complete" ? html`
        <div className="big-medal"><${Icon} n="award" s=${48} /></div>
        <div className="eyebrow">Class complete</div>
        <h2 style=${{ margin: "6px 0 10px" }}>You finished ${modal.course.title}!</h2>
        <p className="muted">You earned ${XP.course} bonus XP and a certificate of completion.${modal.levelUp ? " You also reached Level " + modal.levelUp.n + ": " + modal.levelUp.name + "." : ""}</p>
        <div className="row" style=${{ justifyContent: "center", marginTop: "20px" }}>
          <a className="btn btn-gold" href=${"#certificate-" + modal.course.id} onClick=${() => setModal(null)}><${Icon} n="award" s=${17} />View certificate</a>
          <button className="btn btn-ghost" onClick=${() => { setModal(null); go("explore"); }}>Find another class</button></div>
      ` : html`
        <div className="big-medal"><b style=${{ fontFamily: "var(--font-display)", fontSize: "40px" }}>${modal.lv.n}</b></div>
        <div className="eyebrow">Level up</div>
        <h2 style=${{ margin: "6px 0 10px" }}>You're now a ${modal.lv.name}!</h2>
        <p className="muted">${modal.lv.next ? modal.lv.toNext + " XP to reach " + modal.lv.next.name + "." : "That's the highest level. Amazing work."}</p>
        <button className="btn btn-primary" style=${{ marginTop: "20px" }} onClick=${() => setModal(null)}>Keep learning</button>
      `}
    </div></div>` : null}
  <//>`;
}

export default App;
