import { motion } from "framer-motion";
import { Link } from "react-router";
import { Volume2 } from "lucide-react";

import { ForParentsSignup } from "@/components/ForParentsSignup";

const PLAY_URL = "/auth?returnTo=/game";

const STEPS = [
  {
    emoji: "🔉",
    title: "Rex explains it",
    body: "Every word, number, and pattern is spoken out loud — big, slow, and friendly. One tap replays it anytime, so your little explorer never gets stuck.",
  },
  {
    emoji: "👀",
    title: "Spot it",
    body: "A big word, a row of dots to count, or a pattern with a missing piece — and two silly decoys. Just enough choice to make it a game, never a maze.",
  },
  {
    emoji: "👆",
    title: "Pop it",
    body: "Tap the right tile and it pops into a star. Eight rounds a session — short, sweet, and finished with a party.",
  },
  {
    emoji: "🧠",
    title: "Remember it",
    body: "Things your child misses come back. Things they know step aside for new ones. The game learns with them.",
  },
];

const TRUST = [
  { bg: "bg-sun", text: "text-ink", title: "No ads. No paywalls.", body: "Ever. Nothing to buy, nothing to sit through." },
  { bg: "bg-tomato", text: "text-white", title: "No timers. No streaks.", body: "No pressure, no losing. Just gentle try-again." },
  { bg: "bg-sky", text: "text-white", title: "Rex does the talking.", body: "Every prompt is spoken aloud — your child plays alone." },
  { bg: "bg-grass", text: "text-ink", title: "Adapts to your explorer.", body: "Missed words and numbers reappear; known ones make room for new challenges." },
  { bg: "bg-bubblegum", text: "text-ink", title: "Short sessions.", body: "Eight rounds, then a celebration. Perfect focus." },
  { bg: "bg-tangerine", text: "text-ink", title: "Three adventures.", body: "Words, numbers, and patterns — giant taps, nothing to get lost in." },
];

const MODULE_STRIP = [
  {
    emoji: "🔤",
    title: "Word Safari",
    body: "First sight words, spoken aloud. Tap the match and pop it into a star.",
    bg: "bg-tomato",
    text: "text-white",
  },
  {
    emoji: "🔢",
    title: "Number Jungle",
    body: "Count the dots and find the number. One to ten, then off they go.",
    bg: "bg-sky",
    text: "text-white",
  },
  {
    emoji: "🧩",
    title: "Pattern Path",
    body: "Red, blue, red, blue — what comes next? Spot the missing piece.",
    bg: "bg-grass",
    text: "text-ink",
  },
];

const FAQS = [
  {
    q: "What age is Read with Rex for?",
    a: "Ages 4–6 — preschool through kindergarten — who are just starting to learn to read. The first games focus on recognizing first sight words like cat, dog, and sun, plus counting 1–10 and simple patterns.",
  },
  {
    q: "Is Read with Rex really free?",
    a: "Yes. The reading games are completely free — no paywalls, no subscriptions, and no ads. Your child can start playing in one tap with guest mode.",
  },
  {
    q: "What will my child learn first?",
    a: "Children start by recognizing their first words (cat, dog, sun, hat, bus…), then mix in counting 1–10 and completing simple color patterns. Every word, number, and prompt is spoken out loud.",
  },
  {
    q: "Can my 4- or 5-year-old play alone?",
    a: "Yes. Rex the T-Rex speaks every prompt aloud, so no reading is required to start. There are no timers, no streaks, and no losing — just gentle try-again and a star for every win.",
  },
  {
    q: "Do you collect data from my child?",
    a: "No. There are no ads and no tracking, and children are never asked for personal information. Guest mode means no account and no email — just play.",
  },
  {
    q: "Do reading games actually help kids learn to read?",
    a: "Yes, when they repeat the right things. Read with Rex brings missed words back more often and schedules known ones for later review, so children get the repetition that helps sight words stick — wrapped in a game they want to play.",
  },
];

const CHIPS: { word: string; bg: string; text: string }[] = [
  { word: "cat", bg: "bg-sun", text: "text-ink" },
  { word: "dog", bg: "bg-sky", text: "text-white" },
  { word: "sun", bg: "bg-tangerine", text: "text-ink" },
  { word: "hat", bg: "bg-bubblegum", text: "text-ink" },
  { word: "bus", bg: "bg-grass", text: "text-ink" },
  { word: "egg", bg: "bg-tomato", text: "text-white" },
  { word: "star", bg: "bg-sun", text: "text-ink" },
  { word: "fish", bg: "bg-sky", text: "text-white" },
];

