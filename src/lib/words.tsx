import {
  SESSION_LENGTH,
  playPoolByTier,
  pickOptions,
  pickTargets,
  type LevelSpec,
  type ModuleConfig,
  type ProgressMap,
  type Round,
} from "./game-core";

export interface Word {
  word: string;
  emoji: string;
  tier: number;
}

export const WORDS: Word[] = [
  { word: "cat", emoji: "🐱", tier: 1 },
  { word: "dog", emoji: "🐶", tier: 1 },
];

export const WORDS_LEVELS: LevelSpec = {
  names: ["First Words", "Safari Words", "My World Words", "Big Kid Words"],
  emojis: ["🌱", "🦁", "🏠", "🚀"],
  tierOf: (itemKey) => {
    const w = WORDS.find((x) => x.word === itemKey);
    return w ? w.tier : 1;
  },
  sizeOf: (tier) => WORDS.filter((w) => w.tier === tier).length,
  graduation: 1,
};

function wordsPlayPool(progress: ProgressMap): Word[] {
  return playPoolByTier(WORDS, progress, WORDS_LEVELS, (w) => w.tier);
}

function buildRounds(progress: ProgressMap): Round[] {
  const pool = wordsPlayPool(progress);
  const targets = pickTargets(pool, progress, (w) => w.word, SESSION_LENGTH);
  return targets.map((w, i) => {
    const showPicture = i % 2 === 0;
    const options = pickOptions(w, pool, (x) => x.word, 3);
    return {
      itemKey: w.word,
      praiseWord: w.word,
      prompt: showPicture ? "Find the word" : "Find the picture",
      spoken: showPicture ? `Find the word. ${w.word}.` : `Find the picture. ${w.word}.`,
      display: showPicture ? (
        <span className="text-8xl leading-none sm:text-9xl">{w.emoji}</span>
      ) : (
        <span className="text-6xl font-bold tracking-wide sm:text-8xl">{w.word}</span>
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
  level: WORDS_LEVELS,
};
