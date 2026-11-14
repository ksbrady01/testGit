import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL from the previous wearechmedia.com site — permanently redirected.
export const Route = createFileRoute("/services/content")({
  beforeLoad: () => {
    throw redirect({ to: "/services/branding-creative", statusCode: 301 });
  },
});
