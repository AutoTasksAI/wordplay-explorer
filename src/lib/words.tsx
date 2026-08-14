import {
  SESSION_LENGTH,
  pickOptions,
  pickTargets,
  type ModuleConfig,
  type ProgressMap,
  type Round,
} from "./game-core";

export interface Word {
  word: string;
  emoji: string;
}

/**
 * Word pool: simple, mostly CVC words with a clear picture (emoji) so a very
 * beginning reader can match word → meaning.
 */
export const WORDS: Word[] = [
  { word: "cat", emoji: "🐱" },
  { word: "dog", emoji: "🐶" },
  { word: "pig", emoji: "🐷" },
  { word: "cow", emoji: "🐮" },
  { word: "fox", emoji: "🦊" },
  { word: "bee", emoji: "🐝" },
  { word: "owl", emoji: "🦉" },
  { word: "duck", emoji: "🦆" },
  { word: "fish", emoji: "🐟" },
  { word: "ant", emoji: "🐜" },
  { word: "sun", emoji: "☀️" },
  { word: "moon", emoji: "🌙" },
  { word: "star", emoji: "⭐" },
  { word: "hat", emoji: "🎩" },
  { word: "bus", emoji: "🚌" },
  { word: "car", emoji: "🚗" },
  { word: "egg", emoji: "🥚" },
  { word: "cup", emoji: "🥤" },
  { word: "box", emoji: "📦" },
  { word: "key", emoji: "🔑" },
  { word: "book", emoji: "📖" },
  { word: "tree", emoji: "🌳" },
  { word: "ball", emoji: "⚽" },
  { word: "bed", emoji: "🛏️" },
];

/**
 * Rounds alternate between seeing the picture and picking the printed word
 * ("Find the word. Cat.") and seeing the printed word and picking the picture
 * ("Find the picture. Cat.").
 */
function buildRounds(progress: ProgressMap): Round[] {
  const targets = pickTargets(WORDS, progress, (w) => w.word, SESSION_LENGTH);
  return targets.map((w, i) => {
    const showPicture = i % 2 === 0;
    const options = pickOptions(w, WORDS, (x) => x.word, 3);
    return {
      itemKey: w.word,
      praiseWord: w.word,
      prompt: showPicture ? "Find the word" : "Find the picture",
      spoken: showPicture
        ? `Find the word. ${w.word}.`
        : `Find the picture. ${w.word}.`,
      display: showPicture ? (
        <span className="text-8xl leading-none sm:text-9xl">{w.emoji}</span>
      ) : (
        <span className="text-6xl font-bold tracking-wide sm:text-8xl">
          {w.word}
        </span>
      ),
      options: options.map((o) => ({
        key: o.word,
        node: showPicture ? (
          <span className="text-3xl font-bold sm:text-5xl">{o.word}</span>
        ) : (
          <span className="text-6xl leading-none sm:text-7xl">{o.emoji}</span>
        ),
      })),
      targetKey: w.word,
    };
  });
}

export const WORDS_MODULE: ModuleConfig = {
  id: "words",
  title: "Word Safari",
  headline: ["WORD", "SAFARI!"],
  headlineColor: "text-tomato",
  tagline: "Rex says a word, you tap the match. Every win gets a star!",
  mascot: "🦖",
  cardEmoji: "🔤",
  cardBg: "bg-tomato",
  cardText: "text-white",
  accent: "bg-tomato",
  accentText: "text-white",
  countEmoji: "🔤",
  countLabel: "words known",
  unitLabel: "words",
  startHint: "Tap PLAY and listen for Rex! 👂",
  buildRounds,
};
