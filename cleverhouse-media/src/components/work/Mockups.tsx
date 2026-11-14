import Image from "../ui/Img";
import { Heart, MessageCircle, Send, Bookmark, Search, MapPin, Star, Phone, Menu } from "lucide-react";
import type { Project } from "../../content/projects";
import clsx from "../../lib/clsx";

const fontFor = (s: Project["brand"]["fontStyle"]) => (s === "serif" ? "font-serif" : s === "grotesk" ? "font-display" : "font-sans");

/* -------------------------------------------------------------------------- */
/* Browser frame                                                              */
/* -------------------------------------------------------------------------- */
export function BrowserFrame({ url, children, className, dark = true }: { url: string; children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-[clamp(8px,1.2cqw,16px)] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] ring-1",
        dark ? "bg-[#1b1714] ring-white/10" : "bg-white ring-black/10",
        className,
      )}
      style={{ containerType: "inline-size" }}
    >
      <div className={clsx("flex items-center gap-[1.2cqw] px-[1.6cqw] py-[1.1cqw]", dark ? "bg-[#231e1a]" : "bg-[#f1ece5]")}>
        <span className="flex gap-[0.6cqw]">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="block h-[1cqw] w-[1cqw] min-h-[5px] min-w-[5px] rounded-full" style={{ background: c }} />
          ))}
        </span>
        <span className={clsx("mx-auto flex w-[46%] items-center justify-center gap-[0.6cqw] rounded-full py-[0.45cqw] text-[max(7px,1.15cqw)]", dark ? "bg-white/5 text-white/50" : "bg-black/5 text-black/45")}>
          {url}
        </span>
        <span className="w-[4cqw]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Phone frame                                                                */
/* -------------------------------------------------------------------------- */
export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx("relative rounded-[14cqw] bg-[#0d0a08] p-[3.2cqw] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.75)] ring-1 ring-white/10", className)}
      style={{ containerType: "inline-size" }}
    >
      <div className="relative overflow-hidden rounded-[11cqw]" style={{ aspectRatio: "9 / 19.2" }}>
        {children}
        <span className="absolute left-1/2 top-[1.6%] z-20 h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mock website (desktop)                                                     */
