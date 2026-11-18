import { createFileRoute } from "@tanstack/react-router";
import { PlayerPage } from "../../classes/pages/Player";

export const Route = createFileRoute("/learn/$courseId")({
  head: () => ({ meta: [{ title: "Lesson — Central Union Online Classes" }] }),
  component: Page,
});

function Page() {
  const { courseId } = Route.useParams();
  return <PlayerPage courseId={courseId} />;
}
