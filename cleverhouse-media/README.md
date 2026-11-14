# CleverHouse Media — Website (TanStack Start)

**The Art of Thinking Ahead.** The CleverHouse Media, LLC site built on TanStack Start (React + Vite) for GoHighLevel AI Studio, with GSAP motion, Three.js / React Three Fiber scenes, Lenis smooth scrolling, and a server route for inquiries.

## Run it

```bash
npm install
npm run dev        # http://localhost:3001
npm run build && npm start
```

Requires Node.js 20+. Styling is **Tailwind CSS v4** via `@tailwindcss/vite`: all design tokens live in the `@theme` block of `src/styles.css` (there is no `tailwind.config` file). Imports are relative (no path alias), and the code type-checks under strict settings, including `noUncheckedIndexedAccess`, `verbatimModuleSyntax` and `noUnusedLocals`, so it drops into a hosted builder's locked `tsconfig`. Append `?intro=1` to the homepage URL to replay the intro film (it plays once per browser session and never with reduced motion).

## Structure

- `src/routes/` — file-based routes (`__root.tsx` is the document shell; `$slug.tsx` are dynamic pages; `api/inquiry.ts` is the form endpoint; legacy URLs such as `/portfolio` and `/blog` are redirect routes).
- `src/server/inquiry.server.ts` — server-only validation, spam protection (honeypot, minimum fill time, rate limit) and delivery.
- `src/content/` — all copy and data (`site.ts`, `services.ts`, `projects.ts`, `insights.ts`, `images.ts`).
- `src/components/` — UI, sections, homepage, motion primitives, and lazy-loaded WebGL scenes (`three/`).
- `src/lib/seo.ts` — per-page title, description, canonical, Open Graph and Twitter tags.
- `public/` — logo files, favicon, `og.png`, `sitemap.xml`, `robots.txt`.

## Importing into GoHighLevel AI Studio

AI Studio keeps its own locked `package.json`, `tsconfig.json` and Vite config (Tailwind v4). Copy in `src/` and `public/`, keep AI Studio's config files, and have it add these packages: `@react-three/fiber`, `three`, `@types/three`, `gsap`, `@gsap/react`, `lenis`, `lucide-react`.

## Form delivery

Set at least one of these as **AI Studio Secrets** (see `.env.example`): `RESEND_API_KEY` + `INQUIRY_TO_EMAIL` (+ `INQUIRY_FROM_EMAIL`), or `INQUIRY_WEBHOOK_URL` (a GoHighLevel inbound-webhook workflow works well). Without one, production submissions return an error and the form shows the email address, so leads are never silently lost.

## Before launch

1. Replace the PNG logos in `public/brand/` with official vector files.
2. All portfolio and case-study entries are clearly labeled **Concept Projects** (fictional businesses, no claimed results). Add approved client work in `src/content/projects.ts` with `kind: "client"` and only verified metrics.
3. Confirm `hello@chmedia.com`, and add social profile URLs in `src/content/site.ts`.
4. Swap Unsplash photography for owned imagery in `src/content/images.ts` when available.
5. Have the Privacy Policy and Terms reviewed by counsel.
6. Prefer editing code over AI re-prompts in AI Studio, which may overwrite custom work.
