import Image from "@/components/ui/Img";
import { Reveal, SplitHeading } from "@/components/motion/Motion";
import { img } from "@/content/images";
import clsx from "@/lib/clsx";

const industries = [
  { name: "Local businesses", note: "Home services, trades & neighborhood favorites", image: img.landscaper, span: "md:col-span-7 md:row-span-2" },
  { name: "Professional services", note: "Firms, advisors & consultancies", image: img.library, span: "md:col-span-5" },
  { name: "Churches & nonprofits", note: "Ministries, missions & community groups", image: img.churchGroup, span: "md:col-span-5" },
  { name: "Retail & e-commerce", note: "Boutiques, makers & online stores", image: img.retail, span: "md:col-span-4" },
  { name: "Healthcare & wellness", note: "Clinics, practices & wellness brands", image: img.wellness, span: "md:col-span-4" },
  { name: "Growing brands", note: "Startups & companies ready for their next stage", image: img.coffeeOwner, span: "md:col-span-4" },
];

export function Industries() {
  return (
    <section className="relative bg-ink py-28 md:py-40" aria-labelledby="industries-heading">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="label label-dot text-copper-300">Who we help</p>
            <SplitHeading id="industries-heading" className="mt-6 font-display text-huge font-medium">
              Built for businesses with <span className="serif-accent text-copper-300">something to say.</span>
            </SplitHeading>
          </div>
          <p className="text-bone/65 md:col-span-4">
            From the shop down the street to organizations serving whole communities — we bring the same strategic thinking and craft to every brand we partner with.
          </p>
        </div>

        <Reveal kind="up" stagger={0.08} className="mt-16 grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 md:mt-24 md:auto-rows-[300px] md:grid-cols-12">
          {industries.map((ind) => (
            <figure key={ind.name} className={clsx("group relative overflow-hidden rounded-[24px] bg-ink-850", ind.span)}>
              <Image
                src={ind.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute inset-0 opacity-0 mix-blend-color transition-opacity duration-700 group-hover:opacity-60" style={{ background: "#B88058" }} />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <p className="font-display text-2xl font-medium tracking-tight md:text-3xl">{ind.name}</p>
                <p className="mt-1 max-h-0 overflow-hidden text-sm text-bone/75 opacity-0 transition-all duration-500 group-hover:max-h-10 group-hover:opacity-100 max-md:max-h-10 max-md:opacity-100">
                  {ind.note}
                </p>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
