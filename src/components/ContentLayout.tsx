import { motion } from "framer-motion";
import { Link } from "react-router";
import type { ReactNode } from "react";

import { ForParentsSignup } from "@/components/ForParentsSignup";

const PLAY_URL = "/auth?returnTo=/game";

interface ContentLayoutProps {
  badge: string;
  title: ReactNode;
  intro: ReactNode;
  children: ReactNode;
  schema?: object;
}

/**
 * Shared shell for SEO content pages: consistent nav, hero, body, app CTA,
 * parent email signup, footer, and a per-page JSON-LD block.
 */
export function ContentLayout({
  badge,
  title,
  intro,
  children,
  schema,
}: ContentLayoutProps) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="print:hidden sticky top-0 z-40 border-b-[3px] border-ink bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center border-[3px] border-ink bg-sun text-base leading-none shadow-[3px_3px_0_0_#141414]">
              🦖
            </span>
            <span className="text-2xl font-bold tracking-tight">
              Read with Rex
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/sight-words"
              className="hidden text-sm font-semibold underline decoration-[3px] underline-offset-4 hover:text-grass sm:block"
            >
              Free printables
            </Link>
            <Link
              to={PLAY_URL}
              className="nb-btn bg-ink px-4 py-2 text-sm font-bold text-paper"
            >
              ▶ Play now
            </Link>
          </nav>
        </div>
      </header>

      <section className="print:hidden mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <span className="inline-block border-[3px] border-ink bg-bubblegum px-3 py-1 text-xs font-bold uppercase tracking-widest nb-shadow-xs">
          {badge}
        </span>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {intro}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        {children}
      </section>

      <section className="print:hidden mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="border-[3px] border-ink bg-sun p-8 text-center nb-shadow sm:p-12"
        >
          <span className="text-5xl">🦖</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Want Rex to do the talking?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-lg font-medium">
            Read with Rex turns your child&apos;s first sight words into a
            spoken reading game. Free, no account, no ads — your child plays
            in one tap.
          </p>
          <Link
            to={PLAY_URL}
            className="nb-btn mt-6 inline-block bg-ink px-8 py-3 text-xl font-bold text-paper"
          >
            ▶ Start exploring free
          </Link>
        </motion.div>
      </section>

      <section className="print:hidden border-y-[3px] border-ink bg-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2">
          <div>
            <span className="inline-block border-[3px] border-ink bg-sun px-3 py-1 text-xs font-bold uppercase tracking-widest nb-shadow-xs">
              For parents
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Keep the reading going off-screen.
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Get a short email with three reading games to play each week,
              plus more free printables. No spam, unsubscribe anytime.
            </p>
          </div>
          <ForParentsSignup />
        </div>
      </section>

      <footer className="print:hidden border-t-[3px] border-ink bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center border-[3px] border-ink bg-sun text-sm leading-none">
              🦖
            </span>
            <span className="font-bold">Read with Rex</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Free reading games for kids ages 4–6 · No ads, no child data, ever
          </p>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link
              to="/privacy"
              className="underline decoration-[3px] underline-offset-4 hover:text-sky"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="underline decoration-[3px] underline-offset-4 hover:text-sky"
            >
              Terms
            </Link>
            <p className="text-sm font-semibold">© 2026 Read with Rex</p>
          </div>
        </div>
      </footer>

      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </div>
  );
}