import { useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import clsx from "@/lib/clsx";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/* -------------------------------------------------------------------------- */
/* Reveal — a handful of distinct entrance styles, used deliberately.          */
/* -------------------------------------------------------------------------- */
type RevealKind = "up" | "fade" | "mask" | "image" | "left" | "scale";

export function Reveal({
  children,
  kind = "up",
  delay = 0,
  stagger,
  className,
  as: Tag = "div",
  start = "top 85%",
  style,
}: {
  children: ReactNode;
  kind?: RevealKind;
  delay?: number;
  /** When set, animates direct children in sequence instead of the wrapper. */
  stagger?: number;
  className?: string;
  as?: ElementType;
  start?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = ref.current!;
        const targets = stagger ? Array.from(el.children) : [el];
        const st = { trigger: el, start, once: true };
        switch (kind) {
          case "up":
            gsap.from(targets, { y: 60, autoAlpha: 0, duration: 1.2, delay, stagger, scrollTrigger: st });
            break;
          case "left":
            gsap.from(targets, { x: -60, autoAlpha: 0, duration: 1.2, delay, stagger, scrollTrigger: st });
            break;
          case "fade":
            gsap.from(targets, { autoAlpha: 0, duration: 1.4, delay, stagger, ease: "power2.out", scrollTrigger: st });
            break;
          case "scale":
            gsap.from(targets, { scale: 0.9, autoAlpha: 0, duration: 1.3, delay, stagger, scrollTrigger: st });
            break;
          case "mask":
            gsap.fromTo(
              targets,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", delay, stagger, scrollTrigger: st },
            );
            break;
          case "image": {
            targets.forEach((t, i) => {
              const inner = (t as HTMLElement).querySelector("img");
              const tl = gsap.timeline({ scrollTrigger: { ...st, trigger: t }, delay: delay + (stagger || 0) * i });
              tl.fromTo(t, { clipPath: "inset(18% 12% 18% 12% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6, ease: "expo.inOut" });
              if (inner) tl.fromTo(inner, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0);
            });
            break;
          }
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* SplitHeading — masked line/word reveal powered by GSAP SplitText.          */
/* Text is server-rendered intact (SEO + no-JS), then split on the client.   */
/* -------------------------------------------------------------------------- */
export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  by = "lines",
  delay = 0,
  onLoad = false,
  start = "top 85%",
  waitForIntro = false,
  id,
}: {
  children: ReactNode;
  id?: string;
  as?: ElementType;
  className?: string;
  by?: "lines" | "words" | "chars";
  delay?: number;
  /** Animate immediately on mount instead of on scroll (page heroes). */
  onLoad?: boolean;
  start?: string;
  waitForIntro?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let split: SplitText | null = null;
        let tween: gsap.core.Tween | null = null;
        const run = () => {
          split = new SplitText(el, { type: by === "chars" ? "words,chars" : by === "words" ? "lines,words" : "lines", mask: "lines", linesClass: "split-line" });
          const targets = by === "chars" ? split.chars : by === "words" ? split.words : split.lines;
          gsap.set(el, { autoAlpha: 1 });
          tween = gsap.from(targets, {
            yPercent: 115,
            rotate: by === "lines" ? 2.5 : 0,
            duration: by === "chars" ? 1 : 1.25,
            stagger: by === "chars" ? 0.025 : by === "words" ? 0.06 : 0.11,
            ease: "expo.out",
            delay,
            scrollTrigger: onLoad ? undefined : { trigger: el, start, once: true },
          });
        };
        let dead = false;
        const safeRun = () => {
          if (!dead) run();
        };
        const ready = () => (document.fonts ? document.fonts.ready.then(safeRun) : safeRun());
        let handler: (() => void) | null = null;
        if (waitForIntro && document.documentElement.dataset.intro === "play") {
          gsap.set(el, { autoAlpha: 0 });
          handler = () => ready();
          document.addEventListener("chm:intro-done", handler, { once: true });
        } else ready();
        return () => {
          dead = true;
          if (handler) document.removeEventListener("chm:intro-done", handler);
          tween?.kill();
          split?.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} id={id} className={className} data-split="">
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* ScrubWords — words light up as you read (scroll-scrubbed).                 */
/* -------------------------------------------------------------------------- */
export function ScrubWords({ text, className, as: Tag = "p", dim = 0.16 }: { text: string; className?: string; as?: ElementType; dim?: number }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const words = ref.current!.querySelectorAll("[data-w]");
        gsap.fromTo(
          words,
          { opacity: dim },
          { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w="" className="inline-block">
          {w}&nbsp;
        </span>
      ))}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax — gentle scroll-linked depth.                                      */
/* -------------------------------------------------------------------------- */
export function Parallax({
  children,
  speed = 12,
  className,
  style,
}: {
  children: ReactNode;
  /** yPercent travel; negative moves up faster */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: -speed / 2 },
          { yPercent: speed / 2, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/** Image that zooms subtly within its frame while scrolling. */
export function ScrollZoom({ children, className, from = 1.18 }: { children: ReactNode; className?: string; from?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const inner = ref.current!.firstElementChild;
        gsap.fromTo(inner, { scale: from }, { scale: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={clsx("overflow-hidden", className)}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Magnetic — pulls toward the pointer on desktop.                             */
/* -------------------------------------------------------------------------- */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={clsx("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Marquee — infinite ribbon; speeds with scroll velocity.                    */
/* -------------------------------------------------------------------------- */
export function Marquee({ children, className, reverse = false, speed = 40 }: { children: ReactNode; className?: string; reverse?: boolean; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = ref.current!.firstElementChild as HTMLElement;
        const tween = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 });
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = Math.min(Math.abs(self.getVelocity()) / 400, 4);
            gsap.to(tween, { timeScale: 1 + v, duration: 0.3, overwrite: true });
            gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.3 });
          },
        });
        return () => {
          tween.kill();
          st.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={clsx("overflow-hidden", className)}>
      <div className="flex w-max">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
