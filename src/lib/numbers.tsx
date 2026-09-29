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
  tier: number;
}

function numberTier(value: number): number {
  if (value <= 6) return 1;
  if (value <= 10) return 2;
  if (value <= 15) return 3;
  return 4;
}

export const NUMBERS: NumberItem[] = Array.from({ length: 20 }, (_, i) => ({
  value: i + 1,
  tier: numberTier(i + 1),
}));

export const NUMBER_NAMES: Record<number, string> = {
  1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six",
  7: "seven", 8: "eight", 9: "nine", 10: "ten",
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
  16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen", 20: "twenty",
};

export const NUMBERS_LEVELS: LevelSpec = {
  names: ["Counting 1 to 6", "Counting 7 to 10", "Teen Numbers 11–15", "Teen Numbers 16–20"],
  emojis: ["🌱", "🧮", "🚀", "⭐"],
  tierOf: (itemKey) => numberTier(Number(itemKey)),
  sizeOf: (tier) => NUMBERS.filter((n) => n.tier === tier).length,
  graduation: 1,
};

export function numbersPlayPool(progress: ProgressMap): NumberItem[] {
  return playPoolByTier(NUMBERS, progress, NUMBERS_LEVELS, (n) => n.tier);
}

export function teensUnlocked(progress: ProgressMap): boolean {
  for (const n of NUMBERS.filter((x) => x.tier === 2)) {
    const p = progress[String(n.value)];
    if ((p?.correct ?? 0) < MASTERY_COUNT) return false;
  }
  return true;
}

const COUNT_EMOJIS = ["🦖", "🍎", "🐝", "⭐", "🎈", "🌼", "🍓"];

function buildRounds(progress: ProgressMap): Round[] {
  let pool = numbersPlayPool(progress);
  if (!teensUnlocked(progress)) pool = pool.filter((n) => n.value <= 10);
  const targets = pickTargets(pool, progress, (n) => String(n.value), SESSION_LENGTH);
  return targets.map((n, i) => {
    const showCount = i % 2 === 0;
    const emoji = COUNT_EMOJIS[Math.floor(Math.random() * COUNT_EMOJIS.length)];
    const name = NUMBER_NAMES[n.value];
    const options = pickOptions(n, pool, (x) => String(x.value), 3);
    return {
      itemKey: String(n.value),
      praiseWord: name,
      prompt: showCount ? "Find the number" : "Find the picture",
      spoken: showCount ? `Find the number. ${name}.` : `Find the picture. ${name}.`,
      display: showCount ? <span>{emoji.repeat(n.value)}</span> : <span>{n.value}</span>,
      options: options.map((o) => ({ key: String(o.value), node: <span>{o.value}</span> })),
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
