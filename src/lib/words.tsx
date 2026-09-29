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
  /** Curriculum tier, 1 = easiest. Higher tiers unlock as earlier ones are mastered. */
  tier: number;
}

/**
 * Word pool in four mastery bands (100% of a band before the next unlocks):
 *
 * Tier 1 "First Words": earliest CVC sight words.
 * Tier 2 "Safari Words": more animals, nature, and everyday nouns.
 * Tier 3 "My World Words": colors, family, food, home.
 * Tier 4 "Big Kid Words": blends, digraphs, multisyllable words.
 */
export const WORDS: Word[] = [
  // Tier 1: first CVC words
  { word: "cat", emoji: "🐱", tier: 1 },
  { word: "dog", emoji: "🐶", tier: 1 },
  { word: "pig", emoji: "🐷", tier: 1 },
  { word: "cow", emoji: "🐮", tier: 1 },
  { word: "fox", emoji: "🦊", tier: 1 },
  { word: "bee", emoji: "🐝", tier: 1 },
  { word: "owl", emoji: "🦉", tier: 1 },
  { word: "duck", emoji: "🦆", tier: 1 },
  { word: "fish", emoji: "🐟", tier: 1 },
  { word: "ant", emoji: "🐜", tier: 1 },
  { word: "sun", emoji: "☀️", tier: 1 },
  { word: "moon", emoji: "🌙", tier: 1 },
  { word: "star", emoji: "⭐", tier: 1 },
  { word: "hat", emoji: "🎩", tier: 1 },
  { word: "bus", emoji: "🚌", tier: 1 },
  { word: "car", emoji: "🚗", tier: 1 },
  { word: "egg", emoji: "🥚", tier: 1 },
  { word: "cup", emoji: "🥤", tier: 1 },
  { word: "box", emoji: "📦", tier: 1 },
  { word: "key", emoji: "🔑", tier: 1 },
  // Tier 2: safari + more starter nouns
  { word: "book", emoji: "📖", tier: 2 },
  { word: "tree", emoji: "🌳", tier: 2 },
  { word: "ball", emoji: "⚽", tier: 2 },
  { word: "bed", emoji: "🛏️", tier: 2 },
  { word: "frog", emoji: "🐸", tier: 2 },
  { word: "bear", emoji: "🐻", tier: 2 },
  { word: "lion", emoji: "🦁", tier: 2 },
  { word: "tiger", emoji: "🐯", tier: 2 },
  { word: "bird", emoji: "🐦", tier: 2 },
  { word: "chick", emoji: "🐤", tier: 2 },
  { word: "whale", emoji: "🐳", tier: 2 },
  { word: "snake", emoji: "🐍", tier: 2 },
  { word: "horse", emoji: "🐴", tier: 2 },
  { word: "cake", emoji: "🎂", tier: 2 },
  { word: "milk", emoji: "🥛", tier: 2 },
  { word: "leaf", emoji: "🍃", tier: 2 },
  { word: "hand", emoji: "✋", tier: 2 },
  { word: "nose", emoji: "👃", tier: 2 },
  { word: "rain", emoji: "🌧️", tier: 2 },

  // Tier 3: my-world words (colors, family, food, clothes, home)
  { word: "red", emoji: "🟥", tier: 3 },
  { word: "blue", emoji: "🟦", tier: 3 },
  { word: "yellow", emoji: "🟨", tier: 3 },
  { word: "green", emoji: "🟩", tier: 3 },
  { word: "pink", emoji: "🌸", tier: 3 },
  { word: "mom", emoji: "👩", tier: 3 },
  { word: "dad", emoji: "👨", tier: 3 },
  { word: "baby", emoji: "👶", tier: 3 },
  { word: "apple", emoji: "🍎", tier: 3 },
  { word: "banana", emoji: "🍌", tier: 3 },
  { word: "bread", emoji: "🍞", tier: 3 },
  { word: "cheese", emoji: "🧀", tier: 3 },
  { word: "pizza", emoji: "🍕", tier: 3 },
  { word: "juice", emoji: "🧃", tier: 3 },
  { word: "water", emoji: "💧", tier: 3 },
  { word: "shoe", emoji: "👟", tier: 3 },
  { word: "sock", emoji: "🧦", tier: 3 },
  { word: "shirt", emoji: "👕", tier: 3 },
  { word: "door", emoji: "🚪", tier: 3 },
  { word: "chair", emoji: "🪑", tier: 3 },
  { word: "window", emoji: "🪟", tier: 3 },
  { word: "bath", emoji: "🛁", tier: 3 },
  { word: "soap", emoji: "🧼", tier: 3 },
  { word: "spoon", emoji: "🥄", tier: 3 },
  { word: "plate", emoji: "🍽️", tier: 3 },
  { word: "flower", emoji: "🌻", tier: 3 },
  { word: "bug", emoji: "🐞", tier: 3 },
  { word: "home", emoji: "🏠", tier: 3 },

  // Tier 4: big-kid words (blends, digraphs, multisyllable)
  { word: "train", emoji: "🚂", tier: 4 },
  { word: "plane", emoji: "✈️", tier: 4 },
  { word: "boat", emoji: "⛵", tier: 4 },
  { word: "truck", emoji: "🚚", tier: 4 },
  { word: "bike", emoji: "🚲", tier: 4 },
  { word: "cloud", emoji: "☁️", tier: 4 },
  { word: "snow", emoji: "❄️", tier: 4 },
  { word: "storm", emoji: "⛈️", tier: 4 },
  { word: "rainbow", emoji: "🌈", tier: 4 },
  { word: "queen", emoji: "👸", tier: 4 },
  { word: "king", emoji: "🤴", tier: 4 },
  { word: "castle", emoji: "🏰", tier: 4 },
  { word: "dragon", emoji: "🐉", tier: 4 },
  { word: "unicorn", emoji: "🦄", tier: 4 },
  { word: "monster", emoji: "👾", tier: 4 },
  { word: "ghost", emoji: "👻", tier: 4 },
  { word: "fairy", emoji: "🧚", tier: 4 },
  { word: "guitar", emoji: "🎸", tier: 4 },
  { word: "drum", emoji: "🥁", tier: 4 },
  { word: "piano", emoji: "🎹", tier: 4 },
  { word: "butterfly", emoji: "🦋", tier: 4 },
  { word: "spider", emoji: "🕷️", tier: 4 },
  { word: "turtle", emoji: "🐢", tier: 4 },
  { word: "dolphin", emoji: "🐬", tier: 4 },
  { word: "shark", emoji: "🦈", tier: 4 },
  { word: "octopus", emoji: "🐙", tier: 4 },
];

export const WORDS_LEVELS: LevelSpec = {
  names: [
    "First Words",
    "Safari Words",
    "My World Words",
    "Big Kid Words",
  ],
  emojis: ["🌱", "🦁", "🏠", "🚀"],
  tierOf: (itemKey) => {
    const w = WORDS.find((x) => x.word === itemKey);
    return w ? w.tier : 1;
  },
  sizeOf: (tier) => WORDS.filter((w) => w.tier === tier).length,
  /** Every word in a band must be mastered before harder words enter the pool. */
  graduation: 1,
};

function wordsPlayPool(progress: ProgressMap): Word[] {
  return playPoolByTier(WORDS, progress, WORDS_LEVELS, (w) => w.tier);
}

/**
 * Rounds alternate between seeing the picture and picking the printed word
 * ("Find the word. Cat.") and seeing the printed word and picking the picture
 * ("Find the picture. Cat."). Only unlocked tiers are drawn from, so the game
 * always matches the player's level while mastered words keep cycling back.
 */
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
  level: WORDS_LEVELS,
};
