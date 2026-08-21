# Read with Rex, Launch Checklist

> Everything needed to take Read with Rex public. Work top to bottom. Most
> items are free or on free tiers. Full strategy lives in `PLAN.md`.
>
> **Status 2026-08-21:** Domain bought (Namecheap), Convex project created and
> live at `https://calculating-basilisk-420.convex.cloud`, code builds clean,
> all pre-existing lint errors are fixed, guest/email sign-in no longer spins,
> all em dashes are removed from copy, and the stale `isolate/` build artifact
> is removed. GitHub repo is public and all Convex Keys are set (Resend,
> EmailOctopus, ElevenLabs). The site is **LIVE** at `https://readwithrex.com`
> (and `https://www.readwithrex.com`) via Cloudflare Pages, SSL is active, and
> Git auto-deploy is reconnected.

## ⚠️ Auth note
- The email-OTP sender was swapped from Freebuff's service to **Resend**
  (`src/convex/auth/emailOtp.ts`) and the Freebuff scaffolding was removed
  (VlyToolbar, `@vly-ai/integrations`, the `customJwt` provider, axios), all
  committed to `main`. Resend keys are set; verify email delivery in post-launch
  QA.

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
- [x] Verify `EMAIL_FROM` is set.
- [ ] Test email OTP delivery with a real parent email.

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
- [ ] Publish the Privacy + Terms pages (already built at `/privacy` and `/terms`).
- [ ] For a stronger formal policy later, generate a COPPA-aware policy via Termly/iubenda and replace the page content. Non-negotiable points:
  - No child data collected
  - No ads in-game
  - Parent email only, opt-in

## 6. Analytics & search
- [x] Add the Plausible script tag to `index.html` (`data-domain="readwithrex.com"`).
- [ ] Create a Plausible Analytics account (~$9/mo after trial; cookie-free, no consent banner) for `readwithrex.com` to activate it (or use GA4 for $0).
- [ ] Google Search Console, verify `readwithrex.com`, submit `sitemap.xml`.
- [ ] Bing Webmaster Tools (free, small extra traffic), optional.

## 7. Keys & integrations (project Keys tab, never `.env`)
- [x] `ELEVENLABS_API_KEY`, set for the cartoon voice.
- [x] `EMAILOCTOPUS_API_KEY` + `EMAILOCTOPUS_LIST_ID`, set for parent newsletter.
- [x] `RESEND_API_KEY` + `EMAIL_FROM`, set for OTP emails.
- [ ] `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET`, **only when the Plus tier ships**.
- [ ] `PLAUSIBLE_DOMAIN` / `PLAUSIBLE_API_KEY`, when Plausible is added.

## 8. Pre-launch QA
- [ ] Test on a phone + tablet (the app is mobile-first; verify taps, voice, and layout).
- [ ] Voice check: ElevenLabs cartoon voice vs. browser speech fallback (no key = fallback).
- [ ] Save/restore flow: play a few rounds → Save with parent email + 4-digit code → open in another browser → Restore → progress returns.
- [ ] Newsletter: submit the For-Parents form and confirm the subscriber lands in EmailOctopus (free tier).

## 9. Share it (free growth)
- [ ] Share with the family/playgroup and a few parenting groups, the first 20 families are the seed.
- [ ] Add the printable page + blog pages to your social profiles.
- [ ] Watch Search Console weekly for which queries bring parents; publish more pages for the winners.

## After launch (see PLAN.md for full roadmap)
- [ ] 5–10 blog articles targeting parent long-tail keywords (sight words, reading milestones, how to teach reading).
- [ ] Monthly parent email (EmailOctopus), "3 reading games to play this week."
- [ ] Amazon Associates affiliate links on blog articles.
- [ ] Once traffic is real (~1k+/mo): Stripe Plus tier (new modules + parent dashboard).