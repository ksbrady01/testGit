import Image from "../ui/Img";
import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "../../lib/gsap";
import { Logo, LogoMark } from "../brand/Logo";
import { img } from "../../content/images";
import type Lenis from "lenis";

/**
 * "Great Ideas Start With a Thought" — first-visit brand film.
 * Scene 1  The brand appears (CH mark light sweep + wordmark)
 * Scene 2  The thinker emerges from darkness
 * Scene 3  Ideas form around them (wireframes, nodes, particles, message)
 * Scene 4  Thoughts snap into a grid and the film lifts to reveal the hero
 *
 * Session-aware (sessionStorage), skippable, and never shown with reduced motion.
 * Gated before first paint by an inline script that sets <html data-intro>.
 */
export function Splash() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(true);

  const finish = () => {
    const d = document.documentElement;
    if (d.dataset["intro"] !== "play") return;
    d.dataset["intro"] = "done";
    try {
      sessionStorage.setItem("chm-intro", "1");
    } catch {
      // Storage can be blocked (private mode); the intro simply replays next visit.
    }
    (window as unknown as { __lenis?: Lenis }).__lenis?.start();
    document.dispatchEvent(new CustomEvent("chm:intro-done"));
  };

  useEffect(() => {
    if (document.documentElement.dataset["intro"] !== "play") setActive(false);
  }, []);

  // Thought particles — lightweight 2D canvas so the film never waits on WebGL.
  useEffect(() => {
    if (!active || !canvas.current) return;
    const c = canvas.current;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0,
      raf = 0;
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const count = w < 700 ? 70 : 150;
    const pts = Array.from({ length: count }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 40 + Math.random() * Math.max(w, h) * 0.42,
      s: 0.0008 + Math.random() * 0.0022,
      z: Math.random(),
      rise: Math.random() * 0.3,
    }));
    const state = { intensity: 0, gather: 0 };
    (c as unknown as { __state: typeof state }).__state = state;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w * (w < 768 ? 0.5 : 0.56);
      const cy = h * 0.4;
      for (const p of pts) {
        p.a += p.s;
        const r = p.r * (1 - state.gather * 0.85);
        const x = cx + Math.cos(p.a) * r * (1 + p.z * 0.4);
        const y =
          cy + Math.sin(p.a) * r * 0.55 - Math.sin(t * 0.0006 + p.z * 6) * 18 * p.rise * 10 * 0.1;
        const alpha = state.intensity * (0.25 + p.z * 0.75);
        ctx.beginPath();
        ctx.fillStyle = p.z > 0.85 ? `rgba(155,216,203,${alpha})` : `rgba(226,180,138,${alpha})`;
        ctx.arc(x, y, 0.6 + p.z * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  useGSAP(
    () => {
      if (!active || document.documentElement.dataset["intro"] !== "play") return;
      const q = gsap.utils.selector(root);
      const state = (
        canvas.current as unknown as { __state?: { intensity: number; gather: number } }
      )?.__state || { intensity: 0, gather: 0 };
      const msg = new SplitText(q("[data-s-msg]"), { type: "words,chars", mask: "words" });

      q<HTMLButtonElement>("[data-s-skip]")[0]?.focus({ preventScroll: true });

      const t = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => setActive(false),
      });
      tl.current = t;

      // Scene 1 — the brand appears
      t.set(root.current, { autoAlpha: 1 })
        .fromTo(
          q("[data-s-glow]"),
          { autoAlpha: 0, scale: 0.4 },
          { autoAlpha: 1, scale: 1, duration: 2.2, ease: "power2.out" },
        )
        .fromTo(
          q("[data-s-mark]"),
          { autoAlpha: 0, scale: 0.86, rotateY: -40, filter: "blur(10px)" },
          { autoAlpha: 1, scale: 1, rotateY: 0, filter: "blur(0px)", duration: 1.6 },
          0.2,
        )
        .fromTo(
          q("[data-s-sweep]"),
          { xPercent: -120 },
          { xPercent: 120, duration: 1.4, ease: "power2.inOut" },
          0.7,
        )
        .fromTo(
          q("[data-s-word]"),
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.3, ease: "expo.inOut" },
          0.9,
        )
        .fromTo(
          q("[data-s-tag]"),
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          1.5,
        )
        .addLabel("thinker", 2.5)
        // Scene 2 — the thinker
        .to(
          q("[data-s-brand]"),
          { autoAlpha: 0, scale: 0.92, y: -30, duration: 0.9, ease: "power3.in" },
          "thinker",
        )
        .fromTo(
          q("[data-s-photo]"),
          { "--r": "0%" },
          { "--r": "85%", duration: 2.2, ease: "power2.inOut" },
          "thinker+=0.4",
        )
        .fromTo(
          q("[data-s-photo] img"),
          { scale: 1.22 },
          { scale: 1.04, duration: 5.5, ease: "power1.out" },
          "thinker+=0.4",
        )
        .fromTo(
          q("[data-s-light]"),
          { xPercent: -60, autoAlpha: 0 },
          { xPercent: 40, autoAlpha: 1, duration: 3, ease: "sine.inOut" },
          "thinker+=0.8",
        )
        .addLabel("ideas", "thinker+=1.9")
        // Scene 3 — the idea
        .to(state, { intensity: 1, duration: 1.6, ease: "power2.out" }, "ideas")
        .fromTo(
          q("[data-s-draw]"),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.5, stagger: 0.12, ease: "power2.inOut" },
          "ideas",
        )
        .fromTo(
          q("[data-s-node]"),
          { scale: 0, opacity: 0, transformOrigin: "50% 50%" },
          { scale: 1, opacity: 1, duration: 0.7, stagger: 0.08, ease: "back.out(2)" },
          "ideas+=0.4",
        )
        .set(q("[data-s-msg]"), { autoAlpha: 1 }, "ideas+=0.7")
        .fromTo(
          q("[data-s-frag]"),
          { autoAlpha: 0, y: 20, filter: "blur(6px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.14 },
          "ideas+=0.3",
        )
        .from(msg.chars, { yPercent: 110, duration: 0.9, stagger: 0.018 }, "ideas+=0.7")
        .addLabel("system", "ideas+=2.9")
        // Scene 4 — thoughts become a system, then the reveal
        .to(state, { gather: 1, duration: 1.1, ease: "power3.inOut" }, "system")
        .to(
          q("[data-s-frag]"),
          { autoAlpha: 0, scale: 0.9, duration: 0.6, stagger: 0.05, ease: "power2.in" },
          "system",
        )
        .fromTo(
          q("[data-s-grid] span"),
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.9,
            stagger: 0.04,
            ease: "expo.inOut",
            transformOrigin: "50% 0%",
          },
          "system+=0.1",
        )
        .to(
          q("[data-s-msg]"),
          { autoAlpha: 0, y: -20, duration: 0.6, ease: "power2.in" },
          "system+=0.3",
        )
        .addLabel("reveal", "system+=1")
        .add(finish, "reveal")
        .to(
          root.current,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1.3, ease: "expo.inOut" },
          "reveal",
        )
        .to(q("[data-s-photo]"), { yPercent: -12, duration: 1.3, ease: "expo.inOut" }, "reveal");

      return () => {
        msg.revert();
      };
    },
    { scope: root, dependencies: [active] },
  );

  const skip = () => {
    const t = tl.current;
    if (!t) {
      finish();
      setActive(false);
      return;
    }
    const reveal = t.labels["reveal"] ?? 0;
    if (t.time() < reveal) t.seek(reveal - 0.01, false);
    t.timeScale(1.4);
  };

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!active) return null;

  return (
    <div
      id="chm-splash"
      ref={root}
      className="fixed inset-0 z-10000 overflow-hidden bg-ink text-bone"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-label="CleverHouse Media introduction"
      role="region"
    >
      <p className="sr-only" aria-live="polite">
        Every great digital experience begins with an idea. Press Skip intro or Escape to continue
        to the site.
      </p>
      <div className="absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />

      {/* Scene 4 grid */}
      <div
        data-s-grid
        className="pointer-events-none absolute inset-0 grid grid-cols-6 md:grid-cols-12"
        aria-hidden="true"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={`border-l border-copper-500/25 ${i >= 6 ? "hidden md:block" : ""}`}
            style={{ transform: "scaleY(0)" }}
          />
        ))}
      </div>

      {/* Scene 2 — the thinker */}
      <div
        data-s-photo
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-full md:w-[78%]"
        style={{
          ["--r" as string]: "0%",
          WebkitMaskImage:
            "radial-gradient(circle at 58% 42%, #000 calc(var(--r) * 0.55), transparent var(--r))",
          maskImage:
            "radial-gradient(circle at 58% 42%, #000 calc(var(--r) * 0.55), transparent var(--r))",
        }}
      >
        <Image
          src={img.thinkerProfile}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_35%] opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/20 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-transparent to-ink/40" />
        <div
          data-s-light
          className="absolute inset-0 opacity-0 mix-blend-color-dodge"
          style={{
            background:
              "radial-gradient(40% 55% at 55% 40%, rgba(226,180,138,0.55), transparent 70%)",
          }}
        />
      </div>

      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* Scene 3 — idea fragments */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="#CF9A6A"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
        >
          <path
            data-s-draw
            pathLength={1}
            strokeDasharray="1"
            d="M1010 300 C 1120 220, 1220 210, 1300 160"
          />
          <path
            data-s-draw
            pathLength={1}
            strokeDasharray="1"
            d="M980 360 C 1120 380, 1240 420, 1360 470"
          />
          <path
            data-s-draw
            pathLength={1}
            strokeDasharray="1"
            d="M900 260 C 860 170, 760 130, 640 120"
          />
          <path
            data-s-draw
            pathLength={1}
            strokeDasharray="1"
            d="M880 420 C 760 520, 660 560, 560 600"
          />
          {/* wireframe browser */}
          <rect
            data-s-draw
            pathLength={1}
            strokeDasharray="1"
            x="1240"
            y="70"
            width="250"
            height="160"
            rx="10"
          />
          <path
            data-s-draw
            pathLength={1}
            strokeDasharray="1"
            d="M1240 96 H1490 M1262 130 H1400 M1262 150 H1360 M1262 190 H1330"
          />
          {/* wireframe phone */}
          <rect
            data-s-draw
            pathLength={1}
            strokeDasharray="1"
            x="1340"
            y="430"
            width="92"
            height="170"
            rx="16"
          />
          {/* sketch circle + square — design thinking */}
          <circle data-s-draw pathLength={1} strokeDasharray="1" cx="600" cy="120" r="54" />
          <rect
            data-s-draw
            pathLength={1}
            strokeDasharray="1"
            x="480"
            y="560"
            width="120"
            height="80"
            rx="4"
            transform="rotate(-6 540 600)"
          />
        </g>
        <g fill="#E2B48A">
          {[
            [1300, 160],
            [1360, 470],
            [640, 120],
            [560, 600],
            [1010, 300],
            [980, 360],
            [900, 260],
            [880, 420],
          ].map(([x, y], i) => (
            <circle data-s-node key={i} cx={x} cy={y} r={i < 4 ? 5 : 3.5} style={{ opacity: 0 }} />
          ))}
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        <span data-s-frag className="absolute left-[78%] top-[27%] label text-copper-200 opacity-0">
          idea.01 — interface
        </span>
        <span data-s-frag className="absolute left-[34%] top-[8%] label text-copper-200 opacity-0">
          brand / story
        </span>
        <span
          data-s-frag
          className="absolute left-[80%] top-[70%] label text-verdigris-300 opacity-0"
        >
          mobile-first
        </span>
        <span data-s-frag className="absolute left-[26%] top-[70%] label text-copper-200 opacity-0">
          search intent ↗
        </span>
        <span
          data-s-frag
          className="absolute left-[60%] top-[56%] rounded-full bg-bone/10 px-3 py-1.5 font-display text-sm text-bone opacity-0 backdrop-blur-sm"
        >
          grow →
        </span>
      </div>

      {/* Scene 1 — brand */}
      <div data-s-brand className="absolute inset-0 grid place-items-center">
        <div
          data-s-glow
          className="absolute h-[60vmin] w-[60vmin] rounded-full opacity-0 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(184,128,88,0.38), transparent 65%)" }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center perspective-[900px]">
          <div data-s-mark className="relative w-[92px] opacity-0 md:w-[120px]">
            <LogoMark priority alt="" />
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{
                WebkitMaskImage: "url(/brand/chm-mark.png)",
                maskImage: "url(/brand/chm-mark.png)",
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
              }}
              aria-hidden="true"
            >
              <div
                data-s-sweep
                className="absolute inset-y-0 -left-1/2 w-[200%]"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 35%, rgba(255,240,225,0.95) 50%, transparent 65%)",
                }}
              />
            </div>
          </div>
          <div
            data-s-word
            className="mt-8 w-[260px] md:w-[360px]"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            <Logo variant="light" priority />
          </div>
          <p data-s-tag className="label mt-6 text-bone/50 opacity-0">
            The art of thinking ahead
          </p>
        </div>
      </div>

      {/* Message */}
      <div className="absolute inset-x-0 bottom-[14%] md:bottom-[12%]">
        <div className="shell">
          <p
            data-s-msg
            style={{ opacity: 0, visibility: "hidden" }}
            className="max-w-[18ch] font-display text-[clamp(1.9rem,4.6vw,4.4rem)] font-medium leading-none tracking-[-0.035em] md:max-w-[22ch]"
          >
            Every great digital experience begins with an{" "}
            <span className="serif-accent text-copper-300">idea.</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        data-s-skip
        onClick={skip}
        className="absolute bottom-6 right-6 z-10 flex items-center gap-3 rounded-full bg-bone/10 px-5 py-3 text-sm text-bone/80 ring-1 ring-bone/15 backdrop-blur-sm transition-colors hover:bg-bone/20 hover:text-bone md:bottom-8 md:right-8"
      >
        Skip intro
        <span className="font-mono text-[0.65rem] text-bone/40">ESC</span>
      </button>
    </div>
  );
}
