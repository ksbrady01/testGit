import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import { CampaignOrbit } from "../components/marketing/CampaignOrbit";
import { StackCards } from "../components/marketing/StackCards";
import { CtaBand, JsonLd, NumberedRows, SectionHead } from "../components/sections/Blocks";
import { Reveal, SplitHeading } from "../components/motion/Motion";
import { Button } from "../components/ui/Button";
import { img } from "../content/images";
import { site } from "../content/site";

const metadata = {
  title: "Digital Marketing — Message, Audience, Action",
  description:
    "Data-driven digital marketing from CleverHouse Media: campaign strategy, social media, content, landing pages, email marketing, lead generation, analytics, and continuous optimization.",
  alternates: { canonical: "/digital-marketing" },
};

const capabilities = [
  { title: "Campaign strategy", body: "Clear goals, the right channels, and a plan that ties every dollar and every message to an outcome." },
  { title: "Social media", body: "Organic content and paid social that build community and reach the people most likely to act.", href: "/services/social-media" },
  { title: "Content marketing", body: "Articles, guides, video, and creative that earn attention and answer the questions your buyers ask." },
  { title: "Landing pages", body: "Focused, fast pages designed around one offer and one action — and tested to convert." },
  { title: "Email marketing", body: "Welcome series, newsletters, and nurture flows that keep you top of mind without being noise." },
  { title: "Lead generation", body: "Offers, forms, and follow-up that turn interest into conversations with qualified prospects." },
  { title: "Analytics", body: "Tracking set up properly from day one, with reporting that tells you what’s working in plain language." },
  { title: "Campaign optimization", body: "Ongoing testing of audiences, creative, and pages — so results improve month after month." },
];

function DigitalMarketingPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", serviceType: "Digital Marketing", provider: { "@id": `${site.url}/#organization` }, areaServed: "Texas, United States", url: `${site.url}/digital-marketing` }} />

      <section className="relative overflow-hidden bg-ink pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
        <div className="absolute -left-[20vw] top-[20%] h-[50vw] w-[50vw] rounded-full opacity-60 blur-3xl" style={{ background: "radial-gradient(circle, rgba(184,128,88,0.22), transparent 60%)" }} aria-hidden="true" />
        <div className="shell relative grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal kind="fade">
              <p className="label label-dot text-copper-300">Digital marketing</p>
            </Reveal>
            <SplitHeading as="h1" onLoad delay={0.45} className="mt-6 font-display text-huge font-medium">
              Digital marketing that connects <span className="serif-accent text-copper-300">message, audience,</span> and action.
            </SplitHeading>
            <Reveal kind="up" delay={0.6}>
              <p className="mt-8 max-w-[48ch] text-lead text-bone/75">
                Targeted campaigns across search, social, and email — built on strategy, powered by creative people want to engage with, and measured so you always know what’s working.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="/contact">Plan a Campaign</Button>
                <Button href="/work" variant="ghost" icon={false}>
                  See creative examples
                </Button>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <CampaignOrbit />
          </div>
        </div>
      </section>

      <section className="relative bg-ink pb-24 md:pb-10">
        <div className="shell">
          <SectionHead label="How it works" title={<>Three things every campaign <span className="serif-accent text-copper-300">gets right.</span></>} />
          <div className="mt-16">
            <StackCards
              cards={[
                {
                  kicker: "Message",
                  title: "Say something worth hearing.",
                  body: "We sharpen what makes you different and turn it into clear, compelling creative — headlines, visuals, and offers that stop the scroll.",
                  image: img.stickyNotes,
                  points: ["Positioning", "Creative concepts", "Copywriting", "Offers"],
                },
                {
                  kicker: "Audience",
                  title: "Reach the people who care.",
                  body: "Search intent, social targeting, and email segmentation put your message in front of the people most likely to act — at the right moment.",
                  image: img.community,
                  points: ["Audience research", "Targeting", "Channel mix", "Retargeting"],
                },
                {
                  kicker: "Action",
                  title: "Make the next step effortless.",
                  body: "Focused landing pages, simple forms, and automated follow-up turn attention into leads, bookings, and sales — and analytics show us how to do even better.",
                  image: img.studioDuo,
                  points: ["Landing pages", "Lead capture", "Automation", "Measurement"],
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="surface-paper relative py-24 md:py-36">
        <div className="absolute inset-0 grid-lines-dark opacity-60" aria-hidden="true" />
        <div className="shell relative">
          <SectionHead light label="Capabilities" title={<>Everything a modern campaign <span className="serif-accent text-copper-600">needs.</span></>} />
          <div className="mt-16">
            <NumberedRows items={capabilities} light />
          </div>
        </div>
      </section>

      <CtaBand
        title={<>Ready to reach the right people with the <span className="serif-accent text-copper-300">right message?</span></>}
        body="Let’s map out a campaign built around your goals, your audience, and your budget."
        primary={{ label: "Start a Campaign", href: "/contact" }}
        secondary={{ label: "Explore SEO", href: "/seo" }}
      />
    </>
  );
}

export const Route = createFileRoute("/digital-marketing")({
  head: () => seo(metadata, "/digital-marketing"),
  component: DigitalMarketingPage,
});
