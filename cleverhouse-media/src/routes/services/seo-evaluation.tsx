import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL from the previous wearechmedia.com site — permanently redirected.
export const Route = createFileRoute("/services/seo-evaluation")({
  beforeLoad: () => {
    throw redirect({ to: "/seo-evaluation", statusCode: 301 });
  },
});
