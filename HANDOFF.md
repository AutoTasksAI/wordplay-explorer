# Read with Rex — Complete Project Handoff

> This document is a complete snapshot of the project as of August 20, 2026.
> Written so any LLM can pick up where we left off with zero context loss.

---

## What This App Is

**Read with Rex** is a voice-first, gamified reading app for a 5-year-old (and children ages 4–6). It teaches first sight words, counting 1–10, and simple patterns. The child plays alone — no account management, no ads, no data collection from kids. Rex the T-Rex is the mascot/guide.

The app was built by a dad for his son. It started as "WordPlay Explorer" and was rebranded to "Read with Rex" for SEO (the word "read" in the name is critical for discoverability).

---

## Tech Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | Vite 7, React 19, TypeScript 5.9, Tailwind v4 | `bun` is the package manager |
| UI | shadcn/ui + Lucide Icons | Neobrutalism Minimalism theme |
| Animation | Framer Motion 12 | Used everywhere — celebrations, transitions, micro-interactions |
| Backend/DB | Convex | Serverless, reactive queries/mutations |
| Auth | Convex Auth (`@convex-dev/auth`) | Guest (anonymous) + email OTP |
| Voice | ElevenLabs cartoon voice via Convex action | Fallback to browser speechSynthesis |
| Deploy | Vercel (config already in `vercel.json`) | SPA with Bun build |

---

## Project Structure

```
/
├── index.html                  # SEO-optimized: meta tags, OG, JSON-LD
├── vercel.json                 # Vercel deploy config (SPA rewrites, Bun)
├── package.json                # All deps (React 19, Convex, Framer Motion, etc.)
├── PLAN.md                     # Full launch/SEO/monetization plan
├── integrations.md             # Vly integration docs (AI, email, payments)
├── public/
│   ├── manifest.webmanifest    # PWA manifest
│   ├── robots.txt              # Crawler instructions
│   └── sitemap.xml             # Static sitemap
├── src/
│   ├── main.tsx                # App entry: providers, routes, error boundaries
│   ├── index.css               # Neobrutalism theme tokens, Tailwind config
│   ├── pages/
│   │   ├── Landing.tsx         # Marketing/SEO landing page (huge — ~400 lines)
│   │   ├── Auth.tsx            # Sign in/up page (guest + email OTP)
│   │   ├── GameHub.tsx         # Module selector (3 cards)
│   │   ├── ModulePage.tsx      # Loads module data, renders ModuleShell
│   │   └── NotFound.tsx        # 404 page
│   ├── components/
│   │   ├── ModuleShell.tsx     # THE CORE: game loop, rounds, scoring, celebrations
│   │   ├── RequireAuth.tsx     # Auth guard (redirects to /auth?returnTo=...)
│   │   ├── LogoDropdown.tsx    # Brand logo/nav dropdown
│   │   ├── SpiderCelebration.tsx  # 20-star milestone
│   │   ├── BatCelebration.tsx     # 40-star milestone
│   │   ├── OctopusCelebration.tsx # 60-star milestone (ink transition to next module)
│   │   └── LizardCelebration.tsx  # 80-star milestone (biggest)
│   └── lib/
│       ├── game-core.ts        # Shared types, SESSION_LENGTH, MASTERY_COUNT, pickTargets (spaced repetition), pickOptions, buildProgressMap
│       ├── words.tsx           # 39 sight words with emoji, WORDS_MODULE config
│       ├── numbers.tsx         # Numbers 1–10, NUMBERS_MODULE config
│       ├── patterns.tsx        # 5 pattern types (AB, AABB, ABB, AAB, ABC), PATTERNS_MODULE config
│       ├── modules.ts          # MODULE_IDS array, MODULES registry, isModuleId()
│       └── speech.ts           # TTS queue, ElevenLabs + browser fallback, sound effects
└── src/convex/
    ├── schema.ts               # Tables: users, itemProgress, playerStats, audioCache
    └── auth/
        └── emailOtp.ts         # DO NOT MODIFY
```

---

## Routing

| Route | Component | Auth? | Description |
|-------|-----------|-------|-------------|
| `/` | `Landing.tsx` | No | Marketing page, SEO content, FAQ |
| `/auth` | `Auth.tsx` | No | Guest mode + email OTP sign-in |
| `/game` | `GameHub.tsx` | Yes | Module selector (3 cards) |
| `/game/:module` | `ModulePage.tsx` | Yes | The actual game (words/numbers/patterns) |
| `*` | `NotFound.tsx` | No | 404 |

`redirectAfterAuth` is set to `/game` in `main.tsx`.

---

## Convex Schema

### Tables
- **users** — standard Convex Auth table (name, image, email, isAnonymous, role)
- **itemProgress** — per-item mastery: `(userId, module, item) → {correct, wrong, lastPlayedAt}`. Indexes: `by_user`, `by_user_module_item`
- **playerStats** — lifetime stars + sessions per user. Index: `by_user`
- **audioCache** — cached TTS audio (base64 mp3) keyed by normalized text. Index: `by_key`

### Convex Functions (not in `_generated` — hand-written)
The app references these API functions that must exist in `src/convex/`:
- `api.speechCache.getAudio` — query, fetches cached TTS by key
- `api.speech.synthesizeSpeech` — action, generates TTS via ElevenLabs API

