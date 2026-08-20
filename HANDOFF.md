# Read with Rex — Complete Project Handoff

> This document is a complete snapshot of the project as of August 20, 2026.
> Written so any LLM can pick up where we left off with zero context loss.

---

## ⚠️ READ FIRST — Status as of Aug 20, 2026 (build session 3)

The project is **NOT deployed or public yet** — but it is now fully buildable
and running against the owner's real backend. All code is on GitHub
(`AutoTasksAI/wordplay-explorer`, branch `main`). The remaining work to go
public is **owner account creation + keys + deploy** (Resend, EmailOctopus,
ElevenLabs, Cloudflare Pages, domain pointing). Full checklist: **`LAUNCH.md`**.

### What happened in session 3 (2026-08-20) — Freebuff cleanup + first real backend

**Owner actions completed:**
- Bought the domain **`readwithrex.com`** on Namecheap.
- Created a **Convex account** (team `josh-a2865`) and project
  `wordplay-explorer`; ran `npx convex dev --once` which created the dev
  deployment **`https://calculating-basilisk-420.convex.cloud`**, pushed the
  schema (all tables + indexes + auth tables), and regenerated
  `src/convex/_generated/`.

**Code changes made by the agent (all in the working tree, NOT yet committed):**
- `src/convex/auth/emailOtp.ts` — **Freebuff OTP → Resend**. The hardcoded
  Freebuff API key / `auth.freebuff.app/send_otp` call is gone. It now POSTs to
  Resend's API using `RESEND_API_KEY` + `EMAIL_FROM` env vars and emails the
  parent a friendly 6-digit code (15-min expiry). Reads keys from the Convex
  Keys tab, so no secret lives in the repo.
- `src/convex/auth.config.ts` — removed the Freebuff `customJwt` provider;
  only the standard Convex OIDC provider remains.
- `src/main.tsx` — removed `@vly-ai/integrations`, `VlyToolbar` +
  `ToolbarErrorBoundary`, and the iframe `RouteSyncer` (postMessage to
  window.parent). Convex client init moved into an `App()` component that shows
  a friendly "not set up yet" screen if `VITE_CONVEX_URL` is missing instead of
  crashing.
- `src/pages/Auth.tsx` — removed the "Secured by freebuff.com" footer.
- `vite.config.ts` — removed `vlyPlugin()` and its react-dedupe note.
- `package.json` — removed `@vly-ai/integrations`, `@zumer/snapdom`, `axios`.
  `package-lock.json` pruned via `npm install`.
- Deleted: `vly-toolbar-readonly.tsx`, `src/lib/vly-integrations.ts`,
  `src/instrumentation.tsx`, `integrations.md`.
- `tsconfig.app.json` — dropped the deleted `vly-toolbar-readonly.tsx` include.
- Docs updated to current reality: `LAUNCH.md`, `HANDOFF.md`, `PLAN.md`
  (real Convex URL, checked-off steps), `.env.example`.

**Verified this session:**
- `npm run build` passes (tsc + vite, 0 errors). Note: earlier this session the
  build was blocked only on missing `_generated/`; it now exists.
- `npm run preview` smoke test: `/`, `/sight-words`, `/game/words`, `/privacy`,
  `/auth` all return HTTP 200 with the correct title + canonical URL.
- `eslint` on all changed files: 0 errors (the repo has 14 pre-existing lint
  errors elsewhere — see "Open items" below).

### The exact next step for a new thread

1. Have the owner create the remaining free accounts and paste keys into the
   Convex dashboard → Project Settings → Environment Variables:
   - **Resend** → `RESEND_API_KEY` + `EMAIL_FROM` (e.g. `Read with Rex
     <hello@readwithrex.com>`; swap to the real domain later).
   - **EmailOctopus** → create a "Parents" list → `EMAILOCTOPUS_API_KEY` +
     `EMAILOCTOPUS_LIST_ID`.
   - **ElevenLabs** (optional) → `ELEVENLABS_API_KEY` (browser speech is the
     fallback until then).
   - `SITE_URL`, `JWKS`, `JWT_PRIVATE_KEY` are also listed in LAUNCH.md for
     auth; confirm they're set for the dev deployment.
2. **Deploy** to Cloudflare Pages: connect the GitHub repo → build
   `npm install && npm run build`, output `dist`, env
   `VITE_CONVEX_URL=https://calculating-basilisk-420.convex.cloud` → point
   `readwithrex.com` (set Namecheap nameservers at Cloudflare). `public/
   _redirects` already handles SPA routes. (Vercel alternative: `vercel.json`
   is configured.)
