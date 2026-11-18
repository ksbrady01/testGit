import { createFileRoute } from "@tanstack/react-router";
import { CertificatePage } from "../../classes/pages/Certificate";

export const Route = createFileRoute("/certificate/$courseId")({
  head: () => ({ meta: [{ title: "Certificate — Central Union Online Classes" }] }),
  component: Page,
});

function Page() {
  const { courseId } = Route.useParams();
  return <CertificatePage courseId={courseId} />;
}
