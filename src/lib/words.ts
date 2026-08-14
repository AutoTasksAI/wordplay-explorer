export interface Word {
  word: string;
  emoji: string;
}

/**
 * Version 1 word pool: simple, mostly CVC words with a clear picture
 * (emoji) so a very beginning reader can match word → meaning.
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

/** Words per session — sized for a 5-year-old's attention span. */
export const SESSION_LENGTH = 8;

/** How many correct answers mark a word as "known". */
export const MASTERY_COUNT = 3;

/** A round shows either the picture (tap the word) or the word (tap the picture). */
export type RoundType = "word" | "picture";

export interface ProgressMap {
  [word: string]: { correct: number; wrong: number; lastPlayedAt: number };
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Pick the next session's target words: least-mastered first (ties are
 * random), so words the child misses come back and mastered words make way
 * for new ones.
 */
export function pickTargets(
  progress: ProgressMap,
  count: number,
  pool: Word[] = WORDS,
): Word[] {
  const scored = pool.map((w) => ({
    ...w,
    correct: progress[w.word]?.correct ?? 0,
  }));
  scored.sort((a, b) => {
    const diff = a.correct - b.correct;
    return diff !== 0 ? diff : Math.random() - 0.5;
  });
  return scored.slice(0, count);
}

/**
 * Build the 3 options for a round: the target plus two random distractors
 * from the pool, shuffled so the target isn't always first.
 */
export function pickOptions(
  target: Word,
  pool: Word[] = WORDS,
  count = 3,
): Word[] {
  const distractors = shuffle(pool.filter((w) => w.word !== target.word));
  return shuffle([target, ...distractors.slice(0, count - 1)]);
}
