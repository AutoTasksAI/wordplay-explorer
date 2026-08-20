import { motion } from "framer-motion";
import { Link } from "react-router";

import { ContentLayout } from "@/components/ContentLayout";

const BATCHES = [
  {
    label: "Batch 1",
    name: "Words that matter to your child",
    words: ["mommy", "daddy", "your child's name", "no", "go", "stop"],
    why: "Personal words have meaning before the letter skills exist. These are the first 'sight words' because your child WANTS to recognize them.",
  },
  {
    label: "Batch 2",
    name: "High-frequency helpers",
    words: ["the", "and", "is", "in", "it", "to", "I", "a", "you", "my"],
    why: "These make up a huge share of every children's book. Learn them by sight and a child can suddenly follow along on the page.",
  },
  {
    label: "Batch 3",
    name: "Everyday CVC words",
    words: ["cat", "dog", "sun", "hat", "bus", "egg", "fish", "star", "run", "jump"],
    why: "Short, soundable words with a picture in easy reach. Cat, dog, and sun are the words Read with Rex teaches first, with an emoji for every one.",
  },
  {
    label: "Batch 4",
    name: "Feelings and actions",
    words: ["happy", "sad", "play", "like", "come", "look", "see", "big", "little", "not"],
    why: "Words children actually use and feel. Verbs and describing words unlock their own stories and make reading feel like talking.",
  },
];

const TIPS = [
  "Teach 3–5 new words at a time, never a big list all at once",
  "Only add new words once a few old ones are instantly recognized",
  "Use the same words in books, on fridge magnets, and in games",
  "Keep reviewing old words; forgotten words come back with practice",
  "End every session with a word they already know, so it feels like winning",
];

const FAQS = [
  {
    q: "What are the first words to teach a child to read?",
    a: "Start with personal words (mommy, daddy, their name), then high-frequency helpers like 'the', 'and', and 'is', then short everyday words like cat, dog, and sun. Three to five at a time, repeated daily, is the winning pace.",
  },
  {
    q: "How many sight words should a 5-year-old know?",
    a: "There's no required number, but many kindergarten programs aim for 20–50 sight words by the end of the year. What matters is that the words are instantly recognized, not just recited from memory.",
  },
  {
    q: "Should I teach phonics or sight words first?",
    a: "For the very first words, sight recognition is a gentle start that builds confidence fast. Letter sounds and phonics layer in alongside, usually as the child starts sounding out new words on their own.",
  },
];

export default function FirstWordsOrder() {
  return (
    <ContentLayout
      badge="For parents"
      title={
        <>
          First words for kids:{" "}
          <span className="relative inline-block bg-sun px-2">
            what order to teach them
          </span>
        </>
      }
      intro="The order you teach first words matters more than the words themselves. Start with words your child cares about, add the helpers that fill every book, then the everyday words with pictures, three to five at a time."
      schema={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: "First words for kids: what order to teach them",
            description:
              "The order to teach a child their first reading words: personal words, high-frequency helpers, everyday CVC words, and feeling/action words.",
            inLanguage: "en",
            isPartOf: { "@type": "WebSite", name: "Read with Rex" },
            author: {
              "@type": "Person",
              name: "Read with Rex (made by a dad for his 5-year-old)",
            },
          },
          {
            "@type": "HowTo",
            name: "How to teach first sight words in order",
            description:
              "Four batches of first words to teach a beginning reader, in the right order.",
            step: BATCHES.map((b, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: `${b.label}: ${b.name}`,
              text: `Teach ${b.words.join(", ")}. ${b.why}`,
            })),
          },
          {
            "@type": "ItemList",
            name: "First sight word batches",
            itemListElement: BATCHES.map((b, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${b.label}: ${b.words.join(", ")}`,
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
      <div className="space-y-5">
        {BATCHES.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="border-[3px] border-ink bg-white p-6 nb-shadow-sm sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="border-[3px] border-ink bg-sun px-3 py-1 text-sm font-bold">
                  {b.label}
                </span>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  {b.name}
                </h2>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.words.map((w) => (
                <span
                  key={w}
                  className="border-[3px] border-ink bg-paper px-4 py-2 text-lg font-bold"
                >
                  {w}
                </span>
              ))}
            </div>
            <p className="mt-4 leading-relaxed text-muted-foreground">{b.why}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="border-[3px] border-ink bg-paper p-6 nb-shadow-sm">
          <span className="inline-block border-[3px] border-ink bg-grass px-3 py-1 text-sm font-bold text-white">
            How to practice
          </span>
          <ul className="mt-4 space-y-3">
            {TIPS.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">💡</span>
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/sight-words"
            className="nb-btn mt-5 inline-block bg-ink px-5 py-2.5 text-base font-bold text-paper"
          >
            🃏 Get the free 50-word printable
          </Link>
        </div>

        <div className="space-y-5">
          <span className="inline-block border-[3px] border-ink bg-bubblegum px-3 py-1 text-sm font-bold">
            Questions parents ask
          </span>
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="border-[3px] border-ink bg-white p-5 nb-shadow-sm"
            >
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