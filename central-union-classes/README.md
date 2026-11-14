# Central Union Online Classes (React + Vite)

Online classes for **Central Union Church of Christ**, built with React + Vite for GoHighLevel AI Studio. Learners sign in with their email, take classes made of text, YouTube video, uploaded video or PDF lessons, pick up where they left off, earn XP, levels, badges and certificates, and get reminders for unfinished classes.

## Run it

```bash
npm install
npm run dev        # http://localhost:3002
npm run build      # outputs dist/
npm run preview
```

Requires Node.js 20+.

## Features

- **Catalog**: search, categories and tags; anyone signed in can create a class and share a link to it.
- **Lessons**: text (supports `# headings`, `- bullets`, `**bold**`), YouTube videos played in the page, uploaded video files, and PDFs.
- **Progress**: resume at the last lesson (and the last spot in an uploaded video); progress bars throughout.
- **My learning**: level ring, streak, in-progress and completed classes, badges, reminder settings, sign out.
- **Gamification**: XP per lesson, class, daily streak and published class; 8 levels (Newcomer to Elder); 7 badges; leaderboard.
- **Certificates**: on-screen certificate with the church logo, downloadable as a PNG.
- **Reminders**: an in-app bell for classes that need attention; optional GoHighLevel webhook for email/SMS reminders.
- **Learners page** for editors (emails listed in `VITE_ADMIN_EMAILS`).
- Light and dark mode, animations, responsive layout, `prefers-reduced-motion` respected.

## Structure

- `src/App.js` — the whole UI (React with `htm` tagged templates, so no JSX build step is required).
- `src/backend/index.js` — **the only file the UI talks to for data**: `db`, `user`, `auth`, `assets`, `assetUrl`, `downloads`.
- `src/backend/localBackend.js` — document store saved in the browser (`localStorage`), seeded from `src/content/seed.json`.
- `src/backend/webhook.js` — optional GoHighLevel sync for reminders.
- `src/content/seed.json` — the starter classes.
- `src/config.js` — church name, admin emails, share URL, logo paths.
- `public/brand/` — `logo.png` (dark backgrounds), `logo-deep.png` (light backgrounds/certificates), `emblem.png` (header and favicon).

## Settings

Set these as AI Studio environment variables, or in `.env` (see `.env.example`). All are optional.

| Variable | What it does |
| --- | --- |
| `VITE_ADMIN_EMAILS` | Comma-separated emails that can edit or delete any class and see the Learners page. |
| `VITE_APP_URL` | Public URL used in "Share class" links. Defaults to the current page. |
| `VITE_GHL_WEBHOOK_URL` | GoHighLevel Inbound Webhook URL that receives learner progress for reminders. |

## Important: where data is stored today

The included backend saves classes and progress **in each person's browser**. That is enough to try the app, but:

- A learner's progress is only on the device and browser they used.
- Classes created in the app are only visible in that browser. Starter classes come from `seed.json`, so edit that file (or connect a database) to publish classes to everyone.
- File upload buttons are hidden until file storage is connected (`assets` is `null`). Lessons can still use YouTube links and PDF links.

### Connecting a real database

Keep the exports of `src/backend/index.js` and change their insides so they read and write your server (Supabase, Firebase, an AI Studio server function, etc.):

- `db.doc(path)` → `get()`, `set(data)`, `update(data)`, `delete()`, `onSnapshot(callback)`
- `db.collection(path)` → `orderBy(field, dir)`, `limit(n)`, `where(field, op, value)`, `get()`, `onSnapshot(callback)`, `doc(id)`
- Collections used: `courses/{courseId}`, `learners/{learnerId}`, `leaderboard/{learnerId}`.
- `auth.signIn({ name, email })` → replace with a real sign-in (for example an email magic link) so people can return from any device.
- `assets.upload(file)` → resolve `{ id, url }`; `assetUrl(id)` → the file's URL.

Snapshots are `{ id, exists, data(), metadata }` for documents and `{ docs, size, empty, metadata }` for collections.

## Reminders with GoHighLevel

1. In GoHighLevel, create a workflow with the **Inbound Webhook** trigger and copy its URL into `VITE_GHL_WEBHOOK_URL`.
2. Each time a learner's progress changes, the app posts:

   ```json
   {
     "event": "learner.progress",
     "learnerId": "u_…", "email": "member@example.com", "name": "Jane Doe",
     "xp": 140, "level": "2 - Seeker", "completedCount": 1,
     "incomplete": [{ "courseId": "cbible02", "title": "How to Read the Bible", "pct": 50, "next": "Reading in context", "resumeUrl": "https://…/#learn-cbible02" }],
     "reminderFrequency": "3days", "emailReminders": true,
     "nextReminderAt": "2026-11-16T15:00:00.000Z", "lastActive": "2026-11-13T15:00:00.000Z"
   }
   ```

3. In the workflow: create/update the contact by email, add a tag such as `class-in-progress` when `incomplete` is not empty, wait until `nextReminderAt`, then send an email or SMS with the `resumeUrl`. Remove the tag when `incomplete` is empty.

The webhook URL is visible in the browser, so use a workflow that only updates contacts and sends reminders.

## Before launch

1. Set `VITE_ADMIN_EMAILS` to the people who manage classes.
2. Connect a database and real sign-in (see above) so progress follows people across devices.
3. Replace the PNG logos in `public/brand/` with official files if available.
4. Prefer editing code over AI re-prompts in AI Studio, which may overwrite custom work.
