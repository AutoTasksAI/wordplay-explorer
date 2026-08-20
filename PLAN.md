# Read with Rex — Launch, SEO & Monetization Plan

> Saved from the planning session so nothing is lost. This project is built and
> working; this document is the playbook for taking it public. Roadmap is at
> the bottom — work the phases in order.

## What exists today

- **Product**: Read with Rex (formerly WordPlay Explorer) — a voice-first
  reading game for a 5-year-old. Three modules: Word Safari (39 words),
  Number Jungle (1–10), Pattern Path (5 pattern types). Neobrutalism
  minimalism theme, Rex the T-Rex guide.
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

1. **Domain**: `readwithrex.com` (~$10–12/yr) — the name was chosen for SEO
   (it contains the money keyword "read" and pairs with the mascot). Fallbacks
   if it's taken: `readwithrex.app`, `readwithrex.io`, `rexlearnstoread.com`.
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

### Research summary (done Aug 2026)

**Why the name changed.** Searches for "free reading apps for 5 year olds",
"best reading app for 4 year old", "free reading games for kindergarten",
"phonics games online free", and "sight words for 5 year olds" are dominated
by Starfall, Teach Your Monster to Read, Reading.com, and Duolingo ABC. The
winners share one trait: the name or title says what the app teaches. "Teach
Your Monster to Read" ranks and gets LLM recommendations because the name
itself is the pitch. "WordPlay Explorer" said nothing about reading, so the
site was invisible to parents searching for exactly what the game does.

**Decision.** Rebrand to **Read with Rex** — the mascot (Rex the T-Rex) stays,
the money keyword "read" is in the name, it's short enough for LLMs to cite,
and the domain `readwithrex.com` is available-ish. The full shortlist was:
Read with Rex (chosen) · Rex Reads · First Words with Rex · Learn to Read
with Rex. Switching back to any of these is a 10-minute find-and-replace.

**Keywords baked into the site (not stuffed).** Title + meta description +
OG tags, hero sub-copy, module copy, sight-word chips band, FAQ section and
FAQPage schema: *free reading games for kids*, *reading games for
kindergarten*, *learn to read*, *first sight words*, *sight words for 5 year
olds*, *first words for kids*, *ages 4–6*. We deliberately did NOT claim
"phonics" — the game teaches whole-word/sight-word recognition first, and
claiming phonics would be inaccurate (and bad E-E-A-T).

**E-E-A-T (Experience, Expertise, Authoritativeness, Trust).**
- *Experience*: "Made by a dad for his 5-year-old" section on the landing —
  the product's origin story is its best credential.
- *Expertise*: copy grounded in how beginners actually learn (spoken prompts,
  repetition, spaced review of known words) — no fake credentials.
- *Authoritativeness*: one consistent brand, canonical URL, honest FAQ,
  no invented ratings/reviews.
- *Trust*: no-ads/no-child-data promises (COPPA-aware) stated on the page
  and in the FAQ, which is also the headline parents search for.

### Technical — DONE in repo (verify after deploy)
- [x] Title, meta description, keywords, canonical, Open Graph + Twitter tags
      in `index.html`.
- [x] JSON-LD structured data: `WebApplication` + `LearningResource`
      (audience 4–6, teaches first sight words) + `FAQPage` matching the
      on-page FAQ.
- [x] `public/robots.txt` + `public/sitemap.xml` (static; served by Vercel).
- [ ] **After the domain is registered**: update every `readwithrex.com`
      reference in `index.html` (canonical + JSON-LD), `robots.txt`, and
      `sitemap.xml` if the actual domain differs.
- [ ] Prerender the landing page so crawlers/social previews get full HTML
      (optional but strong for a Vite SPA).
- [ ] Core Web Vitals: already good (lazy-loaded routes, single vendor chunks);
      keep an eye on bundle size as pages are added.

### Content (the actual growth engine)
Parents search for exactly this. Target keywords with parent intent:
- "sight words for 5 year olds" · "first words to teach a child to read"
- "free reading games for kindergarten" · "learn to read app for 4 year olds"
- "how to teach a 5 year old to read" · "free reading games for kids"

Write 5–10 short parent articles ("The 50 first sight words (free printable)",
"Reading milestones by age", "First words: what order to teach them") — each
links to the app and feeds the email list. Blog + printables are the reliable
SEO play; the app itself ranks mostly on brand terms. (Save "phonics vs.
sight words" for when the app actually teaches phonics.)

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
| Resend | OTP verification emails (auth) | `RESEND_API_KEY`, `EMAIL_FROM` | Free tier |
| Stripe | Premium subscriptions | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | 2.9% + 30¢ |
| Plausible | Site analytics | `PLAUSIBLE_DOMAIN`, `PLAUSIBLE_API_KEY` | ~$9/mo after trial |
| ElevenLabs | Cartoon voice (in use) | `ELEVENLABS_API_KEY` | Free tier |
| Convex | Backend/DB/auth | `VITE_CONVEX_URL` (client) + `SITE_URL`, `JWKS`, `JWT_PRIVATE_KEY` (server) | Free tier |
| Cloudflare Pages | Hosting | `VITE_CONVEX_URL` at build time | Free tier |

Keys live in the project's **Keys/API keys** tab (never in `.env` files).

## Roadmap

- [x] **Code built** (Aug 2026): parent email capture, llms.txt, sight-words
      printable, 3 SEO content pages, parent progress save/restore, privacy +
      terms pages, Cloudflare `_redirects`. All pushed to `main`.
- [ ] **Now (owner actions)**: register `readwithrex.com` → create Convex
      account/project → create Resend/EmailOctopus/ElevenLabs accounts →
      deploy to Cloudflare Pages → set keys → Search Console.
      See `LAUNCH.md` for the full checklist.
- [ ] **Auth blocker**: swap `src/convex/auth/emailOtp.ts` from Freebuff's OTP
      service to Resend (owner must have a Resend key first).
- [ ] **Week 1**: make email signup live (EmailOctopus keys) + Plausible
- [ ] **Month 1–2**: more parent articles + printables + affiliate links
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
