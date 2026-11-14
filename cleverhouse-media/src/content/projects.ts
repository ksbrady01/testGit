import { img } from "./images";

/**
 * IMPORTANT — integrity rule:
 * These are CONCEPT PROJECTS (design demonstrations) created to show how
 * CleverHouse Media approaches different kinds of businesses. The companies are
 * fictional. They carry no client endorsements and no performance numbers.
 * Replace or add approved, real client work by appending entries with
 * `kind: "client"` and only verified metrics in `results`.
 */

export type WorkCategory =
  "websites" | "branding" | "social" | "seo-marketing" | "digital-experiences";

export const workFilters: { id: "all" | WorkCategory; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "websites", label: "Websites" },
  { id: "branding", label: "Branding" },
  { id: "social", label: "Social Media" },
  { id: "seo-marketing", label: "SEO & Marketing" },
  { id: "digital-experiences", label: "Digital Experiences" },
];

export type ConceptBrand = {
  /** Wordmark rendered in the device mockups */
  wordmark: string;
  monogram: string;
  /** Mock site palette */
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  fontStyle: "serif" | "sans" | "grotesk";
  nav: string[];
  heroLine: string;
  heroSub: string;
  cta: string;
};

export type SocialPiece = { image: string; caption: string; kind: "post" | "story" | "ad" };

export type Project = {
  slug: string;
  kind: "concept" | "client";
  name: string;
  industry: string;
  location: string;
  year: string;
  categories: WorkCategory[];
  tagline: string;
  summary: string;
  hero: string;
  /** At least three images (pages lay out three). */
  gallery: [string, string, string, ...string[]];
  accent: string;
  brand: ConceptBrand;
  challenge: string;
  approach: { title: string; body: string }[];
  services: string[];
  deliverables: string[];
  /** At least three social pieces (pages lay out three). */
  social: [SocialPiece, SocialPiece, SocialPiece, ...SocialPiece[]];
  search?: { query: string; title: string; snippet: string; local?: boolean };
  /** For concept work we describe what we would measure — never invented numbers. */
  outcomes: { title: string; body: string }[];
  /** Only for real client work with verified numbers */
  results?: { value: string; label: string }[];
  caseStudy: {
    insight: string;
    research: string[];
    strategy: string;
    creative: string;
    process: { step: string; body: string }[];
  };
};

