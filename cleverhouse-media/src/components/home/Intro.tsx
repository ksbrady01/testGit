import Image from "../ui/Img";
import Link from "../ui/Link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, ScrubWords, SplitHeading, Parallax } from "../motion/Motion";
import { img } from "../../content/images";

export function Intro() {
  return (
    <section
      id="intro"
      className="surface-paper relative overflow-hidden py-28 md:py-44"
      aria-labelledby="intro-heading"
    >
      <div className="absolute inset-0 grid-lines-dark opacity-70" aria-hidden="true" />
      <div className="shell relative">
        <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-6">
          <Reveal kind="fade" className="md:col-span-3">
            <p className="label label-dot text-copper-700">Hello, we&apos;re CleverHouse Media.</p>
            <p className="mt-6 max-w-[30ch] font-mono text-xs leading-relaxed text-ink/50">
              (Est. in Texas)
              <br />
              Design · Search · Marketing · Technology
            </p>
          </Reveal>
          <div className="md:col-span-9">
            <SplitHeading
              id="intro-heading"
              as="h2"
              className="font-display text-huge font-medium text-ink"
            >
              Big ideas. Smart strategy.{" "}
              <span className="serif-accent text-copper-600">Remarkable</span> digital experiences.
            </SplitHeading>
          </div>
        </div>

        <div className="mt-20 grid gap-10 md:mt-32 md:grid-cols-12 md:gap-6">
          {/* Layered image composition */}
          <div className="relative md:col-span-7">
            <Reveal
              kind="image"
              className="relative aspect-4/5 overflow-hidden rounded-[28px] md:aspect-5/6"
            >
              <Image
                src={img.studioTeam}
                alt="The CleverHouse team collaborating in a warm, modern studio"
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover"
              />
            </Reveal>
            <Parallax
              speed={-24}
              className="absolute -bottom-10 -right-4 w-[46%] md:-right-16 md:bottom-16"
            >
              <Reveal
                kind="image"
                delay={0.3}
                className="relative aspect-3/4 overflow-hidden rounded-[22px] shadow-2xl ring-8 ring-bone-50"
              >
                <Image
                  src={img.stickyWall}
                  alt="A wall of colorful ideas from a brainstorming session"
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </Reveal>
            </Parallax>
            <div className="absolute left-5 top-5 rounded-full bg-ink/80 px-4 py-2 text-xs text-bone backdrop-blur-sm">
              <span className="font-mono uppercase tracking-[0.18em]">Think → Build → Grow</span>
            </div>
          </div>

          <div className="flex flex-col justify-between md:col-span-4 md:col-start-9 md:pt-20">
            <ScrubWords
              className="font-display text-large font-medium text-ink"
              text="We're a Texas-based digital agency combining creative design, intelligent technology, and strategic marketing to help brands stand out, connect with people, and grow."
            />
            <Reveal kind="up" className="mt-12 space-y-6">
              <p className="text-ink/70">
                We offer a comprehensive, end-to-end approach — web design, SEO, branding, and
                digital strategy — focused on websites, apps, and brand experiences that are
                results-oriented and crafted with care. We don&apos;t just build websites; we build
                digital stories that make a difference.
              </p>
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 font-display text-lg text-ink"
              >
                <span className="link-line">More about us</span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
