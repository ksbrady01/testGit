import Image from "../ui/Img";
import Link from "../ui/Link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Reveal, SplitHeading, ScrollZoom } from "../motion/Motion";
import { Button } from "../ui/Button";
import { LogoMark } from "../brand/Logo";
import clsx from "../../lib/clsx";

/* Section heading pattern: label column + large heading */
export function SectionHead({
  label,
  title,
  intro,
  light = false,
  className,
  id,
}: {
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  light?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div className={clsx("grid gap-8 md:grid-cols-12", className)}>
      <p className={clsx("label label-dot md:col-span-3 md:pt-4", light ? "text-copper-700" : "text-copper-300")}>{label}</p>
      <div className="md:col-span-9">
        <SplitHeading id={id} className={clsx("font-display text-huge font-medium", light && "text-ink")}>
          {title}
        </SplitHeading>
        {intro && (
          <Reveal kind="up">
            <div className={clsx("mt-8 max-w-[58ch] text-lead", light ? "text-ink/65" : "text-bone/70")}>{intro}</div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/* Compact CTA band with the CH mark */
export function CtaBand({
  title,
  body,
  primary,
  secondary,
  light = false,
}: {
  title: React.ReactNode;
  body?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  light?: boolean;
}) {
  return (
    <section className={clsx("relative overflow-hidden py-24 md:py-32", light ? "surface-bone" : "bg-ink-850")}>
      <div className="pointer-events-none absolute -right-16 top-1/2 w-[46vw] max-w-[520px] -translate-y-1/2 opacity-[0.08]" aria-hidden="true">
        <LogoMark />
      </div>
      <div className="shell relative grid items-end gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <SplitHeading className={clsx("font-display text-big font-medium", light && "text-ink")}>{title}</SplitHeading>
          {body && <p className={clsx("mt-6 max-w-[52ch] text-lg", light ? "text-ink/65" : "text-bone/70")}>{body}</p>}
        </div>
        <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
          <Button href={primary.href} variant={light ? "dark" : "copper"}>
            {primary.label}
          </Button>
          {secondary && (
            <Button href={secondary.href} variant={light ? "ghost-dark" : "ghost"} icon={false}>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

/* Accessible FAQ built on <details> */
export function Faq({ items, light = false }: { items: { q: string; a: string }[]; light?: boolean }) {
  return (
    <div className={clsx("border-t", light ? "border-ink/15" : "border-bone/12")}>
      {items.map((it) => (
        <details key={it.q} className={clsx("group border-b", light ? "border-ink/15" : "border-bone/12")}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
            <span className={clsx("font-display text-xl font-medium tracking-tight md:text-2xl", light && "text-ink")}>{it.q}</span>
            <span className={clsx("grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 transition-transform duration-500 group-open:rotate-45", light ? "ring-ink/20 text-ink" : "ring-bone/20")}>
              <Plus size={16} />
            </span>
          </summary>
          <p className={clsx("max-w-[70ch] pb-7 text-lg", light ? "text-ink/65" : "text-bone/70")}>{it.a}</p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* Full-bleed cinematic image band with a statement */
export function ImageBand({ image, alt = "", statement, caption }: { image: string; alt?: string; statement?: React.ReactNode; caption?: string }) {
  return (
    <section className="relative h-[80svh] min-h-[520px] overflow-hidden bg-ink">
      <ScrollZoom className="absolute inset-0" from={1.25}>
        <div className="relative h-full w-full">
          <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" />
        </div>
      </ScrollZoom>
      <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/30 to-ink/10" />
      <div className="shell relative flex h-full flex-col justify-end pb-14">
        {statement && <SplitHeading className="max-w-[18ch] font-display text-big font-medium">{statement}</SplitHeading>}
        {caption && <p className="label mt-6 text-bone/60">{caption}</p>}
      </div>
    </section>
  );
}

/* Numbered editorial list — used for capabilities */
export function NumberedRows({ items, light = false }: { items: { title: string; body: string; href?: string }[]; light?: boolean }) {
  return (
    <Reveal kind="up" stagger={0.06} as="ol" className={clsx("border-t", light ? "border-ink/15" : "border-bone/12")}>
      {items.map((it, i) => {
        const inner = (
          <div className="grid gap-4 py-8 md:grid-cols-12 md:gap-6 md:py-10">
            <span className={clsx("font-mono text-sm md:col-span-1", light ? "text-copper-700" : "text-copper-400")}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={clsx("font-display text-[clamp(1.6rem,2.8vw,2.6rem)] font-medium leading-[1.02] tracking-[-0.03em] md:col-span-5", light && "text-ink")}>{it.title}</h3>
            <p className={clsx("text-lg md:col-span-5", light ? "text-ink/65" : "text-bone/70")}>{it.body}</p>
            {it.href && (
              <span className="hidden justify-self-end md:col-span-1 md:block">
                <span className={clsx("grid h-11 w-11 place-items-center rounded-full ring-1 transition-transform duration-500 group-hover:rotate-45", light ? "ring-ink/20" : "ring-bone/20")}>
                  <ArrowUpRight size={18} />
                </span>
              </span>
            )}
          </div>
        );
        return (
          <li key={it.title} className={clsx("group border-b", light ? "border-ink/15" : "border-bone/12")}>
            {it.href ? (
              <Link href={it.href} className="block transition-colors hover:text-copper-300">
                {inner}
              </Link>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </Reveal>
  );
}

/* Pill tag list */
export function Tags({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li key={t} className={clsx("rounded-full px-3.5 py-1.5 text-sm ring-1", light ? "text-ink/75 ring-ink/15" : "text-bone/80 ring-bone/15")}>
          {t}
        </li>
      ))}
    </ul>
  );
}

/* Small pinned process strip */
export function ProcessStrip({ steps, light = false }: { steps: { step: string; body: string }[]; light?: boolean }) {
  return (
    <Reveal kind="up" stagger={0.1} as="ol" className="grid gap-px overflow-hidden rounded-[28px] md:grid-cols-4" style={{ background: light ? "rgba(18,11,7,0.1)" : "rgba(244,237,228,0.1)" }}>
      {steps.map((s, i) => (
        <li key={s.step} className={clsx("flex min-h-[260px] flex-col justify-between p-8", light ? "bg-bone-50" : "bg-ink")}>
          <span className={clsx("font-mono text-sm", light ? "text-copper-700" : "text-copper-400")}>0{i + 1}</span>
          <div>
            <h3 className={clsx("font-display text-3xl font-medium tracking-tight", light && "text-ink")}>{s.step}</h3>
            <p className={clsx("mt-3", light ? "text-ink/65" : "text-bone/65")}>{s.body}</p>
          </div>
        </li>
      ))}
    </Reveal>
  );
}