/** The four concept projects are always present; client work can be appended. */
export const projects: [Project, Project, Project, Project, ...Project[]] = [
  {
    slug: "bluebonnet-plumbing-air",
    kind: "concept",
    name: "Bluebonnet Plumbing & Air",
    industry: "Local Home Services",
    location: "Central Texas",
    year: "Concept",
    categories: ["websites", "seo-marketing", "social"],
    tagline: "From “who do I call?” to “they’re on the way.”",
    summary:
      "A complete digital transformation for a family-owned plumbing and HVAC company: a fast, trustworthy website, local search strategy, quote-request landing pages, and a social presence neighbors actually remember.",
    hero: img.serviceVan,
    gallery: [img.landscaper, img.serviceVan2, img.landscapeCrew],
    accent: "#3A6FD8",
    brand: {
      wordmark: "Bluebonnet",
      monogram: "B",
      bg: "#0F1D3A",
      fg: "#F5F2EA",
      accent: "#F2B33D",
      muted: "#6F86B8",
      fontStyle: "grotesk",
      nav: ["Services", "Areas", "Reviews", "Financing"],
      heroLine: "Fixed right. Done today.",
      heroSub: "Plumbing, heating & air for Central Texas homes.",
      cta: "Get a free quote",
    },
    challenge:
      "Most local service companies live and die by the phone. When a pipe bursts at 9pm, homeowners grab their phone, search, and call the first company that looks trustworthy. An outdated site, inconsistent business listings, and no clear path to request a quote mean those calls go to someone else.",
    approach: [
      {
        title: "Clarity first",
        body: "Every service gets its own page written in plain language — what it is, what it costs to get started, and how fast someone can arrive.",
      },
      {
        title: "Built for local search",
        body: "Service-area pages, consistent business information, structured data, and review-friendly content help the business appear when neighbors search nearby.",
      },
      {
        title: "One-tap action",
        body: "A sticky call button, short quote forms, and emergency messaging keep the next step obvious on every screen size.",
      },
      {
        title: "A brand people recognize",
        body: "A confident bluebonnet-inspired palette carries from trucks to social posts, so the company looks like the same trusted team everywhere.",
      },
    ],
    services: [
      "Website design & development",
      "Local SEO",
      "Landing pages",
      "Lead-generation forms",
      "Social media",
      "Brand consistency",
    ],
    deliverables: [
      "Custom website",
      "Service & service-area pages",
      "Quote-request landing page",
      "Google Business Profile optimization plan",
      "Seasonal social campaign",
      "Truck & uniform brand guide",
    ],
    social: [
      {
        image: img.serviceVan2,
        caption: "AC acting up before summer? Book a tune-up this week.",
        kind: "post",
      },
      {
        image: img.landscaper,
        caption: "Meet the crew behind every on-time arrival.",
        kind: "story",
      },
      {
        image: img.serviceVan,
        caption: "24/7 emergency plumbing — real people answer.",
        kind: "ad",
      },
    ],
    search: {
      query: "emergency plumber near me",
      title: "Bluebonnet Plumbing & Air — 24/7 Emergency Plumbing",
      snippet:
        "Licensed plumbers serving Central Texas. Same-day service, upfront pricing, and real people answering the phone.",
      local: true,
    },
    outcomes: [
      {
        title: "Calls & quote requests",
        body: "Tracked call clicks and form submissions by service and by page.",
      },
      {
        title: "Local visibility",
        body: "Map and local-results presence for priority services and service areas.",
      },
      {
        title: "Speed on mobile",
        body: "Core Web Vitals monitored so the site stays fast on a phone in a hurry.",
      },
    ],
    caseStudy: {
      insight:
        "Homeowners in a hurry don’t compare ten websites — they trust the first one that answers three questions: can you fix it, can you come today, and can I reach you right now?",
      research: [
        "Search intent mapping for emergency vs. planned services",
        "Competitor listing & review audit",
        "Mobile path-to-call analysis",
        "Service-area demand by neighborhood",
      ],
      strategy:
        "Organize the entire site around urgency. Emergency services get immediate, one-tap contact; planned services (installs, maintenance plans) get richer pages that build trust over time. Every page earns its place in local search.",
      creative:
        "A deep navy foundation with bluebonnet blue and sunlit yellow keeps the brand warm, local, and easy to spot on a truck at 60 mph or a phone screen at midnight.",
      process: [
        {
          step: "Discover",
          body: "Interview the owners, ride along with a technician, and audit every listing and review.",
        },
        {
          step: "Structure",
          body: "Build a sitemap around services, service areas, and urgency levels.",
        },
        {
          step: "Design",
          body: "Design mobile-first with a sticky call bar and two-field quick quotes.",
        },
        {
          step: "Launch & grow",
          body: "Launch with tracking in place, then publish seasonal content and social campaigns.",
        },
      ],
    },
  },
  {
    slug: "ember-and-oak",
    kind: "concept",
    name: "Ember & Oak",
    industry: "Restaurant & Hospitality",
    location: "Austin, Texas",
    year: "Concept",
    categories: ["branding", "websites", "social", "digital-experiences"],
    tagline: "A wood-fired kitchen with a story worth telling.",
    summary:
      "A full brand transformation for a wood-fired neighborhood restaurant: identity system, a reservation-first website, a menu that makes you hungry, photography direction, and social creative that fills tables on a Tuesday.",
    hero: img.chefPlating,
    gallery: [img.restaurantBooth, img.restaurantHall, img.restaurantBrick],
    accent: "#E0672B",
    brand: {
      wordmark: "Ember & Oak",
      monogram: "E&O",
      bg: "#17120F",
      fg: "#F3E9DC",
      accent: "#E0672B",
      muted: "#A08672",
      fontStyle: "serif",
      nav: ["Menu", "Reserve", "Events", "Story"],
      heroLine: "Cooked over fire. Shared at the table.",
      heroSub: "Wood-fired dinner, natural wine, and long Texas evenings.",
      cta: "Reserve a table",
    },
    challenge:
      "Great food alone doesn’t fill a dining room. A restaurant competes on feeling — and the feeling has to come through on a phone, in a story, in a three-second scroll. Inconsistent visuals and a PDF menu were quietly turning curious diners away.",
    approach: [
      {
        title: "Identity with heat",
        body: "A warm serif wordmark, ember-orange accents, and a charcoal palette borrowed from the hearth itself.",
      },
      {
        title: "Menu as experience",
        body: "A fast, accessible HTML menu with seasonal highlights, dietary notes, and photography that does the selling.",
      },
      {
        title: "Reservation-first",
        body: "Booking is never more than one tap away, with event and private-dining paths for bigger groups.",
      },
      {
        title: "Photography direction",
        body: "A shot list built around fire, hands, and shared tables — warm, candid, and never sterile.",
      },
    ],
    services: [
      "Logo & visual identity",
      "Website & mobile experience",
      "Menu design",
      "Social media creative",
      "Campaign graphics",
      "Photography direction",
    ],
    deliverables: [
      "Logo suite & brand guidelines",
      "Reservation-first website",
      "Digital & print menu system",
      "Social content templates",
      "Seasonal promo landing page",
      "Photography shot list",
    ],
    social: [
      {
        image: img.chefPlating,
        caption: "Tonight’s special came straight off the fire.",
        kind: "post",
      },
      { image: img.restaurantBooth, caption: "Your corner booth is waiting.", kind: "story" },
      {
        image: img.restaurantHall,
        caption: "Private dining for up to 40 — plan your night.",
        kind: "ad",
      },
    ],
    search: {
      query: "wood fired restaurant austin",
      title: "Ember & Oak — Wood-Fired Kitchen in Austin",
      snippet:
        "Seasonal wood-fired dinner, natural wine, and private dining. Reserve your table tonight.",
      local: true,
    },
    outcomes: [
      {
        title: "Reservations",
        body: "Online bookings and private-dining inquiries tracked by source.",
      },
      {
        title: "Social engagement",
        body: "Saves, shares, and profile visits from seasonal campaigns.",
      },
      {
        title: "Menu discovery",
        body: "Menu views and on-site behavior that shows which dishes draw people in.",
      },
    ],
    caseStudy: {
      insight:
        "People don’t choose a restaurant from a list of dishes. They choose a night they can imagine having.",
      research: [
        "Guest journey from discovery to booking",
        "Local competitor brand audit",
        "Menu readability & accessibility review",
        "Content themes that drive saves and shares",
      ],
      strategy:
        "Sell the evening, not the entrée. Lead with atmosphere and story, then make the menu effortless to explore and the reservation impossible to miss.",
      creative:
        "Charcoal, bone, and a single flash of ember orange. A classic serif paired with a clean grotesk keeps the brand both crafted and modern.",
      process: [
        {
          step: "Taste",
          body: "Spend a service in the kitchen and dining room to find the brand’s real story.",
        },
        {
          step: "Identity",
          body: "Develop the logo suite, palette, type, and photography direction.",
        },
        { step: "Experience", body: "Design the reservation-first website and accessible menu." },
        {
          step: "Campaign",
          body: "Launch with a seasonal social campaign and promo landing page.",
        },
      ],
    },
  },
  {
    slug: "calder-finch-advisory",
    kind: "concept",
    name: "Calder & Finch Advisory",
    industry: "Professional Services",
    location: "Dallas, Texas",
    year: "Concept",
    categories: ["websites", "branding", "seo-marketing"],
    tagline: "Expertise that finally looks the part.",
    summary:
      "A brand refresh and premium website for a growing business-advisory firm: search-optimized service pages, thoughtful lead generation, digital ad creative, and content that turns expertise into trust.",
    hero: img.library,
    gallery: [img.booksWarm, img.officeGlass, img.officeFacade],
    accent: "#2F6B57",
    brand: {
      wordmark: "Calder & Finch",
      monogram: "C&F",
      bg: "#F4F1EA",
      fg: "#14261F",
      accent: "#2F6B57",
      muted: "#7E8C84",
      fontStyle: "serif",
      nav: ["Advisory", "Industries", "Insights", "Team"],
      heroLine: "Clear counsel for growing companies.",
      heroSub: "Strategy, finance, and operations advisory for Texas businesses.",
      cta: "Schedule a consultation",
    },
    challenge:
      "Professional firms often sell their expertise through referrals and handshakes, then lose credibility online. A dated site that lists services without explaining them makes a sophisticated firm look ordinary — and invisible to people searching for exactly what they offer.",
    approach: [
      {
        title: "A sharper brand",
        body: "A refined serif identity, a deep green palette, and editorial layouts that signal confidence without stiffness.",
      },
      {
        title: "Search-optimized services",
        body: "Each practice area becomes a focused page built around the questions prospective clients actually ask.",
      },
      {
        title: "Lead generation with care",
        body: "Consultation requests, downloadable guides, and nurture emails that respect a considered buying decision.",
      },
      {
        title: "Campaign creative",
        body: "LinkedIn and search ad creative that leads with insight instead of generic stock imagery.",
      },
    ],
    services: [
      "Premium business website",
      "Brand refresh",
      "SEO service pages",
      "Lead generation",
      "Digital ad creative",
      "Social media strategy",
      "Conversion-focused content",
    ],
    deliverables: [
      "Brand refresh & guidelines",
      "Editorial website",
      "Practice-area page system",
      "Consultation funnel",
      "Ad creative set",
      "LinkedIn content strategy",
    ],
    social: [
      {
        image: img.booksWarm,
        caption: "Five questions to ask before you raise capital.",
        kind: "post",
      },
      {
        image: img.officeGlass,
        caption: "Inside our approach to operational planning.",
        kind: "story",
      },
      {
        image: img.library,
        caption: "Free guide: Preparing your business for its next stage.",
        kind: "ad",
      },
    ],
    search: {
      query: "business advisory firm dallas",
      title: "Calder & Finch Advisory — Strategy & Operations Advisors",
      snippet:
        "Practical strategy, finance, and operations guidance for growing Texas companies. Schedule a consultation.",
    },
    outcomes: [
      {
        title: "Qualified consultations",
        body: "Consultation requests segmented by practice area and source.",
      },
      {
        title: "Search presence",
        body: "Visibility for priority practice-area and location searches.",
      },
      {
        title: "Content engagement",
        body: "Guide downloads and return visits from nurture emails.",
      },
    ],
    caseStudy: {
      insight:
        "Prospective clients are quietly researching for weeks before they call. The website is the firm’s first meeting — and most firms show up underprepared.",
      research: [
        "Client interviews on how they chose an advisor",
        "Search demand by practice area",
        "Competitor positioning map",
        "Content gap analysis",
      ],
      strategy:
        "Turn expertise into visible, searchable proof. Each practice area answers real questions, and every page offers a respectful next step.",
      creative:
        "Bone paper tones, deep green, and a classic serif evoke established trust — modernized by generous whitespace and crisp grotesk details.",
      process: [
        {
          step: "Listen",
          body: "Interview partners and clients to find what truly sets the firm apart.",
        },
        {
          step: "Position",
          body: "Refine messaging, brand identity, and the practice-area architecture.",
        },
        {
          step: "Build",
          body: "Design and develop an editorial site with optimized service pages.",
        },
        { step: "Nurture", body: "Launch guides, email nurture, and targeted campaign creative." },
      ],
    },
  },
  {
    slug: "lantern-hill-church",
    kind: "concept",
    name: "Lantern Hill Church",
    industry: "Church & Community",
    location: "North Texas",
    year: "Concept",
    categories: ["websites", "branding", "social", "digital-experiences"],
    tagline: "A warm welcome — long before Sunday morning.",
    summary:
      "A modern digital home for a growing church and community organization: a welcoming website, event promotion and registrations, giving and engagement journeys, social graphics, and email communication that keeps people connected.",
    hero: img.churchGroup,
    gallery: [img.community, img.volunteers, img.concertLights],
    accent: "#D9822B",
    brand: {
      wordmark: "Lantern Hill",
      monogram: "LH",
      bg: "#FFF8EF",
      fg: "#2B1D14",
      accent: "#D9822B",
      muted: "#9C8571",
      fontStyle: "sans",
      nav: ["Visit", "Events", "Groups", "Give"],
      heroLine: "There’s a seat saved for you.",
      heroSub: "Sundays at 9 & 11 · Kids, students, and groups all week.",
      cta: "Plan your visit",
    },
    challenge:
      "For most first-time guests, the church website is the front door. Outdated pages, buried service times, and scattered event sign-ups make it harder for new people to take a first step — and harder for members to stay engaged.",
    approach: [
      {
        title: "Plan-a-visit journey",
        body: "Service times, parking, kids check-in, and what to expect — answered in one welcoming flow.",
      },
      {
        title: "Events that fill up",
        body: "A clean events hub with easy registration and shareable graphics for every gathering.",
      },
      {
        title: "Generosity made simple",
        body: "A clear giving page and engagement paths for serving, groups, and community outreach.",
      },
      {
        title: "Stories that connect",
        body: "A warm identity and social system built around real people and real moments.",
      },
    ],
    services: [
      "Modern website",
      "Event promotion",
      "Registration experiences",
      "Giving & engagement journeys",
      "Social graphics",
      "Email campaigns",
      "Brand identity & storytelling",
    ],
    deliverables: [
      "Welcoming website",
      "Plan-a-visit flow",
      "Events & registration hub",
      "Giving journey",
      "Social graphic templates",
      "Email newsletter system",
    ],
    social: [
      {
        image: img.community,
        caption: "Serve Saturday — one city, a lot of helping hands.",
        kind: "post",
      },
      { image: img.concertLights, caption: "Night of Worship · Friday at 7pm.", kind: "story" },
      {
        image: img.volunteers,
        caption: "New here? Plan your first visit in 60 seconds.",
        kind: "ad",
      },
    ],
    search: {
      query: "churches near me",
      title: "Lantern Hill Church — Sundays at 9 & 11",
      snippet:
        "A warm, welcoming church in North Texas with kids, students, and groups all week. Plan your visit.",
      local: true,
    },
    outcomes: [
      { title: "First-time visits", body: "Plan-a-visit submissions and follow-up engagement." },
      {
        title: "Event participation",
        body: "Registrations per event and the channels that drove them.",
      },
      {
        title: "Ongoing connection",
        body: "Email engagement, group sign-ups, and serving interest.",
      },
    ],
    caseStudy: {
      insight:
        "A first-time guest makes most of their decision before they ever park the car. The website has to feel like a warm handshake.",
      research: [
        "First-time guest journey interviews",
        "Staff workflow for events & registrations",
        "Communication channel audit",
        "Accessibility review",
      ],
      strategy:
        "Design for the newcomer first, then build connected paths for members — events, groups, serving, and giving — all from one welcoming home.",
      creative:
        "Warm lantern amber on soft cream, rounded-sm sans typography, and photography of real community moments.",
      process: [
        { step: "Welcome", body: "Map the newcomer journey and the questions guests ask most." },
        { step: "Connect", body: "Unify events, registrations, and communication tools." },
        { step: "Design", body: "Create the identity, website, and social template system." },
        { step: "Equip", body: "Train staff and volunteers to keep everything fresh." },
      ],
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
