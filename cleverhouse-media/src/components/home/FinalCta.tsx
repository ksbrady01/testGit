import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { LogoMark } from "../brand/Logo";
import { Button } from "../site/Button";
import { SplitHeading } from "../motion/Motion";

/** Full-screen closing moment. The CH mark tilts toward the cursor under a moving copper light. */
export function FinalCta() {
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          mark.current,
          { scale: 0.7, rotateZ: -10, autoAlpha: 0 },
          {
            scale: 1,
            rotateZ: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "center center",
              scrub: true,
            },
          },
        );
      });
      mm.add(
        "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
        () => {
          const rx = gsap.quickTo(mark.current, "rotateX", { duration: 1, ease: "power3" });
          const ry = gsap.quickTo(mark.current, "rotateY", { duration: 1, ease: "power3" });
          const lx = gsap.quickTo(light.current, "x", { duration: 0.9, ease: "power3" });
          const ly = gsap.quickTo(light.current, "y", { duration: 0.9, ease: "power3" });
          const el = root.current!;
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            ry(nx * 30);
            rx(-ny * 22);
            lx(e.clientX - r.left);
            ly(e.clientY - r.top);
          };
          el.addEventListener("pointermove", move);
          return () => el.removeEventListener("pointermove", move);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-ink"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 -z-10 grid-lines opacity-60" aria-hidden="true" />
      <div
        ref={light}
        aria-hidden="true"
        className="pointer-events-none absolute -left-[30vmin] -top-[30vmin] -z-10 h-[60vmin] w-[60vmin] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(226,180,138,0.22), transparent 65%)",
          transform: "translate(50vw, 50vh)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid place-items-center perspective-[1100px]"
        aria-hidden="true"
      >
        <div ref={mark} className="w-[min(70vw,560px)] opacity-[0.16] transform-3d">
          <LogoMark />
        </div>
      </div>
      <div className="shell relative py-32 text-center">
        <p className="label text-copper-300">Ready when you are</p>
        <SplitHeading
          id="cta-heading"
          as="h2"
          by="words"
          className="mx-auto mt-8 max-w-[15ch] font-display text-giant font-medium"
        >
          Your next big idea deserves a <span className="text-copper">better</span> digital
          experience.
        </SplitHeading>
        <p className="mx-auto mt-8 max-w-[38ch] text-lead text-bone/70">
          Let&apos;s create something people notice, remember, and act on.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button href="/contact">Start Your Project</Button>
          <Button href="/seo-evaluation" variant="ghost" icon={false}>
            Request an SEO Evaluation
          </Button>
        </div>
      </div>
    </section>
  );
}
