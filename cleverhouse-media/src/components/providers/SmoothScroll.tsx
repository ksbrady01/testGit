import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../../lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || touch) return; // native scrolling on touch devices & reduced motion

    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    instance.on("scroll", ScrollTrigger.update);
    rafRef.current = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(rafRef.current);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    (window as unknown as { __lenis?: Lenis }).__lenis = instance;

    if (document.documentElement.dataset.intro === "play") instance.stop();

    return () => {
      if (rafRef.current) gsap.ticker.remove(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
