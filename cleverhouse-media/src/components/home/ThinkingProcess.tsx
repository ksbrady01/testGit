import Image from "@/components/ui/Img";
import { lazyClient } from "@/lib/lazyClient";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { canUseWebGL } from "@/lib/webgl";
import { SplitHeading } from "@/components/motion/Motion";
import { img } from "@/content/images";
import clsx from "@/lib/clsx";
import type { MorphProgress } from "@/components/three/ThinkingMorph";

const ThinkingMorph = lazyClient(() => import("@/components/three/ThinkingMorph"));

const stages = [
  {
    word: "Think",
    title: "We start with the right questions.",
    body: "Who are you trying to reach, what do they need, and what will make them choose you? Strategy begins with listening — to you, your customers, and the data.",
    image: img.thinkerGlasses,
    alt: "A strategist deep in thought",
  },
  {
    word: "Design",
    title: "Ideas take shape.",
    body: "Wireframes, visual direction, and messaging turn insight into an experience people understand in seconds — and remember long after.",
    image: img.stickyNotes,
    alt: "Ideas mapped out on notes during a design session",
  },
  {
    word: "Build",
    title: "Crafted to perform.",
    body: "Fast, accessible, search-ready websites and campaigns, engineered with the same care as the design that inspired them.",
    image: img.studioPod,
    alt: "A developer building at a focused workstation",
  },
  {
    word: "Connect",
    title: "Everything works together.",
    body: "Your site, search, social, CRM, and automation share data and hand off leads, so nothing — and no one — falls through the cracks.",
    image: img.community,
    alt: "People connecting as a community",
  },
  {
    word: "Grow",
    title: "Results you can see.",
    body: "We measure what matters, learn from it, and keep optimizing — so your digital presence gets smarter and stronger over time.",
    image: img.texas,
    alt: "A Texas city skyline at dusk",
  },
];

export function ThinkingProcess() {
  const root = useRef<HTMLElement>(null);
  const pinEl = useRef<HTMLDivElement>(null);
  const progress = useRef<MorphProgress>({ v: 0 });
  const [stage, setStage] = useState(0);
  const [webgl, setWebgl] = useState(false);
  useEffect(() => setWebgl(canUseWebGL()), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const st = ScrollTrigger.create({
          trigger: pinEl.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 3.2,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          snap: { snapTo: [0, 0.25, 0.5, 0.75, 1], duration: { min: 0.2, max: 0.6 }, delay: 0.05, ease: "power2.inOut" },
          onUpdate: (self) => {
            progress.current.v = self.progress * 4;
            setStage(Math.min(4, Math.round(self.progress * 4)));
            gsap.set("[data-tp-bar]", { scaleY: self.progress });
          },
        });
        return () => st.kill();
      });
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        progress.current.v = 0;
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-ink" aria-labelledby="thinking-heading">
      <div className="shell relative pb-16 pt-28 md:pb-20 md:pt-40">
        <p className="label label-dot text-copper-300">How we think</p>
        <SplitHeading id="thinking-heading" className="mt-6 max-w-[16ch] font-display text-huge font-medium">
          We don&apos;t just think outside the box. <span className="serif-accent text-copper-300">We rethink the box.</span>
        </SplitHeading>
      </div>

      {/* Desktop: pinned storytelling */}
      <div ref={pinEl} className="relative hidden h-[100svh] overflow-hidden md:block">
        <div className="absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
        <div className="shell relative grid h-full grid-cols-12 items-center gap-6">
          {/* Stage index */}
          <ol className="relative col-span-3 space-y-3 pl-6" aria-label="Our process">
            <span className="absolute left-0 top-0 h-full w-px bg-bone/10" aria-hidden="true" />
            <span data-tp-bar className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-copper-400" aria-hidden="true" />
            {stages.map((s, i) => (
              <li key={s.word} aria-current={stage === i ? "step" : undefined}>
                <span
                  className={clsx(
                    "block font-display text-[clamp(1.8rem,3.2vw,3.4rem)] font-medium uppercase leading-none tracking-[-0.03em] transition-all duration-700 ease-out-expo",
                    stage === i ? "translate-x-2 text-bone" : "text-bone/20",
                  )}
                >
                  {s.word}
                  {i < 4 && <span className={clsx("ml-3 text-copper-400 transition-opacity", stage === i ? "opacity-100" : "opacity-0")}>→</span>}
                </span>
              </li>
            ))}
          </ol>

          {/* Visual */}
          <div className="relative col-span-5 h-[68svh]">
            <div className="absolute inset-0 overflow-hidden rounded-[32px] bg-ink-850">
              {stages.map((s, i) => (
                <div
                  key={s.word}
                  className="absolute inset-0 transition-[clip-path] duration-[1100ms] ease-in-out-quart"
                  style={{ clipPath: stage >= i ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
                >
                  <Image src={s.image} alt={s.alt} fill sizes="42vw" className={clsx("object-cover transition-transform duration-[1600ms] ease-out-expo", stage === i ? "scale-100" : "scale-110")} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
                </div>
              ))}
              {webgl && <ThinkingMorph progress={progress.current} className="absolute inset-0" />}
              <div className="grain absolute inset-0" aria-hidden="true" />
            </div>
            <span className="absolute -right-3 -top-3 rounded-full bg-copper-400 px-4 py-2 font-mono text-xs text-ink">
              0{stage + 1} / 05
            </span>
          </div>

          {/* Copy */}
          <div className="relative col-span-4 h-[40svh]">
            {stages.map((s, i) => (
              <div
                key={s.word}
                className={clsx("absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-out-expo", stage === i ? "translate-y-0 opacity-100" : stage > i ? "-translate-y-8 opacity-0" : "translate-y-8 opacity-0")}
                aria-hidden={stage !== i}
              >
                <p className="label text-copper-300">Stage 0{i + 1}</p>
                <h3 className="mt-4 font-display text-big font-medium">{s.title}</h3>
                <p className="mt-5 max-w-[40ch] text-lg text-bone/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: stacked chapters */}
      <ol className="shell space-y-14 pb-24 md:hidden">
        {stages.map((s, i) => (
          <li key={s.word}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image src={s.image} alt={s.alt} fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <span className="absolute bottom-4 left-5 font-display text-5xl font-medium uppercase tracking-[-0.03em]">{s.word}</span>
            </div>
            <p className="label mt-6 text-copper-300">Stage 0{i + 1}</p>
            <h3 className="mt-3 font-display text-3xl font-medium tracking-tight">{s.title}</h3>
            <p className="mt-3 text-bone/70">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
