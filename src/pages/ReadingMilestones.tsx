import { motion } from "framer-motion";

import { ContentLayout } from "@/components/ContentLayout";

const MILESTONES = [
  {
    age: "Birth–2",
    title: "Sounds and words start here",
    body: "Babies tune into your voice from day one. They babble, imitate sounds, and recognize familiar words like their own name. Reading aloud every day — even for a few minutes — builds the listening skills reading later depends on.",
  },
  {
    age: "2–3",
    title: "First words and 'read' books",
    body: "Toddlers learn their first words and start 'pretend reading' — holding a book, turning pages, and retelling a familiar story. Point at words as you read so they begin to notice that print means something.",
  },
  {
    age: "3–4",
    title: "Letters, rhymes, and the start of sounds",
    body: "This is the age of nursery rhymes, letter names, and noticing that 'cat' and 'hat' rhyme. Many kids can recognize their own name in print. Play with sounds: clap syllables, make up silly rhymes.",
  },
  {
    age: "4–5",
    title: "First sight words appear",
    body: "Many 4- and 5-year-olds recognize a handful of sight words (cat, dog, the, and) without sounding them out. They may 'read' books from memory. This is exactly the age Read with Rex is built for — short, spoken, pressure-free games.",
  },
  {
    age: "5–6",
    title: "Real decoding takes off",
    body: "Kindergarten brings the big jump: children connect letters to sounds and start sounding out simple words. Sight words grow quickly with daily practice. Kids this age need repetition, and they need it to feel like play.",
  },
  {
    age: "6–7",
    title: "Fluency — reading with flow",
    body: "First grade is when reading becomes smoother. Children read short sentences, recognize more words on sight, and start reading for meaning. They still benefit hugely from reading the same books again and again.",
  },
];

const SIGNS = [
  "Your child knows most letters and their sounds by age 5–6",
  "They can recognize their own name and a few sight words by 4–5",
  "They ask what words say and try to 'read' signs and labels",
  "They retell favorite stories or finish sentences in familiar books",
  "Reading feels playful — they pick up books on their own",
];

const FAQS = [
  {
    q: "What age should a child start learning to read?",
    a: "There's no single right age — it's a range. Many children begin recognizing letters and a few sight words around age 4, with real reading taking off in kindergarten and first grade (ages 5–7). Reading aloud and playing sound games can start from birth.",
  },
  {
    q: "Is it normal for a 5-year-old to not read yet?",
    a: "Yes, completely normal. Reading is a wide range, and many 5-year-olds are still building the sound and letter skills that come before reading. What matters more than the exact age is daily, joyful exposure to books, sounds, and words.",
  },
  {
    q: "When should I worry about my child's reading?",
    a: "Talk to a teacher or pediatrician if a child older than 6–7 struggles to learn letter sounds, doesn't recognize their own name, or avoids books entirely. Early, gentle support makes a huge difference — and it's rarely cause for alarm.",
  },
];

export default function ReadingMilestones() {
  return (
    <ContentLayout
      badge="For parents"
      title={
        <>
          Reading milestones by age:{" "}
          <span className="relative inline-block bg-sun px-2">
            a realistic guide
          </span>
        </>
      }
      intro="Every parent wonders: should my 4-year-old be reading yet? Here's what reading actually looks like at each age — so you know what's normal, what to encourage, and when to gently check in. Spoiler: it's a wide, wobbly range."
      schema={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: "Reading milestones by age: a realistic guide",
            description:
              "What reading looks like at each age from birth to 7, so parents know what's normal and what to encourage next.",
            inLanguage: "en",
            isPartOf: { "@type": "WebSite", name: "Read with Rex" },
            author: {
              "@type": "Person",
              name: "Read with Rex (made by a dad for his 5-year-old)",
            },
          },
          {
            "@type": "ItemList",
            name: "Reading milestones by age",
            itemListElement: MILESTONES.map((m, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `Age ${m.age}: ${m.title}`,
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
        {MILESTONES.map((m, i) => (
          <motion.div
            key={m.age}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            className="border-[3px] border-ink bg-white p-6 nb-shadow-sm"
          >
            <span className="inline-block border-[3px] border-ink bg-sun px-3 py-1 text-sm font-bold">
              {m.age}
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">{m.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{m.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="border-[3px] border-ink bg-paper p-6 nb-shadow-sm">
          <span className="inline-block border-[3px] border-ink bg-grass px-3 py-1 text-sm font-bold text-white">
            On track — great signs
          </span>
          <ul className="mt-4 space-y-3">
            {SIGNS.map((s) => (
              <li key={s} className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">✅</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
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