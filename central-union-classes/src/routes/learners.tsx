import { createFileRoute } from "@tanstack/react-router";
import { LearnersPage } from "../classes/pages/Learners";

export const Route = createFileRoute("/learners")({
  head: () => ({ meta: [{ title: "Learners — Central Union Online Classes" }] }),
  component: LearnersPage,
});
