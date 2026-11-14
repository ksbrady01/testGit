import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL from the previous wearechmedia.com site — permanently redirected.
export const Route = createFileRoute("/services/web-design")({
  beforeLoad: () => {
    throw redirect({ to: "/services/web-design-development", statusCode: 301 });
  },
});
