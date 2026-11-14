import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL from the previous wearechmedia.com site — permanently redirected.
export const Route = createFileRoute("/services/")({
  beforeLoad: () => {
    throw redirect({ to: "/what-we-do", statusCode: 301 });
  },
});
