import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Reveal } from "@/components/motion/Motion";
import { img } from "@/content/images";

const metadata = {
  title: "Careers",
  description: "Join CleverHouse Media. We’re always glad to meet talented strategists, designers, developers, and marketers who love great work.",
  alternates: { canonical: "/careers" },
};

function CareersPage() {
  return (
    <>
      <PageHero
        variant="stack"
        eyebrow="Careers"
        title={
          <>
            Do the best work <span className="serif-accent text-copper-300">of your career.</span>
          </>
        }
        intro="We’re a team of curious thinkers and careful makers. We don’t have open roles listed right now, but we’re always glad to meet talented people who love great work."
        images={[img.studioTeam, img.thinkerWarm, img.stickyNotes]}
      />
      <section className="relative bg-ink pb-28">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <Reveal kind="up" className="lg:col-span-4">
            <p className="label label-dot text-copper-300">What we value</p>
            <ul className="mt-8 space-y-6">
              {[
                ["Curiosity", "You ask “why” before “how.”"],
                ["Craft", "You sweat the details people feel but rarely notice."],
                ["Candor", "You share ideas openly and take feedback well."],
                ["Ownership", "You care about results, not just deliverables."],
              ].map(([t, b]) => (
                <li key={t} className="border-b border-bone/10 pb-5">
                  <p className="font-display text-2xl font-medium tracking-tight">{t}</p>
                  <p className="mt-1 text-bone/60">{b}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="rounded-[32px] bg-ink-850/80 p-6 ring-1 ring-bone/10 md:p-12 lg:col-span-7 lg:col-start-6">
            <h2 className="font-display text-3xl font-medium tracking-tight">Introduce yourself</h2>
            <p className="mt-3 text-bone/60">Share a little about what you do and a link to your portfolio or profile.</p>
            <div className="mt-10">
              <InquiryForm
                type="careers"
                fields={["website", "message"]}
                messageLabel="About you"
                messagePlaceholder="What you do best, what you’d love to work on, and where we can see your work…"
                submitLabel="Send introduction"
                successTitle="Thanks for reaching out."
                successBody="We read every introduction. If there’s a fit now or in the future, we’ll be in touch."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const Route = createFileRoute("/careers")({
  head: () => seo(metadata, "/careers"),
  component: CareersPage,
});
