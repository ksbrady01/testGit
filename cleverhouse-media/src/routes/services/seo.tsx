import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL from the previous wearechmedia.com site — permanently redirected.
export const Route = createFileRoute("/services/seo")({
  beforeLoad: () => {
    throw redirect({ to: "/seo", statusCode: 301 });
  },
});
