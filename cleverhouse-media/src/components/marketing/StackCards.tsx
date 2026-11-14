import Image from "../site/Img";
import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";

type Card = { kicker: string; title: string; body: string; image: string; points: string[] };

/** Sticky stacking cards — each new card slides over and the previous one recedes. */
export function StackCards({ cards }: { cards: Card[] }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const els = gsap.utils.toArray<HTMLElement>("[data-stack]");
        els.forEach((el, i) => {
          if (i === els.length - 1) return;
          gsap.to(el, {
            scale: 0.9 + i * 0.02,
            filter: "brightness(0.55)",
            ease: "none",
            scrollTrigger: {
              trigger: els[i + 1]!,
              start: "top bottom",
              end: "top 18%",
              scrub: true,
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="space-y-6 md:space-y-0">
      {cards.map((c, i) => (
        <article
          key={c.title}
          data-stack
          className="grid origin-top overflow-hidden rounded-[32px] bg-ink-850 ring-1 ring-bone/10 md:sticky md:min-h-[70svh] md:grid-cols-2"
          style={{ top: `calc(14svh + ${i * 22}px)` }}
        >
          <div className="flex flex-col justify-between gap-10 p-8 md:p-14">
            <div>
              <p className="font-mono text-sm text-copper-300">
                0{i + 1} · {c.kicker}
              </p>
              <h3 className="mt-6 font-display text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.92] tracking-[-0.04em]">
                {c.title}
              </h3>
            </div>
            <div>
              <p className="max-w-[44ch] text-lg text-bone/70">{c.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {c.points.map((p) => (
                  <li
                    key={p}
                    className="rounded-full px-3 py-1.5 text-sm text-bone/75 ring-1 ring-bone/15"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative min-h-[300px]">
            <Image
              src={c.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-ink-850/60 to-transparent" />
          </div>
        </article>
      ))}
      <div className="hidden h-[30svh] md:block" />
    </div>
  );
}
