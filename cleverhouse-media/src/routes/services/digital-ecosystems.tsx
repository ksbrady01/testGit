import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { Ecosystem } from "@/components/home/Ecosystem";
import { img } from "@/content/images";

const metadata = {
  title: "Digital Ecosystems — Connected Platforms",
  description:
    "CleverHouse Media designs and integrates digital ecosystems where your website, CRM, marketing tools, automation, and analytics work together as one system.",
  alternates: { canonical: "/services/digital-ecosystems" },
};

function DigitalEcosystemsPage() {
  return (
    <ServiceDetail
      path="/services/digital-ecosystems"
      serviceType="Digital Ecosystem Integration"
      hero={{
        variant: "split",
        eyebrow: "Digital ecosystems",
        title: (
          <>
            Stop working in silos. <span className="serif-accent text-verdigris-300">Start working as one.</span>
          </>
        ),
        intro: "We design and integrate digital environments where your website, CRM, marketing tools, and analytics work in harmony — creating a frictionless experience for your team and your customers.",
        image: img.studioTeam,
        imageAlt: "A team collaborating in the studio",
        primary: { label: "Connect Your Platforms", href: "/contact" },
        secondary: { label: "AI & automation", href: "/services/ai-automation" },
      }}
      statement="When your tools don’t talk to each other, your team becomes the integration — copying data, chasing updates, and guessing at what’s working. A connected ecosystem gives you one source of truth and a customer experience that just flows."
      signature={<Ecosystem />}
      capabilitiesTitle={
        <>
          Built for today. <span className="serif-accent text-copper-300">Ready for what’s next.</span>
        </>
      }
      capabilityStyle="grid"
      capabilities={[
        { label: "Integration", title: "Seamless integration", body: "Connect your website, CRM, email, scheduling, payments, and social tools so data flows automatically.", points: [] },
        { label: "Architecture", title: "Scalable architecture", body: "A foundation designed to grow with you — add tools and channels without starting over.", points: [] },
        { label: "Performance", title: "Optimized performance", body: "Fast, reliable experiences for customers and dependable systems for your team.", points: [] },
        { label: "Data", title: "Centralized data", body: "A single source of truth for leads, customers, and campaign performance.", points: [] },
        { label: "Commerce", title: "Conversion hub", body: "Seamless shopping, booking, and payment experiences connected to the rest of your stack.", points: [] },
        { label: "Insight", title: "Analytics foundation", body: "Measurable insight and ROI tracking across every channel, in one place.", points: [] },
      ]}
      faqs={[
        { q: "What is a digital ecosystem?", a: "It’s the set of tools your business runs on — website, CRM, email, social, scheduling, analytics — designed and connected so they work together instead of in isolation." },
        { q: "Do we have to replace our current tools?", a: "Usually not. We start by mapping what you have, keep what works, and connect or replace only what’s holding you back." },
        { q: "How long does an ecosystem project take?", a: "It depends on the number of platforms and integrations. Many businesses start with a focused phase — like website-to-CRM — and expand from there." },
      ]}
      cta={{ title: <>Let’s connect the dots in <span className="serif-accent text-copper-600">your business.</span></>, body: "We’ll map your current tools and show you where a connected ecosystem would save time and grow revenue." }}
    />
  );
}

export const Route = createFileRoute("/services/digital-ecosystems")({
  head: () => seo(metadata, "/services/digital-ecosystems"),
  component: DigitalEcosystemsPage,
});
