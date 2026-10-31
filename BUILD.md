# BUILD.md — 75-Minute Parallel Build Plan

Two agents work in parallel. **Read `PROJECT.md` first, fully. It is the contract.** Do not change the API contract (section 6) or the report object (section 7) without telling the other agent via `NOTES.md`. All API JSON keys are **camelCase**.

- **Agent A (Backend)** works only inside `/backend` (Express + TypeScript + Prisma + PostgreSQL)
- **Agent B (Frontend)** works only inside `/frontend` (React + Vite + TypeScript + Tailwind)
- Shared files at the repo root: `PROJECT.md`, `BUILD.md`, `NOTES.md` (append-only handoff notes), `fixtures/report.sample.json`

The clock starts when you read this. Time is the main constraint. A working end-to-end flow beats a polished half-flow.

---

## Before the clock starts (human, 3 minutes)

1. PosgreeSQL render.
2. Put `DATABASE_URL`, `JWT_SECRET` (any long random string) and `ANTHROPIC_API_KEY` into `backend/.env` (see PROJECT.md section 4).
3. Confirm the model names in `.env` exist on your Anthropic account.

---

## Ground rules (both agents)

1. **Contract first, fixtures second, code third.** In minutes 0-5, Agent B creates `fixtures/report.sample.json` from PROJECT.md section 7 (a realistic 8-month sample, 2 participants, 5 sections, 3 turning points, 5 quotes). Agent A uses the same file as the stub in chunk A3.
2. **Never log or store chat text.** See PROJECT.md section 2. This is non-negotiable and is checked at the end.
3. **Commit small and often.** One commit per finished chunk, message format `A1: scaffold` / `B3: report page`.
4. **Don't block on each other.** Frontend runs against the fixture (`VITE_USE_MOCK=true`) until the backend is live. Backend tests with `curl` until the frontend is live.
5. **When stuck for more than 5 minutes,** take the simplest option, write one line in `NOTES.md`, and move on.
6. **Honest copy only.** Use the five privacy truths exactly. No "100% private".
7. Mark each chunk done in `NOTES.md` as `DONE A2 @ T+23` so the human can see progress.

### Integration checkpoints
| Time | Checkpoint |
|---|---|
| T+5 | Contract frozen. Fixture exists. Both scaffolds started. |
| T+30 | **Stub integration:** frontend signs up, logs in, uploads a file, backend returns a finished report (real stats + fixture narrative), frontend renders it from the real API. |
| T+55 | **Real pipeline:** a real chat produces a real report end to end. |
| T+68 | **Feature freeze.** Only bug fixes and polish after this. |
| T+75 | Demo-ready. Final privacy check done. |

---

## Agent A — Backend (`/backend`)

