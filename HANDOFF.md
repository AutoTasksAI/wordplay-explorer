# Read with Rex, Complete Project Handoff

> This document is a complete snapshot of the project as of August 21, 2026.
> Written so any LLM can pick up where we left off with zero context loss.

---

## ⚠️ READ FIRST: Status as of Aug 21, 2026 (build session 5)

The project is **LIVE at https://readwithrex.com** (and
https://www.readwithrex.com). All code is on GitHub
(`AutoTasksAI/wordplay-explorer`, branch `main`, **public**). Local path:
`C:\Users\DELL\Documents\GitHub\wordplay-explorer`. A second-brain backup
is at `C:\Users\DELL\Documents\Codex\2026-07-27\prior-conversation-with-codex-conversation-role\work\pycache\Users\DELL\Documents\GitHub\claude-second-brain\projects\read-with-rex\`.

**Post-launch QA is complete and passing**: guest sign-in, save/restore with
parent email + PIN, email OTP delivery end-to-end (real inbox), and the
For-Parents newsletter signup. Google Search Console is verified
(`sc-domain:readwithrex.com`) with `sitemap.xml` submitted (7 URLs, Success).
Plausible is live (per-site script installed). The favicon is now the yellow +
green T-Rex. ElevenLabs TTS is confirmed working (`synthesizeSpeech`
succeeds and caches).

### Session 5 (2026-08-21): QA, production fixes, adaptive levels + gamification

**Production bugs found by QA and fixed:**
1. **Convex WebSocket 404**: `VITE_CONVEX_URL` in Cloudflare Pages had a
   trailing slash, producing `convex.cloud//api/...`. Fixed the env var in the
   Pages dashboard AND made `src/main.tsx` strip trailing slashes defensively
   (commit `b30423c`).
