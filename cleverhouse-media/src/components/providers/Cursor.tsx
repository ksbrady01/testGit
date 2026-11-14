import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";

/**
 * Understated desktop cursor: a copper dot plus a lagging ring.
 * Elements can opt in to a label with data-cursor="View" (e.g. project imagery).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labeled = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a, button, [role='button'], label, summary, select");
      const text = labeled?.dataset.cursor || "";
      setLabel(text);
      gsap.to(ring.current, {
        scale: text ? 2.6 : interactive ? 1.6 : 1,
        backgroundColor: text ? "rgba(226,180,138,0.95)" : "rgba(226,180,138,0)",
        borderColor: text ? "rgba(226,180,138,0)" : "rgba(226,180,138,0.6)",
        duration: 0.45,
        ease: "expo.out",
      });
      gsap.to(dot.current, { scale: text || interactive ? 0 : 1, duration: 0.3 });
    };
    const leave = () => {
      visible = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };
    const down = () => gsap.to(ring.current, { scale: "*=0.8", duration: 0.2 });
    const up = () => gsap.to(ring.current, { scale: "/=0.8", duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className="cursor-root" aria-hidden="true" style={{ display: enabled ? undefined : "none" }}>
      <div
        ref={ring}
        className="invisible absolute left-0 top-0 -ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-full border border-copper-300/60 opacity-0"
      >
        <span className="font-mono text-[0.32rem] uppercase tracking-[0.2em] text-ink">{label}</span>
      </div>
      <div ref={dot} className="invisible absolute left-0 top-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-copper-300 opacity-0" />
    </div>
  );
}
