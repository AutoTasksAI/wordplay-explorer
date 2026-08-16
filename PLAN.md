# WordPlay Explorer — Launch, SEO & Monetization Plan

> Saved from the planning session so nothing is lost. This project is built and
> working; this document is the playbook for taking it public. Roadmap is at
> the bottom — work the phases in order.

## What exists today

- **Product**: WordPlay Explorer — a voice-first reading game for a 5-year-old.
  Three modules: Word Safari (39 words), Number Jungle (1–10), Pattern Path
  (5 pattern types). Neobrutalism minimalism theme, Rex the T-Rex guide.
- **Stack**: Vite + React 19 + TypeScript + Tailwind v4, Convex backend
  (progress, stars, TTS audio cache), Convex Auth (guest mode + email OTP),
  ElevenLabs cartoon voice (via `ELEVENLABS_API_KEY`).
- **Rewards**: star jar; milestone creature celebrations at 20/40/60/80 stars
  (spider → bat → octopus → lizard, ladder repeats every 80).
- **Already deploy-ready**: `vercel.json` (Vite + Bun, SPA rewrites) exists and
  the production build was verified. Backend URL:
  `https://hushed-herring-277.convex.cloud` (set as `VITE_CONVEX_URL` at build time).

## The rule that shapes everything: COPPA

The app is directed at children under 13, so the COPPA rules apply:

- **No personal info from kids** — no email capture, no accounts-with-data,
  nothing, inside the game.
- **No targeted ads to children** — in-game ads are out (also a brand win:
  "no ads, no tracking" is a headline parents search for).
- **All monetization lives on parent-facing pages** — email signup, payments,
  and ads (if ever) go on the marketing/"For Parents" pages, never in-game.
- Analytics should be cookie-free/privacy-friendly (Plausible) so no consent
  banner is needed and no child data is touched.

## Phase 0 — Make it available (after domain purchase)

