import Image from "@/components/ui/Img";
import { useRef } from "react";
import { Bell, Bot, Database, Mail, MousePointerClick, CalendarCheck } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

const steps = [
  { icon: MousePointerClick, title: "A visitor asks for a quote", note: "Website form · 9:47 pm" },
  { icon: Bot, title: "AI assistant answers & qualifies", note: "Instant, on-brand replies" },
  { icon: Database, title: "Lead saved to your CRM", note: "Full context, no copy-paste" },
  { icon: Bell, title: "The right person is notified", note: "Routed by service & area" },
  { icon: Mail, title: "Personal follow-up goes out", note: "Timed, tailored sequence" },
  { icon: CalendarCheck, title: "Appointment booked", note: "Calendar synced automatically" },
];

/** Scroll-scrubbed automation journey: a pulse travels the path and lights each step. */
export function AutomationFlow({ image }: { image: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-flow-step]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-flow-list]", start: "top 70%", end: "bottom 45%", scrub: 0.6 } });
        tl.fromTo("[data-flow-line]", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: items.length }, 0);
        items.forEach((el, i) => {
          tl.fromTo(el, { opacity: 0.25, x: 0 }, { opacity: 1, x: 8, duration: 0.6, ease: "power2.out" }, i);
          tl.fromTo(el.querySelector("[data-flow-dot]"), { backgroundColor: "rgba(244,237,228,0.1)", color: "rgba(244,237,228,0.5)" }, { backgroundColor: "#9BD8CB", color: "#120B07", duration: 0.4 }, i);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} className="relative overflow-hidden bg-ink-950 py-24 md:py-36">
      <div className="absolute inset-0 grid-lines opacity-40" aria-hidden="true" />
      <div className="shell relative grid items-center gap-16 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
            <Image src={image} alt="A focused workstation where automations are built" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-ink/80 p-5 ring-1 ring-verdigris-400/30 backdrop-blur">
              <p className="label text-verdigris-300">A day in the life of a lead</p>
              <p className="mt-2 font-display text-xl">From first click to booked appointment — without anyone dropping the ball.</p>
            </div>
          </div>
        </div>
        <ol data-flow-list className="relative space-y-4 lg:col-span-6 lg:col-start-7" aria-label="Example automation journey">
          <span className="absolute bottom-6 left-[27px] top-6 w-px bg-bone/10" aria-hidden="true" />
          <span data-flow-line className="absolute bottom-6 left-[27px] top-6 w-px origin-top bg-verdigris-300" aria-hidden="true" />
          {steps.map((s) => (
            <li key={s.title} data-flow-step className="relative flex items-center gap-5 rounded-2xl p-2">
              <span data-flow-dot className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-bone/10 text-bone/60 ring-4 ring-ink-950">
                <s.icon size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-xl tracking-tight md:text-2xl">{s.title}</span>
                <span className="text-sm text-bone/55">{s.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
