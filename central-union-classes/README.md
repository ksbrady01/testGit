# Central Union Online Classes — GoHighLevel AI Studio edition

Online classes for **Central Union Church of Christ**, built on AI Studio's own TanStack Start template (`tanstack_start_ts`). Learners sign in with their email, take classes made of reading, YouTube video and PDF lessons, pick up exactly where they left off, earn XP, levels, badges and certificates, and get reminders for unfinished classes.

This project uses AI Studio's template files unchanged — `tsconfig.json`, `vite.config.ts` (`@leadconnector/vite-tanstack-config`), `bunfig.toml`, `eslint.config.js`, `src/server.ts`, `src/start.ts`, `src/router.tsx` and the error-reporting helpers — so it drops into an AI Studio project with no conversion. `package.json` and `bun.lock` match the template set used for the CleverHouse Media project, so installs are reproducible.

## Run it

```bash
bun install
bun run dev        # or: npm run dev
bun run typecheck
bun run lint
bun run build
```

## Moving it into AI Studio

1. In AI Studio, create a new **TanStack Start** project and connect **Git Sync** (it creates a private GitHub repo).
2. Replace that repo's contents with this project and push a normal commit (never force-push). AI Studio pulls it in automatically.
3. Add the settings below, then **Publish** and add the custom domain.

## Pages

| URL | Page |
| --- | --- |
| `/` | Class catalog: search, categories, tags, continue-learning card, level |
| `/classes/$courseId` | Class details, outline, start/resume, share link, edit/delete |
| `/learn/$courseId` | Lesson player: resumes at the last lesson; YouTube videos play in the page |
| `/certificate/$courseId` | Certificate with the church logo, downloadable as PNG |
| `/my-learning` | Level, streak, in-progress and completed classes, badges, reminder settings, sign out |
| `/leaderboard` | XP leaderboard |
| `/create`, `/edit/$courseId` | Class editor: text, YouTube and PDF lessons, categories, tags, cover color |
| `/learners` | Editors only: everyone's progress and who's due a reminder |
| `/api/reminders` | Server route that forwards progress to GoHighLevel |

## Structure

- `src/routes/` — file-based routes (thin wrappers around the pages).
- `src/classes/pages/` — page components.
- `src/classes/components/` — shell (header, reminders bell, sign-in, toasts, pop-ups), cards, icons, progress UI.
- `src/classes/state/AppProvider.tsx` — sign-in state, classes, progress, XP, levels, badges, streaks, reminders.
- `src/classes/backend/` — **the only place data is read or written** (see below).
- `src/classes/content/seed.ts` — the starter classes.
- `src/classes/constants.ts` — church name, XP values, levels, badges, categories, logo paths.
- `src/server/reminders.server.ts` — validates and forwards reminder data to GoHighLevel.
- `public/brand/` — `logo.png` (dark backgrounds), `logo-deep.png` (certificates), `emblem.png` (header/favicon).

## Settings

| Name | Where | What it does |
| --- | --- | --- |
| `VITE_ADMIN_EMAILS` | Environment variable | Comma-separated emails that can edit/delete any class and see `/learners`. |
| `VITE_APP_URL` | Environment variable | Public URL used in "Share class" links (defaults to the current site). |
| `GHL_REMINDER_WEBHOOK_URL` | **Secret** | GoHighLevel Inbound Webhook URL for reminder emails/texts. Kept on the server. |

## Reminders with GoHighLevel

1. Create a workflow with the **Inbound Webhook** trigger and save its URL as the `GHL_REMINDER_WEBHOOK_URL` secret.
2. Whenever a learner's progress changes, the server posts:

   ```json
   {
     "event": "learner.progress",
     "learnerId": "u_…", "email": "member@example.com", "name": "Jane Doe",
     "xp": 140, "level": "2 - Seeker", "completedCount": 1,
     "incomplete": [{ "courseId": "cbible02", "title": "How to Read the Bible", "pct": 50, "next": "Reading in context", "resumeUrl": "https://…/learn/cbible02" }],
     "hasIncomplete": true,
     "reminderFrequency": "3days", "emailReminders": true,
     "nextReminderAt": "2026-11-21T15:00:00.000Z", "lastActive": "2026-11-18T15:00:00.000Z"
   }
   ```

3. In the workflow: create/update the contact by email; if `hasIncomplete` is true and `emailReminders` is true, add a tag such as `class-in-progress`, wait until `nextReminderAt`, then send an email or SMS with the `resumeUrl`. Remove the tag when `hasIncomplete` is false.

## Where data is stored today

`src/classes/backend/localStore.ts` saves classes and progress **in each person's browser** (seeded from `seed.ts`). That makes the app fully usable right away, but:

- A learner's progress stays on the device and browser they used.
- Classes created in the app are only visible in that browser; edit `seed.ts` (or connect a database) to publish classes to everyone.
- File upload buttons are hidden until file storage is connected (`assets` is `null`); lessons use YouTube links and PDF links.

### Connecting a real database

Keep the exports of `src/classes/backend/index.ts` and change their insides to call your database (for example through TanStack Start server functions):

- `db: Store` — `doc(path)` with `get / set / update / delete / onSnapshot`, and `collection(path)` with `where / orderBy / limit / get / onSnapshot / doc / add` (types in `backend/types.ts`).
- Collections: `courses/{courseId}`, `learners/{learnerId}`, `leaderboard/{learnerId}`.
- `auth` — replace the email sign-in with real sign-in (for example a magic link) so people can return from any device.
- `assets.upload(file)` → `{ id, url }`, and `assetUrl(id)` → the file's URL, to enable PDF and video uploads.

## Before launch

1. Set `VITE_ADMIN_EMAILS` and the `GHL_REMINDER_WEBHOOK_URL` secret.
2. Connect a database and real sign-in so progress follows people across devices.
3. Replace the PNG logos in `public/brand/` with official files if available.
4. Prefer editing code over AI re-prompts in AI Studio, which may overwrite custom work.
5. `package.json` still lists a few packages from the shared template set (`gsap`, `three`, `lenis`, `@react-three/fiber`); they're unused here and can be removed with `bun remove` once the project is in AI Studio.