2. **Missing auth keys**: guest sign-in failed with "Missing environment
   variable `JWT_PRIVATE_KEY`". Generated an RS256 keypair with `jose`
   (same format as `@convex-dev/auth`'s own generator) and set
   `JWT_PRIVATE_KEY` + `JWKS` in the Convex Keys tab. Secrets are NOT in the
   repo.
3. **Missing `SITE_URL`**: email OTP needs it; set to
   `https://readwithrex.com`.
4. **Resend sender broken twice over**: `EMAIL_FROM` was just
   `"Read with Rex"` (no address → 422). Fixed to
   `Read with Rex <rex@readwithrex.com>`. Then Resend rejected sends because
   the old API key belonged to a different Resend account where the domain
   wasn't verified. Fixed by verifying `readwithrex.com` in the current
   Resend account (Cloudflare Domain Connect auto-added the MX/DKIM/SPF
   records) and creating a fresh API key (`wordplay-explorer-convex`) that is
   now in the Convex Keys tab.
5. **EmailOctopus subscribe 400**: the action sent a form-encoded body with
   lowercase `status` and a JSON-string `tags` value. Rewritten to a JSON
   body with `status: "SUBSCRIBED"` and a real tags array, plus
   `MEMBER_EXISTS_WITH_EMAIL_ADDRESS` treated as success (commit `4b0a009`,
   pushed to the deployment via `npx convex deploy` with a deploy key).

**New features (commit `82a7369`):**
- **Adaptive word levels**: Word Safari now has three tiers,
  Starter Words (39) → My World Words (28 environmental words: colors,
  family, food, clothes, home) → Big Kid Words (26 blends/digraph words).
  A tier unlocks when 80% of it is mastered (`computeLevel` in
  `game-core.ts`); fast learners graduate quickly and always have harder
  words waiting, while mastered words keep cycling back via spaced review.
  The start screen shows the current level and how many items remain to the
  next unlock, and unlocking plays a fanfare + spoken announcement.
- **Number Jungle extended to 1-20**: Counting 1 to 10, then Teen Numbers
  11-20 as level 2.
- **Milestone ladder doubled**: creature celebrations every 20 stars now run
  spider(20) → bat(40) → octopus(60) → lizard(80) → dragon(100) →
  unicorn(120) → whale(140) → Rex party(160), then repeat, each one more
  elaborate (`src/lib/milestones.ts` registry + four new celebration
  components).
- **Creature pals collection** on the Game Hub: one tile per milestone with
  a mystery "?" for the next pal, so the long-term reward is visible to kids.

**Other changes:**
- Favicon replaced with a yellow-background green T-Rex (`public/logo.svg`,
  commit `830746e`). The old Freebuff logo is gone.
- Plausible script swapped for the per-site snippet (commit `2fff603`).
- Mobile UX fixes (commit `1b91904`): landing/printables/content headers fit
  on one line at 390px, and the save-progress dialog scrolls within the
  viewport so its close button is reachable on phones.

**Verified this session:**
- `npm run lint`: 0 errors (14 harmless fast-refresh warnings).
- `npm run build`: passes.
- Live QA on readwithrex.com: guest sign-in ✅, full game session (8/8 stars
  + celebration) ✅, save with email+PIN ✅, restore on a fresh guest ✅,
  email OTP delivered and verified ✅, newsletter signup success toast ✅,
  sitemap submitted ✅, Plausible site created ✅.
- Convex logs show `speech:synthesizeSpeech` succeeding after the owner
  fixed the ElevenLabs key.

## ⚠️ READ FIRST: Status as of Aug 22, 2026 (build session 6)

The project is **LIVE at https://readwithrex.com** (and
https://www.readwithrex.com). All code is on GitHub
(`AutoTasksAI/wordplay-explorer`, branch `main`, **public**). Local path:
`C:\Users\DELL\Documents\GitHub\wordplay-explorer`. A second-brain backup
is at `C:\Users\DELL\Documents\Codex\2026-07-27\prior-conversation-with-codex-conversation-role\work\pycache\Users\DELL\Documents\GitHub\claude-second-brain\projects\read-with-rex\`.

**Post-launch QA is complete and passing**: guest sign-in, save/restore with
parent email + PIN, email OTP delivery end-to-end (real inbox), and the
For-Parents newsletter signup. Google Search Console is verified
(`sc-domain:readwithrex.com`) with `sitemap.xml` submitted (7 URLs, Success).
Plausible is live (per-site script installed). ElevenLabs TTS confirmed working.

### Session 6 (2026-08-22): PageSpeed + share/SEO polish

**Performance (commit `0fb7ddf`):**
- Self-hosted the Fredoka variable font: `public/fonts/fredoka-latin-var.woff2`
  (latin subset, weights 400-700 in one 29 KB file). Removed the Google Fonts
  `@import` from `src/index.css`, added `@font-face` AFTER the Tailwind
  imports (ordering matters), and added `<link rel="preload">` in index.html.
  This removes two render-blocking round trips (~800 ms of the old FCP/LCP).
  PageSpeed was 82 performance / FCP 3.4s / LCP 3.5s before; re-run the test
  to confirm the improvement.
- Note: remaining "reduce unused JavaScript" (~77 KiB) is the React+Convex
  core; TBT is already 10 ms so this is low priority.

**Share/search polish (same commit):**
- Created `public/og-image.png` (1200x630 branded share card) + PNG icons
  (`public/icons/icon-48.png`, `public/icons/apple-touch-icon.png` 180px),
  generated from logo.svg via headless screenshots.
- index.html: added PNG icon links, apple-touch-icon, font preload,
  `og:image` + `twitter:card summary_large_image` with ABSOLUTE image URL,
  and `logo`/`image` on the WebApplication JSON-LD.
- manifest.webmanifest icons now include the PNGs alongside logo.svg.

### What happened in session 3 (2026-08-20): Freebuff cleanup + first real backend

**Owner actions completed:**
- Bought the domain **`readwithrex.com`** on Namecheap.
- Created a **Convex account** (team `josh-a2865`) and project
  `wordplay-explorer`; ran `npx convex dev --once` which created the dev
  deployment **`https://calculating-basilisk-420.convex.cloud`**, pushed the
  schema (all tables + indexes + auth tables), and regenerated
  `src/convex/_generated/`.

**Code changes made by the agent (committed to `main` as `fc6da9d`, pushed
2026-08-20):**
- `src/convex/auth/emailOtp.ts`, **Freebuff OTP → Resend**. The hardcoded
  Freebuff API key / `auth.freebuff.app/send_otp` call is gone. It now POSTs to
  Resend's API using `RESEND_API_KEY` + `EMAIL_FROM` env vars and emails the
  parent a friendly 6-digit code (15-min expiry). Reads keys from the Convex
  Keys tab, so no secret lives in the repo.
- `src/convex/auth.config.ts`, removed the Freebuff `customJwt` provider;
  only the standard Convex OIDC provider remains.
- `src/main.tsx`, removed `@vly-ai/integrations`, `VlyToolbar` +
  `ToolbarErrorBoundary`, and the iframe `RouteSyncer` (postMessage to
  window.parent). Convex client init moved into an `App()` component that shows
  a friendly "not set up yet" screen if `VITE_CONVEX_URL` is missing instead of
  crashing.
- `src/pages/Auth.tsx`, removed the "Secured by freebuff.com" footer.
- `vite.config.ts`, removed `vlyPlugin()` and its react-dedupe note.
- `package.json`, removed `@vly-ai/integrations`, `@zumer/snapdom`, `axios`.
  `package-lock.json` pruned via `npm install`.
- Deleted: `vly-toolbar-readonly.tsx`, `src/lib/vly-integrations.ts`,
  `src/instrumentation.tsx`, `integrations.md`.
- `tsconfig.app.json`, dropped the deleted `vly-toolbar-readonly.tsx` include.
- Docs updated to current reality: `LAUNCH.md`, `HANDOFF.md`, `PLAN.md`
  (real Convex URL, checked-off steps), `.env.example`.

**Verified this session:**
- `npm run build` passes (tsc + vite, 0 errors). Note: earlier this session the
  build was blocked only on missing `_generated/`; it now exists.
- `npm run preview` smoke test: `/`, `/sight-words`, `/game/words`, `/privacy`,
  `/auth` all return HTTP 200 with the correct title + canonical URL.
- `eslint` on all changed files: 0 errors (the repo had 14 pre-existing lint
  errors that were fixed in the follow-up cleanup below).

### Build cleanup (same day, commit `45f3c53`)

**Code changes made by the agent (committed to `main` as `45f3c53`, pushed
2026-08-20):**
- Fixed all 14 pre-existing ESLint errors:
  - `src/hooks/use-mobile.ts`, initialize `isMobile` from `window.innerWidth`
    instead of calling `setState` inside the effect body.
  - `src/convex/savedProgressCore.ts`, removed unused `mutation` import.
  - `src/components/ui/carousel.tsx`, deferred the initial Embla state sync
    with `setTimeout` to avoid a synchronous setState cascade in the effect.
  - `src/components/ui/sidebar.tsx`, replaced `Math.random()` in skeleton
    width with a deterministic hash of `React.useId()`.
  - `src/components/SpiderCelebration.tsx`, replaced `Math.random()` in web
    spot placement with a seeded pseudo-random generator keyed by milestone.
  - `src/components/ModuleShell.tsx`, replaced all render-phase `Math.random()`
    and `Date.now()` calls with seeded random + a ref-based burst id; deferred
    the milestone celebration trigger to avoid setState inside the effect.
- Deleted the stale tracked `isolate/` directory (old Freebuff build artifact).
- Added the Plausible analytics script to `index.html`
  (`data-domain="readwithrex.com"`), activates once the owner creates the
  Plausible site.
- Added `docs/email-templates.md` with lead-magnet delivery, welcome, weekly
  tips, and save-progress reminder copy.

**Verified this cleanup:**
- `npm run lint` → **0 errors, 13 warnings** (warnings are only shadcn/ui
  `react-refresh/only-export-components` fast-refresh warnings and are
  harmless).
- `npm run build` passes (tsc + vite, 0 errors). The "empty convex-vendor chunk"
  warning remains harmless.
- `npm run preview` smoke test: `/`, `/sight-words`, `/game/words`, `/privacy`,
  `/auth`, `/terms` all return HTTP 200 with the correct title.

### Auth + copy cleanup (same day, commit `9c32251`)

**Code changes made by the agent (committed to `main` as `9c32251`, pushed
2026-08-20):**
- Fixed the infinite spinner on both **Guest** and **Email OTP** sign-in. The
  root cause was `useAuth()` treating the `api.users.currentUser` query loading
  state as part of auth loading. Now `isLoading` comes directly from
  `useConvexAuth()`, so sign-in completes as soon as the auth provider says it
  is done.
- Removed every em dash (`—`) from user-facing copy and internal docs, replacing
  each with a comma or period.
- Fixed comma splices introduced by the em-dash replacement across
  `index.html`, `Landing.tsx`, `Privacy.tsx`, `Terms.tsx`, `HowToTeach.tsx`,
  `ReadingMilestones.tsx`, `FirstWordsOrder.tsx`, `SightWords.tsx`, `Auth.tsx`,
  `ContentLayout.tsx`, `docs/email-templates.md`, and `public/llms.txt`.
- Made the FAQ copy in `index.html` JSON-LD match the on-page FAQ in
  `Landing.tsx`.
- Standardized the "free / no account / no ads" phrasing across pages.

**Verified this cleanup:**
- `npm run lint` → **0 errors, 13 warnings** (harmless shadcn/ui fast-refresh
  warnings).
- `npm run build` passes (tsc + vite, 0 errors).
- `npm run preview` smoke test: `/`, `/sight-words`, `/game/words`, `/privacy`,
  `/auth`, `/terms` all return HTTP 200 with the correct title.

### Session 4 (2026-08-21): Deploy to production

**What was broken:** `readwithrex.com` returned Cloudflare **522** and
`www.readwithrex.com` returned **525**. The Pages project existed and
`wordplay-explorer.pages.dev` returned 200, but no custom domains were
attached. DNS was still pointing at leftover Namecheap records (apex A record
to `162.255.119.78`, `www` CNAME to `parkingpage.namecheap.com`).

**What was fixed:**
- Fixed the local Playwright MCP config (reverted to the official
  `npx @playwright/mcp@latest` command) so the agent could drive the browser.
- In Cloudflare Pages → `wordplay-explorer` → Custom domains:
  - Added `readwithrex.com`. Cloudflare replaced the bad A record with a
    CNAME to `wordplay-explorer.pages.dev`.
  - Added `www.readwithrex.com`. Cloudflare replaced the Namecheap parking
    CNAME with a CNAME to `wordplay-explorer.pages.dev`.
  - Clicked **Complete DNS setup** for `www`; both domains now show
    **Active** with SSL enabled.
- Fixed Git auto-deploy:
  - The Cloudflare GitHub app was only granted access to
    `claude-second-brain` and `saaspartan-site`.
  - Granted access to **All repositories** (which includes
    `AutoTasksAI/wordplay-explorer`).
  - The Cloudflare warning “This project is disconnected from your Git
    account” is now gone.

**Verified:**
- `curl -I https://readwithrex.com` → `200 OK`.
- `curl -I https://www.readwithrex.com` → `200 OK`.
- Browser screenshot confirms the Read with Rex homepage loads correctly.
- Cloudflare custom-domains tab shows both domains **Active**.
- Cloudflare Settings tab no longer shows the Git disconnect warning.

### The exact next step for a new thread

1. **Finish the EmailOctopus welcome automation** (owner already logged into
   the dashboard; account "Read With Rex" has the Automations feature):
   - Go to Automations → create one. Trigger: contact added to the parent
     list. Email 1, sent immediately: subject
     "Your free sight-word flashcards are here 🦖", body from
     `docs/email-templates.md` (section 1), linking to
     https://readwithrex.com/sight-words.
   - Test by subscribing a real address via the landing-page form and
     checking the inbox (a temp mail.gw inbox was used before:
     rexqa91826@westcast-systems.com, token in agent temp files).
   - Note: sending may require verifying a from-address/domain inside
     EmailOctopus first (rex@readwithrex.com or similar); follow the wizard.
2. **Ask Google to re-crawl** so the new favicon + OG image show in search /
   share previews: GSC → URL inspection → https://readwithrex.com/ → Request
   indexing. Also run PageSpeed again to confirm the font fix.
3. **Owner-only leftovers**: switch the Plausible account email from the temp
   inbox to the owner's; build the weekly tips cadence later (template in
   docs/email-templates.md section 3).
