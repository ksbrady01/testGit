import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import { ShieldCheck, Server, Zap, RefreshCcw, Lock, Activity } from "lucide-react";
import { PageHero } from "../components/sections/PageHero";
import { CtaBand, Faq, SectionHead } from "../components/sections/Blocks";
import { Reveal } from "../components/motion/Motion";
import { img } from "../content/images";

const metadata = {
  title: "Hosting & Security",
  description:
    "Fast, reliable, secure website hosting and care from CleverHouse Media — performance, monitoring, backups, updates, and proactive security.",
  alternates: { canonical: "/hosting-security" },
};

const features = [
  {
    icon: Server,
    title: "Reliable infrastructure",
    body: "High-performance hosting environments chosen for speed and stability.",
  },
  {
    icon: ShieldCheck,
    title: "Proactive security",
    body: "Threat protection, malware scanning, and hardened configurations.",
  },
  {
    icon: Zap,
    title: "Lightning-fast delivery",
    body: "Global CDN and smart caching for quick page loads everywhere.",
  },
  {
    icon: RefreshCcw,
    title: "Automated backups",
    body: "Regular backups with tested restore procedures — just in case.",
  },
  {
    icon: Lock,
    title: "SSL & updates",
    body: "Certificates, platform updates, and plugin maintenance handled for you.",
  },
  {
    icon: Activity,
    title: "Uptime monitoring",
    body: "Around-the-clock monitoring with alerts and fast response.",
  },
];

function HostingPage() {
  return (
    <>
      <PageHero
        variant="cinema"
        eyebrow="Hosting & security"
        title={
          <>
            Fast. Reliable. <span className="serif-accent text-copper-300">Secure.</span>
          </>
        }
        intro="Hosting and care plans designed to keep your digital assets safe, fast, and available — so you can focus on running your business."
        image={img.officeGlass}
        primary={{ label: "Discuss Hosting Options", href: "/contact" }}
      />
      <section className="relative bg-ink py-24 md:py-36">
        <div className="shell">
          <SectionHead
            label="What’s covered"
            title={
              <>
                Peace of mind, <span className="serif-accent text-copper-300">built in.</span>
              </>
            }
            intro="Slow load times and security vulnerabilities quietly cost you customers. Our care plans handle the technical side so your site stays healthy."
          />
          <Reveal
            kind="up"
            stagger={0.06}
            as="ul"
            className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-bone/10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <li key={f.title} className="bg-ink p-8 md:p-10">
                <f.icon className="text-copper-300" size={28} aria-hidden="true" />
                <h3 className="mt-10 font-display text-2xl font-medium tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-3 text-bone/65">{f.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="surface-paper relative py-24 md:py-32">
        <div className="shell grid gap-12 md:grid-cols-12">
          <h2 className="font-display text-big font-medium text-ink md:col-span-4">
            Hosting questions.
          </h2>
          <div className="md:col-span-8">
            <Faq
              light
              items={[
                {
                  q: "Can you host a website you didn’t build?",
                  a: "Often, yes. We’ll review the site first to make sure it’s healthy and secure before taking it on.",
                },
                {
                  q: "What happens if something goes wrong?",
                  a: "Monitoring alerts us quickly, and backups mean we can restore your site if needed. We’ll keep you informed throughout.",
                },
                {
                  q: "Do care plans include content updates?",
                  a: "Plans can include a set amount of update time each month. We’ll tailor a plan to how often your content changes.",
                },
              ]}
            />
          </div>
        </div>
      </section>
      <CtaBand
        title="Secure your digital future."
        body="Don’t let slow load times or security gaps hold your business back."
        primary={{ label: "Discuss Hosting Options", href: "/contact" }}
        secondary={{ label: "Support", href: "/support" }}
      />
    </>
  );
}

export const Route = createFileRoute("/hosting-security")({
  head: () => seo(metadata, "/hosting-security"),
  component: HostingPage,
});