/* -------------------------------------------------------------------------- */
export function MockSite({ project, image }: { project: Project; image?: string }) {
  const b = project.brand;
  const f = fontFor(b.fontStyle);
  return (
    <div className="relative w-full" style={{ aspectRatio: "16 / 10", background: b.bg, color: b.fg, containerType: "inline-size" }}>
      {/* nav */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[4cqw] py-[2.4cqw]">
        <span className={clsx(f, "text-[2.3cqw] font-semibold tracking-tight")}>{b.wordmark}</span>
        <span className="hidden items-center gap-[2.6cqw] text-[1.2cqw] opacity-80 sm:flex">
          {b.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </span>
        <span className="rounded-full px-[1.8cqw] py-[0.9cqw] text-[1.15cqw] font-semibold" style={{ background: b.accent, color: b.bg }}>
          {b.cta}
        </span>
      </div>
      {/* hero */}
      <div className="absolute inset-0">
        <Image src={image || project.hero} alt="" fill sizes="(max-width: 768px) 90vw, 60vw" className="object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${b.bg} 8%, ${b.bg}cc 38%, transparent 75%)` }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${b.bg} 2%, transparent 40%)` }} />
      </div>
      <div className="absolute left-[4cqw] top-[22%] z-10 w-[46%]">
        <p className="text-[1.05cqw] uppercase tracking-[0.25em] opacity-70" style={{ color: b.accent }}>
          {project.location}
        </p>
        <p className={clsx(f, "mt-[1.4cqw] text-[5.2cqw] font-semibold leading-[0.98] tracking-[-0.03em]")}>{b.heroLine}</p>
        <p className="mt-[1.6cqw] max-w-[85%] text-[1.4cqw] leading-snug opacity-80">{b.heroSub}</p>
        <div className="mt-[2.4cqw] flex gap-[1cqw]">
          <span className="rounded-full px-[2.2cqw] py-[1.1cqw] text-[1.3cqw] font-semibold" style={{ background: b.accent, color: b.bg }}>
            {b.cta}
          </span>
          <span className="rounded-full px-[2.2cqw] py-[1.1cqw] text-[1.3cqw] ring-1" style={{ boxShadow: `inset 0 0 0 1px ${b.fg}40` }}>
            {b.nav[0]}
          </span>
        </div>
      </div>
      {/* service strip */}
      <div className="absolute inset-x-[4cqw] bottom-[4cqw] z-10 grid grid-cols-3 gap-[1.4cqw]">
        {project.approach.slice(0, 3).map((a) => (
          <div key={a.title} className="rounded-[1.2cqw] p-[1.6cqw] backdrop-blur-sm" style={{ background: `${b.fg}12`, boxShadow: `inset 0 0 0 1px ${b.fg}1f` }}>
            <span className="block h-[0.5cqw] w-[3cqw] rounded-full" style={{ background: b.accent }} />
            <p className={clsx(f, "mt-[1cqw] text-[1.4cqw] font-semibold leading-tight")}>{a.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mock website (mobile)                                                      */
/* -------------------------------------------------------------------------- */
export function MockMobile({ project, image }: { project: Project; image?: string }) {
  const b = project.brand;
  const f = fontFor(b.fontStyle);
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: b.bg, color: b.fg, containerType: "inline-size" }}>
      <div className="relative h-[58%]">
        <Image src={image || project.hero} alt="" fill sizes="240px" className="object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${b.bg} 4%, ${b.bg}55 45%, ${b.bg}40)` }} />
        <div className="absolute inset-x-0 top-[7%] flex items-center justify-between px-[7cqw]">
          <span className={clsx(f, "text-[6.4cqw] font-semibold")}>{b.wordmark}</span>
          <Menu style={{ width: "7cqw", height: "7cqw" }} />
        </div>
        <div className="absolute bottom-[4%] left-[7cqw] right-[7cqw]">
          <p className={clsx(f, "text-[10.5cqw] font-semibold leading-[0.98] tracking-[-0.03em]")}>{b.heroLine}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-[3.5cqw] px-[7cqw] pt-[4cqw]">
        <p className="text-[4cqw] leading-snug opacity-80">{b.heroSub}</p>
        <span className="rounded-full py-[3.4cqw] text-center text-[4.2cqw] font-semibold" style={{ background: b.accent, color: b.bg }}>
          {b.cta}
        </span>
        <div className="grid grid-cols-2 gap-[3cqw]">
          {project.approach.slice(0, 2).map((a) => (
            <div key={a.title} className="rounded-[3cqw] p-[3.5cqw]" style={{ background: `${b.fg}10` }}>
              <span className="block h-[1.2cqw] w-[7cqw] rounded-full" style={{ background: b.accent }} />
              <p className="mt-[2cqw] text-[3.6cqw] font-semibold leading-tight">{a.title}</p>
            </div>
          ))}
        </div>
      </div>
      {project.slug.includes("plumbing") && (
        <div className="absolute inset-x-[5cqw] bottom-[3cqw] flex items-center justify-center gap-[2cqw] rounded-full py-[3cqw] text-[4cqw] font-semibold" style={{ background: b.accent, color: b.bg }}>
          <Phone style={{ width: "4.5cqw", height: "4.5cqw" }} /> Call now — 24/7
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Social post (generic, platform-neutral)                                    */
/* -------------------------------------------------------------------------- */
export function SocialPost({ project, post, className }: { project: Project; post: Project["social"][number]; className?: string }) {
  const b = project.brand;
  const f = fontFor(b.fontStyle);
  const handle = "@" + b.wordmark.toLowerCase().replace(/[^a-z]/g, "");
  const tall = post.kind === "story";
  return (
    <figure className={clsx("overflow-hidden rounded-2xl bg-white text-[#141414] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]", className)} style={{ containerType: "inline-size" }}>
      <div className="flex items-center gap-[3cqw] px-[4cqw] py-[3cqw]">
        <span className="grid h-[9cqw] w-[9cqw] place-items-center rounded-full text-[3cqw] font-bold" style={{ background: b.accent, color: b.bg }}>
          {b.monogram}
        </span>
        <span className="text-[4cqw] font-semibold">{handle}</span>
        <span className="ml-auto text-[3.2cqw] text-black/45">{post.kind === "ad" ? "Sponsored" : post.kind === "story" ? "Story" : ""}</span>
      </div>
      <div className="relative" style={{ aspectRatio: tall ? "4 / 5" : "1 / 1" }}>
        <Image src={post.image} alt="" fill sizes="(max-width: 768px) 80vw, 320px" className="object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${b.bg}e6 0%, ${b.bg}00 55%)` }} />
        <p className={clsx(f, "absolute bottom-[6cqw] left-[6cqw] right-[6cqw] text-[7.6cqw] font-semibold leading-[1.02] tracking-[-0.02em]")} style={{ color: b.fg }}>
          {post.caption}
        </p>
      </div>
      <div className="flex items-center gap-[4cqw] px-[4cqw] py-[3.2cqw] text-black/80">
        <Heart style={{ width: "5.5cqw", height: "5.5cqw" }} />
        <MessageCircle style={{ width: "5.5cqw", height: "5.5cqw" }} />
        <Send style={{ width: "5.5cqw", height: "5.5cqw" }} />
        <Bookmark className="ml-auto" style={{ width: "5.5cqw", height: "5.5cqw" }} />
      </div>
      {post.kind === "ad" && (
        <div className="mx-[4cqw] mb-[4cqw] rounded-lg py-[2.6cqw] text-center text-[3.6cqw] font-semibold" style={{ background: b.accent, color: b.bg }}>
          {b.cta}
        </div>
      )}
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Search concept (platform-neutral)                                          */
/* -------------------------------------------------------------------------- */
export function SearchConcept({ project, className }: { project: Project; className?: string }) {
  const s = project.search;
  if (!s) return null;
  return (
    <div className={clsx("rounded-2xl bg-white p-5 text-[#1d1d1d] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] md:p-6", className)}>
      <div className="flex items-center gap-3 rounded-full px-4 py-3 ring-1 ring-black/10">
        <Search size={16} className="text-black/50" />
        <span className="text-sm">{s.query}</span>
      </div>
      {s.local && (
        <div className="mt-5 rounded-xl p-4 ring-1 ring-black/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{project.name}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-black/55">
                <Star size={12} className="fill-black/20 text-black/20" /> Reviews · {project.industry}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-black/55">
                <MapPin size={12} /> {project.location} · Open now
              </p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-black/15">Website</span>
              <span className="rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-black/15">Directions</span>
            </div>
          </div>
        </div>
      )}
      <div className="mt-5">
        <p className="text-xs text-black/50">{project.slug.replace(/-/g, "")}.com</p>
        <p className="mt-1 text-lg leading-snug text-[#1a4fb5]">{s.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-black/65">{s.snippet}</p>
      </div>
      <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-black/35">Search results concept · illustrative</p>
    </div>
  );
}
