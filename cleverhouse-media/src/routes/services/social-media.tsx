import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../../lib/seo";
import { ServiceDetail } from "../../components/sections/ServiceDetail";
import { CreativeWall } from "../../components/work/CreativeWall";
import { img } from "../../content/images";

const metadata = {
  title: "Social Media Marketing & Strategy",
  description:
    "Social media strategy, content calendars, creative production, community management, and social campaigns from CleverHouse Media.",
  alternates: { canonical: "/services/social-media" },
};

function SocialMediaPage() {
  return (
    <ServiceDetail
      path="/services/social-media"
      serviceType="Social Media Marketing"
      hero={{
        variant: "stack",
        eyebrow: "Social media strategy",
        title: (
          <>
            A social presence with a{" "}
            <span className="serif-accent text-copper-300">point of view.</span>
          </>
        ),
        intro:
          "Strategy, creative, and community management that build real relationships with your audience — and turn followers into customers, members, and advocates.",
        images: [img.community, img.restaurantBooth, img.concertLights],
        primary: { label: "Grow Your Social Presence", href: "/contact" },
        secondary: { label: "See social creative", href: "/work" },
      }}
      statement="Posting more isn’t a strategy. The brands that win on social know who they’re talking to, show up consistently with something worth saying, and treat every comment as the start of a relationship."
      signature={<CreativeWall />}
      capabilitiesTitle={
        <>
          Everything it takes to show up{" "}
          <span className="serif-accent text-copper-300">consistently.</span>
        </>
      }
      capabilityStyle="rows"
      capabilities={[
        {
          label: "Strategy",
          title: "Channel strategy",
          body: "Which platforms matter for your audience, what to post, and how social fits your bigger marketing picture.",
          points: [],
        },
        {
          label: "Planning",
          title: "Content calendars",
          body: "Monthly plans built around your goals, seasons, events, and launches — approved before anything goes live.",
          points: [],
        },
        {
          label: "Creative",
          title: "Creative production",
          body: "On-brand graphics, short-form video, captions, and templates that make your feed instantly recognizable.",
          points: [],
        },
        {
          label: "Community",
          title: "Community management",
          body: "Responding, engaging, and nurturing conversations so your audience feels heard.",
          points: [],
        },
        {
          label: "Campaigns",
          title: "Paid social campaigns",
          body: "Targeted ads that reach new audiences and retarget warm ones — with clear tracking.",
          points: [],
        },
        {
          label: "Reporting",
          title: "Insight & reporting",
          body: "Simple monthly reporting on what resonated and what we’re changing next.",
          points: [],
        },
      ]}
      faqs={[
        {
          q: "Which platforms should my business be on?",
          a: "The ones your customers actually use. We’ll recommend a focused mix rather than spreading you thin across every platform.",
        },
        {
          q: "Do you create the content or do we?",
          a: "Either — or a mix. We can produce everything, or build templates and a plan your team can execute with our guidance.",
        },
        {
          q: "How do you measure success on social?",
          a: "We tie social to your goals: reach and engagement for awareness, and clicks, inquiries, or sign-ups for growth.",
        },
      ]}
      cta={{
        title: (
          <>
            Ready to give people a reason to{" "}
            <span className="serif-accent text-copper-600">follow along?</span>
          </>
        ),
        body: "Let’s build a social presence your audience looks forward to.",
      }}
    />
  );
}

export const Route = createFileRoute("/services/social-media")({
  head: () => seo(metadata, "/services/social-media"),
  component: SocialMediaPage,
});
