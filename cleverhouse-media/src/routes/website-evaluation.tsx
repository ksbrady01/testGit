import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import { EvaluationPage } from "../components/sections/EvaluationPage";
import { BrowserFrame, MockSite } from "../components/work/Mockups";
import { projects } from "../content/projects";
import { img } from "../content/images";

const metadata = {
  title: "Free Website Evaluation — Is Your Website Helping You Grow?",
  description:
    "Request a free website evaluation from CleverHouse Media covering visual design, mobile usability, speed, navigation, messaging, calls to action, conversion opportunities, and search readiness.",
  alternates: { canonical: "/website-evaluation" },
};

function AnnotatedSite() {
  const notes = [
    { t: "Message clarity", c: "left-[6%] top-[30%]" },
    { t: "Call to action", c: "left-[30%] top-[62%]" },
    { t: "Mobile layout", c: "right-[4%] top-[12%]" },
    { t: "Load speed", c: "right-[10%] bottom-[12%]" },
  ];
  return (
    <div className="relative">
      <BrowserFrame url="yourwebsite.com">
        <MockSite project={projects[2]} />
      </BrowserFrame>
      {notes.map((n, i) => (
        <span key={n.t} className={`absolute ${n.c} flex items-center gap-2 rounded-full bg-ink/90 px-3 py-1.5 text-xs text-bone ring-1 ring-copper-400/50 backdrop-blur-sm`}>
          <span className="grid h-4 w-4 place-items-center rounded-full bg-copper-400 font-mono text-[0.55rem] text-ink">{i + 1}</span>
          {n.t}
        </span>
      ))}
      <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-bone/40">Illustrative annotation of a sample site</p>
    </div>
  );
}

function WebsiteEvaluationPage() {
  return (
    <EvaluationPage
      type="website-evaluation"
      eyebrow="Free website evaluation"
      title={
        <>
          Is your website helping your business grow — <span className="serif-accent text-copper-300">or holding it back?</span>
        </>
      }
      intro="Your website should be your hardest-working salesperson. We’ll take an honest, hands-on look at how it looks, performs, and converts — and tell you what we’d fix first."
      image={img.studioDesk}
      visual={<AnnotatedSite />}
      areas={[
        { title: "Visual design", body: "Does it look credible, current, and on-brand at first glance?" },
        { title: "Mobile usability", body: "How it feels on the phone in your customer’s hand." },
        { title: "Speed", body: "Load times and performance that affect both visitors and rankings." },
        { title: "Navigation", body: "Can people find what they need in a few seconds?" },
        { title: "Messaging", body: "Is it clear what you do, who it’s for, and why you’re the right choice?" },
        { title: "Calls to action", body: "Is the next step obvious on every key page?" },
        { title: "Conversion opportunities", body: "Forms, offers, and paths that could turn more visitors into leads." },
        { title: "Search readiness", body: "The SEO fundamentals your site needs to be found." },
      ]}
      goals={["More leads or sales", "A modern look", "Better mobile experience", "Faster site", "Clearer messaging", "Planning a redesign"]}
      fields={["company", "website", "goals", "timeline", "message"]}
      faqs={[
        { q: "What will I receive?", a: "A clear summary of strengths, issues, and prioritized recommendations across design, usability, performance, messaging, conversion, and search readiness — plus an offer to walk through it together." },
        { q: "Do you need access to my website?", a: "No. We evaluate your public website. If you’d like a deeper review later, we can talk about analytics access." },
        { q: "Will you just tell me to rebuild everything?", a: "No. Many sites need focused improvements, not a full rebuild. We’ll tell you honestly which is the better investment." },
        { q: "How much does it cost?", a: "Nothing. The evaluation is free and comes with no obligation." },
      ]}
    />
  );
}

export const Route = createFileRoute("/website-evaluation")({
  head: () => seo(metadata, "/website-evaluation"),
  component: WebsiteEvaluationPage,
});
