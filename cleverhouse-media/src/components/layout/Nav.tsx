import Link from "../ui/Link";
import Image from "../ui/Img";
import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { gsap, useGSAP } from "../../lib/gsap";
import { Logo, LogoMark } from "../brand/Logo";
import { primaryNav, serviceNav, resourceNav, site } from "../../content/site";
import { img } from "../../content/images";
import clsx from "../../lib/clsx";
import type Lenis from "lenis";

const lenis = () => (typeof window !== "undefined" ? (window as unknown as { __lenis?: Lenis }).__lenis : undefined);

export function Nav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const megaTimer = useRef<number>(0);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 400);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMega(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onNav = () => {
      setMega(false);
      setOpen(false);
    };
    document.addEventListener("chm:navigate", onNav);
    return () => document.removeEventListener("chm:navigate", onNav);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      lenis()?.stop();
      document.body.style.overflow = "hidden";
    } else {
      if (document.documentElement.dataset.intro !== "play") lenis()?.start();
      document.body.style.overflow = "";
    }
  }, [open]);

  // Entrance after intro
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = header.current!.querySelectorAll("[data-nav-item]");
        const play = () => gsap.fromTo(items, { y: -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 1, ease: "expo.out", delay: 0.1 });
        if (document.documentElement.dataset.intro === "play") {
          gsap.set(items, { autoAlpha: 0 });
          document.addEventListener("chm:intro-done", play, { once: true });
          return () => document.removeEventListener("chm:intro-done", play);
        }
        return undefined;
      });
      return () => mm.revert();
    },
    { scope: header },
  );

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));
  const servicesActive = serviceNav.some((s) => isActive(s.href)) || isActive("/what-we-do");

  const openMega = () => {
    window.clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    megaTimer.current = window.setTimeout(() => setMega(false), 160);
  };

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-10001 focus:rounded-full focus:bg-copper-300 focus:px-5 focus:py-3 focus:text-ink">
        Skip to content
      </a>
      <header
        ref={header}
        className={clsx(
          "fixed inset-x-0 top-0 z-900 transition-transform duration-700 ease-out-expo",
          hidden && !mega && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="shell pt-3 md:pt-4">
          <nav
            aria-label="Primary"
            className={clsx(
              "relative flex h-[60px] items-center justify-between rounded-full pl-5 pr-2 transition-all duration-500 md:h-[64px] md:pl-6",
              (scrolled || mega) && !open ? "glass shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] ring-1 ring-bone/10" : "bg-transparent",
            )}
          >
            <Link href="/" data-nav-item aria-label="CleverHouse Media — home" className="relative z-10 block w-[150px] shrink-0 sm:w-[178px]">
              <Logo variant="light" priority />
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {primaryNav.map((item) =>
                item.href === "/what-we-do" ? (
                  <li key={item.href} data-nav-item onMouseEnter={openMega} onMouseLeave={closeMega} className="relative">
                    <button
                      type="button"
                      aria-expanded={mega}
                      aria-controls="mega-menu"
                      onClick={() => setMega((m) => !m)}
                      className={clsx(
                        "group flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[0.9rem] transition-colors xl:px-4",
                        servicesActive ? "text-copper-300" : "text-bone/80 hover:text-bone",
                      )}
                    >
                      {item.label}
                      <Plus size={14} className={clsx("transition-transform duration-500", mega && "rotate-45")} aria-hidden="true" />
                    </button>
                  </li>
                ) : (
                  <li key={item.href} data-nav-item className={item.href === "/seo" || item.href === "/digital-marketing" ? "hidden xl:block" : undefined}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={clsx(
                        "relative whitespace-nowrap rounded-full px-3 py-2 text-[0.9rem] transition-colors xl:px-4",
                        isActive(item.href) ? "text-copper-300" : "text-bone/80 hover:text-bone",
                      )}
                    >
                      {item.label}
                      {isActive(item.href) && <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-copper-400" />}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="flex items-center gap-2" data-nav-item>
              <Link href="/contact" className="btn btn-copper hidden whitespace-nowrap px-5! py-3! text-[0.9rem]! sm:inline-flex">
                <span className="relative">Start a Project</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative z-1001 grid h-12 w-12 place-items-center rounded-full bg-bone/10 ring-1 ring-bone/15 transition-colors hover:bg-bone/20 lg:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span className={clsx("absolute left-0 h-[1.5px] w-5 bg-bone transition-all duration-500 ease-out-expo", open ? "top-1.5 rotate-45" : "top-0")} />
                  <span className={clsx("absolute left-0 h-[1.5px] bg-bone transition-all duration-500 ease-out-expo", open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3")} />
                </span>
              </button>
            </div>

            {/* Mega menu */}
            <div
              id="mega-menu"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className={clsx(
                "absolute inset-x-0 top-[calc(100%+10px)] hidden overflow-hidden rounded-[28px] bg-ink-850/95 ring-1 ring-bone/10 backdrop-blur-xl transition-all duration-500 ease-out-expo lg:block",
                mega ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0",
              )}
            >
              <div className="grid grid-cols-12 gap-6 p-6">
                <div className="col-span-4 flex flex-col justify-between rounded-2xl bg-ink p-6 ring-1 ring-bone/5">
                  <div>
                    <p className="label text-copper-300">What we do</p>
                    <p className="mt-4 font-display text-3xl leading-[1.05] tracking-tight">
                      Creative thinking, <span className="serif-accent text-copper-300">built</span> into every channel.
                    </p>
                  </div>
                  <Link href="/what-we-do" className="mt-8 inline-flex items-center gap-2 text-sm text-copper-200 link-line w-fit" tabIndex={mega ? 0 : -1}>
                    Explore all services <ArrowUpRight size={14} />
                  </Link>
                </div>
                <ul className="col-span-5 grid grid-cols-1 gap-1">
                  {serviceNav.map((s) => (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        tabIndex={mega ? 0 : -1}
                        className={clsx(
                          "group flex items-baseline justify-between rounded-xl px-4 py-2.5 transition-colors hover:bg-bone/5",
                          isActive(s.href) && "bg-bone/5",
                        )}
                      >
                        <span className="font-display text-[1.05rem] tracking-tight group-hover:text-copper-200">{s.label}</span>
                        <span className="text-xs text-bone/45">{s.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="col-span-3 flex flex-col gap-3">
                  <div className="relative min-h-[150px] flex-1 overflow-hidden rounded-2xl">
                    <Image src={img.thinkerGlasses} alt="" fill sizes="300px" className="object-cover duotone" />
                    <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/30 to-transparent" />
                    <div className="absolute bottom-0 p-4">
                      <p className="label text-copper-200">Free evaluations</p>
                    </div>
                  </div>
                  {resourceNav.slice(1, 3).map((r) => (
                    <Link key={r.href} href={r.href} tabIndex={mega ? 0 : -1} className="flex items-center justify-between rounded-xl bg-bone/5 px-4 py-3 text-sm hover:bg-bone/10">
                      {r.label} <ArrowUpRight size={14} className="text-copper-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <MobileMenu open={open} isActive={isActive} />
    </>
  );
}

function MobileMenu({ open, isActive }: { open: boolean; isActive: (h: string) => boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = root.current!;
      tl.current = gsap
        .timeline({ paused: true })
        .set(el, { visibility: "visible" })
        .fromTo(el, { clipPath: "circle(0% at calc(100% - 44px) 44px)" }, { clipPath: "circle(150% at calc(100% - 44px) 44px)", duration: 0.9, ease: "expo.inOut" })
        .from(el.querySelectorAll("[data-m-link]"), { yPercent: 110, duration: 0.9, stagger: 0.05, ease: "expo.out" }, "-=0.45")
        .from(el.querySelectorAll("[data-m-fade]"), { autoAlpha: 0, y: 20, stagger: 0.05, duration: 0.6 }, "-=0.6")
        .from(el.querySelector("[data-m-mark]"), { autoAlpha: 0, rotate: -12, scale: 0.8, duration: 1.2 }, "-=1");
    },
    { scope: root },
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      window.setTimeout(() => root.current?.querySelector<HTMLElement>("a")?.focus(), 400);
    } else tl.current.timeScale(1.6).reverse();
  }, [open]);

  const links = [{ label: "Home", href: "/" }, ...primaryNav];

  return (
    <div
      ref={root}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-880 overflow-y-auto bg-ink lg:hidden"
    >
      <div className="absolute inset-0 grid-lines opacity-50" />
      <div data-m-mark className="pointer-events-none absolute -bottom-16 -right-20 w-[85vw] max-w-[520px] opacity-[0.08]">
        <LogoMark />
      </div>
      <div className="shell relative flex min-h-full flex-col pb-10 pt-28">
        <ul className="space-y-1">
          {links.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <Link
                data-m-link
                href={l.href}
                className={clsx(
                  "flex items-baseline gap-4 py-1 font-display text-[clamp(2.4rem,11vw,4.5rem)] font-medium leading-none tracking-[-0.04em]",
                  isActive(l.href) ? "text-copper-300" : "text-bone",
                )}
              >
                <span className="font-mono text-xs tracking-[0.2em] text-copper-400">0{i + 1}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div data-m-fade className="mt-10">
          <p className="label text-bone/50">Services</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {serviceNav.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="chip text-sm text-bone/85">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div data-m-fade className="mt-auto flex flex-col gap-4 pt-12">
          <Link href="/contact" className="btn btn-copper w-full">
            <span className="relative">Start a Project</span>
          </Link>
          <a href={`mailto:${site.email}`} className="text-center text-bone/70">
            {site.email}
          </a>
        </div>
      </div>
    </div>
  );
}