4. Optional: production Convex deployment (`npx convex deploy` + swap
   `VITE_CONVEX_URL`), Bing Webmaster Tools.

### Troubleshooting notes

- `public/_redirects` handles SPA routing on Cloudflare Pages.
- If future Cloudflare Pages builds fail because the repo is disconnected,
  check GitHub → Settings → Applications → Cloudflare Workers and Pages →
  Configure, and ensure `AutoTasksAI/wordplay-explorer` is granted access
  (or switch back to "All repositories").
- The accidental `wordplay-explorer` Cloudflare Worker was not found in the
  current dashboard; the working Pages project is named `wordplay-explorer`.
  If a stray Worker ever appears and interferes, delete it from Workers &
  Pages.
- Convex function pushes can be done non-interactively with a deploy key:
  `CONVEX_DEPLOY_KEY=<key> npx convex deploy`. A key named
  `agent-qa-session` exists on the dev deployment for this; rotate or delete
  it in the dashboard if it is no longer needed.

### Open items for the next agent (ask before large changes)

- ✅ ~~Add the Plausible analytics script to `index.html`~~, done in `45f3c53`
  and swapped to the per-site snippet in `2fff603`; site created in Plausible.
- ✅ ~~Draft the parent welcome email + sight-word lead-magnet delivery copy~~,
  done in `docs/email-templates.md` (`45f3c53`). EmailOctopus automation still
  needs owner setup.