3. Verify email OTP live: sign in at `/auth` with a parent email and confirm
   the code arrives via Resend.
4. Google Search Console: verify the domain, submit `sitemap.xml`.

### Open items for the next agent (ask before large changes)
- Commit + push the session-3 working-tree changes to `main` (owner approval —
  see Git note below).
- Add the Plausible analytics script to `index.html` (owner account needed).
- Draft the parent welcome email + sight-word lead-magnet delivery copy.
- Fix the 14 pre-existing lint errors (`npm run lint`: `use-mobile.ts`
  setState-in-effect, `savedProgressCore.ts` unused import, several
  "impure function during render" / setState-in-effect in game components).
- Remove the stray tracked `isolate/` directory (stale Freebuff build artifact
  committed by accident) — confirm with the owner first.
- Optionally create a production Convex deployment (`npx convex deploy`) and
  update `VITE_CONVEX_URL` to its URL before or at launch.

### Git note
The session-3 changes are in the working tree but **not committed or pushed**
as of this handoff. Run `git status` to see the list (modified: `package.json`,
`package-lock.json`, `src/main.tsx`, `src/pages/Auth.tsx`, `src/convex/auth.ts`,
`src/convex/auth.config.ts`, `src/convex/auth/emailOtp.ts`, `vite.config.ts`,
`tsconfig.app.json`, `.env.example`, `LAUNCH.md`, `HANDOFF.md`, `PLAN.md`;
deleted: `vly-toolbar-readonly.tsx`, `src/lib/vly-integrations.ts`,
`src/instrumentation.tsx`, `integrations.md`). `.env.local` and
`src/convex/_generated/` are gitignored (generated/secret — never commit).

### Handoff checklist
- [x] Current status and owner are updated.
- [x] Changed files are listed.
- [x] Checks actually run are recorded with their real result.
- [x] Blockers and approvals are explicit.
- [x] Exact next action is written for the next agent.
- [ ] Commit + push for another device to resume — pending owner approval.

---

## What This App Is

**Read with Rex** is a voice-first, gamified reading app for a 5-year-old (and
children ages 4–6). It teaches first sight words, counting 1–10, and simple
patterns. The child plays alone — no account management, no ads, no data
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
| Animation | Framer Motion 12 | Used everywhere — celebrations, transitions, micro-interactions |
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
    └── _generated/             # GENERATED by `npx convex dev` — gitignored
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
- **users** — standard Convex Auth table (name, image, email, isAnonymous, role). Index `email`.
- **itemProgress** — per-item mastery: `(userId, module, item) → {correct, wrong, lastPlayedAt}`. Indexes: `by_user`, `by_user_module_item`.
- **playerStats** — lifetime stars + sessions per user; `linkedEmail` + `lastSyncedAt` for parent sync. Index `by_user`.
- **savedProgress** — parent-saved progress snapshot (keyed by PARENT email, protected by 4-digit PIN hash) for cross-device restore. Index `by_email`.
- **audioCache** — cached TTS audio (base64 mp3) keyed by normalized text. Index `by_key`.
- Plus `authTables()`: authAccounts, authSessions, authRefreshTokens, authVerificationCodes, authVerifiers, authRateLimits.

### Convex Functions (hand-written in `src/convex/`)
- `api.game.*` — itemProgress + playerStats queries/mutations.
- `api.speechCache.getAudio` — query, fetches cached TTS by key.
- `api.speech.synthesizeSpeech` — action, generates TTS via ElevenLabs (needs `ELEVENLABS_API_KEY`).
- `api.newsletter.subscribeEmail` — action, adds a PARENT email to EmailOctopus (needs keys).
- `api.savedProgress.saveProgress` / `loadProgress` — actions for parent sync.
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
The queue coalesces identical phrases — rapid taps won't loop the same line.

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

