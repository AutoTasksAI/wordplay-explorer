import {
  MASTERY_COUNT,
  SESSION_LENGTH,
  playPoolByTier,
  pickOptions,
  pickTargets,
  type LevelSpec,
  type ModuleConfig,
  type ProgressMap,
  type Round,
} from "./game-core";

export interface NumberItem {
  value: number;
  /** Curriculum tier — unlock one band at a time (see NUMBERS_LEVELS). */
  tier: number;
}

function numberTier(value: number): number {
  if (value <= 6) return 1;
  if (value <= 10) return 2;
  if (value <= 15) return 3;
  return 4;
}

/** Numbers 1–20 in four bands so 7–10 and teens unlock only after prior band mastery. */
export const NUMBERS: NumberItem[] = Array.from({ length: 20 }, (_, i) => ({
  value: i + 1,
  tier: numberTier(i + 1),
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
  names: [
    "Counting 1 to 6",
    "Counting 7 to 10",
    "Teen Numbers 11–15",
    "Teen Numbers 16–20",
  ],
  emojis: ["🌱", "🧮", "🚀", "⭐"],
  tierOf: (itemKey) => numberTier(Number(itemKey)),
  sizeOf: (tier) => NUMBERS.filter((n) => n.tier === tier).length,
  /** Every number in a band must be mastered before the next band appears in play. */
  graduation: 1,
};

/**
 * Numbers shown this session: only tiers the player has graduated into, capped
 * at the active curriculum tier (never teasers from the next band).
 */
export function numbersPlayPool(progress: ProgressMap): NumberItem[] {
  return playPoolByTier(NUMBERS, progress, NUMBERS_LEVELS, (n) => n.tier);
}

/** Teens (11+) only after 7–10 are each mastered at least once at MASTERY_COUNT. */
export function teensUnlocked(progress: ProgressMap): boolean {
  for (const n of NUMBERS.filter((x) => x.tier === 2)) {
    const p = progress[String(n.value)];
    if ((p?.correct ?? 0) < MASTERY_COUNT) return false;
  }
  return true;
}

/** The same counting emoji is used across a round's options so the task is
 *  pure counting, not recognizing different pictures. */
const COUNT_EMOJIS = ["🦖", "🍎", "🐝", "⭐", "🎈", "🌼", "🍓"];

type CountGridLayout = {
  colsClass: "grid-cols-4" | "grid-cols-5";
  gapClass: string;
  sizeClass: string;
  wrapClass: string;
};

/** Readability-first layout: fewer columns and larger gaps as counts grow. */
function countGridLayout(value: number, small: boolean): CountGridLayout {
  if (small) {
    if (value <= 5) {
      return {
        colsClass: "grid-cols-5",
        gapClass: "gap-1 sm:gap-1.5",
        sizeClass: "text-2xl leading-none sm:text-3xl",
        wrapClass: "w-full",
      };
    }
    if (value <= 10) {
      return {
        colsClass: "grid-cols-5",
        gapClass: "gap-1 sm:gap-2",
        sizeClass: "text-xl leading-none sm:text-2xl",
        wrapClass: "w-full",
      };
    }
    if (value <= 15) {
      return {
        colsClass: "grid-cols-4",
        gapClass: "gap-1 sm:gap-1.5",
        sizeClass: "text-lg leading-none sm:text-xl",
        wrapClass: "w-full",
      };
    }
    return {
      colsClass: "grid-cols-4",
      gapClass: "gap-1.5 sm:gap-2",
      sizeClass: "text-base leading-none sm:text-lg",
      wrapClass: "w-full max-h-[108px] overflow-y-auto overscroll-y-contain",
    };
  }

  if (value <= 5) {
    return {
      colsClass: "grid-cols-5",
      gapClass: "gap-3 sm:gap-4",
      sizeClass: "text-5xl leading-none sm:text-6xl",
      wrapClass: "w-full max-w-md mx-auto",
    };
  }
  if (value <= 10) {
    return {
      colsClass: "grid-cols-5",
      gapClass: "gap-2.5 sm:gap-3",
      sizeClass: "text-4xl leading-none sm:text-5xl",
      wrapClass: "w-full max-w-lg mx-auto",
    };
  }
  if (value <= 15) {
    return {
      colsClass: "grid-cols-4",
      gapClass: "gap-3 sm:gap-4",
      sizeClass: "text-3xl leading-none sm:text-4xl",
      wrapClass:
        "w-full max-w-lg mx-auto max-h-[min(380px,52vh)] overflow-y-auto overscroll-y-contain px-1 py-1",
    };
  }
  return {
    colsClass: "grid-cols-4",
    gapClass: "gap-3.5 sm:gap-5",
    sizeClass: "text-3xl leading-none sm:text-4xl",
    wrapClass:
      "w-full max-w-xl mx-auto max-h-[min(420px,55vh)] overflow-y-auto overscroll-y-contain px-1 py-2",
  };
}

/** A grid of `value` emojis, used as the display or as an option tile. */
function CountGrid({
  value,
  emoji,
  small = false,
}: {
  value: number;
  emoji: string;
  small?: boolean;
}) {
  const { colsClass, gapClass, sizeClass, wrapClass } = countGridLayout(
    value,
    small,
  );
  return (
    <div className={wrapClass}>
      <div
        className={
          "grid place-items-center justify-items-center " +
          colsClass +
          " " +
          gapClass
        }
      >
        {Array.from({ length: value }).map((_, i) => (
          <span
            key={i}
            className={"inline-flex items-center justify-center " + sizeClass}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Rounds alternate between counting a row of objects and picking the numeral
 * ("Find the number. Three.") and seeing the numeral and picking the matching
 * count ("Find the picture. Three."). Higher bands unlock only after every
 * number in the current band is mastered (see NUMBERS_LEVELS.graduation).
 */
function buildRounds(progress: ProgressMap): Round[] {
  let pool = numbersPlayPool(progress);
  if (!teensUnlocked(progress)) {
    pool = pool.filter((n) => n.value <= 10);
  }
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
          <span className="text-5xl font-bold sm:text-6xl">{o.value}</span>
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
