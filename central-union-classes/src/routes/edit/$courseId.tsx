import { createFileRoute } from "@tanstack/react-router";
import { EditorPage } from "../../classes/pages/Editor";

export const Route = createFileRoute("/edit/$courseId")({
  head: () => ({ meta: [{ title: "Edit class — Central Union Online Classes" }] }),
  component: Page,
});

function Page() {
  const { courseId } = Route.useParams();
  return <EditorPage courseId={courseId} />;
}
