import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { BrowserFrame, MockMobile, MockSite, PhoneFrame } from "@/components/work/Mockups";
import { Parallax, Reveal } from "@/components/motion/Motion";
import { projects } from "@/content/projects";
import { img } from "@/content/images";

const metadata = {
  title: "Website Design & Development",
  description:
    "Custom, responsive, conversion-focused websites from CleverHouse Media — UI/UX design, development, e-commerce, CMS integration, accessibility, and performance.",
  alternates: { canonical: "/services/web-design-development" },
};

function DeviceShowcase() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="absolute inset-0 grid-lines opacity-50" aria-hidden="true" />
      <div className="shell relative">
        <div className="relative mx-auto max-w-[1200px]">
          <Reveal kind="up">
            <BrowserFrame url="calderfinch.com">
              <MockSite project={projects[2]} />
            </BrowserFrame>
          </Reveal>
          <Parallax speed={-30} className="absolute -bottom-[12%] -right-[2%] w-[22%] md:-right-[6%]">
            <PhoneFrame>
              <MockMobile project={projects[2]} image={projects[2].gallery[1]} />
            </PhoneFrame>
          </Parallax>
          <Parallax speed={24} className="absolute -left-[4%] -top-[10%] hidden w-[18%] md:block">
            <PhoneFrame>
              <MockMobile project={projects[1]} image={projects[1].gallery[0]} />
            </PhoneFrame>
          </Parallax>
        </div>
        <p className="mt-24 text-center font-mono text-[0.65rem] uppercase tracking-[0.18em] text-bone/40">Concept project designs · shown as examples of our craft</p>
      </div>
    </section>
  );
}

function WebDesignPage() {
  return (
    <ServiceDetail
      path="/services/web-design-development"
      serviceType="Web Design and Development"
      hero={{
        variant: "split",
        eyebrow: "Web design & development",
        title: (
          <>
            Websites that look <span className="serif-accent text-copper-300">remarkable</span> and work even harder.
          </>
        ),
        intro: "Beautiful, responsive, high-performing websites tailored to your brand — designed around your customers and engineered to turn visitors into leads, bookings, and sales.",
        image: img.studioDesk,
        imageAlt: "A designer working on a website layout",
        primary: { label: "Start a Website Project", href: "/contact" },
        secondary: { label: "Free website evaluation", href: "/website-evaluation" },
      }}
      statement="Your website is often the first conversation someone has with your business. It should answer their questions in seconds, earn their trust, and make the next step obvious — on every screen size."
      signature={<DeviceShowcase />}
      capabilitiesTitle={
        <>
          Strategy, design, and code — <span className="serif-accent text-copper-300">crafted together.</span>
        </>
      }
      capabilityStyle="tabs"
      capabilities={[
        { label: "UI/UX design", title: "Designed around real people.", body: "We map what your visitors need, then design layouts, interactions, and content that guide them naturally toward action.", points: ["User journeys & sitemaps", "Wireframes & prototypes", "Visual design systems", "Accessibility built in"] },
        { label: "Development", title: "Fast, solid, and easy to manage.", body: "Modern, responsive builds that load quickly, rank well, and give your team the tools to update content with confidence.", points: ["Responsive front-end", "Performance optimization", "Clean, maintainable code", "Analytics & tracking"] },
        { label: "E-commerce", title: "Shopping that feels effortless.", body: "Product storytelling, intuitive browsing, and streamlined checkout that turns browsers into buyers.", points: ["Store setup & design", "Product page strategy", "Checkout optimization", "Inventory & integrations"] },
        { label: "CMS integration", title: "Your content, your control.", body: "We set up content management that fits how your team works — and train you to use it.", points: ["CMS selection & setup", "Custom content types", "Editor training", "Ongoing support"] },
        { label: "Conversion (CRO)", title: "Every page with a purpose.", body: "Clear calls to action, focused forms, and testing that steadily increases the number of visitors who take the next step.", points: ["Conversion audits", "Landing pages", "Form optimization", "A/B testing"] },
      ]}
      faqs={[
        { q: "How long does a website take?", a: "Most projects take between six and twelve weeks depending on scope, content readiness, and integrations. We’ll give you a clear timeline before we start." },
        { q: "Will my website work on phones?", a: "Always. We design mobile-first, then scale up — so the experience feels intentional on every screen." },
        { q: "Can I update the website myself?", a: "Yes. We build on content management tools that fit your team and show you how to use them." },
        { q: "Is SEO included?", a: "Every site we build includes SEO fundamentals — structure, speed, metadata, and schema. Ongoing SEO is available as a separate service." },
      ]}
      cta={{ title: <>Ready for a website that <span className="serif-accent text-copper-600">works as hard as you do?</span></>, body: "Tell us about your goals and we’ll show you what’s possible." }}
    />
  );
}

export const Route = createFileRoute("/services/web-design-development")({
  head: () => seo(metadata, "/services/web-design-development"),
  component: WebDesignPage,
});
