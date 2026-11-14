import { createFileRoute, notFound } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import Image from "@/components/ui/Img";
import Link from "@/components/ui/Link";
import { getProject, projects } from "@/content/projects";
import { Reveal, SplitHeading, ScrubWords, Parallax } from "@/components/motion/Motion";
import { BrowserFrame, MockSite, PhoneFrame, MockMobile, SocialPost } from "@/components/work/Mockups";
import { CtaBand, ProcessStrip, Tags } from "@/components/sections/Blocks";

function CaseStudyPage() {
  const { slug } = Route.useParams();
  const p = getProject(slug);
  if (!p) return null;
  const cs = p.caseStudy;
  const next = projects[(projects.findIndex((x) => x.slug === p.slug) + 1) % projects.length];

  return (
    <>
      {/* Hero: split, editorial */}
      <section className="relative overflow-hidden bg-ink pb-20 pt-36 md:pt-44">
        <div className="absolute inset-0 grid-lines opacity-50" aria-hidden="true" />
        <div className="shell relative">
          <Reveal kind="fade" className="flex flex-wrap items-center gap-3">
            <Link href="/case-studies" className="label link-line text-bone/60">
              ← Case studies
            </Link>
            <span className="concept-badge">Concept project study</span>
          </Reveal>
          <div className="mt-10 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="label text-copper-300">{p.industry}</p>
              <SplitHeading as="h1" onLoad delay={0.45} className="mt-4 font-display text-giant font-medium">
                {p.name}
              </SplitHeading>
              <Reveal kind="up" delay={0.5}>
                <p className="mt-8 max-w-[30ch] font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] italic leading-tight text-copper-200">&ldquo;{cs.insight}&rdquo;</p>
              </Reveal>
            </div>
            <div className="relative lg:col-span-5">
              <Reveal kind="image" className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
                <Image src={p.hero} alt="" fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* The challenge */}
      <section className="surface-paper relative py-24 md:py-36">
        <div className="shell grid gap-12 md:grid-cols-12">
          <p className="label label-dot text-copper-700 md:col-span-3">01 · The challenge</p>
          <div className="md:col-span-8">
            <ScrubWords className="font-display text-large font-medium text-ink" text={p.challenge} />
          </div>
        </div>
      </section>

      {/* Research */}
      <section className="relative bg-ink py-24 md:py-36">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label label-dot text-copper-300">02 · Research & discovery</p>
            <SplitHeading className="mt-6 font-display text-big font-medium">What we’d investigate first.</SplitHeading>
          </div>
          <Reveal kind="up" stagger={0.08} as="ul" className="grid gap-4 sm:grid-cols-2 md:col-span-7 md:col-start-6">
            {cs.research.map((r, i) => (
              <li key={r} className="flex min-h-[160px] flex-col justify-between rounded-[24px] bg-bone/5 p-6 ring-1 ring-bone/10">
                <span className="font-mono text-xs text-copper-400">R{i + 1}</span>
                <p className="font-display text-xl tracking-tight">{r}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Strategy */}
      <section className="relative overflow-hidden py-24 md:py-36" style={{ background: p.brand.bg, color: p.brand.fg }}>
        <div className="shell grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="label" style={{ color: p.brand.accent }}>
              03 · Strategy
            </p>
            <SplitHeading className="mt-6 font-display text-big font-medium">{cs.strategy}</SplitHeading>
          </div>
          <Parallax speed={-14} className="md:col-span-5 md:col-start-8">
            <BrowserFrame url={`${p.slug.replace(/-/g, "")}.com`}>
              <MockSite project={p} />
            </BrowserFrame>
          </Parallax>
        </div>
      </section>

      {/* Creative */}
      <section className="surface-bone relative py-24 md:py-36">
        <div className="shell grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label label-dot text-copper-700">04 · Creative direction</p>
            <p className="mt-6 font-display text-large font-medium text-ink">{p.caseStudy.creative}</p>
            <div className="mt-8 flex gap-3">
              {[p.brand.bg, p.brand.fg, p.brand.accent, p.brand.muted].map((c) => (
                <span key={c} className="h-12 w-12 rounded-full ring-1 ring-ink/10" style={{ background: c }} title={c} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 md:col-span-6 md:col-start-7">
            <Reveal kind="up">
              <PhoneFrame>
                <MockMobile project={p} image={p.gallery[0]} />
              </PhoneFrame>
            </Reveal>
            <Reveal kind="up" delay={0.15} className="mt-16">
              <SocialPost project={p} post={p.social[0]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative bg-ink py-24 md:py-36">
        <div className="shell">
          <p className="label label-dot text-copper-300">05 · Process</p>
          <SplitHeading className="mt-6 max-w-[18ch] font-display text-big font-medium">From first conversation to launch — and beyond.</SplitHeading>
          <div className="mt-14">
            <ProcessStrip steps={p.caseStudy.process} />
          </div>
        </div>
      </section>

      {/* Deliverables + measurement */}
      <section className="surface-paper relative py-24 md:py-32">
        <div className="shell grid gap-16 md:grid-cols-2">
          <div>
            <p className="label label-dot text-copper-700">06 · Deliverables</p>
            <div className="mt-8">
              <Tags items={p.deliverables} light />
            </div>
          </div>
          <div>
            <p className="label label-dot text-copper-700">07 · How we’d measure success</p>
            <ul className="mt-8 space-y-5">
              {p.outcomes.map((o) => (
                <li key={o.title} className="border-b border-ink/12 pb-5">
                  <p className="font-display text-2xl font-medium tracking-tight text-ink">{o.title}</p>
                  <p className="mt-1 text-ink/65">{o.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink/50">Concept project — no performance results are claimed.</p>
          </div>
        </div>
      </section>

      {/* Next */}
      <Link href={`/case-studies/${next.slug}`} className="group relative block overflow-hidden bg-ink-950 py-24 md:py-32" data-cursor="Next">
        <Image src={next.hero} alt="" fill sizes="100vw" className="object-cover opacity-20 transition-all duration-[1400ms] ease-out-expo group-hover:scale-105 group-hover:opacity-35" />
        <div className="shell relative">
          <p className="label text-copper-300">Next study</p>
          <p className="mt-6 font-display text-giant font-medium transition-colors group-hover:text-copper-200">{next.name}</p>
        </div>
      </Link>

      <CtaBand
        title="Have a challenge like this?"
        body="We’d love to hear about it. Every great project begins with a conversation."
        primary={{ label: "Start a Similar Project", href: "/contact" }}
        secondary={{ label: "View the project", href: `/work/${p.slug}` }}
      />
    </>
  );
}

export const Route = createFileRoute("/case-studies/$slug")({
  loader: ({ params }) => {
    const x = getProject(params.slug);
    if (!x) throw notFound();
    return { meta: { title: `${x.name} Case Study (Concept)`, description: `The challenge, strategy, creative process, and deliverables behind the ${x.name} concept project.` } };
  },
  head: ({ loaderData, params }) => (loaderData ? seo(loaderData.meta, `/case-studies/${params.slug}`) : {}),
  component: CaseStudyPage,
});
