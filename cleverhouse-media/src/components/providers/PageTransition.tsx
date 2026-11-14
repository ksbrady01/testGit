import { useEffect, useRef } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LogoMark } from "@/components/brand/Logo";
import type Lenis from "lenis";

/**
 * Signature page transition: a copper-edged ink curtain rises with the CH mark,
 * the route changes underneath, then the curtain lifts away.
 * Intercepts same-origin <a> clicks globally so every link gets the transition.
 */
export function PageTransition() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const curtain = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) {
        if (url.hash) return; // in-page anchor
        e.preventDefault();
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        return;
      }
      e.preventDefault();
      if (pending.current) return;
      pending.current = true;
      document.dispatchEvent(new CustomEvent("chm:navigate"));
      const go = () => {
        navigate({ to: url.pathname as "/", hash: url.hash ? url.hash.slice(1) : undefined });
        // Safety net: never leave the curtain down if the route doesn't change.
        window.setTimeout(() => {
          if (!pending.current) return;
          pending.current = false;
          gsap.to(curtain.current, { yPercent: -100, duration: 0.6, ease: "expo.inOut", onComplete: () => void gsap.set(curtain.current, { display: "none" }) });
        }, 6000);
      };
      if (reduce) {
        go();
        return;
      }
      gsap.set(curtain.current, { display: "block", yPercent: 100 });
      gsap
        .timeline({ onComplete: go })
        .to(curtain.current, { yPercent: 0, duration: 0.65, ease: "expo.inOut" })
        .fromTo(mark.current, { autoAlpha: 0, scale: 0.8, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "expo.out" }, "-=0.25");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);

    const finish = () => {
      pending.current = false;
      ScrollTrigger.refresh();
    };
    if (!pending.current) {
      finish();
      return;
    }
    const tl = gsap.timeline({ delay: 0.12, onComplete: finish });
    tl.to(mark.current, { autoAlpha: 0, scale: 1.1, duration: 0.3, ease: "power2.in" }).to(curtain.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(curtain.current, { display: "none" });
      },
    });
    document.dispatchEvent(new CustomEvent("chm:page-enter"));
    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={curtain}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9000] hidden bg-ink"
      style={{ boxShadow: "0 -2px 0 0 #b88058, 0 2px 0 0 #b88058" }}
    >
      <div className="absolute inset-0 grid-lines opacity-60" />
      <div ref={mark} className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2 opacity-0">
        <LogoMark />
      </div>
    </div>
  );
}
