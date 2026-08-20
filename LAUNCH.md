# Read with Rex — Launch Checklist

> Everything needed to take Read with Rex public. Work top to bottom. Most
> items are free or on free tiers. Full strategy lives in `PLAN.md`.
>
> **The owner currently has NO accounts/credentials.** Every step below is a
> task the owner must do (they cannot be done by an agent). After steps 1–3
> the owner should tell the agent to swap the email-OTP sender to Resend and
> remove Freebuff scaffolding.

## ⚠️ Auth blocker (do after step 3)
- The email-OTP codes are sent through Freebuff's service
  (`src/convex/auth/emailOtp.ts`), which only works inside Freebuff. Once you
  have a Resend API key, ask an agent to replace it with the Resend provider.
- `main.tsx` also imports `@vly-ai/integrations` + `VlyToolbar` and
  `auth.config.ts` has a Freebuff `customJwt` provider — Freebuff-only
  scaffolding to remove for production.

## 1. Domain (do first — everything references it)
- [ ] Register `readwithrex.com` (~$10–12/yr). Fallbacks: `readwithrex.app`, `readwithrex.io`, `rexlearnstoread.com`.
- [ ] Update the domain everywhere if the real domain differs from `readwithrex.com`:
  - `index.html` — canonical URL, OG tags, JSON-LD (`WebApplication`, `LearningResource`, `FAQPage`)
  - `public/robots.txt` — `Sitemap:` line
  - `public/sitemap.xml` — every `<loc>`
  - `public/llms.txt` — page URLs
  - `PLAN.md` / `HANDOFF.md` / `LAUNCH.md` references (cosmetic)

## 2. Backend (Convex) — required first
- [ ] Create a Convex account + project (free). In this repo run
      `npx convex dev`, log in, and it creates a deployment + URL.
- [ ] That URL is your `VITE_CONVEX_URL` (do NOT use the repo's current
      `https://hushed-herring-277.convex.cloud` — that's a Freebuff sandbox,
      not yours).
- [ ] Running `npx convex dev` also regenerates `src/convex/_generated/`
      (not in the repo) so the new `newsletter` + `savedProgress` functions exist.

## 3. Auth email (Resend)
- [ ] Create a Resend account (free). Get an API key.
- [ ] Ask an agent to swap `src/convex/auth/emailOtp.ts` from Freebuff's OTP
      service to Resend, then set `RESEND_API_KEY` + `EMAIL_FROM` in Convex.
      (The current file only works inside Freebuff.)

## 4. Deploy to Cloudflare Pages (or Vercel)
- [ ] **Cloudflare Pages** (recommended; `public/_redirects` already added):
      create a Pages project → connect the GitHub repo → Build command
      `npm install && npm run build` (bun is not available on Cloudflare) →
      Output directory `dist` → env var `VITE_CONVEX_URL` → point the domain.
- [ ] **Vercel alternative**: `vercel.json` is already configured (Vite + Bun,
      SPA rewrites). Set `VITE_CONVEX_URL`, add the domain.

## 5. Legal (required for a kids-directed site)
- [ ] Publish the Privacy + Terms pages (already built at `/privacy` and `/terms`).
- [ ] For a stronger formal policy later, generate a COPPA-aware policy via Termly/iubenda and replace the page content. Non-negotiable points:
  - No child data collected
  - No ads in-game
  - Parent email only, opt-in

## 6. Analytics & search
- [ ] Create a Plausible Analytics account (~$9/mo after trial; cookie-free, no consent banner) and add the script tag to `index.html` (or use GA4 for $0).
- [ ] Google Search Console — verify `readwithrex.com`, submit `sitemap.xml`.
- [ ] Bing Webmaster Tools (free, small extra traffic) — optional.

## 7. Keys & integrations (project Keys tab, never `.env`)
- [ ] `ELEVENLABS_API_KEY` — already in use for the cartoon voice.
- [ ] `EMAILOCTOPUS_API_KEY` + `EMAILOCTOPUS_LIST_ID` — parent newsletter (free to 2,500 subs). Create a list; paste the list id.
- [ ] `RESEND_API_KEY` + `EMAIL_FROM` — OTP emails after the Resend swap.
- [ ] `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` — **only when the Plus tier ships**.
- [ ] `PLAUSIBLE_DOMAIN` / `PLAUSIBLE_API_KEY` — when Plausible is added.

## 8. Pre-launch QA
- [ ] Test on a phone + tablet (the app is mobile-first; verify taps, voice, and layout).
- [ ] Voice check: ElevenLabs cartoon voice vs. browser speech fallback (no key = fallback).
- [ ] Save/restore flow: play a few rounds → Save with parent email + 4-digit code → open in another browser → Restore → progress returns.
- [ ] Newsletter: submit the For-Parents form and confirm the subscriber lands in EmailOctopus (free tier).

## 9. Share it (free growth)
- [ ] Share with the family/playgroup and a few parenting groups — the first 20 families are the seed.
- [ ] Add the printable page + blog pages to your social profiles.
- [ ] Watch Search Console weekly for which queries bring parents; publish more pages for the winners.

## After launch (see PLAN.md for full roadmap)
- [ ] 5–10 blog articles targeting parent long-tail keywords (sight words, reading milestones, how to teach reading).
- [ ] Monthly parent email (EmailOctopus) — "3 reading games to play this week."
- [ ] Amazon Associates affiliate links on blog articles.
- [ ] Once traffic is real (~1k+/mo): Stripe Plus tier (new modules + parent dashboard).