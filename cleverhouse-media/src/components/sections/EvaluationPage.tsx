import Image from "../site/Img";
import { InquiryForm } from "../forms/InquiryForm";
import { Reveal, SplitHeading } from "../motion/Motion";
import { Faq, JsonLd, faqJsonLd } from "./Blocks";
import type { InquiryType } from "../../lib/inquiry";
import clsx from "../../lib/clsx";

type Area = { title: string; body: string };

/**
 * Lead-generation landing page for the free evaluations.
 * Honest by design: the request goes to a person who performs the review — no fake instant "scores".
 */
export function EvaluationPage({
  type,
  eyebrow,
  title,
  intro,
  image,
  areas,
  goals,
  fields,
  faqs,
  accent = "copper",
  visual,
}: {
  type: InquiryType;
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  image: string;
  areas: Area[];
  goals: string[];
  fields: Parameters<typeof InquiryForm>[0]["fields"];
  faqs: { q: string; a: string }[];
  accent?: "copper" | "verdigris";
  visual: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <section className="relative overflow-hidden bg-ink pb-20 pt-36 md:pt-44">
        <div className="absolute inset-0 grid-lines opacity-50" aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block" aria-hidden="true">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="42vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/60 to-ink/20" />
        </div>
        <div className="shell relative grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal kind="fade">
              <p
                className={clsx(
                  "label label-dot",
                  accent === "verdigris" ? "text-verdigris-300" : "text-copper-300",
                )}
              >
                {eyebrow}
              </p>
            </Reveal>
            <SplitHeading
              as="h1"
              onLoad
              delay={0.45}
              className="mt-6 font-display text-huge font-medium"
            >
              {title}
            </SplitHeading>
            <Reveal kind="up" delay={0.5}>
              <p className="mt-8 max-w-[52ch] text-lead text-bone/75">{intro}</p>
              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-bone/80">
                {[
                  "Free, no obligation",
                  "Reviewed by a real person",
                  "Clear, prioritized next steps",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-copper-400" /> {t}
                  </li>
                ))}
              </ul>
              <a href="#request" className="btn btn-copper mt-10">
                <span className="relative">Request my evaluation</span>
              </a>
            </Reveal>
          </div>
          <div className="lg:col-span-5">{visual}</div>
        </div>
      </section>

      <section className="surface-paper relative py-24 md:py-32">
        <div className="absolute inset-0 grid-lines-dark opacity-60" aria-hidden="true" />
        <div className="shell relative">
          <div className="grid gap-8 md:grid-cols-12">
            <p className="label label-dot text-copper-700 md:col-span-3">What we review</p>
            <SplitHeading className="font-display text-big font-medium text-ink md:col-span-9">
              A thorough look, translated into{" "}
              <span className="serif-accent text-copper-600">plain language.</span>
            </SplitHeading>
          </div>
          <Reveal
            kind="up"
            stagger={0.06}
            as="ul"
            className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {areas.map((a, i) => (
              <li
                key={a.title}
                className="group flex min-h-[220px] flex-col justify-between rounded-[24px] bg-bone p-6 ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,11,7,0.35)]"
              >
                <span className="font-mono text-xs text-copper-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-medium tracking-tight text-ink">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-ink/65">{a.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="request" className="relative scroll-mt-24 bg-ink py-24 md:py-32">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label label-dot text-copper-300">Request your evaluation</p>
            <h2 className="mt-6 font-display text-big font-medium">Tell us where to look.</h2>
            <p className="mt-6 text-bone/65">
              Our team reviews every request personally and sends back a clear summary of what’s
              working, what isn’t, and what we’d prioritize. This isn’t an automated score — it’s a
              thoughtful second opinion.
            </p>
            <ol className="mt-10 space-y-4 border-l border-bone/15 pl-6 text-bone/75">
              <li>
                <span className="font-mono text-xs text-copper-300">01</span> Submit your site and
                goals
              </li>
              <li>
                <span className="font-mono text-xs text-copper-300">02</span> We review it, hands-on
              </li>
              <li>
                <span className="font-mono text-xs text-copper-300">03</span> You get a prioritized
                summary and a walkthrough offer
              </li>
            </ol>
          </div>
          <div className="rounded-[32px] bg-ink-850/80 p-6 ring-1 ring-bone/10 md:p-12 lg:col-span-7 lg:col-start-6">
            <InquiryForm
              type={type}
              fields={fields}
              goals={goals}
              messageLabel="Anything else we should know?"
              messagePlaceholder="Recent changes, frustrations, competitors you admire…"
              submitLabel="Request evaluation"
              successTitle="Request received."
              successBody="We’ll review your site personally and get back to you within a few business days with what we found and what we’d prioritize."
            />
          </div>
        </div>
      </section>

      <section className="surface-paper relative py-24 md:py-32">
        <div className="shell grid gap-12 md:grid-cols-12">
          <h2 className="font-display text-big font-medium text-ink md:col-span-4">
            Good questions.
          </h2>
          <div className="md:col-span-8">
            <Faq items={faqs} light />
          </div>
        </div>
      </section>
    </>
  );
}
