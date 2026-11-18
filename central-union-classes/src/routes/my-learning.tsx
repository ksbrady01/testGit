import { createFileRoute } from "@tanstack/react-router";
import { MyLearningPage } from "../classes/pages/MyLearning";

export const Route = createFileRoute("/my-learning")({
  head: () => ({ meta: [{ title: "My learning — Central Union Online Classes" }] }),
  component: MyLearningPage,
});
