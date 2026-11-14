# CleverHouse Media — Website (GoHighLevel AI Studio edition)

**The Art of Thinking Ahead.** The CleverHouse Media, LLC website, built on AI Studio's own TanStack Start template (`tanstack_start_ts`), with GSAP motion, Three.js / React Three Fiber scenes, Lenis smooth scrolling, and a server route for inquiries.

This project uses AI Studio's template files unchanged — `tsconfig.json` (strict, incl. `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature`), `vite.config.ts` (`@leadconnector/vite-tanstack-config`), `bunfig.toml`, `eslint.config.js`, `src/server.ts`, `src/start.ts` and the error-reporting helpers — so it drops into an AI Studio project with no conversion. Type check, lint and the Cloudflare build all pass.

## Run it

```bash
bun install
bun run dev
bun run build
```

Append `?intro=1` to the homepage URL to replay the intro film (it plays once per browser session and never with reduced motion).

## Moving it into AI Studio

1. In AI Studio, create a new **TanStack Start** project and connect **Git Sync** (it creates a private GitHub repo).
2. Replace that repo's contents with this project and push a normal commit (never force-push). AI Studio pulls it in automatically.
3. Add form-delivery **Secrets** (below), then **Publish** and add the custom domain.

## Structure

- `src/routes/` — file-based routes (`__root.tsx` is the document shell; `$slug.tsx` are dynamic pages; `api/inquiry.ts` is the form endpoint; legacy URLs such as `/portfolio` and `/blog` are redirect routes).
- `src/server/inquiry.server.ts` — server-only validation, spam protection (honeypot, minimum fill time, rate limit) and delivery.
- `src/content/` — all copy and data (`site.ts`, `services.ts`, `projects.ts`, `insights.ts`, `images.ts`).
- `src/components/` — UI, sections, homepage, motion primitives, and lazy-loaded WebGL scenes (`three/`).
- `src/styles.css` — Tailwind CSS v4; every design token lives in its `@theme` block.
- `public/` — logo files, favicon, `og.png`, `sitemap.xml`, `robots.txt`.

## Form delivery

Set at least one of these as **AI Studio Secrets** (see `.env.example`): `RESEND_API_KEY` + `INQUIRY_TO_EMAIL` (+ `INQUIRY_FROM_EMAIL`), or `INQUIRY_WEBHOOK_URL` (a GoHighLevel inbound-webhook workflow works well). Without one, production submissions return an error and the form shows the email address, so leads are never silently lost. In development, submissions are logged to the server console.

## Before launch

1. Replace the PNG logos in `public/brand/` with official vector files.
2. All portfolio and case-study entries are clearly labeled **Concept Projects** (fictional businesses, no claimed results). Add approved client work in `src/content/projects.ts` with `kind: "client"` and only verified metrics.
3. Confirm `hello@chmedia.com`, and add social profile URLs in `src/content/site.ts`.
4. Swap Unsplash photography for owned imagery in `src/content/images.ts` when available.
5. Have the Privacy Policy and Terms reviewed by counsel.
6. Prefer editing code over AI re-prompts in AI Studio, which may overwrite custom work.
