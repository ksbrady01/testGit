import { site } from "../content/site";

type PageMeta = {
  title: string | { absolute: string };
  description?: string;
  alternates?: { canonical?: string };
  openGraph?: { images?: { url: string }[]; type?: string };
};

const DEFAULT_OG = "/og.png";

/** Builds the route `head` (title, description, canonical, Open Graph, Twitter) from page metadata. */
export function seo(m: PageMeta, path: string) {
  const title = typeof m.title === "string" ? `${m.title} — ${site.name}` : m.title.absolute;
  const description = m.description || site.description;
  const canonical = `${site.url}${m.alternates?.canonical || path}`;
  const rawImage = m.openGraph?.images?.[0]?.url || DEFAULT_OG;
  const image = rawImage.startsWith("http") ? rawImage : `${site.url}${rawImage}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: m.openGraph?.type || "website" },
      { property: "og:site_name", content: site.name },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:image", content: image },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}
