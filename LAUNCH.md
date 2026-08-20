# Read with Rex — Launch Checklist

> Everything needed to take Read with Rex public. Work top to bottom. Most
> items are free or on free tiers. Full strategy lives in `PLAN.md`.

## 1. Domain (do first — everything references it)
- [ ] Register `readwithrex.com` (~$10–12/yr). Fallbacks: `readwithrex.app`, `readwithrex.io`, `rexlearnstoread.com`.
- [ ] Update the domain everywhere if the real domain differs from `readwithrex.com`:
  - `index.html` — canonical URL, OG tags, JSON-LD (`WebApplication`, `LearningResource`, `FAQPage`)
  - `public/robots.txt` — `Sitemap:` line
  - `public/sitemap.xml` — every `<loc>`
  - `public/llms.txt` — page URLs
  - `PLAN.md` / `HANDOFF.md` references (cosmetic)

## 2. Deploy to Vercel
- [ ] Push/import the repo `AutoTasksAI/wordplay-explorer` into Vercel (`vercel.json` is already configured: Vite + Bun, SPA rewrites).
- [ ] Set production env var: `VITE_CONVEX_URL=https://hushed-herring-277.convex.cloud`
- [ ] Point `readwithrex.com` at Vercel (add domain in Vercel → your project → Domains).
- [ ] Run `bun convex dev --once` (or `npx convex dev`) so the Convex `_generated/` files regenerate — this publishes the new `newsletter` and `savedProgress` functions.
- [ ] Verify: land on `/`, play a round at `/game`, save + restore progress, sign up for the newsletter.

## 3. Legal (required for a kids-directed site)
- [ ] Publish the Privacy + Terms pages (already built at `/privacy` and `/terms`).
- [ ] For a stronger formal policy later, generate a COPPA-aware policy via Termly/iubenda and replace the page content. Non-negotiable points:
  - No child data collected
  - No ads in-game
  - Parent email only, opt-in

## 4. Analytics & search
- [ ] Create a Plausible Analytics account (~$9/mo after trial; cookie-free, no consent banner) and add the script tag to `index.html` (or use GA4 for $0).
- [ ] Google Search Console — verify `readwithrex.com`, submit `sitemap.xml`.
- [ ] Bing Webmaster Tools (free, small extra traffic) — optional.

## 5. Keys & integrations (project Keys tab, never `.env`)
- [ ] `ELEVENLABS_API_KEY` — already in use for the cartoon voice.
- [ ] `EMAILOCTOPUS_API_KEY` + `EMAILOCTOPUS_LIST_ID` — parent newsletter (free to 2,500 subs). Create a list; paste the list id.
- [ ] `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` — **only when the Plus tier ships**.
- [ ] `PLAUSIBLE_DOMAIN` / `PLAUSIBLE_API_KEY` — when Plausible is added.

## 6. Pre-launch QA
- [ ] Test on a phone + tablet (the app is mobile-first; verify taps, voice, and layout).
- [ ] Voice check: ElevenLabs cartoon voice vs. browser speech fallback (no key = fallback).
- [ ] Save/restore flow: play a few rounds → Save with parent email + 4-digit code → open in another browser → Restore → progress returns.
- [ ] Newsletter: submit the For-Parents form and confirm the subscriber lands in EmailOctopus (free tier).

## 7. Share it (free growth)
- [ ] Share with the family/playgroup and a few parenting groups — the first 20 families are the seed.
- [ ] Add the printable page + blog pages to your social profiles.
- [ ] Watch Search Console weekly for which queries bring parents; publish more pages for the winners.

## After launch (see PLAN.md for full roadmap)
- [ ] 5–10 blog articles targeting parent long-tail keywords (sight words, reading milestones, how to teach reading).
- [ ] Monthly parent email (EmailOctopus) — "3 reading games to play this week."
- [ ] Amazon Associates affiliate links on blog articles.
- [ ] Once traffic is real (~1k+/mo): Stripe Plus tier (new modules + parent dashboard).