1. **Domain**: `wordplayexplorer.com` (~$10–12/yr).
2. **Deploy to Vercel** (config already in repo):
   - Push/export this project (Vly manages version control — use the
     platform's export/GitHub flow) and import into Vercel, or deploy with the
     CLI: `vercel login && vercel --prod`.
   - Set env var in Vercel (Production): `VITE_CONVEX_URL=https://hushed-herring-277.convex.cloud`
   - Point the domain at Vercel. `vercel.json` already handles SPA routes
     (`/game`, `/auth`, `/game/words` …) and forces `bun install` / `bun run build`.
   - The dev preview link (`*.vly.sh`) only works while the workspace session
     is alive — the deployed domain is the permanent one.
3. **Legal**: privacy policy + terms that state: no child data collected, no
   ads, email only from parents (generators: Termly / iubenda).
4. **Google Search Console** (free) — submit the domain, watch which queries
   bring parents.

## Phase 1 — SEO (compounding, mostly free)

### Technical
- [ ] Per-page meta tags (title, description, Open Graph) — one small hook or
      `react-helmet-async`; today all routes share one title.
- [ ] JSON-LD structured data on the landing: `WebApplication` +
      `LearningResource` (audience 4–6, teaches reading) + `FAQPage` schema
      matching the landing FAQ.
- [ ] `sitemap.xml` + `robots.txt` (static files or `vite-plugin-sitemap`).
- [ ] Prerender the landing page so crawlers/social previews get full HTML
      (optional but strong for a Vite SPA).
- [ ] Core Web Vitals: already good (lazy-loaded routes, single vendor chunks);
      keep an eye on bundle size as pages are added.

### Content (the actual growth engine)
Parents search for exactly this. Target keywords with parent intent:
- "sight words for 5 year olds" · "first words to teach a child to read"
- "free reading games for kindergarten" · "learn to read app for 4 year olds"
- "phonics games for kids" · "how to teach a 5 year old to read"

Write 5–10 short parent articles ("The 50 first sight words (free printable)",
"Reading milestones by age", "Phonics vs. sight words explained") — each links
to the app and feeds the email list. Blog + printables are the reliable SEO
play; the app itself ranks mostly on brand terms.

### Measurement
- **Plausible Analytics** — cookie-free, no consent banner, matches the
  kids-brand trust story. ~$9/mo after free trial (GA4 is the $0 alternative).
- Google Search Console (free, required).

## Phase 2 — Monetization (in order)

### 1. Parent email list — start first, costs $0
- "For Parents" page + footer signup with a lead magnet: *"Free printable:
  your child's first 50 sight-word flashcards."*
- Monthly parent email: "3 reading games to play this week."
- **Service: EmailOctopus** — API-based, free tier (2,500 subscribers /
  10,000 emails per month). Signup form wired through a Convex action.
  - Setup: https://index.trygravity.ai/go/f6ca0f7e-753b-4aa0-a13e-0c15fc4a03ed
  - Env var: `EMAILOCTOPUS_API_KEY`

### 2. Premium tier — the main revenue, once traffic exists
Subscriptions are the dominant kids-app model (Adapty 2025; RevenueCat kids-app
analysis). Benchmarks: ABCmouse $12.99/mo, HOMER ~$60/yr, Hooked on Phonics
~$50/yr, Duolingo ABC free.

- **Free**: the current 3 modules (unchanged).
- **Plus (~$29.99/yr or $3.99/mo)**: new modules (letter sounds, phonics,
  numbers 11–20, harder word packs), longer sessions, and a **parent
  dashboard** (progress reports, time played, words mastered) — the parent
  dashboard is the retention feature that makes parents subscribe.
- **Service: Stripe** — recurring billing + checkout; 2.9% + 30¢/charge.
  - Setup: https://index.trygravity.ai/go/1f5b5200-7e9f-4027-b9ce-f18e558b2efb
  - Env vars: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
  - Build: checkout session from a Convex action; entitlements gated server-side.

### 3. Affiliate — passive, pairs with content
Amazon Associates on the parent articles ("best first-reader books for
5-year-olds"). ~2–4% commission, zero cost, no kid-facing anything.

### 4. Site ads — last, parent pages only
Display ads (AdSense, later Mediavine) on the marketing/blog pages only —
never in-game. Small yield early; treat as pocket money, not strategy.

### Don't do
In-game ads (COPPA + kills trust) · selling data (illegal under COPPA) ·
paywalling the current free modules (kills word-of-mouth).

## Services & credentials (quick reference)

| Service | Purpose | Env vars | Cost |
|---|---|---|---|
| EmailOctopus | Parent email list | `EMAILOCTOPUS_API_KEY` | Free to 2,500 subs |
| Stripe | Premium subscriptions | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | 2.9% + 30¢ |
| Plausible | Site analytics | `PLAUSIBLE_DOMAIN`, `PLAUSIBLE_API_KEY` | ~$9/mo after trial |
| ElevenLabs | Cartoon voice (in use) | `ELEVENLABS_API_KEY` | Free tier |
| Vercel | Hosting | `VITE_CONVEX_URL=https://hushed-herring-277.convex.cloud` | Free tier |

Keys live in the project's **Keys/API keys** tab (never in `.env` files).

## Roadmap

- [ ] **Now**: get domain → deploy → privacy policy → Search Console
- [ ] **Week 1**: email signup form (EmailOctopus) + SEO technical pass
      (meta/JSON-LD/sitemap) + Plausible
- [ ] **Month 1–2**: parent articles + printables + affiliate links
- [ ] **When traffic is real (~1k+ visitors/mo)**: Stripe premium tier +
      parent dashboard

## Working on this from anywhere

- The project lives in the Freebuff platform — open this project inside
  Freebuff on desktop **or mobile** and the code, this plan, and the
  conversation history are all there.
- The game itself is fully responsive (built with mobile-first Tailwind
  breakpoints) — the preview URL works on a phone/tablet browser.
- The permanent domain (Phase 0) is the URL to bookmark for your son and for
  sharing with other parents.
