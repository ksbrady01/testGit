import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import Image from "@/components/ui/Img";
import Link from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/Blocks";
import { Reveal } from "@/components/motion/Motion";
import { insights } from "@/content/insights";

const metadata = {
  title: "Insights & Resources",
  description: "Practical guides on web design, SEO, digital marketing, and digital ecosystems from the CleverHouse Media team.",
  alternates: { canonical: "/insights" },
};

function InsightsPage() {
  const [lead, ...rest] = insights;
  return (
    <>
      <PageHero
        variant="type"
        light
        eyebrow="Insights & resources"
        title={
          <>
            Field notes for <span className="serif-accent text-copper-600">thinking ahead.</span>
          </>
        }
        intro="Practical, plain-language guides on websites, search, marketing, and connected digital systems — written to help you make better decisions."
      />
      <section className="surface-paper relative pb-28">
        <div className="shell">
          <Reveal kind="up">
            <Link href={`/insights/${lead.slug}`} className="group grid overflow-hidden rounded-[32px] bg-ink text-bone md:grid-cols-2" data-cursor="Read">
              <div className="relative aspect-[16/11] md:aspect-auto md:min-h-[460px]">
                <Image src={lead.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
                <p className="label text-copper-300">
                  {lead.category} · {lead.readingTime}
                </p>
                <div>
                  <h2 className="font-display text-big font-medium">{lead.title}</h2>
                  <p className="mt-5 text-bone/70">{lead.excerpt}</p>
                </div>
                <span className="inline-flex items-center gap-2 font-display">
                  Read the guide <ArrowUpRight size={18} className="text-copper-300 transition-transform group-hover:rotate-45" />
                </span>
              </div>
            </Link>
          </Reveal>
          <Reveal kind="up" stagger={0.1} className="mt-6 grid gap-6 md:grid-cols-2">
            {rest.map((a) => (
              <Link key={a.slug} href={`/insights/${a.slug}`} className="group block overflow-hidden rounded-[28px] bg-bone ring-1 ring-ink/5" data-cursor="Read">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={a.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105" />
                </div>
                <div className="p-8">
                  <p className="label text-copper-700">
                    {a.category} · {a.readingTime}
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink">{a.title}</h2>
                  <p className="mt-3 text-ink/65">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
      <CtaBand title="Want advice specific to your business?" body="Our free evaluations apply this thinking directly to your website and search presence." primary={{ label: "Website Evaluation", href: "/website-evaluation" }} secondary={{ label: "SEO Evaluation", href: "/seo-evaluation" }} />
    </>
  );
}

export const Route = createFileRoute("/insights/")({
  head: () => seo(metadata, "/insights"),
  component: InsightsPage,
});