> **Note**: These files were likely created during development but may not be in the repo currently (only `emailOtp.ts` shows in the glob). If they're missing, the app will still work via browser speechSynthesis fallback, but the cartoon voice won't be available. Check `src/convex/speechCache.ts` and `src/convex/speech.ts`.

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
`speak()` returns a Promise that resolves when audio finishes. Praise waits for speech completion before advancing to the next round.

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

The **octopus** is special — after the ink covers the screen, `onDone` fires and the app navigates to the next module in rotation.

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
- Canonical URL: `https://readwithrex.com`
- JSON-LD: `WebApplication` + `LearningResource` (audience 4–6, teaches first sight words) + `FAQPage`

### Keywords Baked In (Natural, Not Stuffed)
free reading games for kids, reading games for kindergarten, learn to read, first sight words, sight words for 5 year olds, first words for kids, ages 4–6

### E-E-A-T Signals
- "Made by a dad, for his 5-year-old" section (Experience)
- 6-question FAQ for parents (Trust)
- Deliberately NOT claiming "phonics" (honesty = better E-E-A-T)

### Crawler Files
- `public/robots.txt` — allows all, points to sitemap
- `public/sitemap.xml` — lists `/`, `/auth`, `/game`
- `public/manifest.webmanifest` — PWA manifest

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_CONVEX_URL` | Client (build time) | Convex backend URL: `https://hushed-herring-277.convex.cloud` |
| `ELEVENLABS_API_KEY` | Convex server (Keys tab) | Cartoon voice TTS |
| `EMAILOCTOPUS_API_KEY` | Convex server (Keys tab) | **NOT YET INTEGRATED** — planned for parent email list |
| `STRIPE_SECRET_KEY` | Convex server (Keys tab) | **NOT YET INTEGRATED** — planned for premium tier |
| `STRIPE_PUBLISHABLE_KEY` | Convex server (Keys tab) | **NOT YET INTEGRATED** |
| `STRIPE_WEBHOOK_SECRET` | Convex server (Keys tab) | **NOT YET INTEGRATED** |
| `PLAUSIBLE_DOMAIN` | Convex server (Keys tab) | **NOT YET INTEGRATED** — planned for analytics |
| `PLAUSIBLE_API_KEY` | Convex server (Keys tab) | **NOT YET INTEGRATED** |

**Never edit .env files.** Keys are managed through the project's Keys/API keys tab.

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
- ✅ Auth (guest + email OTP)
- ✅ Protected routes
- ✅ SEO: title, meta, OG, JSON-LD, robots, sitemap
- ✅ Landing page with FAQ, E-E-A-T sections
- ✅ Brand rename (WordPlay Explorer → Read with Rex)
- ✅ PLAN.md with full launch/monetization roadmap
- ✅ Vercel deploy config

## What's NOT Done (from PLAN.md)

### Phase 0 — Deploy
- [ ] Register `readwithrex.com` domain
- [ ] Deploy to Vercel (config exists, just needs push)
- [ ] Update canonical URL if domain differs from `readwithrex.com`
- [ ] Privacy policy + terms (COPPA-compliant)
- [ ] Google Search Console setup

### Phase 1 — SEO Growth
- [ ] Plausible Analytics integration
- [ ] Parent blog articles + printables (5–10 articles targeting parent search keywords)
- [ ] Prerender landing page for crawlers (optional)

### Phase 2 — Monetization
- [ ] EmailOctopus parent email list (free tier, lead magnet: "50 sight-word flashcards")
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

1. **Convex TTS functions may be missing**: The glob only found `emailOtp.ts` in `src/convex/`. The `speechCache` and `speech` modules referenced in `speech.ts` (`api.speechCache.getAudio`, `api.speech.synthesizeSpeech`) need to exist. If missing, the app works but uses browser speech only.

2. **Domain references**: `index.html`, `robots.txt`, and `sitemap.xml` use `https://readwithrex.com`. Update these when the real domain is registered.

3. **Voice can still cut off in rare cases**: The Chrome speechSynthesis bug workarounds are solid but not 100%. The ElevenLabs path (mp3 playback) is more reliable.

4. **The octopus celebration navigates away**: After the ink covers the screen, `handleOctopusDone` navigates to the next module. If the celebration is interrupted, the navigation might not fire.

5. **Pattern module answer logic**: The answer for "what comes next?" is `cycle[6 % cycle.length]` (the 7th position, which is the start of the next cycle). For "what is missing?", it's `cycle[2 % cycle.length]`. This was debugged — make sure any changes preserve this logic.

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

1. Open in Freebuff (desktop or mobile) — the workspace has the live dev server
2. Files in `src/` are the source of truth
3. Convex backend code lives in `src/convex/` (run `bun convex dev --once` after changes)
4. Typecheck with `bun tsc -b --noEmit`
5. The preview updates automatically on file save — never start/stop dev servers manually
6. For deploy: push to Vercel with `VITE_CONVEX_URL=https://hushed-herring-277.convex.cloud`

---

## Author's Note

This app started as a personal project for one kid and is now being prepared for public release. The owner's son loves it and plays regularly. The next big milestone is getting a domain, deploying to Vercel, and starting the SEO/content flywheel. Monetization is secondary — the priority is getting parents to find and use the free app.

The owner is budget-conscious. Most of the monetization plan uses free tiers (EmailOctopus, Plausible trial, Vercel free). Paid services (Stripe) only come when there's real traffic.
