import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import Image from "../components/ui/Img";
import Link from "../components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/sections/PageHero";
import { CtaBand, ProcessStrip, SectionHead, JsonLd } from "../components/sections/Blocks";
import { Marquee, Reveal, ScrollZoom } from "../components/motion/Motion";
import { services } from "../content/services";
import { img } from "../content/images";
import { site } from "../content/site";
import clsx from "../lib/clsx";

const metadata = {
  title: "What We Do",
  description:
    "Web design and development, SEO, digital marketing, branding, social media, digital ecosystems, AI and automation, live concepts, and website and SEO evaluations — from one Texas-based team.",
  alternates: { canonical: "/what-we-do" },
};

const more = [
  { title: "Live Concepts", body: "Livestreams, virtual events, launches, and interactive campaigns that bring your audience into the moment.", href: "/live-concepts", image: img.concertLights },
  { title: "Website Evaluations", body: "A clear, prioritized look at how your website looks, performs, and converts — and what to fix first.", href: "/website-evaluation", image: img.studioDesk },
  { title: "SEO Evaluations", body: "Find out how visible your business is in search and where the biggest opportunities are hiding.", href: "/seo-evaluation", image: img.thinkerWoman },
  { title: "AI & Automation", body: "Smart assistants, automated follow-ups, and workflows that give your team hours back every week.", href: "/services/ai-automation", image: img.studioPod },
];

function WhatWeDoPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "CleverHouse Media services",
          itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: `${site.url}${s.href}` })),
        }}
      />
      <PageHero
        variant="type"
        eyebrow="What we do"
        title={
          <>
            We build digital experiences that help brands <span className="serif-accent text-copper-300">grow.</span>
          </>
        }
        intro="Strategy, design, technology, and marketing — under one roof and pointed at the same goal. Whether you need a new website, better search visibility, a sharper brand, or everything connected, we build the pieces to work together."
        primary={{ label: "Start a Project", href: "/contact" }}
        secondary={{ label: "Free website evaluation", href: "/website-evaluation" }}
      />

      <div className="border-y border-bone/10 bg-ink py-5">
        <Marquee speed={45}>
          {services.map((s) => (
            <span key={s.id} className="flex items-center gap-8 pr-8 font-display text-3xl tracking-tight text-bone/40 md:text-5xl">
              {s.title}
              <span className="text-copper-500">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Service chapters */}
      <section className="relative bg-ink py-24 md:py-32" aria-label="Services">
        <div className="shell space-y-28 md:space-y-40">
          {services.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={s.id} className="grid items-center gap-10 md:grid-cols-12 md:gap-6">
                <div className={clsx("relative md:col-span-6", flip ? "md:order-2 md:col-start-7" : "")}>
                  <Link href={s.href} className="group block" data-cursor="Explore" tabIndex={-1} aria-hidden="true">
                    <ScrollZoom className="relative aspect-5/6 rounded-[32px] md:aspect-4/5">
                      <div className="relative h-full w-full">
                        <Image src={s.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-1400 ease-out-expo group-hover:scale-105" />
                      </div>
                    </ScrollZoom>
                    <span className="absolute left-5 top-5 font-display text-[clamp(4rem,9vw,9rem)] font-medium leading-none tracking-[-0.05em] text-bone/90 mix-blend-difference">{s.index}</span>
                  </Link>
                </div>
                <div className={clsx("md:col-span-5", flip ? "md:order-1 md:col-start-1" : "md:col-start-8")}>
                  <Reveal kind="up">
                    <p className="label text-copper-300">{s.short}</p>
                    <h2 className="mt-4 font-display text-big font-medium">{s.title}</h2>
                    <p className="mt-6 text-lg text-bone/70">{s.summary}</p>
                    <ul className="mt-8 divide-y divide-bone/10 border-y border-bone/10">
                      {s.points.map((pt) => (
                        <li key={pt} className="flex items-center justify-between py-3.5 text-bone/85">
                          {pt}
                          <span className="h-1.5 w-1.5 rounded-full bg-copper-500" />
                        </li>
                      ))}
                    </ul>
                    <Link href={s.href} className="group mt-8 inline-flex items-center gap-3 font-display text-lg">
                      <span className="link-line">Explore {s.short.toLowerCase()}</span>
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-copper-300 text-ink transition-transform duration-500 group-hover:rotate-45">
                        <ArrowUpRight size={18} />
                      </span>
                    </Link>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* More ways we help */}
      <section className="surface-paper relative py-24 md:py-36">
        <div className="absolute inset-0 grid-lines-dark opacity-60" aria-hidden="true" />
        <div className="shell relative">
          <SectionHead light label="More ways we help" title={<>Live moments, smart systems, and an <span className="serif-accent text-copper-600">honest</span> second opinion.</>} />
          <Reveal kind="up" stagger={0.08} className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {more.map((m) => (
              <Link key={m.href} href={m.href} className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[28px] bg-ink p-7 text-bone">
                <Image src={m.image} alt="" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-60 transition-all duration-1200 ease-out-expo group-hover:scale-105 group-hover:opacity-40" />
                <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" />
                <div className="relative">
                  <h3 className="font-display text-3xl font-medium tracking-tight">{m.title}</h3>
                  <p className="mt-3 text-bone/75">{m.body}</p>
                  <span className="mt-6 inline-grid h-10 w-10 place-items-center rounded-full bg-copper-300 text-ink transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="relative bg-ink py-24 md:py-36">
        <div className="shell">
          <SectionHead label="The CHM way" title={<>A proven, transparent process — <span className="serif-accent text-copper-300">on time and on budget.</span></>} />
          <div className="mt-16">
            <ProcessStrip
              steps={[
                { step: "Capture", body: "We immerse ourselves in your brand, objectives, audience behavior, and market opportunities to build a strategic roadmap." },
                { step: "Build", body: "We design captivating experiences and engineer robust, scalable solutions across every digital touchpoint." },
                { step: "Validate", body: "Testing and data-driven review make sure every element performs and meets a high standard of quality." },
                { step: "Launch", body: "A seamless launch, followed by ongoing optimization to accelerate growth and measurable impact." },
              ]}
            />
          </div>
          <Link href="/process" className="group mt-10 inline-flex items-center gap-3 font-display text-lg">
            <span className="link-line">See our full process</span>
            <ArrowUpRight size={18} className="text-copper-300" />
          </Link>
        </div>
      </section>

      <CtaBand
        light
        title={<>Not sure what you need? <span className="serif-accent text-copper-600">Let’s figure it out together.</span></>}
        body="Book a discovery conversation. We’ll look at your current digital presence and point out the best opportunities for growth."
        primary={{ label: "Book a Discovery Call", href: "/contact" }}
        secondary={{ label: "Get a website evaluation", href: "/website-evaluation" }}
      />
    </>
  );
}

export const Route = createFileRoute("/what-we-do")({
  head: () => seo(metadata, "/what-we-do"),
  component: WhatWeDoPage,
});
