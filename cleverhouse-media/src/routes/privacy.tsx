import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import { LegalPage } from "../components/sections/LegalPage";
import { site } from "../content/site";

const metadata = {
  title: "Privacy Policy",
  description: "How CleverHouse Media collects, uses, and protects information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

// NOTE: Plain-language starting point. Have it reviewed by qualified counsel before relying on it.
function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 2026"
      sections={[
        { h: "Who we are", p: [`${site.legalName} (“CleverHouse Media,” “we,” “us”) is a digital agency based in Texas, United States. This policy explains how we handle information collected through this website.`] },
        {
          h: "Information you give us",
          p: [
            "When you submit a form — for example to start a project, request a website or SEO evaluation, or introduce yourself for a role — we collect the details you provide, such as your name, email address, company, website, phone number, and message.",
            "We use this information only to respond to your request, provide the services you ask about, and keep a record of our conversation.",
          ],
        },
        {
          h: "Information collected automatically",
          p: [
            "Like most websites, our hosting provider may log basic technical information such as IP address, browser type, and pages visited for security and performance purposes.",
            "If we use analytics tools, we configure them to understand how the site is used in aggregate. We do not sell personal information.",
          ],
        },
        { h: "Cookies and local storage", p: ["This site stores a small session flag in your browser so the introduction animation only plays once per visit. It contains no personal information."] },
        { h: "How we share information", p: ["We share information only with service providers who help us operate this website and respond to inquiries (for example email delivery or hosting providers), and only as needed for those purposes, or when required by law."] },
        { h: "Retention and security", p: ["We keep inquiry information for as long as needed to respond and maintain business records, and we use reasonable safeguards to protect it. No method of transmission or storage is completely secure."] },
        { h: "Your choices", p: [`You can ask us to access, correct, or delete the personal information you’ve submitted by emailing ${site.email}.`] },
        { h: "Changes and contact", p: [`We may update this policy from time to time. Questions? Contact us at ${site.email}.`] },
      ]}
    />
  );
}

export const Route = createFileRoute("/privacy")({
  head: () => seo(metadata, "/privacy"),
  component: PrivacyPage,
});
