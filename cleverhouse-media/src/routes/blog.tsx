import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL from the previous wearechmedia.com site — permanently redirected.
export const Route = createFileRoute("/blog")({
  beforeLoad: () => {
    throw redirect({ to: "/insights", statusCode: 301 });
  },
});
