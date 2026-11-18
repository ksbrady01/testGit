import { createFileRoute } from "@tanstack/react-router";
import { ExplorePage } from "../classes/pages/Explore";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Explore classes — Central Union Online Classes" }] }),
  component: ExplorePage,
});
