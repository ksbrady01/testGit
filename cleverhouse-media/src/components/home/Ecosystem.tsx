import { lazyClient } from "../../lib/lazyClient";
import Link from "../ui/Link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "../../lib/gsap";
import { canUseWebGL } from "../../lib/webgl";
import { SplitHeading } from "../motion/Motion";
import { LogoMark } from "../brand/Logo";
import { ecosystemNodes } from "../../content/services";
import clsx from "../../lib/clsx";

const EcosystemScene = lazyClient(() => import("../three/EcosystemScene"));

/** SVG fallback diagram (no WebGL / reduced motion). */
function EcosystemFallback({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const pts = ecosystemNodes.map((_, i) => {
    const a = (i / ecosystemNodes.length) * Math.PI * 2 - Math.PI / 2;
    return [300 + Math.cos(a) * 220, 230 + Math.sin(a) * 160] as const;
  });
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 600 460" className="h-full w-full" aria-hidden="true">
        {pts.map(([x, y], i) => (
          <line key={i} x1={300} y1={230} x2={x} y2={y} stroke={i === active ? "#9BD8CB" : "#B88058"} strokeOpacity={i === active ? 0.9 : 0.35} />
        ))}
        {pts.map(([x, y], i) => {
          const [nx, ny] = pts[(i + 1) % pts.length] ?? [x, y];
          return <line key={`r${i}`} x1={x} y1={y} x2={nx} y2={ny} stroke="#F4EDE4" strokeOpacity={0.08} />;
        })}
        {pts.map(([x, y], i) => (
          <g key={`n${i}`} onClick={() => onSelect(i)} className="cursor-pointer">
            <circle cx={x} cy={y} r={i === active ? 14 : 10} fill={i === active ? "#9BD8CB" : "#B88058"} />
            <text x={x} y={y + 34} textAnchor="middle" fill="#F4EDE4" fontSize="15" fontFamily="var(--font-display)">
              {ecosystemNodes[i]?.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="pointer-events-none absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2">
        <LogoMark />
      </div>
    </div>
  );
}

export function Ecosystem() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [auto, setAuto] = useState(true);
  useEffect(() => setWebgl(canUseWebGL()), []);

  // Gentle auto-cycle until the visitor interacts
  useEffect(() => {
    if (!auto) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % ecosystemNodes.length), 3200);
    return () => window.clearInterval(id);
  }, [auto]);

  const select = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-eco-item]", { x: -40, autoAlpha: 0, stagger: 0.07, duration: 1.1, scrollTrigger: { trigger: root.current, start: "top 60%", once: true } });
        gsap.from("[data-eco-stage]", { scale: 0.85, autoAlpha: 0, duration: 1.8, scrollTrigger: { trigger: root.current, start: "top 60%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink-950 py-28 md:py-40" aria-labelledby="eco-heading">
      <div className="absolute inset-0 grid-lines opacity-50" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, rgba(63,156,139,0.25), transparent 60%)" }} aria-hidden="true" />
      <div className="shell relative">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="label label-dot text-copper-300 md:col-span-3">Digital ecosystems</p>
          <div className="md:col-span-9">
            <SplitHeading id="eco-heading" className="font-display text-huge font-medium">
              Everything connected. <span className="serif-accent text-verdigris-300">Everything working smarter.</span>
            </SplitHeading>
            <p className="mt-8 max-w-[58ch] text-lead text-bone/70">
              Stop working in silos. We design and integrate digital environments where your website, CRM, marketing tools, and analytics work together in harmony — a frictionless experience for your team and your customers.
            </p>
          </div>
        </div>

        <div className="mt-16 grid items-center gap-10 lg:mt-24 lg:grid-cols-12">
          <ul className="space-y-2 lg:col-span-4" aria-label="Ecosystem platforms">
            {ecosystemNodes.map((n, i) => (
              <li key={n.id} data-eco-item>
                <button
                  type="button"
                  onClick={() => select(i)}
                  onMouseEnter={() => select(i)}
                  aria-pressed={active === i}
                  className={clsx(
                    "group w-full rounded-2xl px-5 py-4 text-left transition-all duration-500 ease-out-expo",
                    active === i ? "bg-bone/8 ring-1 ring-verdigris-400/40" : "hover:bg-bone/5",
                  )}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-4">
                      <span className={clsx("h-2.5 w-2.5 rounded-full transition-colors", active === i ? "bg-verdigris-300" : "bg-copper-500")} />
                      <span className="font-display text-xl tracking-tight md:text-2xl">{n.label}</span>
                    </span>
                    <span className="font-mono text-xs text-bone/40">0{i + 1}</span>
                  </span>
                  <span className={clsx("grid transition-all duration-500 ease-out-expo", active === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <span className="overflow-hidden">
                      <span className="block pl-[1.65rem] pt-2 text-bone/65">{n.detail}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div data-eco-stage className="relative aspect-4/3 lg:col-span-8">
            {webgl === true && <EcosystemScene nodes={ecosystemNodes} active={active} onSelect={select} className="absolute inset-0" />}
            {webgl === false && <EcosystemFallback active={active} onSelect={select} />}
            <div className="absolute bottom-0 right-0 flex items-center gap-3 rounded-full bg-ink/70 px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-verdigris-300 ring-1 ring-verdigris-400/30 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-verdigris-300" /> System connected · data flowing
            </div>
          </div>
        </div>

        <div className="mt-14 flex justify-center lg:justify-start">
          <Link href="/services/digital-ecosystems" className="group inline-flex items-center gap-3 font-display text-lg">
            <span className="link-line">Explore digital ecosystems</span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-verdigris-300 text-ink transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
