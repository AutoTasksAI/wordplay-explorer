import { motion } from "framer-motion";

import { ContentLayout } from "@/components/ContentLayout";

const STEPS = [
  {
    emoji: "🗣️",
    title: "Read aloud, every day",
    body: "Five to ten minutes a day beats an hour on Sundays. Let your child pick the book, run your finger under the words, and pause for them to guess what happens next. Your voice is the single biggest head start.",
  },
  {
    emoji: "🔤",
    title: "Play with sounds first",
    body: "Before letters, kids need to hear that words are made of sounds. Clap the syllables in 'ba-na-na', hunt for words that rhyme with 'cat', play 'I spy' starting with a sound: 'I spy something that starts with /s/...'",
  },
  {
    emoji: "👀",
    title: "Teach first sight words",
    body: "Some words just need to be recognized on sight: cat, dog, the, and, look, see. Pick 5 at a time, use them every day, and don't move on until a few stick. Repetition is the whole trick — which is why the game brings missed words back.",
  },
  {
    emoji: "🔁",
    title: "Let them read the same thing again and again",
    body: "Rereading is not a sign you've failed — it's how fluency happens. The 47th time through the same little book, your child is suddenly reading confidently. Let them. Familiar books build speed and pride.",
  },
  {
    emoji: "🎉",
    title: "Praise the effort, not just the result",
    body: "'You tried that word all by yourself!' lands far better than a perfect reading. Keep it warm, keep it short, and end on a success so tomorrow feels fun. Pressure is the enemy of early reading.",
  },
  {
    emoji: "🦖",
    title: "Let a game carry the repetition",
    body: "Children practice what they love. A short, spoken reading game delivers the same words over and over without you having to play teacher — and without timers, streaks, or losing. That's exactly what Read with Rex was built to do.",
  },
];

const FAQS = [
  {
    q: "How many minutes a day should we practice reading?",
    a: "Five to ten focused, happy minutes a day is plenty for a 5-year-old. Short daily sessions beat long weekly ones, and the goal is that your child asks for more — not that you drag them through it.",
  },
  {
    q: "Sight words or phonics first?",
    a: "Most children do best with a mix, but for the very first words, sight recognition is a gentle on-ramp: your child memorizes 'cat' and 'dog' as whole words and feels the thrill of reading fast. Letter sounds and phonics layer in alongside — usually a bit later.",
  },
  {
    q: "My child memorizes books instead of reading. Is that okay?",
    a: "Yes — it's a milestone, not a problem. 'Reading' a memorized book shows your child understands that print carries a story. Gently point to the words as they go, and they'll start matching the words they know to the print.",
  },
];

export default function HowToTeach() {
  return (
    <ContentLayout
      badge="For parents"
      title={
        <>
          How to teach a 5-year-old to read:{" "}
          <span className="relative inline-block bg-sun px-2">
            6 steps that work
          </span>
        </>
      }
      intro="No flashcards drills, no tears. This is the calm, do-able order that actually works for a 5-year-old: read aloud, play with sounds, learn first sight words, repeat, celebrate, and keep it playful."
      schema={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: "How to teach a 5-year-old to read: 6 steps that work",
            description:
              "A practical, pressure-free order for teaching a 5-year-old to read: reading aloud, sound play, first sight words, repetition, and celebration.",
            inLanguage: "en",
            isPartOf: { "@type": "WebSite", name: "Read with Rex" },
            author: {
              "@type": "Person",
              name: "Read with Rex (made by a dad for his 5-year-old)",
            },
          },
          {
            "@type": "HowTo",
            name: "How to teach a 5-year-old to read",
            description:
              "Six gentle steps to help a 5-year-old learn to read at home.",
            step: STEPS.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.body,
            })),
          },
          {
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ],
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            className="border-[3px] border-ink bg-white p-6 nb-shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">{s.emoji}</span>
              <span className="border-[3px] border-ink bg-sun px-2 py-0.5 text-sm font-bold">
                Step {i + 1}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 border-[3px] border-ink bg-paper p-6 nb-shadow-sm sm:p-8">
        <span className="inline-block border-[3px] border-ink bg-bubblegum px-3 py-1 text-sm font-bold">
          Questions parents ask
        </span>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {FAQS.map((f) => (
            <div key={f.q} className="border-[3px] border-ink bg-white p-5">
              <h3 className="text-lg font-bold tracking-tight">{f.q}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}