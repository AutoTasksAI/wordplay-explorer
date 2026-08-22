# Read with Rex, Launch Checklist

> Everything needed to take Read with Rex public. Work top to bottom. Most
> items are free or on free tiers. Full strategy lives in `PLAN.md`.
>
> **Status 2026-08-22 (session 7):** The site is **LIVE** at
> `https://readwithrex.com` via Cloudflare Pages with SSL on apex + www and
> Git auto-deploy working. Post-launch QA passed end-to-end: guest sign-in,
> save/restore progress, email OTP delivery through Resend (domain verified),
> and the For-Parents newsletter signup into EmailOctopus. Google Search
> Console is verified with `sitemap.xml` submitted (7 URLs, Success) and the
> homepage re-index was requested after the favicon/OG image update.
> Plausible analytics is live. ElevenLabs TTS confirmed working. Adaptive
> word levels (Starter → My World → Big Kid), numbers 1-20, and an
> 8-creature milestone ladder every 20 stars shipped. PageSpeed: Mobile 89 /
> Desktop 100 after self-hosting the Fredoka font. The EmailOctopus welcome
> automation ("Welcome email: sight-word flashcards") is **active and tested
> end to end**: contact added → lead-magnet email sent from
> `josh@readwithrex.com` (domain verified as sender in EmailOctopus).

## ⚠️ Auth note
- The email-OTP sender was swapped from Freebuff's service to **Resend**
  (`src/convex/auth/emailOtp.ts`) and the Freebuff scaffolding was removed
  (VlyToolbar, `@vly-ai/integrations`, the `customJwt` provider, axios), all
  committed to `main`. Resend keys are set; email delivery verified in
  session 5 QA.

## 1. Domain (do first, everything references it)
- [x] Register `readwithrex.com`, **DONE 2026-08-20 (Namecheap)**. Next: point
  nameservers at Cloudflare when deploying (step 4), then set canonical URL if
  it differs from `readwithrex.com`:
  - `index.html`, canonical URL, OG tags, JSON-LD (`WebApplication`, `LearningResource`, `FAQPage`)
  - `public/robots.txt`, `Sitemap:` line
  - `public/sitemap.xml`, every `<loc>`
  - `public/llms.txt`, page URLs
  - `PLAN.md` / `HANDOFF.md` / `LAUNCH.md` references (cosmetic)

## 2. Backend (Convex), required first
- [x] **DONE 2026-08-20**, project `josh-a2865/wordplay-explorer`, dev deployment
  `https://calculating-basilisk-420.convex.cloud` (this is `VITE_CONVEX_URL`).
  `src/convex/_generated/` is generated and tracked so CI builds pass; `npm run build` passes.
- [ ] For production, create a production deployment later (`npx convex deploy`)
  and update `VITE_CONVEX_URL` to its URL.

## 3. Auth email (Resend)
- [x] Create a Resend account (free). Get an API key.
- [x] Set `RESEND_API_KEY` + `EMAIL_FROM` in the Convex project's Keys tab.
      (The Freebuff→Resend code swap is already committed, no code change
      needed on your side.)
- [x] Verify `EMAIL_FROM` is set. Session 5: now
      `Read with Rex <rex@readwithrex.com>` with the `readwithrex.com` domain
      verified in Resend (DNS via Cloudflare Domain Connect).
- [x] Test email OTP delivery with a real parent email. Session 5 QA: code
      delivered and accepted end-to-end.

## 4. Deploy to Cloudflare Pages (or Vercel)
- [x] **Cloudflare Pages** (recommended; `public/_redirects` already added):
      Pages project `wordplay-explorer` is connected to the GitHub repo,
      builds with `npm install && npm run build`, outputs `dist`, and has
      `VITE_CONVEX_URL=https://calculating-basilisk-420.convex.cloud`.
      - [x] Custom domain `readwithrex.com` active with SSL.
      - [x] Custom domain `www.readwithrex.com` active with SSL.
      - [x] Git auto-deploy reconnected; pushes to `main` redeploy.
- [ ] **Vercel alternative**: not needed; Cloudflare Pages is live.

## 5. Legal (required for a kids-directed site)
- [x] Publish the Privacy + Terms pages (live at `/privacy` and `/terms`).
- [ ] For a stronger formal policy later, generate a COPPA-aware policy via Termly/iubenda and replace the page content. Non-negotiable points:
  - No child data collected
  - No ads in-game
  - Parent email only, opt-in

## 6. Analytics & search
- [x] Add the Plausible script tag to `index.html` (`data-domain="readwithrex.com"`).
- [x] Create a Plausible Analytics account for `readwithrex.com` to activate it.
      Session 5: account created and the per-site snippet is installed; data
      flows on the next visit. Cookie-free, no consent banner needed.
- [x] Google Search Console, verify `readwithrex.com`, submit `sitemap.xml`.
      Session 5: domain property verified, sitemap submitted (7 URLs, Success).
      Session 7: re-index requested for the homepage after the favicon/OG
      image update ("Indexing requested", priority crawl queue).
- [ ] Bing Webmaster Tools (free, small extra traffic), optional.

## 7. Keys & integrations (project Keys tab, never `.env`)
- [x] `ELEVENLABS_API_KEY`, set for the cartoon voice.
- [x] `EMAILOCTOPUS_API_KEY` + `EMAILOCTOPUS_LIST_ID`, set for parent newsletter.
- [x] `RESEND_API_KEY` + `EMAIL_FROM`, set for OTP emails.
- [ ] `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET`, **only when the Plus tier ships**.
- [ ] `PLAUSIBLE_DOMAIN` / `PLAUSIBLE_API_KEY`, when Plausible is added.

## 8. Pre-launch QA
- [ ] Test on a real phone + tablet (agent QA ran in a 390px viewport and
      passed; one real-device pass for audio + touch feel is still worth it).
- [x] Voice check: ElevenLabs cartoon voice works (owner fixed the key in
      session 5; `synthesizeSpeech` succeeds and caches), browser speech
      remains the fallback.
- [x] Save/restore flow: play a session → Save with parent email + 4-digit
      code → fresh guest on another device → Restore → progress returns.
      Session 5 QA passed end-to-end.
- [x] Newsletter: submit the For-Parents form. Session 5 QA passed (contact
      created in EmailOctopus); session 7 built and activated the EmailOctopus
      automation that emails the flashcards, tested with a real subscribe
      (contact added → lead-magnet email sent from josh@readwithrex.com).

## 9. Share it (free growth)
- [ ] Share with the family/playgroup and a few parenting groups, the first 20 families are the seed.
- [ ] Add the printable page + blog pages to your social profiles.
- [ ] Watch Search Console weekly for which queries bring parents; publish more pages for the winners.

## After launch (see PLAN.md for full roadmap)
- [ ] 5–10 blog articles targeting parent long-tail keywords (sight words, reading milestones, how to teach reading).
- [ ] Monthly parent email (EmailOctopus), "3 reading games to play this week."
- [ ] Amazon Associates affiliate links on blog articles.
- [ ] Once traffic is real (~1k+/mo): Stripe Plus tier (new modules + parent dashboard).