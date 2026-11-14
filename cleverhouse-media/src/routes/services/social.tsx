import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL from the previous wearechmedia.com site — permanently redirected.
export const Route = createFileRoute("/services/social")({
  beforeLoad: () => {
    throw redirect({ to: "/services/social-media", statusCode: 301 });
  },
});
