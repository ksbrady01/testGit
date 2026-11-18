import { createFileRoute } from "@tanstack/react-router";
import { EditorPage } from "../classes/pages/Editor";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Create a class — Central Union Online Classes" }] }),
  component: () => <EditorPage />,
});
