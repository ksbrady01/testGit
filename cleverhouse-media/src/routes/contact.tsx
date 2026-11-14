import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import Image from "../components/site/Img";
import { Mail, MapPin, Clock } from "lucide-react";
import { InquiryForm } from "../components/forms/InquiryForm";
import { Reveal, SplitHeading } from "../components/motion/Motion";
import { LogoMark } from "../components/brand/Logo";
import { img } from "../content/images";
import { site } from "../content/site";

const metadata = {
  title: "Contact — Start Your Project",
  description:
    "Tell CleverHouse Media about your project. Web design, SEO, branding, marketing, and digital ecosystems — let’s build something worth talking about.",
  alternates: { canonical: "/contact" },
};

function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-ink pb-28 pt-36 md:pt-44">
      <div className="absolute inset-0 grid-lines opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-[12vw] top-[6%] w-[50vw] max-w-[640px] opacity-[0.05]"
        aria-hidden="true"
      >
        <LogoMark />
      </div>
      <div className="shell relative">
        <Reveal kind="fade">
          <p className="label label-dot text-copper-300">Contact</p>
        </Reveal>
        <SplitHeading
          as="h1"
          onLoad
          delay={0.45}
          className="mt-6 max-w-[14ch] font-display text-giant font-medium"
        >
          Let&apos;s build something{" "}
          <span className="serif-accent text-copper-300">worth talking about.</span>
        </SplitHeading>

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <Reveal kind="up" delay={0.3} className="space-y-10 lg:sticky lg:top-32">
              <div className="relative aspect-4/3 overflow-hidden rounded-[28px]">
                <Image
                  src={img.studioDuo}
                  alt="Two members of the team working together in the studio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/70 to-transparent" />
                <p className="absolute bottom-4 left-5 label text-bone/85">
                  A real person reads every message
                </p>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <Mail className="mt-1 shrink-0 text-copper-300" size={20} aria-hidden="true" />
                  <div>
                    <p className="label text-bone/50">Email</p>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-1 block font-display text-xl link-line w-fit"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MapPin className="mt-1 shrink-0 text-copper-300" size={20} aria-hidden="true" />
                  <div>
                    <p className="label text-bone/50">Based in</p>
                    <p className="mt-1 font-display text-xl">{site.location}</p>
                    <p className="text-sm text-bone/55">
                      Working with clients across Texas and beyond.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock className="mt-1 shrink-0 text-copper-300" size={20} aria-hidden="true" />
                  <div>
                    <p className="label text-bone/50">What happens next</p>
                    <ol className="mt-2 space-y-1.5 text-bone/75">
                      <li>1. We read your note and do a little homework.</li>
                      <li>2. We reply within one to two business days.</li>
                      <li>3. We schedule a conversation about your goals.</li>
                    </ol>
                  </div>
                </li>
              </ul>
            </Reveal>
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal kind="up" delay={0.4}>
              <div className="rounded-[32px] bg-ink-850/70 p-6 ring-1 ring-bone/10 backdrop-blur-sm md:p-12">
                <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
                  Tell us about your project
                </h2>
                <p className="mt-3 text-bone/60">
                  The more we know, the more useful our first conversation will be. Fields marked *
                  are required.
                </p>
                <div className="mt-10">
                  <InquiryForm
                    type="contact"
                    fields={[
                      "company",
                      "website",
                      "phone",
                      "service",
                      "budget",
                      "timeline",
                      "message",
                    ]}
                    submitLabel="Start the conversation"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/contact")({
  head: () => seo(metadata, "/contact"),
  component: ContactPage,
});
