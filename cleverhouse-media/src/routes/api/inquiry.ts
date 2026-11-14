import { createFileRoute } from "@tanstack/react-router";
import { handleInquiry } from "@/server/inquiry.server";

export const Route = createFileRoute("/api/inquiry")({
  server: {
    handlers: {
      POST: ({ request }) => handleInquiry(request),
    },
  },
});
