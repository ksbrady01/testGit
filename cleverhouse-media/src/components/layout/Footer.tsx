import Link from "../site/Link";
import { useRef } from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { gsap, useGSAP } from "../../lib/gsap";
import { Logo, LogoMark } from "../brand/Logo";
import { Marquee } from "../motion/Motion";
import { Button } from "../site/Button";
import { companyNav, resourceNav, serviceNav, site } from "../../content/site";
import { projects } from "../../content/projects";

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = root.current!.querySelectorAll("[data-f-line]");
        gsap.from(lines, {
          yPercent: 100,
          duration: 1.4,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
        gsap.fromTo(
          "[data-f-mark]",
          { rotateY: -35, rotateX: 12, yPercent: 20 },
          {
            rotateY: 25,
            rotateX: -6,
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const socials = site.social.filter((s) => s.href);

  return (
    <footer
      ref={root}
      className="relative overflow-hidden bg-ink-950 text-bone"
      aria-labelledby="footer-heading"
    >
      <div className="absolute inset-0 grid-cols-lines opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-[10vw] top-[8%] w-[60vw] max-w-[760px] opacity-[0.07] perspective-distant"
        aria-hidden="true"
      >
        <div data-f-mark className="transform-3d">
          <LogoMark />
        </div>
      </div>

      <div className="border-y border-bone/10 py-6">
        <Marquee speed={50}>
          {[
            "Web Design",
            "SEO",
            "Digital Marketing",
            "Branding",
            "Social Media",
            "Digital Ecosystems",
            "AI & Automation",
            "Live Concepts",
          ].map((t) => (
            <span
              key={t}
              className="flex items-center gap-10 pr-10 font-display text-2xl tracking-tight text-bone/70 md:text-4xl"
            >
              {t}
              <span className="inline-block h-2.5 w-2.5 rotate-45 bg-copper-500" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="shell relative pt-24 md:pt-36">
        <h2 id="footer-heading" className="font-display text-giant font-medium">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-f-line className="block">
              Have something
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-f-line className="block">
              <span className="serif-accent text-copper-300">big</span> in mind?
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-f-line className="block text-copper">
              Let&apos;s make it happen.
            </span>
          </span>
        </h2>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Button href="/contact">Start Your Project</Button>
          <Button href="/website-evaluation" variant="ghost">
            Get a Website Evaluation
          </Button>
        </div>

        <div className="mt-28 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-bone/10 pt-14 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="block w-[200px]" aria-label="CleverHouse Media — home">
              <Logo variant="light" />
            </Link>
            <p className="mt-6 max-w-sm text-bone/65">
              A Texas-based creative and technical growth partner. We build digital stories that
              make a difference — websites, search, marketing, and connected ecosystems that help
              brands grow.
            </p>
            <ul className="mt-8 space-y-3 text-bone/80">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="group inline-flex items-center gap-3 link-line"
                >
                  <Mail size={16} className="text-copper-400" aria-hidden="true" /> {site.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-3">
                <MapPin size={16} className="text-copper-400" aria-hidden="true" /> {site.location}
              </li>
            </ul>
          </div>
          <FooterCol title="Services" links={serviceNav} className="md:col-span-3" />
          <FooterCol
            title="Work"
            links={[
              { label: "All Work", href: "/work" },
              { label: "Case Studies", href: "/case-studies" },
              ...projects.map((p) => ({ label: p.name, href: `/work/${p.slug}` })),
            ]}
            className="md:col-span-2"
          />
          <div className="col-span-2 grid grid-cols-2 gap-6 md:col-span-3 md:grid-cols-1">
            <FooterCol title="Company" links={companyNav} />
            <FooterCol title="Resources" links={resourceNav.filter((r) => r.href !== "/process")} />
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-bone/10 py-8 text-sm text-bone/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          {socials.length > 0 && (
            <ul className="flex gap-6">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-line hover:text-bone"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="link-line hover:text-bone">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="link-line hover:text-bone">
                Terms
              </Link>
            </li>
            <li>
              <a href="/sitemap.xml" className="link-line hover:text-bone" data-no-transition>
                Sitemap
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  className,
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="label text-copper-300">{title}</p>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-1.5 text-bone/70 transition-colors hover:text-bone"
            >
              <span className="link-line">{l.label}</span>
              <ArrowUpRight
                size={12}
                className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
