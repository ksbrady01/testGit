import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import Image from "../components/site/Img";
import { PageHero } from "../components/sections/PageHero";
import { CtaBand, ImageBand, SectionHead } from "../components/sections/Blocks";
import { Reveal, ScrubWords, SplitHeading } from "../components/motion/Motion";
import { LogoMark } from "../components/brand/Logo";
import { img } from "../content/images";

const metadata = {
  title: "About CleverHouse Media",
  description:
    "CleverHouse Media is a Texas-based web marketing agency combining creative design, intelligent technology, and strategic marketing. We build digital stories that make a difference.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Data-driven decisions",
    body: "Creative instinct, checked against real numbers. We let evidence guide the next move.",
  },
  {
    title: "Transparent reporting",
    body: "You’ll always know what we did, why we did it, and what happened as a result.",
  },
  {
    title: "Continuous optimization",
    body: "Launch is the beginning. We keep testing, learning, and improving.",
  },
  {
    title: "Dedicated partnership",
    body: "We learn your business deeply and show up like part of your team.",
  },
];

const disciplines = [
  {
    role: "Strategists",
    body: "Find the insight, define the goal, and make the plan.",
    image: img.thinkerGlasses,
  },
  {
    role: "Designers",
    body: "Turn ideas into experiences people understand instantly.",
    image: img.studioDesk,
  },
  {
    role: "Developers",
    body: "Engineer fast, accessible, scalable digital products.",
    image: img.studioPod,
  },
  {
    role: "Marketers",
    body: "Put the right message in front of the right people.",
    image: img.studioDuo,
  },
];

function AboutPage() {
  return (
    <>
      <PageHero
        variant="split"
        light
        eyebrow="About CleverHouse Media"
        title={
          <>
            We build digital stories that make a{" "}
            <span className="serif-accent text-copper-600">difference.</span>
          </>
        }
        intro="We’re a modern web marketing agency based in Texas, dedicated to helping businesses elevate their brand and grow online — through strategic design, comprehensive SEO, and data-driven marketing."
        image={img.studioTeam}
        imageAlt="The CleverHouse team collaborating in the studio"
        primary={{ label: "Work With Us", href: "/contact" }}
        secondary={{ label: "Our process", href: "/process" }}
      />

      <section className="relative overflow-hidden bg-ink py-24 md:py-36">
        <div
          className="pointer-events-none absolute -left-24 top-1/2 w-[40vw] max-w-[480px] -translate-y-1/2 opacity-[0.06]"
          aria-hidden="true"
        >
          <LogoMark />
        </div>
        <div className="shell relative grid gap-12 md:grid-cols-12">
          <p className="label label-dot text-copper-300 md:col-span-3">Our story</p>
          <div className="md:col-span-8">
            <ScrubWords
              className="font-display text-large font-medium"
              text="CleverHouse Media was founded with a vision to transform digital landscapes. We combine creative design with technical excellence, and we believe the best results come from long-lasting partnerships — understanding each client’s unique needs and crafting strategies that drive real business outcomes."
            />
            <Reveal kind="up" className="mt-12 grid gap-8 text-bone/70 md:grid-cols-2">
              <p>
                We don’t just build websites. We create digital ecosystems designed to grow your
                business — where aesthetic craft meets strategic function, and where every piece
                connects to the next.
              </p>
              <p>
                By understanding your goals first, we tailor our strategies to connect with your
                audience, drive engagement, and deliver measurable progress you can see.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="surface-paper relative py-24 md:py-36">
        <div className="absolute inset-0 grid-lines-dark opacity-60" aria-hidden="true" />
        <div className="shell relative">
          <SectionHead
            light
            label="Our philosophy"
            title={
              <>
                We believe in <span className="serif-accent text-copper-600">purposeful</span>{" "}
                design.
              </>
            }
          />
          <Reveal kind="up" stagger={0.08} as="ul" className="mt-16 grid gap-4 md:grid-cols-4">
            {values.map((v, i) => (
              <li
                key={v.title}
                className="flex min-h-[300px] flex-col justify-between rounded-[28px] bg-bone p-8 ring-1 ring-ink/5"
              >
                <span className="font-display text-6xl font-medium tracking-tight text-copper-500/40">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-medium tracking-tight text-ink">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-ink/65">{v.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="relative bg-ink py-24 md:py-36">
        <div className="shell">
          <div className="grid gap-8 md:grid-cols-12">
            <p className="label label-dot text-copper-300 md:col-span-3">
              The people behind the work
            </p>
            <SplitHeading className="font-display text-huge font-medium md:col-span-9">
              Thinkers, makers, and{" "}
              <span className="serif-accent text-copper-300">growth-minded</span> partners.
            </SplitHeading>
          </div>
          <Reveal
            kind="up"
            stagger={0.1}
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {disciplines.map((d, i) => (
              <figure
                key={d.role}
                className={`group relative aspect-3/4 overflow-hidden rounded-[28px] ${i % 2 ? "lg:mt-16" : ""}`}
              >
                <Image
                  src={d.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-1400 ease-out-expo group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/30 to-transparent" />
                <figcaption className="absolute bottom-0 p-6">
                  <p className="font-display text-3xl font-medium tracking-tight">{d.role}</p>
                  <p className="mt-2 text-bone/70">{d.body}</p>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      <ImageBand
        image={img.texas2}
        alt="A Texas skyline at dusk"
        statement="Proudly based in Texas. Building for brands everywhere."
        caption="CleverHouse Media, LLC"
      />

      <CtaBand
        light
        title={
          <>
            Let’s write your next <span className="serif-accent text-copper-600">chapter</span>{" "}
            together.
          </>
        }
        body="Whether you’re launching, growing, or reinventing — we’d love to hear what you’re working toward."
        primary={{ label: "Start a Conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
      />
    </>
  );
}

export const Route = createFileRoute("/about")({
  head: () => seo(metadata, "/about"),
  component: AboutPage,
});
