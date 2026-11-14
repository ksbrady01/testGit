import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { EvaluationPage } from "@/components/sections/EvaluationPage";
import { SerpClimb } from "@/components/seo/SerpClimb";
import { img } from "@/content/images";

const metadata = {
  title: "Free SEO Evaluation — How Visible Is Your Business?",
  description:
    "Request a free SEO evaluation from CleverHouse Media. We review your keywords, page structure, local visibility, metadata, technical readiness, and content — and show you the biggest opportunities.",
  alternates: { canonical: "/seo-evaluation" },
};

function SeoEvaluationPage() {
  return (
    <EvaluationPage
      type="seo-evaluation"
      eyebrow="Free SEO evaluation"
      title={
        <>
          How visible is your business <span className="serif-accent text-copper-300">online?</span>
        </>
      }
      intro="Find out how easily the right people can find you in search — and exactly what’s holding you back. We’ll review your site and local presence and send you a clear, prioritized summary."
      image={img.thinkerWoman}
      visual={<SerpClimb query="what your customers search for" />}
      areas={[
        { title: "Keywords", body: "Which searches you’re visible for, and the valuable ones you’re missing." },
        { title: "Page structure", body: "Headings, hierarchy, and internal links that help search engines understand you." },
        { title: "Local visibility", body: "Your Business Profile, listings consistency, and map presence." },
        { title: "Metadata", body: "Titles and descriptions that earn the click in search results." },
        { title: "Technical readiness", body: "Speed, mobile usability, indexing, and structured data." },
        { title: "Search-focused content", body: "Whether your content answers the questions customers ask." },
        { title: "Competitor context", body: "How you compare with the businesses showing up instead of you." },
        { title: "Opportunities", body: "A prioritized list of improvements with the biggest impact first." },
      ]}
      goals={["More local customers", "Rank for specific services", "Recover lost traffic", "Prepare for a redesign", "Outrank competitors", "Just curious"]}
      fields={["company", "website", "location", "keywords", "goals", "message"]}
      faqs={[
        { q: "Is the SEO evaluation really free?", a: "Yes. There’s no cost and no obligation. It’s a way for us to show how we think — and for you to get useful insight either way." },
        { q: "Is this an automated report?", a: "No. A member of our team reviews your site and search presence personally. We don’t generate instant scores or pretend a tool can replace real analysis." },
        { q: "How long does it take?", a: "Most evaluations are completed within a few business days, depending on the size of the site." },
        { q: "What do I need to provide?", a: "Just your website address and a little context about your goals. Access to analytics or Search Console is helpful later, but not required." },
      ]}
    />
  );
}

export const Route = createFileRoute("/seo-evaluation")({
  head: () => seo(metadata, "/seo-evaluation"),
  component: SeoEvaluationPage,
});
