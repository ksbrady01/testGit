import Image from "../ui/Img";
import { useEffect, useState } from "react";

/** A "live broadcast" frame: REC indicator, running timecode, lower-third. Decorative. */
export function BroadcastFrame({ image, title = "Product launch · Live", subtitle = "Streaming to web, social & in-room" }: { image: string; title?: string; subtitle?: string }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setT((x) => x + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  const tc = (n: number) => String(n).padStart(2, "0");
  const time = `00:${tc(Math.floor(t / 60) % 60)}:${tc(t % 60)}`;
  return (
    <div className="relative aspect-16/10 overflow-hidden rounded-[28px] ring-1 ring-bone/15" aria-hidden="true">
      <Image src={image} alt="" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-ink/30" />
      {/* corner brackets */}
      {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "left-4 bottom-4 border-l border-b", "right-4 bottom-4 border-r border-b"].map((c) => (
        <span key={c} className={`absolute h-6 w-6 border-bone/60 ${c}`} />
      ))}
      <div className="absolute left-7 top-7 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 backdrop-blur-sm">
        <span className="relative grid h-2.5 w-2.5 place-items-center">
          <span className="absolute h-2.5 w-2.5 animate-pulse-ring rounded-full bg-[#ff5a4f]" />
          <span className="h-2 w-2 rounded-full bg-[#ff5a4f]" />
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone">Live</span>
      </div>
      <span className="absolute right-7 top-7 font-mono text-xs text-bone/80">{time}</span>
      <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4">
        <div className="border-l-2 border-copper-400 bg-ink/70 px-4 py-2.5 backdrop-blur-sm">
          <p className="font-display text-base text-bone md:text-lg">{title}</p>
          <p className="text-xs text-bone/65">{subtitle}</p>
        </div>
        <div className="hidden items-end gap-1 sm:flex">
          {[8, 14, 10, 18, 12, 16, 9].map((h, i) => (
            <span key={i} className="w-1 animate-pulse rounded-full bg-verdigris-300" style={{ height: h, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
