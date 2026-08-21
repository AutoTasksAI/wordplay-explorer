import { motion } from "framer-motion";
import { Link } from "react-router";
import { Printer } from "lucide-react";

import { ForParentsSignup } from "@/components/ForParentsSignup";

const PLAY_URL = "/auth?returnTo=/game";

/** The first 50 sight words for a beginning reader (ages 4-6). Ordered
 *  roughly by how early children encounter them: a mix of the pre-primer /
 *  primer Dolch words and everyday CVC words that match the app's style. */
const WORDS = [
  "a", "and", "away", "big", "blue", "can", "come", "down", "find",
  "for", "fun", "go", "help", "here", "I", "in", "is", "it", "jump",
  "like", "little", "look", "make", "me", "my", "not", "one", "play",
  "run", "said", "see", "she", "so", "the", "three", "to", "two",
  "up", "we", "where", "with", "you",
  "cat", "dog", "sun", "hat", "bus", "egg", "fish", "star",
];

export default function SightWords() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ===== Nav ===== */}
      <header className="print:hidden sticky top-0 z-40 border-b-[3px] border-ink bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center border-[3px] border-ink bg-sun text-base leading-none shadow-[3px_3px_0_0_#141414]">
              🦖
            </span>
            <span className="whitespace-nowrap text-xl font-bold tracking-tight sm:text-2xl">
              Read with Rex
            </span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="hidden text-sm font-semibold underline decoration-[3px] underline-offset-4 hover:text-tomato sm:block"
            >
              Home
            </Link>
            <Link
              to={PLAY_URL}
              className="nb-btn whitespace-nowrap bg-ink px-3 py-2 text-sm font-bold text-paper sm:px-4"
            >
              ▶ Play now
            </Link>
          </nav>
        </div>
      </header>

      {/* ===== Hero / intro ===== */}
      <section className="print:hidden mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <span className="inline-block border-[3px] border-ink bg-bubblegum px-3 py-1 text-xs font-bold uppercase tracking-widest nb-shadow-xs">
          Free printable
        </span>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          Your child&apos;s first 50 sight words
          <span className="relative ml-2 inline-block bg-sun px-2 text-ink">
            (free printable)
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          These are the first words most children learn to recognize by sight.
          They are the ones that unlock reading. Cut them into flashcards, stick
          them on the fridge, or turn them into a game with Rex. Download and
          print for free, forever.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="nb-btn flex items-center gap-2 bg-tomato px-6 py-3 text-lg font-bold text-white"
          >
            <Printer className="size-5" />
            Print the cards
          </button>
          <Link
            to={PLAY_URL}
            className="nb-btn bg-ink px-6 py-3 text-lg font-bold text-paper"
          >
            ▶ Play the word game
          </Link>
        </div>
      </section>

      {/* ===== Printable grid (what shows on paper) ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="border-[3px] border-ink bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b-[3px] border-ink pb-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                First 50 sight words
              </p>
              <p className="text-lg font-bold">Read with Rex · ages 4–6</p>
            </div>
            <span className="border-[3px] border-ink bg-sun px-3 py-1 text-sm font-bold">
              50 words
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {WORDS.map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 10) * 0.02 }}
                className="flex aspect-[4/3] items-center justify-center border-[3px] border-ink bg-paper text-2xl font-bold uppercase tracking-tight sm:text-3xl"
              >
                {word}
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-sm font-semibold text-muted-foreground">
            Tip: cut them into cards and hold up one at a time. When your child
            reads it fast and without sounding it out, the word has stuck.
          </p>
        </div>
      </section>

      {/* ===== How to use ===== */}
      <section className="print:hidden mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              emoji: "✂️",
              title: "Cut them up",
              body: "Print two copies, cut into cards, and you have an instant matching game.",
            },
            {
              emoji: "🦖",
              title: "Make it a game",
              body: "Hold up a card and race to say it. Rex does this in the app too. Every word is spoken aloud.",
            },
            {
              emoji: "🔁",
              title: "Repeat, repeat",
              body: "Sight words stick through repetition. Bring back the ones your child misses more often.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border-[3px] border-ink bg-white p-6 nb-shadow-sm"
            >
              <span className="text-4xl">{step.emoji}</span>
              <h2 className="mt-3 text-xl font-bold tracking-tight">
                {step.title}
              </h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA to app ===== */}
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
            Read with Rex turns these same words into a spoken reading game.
            It is free, with no account and no ads. Your child plays in one tap.
          </p>
          <Link
            to={PLAY_URL}
            className="nb-btn mt-6 inline-block bg-ink px-8 py-3 text-xl font-bold text-paper"
          >
            ▶ Start exploring free
          </Link>
        </motion.div>
      </section>

      {/* ===== For parents (email) ===== */}
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

      {/* ===== Footer ===== */}
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

      {/* Structured data for this page (Article + HowTo) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline:
                  "Your child's first 50 sight words (free printable)",
                description:
                  "The first 50 sight words children ages 4-6 learn to recognize by sight, as a free printable flashcard set.",
                inLanguage: "en",
                isPartOf: { "@type": "WebSite", name: "Read with Rex" },
                author: {
                  "@type": "Person",
                  name: "Read with Rex (made by a dad for his 5-year-old)",
                },
              },
              {
                "@type": "HowTo",
                name: "How to make sight-word flashcards",
                description:
                  "Print the cards and help your child learn their first 50 sight words.",
                step: [
                  {
                    "@type": "HowToStep",
                    name: "Print the page",
                    text: "Print the word grid. Two copies work best for a matching game.",
                  },
                  {
                    "@type": "HowToStep",
                    name: "Cut the cards",
                    text: "Cut along the squares to make individual word cards.",
                  },
                  {
                    "@type": "HowToStep",
                    name: "Practice daily",
                    text: "Hold up one card at a time and have your child read it aloud. Repeat the ones they miss.",
                  },
                ],
              },
              {
                "@type": "ItemList",
                name: "First 50 sight words",
                itemListElement: WORDS.map((word, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: word,
                })),
              },
            ],
          }),
        }}
      />
    </div>
  );
}
