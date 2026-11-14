import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import { LegalPage } from "../components/sections/LegalPage";
import { site } from "../content/site";

const metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of the CleverHouse Media website.",
  alternates: { canonical: "/terms" },
};

// NOTE: Plain-language starting point. Have it reviewed by qualified counsel before relying on it.
function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="November 2026"
      sections={[
        { h: "Using this website", p: [`By using this website you agree to these terms. The site is operated by ${site.legalName}.`] },
        { h: "Content and intellectual property", p: ["Unless otherwise noted, the content, design, and branding on this site belong to CleverHouse Media and may not be reused without permission. The CleverHouse Media name and logo are trademarks of CleverHouse Media, LLC.", "Photography is used under license from its respective owners."] },
        { h: "Concept projects", p: ["Projects labeled “Concept Project” or “Design Demonstration” are illustrative work created by CleverHouse Media. The businesses depicted are fictional, and no client relationship, endorsement, or result is implied."] },
        { h: "No guarantees", p: ["Information on this site is provided for general purposes. Marketing and search outcomes depend on many factors outside our control, and nothing on this site is a guarantee of specific results."] },
        { h: "Links to other sites", p: ["We may link to third-party websites. We aren’t responsible for their content or practices."] },
        { h: "Limitation of liability", p: ["To the extent permitted by law, CleverHouse Media is not liable for any indirect or consequential damages arising from use of this website."] },
        { h: "Governing law", p: ["These terms are governed by the laws of the State of Texas, United States."] },
        { h: "Contact", p: [`Questions about these terms? Email ${site.email}.`] },
      ]}
    />
  );
}

export const Route = createFileRoute("/terms")({
  head: () => seo(metadata, "/terms"),
  component: TermsPage,
});
