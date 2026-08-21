import {
  SESSION_LENGTH,
  computeLevel,
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
 * Word pool, split into three curriculum levels:
 *
 * Tier 1 "Starter Words": simple, mostly CVC words with a clear picture so a
 * very beginning reader can match word → meaning.
 *
 * Tier 2 "My World Words": the everyday words a kid actually wants to use,
 * colors, family, food, clothes, things around the house.
 *
 * Tier 3 "Big Kid Words": blends, digraphs and multisyllable words for
 * readers who are ready for a real challenge.
 */
export const WORDS: Word[] = [
  // Tier 1: starter CVC words
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
  { word: "book", emoji: "📖", tier: 1 },
  { word: "tree", emoji: "🌳", tier: 1 },
  { word: "ball", emoji: "⚽", tier: 1 },
  { word: "bed", emoji: "🛏️", tier: 1 },
  // Safari friends + everyday words for more variety
  { word: "frog", emoji: "🐸", tier: 1 },
  { word: "bear", emoji: "🐻", tier: 1 },
  { word: "lion", emoji: "🦁", tier: 1 },
  { word: "tiger", emoji: "🐯", tier: 1 },
  { word: "bird", emoji: "🐦", tier: 1 },
  { word: "chick", emoji: "🐤", tier: 1 },
  { word: "whale", emoji: "🐳", tier: 1 },
  { word: "snake", emoji: "🐍", tier: 1 },
  { word: "horse", emoji: "🐴", tier: 1 },
  { word: "cake", emoji: "🎂", tier: 1 },
  { word: "milk", emoji: "🥛", tier: 1 },
  { word: "leaf", emoji: "🍃", tier: 1 },
  { word: "hand", emoji: "✋", tier: 1 },
  { word: "nose", emoji: "👃", tier: 1 },
  { word: "rain", emoji: "🌧️", tier: 1 },

  // Tier 2: my-world words (colors, family, food, clothes, home)
  { word: "red", emoji: "🟥", tier: 2 },
  { word: "blue", emoji: "🟦", tier: 2 },
  { word: "yellow", emoji: "🟨", tier: 2 },
  { word: "green", emoji: "🟩", tier: 2 },
  { word: "pink", emoji: "🌸", tier: 2 },
  { word: "mom", emoji: "👩", tier: 2 },
  { word: "dad", emoji: "👨", tier: 2 },
  { word: "baby", emoji: "👶", tier: 2 },
  { word: "apple", emoji: "🍎", tier: 2 },
  { word: "banana", emoji: "🍌", tier: 2 },
  { word: "bread", emoji: "🍞", tier: 2 },
  { word: "cheese", emoji: "🧀", tier: 2 },
  { word: "pizza", emoji: "🍕", tier: 2 },
  { word: "juice", emoji: "🧃", tier: 2 },
  { word: "water", emoji: "💧", tier: 2 },
  { word: "shoe", emoji: "👟", tier: 2 },
  { word: "sock", emoji: "🧦", tier: 2 },
  { word: "shirt", emoji: "👕", tier: 2 },
  { word: "door", emoji: "🚪", tier: 2 },
  { word: "chair", emoji: "🪑", tier: 2 },
  { word: "window", emoji: "🪟", tier: 2 },
  { word: "bath", emoji: "🛁", tier: 2 },
  { word: "soap", emoji: "🧼", tier: 2 },
  { word: "spoon", emoji: "🥄", tier: 2 },
  { word: "plate", emoji: "🍽️", tier: 2 },
  { word: "flower", emoji: "🌻", tier: 2 },
  { word: "bug", emoji: "🐞", tier: 2 },
  { word: "home", emoji: "🏠", tier: 2 },

  // Tier 3: big-kid words (blends, digraphs, multisyllable)
  { word: "train", emoji: "🚂", tier: 3 },
  { word: "plane", emoji: "✈️", tier: 3 },
  { word: "boat", emoji: "⛵", tier: 3 },
  { word: "truck", emoji: "🚚", tier: 3 },
  { word: "bike", emoji: "🚲", tier: 3 },
  { word: "cloud", emoji: "☁️", tier: 3 },
  { word: "snow", emoji: "❄️", tier: 3 },
  { word: "storm", emoji: "⛈️", tier: 3 },
  { word: "rainbow", emoji: "🌈", tier: 3 },
  { word: "queen", emoji: "👸", tier: 3 },
  { word: "king", emoji: "🤴", tier: 3 },
  { word: "castle", emoji: "🏰", tier: 3 },
  { word: "dragon", emoji: "🐉", tier: 3 },
  { word: "unicorn", emoji: "🦄", tier: 3 },
  { word: "monster", emoji: "👾", tier: 3 },
  { word: "ghost", emoji: "👻", tier: 3 },
  { word: "fairy", emoji: "🧚", tier: 3 },
  { word: "guitar", emoji: "🎸", tier: 3 },
  { word: "drum", emoji: "🥁", tier: 3 },
  { word: "piano", emoji: "🎹", tier: 3 },
  { word: "butterfly", emoji: "🦋", tier: 3 },
  { word: "spider", emoji: "🕷️", tier: 3 },
  { word: "turtle", emoji: "🐢", tier: 3 },
  { word: "dolphin", emoji: "🐬", tier: 3 },
  { word: "shark", emoji: "🦈", tier: 3 },
  { word: "octopus", emoji: "🐙", tier: 3 },
];

export const WORDS_LEVELS: LevelSpec = {
  names: ["Starter Words", "My World Words", "Big Kid Words"],
  emojis: ["🌱", "🏠", "🚀"],
  tierOf: (itemKey) => {
    const w = WORDS.find((x) => x.word === itemKey);
    return w ? w.tier : 1;
  },
  sizeOf: (tier) => WORDS.filter((w) => w.tier === tier).length,
};

/**
 * Rounds alternate between seeing the picture and picking the printed word
 * ("Find the word. Cat.") and seeing the printed word and picking the picture
 * ("Find the picture. Cat."). Only unlocked tiers are drawn from, so the game
 * always matches the player's level while mastered words keep cycling back.
 */
function buildRounds(progress: ProgressMap): Round[] {
  const level = computeLevel(progress, WORDS_LEVELS);
  const pool = WORDS.filter((w) => w.tier <= level.tier);
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
