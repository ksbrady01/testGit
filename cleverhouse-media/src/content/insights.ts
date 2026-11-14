import { img } from "./images";

export type Insight = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  readingTime: string;
  body: { h?: string; p: string }[];
};

export const insights: Insight[] = [
  {
    slug: "five-signs-your-website-is-holding-you-back",
    category: "Web Design",
    title: "Five signs your website is holding your business back",
    excerpt: "Your website might look fine and still be costing you customers. Here’s what to look for — and what to do about it.",
    image: img.studioDesk,
    readingTime: "4 min read",
    body: [
      { p: "Most websites don’t fail loudly. They fail quietly — in the visitor who leaves after five seconds, the form nobody finishes, or the phone call that goes to a competitor. Here are five common signs your site is working against you." },
      { h: "1. It’s not obvious what you do", p: "If a first-time visitor can’t tell what you offer, who it’s for, and why you’re the right choice within a few seconds, they’ll move on. Lead with a clear headline in plain language." },
      { h: "2. It’s frustrating on a phone", p: "For many businesses, most visitors arrive on mobile. Tiny text, hard-to-tap buttons, and slow pages are deal-breakers. Test your own site on your phone — honestly." },
      { h: "3. The next step is hidden", p: "Every important page should make the next step obvious: call, book, request a quote, or learn more. If visitors have to hunt for it, many won’t." },
      { h: "4. It’s slow", p: "Speed affects both patience and search visibility. Oversized images and bloated code are common culprits — and usually fixable." },
      { h: "5. It doesn’t show up in search", p: "If people can’t find you when they search for what you do, even a beautiful site can’t help. Structure, content, and technical health all play a role." },
      { p: "Not sure where your site stands? Our free website evaluation reviews all five — and more — and gives you a prioritized list of what to fix first." },
    ],
  },
  {
    slug: "local-seo-basics-for-texas-businesses",
    category: "SEO",
    title: "Local SEO basics every Texas business should get right",
    excerpt: "When neighbors search for what you offer, will they find you? Start with these fundamentals.",
    image: img.texas,
    readingTime: "5 min read",
    body: [
      { p: "Local search is where many customers start: “near me,” a service plus a city, or a quick look at the map. The good news is that the fundamentals are within reach for almost any business." },
      { h: "Claim and complete your Business Profile", p: "Make sure your business profile is claimed, accurate, and complete — categories, hours, services, photos, and a description written for customers, not keywords." },
      { h: "Keep your information consistent", p: "Your business name, address, and phone number should match everywhere they appear online. Inconsistencies create doubt for search engines and customers alike." },
      { h: "Create pages for what you actually do", p: "A single “Services” page rarely ranks for everything. Dedicated pages for key services — and, where it makes sense, the areas you serve — give search engines clear answers." },
      { h: "Earn and respond to reviews", p: "Reviews influence both visibility and trust. Ask happy customers at the right moment, and respond thoughtfully to every review — positive or not." },
      { h: "Make your site fast and mobile-friendly", p: "Local searches happen on phones, often in a hurry. A quick, easy experience keeps those visitors from bouncing back to the results." },
      { p: "Want to know how visible you are today? Request a free SEO evaluation and we’ll review your local presence personally." },
    ],
  },
  {
    slug: "why-your-business-needs-a-digital-ecosystem",
    category: "Strategy",
    title: "Why your business needs a digital ecosystem (not just more tools)",
    excerpt: "Stop working in silos. When your platforms work together, your customers — and your team — feel the difference.",
    image: img.studioTeam,
    readingTime: "4 min read",
    body: [
      { p: "Most growing businesses accumulate tools one problem at a time: a website here, an email platform there, a CRM, a scheduling app, a spreadsheet that holds it all together. Each tool works. Together, they don’t." },
      { h: "The hidden cost of disconnected tools", p: "When systems don’t talk, people become the integration — copying leads, chasing updates, and answering the same questions twice. Follow-ups slip, and reporting becomes guesswork." },
      { h: "What an ecosystem looks like", p: "In a connected ecosystem, a form submission creates a CRM record, notifies the right person, starts a follow-up sequence, and shows up in your reporting — automatically." },
      { h: "Start small, connect what matters", p: "You don’t need to rebuild everything. Start with the highest-friction handoff — often website-to-CRM — and expand from there." },
      { h: "Measure the whole journey", p: "When data flows through one system, you can finally see which channels and campaigns create real customers, not just clicks." },
      { p: "Curious what a connected setup could look like for you? Let’s map your current tools together." },
    ],
  },
];

export const getInsight = (slug: string) => insights.find((i) => i.slug === slug);
