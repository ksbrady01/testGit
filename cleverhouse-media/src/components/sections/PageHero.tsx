import Image from "../site/Img";
import { SplitHeading, Reveal, Parallax } from "../motion/Motion";
import { Button } from "../site/Button";
import clsx from "../../lib/clsx";

type Cta = { label: string; href: string };

/**
 * Page heroes share typography and motion but differ in composition:
 *  - "type":   monumental type on ink with a subtle mark-like frame
 *  - "split":  editorial split — type left, tall framed image right
 *  - "cinema": full-bleed photograph with type set over it
 *  - "stack":  type over a floating, rotated image collage
 */
export function PageHero({
  variant = "type",
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  images,
  primary,
  secondary,
  aside,
  light = false,
}: {
  variant?: "type" | "split" | "cinema" | "stack";
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  images?: string[];
  primary?: Cta;
  secondary?: Cta;
  aside?: React.ReactNode;
  light?: boolean;
}) {
  const ctas = (primary || secondary) && (
    <Reveal kind="up" delay={0.5} className="mt-10 flex flex-wrap gap-3">
      {primary && (
        <Button href={primary.href} variant={light ? "dark" : "copper"}>
          {primary.label}
        </Button>
      )}
      {secondary && (
        <Button href={secondary.href} variant={light ? "ghost-dark" : "ghost"} icon={false}>
          {secondary.label}
        </Button>
      )}
    </Reveal>
  );

  const heading = (cls: string) => (
    <SplitHeading as="h1" onLoad delay={0.45} className={cls}>
      {title}
    </SplitHeading>
  );

  const eyebrowEl = (
    <Reveal kind="fade">
      <p className={clsx("label label-dot", light ? "text-copper-700" : "text-copper-300")}>
        {eyebrow}
      </p>
    </Reveal>
  );

  if (variant === "cinema") {
    return (
      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink pb-16 pt-40 md:pb-24">
        {image && (
          <Parallax speed={18} className="absolute inset-0 -z-10 scale-110">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </Parallax>
        )}
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/60 to-ink/20" />
        <div className="absolute inset-0 -z-10 grid-lines opacity-40" />
        <div className="grain absolute inset-0 -z-10" />
        <div className="shell">
          {eyebrowEl}
          {heading("mt-6 max-w-[16ch] font-display text-giant font-medium")}
          <div className="mt-8 grid gap-8 md:grid-cols-12">
            {intro && (
              <Reveal kind="up" delay={0.35} className="md:col-span-6">
                <div className="text-lead text-bone/80">{intro}</div>
              </Reveal>
            )}
            {aside && <div className="md:col-span-5 md:col-start-8">{aside}</div>}
          </div>
          {ctas}
        </div>
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section
        className={clsx(
          "relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44",
          light ? "surface-paper" : "bg-ink",
        )}
      >
        <div
          className={clsx(
            "absolute inset-0",
            light ? "grid-lines-dark opacity-70" : "grid-lines opacity-60",
          )}
          aria-hidden="true"
        />
        <div className="shell relative grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {eyebrowEl}
            {heading(clsx("mt-6 font-display text-huge font-medium", light && "text-ink"))}
            {intro && (
              <Reveal kind="up" delay={0.35}>
                <div
                  className={clsx(
                    "mt-8 max-w-[52ch] text-lead",
                    light ? "text-ink/70" : "text-bone/75",
                  )}
                >
                  {intro}
                </div>
              </Reveal>
            )}
            {ctas}
          </div>
          {image && (
            <div className="relative lg:col-span-5">
              <Reveal kind="image" className="relative aspect-4/5 overflow-hidden rounded-[32px]">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </Reveal>
              {aside && (
                <div className="absolute -bottom-6 -left-6 max-w-[80%] md:-left-12">{aside}</div>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === "stack") {
    const imgs = images || (image ? [image] : []);
    return (
      <section className="relative overflow-hidden bg-ink pb-24 pt-36 md:pb-32 md:pt-44">
        <div className="absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {imgs.slice(0, 3).map((src, i) => (
            <Parallax
              key={src}
              speed={[-30, 20, -14][i]}
              className={clsx(
                "absolute overflow-hidden rounded-[24px] shadow-2xl",
                [
                  "right-[6%] top-[14%] hidden w-[22vw] max-w-[340px] rotate-[4deg] md:block",
                  "right-[22%] top-[52%] hidden w-[16vw] max-w-[240px] -rotate-[5deg] lg:block",
                  "left-[58%] top-[8%] hidden w-[12vw] max-w-[180px] -rotate-3 xl:block",
                ][i],
              )}
            >
              <Reveal kind="image" delay={0.2 + i * 0.15} className="relative aspect-3/4">
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="25vw"
                  className="object-cover"
                />
              </Reveal>
            </Parallax>
          ))}
        </div>
        <div className="shell relative">
          {eyebrowEl}
          {heading("mt-6 max-w-[13ch] font-display text-mega font-medium")}
          {intro && (
            <Reveal kind="up" delay={0.35}>
              <div className="mt-10 max-w-[48ch] text-lead text-bone/75">{intro}</div>
            </Reveal>
          )}
          {ctas}
        </div>
      </section>
    );
  }

  // "type"
  return (
    <section
      className={clsx(
        "relative overflow-hidden pb-20 pt-40 md:pb-28 md:pt-52",
        light ? "surface-paper" : "bg-ink",
      )}
    >
      <div
        className={clsx(
          "absolute inset-0",
          light ? "grid-lines-dark opacity-70" : "grid-lines opacity-60",
        )}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-[20vw] -top-[20vw] h-[60vw] w-[60vw] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(184,128,88,0.18), transparent 60%)" }}
        aria-hidden="true"
      />
      <div className="shell relative">
        {eyebrowEl}
        {heading(
          clsx("mt-6 max-w-[18ch] font-display text-giant font-medium", light && "text-ink"),
        )}
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          {intro && (
            <Reveal kind="up" delay={0.35} className="md:col-span-6 md:col-start-6">
              <div className={clsx("text-lead", light ? "text-ink/70" : "text-bone/75")}>
                {intro}
              </div>
            </Reveal>
          )}
          {aside && <div className="md:col-span-4 md:col-start-1 md:row-start-1">{aside}</div>}
        </div>
        <div className="md:ml-[41.66%]">{ctas}</div>
      </div>
    </section>
  );
}
