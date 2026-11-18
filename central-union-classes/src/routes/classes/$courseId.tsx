import { createFileRoute } from "@tanstack/react-router";
import { CourseDetailPage } from "../../classes/pages/CourseDetail";

export const Route = createFileRoute("/classes/$courseId")({
  head: () => ({ meta: [{ title: "Class — Central Union Online Classes" }] }),
  component: Page,
});

function Page() {
  const { courseId } = Route.useParams();
  return <CourseDetailPage courseId={courseId} />;
}
