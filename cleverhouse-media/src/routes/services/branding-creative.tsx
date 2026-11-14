import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../../lib/seo";
import Link from "../../components/ui/Link";
import { ServiceDetail } from "../../components/sections/ServiceDetail";
import { Reveal } from "../../components/motion/Motion";
import { projects } from "../../content/projects";
import { img } from "../../content/images";
import clsx from "../../lib/clsx";

const metadata = {
  title: "Branding & Creative",
  description:
    "Brand identity, messaging, content creation, photography direction, and brand guidelines from CleverHouse Media — creative that makes your business unmistakable.",
  alternates: { canonical: "/services/branding-creative" },
};

const fontFor = (s: string) => (s === "serif" ? "font-serif" : s === "grotesk" ? "font-display" : "font-sans");

function IdentityWall() {
  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="shell">
        <p className="label label-dot text-copper-300">Identity explorations · concept brands</p>
        <Reveal kind="up" stagger={0.08} className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-6 md:auto-rows-[260px]">
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-cursor="View"
              className={clsx(
                "group relative flex flex-col justify-between overflow-hidden rounded-[28px] p-7 transition-transform duration-700 ease-out-expo hover:-translate-y-1",
                ["md:col-span-4 md:row-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-6"][i],
              )}
              style={{ background: p.brand.bg, color: p.brand.fg }}
            >
              <span className="label opacity-60">{p.industry}</span>
              <span className={clsx(fontFor(p.brand.fontStyle), "font-semibold leading-[0.9] tracking-[-0.04em]", i === 0 ? "text-[clamp(3rem,7vw,7rem)]" : "text-[clamp(2rem,3.4vw,3.4rem)]")}>{p.brand.wordmark}</span>
              <span className="flex gap-2">
                {[p.brand.accent, p.brand.muted, p.brand.fg].map((c) => (
                  <span key={c} className="h-6 w-6 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                ))}
              </span>
              <span className="absolute -bottom-6 -right-4 font-display text-[9rem] font-bold leading-none opacity-[0.07] transition-transform duration-700 group-hover:-translate-y-3">{p.brand.monogram}</span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function BrandingPage() {
  return (
    <ServiceDetail
      path="/services/branding-creative"
      serviceType="Branding and Creative Services"
      hero={{
        variant: "cinema",
        eyebrow: "Branding & creative",
        title: (
          <>
            Make your brand <span className="serif-accent text-copper-300">unmistakable.</span>
          </>
        ),
        intro: "In a crowded digital landscape, blending in is the biggest risk. We craft visual identities, compelling narratives, and content that capture attention and build lasting recognition.",
        image: img.chefPlating,
        primary: { label: "Start a Brand Project", href: "/contact" },
        secondary: { label: "See concept brands", href: "/work" },
      }}
      statement="A strong brand is a promise people can recognize from across the room — on a truck, a menu, a phone screen, or a sign. We help you define that promise and express it consistently everywhere your audience meets you."
      signature={<IdentityWall />}
      capabilitiesTitle={
        <>
          Identity, story, and content — <span className="serif-accent text-copper-300">one voice.</span>
        </>
      }
      capabilityStyle="grid"
      capabilities={[
        { label: "Identity", title: "Visual identity", body: "Logos, color, typography, and visual language designed to be distinctive and flexible.", points: [] },
        { label: "Story", title: "Messaging & positioning", body: "What you stand for and how you say it — clear, confident, and true to who you are.", points: [] },
        { label: "Content", title: "Content creation", body: "Copy, graphics, video, and campaigns that bring your brand to life across channels.", points: [] },
        { label: "Photo", title: "Photography direction", body: "Shot lists and art direction that capture real moments in your brand’s visual style.", points: [] },
        { label: "System", title: "Brand guidelines", body: "Practical guides and templates so your team can stay consistent without calling us every time.", points: [] },
        { label: "Refresh", title: "Brand refresh", body: "Modernizing an existing brand while protecting the recognition you’ve already earned.", points: [] },
      ]}
      faqs={[
        { q: "Do you only create logos?", a: "No. A logo is one piece. We build complete identity systems — messaging, visuals, and guidelines — so your brand works everywhere." },
        { q: "Can you refresh our brand without starting over?", a: "Absolutely. Many brands benefit from an evolution that keeps what people already recognize while fixing what’s holding you back." },
        { q: "What do we receive at the end?", a: "Final logo files for every use, a color and typography system, brand guidelines, and templates for the materials you use most." },
      ]}
      cta={{ title: <>Let’s give your brand the <span className="serif-accent text-copper-600">presence it deserves.</span></>, body: "Tell us about your business and where you want your brand to go." }}
    />
  );
}

export const Route = createFileRoute("/services/branding-creative")({
  head: () => seo(metadata, "/services/branding-creative"),
  component: BrandingPage,
});
