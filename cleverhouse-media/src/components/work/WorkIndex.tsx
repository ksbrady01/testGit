import Image from "../ui/Img";
import Link from "../ui/Link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Flip } from "gsap/Flip";
import { gsap, useGSAP } from "../../lib/gsap";
import { projects, workFilters, type WorkCategory } from "../../content/projects";
import { BrowserFrame, MockSite, PhoneFrame, MockMobile, SocialPost } from "./Mockups";
import clsx from "../../lib/clsx";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);

const layouts = [
  // full-bleed feature
  "md:col-span-12",
  // staggered pair
  "md:col-span-7",
  "md:col-span-5 md:mt-40",
  "md:col-span-10 md:col-start-2",
];

export function WorkIndex() {
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<"all" | WorkCategory>("all");
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = projects.filter((p) => filter === "all" || p.categories.includes(filter));

  const choose = (id: "all" | WorkCategory) => {
    if (id === filter) return;
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-work-item]"));
    setFilter(id);
  };

  useGSAP(
    () => {
      if (!flipState.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        flipState.current = null;
        return;
      }
      Flip.from(flipState.current, {
        targets: grid.current!.querySelectorAll("[data-work-item]"),
        duration: 0.9,
        ease: "expo.inOut",
        absolute: true,
        scale: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 60, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "expo.out", delay: 0.2 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.5, ease: "power2.in" }),
        onComplete: () => {
          import("../../lib/gsap").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
        },
      });
      flipState.current = null;
    },
    { scope: root, dependencies: [filter] },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-work-media]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(14% 10% 14% 10% round 32px)" },
            { clipPath: "inset(0% 0% 0% 0% round 32px)", ease: "expo.out", duration: 1.6, scrollTrigger: { trigger: el, start: "top 85%", once: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className="sticky top-[84px] z-30 py-4 md:top-[92px]">
        <div className="shell">
          <div role="toolbar" aria-label="Filter work" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto rounded-full p-1">
            <div className="glass flex gap-1 rounded-full p-1.5 ring-1 ring-bone/10">
              {workFilters.map((f) => {
                const count = f.id === "all" ? projects.length : projects.filter((p) => p.categories.includes(f.id as WorkCategory)).length;
                const on = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(f.id)}
                    className={clsx(
                      "relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm transition-all duration-500 ease-out-expo",
                      on ? "bg-copper-300 text-ink" : "text-bone/70 hover:bg-bone/8 hover:text-bone",
                    )}
                  >
                    {f.label}
                    <span className={clsx("font-mono text-[0.65rem]", on ? "text-ink/60" : "text-bone/40")}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </div>

      <ul ref={grid} className="shell mt-10 grid grid-cols-1 gap-x-6 gap-y-24 md:grid-cols-12 md:gap-y-32">
        {visible.map((p, i) => {
          const big = i === 0;
          return (
            <li key={p.slug} data-work-item data-flip-id={p.slug} className={clsx(layouts[i % layouts.length])}>
              <Link href={`/work/${p.slug}`} className="group block" data-cursor="View">
                <div
                  data-work-media
                  className={clsx(
                    "relative overflow-hidden rounded-[32px] bg-ink-850",
                    big ? "aspect-4/5 sm:aspect-16/10 md:aspect-21/10" : "aspect-4/5 md:aspect-4/5",
                  )}
                >
                  <Image
                    src={p.hero}
                    alt=""
                    fill
                    sizes={big ? "100vw" : "(max-width: 768px) 100vw, 55vw"}
                    className="object-cover transition-all duration-1400 ease-out-expo group-hover:scale-105 group-hover:opacity-40"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent" />
                  {/* Hover reveal: the work itself */}
                  <div
                    className={clsx(
                      "pointer-events-none absolute transition-all duration-1100 ease-out-expo",
                      big
                        ? "right-[4%] top-1/2 w-[48%] -translate-y-[44%] opacity-95 group-hover:-translate-y-1/2 group-hover:opacity-100 max-md:hidden"
                        : "inset-x-[8%] top-[14%] translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                    )}
                  >
                    {big || i % 2 === 1 ? (
                      <BrowserFrame url={`${p.slug.replace(/-/g, "")}.com`}>
                        <MockSite project={p} />
                      </BrowserFrame>
                    ) : (
                      <div className="mx-auto w-[46%]">
                        <PhoneFrame>
                          <MockMobile project={p} image={p.gallery[0]} />
                        </PhoneFrame>
                      </div>
                    )}
                    {big && (
                      <div className="absolute -bottom-[22%] -right-[3%] w-[30%] rotate-[5deg] transition-transform duration-1100 ease-out-expo group-hover:rotate-0">
                        <SocialPost project={p} post={p.social[0]} />
                      </div>
                    )}
                  </div>
                  <div className="absolute left-5 top-5 flex flex-wrap gap-2 md:left-7 md:top-7">
                    <span className="concept-badge">{p.kind === "concept" ? "Concept Project" : "Client Project"}</span>
                  </div>
                  {big && (
                    <div className="absolute bottom-0 left-0 p-6 md:p-10">
                      <p className="label text-copper-200">{p.industry}</p>
                      <h2 className="mt-3 max-w-[11ch] font-display text-[clamp(2.6rem,5.2vw,6rem)] font-medium leading-[0.9] tracking-[-0.045em] md:max-w-[44vw]">{p.name}</h2>
                    </div>
                  )}
                </div>
                <div className={clsx("mt-6 grid gap-3", big ? "md:grid-cols-12" : "")}>
                  {!big && (
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[0.95] tracking-[-0.035em] transition-colors group-hover:text-copper-200">{p.name}</h2>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full ring-1 ring-bone/20 transition-all duration-500 group-hover:rotate-45 group-hover:bg-copper-300 group-hover:text-ink">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>
                  )}
                  <p className={clsx("text-bone/65", big ? "md:col-span-6" : "")}>{p.summary}</p>
                  <ul className={clsx("flex flex-wrap gap-2", big ? "md:col-span-5 md:col-start-8 md:justify-end" : "")}>
                    {p.categories.map((c) => (
                      <li key={c} className="rounded-full px-3 py-1 text-xs text-bone/60 ring-1 ring-bone/15">
                        {workFilters.find((f) => f.id === c)?.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