- ✅ ~~Fix the 14 pre-existing lint errors~~, done in `45f3c53`.
- ✅ ~~Remove the stray tracked `isolate/` directory~~, done in `45f3c53`.
- ✅ ~~Set Resend + EmailOctopus + ElevenLabs keys in Convex~~, done by owner
  (ElevenLabs re-fixed by owner in session 5; TTS confirmed working).
- ✅ ~~Deploy to Cloudflare Pages and point `readwithrex.com`~~, done in
  session 4. Both apex and `www` are active with SSL; Git auto-deploy works.
- ✅ ~~Post-launch QA~~, done in session 5: guest/email OTP, save/restore,
  newsletter all pass end-to-end.
- ✅ ~~Google Search Console~~, verified in session 5; sitemap submitted
  (7 URLs, Success).
- ✅ ~~Plausible site created~~ in session 5; analytics recording.
- 🔄 **EmailOctopus flashcard delivery automation** (owner).
- 🔄 **Real-device spot check** (owner).
- Optionally create a production Convex deployment (`npx convex deploy`) and
  update `VITE_CONVEX_URL` to its URL.

### Git note
The session-3 changes are **committed and pushed to `main`** as `fc6da9d`
("Swap auth OTP to Resend and remove Freebuff scaffolding"). The follow-up
build cleanup is **committed and pushed to `main`** as `45f3c53` ("chore: fix
lint errors, remove isolate artifact, add Plausible + email templates"). The
auth + copy cleanup is **committed and pushed to `main`** as `9c32251`
("fix(auth): stop guest/email sign-in from spinning forever + remove em dashes").
The session-4 deploy docs update will be committed separately. `.env.local` is
gitignored; `src/convex/_generated/` is now tracked so Cloudflare Pages can
build without an authenticated Convex CLI step. Regenerate it with
`npx convex dev --once` after schema changes.

### Handoff checklist
- [x] Current status and owner are updated.
- [x] Changed files are listed.
- [x] Checks actually run are recorded with their real result.
- [x] Blockers and approvals are explicit.
- [x] Exact next action is written for the next agent.
- [x] Commit + push for another device to resume, DONE (`fc6da9d`).

---

## What This App Is

**Read with Rex** is a voice-first, gamified reading app for a 5-year-old (and
children ages 4–6). It teaches first sight words, counting 1–10, and simple
patterns. The child plays alone with no account management, no ads, and no data
collection from kids. Rex the T-Rex is the mascot/guide.

The app was built by a dad for his son. It started as "WordPlay Explorer" and
was rebranded to "Read with Rex" for SEO (the word "read" in the name is
critical for discoverability).

---

## Tech Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | Vite 7, React 19, TypeScript 5.9, Tailwind v4 | `npm` is the package manager (bun optional) |
| UI | shadcn/ui + Lucide Icons | Neobrutalism Minimalism theme |
| Animation | Framer Motion 12 | Used everywhere, celebrations, transitions, micro-interactions |
| Backend/DB | Convex | Serverless, reactive queries/mutations |
| Auth | Convex Auth (`@convex-dev/auth`) | Guest (anonymous) + email OTP (Resend) |
| Voice | ElevenLabs cartoon voice via Convex action | Fallback to browser speechSynthesis |
| Deploy | Cloudflare Pages (recommended; `public/_redirects` added) or Vercel (`vercel.json`) | SPA |

---

## Project Structure

```
/
├── index.html                  # SEO-optimized: meta tags, OG, JSON-LD
├── vercel.json                 # Vercel deploy config (SPA rewrites)
├── package.json                # All deps (React 19, Convex, Framer Motion, etc.)
├── PLAN.md                     # Full launch/SEO/monetization plan
├── LAUNCH.md                   # Go-public checklist
├── HANDOFF.md                  # This file
├── public/
│   ├── manifest.webmanifest    # PWA manifest
│   ├── robots.txt              # Crawler instructions
│   ├── sitemap.xml             # Static sitemap
│   ├── llms.txt                # AI/LLM discovery
│   └── _redirects              # Cloudflare Pages SPA fallback
├── src/
│   ├── main.tsx                # App entry: providers, routes, error boundary
│   ├── index.css               # Neobrutalism theme tokens, Tailwind config
│   ├── pages/
│   │   ├── Landing.tsx         # Marketing/SEO landing page
│   │   ├── Auth.tsx            # Sign in/up page (guest + email OTP)
│   │   ├── GameHub.tsx         # Module selector (3 cards) + Save Progress
│   │   ├── ModulePage.tsx      # Loads module data, renders ModuleShell
│   │   ├── SightWords.tsx      # /sight-words (50-word printable + schema)
│   │   ├── ReadingMilestones.tsx / HowToTeach.tsx / FirstWordsOrder.tsx
│   │   ├── Privacy.tsx / Terms.tsx   # COPPA-aware legal pages
│   │   └── NotFound.tsx        # 404 page
│   ├── components/
│   │   ├── ModuleShell.tsx     # THE CORE: game loop, rounds, scoring, celebrations
│   │   ├── RequireAuth.tsx     # Auth guard (redirects to /auth?returnTo=...)
│   │   ├── LogoDropdown.tsx    # Brand logo/nav dropdown
│   │   ├── ContentLayout.tsx   # Shared layout for the SEO content pages
│   │   ├── ForParentsSignup.tsx  # Parent email capture (EmailOctopus)
│   │   ├── SaveProgressDialog.tsx # Parent save/restore w/ 4-digit PIN
│   │   ├── SpiderCelebration.tsx / BatCelebration.tsx / OctopusCelebration.tsx / LizardCelebration.tsx
│   │   └── ui/                 # shadcn/ui components
│   └── lib/
│       ├── game-core.ts        # Types, SESSION_LENGTH, MASTERY_COUNT, pickTargets (spaced repetition), pickOptions, buildProgressMap
│       ├── words.tsx           # 39 sight words with emoji, WORDS_MODULE config
│       ├── numbers.tsx         # Numbers 1–10, NUMBERS_MODULE config
│       ├── patterns.tsx        # 5 pattern types (AB, AABB, ABB, AAB, ABC), PATTERNS_MODULE config
│       ├── modules.ts          # MODULE_IDS array, MODULES registry, isModuleId()
│       └── speech.ts           # TTS queue, ElevenLabs + browser fallback, sound effects
└── src/convex/
    ├── schema.ts               # Tables: users, itemProgress, playerStats, savedProgress, audioCache + authTables
    ├── auth.ts                 # convexAuth with [emailOtp, Anonymous]
    ├── auth.config.ts          # OIDC provider (Freebuff customJwt removed)
    ├── http.ts                 # auth HTTP routes
    ├── auth/emailOtp.ts        # Resend-powered OTP (was Freebuff)
    ├── game.ts                 # itemProgress/playerStats queries + mutations
    ├── users.ts                # user helpers
    ├── newsletter.ts           # EmailOctopus subscribe action (env keys)
    ├── savedProgress.ts        # saveProgress/loadProgress actions (parent sync)
    ├── savedProgressCore.ts    # internal queries/mutations + getLinkStatus
    ├── speech.ts               # ElevenLabs synthesizeSpeech action (env key)
    ├── speechCache.ts          # audioCache get/store (internal + public)
    └── _generated/             # GENERATED by `npx convex dev`, tracked for CI builds
```

---

## Routing

| Route | Component | Auth? | Description |
|-------|-----------|-------|-------------|
| `/` | `Landing.tsx` | No | Marketing page, SEO content, FAQ, parent signup |
| `/sight-words` | `SightWords.tsx` | No | 50 sight words printable |
| `/reading-milestones` | `ReadingMilestones.tsx` | No | SEO content |
| `/how-to-teach-a-5-year-old-to-read` | `HowToTeach.tsx` | No | SEO content |
| `/first-words-order` | `FirstWordsOrder.tsx` | No | SEO content |
| `/privacy` `/terms` | `Privacy.tsx` / `Terms.tsx` | No | COPPA-aware legal |
| `/auth` | `Auth.tsx` | No | Guest mode + email OTP sign-in |
| `/game` | `GameHub.tsx` | Yes | Module selector (3 cards) |
| `/game/:module` | `ModulePage.tsx` | Yes | The actual game (words/numbers/patterns) |
| `*` | `NotFound.tsx` | No | 404 |

`redirectAfterAuth` is set to `/game` in `main.tsx`.

---

## Convex Schema

### Tables
- **users**, standard Convex Auth table (name, image, email, isAnonymous, role). Index `email`.
- **itemProgress**, per-item mastery: `(userId, module, item) → {correct, wrong, lastPlayedAt}`. Indexes: `by_user`, `by_user_module_item`.
- **playerStats**, lifetime stars + sessions per user; `linkedEmail` + `lastSyncedAt` for parent sync. Index `by_user`.
- **savedProgress**, parent-saved progress snapshot (keyed by PARENT email, protected by 4-digit PIN hash) for cross-device restore. Index `by_email`.
- **audioCache**, cached TTS audio (base64 mp3) keyed by normalized text. Index `by_key`.
- Plus `authTables()`: authAccounts, authSessions, authRefreshTokens, authVerificationCodes, authVerifiers, authRateLimits.

### Convex Functions (hand-written in `src/convex/`)
- `api.game.*`, itemProgress + playerStats queries/mutations.
- `api.speechCache.getAudio`, query, fetches cached TTS by key.
- `api.speech.synthesizeSpeech`, action, generates TTS via ElevenLabs (needs `ELEVENLABS_API_KEY`).
- `api.newsletter.subscribeEmail`, action, adds a PARENT email to EmailOctopus (needs keys).
- `api.savedProgress.saveProgress` / `loadProgress`, actions for parent sync.
- Auth via `@convex-dev/auth`: `emailOtp` (Resend) + `Anonymous` (guest).

---

## Game Mechanics

### Core Constants (in `game-core.ts`)
- `SESSION_LENGTH = 8` rounds per session (tuned for a 5-year-old's attention span)
- `MASTERY_COUNT = 3` correct answers to "master" an item

### Spaced Repetition (`pickTargets`)
- Items with `correct < MASTERY_COUNT` get priority (still being learned)
- Wrong answers boost priority further (missed items come back sooner)
- Mastered items come back for spaced review (longer gap = higher priority, capped at 10 days)
- Final list is shuffled for variety

### Round Flow (in `ModuleShell.tsx`)
1. **Start screen** → child taps PLAY
2. **Round** → prompt spoken ("Find the word. Cat."), child picks from 3 options
3. **Correct** → praise spoken ("Great job! Cat!"), confetti burst, star earned
4. **Wrong** → gentle "Try again!", option shakes, no star penalty
5. After 8 rounds → **celebration screen** with fanfare + session stars
6. Can PLAY AGAIN or go back to All Games

### Key Rule: speech never cuts off
`speak()` returns a Promise that resolves when audio finishes. Praise waits for
speech completion before advancing to the next round.

### Duplicate speech prevention
The queue coalesces identical phrases, rapid taps won't loop the same line.

---

## The Three Modules

### 1. Word Safari (`words`)
- 39 simple CVC/everyday words with emoji: cat, dog, pig, bee, sun, hat, book, etc.
- Alternates: "Find the word" (show emoji, pick text) ↔ "Find the picture" (show text, pick emoji)
- Color theme: tomato (red)

### 2. Number Jungle (`numbers`)
- Numbers 1–10 with countable emoji grids
- Alternates: "Find the number" (show count, pick numeral) ↔ "Find the picture" (show numeral, pick count)
- Randomizes which emoji is counted each round (same within a round)
- Color theme: sky (blue)

### 3. Pattern Path (`patterns`)
- 5 pattern types: AB, AABB, ABB, AAB, ABC
- 6 colored emoji tiles with one "?" slot
- Alternates: "What comes next?" (hole at end) ↔ "What is missing?" (hole in middle)
- 3 options: the pattern's own colors + one distractor
- Color theme: grass (green)

---

## Star Milestones (Creature Celebrations)

When lifetime stars cross a 20-star boundary, a celebration plays on session end. They cycle every 80 stars:

| Stars | Creature | Duration | What Happens |
|-------|----------|----------|--------------|
| 20 | Spider 🕷️ | ~9s | Drops from top, shoots web lines to every edge, cobwebs pop in, bounces up and down |
| 40 | Bat 🦇 | ~13.5s | Flies in from bottom-left, loops around screen, swoops close (big) then shrinks, flies off top-right. Wings flap the whole time. |
| 60 | Octopus 🐙 | ~11s | Mom + 4 babies swim in closed loops, bubbles rise, then purple ink splatters and covers the screen → **transitions to next module** (words→numbers→patterns→words...) |
| 80 | Lizard 🦎 | ~14.5s | Biggest celebration. Zips in from left, sweeps across screen with sparkle trail, cartoon chirp sounds, hops around, rockets off right edge. |

The cycle repeats: 100 = spider, 120 = bat, 140 = octopus, 160 = lizard.

The **octopus** is special, after the ink covers the screen, `onDone` fires and
the app navigates to the next module in rotation.

---

## Speech System (`speech.ts`)

### Architecture
1. **Queue**: phrases play one at a time, never overlapping
2. **ElevenLabs first**: if `ELEVENLABS_API_KEY` is set, fetches cartoon voice mp3 from Convex cache → synthesizes via action if not cached
3. **Browser fallback**: if ElevenLabs unavailable, uses `window.speechSynthesis` with voice selection (prefers Samantha/Google US English)
4. **Warm-up**: `warmUpSpeech()` pre-generates a session's phrases in background so rounds play instantly
5. **Chrome bug workarounds**: heartbeat pause/resume every 5s prevents stuck speech; `pagehide`/`visibilitychange` listeners cancel ghost utterances

### Sound Effects (WebAudio)
- `playCorrect()`, bright two-note ding
- `playWrong()`, soft low boop (gentle, never scary)
- `playStar()`, sparkle when star pops
- `playFanfare()`, celebration arpeggio at session end
- `playBoing()`, bouncy sound for milestone celebrations
- `playLizard()`, four cartoon chirps for the lizard milestone

### Praises
6 random praises: "Great job!", "Awesome!", "You got it!", "Super!", "Wow, nice!", "You did it!"
One praise is randomly selected per session and used consistently.

---

## Theming: Neobrutalism Minimalism

Defined in `src/index.css`:
- **Square corners** (`--radius: 0px`)
- **3px ink borders** (`.nb-border`)
- **Hard offset shadows** (`.nb-shadow`, `.nb-shadow-sm`, `.nb-shadow-xs`)
- **Flat color blocks**: paper (#fff8e7), ink (#141414), sun (#ffd60a), tomato (#ff4d4d), sky (#2e6bff), grass (#2fbf71), tangerine (#ff8c1a), bubblegum (#ff6bd6)
- **Font**: Fredoka (rounded, kid-friendly)
- **Button states**: hover lifts (-1px, +shadow), active presses (3px, -shadow)

Custom utility classes: `.nb-border`, `.nb-shadow`, `.nb-shadow-sm`, `.nb-shadow-xs`, `.nb-btn`, `.kid-ui`

---

## SEO Implementation (Already Done)

### `index.html`
- Title: "Read with Rex, Free Reading Games for Kids Ages 4-6"
- Meta description with keywords
- Open Graph + Twitter Card tags
- Canonical URL: `https://readwithrex.com` (domain now registered on Namecheap)
- JSON-LD: `WebApplication` + `LearningResource` (audience 4–6, teaches first sight words) + `FAQPage`

### Keywords Baked In (Natural, Not Stuffed)
free reading games for kids, reading games for kindergarten, learn to read, first sight words, sight words for 5 year olds, first words for kids, ages 4–6

### E-E-A-T Signals
- "Made by a dad, for his 5-year-old" section (Experience)
- 6-question FAQ for parents (Trust)
- Deliberately NOT claiming "phonics" (honesty = better E-E-A-T)

### Crawler Files
- `public/robots.txt`, allows all, points to sitemap
- `public/sitemap.xml`, lists all public pages
- `public/manifest.webmanifest`, PWA manifest
- `public/llms.txt`, plain-text page index for LLMs

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_CONVEX_URL` | Client (build time) | Convex backend URL: `https://calculating-basilisk-420.convex.cloud` |
| `RESEND_API_KEY` | Convex Keys tab | OTP emails (code done; key needed) |
| `EMAIL_FROM` | Convex Keys tab | Verified sender for OTP emails (code done; value needed) |
| `EMAILOCTOPUS_API_KEY` | Convex Keys tab | Parent newsletter (code done; key needed) |
| `EMAILOCTOPUS_LIST_ID` | Convex Keys tab | Parent newsletter list (code done; id needed) |
| `ELEVENLABS_API_KEY` | Convex Keys tab | Cartoon voice TTS (optional; browser speech falls back) |
| `SITE_URL`, `JWKS`, `JWT_PRIVATE_KEY` | Convex Keys tab | Auth URLs/JWT config |
| `STRIPE_*` | Convex Keys tab | **NOT YET INTEGRATED**, future premium tier |
| `PLAUSIBLE_*` | Convex Keys tab | **NOT YET INTEGRATED**, optional analytics |

**Never edit .env files / commit secrets.** Keys are managed through the Convex
dashboard → Project Settings → Environment Variables (Keys tab).

---

## What's Done

- ✅ Full game with 3 modules (words, numbers, patterns)
- ✅ Adaptive spaced-repetition word selection
- ✅ Voice prompts + praise (ElevenLabs + browser fallback)
- ✅ Star tracking with lifetime progress
- ✅ 4 creature celebrations (spider/bat/octopus/lizard) at 20/40/60/80 stars
- ✅ Confetti bursts, rain confetti, sound effects
- ✅ Neobrutalism Minimalism theme (complete)
- ✅ Mobile responsive
- ✅ Auth (guest + email OTP via Resend, code done)
- ✅ Protected routes
- ✅ SEO: title, meta, OG, JSON-LD, robots, sitemap, llms.txt
- ✅ Landing page with FAQ, E-E-A-T sections
- ✅ Brand rename (WordPlay Explorer → Read with Rex)
- ✅ PLAN.md with full launch/monetization roadmap
- ✅ Vercel + Cloudflare Pages deploy configs
- ✅ Parent email capture (ForParentsSignup + EmailOctopus action), needs keys
- ✅ Parent progress save/restore (cross-device sync, COPPA-safe), needs keys
- ✅ 4 SEO content pages with structured data (sight-words, milestones, how-to-teach, first-words order)
- ✅ Privacy policy + Terms pages (COPPA-aware)
- ✅ LAUNCH.md go-public checklist
- ✅ Freebuff removal (OTP→Resend, toolbar, integrations, customJwt, axios)
- ✅ Real Convex backend (dev deployment live, schema pushed, build passing)

## What's NOT Done (from PLAN.md)

### Phase 0, Deploy
- [x] Register `readwithrex.com` domain (Namecheap)
- [x] Create Convex account/project + get `VITE_CONVEX_URL`
- [x] Swap email OTP from Freebuff → Resend (code)
- [x] Remove Freebuff scaffolding
- [x] Set Convex env vars (RESEND_*, EMAILOCTOPUS_*, ELEVENLABS_API_KEY, SITE_URL, JWKS, JWT_PRIVATE_KEY)
- [x] Deploy to Cloudflare Pages + point the domain (`readwithrex.com` and `www`)
- [x] Reconnect Git auto-deploy
- [ ] (Optional) Production Convex deployment via `npx convex deploy`
- [ ] Google Search Console setup (verify domain, submit sitemap)

### Phase 1, SEO Growth
- [x] Parent blog articles + printables (4 pages live), add more (5–10 total)
- [ ] Plausible Analytics integration (optional)
- [ ] Prerender landing page for crawlers (optional)

### Phase 2, Monetization
- [ ] EmailOctopus list LIVE (code done; needs account + keys)
- [ ] Parent welcome email + lead-magnet delivery (draft needed)
- [ ] Stripe premium tier (~$29.99/yr): new modules, parent dashboard
- [ ] Amazon Associates affiliate on blog articles
- [ ] Display ads on parent-facing pages only (never in-game)

### COPPA Rules (Non-Negotiable)
- No personal info from kids inside the game
- No in-game ads
- No data selling
- All monetization on parent-facing pages only
- Analytics must be cookie-free (Plausible)

---

## Known Issues / Gotchas

1. **OTP email is only testable once keys are set**: without `RESEND_API_KEY` +
   `EMAIL_FROM` in the Keys tab, the Resend action throws a clear error and the
   user can't finish email sign-in (guest mode still works). This is expected
   until the owner adds the keys.

2. **Domain references**: `index.html`, `robots.txt`, and `sitemap.xml` use
   `https://readwithrex.com`. The domain is registered on Namecheap; update
   references only if the final domain differs (e.g. a different TLD).

3. **Voice can still cut off in rare cases**: The Chrome speechSynthesis bug
   workarounds are solid but not 100%. The ElevenLabs path (mp3 playback) is
   more reliable.

4. **The octopus celebration navigates away**: After the ink covers the screen,
   `handleOctopusDone` navigates to the next module. If the celebration is
   interrupted, the navigation might not fire.

5. **Pattern module answer logic**: The answer for "what comes next?" is
   `cycle[6 % cycle.length]` (the 7th position, which is the start of the next
   cycle). For "what is missing?", it's `cycle[2 % cycle.length]`. This was
   debugged, make sure any changes preserve this logic.

6. **Convex CLI needs an interactive terminal**: `npx convex login` / `dev`
   refuse non-interactive (agent) shells ("Cannot prompt for input in
   non-interactive terminals"). The owner must run these themselves; agents can
   run `npm run build`, `npm run preview`, and `eslint` freely.

7. ✅ ~~`isolate/` was a stale build artifact~~ removed in `45f3c53`.

8. **Vite build emits an empty `convex-vendor` chunk warning**, harmless
   (no top-level `convex` import to bundle there).

9. ✅ ~~Pre-existing lint debt: 14 ESLint errors~~ fixed in `45f3c53`.

---

## Design Tokens (for quick reference)

```
--paper: #fff8e7    (warm cream background)
--ink: #141414      (borders, text)
--sun: #ffd60a      (yellow accent, stars)
--tomato: #ff4d4d   (red, Word Safari)
--sky: #2e6bff      (blue, Number Jungle)
--grass: #2fbf71    (green, Pattern Path, correct answers)
--tangerine: #ff8c1a (orange)
--bubblegum: #ff6bd6 (pink)
--radius: 0px       (square corners always)
--font: Fredoka     (kid-friendly rounded)
--border: 3px solid #141414
--shadow: 6px 6px 0 0 #141414
```

---

## How to Work on This Project

1. `npm install` then `npm run dev` for the Vite dev server.
2. Files in `src/` are the source of truth.
3. Convex backend code lives in `src/convex/`. After changing it, the owner (or
   a terminal with an active login) runs `npx convex dev --once` to push +
   regenerate `src/convex/_generated/`. `src/convex/_generated/` is tracked so
   Cloudflare Pages can build without an authenticated Convex CLI step; commit
   the regenerated files when you change the schema.
4. Typecheck: `npm run build` (runs `tsc -b`). Lint: `npm run lint`.
5. Local preview of the production bundle: `npm run preview`.
6. Deploy: Cloudflare Pages (recommended) or Vercel, set
   `VITE_CONVEX_URL=https://calculating-basilisk-420.convex.cloud` as a build
   env var (dev deployment; swap for the production URL when created).

---

## Author's Note

This app started as a personal project for one kid and is now publicly live
at `https://readwithrex.com`. The owner's son loves it and plays regularly.
The next big milestones are post-launch QA (guest/email OTP, save/restore,
newsletter signup), Google Search Console verification, and starting the
SEO/content flywheel. Monetization is secondary; the priority is getting
parents to find and use the free app.

The owner is budget-conscious. Most of the monetization plan uses free tiers
(EmailOctopus, Plausible trial, Vercel/Cloudflare free). Paid services (Stripe)
only come when there's real traffic.