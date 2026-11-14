export const site = {
  name: "CleverHouse Media",
  legalName: "CleverHouse Media, LLC",
  shortName: "CHM",
  url: (import.meta.env.VITE_SITE_URL || "https://www.wearechmedia.com").replace(/\/$/, ""),
  email: "hello@chmedia.com",
  location: "Texas, United States",
  region: "TX",
  country: "US",
  headline: "We build digital experiences that drive growth.",
  description:
    "A Texas-based digital agency specializing in strategic web design, comprehensive SEO, and data-driven marketing campaigns that connect you with your ideal audience.",
  philosophy: "We build digital stories that make a difference.",
  // Add real profile URLs here when ready. Empty entries are hidden automatically.
  social: [
    { label: "Instagram", href: "" },
    { label: "LinkedIn", href: "" },
    { label: "Facebook", href: "" },
    { label: "YouTube", href: "" },
  ] as { label: string; href: string }[],
};

export type NavItem = { label: string; href: string; description?: string };

export const primaryNav: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "SEO", href: "/seo" },
  { label: "Digital Marketing", href: "/digital-marketing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const serviceNav: NavItem[] = [
  {
    label: "Web Design & Development",
    href: "/services/web-design-development",
    description: "Custom, conversion-minded websites",
  },
  { label: "SEO & Search Visibility", href: "/seo", description: "Help the right people find you" },
  {
    label: "Digital Marketing",
    href: "/digital-marketing",
    description: "Campaigns that connect and convert",
  },
  {
    label: "Branding & Creative",
    href: "/services/branding-creative",
    description: "Identity, content, and storytelling",
  },
  {
    label: "Social Media Strategy",
    href: "/services/social-media",
    description: "Presence with a point of view",
  },
  {
    label: "Digital Ecosystems",
    href: "/services/digital-ecosystems",
    description: "Platforms that work as one",
  },
  {
    label: "AI & Automation",
    href: "/services/ai-automation",
    description: "Smarter workflows, faster follow-up",
  },
  {
    label: "Live Concepts",
    href: "/live-concepts",
    description: "Livestreams, launches, virtual events",
  },
];

export const resourceNav: NavItem[] = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "Website Evaluation", href: "/website-evaluation" },
  { label: "SEO Evaluation", href: "/seo-evaluation" },
  { label: "Our Process", href: "/process" },
  { label: "Insights", href: "/insights" },
];

export const companyNav: NavItem[] = [
  { label: "About CleverHouse", href: "/about" },
  { label: "Our Process", href: "/process" },
  { label: "Hosting & Security", href: "/hosting-security" },
  { label: "Support", href: "/support" },
  { label: "Careers", href: "/careers" },
];

export const serviceInterestOptions = [
  "Website design & development",
  "SEO & search visibility",
  "Digital marketing",
  "Branding & creative",
  "Social media",
  "Digital ecosystems & automation",
  "Live concepts & virtual events",
  "Not sure yet",
] as const;

export const budgetOptions = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $40k",
  "$40k+",
  "Monthly retainer",
  "Not sure yet",
] as const;

export const timelineOptions = [
  "As soon as possible",
  "1–3 months",
  "3–6 months",
  "Just exploring",
] as const;
