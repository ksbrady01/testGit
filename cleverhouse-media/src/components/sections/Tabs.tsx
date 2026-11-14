import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import clsx from "@/lib/clsx";

export type TabItem = { label: string; title: string; body: string; points: string[]; result?: string };

/** Accessible vertical tabs with an animated panel swap (WAI-ARIA tabs pattern). */
export function Tabs({ items, light = false }: { items: TabItem[]; light?: boolean }) {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !panel.current) return;
      gsap.fromTo(panel.current.querySelectorAll("[data-tab-anim]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.8, ease: "expo.out" });
    },
    { dependencies: [active] },
  );

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % items.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + items.length) % items.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = items.length - 1;
    else return;
    e.preventDefault();
    setActive(n);
    tabs.current[n]?.focus();
  };

  const it = items[active];
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div role="tablist" aria-orientation="vertical" aria-label="Topics" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:col-span-4 lg:mx-0 lg:flex-col lg:px-0">
        {items.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={clsx(
              "group flex shrink-0 items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-500 ease-out-expo",
              active === i ? (light ? "bg-ink text-bone" : "bg-copper-300 text-ink") : light ? "text-ink/60 hover:bg-ink/5" : "text-bone/60 hover:bg-bone/5",
            )}
          >
            <span className="font-mono text-xs opacity-60">{String(i + 1).padStart(2, "0")}</span>
            <span className="whitespace-nowrap font-display text-lg tracking-tight lg:text-xl">{t.label}</span>
          </button>
        ))}
      </div>
      <div
        ref={panel}
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
        className={clsx("rounded-[32px] p-8 md:p-12 lg:col-span-8", light ? "bg-white ring-1 ring-ink/10" : "bg-ink-850 ring-1 ring-bone/10")}
      >
        <h3 data-tab-anim className={clsx("font-display text-big font-medium", light && "text-ink")}>
          {it.title}
        </h3>
        <p data-tab-anim className={clsx("mt-6 max-w-[60ch] text-lg", light ? "text-ink/70" : "text-bone/70")}>
          {it.body}
        </p>
        <ul data-tab-anim className="mt-8 grid gap-3 sm:grid-cols-2">
          {it.points.map((p) => (
            <li key={p} className={clsx("flex items-start gap-3", light ? "text-ink/80" : "text-bone/85")}>
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper-400" />
              {p}
            </li>
          ))}
        </ul>
        {it.result && (
          <p data-tab-anim className={clsx("mt-10 border-t pt-6 font-serif text-2xl italic", light ? "border-ink/10 text-copper-700" : "border-bone/10 text-copper-200")}>
            {it.result}
          </p>
        )}
      </div>
    </div>
  );
}
