import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { reportVibeError } from "../lib/vibe-error-reporting";
import Link from "../components/ui/Link";
import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { NotFound } from "../components/layout/NotFound";
import { SmoothScroll } from "../components/providers/SmoothScroll";
import { Cursor } from "../components/providers/Cursor";
import { PageTransition } from "../components/providers/PageTransition";
import { site } from "../content/site";

// Runs before first paint: decides whether the intro film plays (first visit to "/" this session)
// and whether motion-based initial states should apply.
const introGate = `(function(){var d=document.documentElement;try{var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm)d.classList.add('motion-ok');var force=/[?&]intro=1/.test(location.search);var seen=sessionStorage.getItem('chm-intro');d.setAttribute('data-intro',(location.pathname==='/'&&!rm&&(force||!seen))?'play':'skip');}catch(e){d.setAttribute('data-intro','skip');}})();`;

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/brand/chm-logo.png`,
  image: `${site.url}/brand/chm-logo.png`,
  email: site.email,
  description: site.description,
  slogan: site.philosophy,
  address: { "@type": "PostalAddress", addressRegion: site.region, addressCountry: site.country },
  areaServed: [
    { "@type": "State", name: "Texas" },
    { "@type": "Country", name: "United States" },
  ],
  knowsAbout: [
    "Web design",
    "Web development",
    "Search engine optimization",
    "Digital marketing",
    "Branding",
    "Social media marketing",
    "Marketing automation",
    "Analytics",
  ],
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@300..800&family=Space+Grotesk:wght@300..700&display=swap";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportVibeError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <section className="relative flex min-h-[80svh] items-center bg-ink">
      <div className="shell">
        <p className="label label-dot text-copper-300">Something went wrong</p>
        <h1 className="mt-6 font-display text-big font-medium">This page didn’t load.</h1>
        <p className="mt-5 max-w-[52ch] text-lead text-bone/70">
          Try again, or head back to the homepage.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            className="btn btn-copper"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <Link href="/" className="btn btn-ghost">
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#120B07" },
      { name: "color-scheme", content: "dark" },
      { title: "CleverHouse Media — We build digital experiences that drive growth" },
      { name: "description", content: site.description },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://images.unsplash.com" },
      { rel: "stylesheet", href: FONTS },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. */}
      <Outlet />
    </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introGate }} />
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll>
          <Nav />
          <main id="main" tabIndex={-1} className="outline-hidden">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        <PageTransition />
        <Cursor />
        <Scripts />
      </body>
    </html>
  );
}
