import Image from "@/components/ui/Img";
import { lazyClient } from "@/lib/lazyClient";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { canUseWebGL } from "@/lib/webgl";
import { Button } from "@/components/ui/Button";
import { img } from "@/content/images";
import clsx from "@/lib/clsx";
import type { Intensity } from "@/components/three/IdeaField";

const IdeaField = lazyClient(() => import("@/components/three/IdeaField"));

const GROWTH = "GROWTH".split("");
const headlineCls =
  "font-display font-medium tracking-[-0.05em] leading-[0.9] text-[clamp(2.5rem,10.8vw,5.2rem)] md:text-[clamp(4rem,8.4vw,11rem)]";

/**
 * The hero copy block. Rendered twice with identical structure:
 *  - front layer (above the thinker): the real, accessible content
 *  - behind layer (below the thinker): invisible except an outlined
 *    "experiences that" which slips behind the person for depth.
 */
function HeroText({ behind = false }: { behind?: boolean }) {
  const hide = behind ? ({ visibility: "hidden" } as const) : undefined;
  const line = "block overflow-hidden pb-[0.05em]";
  const inner = "block whitespace-nowrap";
  return (
    <div className="shell pb-10 pt-[50svh] md:pb-14 md:pt-44">
      <p data-h-meta data-enter={behind ? undefined : ""} style={hide} className="label label-dot mb-6 text-copper-300 md:mb-8">
        Storytelling through digital experiences
      </p>
      {behind ? (
        <p className={clsx(headlineCls, "text-copper-400")} aria-hidden="true">
          <span className={line}>
            <span className={inner} style={hide}>We build digital</span>
          </span>
          <span className={line}>
            <span data-h-line className={clsx(inner, "text-outline-copper")}>
              experiences that
            </span>
          </span>
          <span className={line}>
            <span className={inner} style={hide}>drive GROWTH.</span>
          </span>
        </p>
      ) : (
        <h1 id="hero-heading" className={clsx(headlineCls, "text-bone")}>
          <span className="sr-only">We build digital experiences that drive growth.</span>
          <span aria-hidden="true" className="block">
            <span className={line}>
              <span data-h-line className={inner}>
                We build digital
              </span>
            </span>
            <span className={line}>
              <span data-h-line className={clsx(inner, "hero-fade-line")}>
                experiences that
              </span>
            </span>
            <span className={line}>
              <span data-h-line className={inner}>
                drive{" "}
                <span className="relative inline-flex">
                  {GROWTH.map((c, i) => (
                    <span key={i} data-h-growth className="text-growth inline-block" style={{ animationDelay: `${i * -0.35}s` }}>
                      {c}
                    </span>
                  ))}
                  <span className="text-copper-300">.</span>
                  <svg
                    className="pointer-events-none absolute -right-[0.35em] -top-[0.42em] h-[0.6em] w-[0.6em] overflow-visible"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9BD8CB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path data-h-trend pathLength={1} strokeDasharray="1" strokeDashoffset="1" d="M3 17 L10 10 L14 14 L21 6 M15 6 H21 V12" />
                  </svg>
                </span>
              </span>
            </span>
          </span>
        </h1>
      )}

      <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end" style={hide}>
        <p data-h-copy data-enter={behind ? undefined : ""} className="max-w-[46ch] text-lead text-bone/75 md:col-span-5">
          From bold websites to smarter search and powerful digital campaigns, we help ambitious brands turn great ideas into measurable growth.
        </p>
        <div data-h-copy data-enter={behind ? undefined : ""} className="flex flex-wrap items-center gap-3 md:col-span-5 md:col-start-6">
          <Button href="/contact">Let&apos;s Build Something Great</Button>
          <Button href="/work" variant="ghost" icon={false}>
            Explore Our Work
          </Button>
        </div>
        <a href="#intro" data-h-meta data-enter={behind ? undefined : ""} className="group hidden items-center justify-end gap-4 md:col-span-2 md:flex" aria-label="Scroll to the introduction">
          <span className="label text-right text-bone/50 transition-colors group-hover:text-bone">
            Scroll
            <br />
            to think ahead
          </span>
          <span className="relative block h-16 w-px overflow-hidden bg-bone/15">
            <span className="absolute left-0 top-0 block h-5 w-px animate-scroll-dot bg-copper-300" />
          </span>
        </a>
      </div>
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const intensity = useRef<Intensity>({ v: 0, scroll: 0 });
  const [webgl, setWebgl] = useState(false);

  useEffect(() => setWebgl(canUseWebGL()), []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-enter]"), { autoAlpha: 1 });
        gsap.set(q("[data-h-trend]"), { strokeDashoffset: 0 });
        intensity.current.v = 1;
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Make CSS-hidden elements "visible" first so from() tweens record the right end state;
        // the from() tweens below immediately render their start state, so nothing flashes.
        gsap.set(q("[data-enter]"), { autoAlpha: 1 });
        const front = (sel: string) => q(`[data-h-front] ${sel}`);
        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl
          // 1. background reveals
          .from(q("[data-h-bg]"), { autoAlpha: 0, duration: 1.6, ease: "power2.out" }, 0)
          .from(q("[data-h-glow]"), { scale: 0.3, autoAlpha: 0, duration: 2.4, ease: "power2.out" }, 0)
          // 2. the thinker appears through an expanding aperture centred on the mind
          .fromTo(q("[data-h-photo]"), { clipPath: "circle(0% at 55% 30%)" }, { clipPath: "circle(150% at 55% 30%)", duration: 2.4, ease: "expo.inOut" }, 0.1)
          .from(q("[data-h-photo] img"), { scale: 1.3, duration: 3, ease: "expo.out" }, 0.1)
          // 3. headline line by line (front + behind layers move together)
          .from(q("[data-h-line]"), { yPercent: 112, rotate: 2, duration: 1.4, stagger: 0.12 }, 0.7)
          // 4. GROWTH rises like a chart
          .from(q("[data-h-growth]"), { yPercent: 120, duration: 1.2, stagger: 0.07, ease: "back.out(1.8)" }, 1.15)
          .to(q("[data-h-trend]"), { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 1.75)
          // 5. abstract ideas emerge
          .to(intensity.current, { v: 1, duration: 2.4, ease: "power2.out" }, 1.1)
          .from(q("[data-h-idea]"), { autoAlpha: 0, y: 24, scale: 0.94, filter: "blur(8px)", duration: 1.2, stagger: 0.15 }, 1.6)
          .to(q("[data-h-wire]"), { strokeDashoffset: 0, duration: 1.2, stagger: 0.12, ease: "power2.inOut" }, 1.7)
          // 6. copy + CTAs
          .from(front("[data-h-copy]"), { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.1 }, 1.8)
          .from(front("[data-h-meta]"), { autoAlpha: 0, duration: 1 }, 2.1)
          // 7. settle into continuous motion
          .add(() => {
            q("[data-h-idea]").forEach((el, i) => {
              gsap.to(el, { y: i % 2 ? 10 : -12, duration: 3.2 + i * 0.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
            });
          });

        const start = () => tl.play();
        if (document.documentElement.dataset.intro === "play") document.addEventListener("chm:intro-done", start, { once: true });
        else gsap.delayedCall(0.15, start);

        // Scroll: layers drift apart for depth
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(q("[data-h-photo]"), { yPercent: 12, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-h-front]"), { yPercent: -14, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-h-behind]"), { yPercent: -14, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-h-ideas]"), { yPercent: -30, autoAlpha: 0, ease: "none", scrollTrigger: st });
        gsap.to(intensity.current, { scroll: 1, ease: "none", scrollTrigger: st });

        return () => document.removeEventListener("chm:intro-done", start);
      });

      // Pointer parallax on desktop
      mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 1024px)", () => {
        const px = gsap.quickTo(q("[data-h-photo-inner]"), "x", { duration: 1.4, ease: "power3" });
        const py = gsap.quickTo(q("[data-h-photo-inner]"), "y", { duration: 1.4, ease: "power3" });
        const ix = gsap.quickTo(q("[data-h-ideas]"), "x", { duration: 1.2, ease: "power3" });
        const iy = gsap.quickTo(q("[data-h-ideas]"), "y", { duration: 1.2, ease: "power3" });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          px(nx * -18);
          py(ny * -12);
          ix(nx * 28);
          iy(ny * 18);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate min-h-[100svh] overflow-hidden bg-ink" aria-labelledby="hero-heading">
      {/* Background */}
      <div data-h-bg className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 grid-lines" />
        <div
          data-h-glow
          className="absolute right-[-20%] top-[-6%] h-[90vmin] w-[90vmin] rounded-full md:right-[10%] md:top-[-4%]"
          style={{ background: "radial-gradient(circle, rgba(184,128,88,0.3), rgba(184,128,88,0.06) 45%, transparent 70%)" }}
        />
      </div>

      {/* Depth layer: outlined line slipping behind the thinker */}
      <div data-h-behind className="pointer-events-none absolute inset-0 z-0 hidden flex-col justify-end md:flex" aria-hidden="true">
        <HeroText behind />
      </div>

      {/* The thinker */}
      <div
        data-h-photo
        data-enter
        className="absolute inset-x-0 top-0 z-10 h-[64svh] overflow-hidden md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[64%]"
        aria-hidden="true"
      >
        <div data-h-photo-inner className="absolute -inset-6">
          <Image
            src={img.thinkerHero}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 64vw"
            className="object-cover object-[42%_20%] [filter:saturate(0.85)_contrast(1.08)_brightness(0.9)]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/5 to-ink/40 md:hidden" />
        <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(90deg, #120B07 0%, rgba(18,11,7,0.55) 22%, rgba(18,11,7,0) 48%)" }} />
        <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(0deg, #120B07 0%, rgba(18,11,7,0.35) 30%, rgba(18,11,7,0) 55%)" }} />
        <div className="grain absolute inset-0" />
      </div>

      {/* WebGL thoughts */}
      {webgl && <IdeaField intensity={intensity.current} className="pointer-events-none absolute inset-0 z-20" />}

      {/* Idea fragments */}
      <div data-h-ideas className="pointer-events-none absolute inset-0 z-30 hidden lg:block" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="none" fill="none" stroke="#CF9A6A" strokeWidth="1" strokeDasharray="1" strokeDashoffset="1">
          <path data-h-wire pathLength={1} d="M1010 250 C 1080 180, 1160 140, 1250 130" vectorEffect="non-scaling-stroke" />
          <path data-h-wire pathLength={1} d="M1060 330 C 1180 340, 1270 380, 1330 410" vectorEffect="non-scaling-stroke" />
          <path data-h-wire pathLength={1} d="M930 220 C 880 160, 830 120, 780 110" vectorEffect="non-scaling-stroke" />
        </svg>
        <div data-h-idea data-enter className="glass absolute left-[78%] top-[9%] w-[220px] rounded-2xl p-4 ring-1 ring-bone/10">
          <p className="label text-copper-300">Brief · 01</p>
          <p className="mt-2 font-display text-sm leading-snug text-bone">Make it unforgettable — and make it convert.</p>
          <div className="mt-3 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full bg-bone/15" />
            <span className="block h-1.5 w-3/4 rounded-full bg-bone/15" />
            <span className="block h-1.5 w-1/2 rounded-full bg-copper-500/60" />
          </div>
        </div>
        <div data-h-idea data-enter className="glass absolute left-[83%] top-[43%] flex w-[230px] items-center gap-2 rounded-full px-4 py-3 ring-1 ring-bone/10">
          <Search size={14} className="text-copper-300" />
          <span className="truncate text-sm text-bone/85">best agency near me</span>
          <span className="ml-auto h-4 w-px animate-blink bg-copper-300" />
        </div>
        <div data-h-idea data-enter className="absolute left-[44%] top-[10%] flex items-center gap-2">
          <span className="relative grid h-3 w-3 place-items-center">
            <span className="absolute h-3 w-3 animate-pulse-ring rounded-full bg-verdigris-400" />
            <span className="h-2 w-2 rounded-full bg-verdigris-300" />
          </span>
          <span className="label text-verdigris-300">idea in progress</span>
        </div>
      </div>

      {/* Front layer */}
      <div data-h-front className="relative z-40 flex min-h-[100svh] flex-col justify-end">
        <HeroText />
      </div>
    </section>
  );
}
