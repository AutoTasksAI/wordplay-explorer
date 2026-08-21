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

export interface NumberItem {
  value: number;
  /** Curriculum tier: 1 = counting 1-10, 2 = teen numbers 11-20. */
  tier: number;
}

/** Numbers 1-10 are the classic first counting range; 11-20 unlock next. */
export const NUMBERS: NumberItem[] = Array.from({ length: 20 }, (_, i) => ({
  value: i + 1,
  tier: i < 10 ? 1 : 2,
}));

export const NUMBER_NAMES: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
  20: "twenty",
};

export const NUMBERS_LEVELS: LevelSpec = {
  names: ["Counting 1 to 10", "Teen Numbers"],
  emojis: ["🧮", "🚀"],
  tierOf: (itemKey) => (Number(itemKey) <= 10 ? 1 : 2),
  sizeOf: (tier) => (tier === 1 ? 10 : 10),
};

/** The same counting emoji is used across a round's options so the task is
 *  pure counting, not recognizing different pictures. */
const COUNT_EMOJIS = ["🦖", "🍎", "🐝", "⭐", "🎈", "🌼", "🍓"];

/** A row of `value` emojis, used as the display or as an option tile. */
function CountGrid({
  value,
  emoji,
  small = false,
}: {
  value: number;
  emoji: string;
  small?: boolean;
}) {
  return (
    <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
      {Array.from({ length: value }).map((_, i) => (
        <span
          key={i}
          className={
            small
              ? "text-xl leading-none sm:text-2xl"
              : "text-4xl leading-none sm:text-6xl"
          }
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

/**
 * Rounds alternate between counting a row of objects and picking the numeral
 * ("Find the number. Three.") and seeing the numeral and picking the matching
 * count ("Find the picture. Three."). Teen numbers unlock once counting to
 * ten is mostly mastered.
 */
function buildRounds(progress: ProgressMap): Round[] {
  const level = computeLevel(progress, NUMBERS_LEVELS);
  const pool = NUMBERS.filter((n) => n.tier <= level.tier);
  const targets = pickTargets(
    pool,
    progress,
    (n) => String(n.value),
    SESSION_LENGTH,
  );
  return targets.map((n, i) => {
    const showCount = i % 2 === 0;
    // Randomize which emoji is counted each round (still the same emoji across
    // a round's options so it stays pure counting, but different every round
    // so sessions don't feel identical).
    const emoji =
      COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];
    const name = NUMBER_NAMES[n.value];
    const options = pickOptions(
      n,
      pool,
      (x) => String(x.value),
      3,
    );
    return {
      itemKey: String(n.value),
      praiseWord: name,
      prompt: showCount ? "Find the number" : "Find the picture",
      spoken: showCount
        ? `Find the number. ${name}.`
        : `Find the picture. ${name}.`,
      display: showCount ? (
        <CountGrid value={n.value} emoji={emoji} />
      ) : (
        <span className="text-8xl font-bold tracking-wide sm:text-9xl">
          {n.value}
        </span>
      ),
      options: options.map((o) => ({
        key: String(o.value),
        node: showCount ? (
          <span className="text-4xl font-bold sm:text-6xl">{o.value}</span>
        ) : (
          <CountGrid value={o.value} emoji={emoji} small />
        ),
      })),
      targetKey: String(n.value),
    };
  });
}

export const NUMBERS_MODULE: ModuleConfig = {
  id: "numbers",
  title: "Number Jungle",
  headline: ["NUMBER", "JUNGLE!"],
  headlineColor: "text-sky",
  tagline: "Count the dots, find the number. Every win gets a star!",
  mascot: "🦖",
  cardEmoji: "🔢",
  cardBg: "bg-sky",
  cardText: "text-white",
  accent: "bg-sky",
  accentText: "text-white",
  countEmoji: "🔢",
  countLabel: "numbers learned",
  unitLabel: "numbers",
  startHint: "Tap PLAY and count with Rex! 👂",
  buildRounds,
  level: NUMBERS_LEVELS,
};
