import { img } from "./images";

export type Service = {
  id: string;
  index: string;
  title: string;
  short: string;
  href: string;
  image: string;
  summary: string;
  points: string[];
};

/** The six primary services featured across the site. */
export const services: Service[] = [
  {
    id: "web",
    index: "01",
    title: "Web Design & Development",
    short: "Websites",
    href: "/services/web-design-development",
    image: img.studioTeam,
    summary:
      "Custom, responsive websites designed around your customers and engineered to convert — fast, accessible, and easy for your team to manage.",
    points: [
      "Custom UI/UX design",
      "Responsive development",
      "E-commerce",
      "CMS integration",
      "Conversion optimization",
    ],
  },
  {
    id: "seo",
    index: "02",
    title: "SEO & Search Visibility",
    short: "SEO",
    href: "/seo",
    image: img.thinkerWoman,
    summary:
      "Help the right people find you. Keyword strategy, technical SEO, local search, and content that answers what your customers are really asking.",
    points: [
      "Keyword strategy",
      "Local SEO",
      "Technical SEO",
      "On-page optimization",
      "Search-focused content",
    ],
  },
  {
    id: "marketing",
    index: "03",
    title: "Digital Marketing",
    short: "Marketing",
    href: "/digital-marketing",
    image: img.stickyWall,
    summary:
      "Data-driven campaigns that connect message, audience, and action — across search, social, email, and the landing pages that turn interest into leads.",
    points: [
      "Campaign strategy",
      "Paid search & social",
      "Email marketing",
      "Landing pages",
      "Analytics & optimization",
    ],
  },
  {
    id: "brand",
    index: "04",
    title: "Branding & Creative",
    short: "Branding",
    href: "/services/branding-creative",
    image: img.chefPlating,
    summary:
      "Identity systems, messaging, and content that make your brand unmistakable — and consistent everywhere people meet it.",
    points: [
      "Visual identity",
      "Messaging & story",
      "Content creation",
      "Photography direction",
      "Brand guidelines",
    ],
  },
  {
    id: "social",
    index: "05",
    title: "Social Media Strategy",
    short: "Social",
    href: "/services/social-media",
    image: img.community,
    summary:
      "A social presence with a point of view: planning, creative, community, and campaigns that build real relationships with your audience.",
    points: [
      "Channel strategy",
      "Content calendars",
      "Creative production",
      "Community management",
      "Social campaigns",
    ],
  },
  {
    id: "ecosystems",
    index: "06",
    title: "Digital Ecosystems & Automation",
    short: "Ecosystems",
    href: "/services/digital-ecosystems",
    image: img.studioPod,
    summary:
      "Stop working in silos. We connect your website, CRM, marketing tools, and analytics — and add AI and automation where it saves real time.",
    points: [
      "Platform integration",
      "CRM & marketing automation",
      "AI assistants & workflows",
      "Analytics & dashboards",
      "Scalable architecture",
    ],
  },
];

export const ecosystemNodes = [
  {
    id: "website",
    label: "Website",
    detail: "Your home base — where stories, services, and conversions live.",
  },
  {
    id: "seo",
    label: "SEO",
    detail: "Organic visibility that brings high-intent visitors to the right pages.",
  },
  {
    id: "social",
    label: "Social",
    detail: "Community, conversation, and brand presence where people spend time.",
  },
  {
    id: "crm",
    label: "CRM",
    detail: "Every lead and customer in one place, with a full relationship history.",
  },
  {
    id: "automation",
    label: "Automation",
    detail: "Follow-ups, nurture, and handoffs that happen on time — every time.",
  },
  {
    id: "analytics",
    label: "Analytics",
    detail: "Measurable insight into what works, so every next move is smarter.",
  },
] as const;
