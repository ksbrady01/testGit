import { createFileRoute, notFound } from "@tanstack/react-router";
import { seo } from "../../lib/seo";
import Image from "../../components/site/Img";
import Link from "../../components/site/Link";
import { getInsight } from "../../content/insights";
import { CtaBand, JsonLd } from "../../components/sections/Blocks";
import { Reveal, SplitHeading } from "../../components/motion/Motion";
import { site } from "../../content/site";

function InsightPage() {
  const { slug } = Route.useParams();
  const a = getInsight(slug);
  if (!a) return null;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@id": `${site.url}/#organization` },
          url: `${site.url}/insights/${a.slug}`,
        }}
      />
      <article>
        <header className="relative bg-ink pb-16 pt-36 md:pt-44">
          <div className="shell max-w-5xl">
            <Link href="/insights" className="label link-line text-bone/60">
              ← Insights
            </Link>
            <p className="label mt-8 text-copper-300">
              {a.category} · {a.readingTime} · By the CleverHouse team
            </p>
            <SplitHeading
              as="h1"
              onLoad
              delay={0.45}
              className="mt-6 font-display text-huge font-medium"
            >
              {a.title}
            </SplitHeading>
            <p className="mt-8 max-w-[52ch] text-lead text-bone/70">{a.excerpt}</p>
          </div>
        </header>
        <Reveal kind="image" className="relative mx-auto aspect-21/9 max-w-shell overflow-hidden">
          <Image src={a.image} alt="" fill priority sizes="100vw" className="object-cover" />
        </Reveal>
        <div className="surface-paper py-20 md:py-28">
          <div className="shell max-w-3xl space-y-6 text-lg leading-relaxed text-ink/80">
            {a.body.map((b, i) => (
              <div key={i}>
                {b.h && (
                  <h2 className="mb-3 mt-10 font-display text-3xl font-medium tracking-tight text-ink">
                    {b.h}
                  </h2>
                )}
                <p className={i === 0 ? "font-display text-2xl leading-snug text-ink" : ""}>
                  {b.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>
      <CtaBand
        title="Put these ideas to work."
        body="We’ll look at your situation and point out the opportunities that matter most."
        primary={{ label: "Start a Conversation", href: "/contact" }}
        secondary={{ label: "More insights", href: "/insights" }}
      />
    </>
  );
}

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const x = getInsight(params.slug);
    if (!x) throw notFound();
    return { meta: { title: x.title, description: x.excerpt, openGraph: { type: "article" } } };
  },
  head: ({ loaderData, params }) =>
    loaderData ? seo(loaderData.meta, `/insights/${params.slug}`) : {},
  component: InsightPage,
});
