import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL from the previous wearechmedia.com site — permanently redirected.
export const Route = createFileRoute("/portfolio")({
  beforeLoad: () => {
    throw redirect({ to: "/work", statusCode: 301 });
  },
});
