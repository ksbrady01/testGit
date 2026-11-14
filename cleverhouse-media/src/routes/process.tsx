import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import Image from "../components/site/Img";
import { PageHero } from "../components/sections/PageHero";
import { CtaBand } from "../components/sections/Blocks";
import { Reveal } from "../components/motion/Motion";
import { img } from "../content/images";

const metadata = {
  title: "Our Process — The CHM Way",
  description:
    "Capture, Build, Validate, Launch: CleverHouse Media’s transparent process for delivering exceptional digital work on time and on budget.",
  alternates: { canonical: "/process" },
};

const steps = [
  {
    n: "01",
    name: "Capture",
    lead: "We immerse ourselves in your world.",
    body: "We immerse ourselves in your brand’s ecosystem — identifying key objectives, audience behaviors, and market opportunities — to forge a strategic roadmap.",
    items: [
      "Discovery workshop",
      "Audience & competitor research",
      "Goals & success metrics",
      "Strategic roadmap",
    ],
    image: img.stickyWall,
  },
  {
    n: "02",
    name: "Build",
    lead: "Ideas become experiences.",
    body: "Our team designs captivating experiences and engineers robust, scalable solutions that bring your vision to life across every digital touchpoint.",
    items: [
      "Wireframes & prototypes",
      "Visual design",
      "Content & copy",
      "Development & integrations",
    ],
    image: img.studioDesk,
  },
  {
    n: "03",
    name: "Validate",
    lead: "Nothing ships untested.",
    body: "Through comprehensive testing and data-driven review, we make sure every element performs flawlessly and meets a high standard of quality.",
    items: ["Cross-device QA", "Accessibility checks", "Performance testing", "Stakeholder review"],
    image: img.studioPod,
  },
  {
    n: "04",
    name: "Launch",
    lead: "Then we keep going.",
    body: "We orchestrate a seamless launch and provide ongoing optimization to accelerate growth, maximize impact, and drive measurable progress.",
    items: [
      "Launch plan & go-live",
      "Tracking verification",
      "Training & handoff",
      "Ongoing optimization",
    ],
    image: img.texas,
  },
];

function ProcessPage() {
  return (
    <>
      <PageHero
        variant="type"
        eyebrow="The CHM way"
        title={
          <>
            A proven, transparent process —{" "}
            <span className="serif-accent text-copper-300">no surprises.</span>
          </>
        }
        intro="Great digital work isn’t magic. It’s a clear method, honest communication, and a team that cares about the details. Here’s how we deliver exceptional results on time and on budget."
      />
      <section className="relative bg-ink pb-24 md:pb-36">
        <div className="shell">
          {steps.map((s) => (
            <article
              key={s.n}
              className="grid gap-10 border-t border-bone/12 py-16 md:grid-cols-12 md:gap-6 md:py-24"
            >
              <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
                <p className="font-display text-[clamp(5rem,14vw,13rem)] font-medium leading-[0.8] tracking-[-0.06em] text-copper-500/25">
                  {s.n}
                </p>
                <h2 className="-mt-4 font-display text-giant font-medium md:-mt-10">{s.name}</h2>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <Reveal
                  kind="image"
                  className="relative aspect-16/10 overflow-hidden rounded-[28px]"
                >
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </Reveal>
                <Reveal kind="up">
                  <p className="mt-10 font-display text-large font-medium">{s.lead}</p>
                  <p className="mt-4 text-lg text-bone/70">{s.body}</p>
                  <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-center gap-3 rounded-xl bg-bone/5 px-4 py-3 text-bone/85 ring-1 ring-bone/8"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-copper-400" /> {it}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand
        light
        title="Ready to start the journey?"
        body="Every great project begins with a conversation. Let’s have ours."
        primary={{ label: "Let’s Talk", href: "/contact" }}
      />
    </>
  );
}

export const Route = createFileRoute("/process")({
  head: () => seo(metadata, "/process"),
  component: ProcessPage,
});
