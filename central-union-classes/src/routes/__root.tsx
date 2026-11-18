import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { reportVibeError } from "../lib/vibe-error-reporting";
import { AppProvider } from "../classes/state/AppProvider";
import { Shell } from "../classes/components/Shell";
import { NotFound } from "../classes/components/CourseBits";
import { ORG } from "../classes/constants";

// Runs before first paint so the saved light/dark theme never flashes.
const themeGate = `(function(){try{var t=localStorage.getItem('cu-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const FONTS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600;700&display=swap";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportVibeError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="card empty page">
      <h3>This page didn't load.</h3>
      <p className="muted">Try again, or head back to the class catalog.</p>
      <div className="row" style={{ justifyContent: "center" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            void router.invalidate();
            reset();
          }}
        >
          Try again
        </button>
        <Link to="/" className="btn btn-ghost">
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1B2F6B" },
      { title: "Central Union Online Classes" },
      {
        name: "description",
        content: `Online classes from ${ORG}: Bible study, faith foundations, serving and leadership. Track your progress and earn certificates.`,
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
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
      <AppProvider>
        <Shell>
          {/* Required: nested routes render here. */}
          <Outlet />
        </Shell>
      </AppProvider>
    </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeGate }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <canvas id="confetti" aria-hidden="true" />
        <Scripts />
      </body>
    </html>
  );
}
