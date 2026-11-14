import Image from "../site/Img";
import Link from "../site/Link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "../../lib/gsap";
import { SplitHeading } from "../motion/Motion";
import { services } from "../../content/services";
import clsx from "../../lib/clsx";

/**
 * Editorial service rows. On desktop, a floating image preview follows the
 * pointer and the active row expands to reveal details. On touch devices
 * rows expand on tap and show their image inline.
 */
export function ServicesRows() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
        () => {
          const el = preview.current!;
          const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
          const rot = gsap.quickTo(el, "rotate", { duration: 0.9, ease: "power3" });
          let lastX = 0;
          const list = root.current!.querySelector("[data-rows]") as HTMLElement;
          const move = (e: PointerEvent) => {
            const r = list.getBoundingClientRect();
            xTo(e.clientX - r.left);
            yTo(e.clientY - r.top);
            rot(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
            lastX = e.clientX;
          };
          list.addEventListener("pointermove", move);
          return () => list.removeEventListener("pointermove", move);
        },
      );
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.current!.querySelectorAll("[data-row]"), {
          y: 50,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1.2,
          scrollTrigger: {
            trigger: root.current!.querySelector("[data-rows]"),
            start: "top 80%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-ink py-28 md:py-40"
      aria-labelledby="services-heading"
    >
      <div className="absolute inset-0 grid-cols-lines" aria-hidden="true" />
      <div className="shell relative">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="label label-dot text-copper-300 md:col-span-3">What we do</p>
          <SplitHeading
            id="services-heading"
            className="font-display text-huge font-medium md:col-span-9"
          >
            Everything your brand needs to{" "}
            <span className="serif-accent text-copper-300">move forward.</span>
          </SplitHeading>
        </div>

        <div data-rows className="relative mt-20 md:mt-28" onPointerLeave={() => setActive(null)}>
          {/* Floating preview (desktop) */}
          <div
            ref={preview}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[300px] w-[240px] -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <div
              className={clsx(
                "relative h-full w-full overflow-hidden rounded-2xl transition-all duration-500 ease-out-expo",
                active !== null ? "scale-100 opacity-100" : "scale-75 opacity-0",
              )}
            >
              {services.map((s, i) => (
                <Image
                  key={s.id}
                  src={s.image}
                  alt=""
                  fill
                  sizes="240px"
                  className={clsx(
                    "object-cover transition-all duration-700 ease-out-expo",
                    active === i ? "scale-100 opacity-100" : "scale-110 opacity-0",
                  )}
                />
              ))}
              <div className="absolute inset-0 ring-1 ring-inset ring-bone/10" />
            </div>
          </div>

          <ul className="border-t border-bone/12">
            {services.map((s, i) => {
              const isOn = active === i;
              return (
                <li key={s.id} data-row className="border-b border-bone/12">
                  <Link
                    href={s.href}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group relative block py-7 outline-hidden md:py-9"
                  >
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "absolute inset-0 origin-bottom bg-linear-to-r from-copper-700/25 via-copper-600/10 to-transparent transition-transform duration-700 ease-out-expo",
                        isOn ? "scale-y-100" : "scale-y-0",
                      )}
                    />
                    <span className="relative grid items-baseline gap-3 md:grid-cols-12 md:gap-6">
                      <span className="font-mono text-sm text-copper-400 md:col-span-1">
                        {s.index}
                      </span>
                      <span
                        className={clsx(
                          "font-display text-[clamp(1.9rem,4.6vw,4.6rem)] font-medium leading-none tracking-[-0.035em] transition-all duration-700 ease-out-expo md:col-span-7",
                          isOn ? "translate-x-3 text-copper-200" : "text-bone",
                        )}
                      >
                        {s.title}
                      </span>
                      <span className="hidden text-bone/60 md:col-span-3 md:block">
                        {s.summary.split(" — ")[0]?.split(".")[0]}.
                      </span>
                      <span className="absolute right-0 top-1 grid h-11 w-11 place-items-center rounded-full ring-1 ring-bone/20 transition-all duration-500 group-hover:rotate-45 group-hover:bg-copper-400 group-hover:text-ink md:relative md:col-span-1 md:justify-self-end">
                        <ArrowUpRight size={18} />
                      </span>
                    </span>
                    {/* Expanding details */}
                    <span
                      className={clsx(
                        "relative grid transition-all duration-700 ease-out-expo md:grid-cols-12 md:gap-6",
                        isOn ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden md:col-span-10 md:col-start-2">
                        <span className="flex flex-wrap gap-2 pt-6">
                          {s.points.map((p) => (
                            <span
                              key={p}
                              className="rounded-full bg-bone/8 px-3.5 py-1.5 text-sm text-bone/80 ring-1 ring-bone/12"
                            >
                              {p}
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>
                    {/* Inline image on touch */}
                    <span
                      className={clsx(
                        "relative mt-5 block overflow-hidden rounded-2xl transition-all duration-700 lg:hidden",
                        isOn ? "h-48 opacity-100" : "h-0 opacity-0",
                      )}
                    >
                      <Image src={s.image} alt="" fill sizes="100vw" className="object-cover" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
