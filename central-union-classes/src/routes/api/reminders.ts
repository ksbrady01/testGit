import { createFileRoute } from "@tanstack/react-router";
import { handleReminder } from "../../server/reminders.server";

export const Route = createFileRoute("/api/reminders")({
  server: {
    handlers: {
      POST: ({ request }) => handleReminder(request),
    },
  },
});
