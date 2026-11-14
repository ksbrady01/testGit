import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import { PageHero } from "../components/sections/PageHero";
import { CtaBand, NumberedRows } from "../components/sections/Blocks";
import { Reveal } from "../components/motion/Motion";
import { img } from "../content/images";
import { site } from "../content/site";

const metadata = {
  title: "Support",
  description: "Ongoing maintenance, troubleshooting, and strategic guidance from CleverHouse Media. Launching is just the beginning.",
  alternates: { canonical: "/support" },
};

function SupportPage() {
  return (
    <>
      <PageHero
        variant="split"
        eyebrow="Dedicated support"
        title={
          <>
            Always in <span className="serif-accent text-copper-300">your corner.</span>
          </>
        }
        intro="Launching your project is just the beginning. We provide ongoing support so your digital assets keep performing, adapt to new challenges, and grow with your business."
        image={img.studioDuo}
        imageAlt="Two team members helping each other at a desk"
        primary={{ label: "Contact Support", href: "/contact" }}
      />
      <section className="relative bg-ink pb-24 md:pb-36">
        <div className="shell">
          <NumberedRows
            items={[
              { title: "Regular maintenance & updates", body: "Platform, plugin, and security updates applied carefully and tested." },
              { title: "Priority email support", body: "A direct line to people who know your site and your business." },
              { title: "Scheduled strategy calls", body: "Regular check-ins to review performance and plan what’s next." },
              { title: "Emergency troubleshooting", body: "When something breaks, we prioritize getting you back online." },
            ]}
          />
          <Reveal kind="up" className="mt-16 rounded-[28px] bg-copper-300 p-8 text-ink md:p-12">
            <p className="label">Need assistance right now?</p>
            <p className="mt-4 font-display text-big font-medium">
              Email <a href={`mailto:${site.email}`} className="underline decoration-1 underline-offset-8">{site.email}</a>
            </p>
            <p className="mt-4 max-w-[52ch] text-ink/70">Include your website address and a short description of what you’re seeing. Screenshots help us move faster.</p>
          </Reveal>
        </div>
      </section>
      <CtaBand light title="Looking for a long-term partner?" body="Ask us about care plans that combine support, hosting, and ongoing optimization." primary={{ label: "Talk to Us", href: "/contact" }} secondary={{ label: "Hosting & security", href: "/hosting-security" }} />
    </>
  );
}

export const Route = createFileRoute("/support")({
  head: () => seo(metadata, "/support"),
  component: SupportPage,
});
