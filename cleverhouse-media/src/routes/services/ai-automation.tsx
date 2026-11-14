import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { AutomationFlow } from "@/components/sections/AutomationFlow";
import { img } from "@/content/images";

const metadata = {
  title: "AI & Automation",
  description:
    "AI assistants, automated follow-up, lead nurturing, and workflow automation from CleverHouse Media — practical AI that saves time and improves customer experience.",
  alternates: { canonical: "/services/ai-automation" },
};

function AiAutomationPage() {
  return (
    <ServiceDetail
      path="/services/ai-automation"
      serviceType="Marketing Automation and AI Integration"
      hero={{
        variant: "type",
        eyebrow: "AI & automation",
        title: (
          <>
            Smarter workflows. <span className="serif-accent text-verdigris-300">Faster follow-up.</span> More time for what matters.
          </>
        ),
        intro: "Practical AI and automation that answer questions around the clock, follow up with every lead, and take repetitive work off your team’s plate — without losing the human touch.",
        primary: { label: "Explore Automation", href: "/contact" },
        secondary: { label: "Digital ecosystems", href: "/services/digital-ecosystems" },
        aside: (
          <div className="rounded-2xl bg-bone/5 p-5 ring-1 ring-bone/10">
            <p className="label text-verdigris-300">Our principle</p>
            <p className="mt-3 text-bone/75">Automate the repetitive. Keep people at the center of every relationship.</p>
          </div>
        ),
      }}
      statement="Most businesses don’t lose customers because of bad service. They lose them to slow replies, forgotten follow-ups, and information stuck in the wrong place. Thoughtful automation fixes that — quietly, every day."
      signature={<AutomationFlow image={img.studioPod} />}
      capabilitiesTitle={
        <>
          Practical AI, <span className="serif-accent text-copper-300">thoughtfully applied.</span>
        </>
      }
      capabilityStyle="tabs"
      capabilities={[
        { label: "AI assistants", title: "Helpful answers, around the clock.", body: "Website assistants trained on your services and FAQs that answer common questions, qualify leads, and hand off to your team when a person is needed.", points: ["Website chat assistants", "FAQ & service knowledge", "Lead qualification", "Human handoff"] },
        { label: "Lead nurturing", title: "Every lead gets a timely reply.", body: "Automated, personal-feeling follow-up sequences triggered by form fills, bookings, and behavior.", points: ["Instant confirmations", "Nurture email sequences", "Appointment reminders", "Re-engagement campaigns"] },
        { label: "Workflow automation", title: "Less copy-paste. Fewer dropped balls.", body: "Connect forms, CRM, calendars, and team notifications so information flows where it needs to go automatically.", points: ["Form → CRM routing", "Team notifications", "Task creation", "Data syncing"] },
        { label: "Predictive insight", title: "See what’s coming.", body: "Use your data to spot your best leads, likely churn, and the campaigns most worth repeating.", points: ["Lead scoring", "Reporting dashboards", "Trend detection", "Recommendations"] },
      ]}
      faqs={[
        { q: "Will automation make our business feel impersonal?", a: "Not when it’s done well. We automate the timing and logistics so your team has more time for genuine, personal conversations." },
        { q: "Do we need a big tech stack?", a: "No. We start with the tools you already use and add only what makes a real difference." },
        { q: "Is our data safe?", a: "We follow security best practices, limit access to what each tool needs, and recommend reputable platforms with strong privacy controls." },
      ]}
      cta={{ title: <>Give your team <span className="serif-accent text-copper-600">hours back</span> every week.</>, body: "Let’s find the repetitive work worth automating first." }}
    />
  );
}

export const Route = createFileRoute("/services/ai-automation")({
  head: () => seo(metadata, "/services/ai-automation"),
  component: AiAutomationPage,
});