The **octopus** is special — after the ink covers the screen, `onDone` fires and
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
- `playCorrect()` — bright two-note ding
- `playWrong()` — soft low boop (gentle, never scary)
- `playStar()` — sparkle when star pops
- `playFanfare()` — celebration arpeggio at session end
- `playBoing()` — bouncy sound for milestone celebrations
- `playLizard()` — four cartoon chirps for the lizard milestone

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
- Title: "Read with Rex — Free Reading Games for Kids Ages 4-6"
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
- `public/robots.txt` — allows all, points to sitemap
- `public/sitemap.xml` — lists all public pages
- `public/manifest.webmanifest` — PWA manifest
- `public/llms.txt` — plain-text page index for LLMs

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
| `STRIPE_*` | Convex Keys tab | **NOT YET INTEGRATED** — future premium tier |
| `PLAUSIBLE_*` | Convex Keys tab | **NOT YET INTEGRATED** — optional analytics |

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
- ✅ Auth (guest + email OTP via Resend — code done)
- ✅ Protected routes
- ✅ SEO: title, meta, OG, JSON-LD, robots, sitemap, llms.txt
- ✅ Landing page with FAQ, E-E-A-T sections
- ✅ Brand rename (WordPlay Explorer → Read with Rex)
- ✅ PLAN.md with full launch/monetization roadmap
- ✅ Vercel + Cloudflare Pages deploy configs
- ✅ Parent email capture (ForParentsSignup + EmailOctopus action) — needs keys
- ✅ Parent progress save/restore (cross-device sync, COPPA-safe) — needs keys
- ✅ 4 SEO content pages with structured data (sight-words, milestones, how-to-teach, first-words order)
- ✅ Privacy policy + Terms pages (COPPA-aware)
- ✅ LAUNCH.md go-public checklist
- ✅ Freebuff removal (OTP→Resend, toolbar, integrations, customJwt, axios)
- ✅ Real Convex backend (dev deployment live, schema pushed, build passing)

## What's NOT Done (from PLAN.md)

### Phase 0 — Deploy (remaining = owner keys + hosting)
- [x] Register `readwithrex.com` domain (Namecheap)
- [x] Create Convex account/project + get `VITE_CONVEX_URL`
- [x] Swap email OTP from Freebuff → Resend (code)
- [x] Remove Freebuff scaffolding
- [ ] Set Convex env vars (RESEND_*, EMAILOCTOPUS_*, ELEVENLABS_API_KEY, SITE_URL, JWKS, JWT_PRIVATE_KEY)
- [ ] Deploy to Cloudflare Pages (or Vercel) + point the domain
- [ ] (Optional) Production Convex deployment via `npx convex deploy`
- [ ] Google Search Console setup (verify domain, submit sitemap)

### Phase 1 — SEO Growth
- [x] Parent blog articles + printables (4 pages live) — add more (5–10 total)
- [ ] Plausible Analytics integration (optional)
- [ ] Prerender landing page for crawlers (optional)

### Phase 2 — Monetization
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
   debugged — make sure any changes preserve this logic.

6. **Convex CLI needs an interactive terminal**: `npx convex login` / `dev`
   refuse non-interactive (agent) shells ("Cannot prompt for input in
   non-interactive terminals"). The owner must run these themselves; agents can
   run `npm run build`, `npm run preview`, and `eslint` freely.

7. **`isolate/` is a stale build artifact** committed by the Freebuff scaffold
   (old hashed bundles). Harmless but dead weight; removing it needs owner OK.

8. **Vite build emits an empty `convex-vendor` chunk warning** — harmless
   (no top-level `convex` import to bundle there).

9. **Pre-existing lint debt**: 14 ESLint errors (not from the cleanup) in
   `src/hooks/use-mobile.ts`, `src/convex/savedProgressCore.ts`, and several
   game components (`setState in effect` / `impure function during render`).
   Not build-blocking (`npm run build` doesn't lint), but worth fixing before
   launch.

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
   a terminal with an active login) runs `npx convex dev` to push + regenerate
   `src/convex/_generated/`. Agents without an interactive terminal can still
   run `npm run build` since `_generated/` is now present in the working tree.
4. Typecheck: `npm run build` (runs `tsc -b`). Lint: `npm run lint`.
5. Local preview of the production bundle: `npm run preview`.
6. Deploy: Cloudflare Pages (recommended) or Vercel — set
   `VITE_CONVEX_URL=https://calculating-basilisk-420.convex.cloud` as a build
   env var (dev deployment; swap for the production URL when created).

---

## Author's Note

This app started as a personal project for one kid and is now being prepared
for public release. The owner's son loves it and plays regularly. The next big
milestone is getting the remaining free accounts + keys, deploying to Cloudflare
Pages, pointing the Namecheap domain, and starting the SEO/content flywheel.
Monetization is secondary — the priority is getting parents to find and use the
free app.

The owner is budget-conscious. Most of the monetization plan uses free tiers
(EmailOctopus, Plausible trial, Vercel/Cloudflare free). Paid services (Stripe)
only come when there's real traffic.