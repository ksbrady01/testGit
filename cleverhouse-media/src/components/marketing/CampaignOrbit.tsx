import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { projects } from "../../content/projects";
import { SocialPost } from "../work/Mockups";

/** Campaign creative floating in layered depth; drifts with scroll and pointer. */
export function CampaignOrbit() {
  const root = useRef<HTMLDivElement>(null);
  const cards = [
    {
      p: projects[1],
      s: projects[1].social[0],
      cls: "left-[2%] top-[8%] w-[34%] rotate-[-7deg]",
      depth: 1.2,
    },
    {
      p: projects[0],
      s: projects[0].social[2],
      cls: "left-[36%] top-[0%] w-[30%] rotate-3 z-10",
      depth: 0.6,
    },
    {
      p: projects[3],
      s: projects[3].social[1],
      cls: "right-[0%] top-[14%] w-[30%] rotate-[8deg]",
      depth: 1.4,
    },
    {
      p: projects[2],
      s: projects[2].social[2],
      cls: "left-[20%] top-[46%] w-[28%] -rotate-2 z-20",
      depth: 0.9,
    },
  ];
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const els = gsap.utils.toArray<HTMLElement>("[data-orbit]");
        gsap.from(els, {
          y: 120,
          autoAlpha: 0,
          rotate: 0,
          stagger: 0.12,
          duration: 1.6,
          ease: "expo.out",
          delay: 0.5,
        });
        els.forEach((el) => {
          const d = Number(el.dataset["depth"]);
          gsap.to(el, {
            yPercent: -18 * d,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to(el.firstElementChild, {
            y: 10 * d,
            duration: 3 + d,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      });
      mm.add(
        "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
        () => {
          const els = gsap.utils.toArray<HTMLElement>("[data-orbit]");
          const move = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            els.forEach((el) => {
              const d = Number(el.dataset["depth"]);
              gsap.to(el, {
                x: nx * 40 * d,
                y: ny * 24 * d,
                duration: 1.2,
                ease: "power3.out",
                overwrite: "auto",
              });
            });
          };
          window.addEventListener("pointermove", move, { passive: true });
          return () => window.removeEventListener("pointermove", move);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="relative aspect-[1/0.9] w-full" aria-hidden="true">
      {cards.map((c, i) => (
        <div key={i} data-orbit data-depth={c.depth} className={`absolute ${c.cls}`}>
          <div>
            <SocialPost project={c.p} post={c.s} />
          </div>
        </div>
      ))}
      <div className="absolute bottom-[4%] right-[6%] z-30 rounded-2xl bg-ink/85 p-4 ring-1 ring-bone/10 backdrop-blur-sm">
        <p className="label text-verdigris-300">Campaign · live</p>
        <div className="mt-3 flex items-end gap-1.5">
          {[30, 42, 38, 56, 62, 74, 88].map((h, i) => (
            <span
              key={i}
              className="w-3 rounded-xs bg-linear-to-t from-copper-700 to-copper-300"
              style={{ height: `${h * 0.5}px` }}
            />
          ))}
        </div>
        <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-bone/40">
          Illustrative
        </p>
      </div>
    </div>
  );
}
