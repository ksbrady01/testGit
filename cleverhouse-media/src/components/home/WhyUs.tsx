import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion/Motion";

const queries = ["web design agency in texas", "how to rank on google maps", "best local seo for small business", "website that gets more leads"];

function TypingSearch() {
  const [text, setText] = useState("");
  const [qi, setQi] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(queries[0]);
      return;
    }
    const q = queries[qi];
    let i = 0;
    let dir = 1;
    let pause = 0;
    const id = window.setInterval(() => {
      if (pause > 0) {
        pause--;
        return;
      }
      i += dir;
      setText(q.slice(0, i));
      if (i >= q.length) {
        dir = -1;
        pause = 22;
      } else if (i <= 0 && dir === -1) {
        window.clearInterval(id);
        setQi((x) => (x + 1) % queries.length);
      }
    }, 55);
    return () => window.clearInterval(id);
  }, [qi]);
  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-lg ring-1 ring-ink/10">
        <Search size={16} className="text-copper-600" />
        <span className="min-h-[1.5em] text-sm text-ink">{text}</span>
        <span className="-ml-2 h-4 w-px animate-blink bg-ink" />
      </div>
      <div className="mt-3 space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`rounded-xl px-4 py-3 ${i === 0 ? "bg-ink text-bone" : "bg-white/70 text-ink/60"}`}>
            <span className={`block h-2 rounded-full ${i === 0 ? "w-2/3 bg-copper-300" : "w-1/2 bg-ink/15"}`} />
            <span className={`mt-2 block h-1.5 rounded-full ${i === 0 ? "w-11/12 bg-bone/30" : "w-10/12 bg-ink/10"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DesignGrid() {
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" fill="none" aria-hidden="true">
      <g stroke="#985E38" strokeWidth="1" data-draw>
        <rect x="10" y="10" width="300" height="200" rx="8" pathLength={1} />
        <path d="M10 46 H310" pathLength={1} />
        <path d="M195 10 V210" pathLength={1} />
        <path d="M10 136 H195" pathLength={1} />
        <circle cx="252" cy="128" r="46" pathLength={1} />
        <path d="M195 210 A 115 115 0 0 1 310 95" pathLength={1} />
      </g>
      <g fill="#120B07">
        <rect x="26" y="66" width="120" height="14" rx="2" />
        <rect x="26" y="88" width="90" height="14" rx="2" />
        <rect x="26" y="152" width="70" height="20" rx="10" fill="#B88058" />
      </g>
    </svg>
  );
}

function Devices() {
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" fill="none" aria-hidden="true">
      <g stroke="#120B07" strokeWidth="1.2" data-draw>
        <rect x="20" y="30" width="170" height="110" rx="8" pathLength={1} />
        <rect x="220" y="60" width="62" height="120" rx="12" pathLength={1} />
        <rect x="120" y="150" width="90" height="56" rx="6" pathLength={1} />
        <path d="M190 85 C 205 85, 205 110, 220 110" pathLength={1} stroke="#3F9C8B" />
        <path d="M150 140 L 160 150" pathLength={1} stroke="#3F9C8B" />
        <path d="M220 160 C 215 175, 215 178, 210 178" pathLength={1} stroke="#3F9C8B" />
      </g>
      <g fill="#B88058">
        <circle cx="190" cy="85" r="4" />
        <circle cx="220" cy="110" r="4" />
        <circle cx="160" cy="150" r="4" />
        <circle cx="210" cy="178" r="4" />
      </g>
    </svg>
  );
}

function DataLine() {
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-sm" fill="none" aria-hidden="true">
      <g stroke="#120B07" strokeOpacity="0.12">
        {[40, 80, 120, 160, 200].map((y) => (
          <path key={y} d={`M10 ${y} H310`} />
        ))}
      </g>
      <path data-draw d="M10 190 C 50 180, 70 150, 100 160 S 150 120, 180 110 S 240 70, 270 50 S 300 30, 310 22" stroke="#985E38" strokeWidth="2.5" pathLength={1} />
      <path data-draw d="M10 200 C 60 196, 110 190, 160 170 S 260 120, 310 100" stroke="#3F9C8B" strokeWidth="1.5" strokeDasharray="4 6" pathLength={1} />
      <circle cx="310" cy="22" r="5" fill="#985E38" />
      <text x="10" y="16" fill="#120B07" fillOpacity="0.45" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="2">
        ILLUSTRATIVE
      </text>
    </svg>
  );
}

const items = [
  {
    title: "Design with purpose",
    body: "Beautiful is the baseline. Every layout, color, and word is chosen to help visitors understand you faster and take the next step with confidence.",
    visual: <DesignGrid />,
  },
  {
    title: "Search-focused thinking",
    body: "We design and write with search in mind from day one — structure, content, and speed that help the right people find you when they’re ready.",
    visual: <TypingSearch />,
  },
  {
    title: "Connected digital experiences",
    body: "Website, social, email, CRM, and automation working as one system, so every touchpoint feels consistent and every lead gets followed up.",
    visual: <Devices />,
  },
  {
    title: "Strategy informed by data",
    body: "Transparent reporting and continuous optimization. We track what matters, explain what it means, and use it to make every next decision smarter.",
    visual: <DataLine />,
  },
];

export function WhyUs() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-why]").forEach((card) => {
          const paths = card.querySelectorAll("[data-draw], [data-draw] > *");
          gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.to(paths, { strokeDashoffset: 0, duration: 1.8, stagger: 0.08, ease: "power2.inOut", scrollTrigger: { trigger: card, start: "top 70%", once: true } });
          gsap.from(card, { y: 80, autoAlpha: 0, duration: 1.3, scrollTrigger: { trigger: card, start: "top 88%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="surface-paper relative py-28 md:py-40" aria-labelledby="why-heading">
      <div className="absolute inset-0 grid-lines-dark opacity-60" aria-hidden="true" />
      <div className="shell relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="label label-dot text-copper-700">Why CleverHouse Media</p>
            <SplitHeading id="why-heading" className="mt-6 font-display text-huge font-medium text-ink">
              Creative thinking backed by <span className="serif-accent text-copper-600">real strategy.</span>
            </SplitHeading>
            <p className="mt-8 max-w-[44ch] text-lg text-ink/65">
              We believe in purposeful design. By understanding your goals, we tailor strategy to connect with your audience, drive engagement, and show you measurable progress — with a dedicated partnership along the way.
            </p>
          </div>
        </div>
        <ol className="space-y-6 lg:col-span-7">
          {items.map((it, i) => (
            <li
              key={it.title}
              data-why
              className="group relative grid gap-8 overflow-hidden rounded-[28px] bg-bone p-7 ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-[0_30px_80px_-40px_rgba(18,11,7,0.45)] md:grid-cols-2 md:p-10"
            >
              <div className="flex flex-col justify-between">
                <span className="font-mono text-sm text-copper-700">0{i + 1}</span>
                <div className="mt-10">
                  <h3 className="font-display text-[clamp(1.7rem,2.6vw,2.4rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink">{it.title}</h3>
                  <p className="mt-4 text-ink/65">{it.body}</p>
                </div>
              </div>
              <div className="flex items-center justify-center rounded-2xl bg-[#fbf8f3] p-6 ring-1 ring-ink/5">{it.visual}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
