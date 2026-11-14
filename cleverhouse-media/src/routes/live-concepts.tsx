import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import Image from "../components/site/Img";
import { BroadcastFrame } from "../components/live/BroadcastFrame";
import { InquiryForm } from "../components/forms/InquiryForm";
import { CtaBand, ImageBand, SectionHead } from "../components/sections/Blocks";
import { Marquee, Reveal, SplitHeading } from "../components/motion/Motion";
import { Button } from "../components/site/Button";
import { img } from "../content/images";

const metadata = {
  title: "Live Concepts — Livestreams, Virtual Events & Interactive Campaigns",
  description:
    "Livestream strategy, virtual events, interactive campaigns, online workshops, product launches, webinars, and immersive digital engagement from CleverHouse Media.",
  alternates: { canonical: "/live-concepts" },
};

const offerings = [
  {
    title: "Livestream strategy",
    body: "Formats, platforms, run-of-show, and promotion that turn a stream into an event people show up for.",
  },
  {
    title: "Virtual events",
    body: "Branded event experiences with registration, reminders, and engagement built in.",
  },
  {
    title: "Interactive campaigns",
    body: "Polls, challenges, and participatory moments that invite your audience to play along.",
  },
  {
    title: "Online workshops",
    body: "Teaching-first sessions that build trust and generate qualified leads.",
  },
  {
    title: "Product launches",
    body: "Countdown pages, reveal moments, and follow-up that keep momentum after the stream ends.",
  },
  {
    title: "Webinars",
    body: "Polished presentations, smooth hosting, and on-demand replays that keep working for you.",
  },
  {
    title: "Immersive engagement",
    body: "Experiences that blend in-room and online audiences into one shared moment.",
  },
];

const prototypes = [
  {
    tag: "Retail",
    title: "E-commerce experience",
    body: "An interactive prototype exploring modern shopping flows, product storytelling, and a frictionless checkout.",
    image: img.retail2,
  },
  {
    tag: "Technology",
    title: "SaaS dashboard",
    body: "A working concept for clear data, calm interfaces, and onboarding that gets people to value fast.",
    image: img.studioPod,
  },
  {
    tag: "Creative",
    title: "Interactive portfolio",
    body: "A motion-rich portfolio concept where the work leads and every interaction feels intentional.",
    image: img.studioTeam,
  },
];

function LiveConceptsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="absolute inset-0 grid-lines opacity-50" aria-hidden="true" />
        <div className="shell relative grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal kind="fade">
              <p className="label flex items-center gap-2 text-copper-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff5a4f]" /> Live concepts
              </p>
            </Reveal>
            <SplitHeading
              as="h1"
              onLoad
              delay={0.45}
              className="mt-6 font-display text-huge font-medium"
            >
              Creative digital experiences that bring your audience{" "}
              <span className="serif-accent text-copper-300">into the moment.</span>
            </SplitHeading>
            <Reveal kind="up" delay={0.6}>
              <p className="mt-8 max-w-[48ch] text-lead text-bone/75">
                Livestreams, virtual events, launches, and interactive campaigns — planned with
                strategy, produced with care, and designed to keep people engaged long after the
                moment ends.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="#plan">Plan a Live Experience</Button>
                <Button href="#prototypes" variant="ghost" icon={false}>
                  See interactive prototypes
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal kind="scale" delay={0.3} className="lg:col-span-6">
            <BroadcastFrame image={img.concert} />
          </Reveal>
        </div>
      </section>

      <div className="border-y border-bone/10 bg-ink-950 py-5">
        <Marquee speed={40} reverse>
          {offerings.map((o) => (
            <span
              key={o.title}
              className="flex items-center gap-8 pr-8 font-display text-2xl tracking-tight text-bone/50 md:text-4xl"
            >
              {o.title}
              <span className="h-2 w-2 rounded-full bg-[#ff5a4f]" />
            </span>
          ))}
        </Marquee>
      </div>

      <section className="relative bg-ink py-24 md:py-36">
        <div className="shell">
          <SectionHead
            label="What we create"
            title={
              <>
                Moments people <span className="serif-accent text-copper-300">show up</span> for.
              </>
            }
          />
          <Reveal
            kind="up"
            stagger={0.06}
            as="ul"
            className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-bone/10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {offerings.map((o, i) => (
              <li
                key={o.title}
                className={`group flex min-h-[260px] flex-col justify-between bg-ink p-7 transition-colors duration-500 hover:bg-ink-850 ${i === 0 ? "lg:col-span-2 lg:row-span-2 lg:min-h-[540px]" : ""}`}
              >
                <span className="font-mono text-xs text-copper-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i === 0 && (
                  <div className="relative my-6 flex-1 overflow-hidden rounded-2xl">
                    <Image
                      src={img.studioSet}
                      alt="A production studio set prepared for a livestream"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1400 ease-out-expo group-hover:scale-105"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                    {o.title}
                  </h3>
                  <p className="mt-3 text-bone/65">{o.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <ImageBand
        image={img.stageCrowd}
        alt="A crowd lit by stage lights during a live event"
        statement="The best digital experiences don’t feel like watching. They feel like being there."
        caption="Strategy · Production · Promotion · Follow-up"
      />

      <section id="prototypes" className="surface-paper relative scroll-mt-24 py-24 md:py-36">
        <div className="absolute inset-0 grid-lines-dark opacity-60" aria-hidden="true" />
        <div className="shell relative">
          <SectionHead
            light
            label="Interactive prototypes"
            title={
              <>
                See ideas come to life <span className="serif-accent text-copper-600">before</span>{" "}
                a single line of code.
              </>
            }
            intro="We build interactive design prototypes so you can click through, react, and refine an experience early — saving time and making better decisions."
          />
          <Reveal kind="up" stagger={0.1} className="mt-16 grid gap-6 md:grid-cols-3">
            {prototypes.map((p, i) => (
              <article
                key={p.title}
                className={`group overflow-hidden rounded-[28px] bg-bone ring-1 ring-ink/5 ${i === 1 ? "md:mt-16" : ""}`}
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1400 ease-out-expo group-hover:scale-105"
                  />
                  <span className="concept-badge absolute left-4 top-4">{p.tag} · Prototype</span>
                </div>
                <div className="p-7">
                  <h3 className="font-display text-2xl font-medium tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-ink/65">{p.body}</p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="plan" className="relative scroll-mt-24 bg-ink py-24 md:py-36">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label label-dot text-copper-300">Plan a live experience</p>
            <h2 className="mt-6 font-display text-big font-medium">
              Want a concept for your brand?
            </h2>
            <p className="mt-6 text-bone/65">
              Tell us about the moment you want to create — a launch, a workshop series, a virtual
              event — and we’ll come back with ideas.
            </p>
          </div>
          <div className="rounded-[32px] bg-ink-850/80 p-6 ring-1 ring-bone/10 md:p-12 lg:col-span-7 lg:col-start-6">
            <InquiryForm
              type="live-concepts"
              fields={["company", "website", "timeline", "message"]}
              messageLabel="What would you like to create?"
              messagePlaceholder="The occasion, your audience, and what success looks like…"
              submitLabel="Request a concept"
            />
          </div>
        </div>
      </section>

      <CtaBand
        light
        title="Prefer to talk it through?"
        body="We’re happy to brainstorm formats and possibilities with you."
        primary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}

export const Route = createFileRoute("/live-concepts")({
  head: () => seo(metadata, "/live-concepts"),
  component: LiveConceptsPage,
});
