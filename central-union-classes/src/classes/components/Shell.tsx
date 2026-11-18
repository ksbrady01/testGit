import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import * as backend from "../backend";
import { BRAND, ORG, XP, levelFor } from "../constants";
import { useApp } from "../state/AppProvider";
import { relDays } from "../utils";
import { Icon } from "./Icon";
import { Skeletons } from "./ui";

type NavPath = "/" | "/my-learning" | "/leaderboard" | "/create" | "/learners";

function activeSection(pathname: string): NavPath {
  if (pathname.startsWith("/my-learning") || pathname.startsWith("/certificate"))
    return "/my-learning";
  if (pathname.startsWith("/leaderboard")) return "/leaderboard";
  if (pathname.startsWith("/create") || pathname.startsWith("/edit")) return "/create";
  if (pathname.startsWith("/learners")) return "/learners";
  return "/";
}

function Topbar() {
  const { status, svc, learner, dueList, theme, toggleTheme } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [bellOpen, setBellOpen] = useState(false);
  const dueCount = dueList.filter((x) => x.due).length;
  const lv = levelFor(learner?.xp ?? 0);
  const active = activeSection(pathname);

  useEffect(() => {
    if (!bellOpen) return;
    const close = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el?.closest?.(".bell-wrap")) setBellOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [bellOpen]);

  const nav: [NavPath, string, string][] =
    status === "ready"
      ? [
          ["/", "compass", "Explore"],
          ["/my-learning", "mylearn", "My learning"],
          ["/leaderboard", "trophy", "Leaderboard"],
          ["/create", "plus", "Create"],
          ...(svc?.canEdit
            ? ([["/learners", "shield", "Learners"]] as [NavPath, string, string][])
            : []),
        ]
      : [];

  return (
    <header className="topbar">
      <div className="topbar-in">
        <Link to="/" className="brand" aria-label="Central Union Online Classes home">
          <span className="brand-mark">
            <img src={BRAND.emblem} alt="" />
          </span>
          <span className="brand-txt">
            <div className="brand-t">Central Union</div>
            <div className="brand-s">Online Classes</div>
          </span>
        </Link>
        <nav className="nav" aria-label="Main">
          {nav.map(([to, ic, label]) => (
            <Link key={to} to={to} className={active === to ? "on" : ""}>
              <Icon n={ic} s={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="tb-right">
          {status === "ready" ? (
            <div className="bell-wrap" style={{ position: "relative" }}>
              <button
                type="button"
                className="icon-btn"
                aria-label={`Reminders${dueCount ? `, ${dueCount} due` : ""}`}
                onClick={() => setBellOpen((o) => !o)}
              >
                <Icon n="bell" s={18} />
                {dueCount ? <span className="dot num">{dueCount}</span> : null}
              </button>
              {bellOpen ? (
                <div className="card pop">
                  <div className="row between" style={{ padding: "8px 10px" }}>
                    <b>Reminders</b>
                    <Link to="/my-learning" className="tiny" onClick={() => setBellOpen(false)}>
                      Settings
                    </Link>
                  </div>
                  {dueList.length ? (
                    dueList.slice(0, 6).map((x) => (
                      <Link
                        key={x.c.id}
                        className="pop-item"
                        to="/learn/$courseId"
                        params={{ courseId: x.c.id }}
                        onClick={() => setBellOpen(false)}
                      >
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            marginTop: "6px",
                            flexShrink: 0,
                            background: x.due ? "var(--bad)" : "var(--line)",
                          }}
                        />
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <b className="small">{x.c.title}</b>
                          <div className="tiny muted">
                            {x.p.pct}% done ·{" "}
                            {x.due
                              ? `you've been away ${Math.floor(x.away)} ${Math.floor(x.away) === 1 ? "day" : "days"}`
                              : `last active ${relDays(x.p.e?.updatedAt)}`}
                          </div>
                        </span>
                        <span className="tiny" style={{ color: "var(--primary)", fontWeight: 700 }}>
                          Resume
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="small muted" style={{ padding: "10px" }}>
                      You're all caught up. Unfinished classes will show up here as reminders.
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}
          <button
            type="button"
            className="icon-btn"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
          >
            <span
              className="theme-ico"
              key={theme}
              style={{ display: "grid", animation: "spinIn .5s cubic-bezier(.3,1.4,.5,1)" }}
            >
              <Icon n={theme === "dark" ? "sun" : "moon"} s={18} />
            </span>
          </button>
          {status === "ready" ? (
            <Link className="me-chip" to="/my-learning" aria-label="My learning">
              {svc?.me.avatarUrl ? (
                <img src={svc.me.avatarUrl} alt="" />
              ) : (
                <span
                  className="av"
                  style={{ width: "30px", height: "30px", background: "var(--surface-2)" }}
                />
              )}
              <span className="lvl-pill">
                Lv {lv.n}
                <span className="lvl-txt"> · {lv.name}</span>
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function SignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const returning = email.includes("@") && backend.auth.isReturning(email);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    try {
      backend.auth.signIn({ name, email });
      window.location.reload();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Couldn't sign you in.");
    }
  };
  return (
    <div className="signin-wrap page">
      <div className="hero-main signin-hero rise">
        <div>
          <div className="eyebrow" style={{ color: "inherit", opacity: 0.8 }}>
            {ORG}
          </div>
          <h1 style={{ marginTop: "8px" }}>Grow in faith, one lesson at a time.</h1>
          <p>Sign in with your email to start a class, or to pick up right where you left off.</p>
        </div>
        <img className="hero-logo" src={BRAND.logo} alt="Central Union Church of Christ logo" />
      </div>
      <form
        className="card pad stack signin-card rise"
        style={{ gap: "14px", animationDelay: "90ms" }}
        onSubmit={submit}
      >
        <h2>{returning ? "Welcome back" : "Sign in to your classes"}</h2>
        <div className="field">
          <label htmlFor="si-email">Email</label>
          <input
            id="si-email"
            className="input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="field">
          <label htmlFor="si-name">
            Your name {returning ? <span className="muted">(optional)</span> : null}
          </label>
          <input
            id="si-name"
            className="input"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Shown on your certificates"
          />
        </div>
        {err ? (
          <div className="err" role="alert">
            {err}
          </div>
        ) : null}
        <button className="btn btn-primary" type="submit">
          {returning ? "Continue learning" : "Start learning"}
          <Icon n="right" s={16} />
        </button>
        <span className="tiny muted">
          Use the same email each time and your progress, levels and certificates come right back.
        </span>
      </form>
    </div>
  );
}

function Overlays() {
  const { toasts, modal, setModal } = useApp();
  return (
    <>
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind ?? ""}`}>
            <Icon n={t.icon} s={17} />
            {t.text}
          </div>
        ))}
      </div>
      {modal ? (
        <div className="scrim" onClick={() => setModal(null)}>
          <div
            className="card modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {modal.kind === "complete" ? (
              <>
                <div className="big-medal">
                  <Icon n="award" s={48} />
                </div>
                <div className="eyebrow">Class complete</div>
                <h2 style={{ margin: "6px 0 10px" }}>You finished {modal.course.title}!</h2>
                <p className="muted">
                  You earned {XP.course} bonus XP and a certificate of completion.
                  {modal.levelUp
                    ? ` You also reached Level ${modal.levelUp.n}: ${modal.levelUp.name}.`
                    : ""}
                </p>
                <div className="row" style={{ justifyContent: "center", marginTop: "20px" }}>
                  <Link
                    className="btn btn-gold"
                    to="/certificate/$courseId"
                    params={{ courseId: modal.course.id }}
                    onClick={() => setModal(null)}
                  >
                    <Icon n="award" s={17} />
                    View certificate
                  </Link>
                  <Link className="btn btn-ghost" to="/" onClick={() => setModal(null)}>
                    Find another class
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="big-medal">
                  <b style={{ fontFamily: "var(--font-display)", fontSize: "40px" }}>
                    {modal.lv.n}
                  </b>
                </div>
                <div className="eyebrow">Level up</div>
                <h2 style={{ margin: "6px 0 10px" }}>You're now a {modal.lv.name}!</h2>
                <p className="muted">
                  {modal.lv.next
                    ? `${modal.lv.toNext} XP to reach ${modal.lv.next.name}.`
                    : "That's the highest level. Amazing work."}
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginTop: "20px" }}
                  onClick={() => setModal(null)}
                >
                  Keep learning
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Header + page area. Pages render only once the learner is signed in and loaded. */
export function Shell({ children }: { children: ReactNode }) {
  const { status, learner } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      <Topbar />
      <main id="main" key={pathname}>
        {status === "signedOut" ? (
          <SignIn />
        ) : status === "ready" && learner ? (
          children
        ) : (
          <Skeletons />
        )}
      </main>
      <Overlays />
    </>
  );
}
