import { useRef } from "react";
import { Search } from "lucide-react";
import { Flip } from "gsap/Flip";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);

const others = ["Competitor directory listing", "Another local business", "Generic national chain", "Outdated review site", "Unrelated blog post"];

/** Illustrative: your listing climbs the results as the section enters view. */
export function SerpClimb({ query = "the service you offer + your city" }: { query?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const list = root.current!.querySelector("ol")!;
      const you = list.querySelector("[data-you]") as HTMLElement;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const climb = () => {
        const state = Flip.getState(list.children);
        list.prepend(you);
        Flip.from(state, { duration: 1.4, ease: "expo.inOut", stagger: 0.03 });
        gsap.to(you, { backgroundColor: "rgba(226,180,138,0.16)", boxShadow: "inset 0 0 0 1px rgba(226,180,138,0.6)", duration: 0.8, delay: 1 });
      };
      if (reduce) {
        list.prepend(you);
        return;
      }
      gsap.from(root.current, { y: 40, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 85%", once: true } });
      ScrollTrigger.create({ trigger: root.current, start: "top 75%", once: true, onEnter: () => gsap.delayedCall(1.2, climb) });
    },
    { scope: root },
  );
  return (
    <div ref={root} className="rounded-[28px] bg-ink-850/90 p-5 ring-1 ring-bone/10 backdrop-blur-sm md:p-6">
      <div className="flex items-center gap-3 rounded-full bg-bone/8 px-4 py-3 ring-1 ring-bone/10">
        <Search size={16} className="text-copper-300" />
        <span className="text-sm text-bone/80">{query}</span>
      </div>
      <ol className="mt-4 space-y-2">
        {others.slice(0, 3).map((o) => (
          <li key={o} className="rounded-2xl px-4 py-3">
            <span className="block h-2 w-3/5 rounded-full bg-bone/20" />
            <span className="mt-2 block text-xs text-bone/40">{o}</span>
          </li>
        ))}
        <li data-you className="rounded-2xl px-4 py-3">
          <span className="block font-display text-[0.95rem] text-copper-200">Your Business — exactly what they searched for</span>
          <span className="mt-1 block text-xs text-bone/55">Clear services · fast site · local signals · helpful content</span>
        </li>
        {others.slice(3).map((o) => (
          <li key={o} className="rounded-2xl px-4 py-3">
            <span className="block h-2 w-2/5 rounded-full bg-bone/15" />
            <span className="mt-2 block text-xs text-bone/40">{o}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-bone/35">Illustration · not a ranking guarantee</p>
    </div>
  );
}
