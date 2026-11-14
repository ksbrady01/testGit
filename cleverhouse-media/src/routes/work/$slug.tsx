import { createFileRoute, notFound } from "@tanstack/react-router";
import { seo } from "../../lib/seo";
import Image from "../../components/ui/Img";
import Link from "../../components/ui/Link";
import { ArrowUpRight, Info } from "lucide-react";
import { getProject, projects } from "../../content/projects";
import { Parallax, Reveal, SplitHeading, ScrollZoom } from "../../components/motion/Motion";
import {
  BrowserFrame,
  MockMobile,
  MockSite,
  PhoneFrame,
  SearchConcept,
  SocialPost,
} from "../../components/work/Mockups";
import { CtaBand, JsonLd, Tags } from "../../components/sections/Blocks";
import { site } from "../../content/site";
import clsx from "../../lib/clsx";

const fontFor = (s: string) =>
  s === "serif" ? "font-serif" : s === "grotesk" ? "font-display" : "font-sans";

function ProjectPage() {
  const { slug } = Route.useParams();
  const p = getProject(slug);
  if (!p) return null;
  const b = p.brand;
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const related = [
    projects[(idx + 1) % projects.length],
    projects[(idx + 2) % projects.length],
  ].filter((r) => r !== undefined);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: `${p.name} (${p.kind === "concept" ? "Concept Project" : "Client Project"})`,
          description: p.summary,
          creator: { "@id": `${site.url}/#organization` },
          genre: p.industry,
          url: `${site.url}/work/${p.slug}`,
        }}
      />

      {/* 1. Cinematic hero */}
      <section className="relative isolate flex min-h-svh items-end overflow-hidden bg-ink pb-14 pt-40">
        <Parallax speed={20} className="absolute inset-0 -z-10 scale-110">
          <Image src={p.hero} alt="" fill priority sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/55 to-ink/25" />
        <div
          className="absolute -z-10 h-[50vh] w-[50vw] rounded-full blur-[140px]"
          style={{ background: p.accent, opacity: 0.22, left: "-10%", bottom: "-10%" }}
          aria-hidden="true"
        />
        <div className="shell">
          <Reveal kind="fade" className="flex flex-wrap items-center gap-3">
            <Link href="/work" className="label text-bone/60 link-line">
              ← All work
            </Link>
            <span className="concept-badge">
              {p.kind === "concept" ? "Concept Project · Design Demonstration" : "Client Project"}
            </span>
          </Reveal>
          <SplitHeading
            as="h1"
            onLoad
            delay={0.45}
            by="chars"
            className="mt-8 font-display text-mega font-medium"
          >
            {p.name}
          </SplitHeading>
          <Reveal kind="up" delay={0.6}>
            <p className="mt-6 max-w-[32ch] font-display text-large text-bone/85">{p.tagline}</p>
          </Reveal>
          {/* 2. Company & industry */}
          <Reveal
            kind="up"
            delay={0.75}
            as="dl"
            className="mt-14 grid grid-cols-2 gap-6 border-t border-bone/15 pt-6 md:grid-cols-4"
          >
            {[
              ["Company", p.name],
              ["Industry", p.industry],
              ["Location", p.location],
              ["Type", p.kind === "concept" ? "Concept project" : "Client project"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label text-bone/45">{k}</dt>
                <dd className="mt-2 text-bone/90">{v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 3. Overview + 4. Challenge */}
      <section className="surface-paper relative py-24 md:py-36">
        <div className="absolute inset-0 grid-lines-dark opacity-60" aria-hidden="true" />
        <div className="shell relative grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label label-dot text-copper-700">Overview</p>
            <SplitHeading className="mt-6 font-display text-big font-medium text-ink">
              {p.summary}
            </SplitHeading>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-16">
            <p className="label label-dot text-copper-700">The challenge</p>
            <Reveal kind="up">
              <p className="mt-6 text-xl leading-relaxed text-ink/75">{p.challenge}</p>
            </Reveal>
            <div className="mt-10 flex items-start gap-3 rounded-2xl bg-bone p-5 text-sm text-ink/65 ring-1 ring-ink/10">
              <Info size={18} className="mt-0.5 shrink-0 text-copper-700" aria-hidden="true" />
              <p>
                This is a concept project created to demonstrate our approach. {p.name} is a
                fictional business; no client endorsement or results are implied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Approach */}
      <section className="relative bg-ink py-24 md:py-36">
        <div className="shell">
          <div className="grid gap-8 md:grid-cols-12">
            <p className="label label-dot text-copper-300 md:col-span-3">Our approach</p>
            <SplitHeading className="font-display text-huge font-medium md:col-span-9">
              Creative and strategic,{" "}
              <span className="serif-accent text-copper-300">in equal measure.</span>
            </SplitHeading>
          </div>
          <Reveal
            kind="up"
            stagger={0.1}
            as="ol"
            className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-bone/10 md:grid-cols-2"
          >
            {p.approach.map((a, i) => (
              <li key={a.title} className="bg-ink p-8 md:p-12">
                <span className="font-mono text-sm" style={{ color: b.accent }}>
                  0{i + 1}
                </span>
                <h3 className="mt-8 font-display text-3xl font-medium tracking-tight md:text-4xl">
                  {a.title}
                </h3>
                <p className="mt-4 max-w-[46ch] text-lg text-bone/70">{a.body}</p>
              </li>
            ))}
          </Reveal>
          {/* 6. Services */}
          <div className="mt-16 grid gap-6 md:grid-cols-12">
            <p className="label text-bone/50 md:col-span-3">Services provided</p>
            <div className="md:col-span-9">
              <Tags items={p.services} />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Brand visuals */}
      <section
        className="relative overflow-hidden py-24 md:py-36"
        style={{ background: b.bg, color: b.fg }}
      >
        <div className="shell">
          <p className="label" style={{ color: b.accent }}>
            Brand system
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-12">
            <Reveal
              kind="scale"
              className="flex min-h-[340px] flex-col justify-between rounded-[28px] p-8 md:col-span-7 md:p-12"
              style={{ background: `${b.fg}0d`, boxShadow: `inset 0 0 0 1px ${b.fg}1a` }}
            >
              <span className="label opacity-60">Wordmark</span>
              <p
                className={clsx(
                  fontFor(b.fontStyle),
                  "text-[clamp(3rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.04em]",
                )}
              >
                {b.wordmark}
              </p>
              <span className="text-sm opacity-60">
                {p.industry} · {p.location}
              </span>
            </Reveal>
            <Reveal
              kind="scale"
              delay={0.1}
              className="grid place-items-center rounded-[28px] p-8 md:col-span-5"
              style={{ background: b.accent, color: b.bg }}
            >
              <span
                className={clsx(
                  fontFor(b.fontStyle),
                  "text-[clamp(4rem,10vw,9rem)] font-bold tracking-[-0.04em]",
                )}
              >
                {b.monogram}
              </span>
            </Reveal>
            <Reveal kind="up" stagger={0.08} className="grid grid-cols-4 gap-4 md:col-span-7">
              {[b.bg, b.fg, b.accent, b.muted].map((c) => (
                <div
                  key={c}
                  className="overflow-hidden rounded-2xl"
                  style={{ boxShadow: `inset 0 0 0 1px ${b.fg}22` }}
                >
                  <div className="aspect-square" style={{ background: c }} />
                  <p className="px-3 py-2 font-mono text-[0.65rem] uppercase opacity-70">{c}</p>
                </div>
              ))}
            </Reveal>
            <Reveal
              kind="up"
              delay={0.1}
              className="rounded-[28px] p-8 md:col-span-5"
              style={{ background: `${b.fg}0d` }}
            >
              <span className="label opacity-60">Typography</span>
              <p
                className={clsx(fontFor(b.fontStyle), "mt-6 text-5xl font-semibold tracking-tight")}
              >
                Aa
              </p>
              <p className={clsx(fontFor(b.fontStyle), "mt-3 text-2xl leading-tight")}>
                {b.heroLine}
              </p>
              <p className="mt-3 text-sm opacity-70">{b.heroSub}</p>
            </Reveal>
          </div>
          {/* Photography direction */}
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {p.gallery.map((g, i) => (
              <Reveal
                key={g}
                kind="image"
                delay={i * 0.1}
                className="relative aspect-4/5 overflow-hidden rounded-[28px]"
              >
                <Image
                  src={g}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-sm opacity-60">
            Photography direction references. Final photography would be produced with the client.
          </p>
        </div>
      </section>

      {/* 8. Desktop & mobile */}
      <section className="relative overflow-hidden bg-ink py-24 md:py-36">
        <div className="absolute inset-0 grid-lines opacity-50" aria-hidden="true" />
        <div className="shell relative">
          <div className="grid gap-8 md:grid-cols-12">
            <p className="label label-dot text-copper-300 md:col-span-3">Website experience</p>
            <SplitHeading className="font-display text-huge font-medium md:col-span-9">
              Desktop to mobile, designed as one.
            </SplitHeading>
          </div>
          <Reveal kind="up" className="relative mt-16 md:mt-24">
            <BrowserFrame
              url={`${p.slug.replace(/-/g, "")}.com`}
              className="mx-auto max-w-[1200px]"
            >
              <MockSite project={p} />
            </BrowserFrame>
          </Reveal>
          <div className="mt-16 grid grid-cols-2 gap-6 md:mt-24 md:grid-cols-4 md:gap-10">
            {[p.hero, ...p.gallery].map((im, i) => (
              <Parallax key={im} speed={[10, -14, 18, -8][i]}>
                <Reveal kind="up" delay={i * 0.08}>
                  <PhoneFrame>
                    <MockMobile project={p} image={im} />
                  </PhoneFrame>
                </Reveal>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Social & campaign */}
      <section className="surface-bone relative py-24 md:py-36">
        <div className="shell">
          <div className="grid gap-8 md:grid-cols-12">
            <p className="label label-dot text-copper-700 md:col-span-3">Social & campaigns</p>
            <SplitHeading className="font-display text-huge font-medium text-ink md:col-span-9">
              Consistent everywhere{" "}
              <span className="serif-accent text-copper-600">people scroll.</span>
            </SplitHeading>
          </div>
          <div className="mt-16 grid items-start gap-6 md:grid-cols-12">
            <Reveal
              kind="up"
              stagger={0.12}
              className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:col-span-8"
            >
              {p.social.map((s, i) => (
                <div key={i} className={i === 1 ? "sm:mt-16" : ""}>
                  <SocialPost project={p} post={s} />
                </div>
              ))}
            </Reveal>
            <Reveal kind="up" delay={0.2} className="md:col-span-4">
              <SearchConcept project={p} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 10. Outcomes */}
      <section className="relative bg-ink py-24 md:py-32">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label label-dot text-copper-300">Outcomes we design for</p>
            <p className="mt-6 text-bone/60">
              Because this is a concept project, there are no results to report. Here’s what we
              would measure from day one — and report on transparently.
            </p>
          </div>
          <Reveal
            kind="up"
            stagger={0.1}
            as="ul"
            className="grid gap-4 md:col-span-8 md:grid-cols-3"
          >
            {p.outcomes.map((o) => (
              <li key={o.title} className="rounded-[24px] bg-bone/5 p-7 ring-1 ring-bone/10">
                <span className="block h-1 w-10 rounded-full" style={{ background: b.accent }} />
                <h3 className="mt-6 font-display text-2xl font-medium tracking-tight">{o.title}</h3>
                <p className="mt-3 text-bone/65">{o.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
        <div className="shell mt-16">
          <Link
            href={`/case-studies/${p.slug}`}
            className="group inline-flex items-center gap-3 font-display text-lg"
          >
            <span className="link-line">Read the thinking behind this project</span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-copper-300 text-ink transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>
      </section>

      {/* 11. Related */}
      <section className="relative bg-ink-950 py-24 md:py-32">
        <div className="shell">
          <p className="label label-dot text-copper-300">More work</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/work/${r.slug}`}
                className="group block"
                data-cursor="View"
              >
                <ScrollZoom className="relative aspect-16/10 rounded-[28px]" from={1.12}>
                  <div className="relative h-full w-full">
                    <Image
                      src={r.hero}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1400 ease-out-expo group-hover:scale-105"
                    />
                  </div>
                </ScrollZoom>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <div>
                    <p className="label text-bone/50">{r.industry}</p>
                    <h3 className="mt-2 font-display text-3xl font-medium tracking-tight group-hover:text-copper-200">
                      {r.name}
                    </h3>
                  </div>
                  <span className="concept-badge">Concept</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12. CTA */}
      <CtaBand
        light
        title={
          <>
            Want something like this for your{" "}
            <span className="serif-accent text-copper-600">{p.industry.toLowerCase()}</span> brand?
          </>
        }
        body="Let’s talk about your goals. We’ll show you how strategy, design, and technology can work together for your business."
        primary={{ label: "Start a Similar Project", href: "/contact" }}
        secondary={{ label: "See all work", href: "/work" }}
      />
    </>
  );
}

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const x = getProject(params.slug);
    if (!x) throw notFound();
    return {
      meta: {
        title: `${x.name} — ${x.kind === "concept" ? "Concept Project" : "Case Study"}`,
        description: x.summary,
        openGraph: { images: [{ url: `${x.hero}?w=1200&q=70&auto=format` }] },
      },
    };
  },
  head: ({ loaderData, params }) =>
    loaderData ? seo(loaderData.meta, `/work/${params.slug}`) : {},
  component: ProjectPage,
});
