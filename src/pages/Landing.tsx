import { motion } from "framer-motion";
import { Link } from "react-router";
import { Volume2 } from "lucide-react";

const PLAY_URL = "/auth?returnTo=/game";

const STEPS = [
  {
    emoji: "🔉",
    title: "Hear it",
    body: "Every word is spoken out loud — big, slow, and friendly. One tap replays it anytime, so your child never gets stuck.",
  },
  {
    emoji: "👀",
    title: "See it",
    body: "A big word, a big picture, and two silly decoys. Just enough choice to make it a game, never a maze.",
  },
  {
    emoji: "👆",
    title: "Pop it",
    body: "Tap the right tile and it pops into a star. Eight words a session — short, sweet, and finished with a party.",
  },
  {
    emoji: "🧠",
    title: "Remember it",
    body: "Words your child misses come back. Words they know step aside for new ones. The game learns with them.",
  },
];

const TRUST = [
  { bg: "bg-sun", text: "text-ink", title: "No ads. No paywalls.", body: "Ever. Nothing to buy, nothing to sit through." },
  { bg: "bg-tomato", text: "text-white", title: "No timers. No streaks.", body: "No pressure, no losing. Just gentle try-again." },
  { bg: "bg-sky", text: "text-white", title: "Fully voiced.", body: "Your child plays alone — every prompt is spoken." },
  { bg: "bg-grass", text: "text-ink", title: "Adapts to them.", body: "Missed words reappear; known words make room." },
  { bg: "bg-bubblegum", text: "text-ink", title: "Short sessions.", body: "Eight words, then a celebration. Perfect focus." },
  { bg: "bg-tangerine", text: "text-ink", title: "Zero menus.", body: "One screen, giant taps, nothing to get lost in." },
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
        Match the word to the picture — it&apos;s that simple. 🎉
      </p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ===== Nav ===== */}
      <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center border-[3px] border-ink bg-sun text-lg font-bold shadow-[3px_3px_0_0_#141414]">
              WP
            </span>
            <span className="text-2xl font-bold tracking-tight">WordPop!</span>
          </Link>
          <nav className="flex items-center gap-4">
            <a
              href="#how"
              className="hidden text-sm font-semibold underline decoration-[3px] underline-offset-4 hover:text-tomato sm:block"
            >
              How it works
            </a>
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
              First words,{" "}
              <span className="relative inline-block bg-tomato px-2 text-white">
                popped
              </span>{" "}
              into reading.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              WordPop! turns your child&apos;s very first words into a game a
              five-year-old can play all alone. Every word is spoken aloud,
              every win becomes a star, and there are no ads, timers, or
              paywalls — just words, pictures, and pops.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={PLAY_URL}
                className="nb-btn bg-tomato px-8 py-4 text-xl font-bold text-white sm:text-2xl"
              >
                ▶ Start playing
              </Link>
              <a
                href="#how"
                className="nb-btn bg-white px-6 py-4 text-lg font-bold"
              >
                How it works
              </a>
            </div>
            <p className="mt-5 text-sm font-semibold text-muted-foreground">
              One-tap guest mode · No account needed to try it
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

      {/* ===== How it works ===== */}
      <section id="how" className="border-y-[3px] border-ink bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-block border-[3px] border-ink bg-sky px-3 py-1 text-xs font-bold uppercase tracking-widest text-white nb-shadow-xs">
                How it works
              </span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Three taps to reading.
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Built on the way kids actually learn first words: sound, sight,
              then instant reward.
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

      {/* ===== Word chips band ===== */}
      <section className="border-y-[3px] border-ink bg-ink">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-center text-sm font-bold uppercase tracking-[0.25em] text-paper/70">
            Words they&apos;ll pop first
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

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="border-[3px] border-ink bg-sun p-8 text-center nb-shadow sm:p-14"
        >
          <span className="text-6xl">⭐</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Ready for their first word?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-lg font-medium">
            Ten minutes a day with WordPop! and first words stop being scary —
            they become a game your child begs to play.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={PLAY_URL}
              className="nb-btn bg-ink px-10 py-4 text-2xl font-bold text-paper"
            >
              ▶ Start playing
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

      {/* ===== Footer ===== */}
      <footer className="border-t-[3px] border-ink bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center border-[3px] border-ink bg-sun text-sm font-bold">
              WP
            </span>
            <span className="font-bold">WordPop!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Made for new readers · No ads, ever
          </p>
          <p className="text-sm font-semibold">© 2026 WordPop!</p>
        </div>
      </footer>
    </div>
  );
}
