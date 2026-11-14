import Link from "../site/Link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "./PageHero";
import { CtaBand, Faq, JsonLd, NumberedRows, SectionHead, faqJsonLd } from "./Blocks";
import { Tabs, type TabItem } from "./Tabs";
import { Reveal, ScrubWords } from "../motion/Motion";
import { serviceNav, site } from "../../content/site";

type HeroProps = Parameters<typeof PageHero>[0];

export function ServiceDetail({
  path,
  serviceType,
  hero,
  statement,
  capabilitiesTitle,
  capabilities,
  capabilityStyle = "rows",
  signature,
  faqs,
  cta,
}: {
  path: string;
  serviceType: string;
  hero: HeroProps;
  statement: string;
  capabilitiesTitle: React.ReactNode;
  capabilities: TabItem[];
  capabilityStyle?: "rows" | "tabs" | "grid";
  signature?: React.ReactNode;
  faqs?: { q: string; a: string }[];
  cta: { title: React.ReactNode; body: string };
}) {
  const others = serviceNav.filter((s) => s.href !== path).slice(0, 4);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType,
          provider: { "@id": `${site.url}/#organization` },
          areaServed: "Texas, United States",
          url: `${site.url}${path}`,
        }}
      />
      {faqs && <JsonLd data={faqJsonLd(faqs)} />}
      <PageHero {...hero} />

      <section className="surface-paper relative py-24 md:py-36">
        <div className="shell grid gap-12 md:grid-cols-12">
          <p className="label label-dot text-copper-700 md:col-span-3">Why it matters</p>
          <div className="md:col-span-9">
            <ScrubWords className="font-display text-large font-medium text-ink" text={statement} />
          </div>
        </div>
      </section>

      {signature}

      <section className="relative bg-ink py-24 md:py-36">
        <div className="shell">
          <SectionHead label="What’s included" title={capabilitiesTitle} />
          <div className="mt-16">
            {capabilityStyle === "tabs" && <Tabs items={capabilities} />}
            {capabilityStyle === "rows" && (
              <NumberedRows items={capabilities.map((c) => ({ title: c.title, body: c.body }))} />
            )}
            {capabilityStyle === "grid" && (
              <Reveal
                kind="up"
                stagger={0.06}
                as="ul"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {capabilities.map((c, i) => (
                  <li
                    key={c.title}
                    className="flex min-h-[280px] flex-col justify-between rounded-[28px] bg-ink-850 p-8 ring-1 ring-bone/10"
                  >
                    <span className="font-mono text-xs text-copper-400">
                      {String(i + 1).padStart(2, "0")} · {c.label}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                        {c.title}
                      </h3>
                      <p className="mt-3 text-bone/65">{c.body}</p>
                    </div>
                  </li>
                ))}
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {faqs && (
        <section className="surface-paper relative py-24 md:py-32">
          <div className="shell grid gap-12 md:grid-cols-12">
            <h2 className="font-display text-big font-medium text-ink md:col-span-4">
              Questions, answered.
            </h2>
            <div className="md:col-span-8">
              <Faq items={faqs} light />
            </div>
          </div>
        </section>
      )}

      <section className="relative bg-ink-950 py-20">
        <div className="shell">
          <p className="label text-bone/50">Works well with</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.href}>
                <Link
                  href={o.href}
                  className="group flex h-full items-center justify-between gap-4 rounded-2xl bg-bone/5 px-5 py-5 ring-1 ring-bone/10 transition-colors hover:bg-bone/10"
                >
                  <span>
                    <span className="block font-display text-lg tracking-tight">{o.label}</span>
                    <span className="text-sm text-bone/50">{o.description}</span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-copper-300 transition-transform duration-500 group-hover:rotate-45"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        light
        title={cta.title}
        body={cta.body}
        primary={{ label: "Start Your Project", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
      />
    </>
  );
}
