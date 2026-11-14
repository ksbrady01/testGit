import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import Image from "@/components/ui/Img";
import Link from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/Blocks";
import { Reveal } from "@/components/motion/Motion";
import { projects } from "@/content/projects";
import { img } from "@/content/images";

const metadata = {
  title: "Case Studies",
  description: "The thinking behind the work. Explore the challenges, strategy, creative process, and deliverables behind CleverHouse Media projects.",
  alternates: { canonical: "/case-studies" },
};

function CaseStudiesPage() {
  return (
    <>
      <PageHero
        variant="stack"
        eyebrow="Case studies"
        title={
          <>
            The thinking behind the work. <span className="serif-accent text-copper-300">The work behind the results.</span>
          </>
        }
        intro="Every project starts with a question worth answering. These studies walk through the challenge, the insight, the strategy, and the creative decisions — step by step."
        images={[img.stickyWall, img.thinkerWoman, img.studioDesk]}
      />

      <section className="relative bg-ink pb-32">
        <div className="shell">
          <Reveal kind="fade">
            <p className="max-w-[70ch] rounded-2xl bg-bone/5 p-5 text-sm text-bone/65 ring-1 ring-bone/10">
              <span className="label mr-2 text-copper-300">Transparency:</span>
              The studies below document CleverHouse Media concept projects — fictional businesses used to demonstrate our process. They describe what we would measure rather than reporting results. Verified client case studies will be published with permission.
            </p>
          </Reveal>

          <ol className="mt-16 space-y-6">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <Reveal kind="up">
                  <Link href={`/case-studies/${p.slug}`} className="group grid overflow-hidden rounded-[32px] bg-ink-850 ring-1 ring-bone/8 transition-colors hover:bg-ink-800 md:grid-cols-12" data-cursor="Read">
                    <div className="relative aspect-[16/10] overflow-hidden md:col-span-5 md:aspect-auto md:min-h-[420px]">
                      <Image src={p.hero} alt="" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-850/40" />
                      <span className="concept-badge absolute left-5 top-5">Concept · Study 0{i + 1}</span>
                    </div>
                    <div className="flex flex-col justify-between gap-10 p-8 md:col-span-7 md:p-12">
                      <div>
                        <p className="label text-copper-300">{p.industry}</p>
                        <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.6rem)] font-medium leading-[0.98] tracking-[-0.035em]">{p.name}</h2>
                        <p className="mt-6 max-w-[52ch] font-serif text-2xl italic leading-snug text-bone/85">&ldquo;{p.caseStudy.insight}&rdquo;</p>
                      </div>
                      <div className="flex flex-wrap items-end justify-between gap-6">
                        <ul className="flex flex-wrap gap-2">
                          {p.caseStudy.process.map((s) => (
                            <li key={s.step} className="rounded-full px-3 py-1 text-xs text-bone/65 ring-1 ring-bone/15">
                              {s.step}
                            </li>
                          ))}
                        </ul>
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-copper-300 text-ink transition-transform duration-500 group-hover:rotate-45">
                          <ArrowUpRight size={20} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        light
        title="Your story could be the next case study."
        body="Tell us about the challenge you’re facing. We’ll start with the right questions."
        primary={{ label: "Start Your Project", href: "/contact" }}
        secondary={{ label: "See the work", href: "/work" }}
      />
    </>
  );
}

export const Route = createFileRoute("/case-studies/")({
  head: () => seo(metadata, "/case-studies"),
  component: CaseStudiesPage,
});