function DemoCard() {
  return (
    <div className="relative border-[3px] border-ink bg-white p-5 nb-shadow sm:p-6">
      <div className="flex items-center justify-between">
        <span className="border-[3px] border-ink bg-sky px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
          Find the word
        </span>
        <span className="flex size-10 items-center justify-center border-[3px] border-ink bg-sun">
          <Volume2 className="size-5" />
        </span>
      </div>

      <div className="my-5 flex items-center justify-center border-[3px] border-ink bg-paper py-8">
        <span className="text-7xl sm:text-8xl">🐱</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-2 border-[3px] border-ink bg-grass py-5">
          <span className="text-2xl font-bold text-white sm:text-3xl">cat</span>
          <span className="text-xl text-white">✓</span>
        </div>
        <div className="flex items-center justify-center border-[3px] border-ink bg-white py-5 text-2xl font-bold sm:text-3xl">
          dog
        </div>
        <div className="flex items-center justify-center border-[3px] border-ink bg-white py-5 text-2xl font-bold sm:text-3xl">
          sun
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-muted-foreground">
        Match the word to the picture. Rex says: roar! 🦖
      </p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ===== Age band (top of site: who it's for + what it does) ===== */}
      <div className="border-b-[3px] border-ink bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2.5 text-center sm:justify-between sm:px-6">
          <p className="flex items-center gap-2 text-sm font-bold sm:text-base">
            <span aria-hidden="true">🦖</span>
            <span className="border-[3px] border-paper bg-tomato px-2 py-0.5 text-paper">
              For ages 4–6
            </span>
            <span className="text-paper">who&apos;s just starting to read</span>
          </p>
          <p className="flex items-center gap-2 text-sm font-bold sm:text-base">
            <span className="border-[3px] border-paper bg-sun px-2 py-0.5 text-ink">
              Learn to read
            </span>
            <span className="text-paper">first words, numbers &amp; patterns</span>
          </p>
        </div>
      </div>

      {/* ===== Nav ===== */}
      <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center border-[3px] border-ink bg-sun text-base leading-none shadow-[3px_3px_0_0_#141414]">
              🦖
            </span>
            <span className="text-2xl font-bold tracking-tight">Read with Rex</span>
          </Link>
          <nav className="flex items-center gap-4">
            <a
              href="#how"
              className="hidden text-sm font-semibold underline decoration-[3px] underline-offset-4 hover:text-tomato sm:block"
            >
              How it works
            </a>
            <a
              href="#parents"
              className="hidden text-sm font-semibold underline decoration-[3px] underline-offset-4 hover:text-bubblegum sm:block"
            >
              For parents
            </a>
            <Link
              to="/sight-words"
              className="hidden text-sm font-semibold underline decoration-[3px] underline-offset-4 hover:text-grass sm:block"
            >
              Free printables
            </Link>
            <Link
              to="/auth"
              className="text-sm font-semibold underline decoration-[3px] underline-offset-4 hover:text-sky"
            >
              Sign in
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

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        {/* decorative blocks */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 12 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 4 }}
          className="absolute -left-10 top-16 hidden size-24 border-[3px] border-ink bg-tomato lg:block"
        />
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: -10 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 5 }}
          className="absolute -right-8 top-40 hidden size-20 border-[3px] border-ink bg-sky lg:block"
        />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block border-[3px] border-ink bg-sun px-3 py-1 text-xs font-bold uppercase tracking-widest nb-shadow-xs">
              For ages 4–6 · Learn to read
            </span>
            <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Roar into{" "}
              <span className="relative inline-block bg-tomato px-2 text-white">
                reading
              </span>
              !
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Read with Rex is a free reading game for kids ages 4–6 that
              turns your child&apos;s very first sight words into a
              dinosaur-sized adventure. Rex the T-Rex speaks every word,
              number, and pattern out loud, your little explorer taps the
              match, and every win pops into a star.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={PLAY_URL}
                className="nb-btn bg-tomato px-8 py-4 text-xl font-bold text-white sm:text-2xl"
              >
                ▶ Start exploring
              </Link>
              <a
                href="#how"
                className="nb-btn bg-white px-6 py-4 text-lg font-bold"
              >
                How it works
              </a>
            </div>
            <p className="mt-5 text-sm font-semibold text-muted-foreground">
              Three adventures in one · 100% free · One-tap guest mode, no
              account needed
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <DemoCard />
          </motion.div>
        </div>
      </section>

      {/* ===== Module strip ===== */}
      <section className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="inline-block border-[3px] border-ink bg-bubblegum px-3 py-1 text-xs font-bold uppercase tracking-widest nb-shadow-xs">
                Pick your adventure
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Three little games, one big jungle.
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-muted-foreground sm:block">
              Same stars, same Rex, same celebration — three skills to mix up
              each day.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {MODULE_STRIP.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`border-[3px] border-ink p-6 nb-shadow-sm hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#141414] transition-all ${m.bg} ${m.text}`}
              >
                <span className="text-5xl">{m.emoji}</span>
                <h3 className="mt-4 text-2xl font-bold">{m.title}</h3>
                <p className="mt-2 leading-relaxed opacity-90">{m.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section id="how" className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-block border-[3px] border-ink bg-sky px-3 py-1 text-xs font-bold uppercase tracking-widest text-white nb-shadow-xs">
                How it works
              </span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                A learning safari with Rex.
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Built on the way kids actually learn: sound, sight, then instant
              reward.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="border-[3px] border-ink bg-paper p-6 nb-shadow-sm hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#141414] transition-all"
              >
                <span className="text-5xl">{step.emoji}</span>
                <h3 className="mt-4 text-2xl font-bold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Trust tiles ===== */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-10 text-center">
          <span className="inline-block border-[3px] border-ink bg-bubblegum px-3 py-1 text-xs font-bold uppercase tracking-widest nb-shadow-xs">
            Why parents love it
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Everything the big apps get wrong,
            <br className="hidden sm:block" /> fixed.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              className={`border-[3px] border-ink p-6 nb-shadow-sm hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#141414] transition-all ${tile.bg} ${tile.text}`}
            >
              <h3 className="text-2xl font-bold leading-tight">{tile.title}</h3>
              <p className="mt-2 leading-relaxed opacity-90">{tile.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Made by a parent (E-E-A-T: Experience) ===== */}
      <section className="border-y-[3px] border-ink bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="flex size-28 items-center justify-center border-[3px] border-paper bg-sun text-7xl sm:size-32"
            >
              🦖
            </motion.div>
            <div>
              <span className="inline-block border-[3px] border-paper bg-tomato px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper">
                Made by a dad, for his 5-year-old
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Every tap in this game was tested on a real beginning reader.
              </h2>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-paper/85">
                Read with Rex started at our kitchen table, watching a
                5-year-old light up when he read &ldquo;cat&rdquo; all by
                himself. Big taps, spoken prompts, gentle try-again, short
                sessions — everything comes from what actually worked with
                him, and it&apos;s free for every family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Word chips band ===== */}
      <section className="border-y-[3px] border-ink bg-ink">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-center text-sm font-bold uppercase tracking-[0.25em] text-paper/70">
            Your child&apos;s first sight words
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {CHIPS.map((chip, i) => (
              <motion.span
                key={chip.word}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 18 }}
                whileHover={{ rotate: -3, scale: 1.06 }}
                className={`border-[3px] border-paper px-5 py-2 text-xl font-bold ${chip.bg} ${chip.text}`}
              >
                {chip.word}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <span className="inline-block border-[3px] border-ink bg-sky px-3 py-1 text-xs font-bold uppercase tracking-widest text-white nb-shadow-xs">
              For parents
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Questions parents ask.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
                className="border-[3px] border-ink bg-paper p-6 nb-shadow-sm hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#141414] transition-all"
              >
                <h3 className="text-lg font-bold tracking-tight">{faq.q}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="border-[3px] border-ink bg-sun p-8 text-center nb-shadow sm:p-14"
        >
          <span className="text-6xl">🦖</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to explore?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-lg font-medium">
            Ten minutes a day with Read with Rex and first sight words,
            numbers, and patterns stop being scary — they become adventures
            your child begs to play.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={PLAY_URL}
              className="nb-btn bg-ink px-10 py-4 text-2xl font-bold text-paper"
            >
              ▶ Start exploring
            </Link>
            <Link
              to={PLAY_URL}
              className="nb-btn bg-white px-6 py-4 text-lg font-bold"
            >
              Try the demo
            </Link>
          </div>
          <p className="mt-5 text-sm font-semibold">
            Free for your family · Guest mode is one tap
          </p>
        </motion.div>
      </section>

      {/* ===== For parents ===== */}
      <section id="parents" className="border-y-[3px] border-ink bg-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2">
          <div>
            <span className="inline-block border-[3px] border-ink bg-sun px-3 py-1 text-xs font-bold uppercase tracking-widest nb-shadow-xs">
              For parents
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Free tools to keep the reading going off-screen.
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Read with Rex is free for every family — no account, no ads, no
              child data. Want to keep the momentum going? Grab our free
              printable of your child&apos;s first 50 sight words and get a
              fresh reading game to try each week.
            </p>
          </div>
          <ForParentsSignup />
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t-[3px] border-ink bg-white">
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
            <a
              href="#parents"
              className="underline decoration-[3px] underline-offset-4 hover:text-bubblegum"
            >
              For parents
            </a>
            <span className="text-muted-foreground">·</span>
            <p className="text-sm font-semibold">© 2026 Read with Rex</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
