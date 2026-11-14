import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import Image from "../components/site/Img";
import { PageHero } from "../components/sections/PageHero";
import { CtaBand, Faq, JsonLd, SectionHead, faqJsonLd } from "../components/sections/Blocks";
import { Tabs } from "../components/sections/Tabs";
import { SerpClimb } from "../components/seo/SerpClimb";
import { Reveal, ScrubWords } from "../components/motion/Motion";
import { img } from "../content/images";
import { site } from "../content/site";

const metadata = {
  title: "SEO Services — Help the Right People Find You",
  description:
    "Texas SEO services from CleverHouse Media: keyword strategy, local SEO, technical SEO, on-page optimization, search-focused content, audits, and ongoing optimization — explained in plain English.",
  alternates: { canonical: "/seo" },
};

const pillars = [
  {
    label: "Keyword strategy",
    title: "Understand how your customers actually search.",
    body: "Before we change a single page, we learn the words real people use when they’re looking for what you offer — and which of those searches are most likely to turn into customers.",
    points: [
      "Search demand research",
      "Intent mapping (ready to buy vs. researching)",
      "Competitor gap analysis",
      "Priority keyword roadmap",
    ],
    result: "You stop guessing and start targeting the searches that matter.",
  },
  {
    label: "Local SEO",
    title: "Show up when neighbors search nearby.",
    body: "For businesses that serve a city or region, local visibility is everything. We strengthen the signals that help you appear in map results and “near me” searches.",
    points: [
      "Google Business Profile optimization",
      "Consistent business listings",
      "Service-area & location pages",
      "Review strategy guidance",
    ],
    result: "More of the right people in your area discover you first.",
  },
  {
    label: "Technical SEO",
    title: "Make your site easy for search engines to understand.",
    body: "Speed, mobile-friendliness, clean structure, and proper indexing are the foundation. If search engines struggle to read your site, nothing else works as well as it should.",
    points: [
      "Site speed & Core Web Vitals",
      "Mobile usability",
      "Crawlability & indexing",
      "Structured data (schema)",
    ],
    result: "A healthy foundation that every other effort can build on.",
  },
  {
    label: "On-page optimization",
    title: "Every page with a clear job.",
    body: "Titles, headings, descriptions, internal links, and page structure — tuned so each page clearly answers a specific search and guides visitors to the next step.",
    points: [
      "Title tags & meta descriptions",
      "Heading structure",
      "Internal linking",
      "Image optimization",
    ],
    result: "Pages that rank better and convert better.",
  },
  {
    label: "Search-focused content",
    title: "Content that answers real questions.",
    body: "Helpful, well-organized content builds trust with people and search engines alike. We plan and write pages and articles around the questions your customers are already asking.",
    points: [
      "Service page copywriting",
      "FAQ & resource content",
      "Content calendars",
      "Refreshing existing pages",
    ],
    result: "Visibility that compounds over time.",
  },
  {
    label: "SEO audits",
    title: "Know exactly where you stand.",
    body: "A thorough review of your site’s technical health, content, and visibility — translated into a clear, prioritized list of what to fix and why.",
    points: [
      "Technical health review",
      "Content & keyword gaps",
      "Local presence check",
      "Prioritized action plan",
    ],
    result: "Clarity on what to do first — and what can wait.",
  },
  {
    label: "Ongoing optimization",
    title: "SEO is a practice, not a project.",
    body: "Search changes, competitors move, and your business grows. We monitor, report transparently, and keep improving month after month.",
    points: [
      "Monthly reporting in plain language",
      "Rank & traffic monitoring",
      "Continuous improvements",
      "Strategy check-ins",
    ],
    result: "Steady, measurable progress you can see.",
  },
];

const faqs = [
  {
    q: "What is SEO, in plain English?",
    a: "Search engine optimization is the work of making your website easy to find, easy to understand, and genuinely useful — so that when someone searches for what you offer, your business shows up and earns the click.",
  },
  {
    q: "How long does SEO take to work?",
    a: "Technical fixes can have an impact within weeks, but meaningful, lasting visibility usually builds over several months. SEO compounds: the work you do now keeps paying off later. We’ll set honest expectations based on your market and competition.",
  },
  {
    q: "Can you guarantee a #1 ranking?",
    a: "No one can honestly guarantee rankings — search engines control the results. What we can promise is a clear strategy, best-practice execution, and transparent reporting on progress.",
  },
  {
    q: "Do I need local SEO?",
    a: "If you serve customers in a specific city or region — or have a physical location — local SEO is one of the highest-impact investments you can make.",
  },
  {
    q: "Will I understand the reports?",
    a: "Yes. We explain what changed, why it matters, and what we’re doing next, without burying you in jargon.",
  },
];

function SeoPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Search Engine Optimization",
          provider: { "@id": `${site.url}/#organization` },
          areaServed: "Texas, United States",
          url: `${site.url}/seo`,
        }}
      />
      <PageHero
        variant="split"
        eyebrow="SEO & search visibility"
        title={
          <>
            Help the right people <span className="serif-accent text-copper-300">find you</span>{" "}
            online.
          </>
        }
        intro="Comprehensive SEO that improves your visibility in search, brings in high-intent visitors, and turns them into customers — explained clearly, without the jargon."
        image={img.thinkerWoman}
        imageAlt="A woman thinking thoughtfully"
        primary={{ label: "Get a Free SEO Evaluation", href: "/seo-evaluation" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
        aside={<SerpClimb />}
      />

      <section className="surface-paper relative py-24 md:py-36">
        <div className="shell grid gap-12 md:grid-cols-12">
          <p className="label label-dot text-copper-700 md:col-span-3">SEO, explained</p>
          <div className="md:col-span-9">
            <ScrubWords
              className="font-display text-large font-medium text-ink"
              text="When someone searches for what you do, three things decide whether they find you: can search engines read your site, does your site clearly answer what they’re looking for, and do search engines trust you enough to show you first? SEO is the craft of getting all three right."
            />
            <Reveal kind="up" stagger={0.1} className="mt-16 grid gap-4 md:grid-cols-3">
              {[
                [
                  "Be findable",
                  "A fast, well-structured, mobile-friendly site that search engines can crawl and understand.",
                ],
                [
                  "Be relevant",
                  "Pages and content that match the exact words and questions your customers use.",
                ],
                [
                  "Be trusted",
                  "Local signals, reviews, consistent listings, and quality links that build authority.",
                ],
              ].map(([t, b], i) => (
                <div key={t} className="rounded-[24px] bg-bone p-7 ring-1 ring-ink/5">
                  <span className="font-mono text-xs text-copper-700">0{i + 1}</span>
                  <h3 className="mt-6 font-display text-3xl font-medium tracking-tight text-ink">
                    {t}
                  </h3>
                  <p className="mt-3 text-ink/65">{b}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative bg-ink py-24 md:py-36">
        <div className="shell">
          <SectionHead
            label="What’s included"
            title={
              <>
                Seven parts of search,{" "}
                <span className="serif-accent text-copper-300">working together.</span>
              </>
            }
          />
          <div className="mt-16">
            <Tabs items={pillars} />
          </div>
        </div>
      </section>

      <section className="relative h-[70svh] min-h-[460px] overflow-hidden">
        <Image
          src={img.texas}
          alt="A Texas city skyline"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/70 to-ink/10" />
        <div className="shell relative flex h-full items-center">
          <Reveal kind="up" className="max-w-[34ch]">
            <p className="label text-copper-300">Local focus</p>
            <p className="mt-5 font-display text-big font-medium">
              Rooted in Texas. Visible wherever your customers search.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="surface-paper relative py-24 md:py-36">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label label-dot text-copper-700">Questions</p>
            <h2 className="mt-6 font-display text-big font-medium text-ink">
              Straight answers about SEO.
            </h2>
          </div>
          <div className="md:col-span-8">
            <Faq items={faqs} light />
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            How visible is your business{" "}
            <span className="serif-accent text-copper-300">right now?</span>
          </>
        }
        body="Request a free SEO evaluation. We’ll review your keywords, page structure, local visibility, and technical readiness — and show you where the opportunities are."
        primary={{ label: "Request an SEO Evaluation", href: "/seo-evaluation" }}
        secondary={{ label: "Start a project", href: "/contact" }}
      />
    </>
  );
}

export const Route = createFileRoute("/seo")({
  head: () => seo(metadata, "/seo"),
  component: SeoPage,
});
