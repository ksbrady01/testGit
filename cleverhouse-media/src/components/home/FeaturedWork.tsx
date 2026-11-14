import Image from "../ui/Img";
import Link from "../ui/Link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "../../lib/gsap";
import { SplitHeading } from "../motion/Motion";
import { Button } from "../ui/Button";
import { BrowserFrame, MockSite, PhoneFrame, MockMobile } from "../work/Mockups";
import { projects } from "../../content/projects";

/** Horizontal, pinned showcase of featured (concept) projects. */
export function FeaturedWork() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        });
        // Inner parallax inside the horizontal movement
        gsap.utils.toArray<HTMLElement>("[data-fw-device]").forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: 12 },
            {
              xPercent: -12,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
        gsap.utils.toArray<HTMLElement>("[data-fw-name]").forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-fw-panel]").forEach((el) => {
          gsap.from(el, {
            y: 60,
            autoAlpha: 0,
            duration: 1.2,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="surface-bone relative" aria-labelledby="work-heading">
      <div className="shell relative pb-16 pt-28 md:pt-40">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="label label-dot text-copper-700">Featured work</p>
            <SplitHeading
              id="work-heading"
              className="mt-6 font-display text-huge font-medium text-ink"
            >
              Good work gets noticed.{" "}
              <span className="serif-accent text-copper-600">Great work</span> gets results.
            </SplitHeading>
          </div>
          <div className="md:col-span-4 md:pb-3">
            <p className="text-ink/65">
              Concept projects that show how we think through real business challenges — from a
              local service company to a neighborhood restaurant, a professional firm, and a growing
              church.
            </p>
          </div>
        </div>
      </div>

      <div ref={pin} className="relative overflow-hidden lg:h-svh">
        <div
          ref={track}
          className="flex flex-col gap-6 px-(--gutter) pb-20 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[3vw] lg:pb-0"
        >
          {projects.map((p, i) => (
            <article
              key={p.slug}
              data-fw-panel
              className="relative isolate flex h-[min(86svh,880px)] min-h-[620px] w-full shrink-0 overflow-hidden rounded-[32px] bg-ink text-bone lg:h-[82svh] lg:w-[min(84vw,1400px)]"
            >
              <Link
                href={`/work/${p.slug}`}
                className="absolute inset-0 z-30"
                aria-label={`View concept project: ${p.name}`}
                data-cursor="View"
              />
              <Image
                src={p.hero}
                alt=""
                fill
                sizes="85vw"
                className="-z-10 object-cover opacity-35 duotone"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink via-ink/80 to-ink/30" />
              <div
                className="absolute -z-10 h-[60%] w-[50%] rounded-full blur-[120px]"
                style={{ background: p.accent, opacity: 0.18, right: "5%", top: "10%" }}
              />

              <div className="relative z-10 flex w-full flex-col justify-between p-6 md:p-10 lg:w-[44%] lg:p-14">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-copper-300">0{i + 1}</span>
                  <span className="concept-badge">Concept Project</span>
                </div>
                <div>
                  <p className="label text-bone/55">{p.industry}</p>
                  <h3
                    data-fw-name
                    className="mt-4 font-display text-[clamp(2.4rem,4.6vw,5.4rem)] font-medium leading-[0.92] tracking-[-0.04em]"
                  >
                    {p.name}
                  </h3>
                  <p className="mt-5 max-w-[34ch] text-lg text-bone/70">{p.tagline}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.services.slice(0, 4).map((s) => (
                      <li
                        key={s}
                        className="rounded-full px-3 py-1.5 text-xs text-bone/75 ring-1 ring-bone/20"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="mt-8 inline-flex items-center gap-3 font-display text-lg">
                  View the project
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-copper-400 text-ink">
                    <ArrowUpRight size={18} />
                  </span>
                </span>
              </div>

              <div className="pointer-events-none absolute bottom-[-8%] right-[-6%] z-0 w-[92%] md:w-[70%] lg:bottom-auto lg:right-[3%] lg:top-1/2 lg:w-[56%] lg:-translate-y-1/2">
                <div data-fw-device className="relative">
                  <BrowserFrame url={`${p.slug.replace(/-/g, "")}.com`}>
                    <MockSite project={p} />
                  </BrowserFrame>
                  <div className="absolute -bottom-[10%] -left-[6%] w-[24%]">
                    <PhoneFrame>
                      <MockMobile project={p} image={p.gallery[0]} />
                    </PhoneFrame>
                  </div>
                </div>
              </div>
            </article>
          ))}
          <div className="flex w-full shrink-0 flex-col items-start justify-center gap-6 py-10 lg:w-[30vw] lg:py-0">
            <p className="font-display text-big font-medium text-ink">
              Your project could be next.
            </p>
            <Button href="/work" variant="dark">
              Explore Our Work
            </Button>
          </div>
        </div>
        <div
          className="absolute bottom-8 left-(--gutter) right-(--gutter) hidden h-px bg-ink/15 lg:block"
          aria-hidden="true"
        >
          <span ref={bar} className="block h-full origin-left scale-x-0 bg-copper-600" />
        </div>
      </div>
    </section>
  );
}
