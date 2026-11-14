import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { projects } from "../../content/projects";
import { SocialPost, SearchConcept } from "./Mockups";

/** Horizontal storytelling: campaign & social creative across every concept. */
export function CreativeWall() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const dist = () => track.current!.scrollWidth - window.innerWidth;
        gsap.to(track.current, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-wall-item]").forEach((el, i) => {
          gsap.fromTo(el, { y: i % 2 ? 60 : -40, rotate: i % 2 ? 3 : -3 }, { y: i % 2 ? -40 : 50, rotate: i % 2 ? -2 : 2, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + dist(), scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const items = projects.flatMap((p) => p.social.map((s) => ({ p, s })));

  return (
    <section ref={root} className="surface-bone relative overflow-hidden md:h-svh" aria-labelledby="wall-heading">
      <div className="absolute inset-0 grid-lines-dark opacity-60" aria-hidden="true" />
      <div ref={track} className="relative flex h-full flex-col gap-10 px-(--gutter) py-24 md:w-max md:flex-row md:items-center md:gap-12 md:py-0">
        <div className="shrink-0 md:w-[36vw]">
          <p className="label label-dot text-copper-700">Campaign & social creative</p>
          <h2 id="wall-heading" className="mt-6 font-display text-huge font-medium text-ink">
            Stories made to be <span className="serif-accent text-copper-600">shared.</span>
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg text-ink/65">Social posts, stories, ads, and search presence — designed as one consistent system for each concept brand.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:gap-10">
          {items.map(({ p, s }, i) => (
            <div key={`${p.slug}-${i}`} data-wall-item className="w-full shrink-0 md:w-[19vw] md:min-w-[230px] md:max-w-[300px]">
              <SocialPost project={p} post={s} />
              <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink/45">{p.name} · concept</p>
            </div>
          ))}
          {projects
            .filter((p) => p.search)
            .slice(0, 2)
            .map((p) => (
              <div key={`search-${p.slug}`} data-wall-item className="col-span-2 w-full shrink-0 md:w-[30vw] md:min-w-[360px]">
                <SearchConcept project={p} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
