import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../../lib/seo";
import Image from "../../components/site/Img";
import { Marquee, Reveal, SplitHeading } from "../../components/motion/Motion";
import { WorkIndex } from "../../components/work/WorkIndex";
import { CreativeWall } from "../../components/work/CreativeWall";
import { CtaBand } from "../../components/sections/Blocks";
import { projects } from "../../content/projects";
import { img } from "../../content/images";

const metadata = {
  title: "Our Work",
  description:
    "Explore CleverHouse Media’s work across websites, branding, social media, SEO, and digital experiences — including concept projects that show how we approach real business challenges.",
  alternates: { canonical: "/work" },
};

function WorkPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-16 pt-40 md:pb-24 md:pt-48">
        <div className="absolute inset-0 grid-lines opacity-50" aria-hidden="true" />
        {/* Cinematic backdrop strip */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[34%] opacity-45 md:top-[26%]"
          aria-hidden="true"
        >
          <Marquee speed={60}>
            {[...projects.map((p) => p.hero), img.studioTeam, img.stickyWall].map((src, i) => (
              <div
                key={i}
                className="relative mr-6 h-[34vh] w-[26vh] shrink-0 overflow-hidden rounded-[22px] md:h-[46vh] md:w-[34vh]"
                style={{ transform: `rotate(${i % 2 ? 3 : -3}deg)` }}
              >
                <Image src={src} alt="" fill sizes="30vh" className="object-cover duotone" />
              </div>
            ))}
          </Marquee>
        </div>
        <div
          className="absolute inset-0 bg-linear-to-b from-ink via-ink/10 to-ink"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-linear-to-r from-ink/90 via-ink/40 to-transparent"
          aria-hidden="true"
        />

        <div className="shell relative">
          <Reveal kind="fade">
            <p className="label label-dot text-copper-300">Our work</p>
          </Reveal>
          <SplitHeading
            as="h1"
            onLoad
            delay={0.45}
            by="words"
            className="mt-6 font-display text-mega font-medium"
          >
            Work that speaks <span className="serif-accent text-copper-300">before</span> we do.
          </SplitHeading>
          <div className="mt-12 grid gap-8 md:grid-cols-12">
            <Reveal kind="up" delay={0.6} className="md:col-span-5 md:col-start-8">
              <p className="font-display text-large font-medium">
                Bold ideas. Thoughtful execution. Digital experiences that make an impression.
              </p>
              <p className="mt-6 text-bone/65">
                Explore how we approach websites, brands, campaigns, and connected experiences for
                very different kinds of businesses.
              </p>
            </Reveal>
            <Reveal kind="fade" delay={0.8} className="md:col-span-5 md:row-start-1">
              <div className="rounded-2xl bg-bone/5 p-5 text-sm text-bone/70 ring-1 ring-bone/10">
                <p className="label text-copper-300">A note on these projects</p>
                <p className="mt-3">
                  The projects shown here are{" "}
                  <strong className="text-bone">Concept Projects</strong> — design demonstrations
                  created by CleverHouse Media to illustrate our thinking. The businesses are
                  fictional, and no client results are implied. Approved client case studies will be
                  added as they’re published.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative bg-ink pb-32" aria-label="Projects">
        <WorkIndex />
      </section>

      <CreativeWall />

      <CtaBand
        title={
          <>
            I want CleverHouse to do <span className="serif-accent text-copper-300">this</span> for
            my business.
          </>
        }
        body="Tell us where you are and where you want to go. We’ll bring the strategy, design, and technology to get you there."
        primary={{ label: "Start Your Project", href: "/contact" }}
        secondary={{ label: "Read the case studies", href: "/case-studies" }}
      />
    </>
  );
}

export const Route = createFileRoute("/work/")({
  head: () => seo(metadata, "/work"),
  component: WorkPage,
});