### A1 · Scaffold, Prisma, auth (T+0 → T+12)
- `npm init`, TypeScript, `tsx`, Express app, `dotenv`, `helmet`, `cors` (origin = `FRONTEND_ORIGIN`), JSON body parser, request logging that **never logs bodies** (e.g. `morgan("tiny")`).
- Install and set up Prisma. Put the schema from PROJECT.md section 5 into `prisma/schema.prisma`, run `npx prisma db push` and `npx prisma generate`. Export a single `prisma` client from `src/prisma.ts`.
- `GET /api/health`.
- Auth: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me` per PROJECT.md section 6. `bcryptjs` for hashing, `jsonwebtoken` for tokens, `zod` for input validation, `express-rate-limit` on the auth routes. Same error message for a wrong email and a wrong password.
- `requireAuth` middleware: reads `Authorization: Bearer`, verifies the JWT, loads `req.userId`, otherwise `401 { error: "unauthorized" }`.
- Central error handler that returns `{ error, message }` and **never echoes request bodies or stack traces to the client**.
- **Done when:** signup → login → `/api/auth/me` works with `curl`, and a protected route returns 401 without a token.

### A2 · Parser, stats, monthly (T+12 → T+27)
Pure functions, no network, fully testable.
- `src/parser.ts`: implement PROJECT.md 8.1 (Android and iPhone formats, DD/MM detection, multi-line messages, system-line filtering, `.zip` support via `adm-zip`, U+202F handling, timestamps built with `Date.UTC`).
- `src/stats.ts`: implement 8.2 and 8.3, including the Hinglish stopword list and `emoji-regex`.
- Tests (`vitest` or `node:test`) with at least 6 parser cases: Android 12h, Android 24h, iPhone brackets, multi-line message, media omitted dropped, ambiguous date defaults to DD/MM.
- A script `npm run debug:stats -- path/to/chat.txt` that prints the stats JSON to the terminal only.
- **Done when:** tests pass and the stats script runs on a real export in under 3 seconds.

### A3 · Endpoints, job lifecycle, stubbed narrative (T+27 → T+40)
- `multer` with **memory storage** and a size limit from `MAX_UPLOAD_MB`. Map the multer size error to `file_too_large`. Never save files to disk.
- `POST /api/uploads/preview` (participants, messageCount, dateRange, isGroup).
- `POST /api/reports`: validate with `zod` (consent must be `"true"`, `myName` must be a participant, `chatType` valid), parse, create the row, respond `202 { id }`, then start the job without awaiting it (always `.catch`).
- `src/jobs.ts`: lifecycle per PROJECT.md 8.5. **For now the narrative step returns the fixture's narrative and a stub closeness per month** so the frontend can integrate. Real stats are used from the start. Update `stage` at each step.
- `GET /api/reports`, `GET /api/reports/:id` (always filter by `userId`; 404 otherwise), `DELETE /api/reports/:id`, `DELETE /api/account`.
- Startup hook: mark stuck jobs as `failed / interrupted`.
- `finally` block dereferences the raw text and parsed messages.
- **Done when:** the T+30 checkpoint passes with the frontend.

### A4 · Real LLM pipeline (T+40 → T+56)
- `src/personas.ts` with Cleo (PROJECT.md section 9) and `GET /api/personas`.
- `src/pipeline.ts`: Map (parallel, `p-limit(5)`) → Reduce → quote resolution, per PROJECT.md 8.4, using `@anthropic-ai/sdk` with `MODEL_MAP` and `MODEL_REPORT`.
- Strip code fences, parse JSON, validate with `zod`, retry once, drop invalid quote ids, cap quotes at 8.
- Apply the 12-month / 40,000-message cap.
- Update `stage` to `reading_months` and `writing_report`.
- **Done when:** a real export produces a real report whose quotes match the original chat messages exactly.

### A5 · Hardening (T+56 → T+68)
- **Log audit:** search the code for any `console.log`, `console.error` or logger call that could include message text, a transcript, an LLM prompt or an LLM response. Remove them. Errors from the LLM SDK can include request details, so catch them and rethrow a generic error that has no payload.
- Test the failure path: use an invalid Anthropic key, confirm the row becomes `failed / llm_failed` and that nothing from the chat remains in the database or logs.
- Test ownership with two users: user B cannot read or delete user A's report.
- Test account deletion: reports are gone after `DELETE /api/account`.
- Confirm the server restart hook marks stuck jobs as failed.
- Confirm oversized, wrong-type and empty uploads return clean error codes.
- **Done when:** the checks above pass.

### A6 · Final run and notes (T+68 → T+75)
- Write `backend/README.md`: install, env vars, `prisma db push`, run command.
- Run one full end-to-end pass with the frontend and a real chat. Fix only blockers.
- If time allows and the human asks: deploy to Render/Railway with a hosted Postgres.

---

## Agent B — Frontend (`/frontend`)

### B1 · Scaffold, tokens, auth, API client (T+0 → T+10)
- Create the Vite React + TypeScript app. Install `tailwindcss`, `react-router-dom`, `recharts`.
- Create `fixtures/report.sample.json` **in the first 5 minutes** and tell Agent A in `NOTES.md`.
- Design tokens in the Tailwind config from PROJECT.md section 10 (cream background, muted accents, serif headings + sans UI). Load a warm serif and a clean sans from Google Fonts with a Devanagari-capable fallback.
- `lib/api.ts`: typed `fetch` wrapper that adds the bearer token, understands `{ error, message }`, and on a `401` clears the token and redirects to `/login`. TypeScript types for the report object from PROJECT.md section 7.
- Auth context: token stored in `localStorage`, `signup`, `login`, `logout`, `user`. A `ProtectedRoute` component for `/dashboard`, `/new`, `/reports/:id`, `/settings`.
- `VITE_USE_MOCK` flag: when true, the API wrapper serves the fixture so every page works without the backend.
- **Done when:** the app runs, routes work, and the fixture loads through the API wrapper in mock mode.

### B2 · Landing, privacy, login/signup (T+10 → T+25)
- **Landing:** hero, 3-step "how it works", privacy section near the top (the five truths, calmly worded), a blurred sample report preview, CTA.
- **Login and signup** pages (email + password only): kind wording, one line on why an account is needed ("so only you can see your reports"), clear inline errors for the codes in PROJECT.md section 6.
- **Privacy page:** "Your privacy, in plain words": the five truths, the extras (chat text goes to an AI provider; we store your email and a hashed password), the data journey (upload → report made → chat file deleted → report kept until you delete it), and a link to Delete.
- Shared layout: calm header with logo and account menu, footer with the privacy link.
- **Done when:** these pages look finished at 375px and on desktop.

### B3 · Dashboard and new-report flow (T+25 → T+40)
- **Dashboard:** report cards (title, chat type, date, status badge), welcoming empty state, "Start a new report".
- **New report stepper** (one decision per screen):
  1. chat type
  2. export guide (Android/iPhone tabs, "without media", short steps, simple icons)
  3. upload zone → call `/api/uploads/preview` → show participants → **"Which one is you?"** → required consent checkbox with kind wording, and a privacy note beside the upload zone
  4. persona (Cleo selected; locked "coming soon" slots from `/api/personas`)
  5. submit `POST /api/reports` as `multipart/form-data` → go to the processing screen
- **Processing screen:** poll `GET /api/reports/:id` every 3 seconds. Show Cleo and stage-based messages ("Reading your chat…", "Looking at how it changed month to month…", "Writing your report…"). Show: "Your chat file is deleted when this finishes. You can close this tab; your report will be waiting in your reports." On `done`, go to the report page. On `failed`, show a kind error and state that the chat file was still deleted.
- **T+30 checkpoint:** set `VITE_USE_MOCK=false` and test against Agent A's stub.
- **Done when:** the full flow works end to end against the stub.

### B4 · Report page (T+40 → T+58) — the most important screen
Build as separate components so charts can be swapped without touching the layout:
- `StatsDashboard`:
  - **Calendar heatmap** (one square per day, brightness = messages; fill missing days with zero; compact month rows; scrolls horizontally on mobile)
  - Share of voice (donut), who starts (bars), streak, longest silence, record day, by-hour bars (highlight late night), top words and emojis per person
  - Handle N participants (top 6, "Others")
- `MonthlyEvolution`: line/area chart of `closeness` with message volume as a secondary series; 2-3 labelled turning-point markers from `narrative.turningPoints`; a short card for each turning point.
- `Narrative`: editorial reading layout in the serif font; sections with headings; a `ChatBubble` component for quotes (WhatsApp-style, sender name, timestamp, correct side for "me"); render `safetyNote` gently at the top if present.
- Actions: **Download PDF** via `window.print()` with a print stylesheet, and a quiet **Delete this report** with a confirmation modal. (No public share links in this build.)
- A "Take a break" affordance (collapses the narrative to a calm screen with a button to continue).
- **Done when:** the fixture renders beautifully on mobile and desktop, and the page works with real API data at T+55.

### B5 · Settings, delete flows, error states, integration (T+58 → T+68)
- **Settings page:** delete one report (from the list), delete all reports, delete account. Each modal states exactly what will be removed and that it is permanent. Calls `DELETE /api/reports/:id` and `DELETE /api/account`, then clears the token and signs out.
- **Error states:** unsupported file, chat too short, file too large, parse failed, consent missing, processing failed, network error, session expired. Kind wording, never blaming.
- **Loading skeletons** on the dashboard and the report page.
- Turn mock mode off everywhere and test against the real backend with a real export.
- **Done when:** the whole journey runs against the real API.

### B6 · Polish and demo pass (T+68 → T+75)
- Contrast and tap-target check at 360px. Remove any copy that overclaims privacy. Confirm the five truths appear verbatim on the privacy page.
- Remove console logs that print chat text or report content.
- Write `frontend/README.md` (run steps, env vars).
- Walk through the demo script below and fix only blockers.

---

## Demo script (final 3 minutes of the build window)

1. Land on the homepage, show the privacy section.
2. Sign up with email.
3. Start a new report: Romance → export guide → upload an export → pick who you are → consent → Cleo.
4. Watch the processing screen (mention the chat file is deleted when it finishes).
5. Open the report: heatmap, share of voice, monthly evolution with turning points, Cleo's narrative with quote bubbles.
6. Delete the report. Show the privacy page and the Delete account option.

Use a prepared sample export with fictional names, or a chat the human is comfortable showing. Do **not** use someone else's real chat in a public demo.

---

## If you fall behind: what to cut (in this order)

1. PDF download (leave Print only)
2. Locked "coming soon" persona slots
3. Export guide icons (text steps only)
4. Heatmap fanciness (a simple grid is fine)
5. `DELETE /api/account` UI (keep the API)
6. Map step quality: fall back to stats-only closeness (message volume normalised to 0-100) with a note, **never** fake quotes

**Never cut:** consent checkbox, honest privacy page, chat deletion in `finally`, `userId`-scoped queries, the log audit, report delete.

---

## Final checklist (human verifies at T+75)

- [ ] Sign up, upload, report, delete: all work end to end
- [ ] Quotes in the report match the original messages exactly
- [ ] No chat text in server logs, browser console, or the database (open the `Report` table and check the JSON columns)
- [ ] A failed job leaves no chat text anywhere
- [ ] User B cannot see user A's report
- [ ] Privacy page lists the five truths exactly; no overclaiming anywhere
- [ ] Works on a 375px-wide phone screen
- [ ] The product name appears consistently (replace `[PRODUCT NAME]` everywhere)