import {
  SESSION_LENGTH,
  pickTargets,
  shuffle,
  type ModuleConfig,
  type ProgressMap,
  type Round,
} from "./game-core";

export interface PatternColor {
  emoji: string;
  name: string;
}

export const COLORS: PatternColor[] = [
  { emoji: "🔴", name: "red" },
  { emoji: "🟠", name: "orange" },
  { emoji: "🟡", name: "yellow" },
  { emoji: "🟢", name: "green" },
  { emoji: "🔵", name: "blue" },
  { emoji: "🟣", name: "purple" },
];

export interface PatternType {
  id: string;
  name: string;
}

/** The pattern shapes a 5-year-old meets first, in difficulty order. */
export const PATTERN_TYPES: PatternType[] = [
  { id: "ab", name: "AB" },
  { id: "aabb", name: "AABB" },
  { id: "abb", name: "ABB" },
  { id: "aab", name: "AAB" },
  { id: "abc", name: "ABC" },
];

/** The repeating unit for the chosen pattern type. */
function buildCycle(type: PatternType, colors: PatternColor[]): PatternColor[] {
  const [a, b, c] = colors;
  switch (type.id) {
    case "ab":
      return [a, b];
    case "aabb":
      return [a, a, b, b];
    case "abb":
      return [a, b, b];
    case "aab":
      return [a, a, b];
    case "abc":
      return [a, b, c];
    default:
      return [a, b];
  }
}

/** The first six items of the repeating pattern. */
function buildVisible(
  type: PatternType,
  colors: PatternColor[],
): PatternColor[] {
  const cycle = buildCycle(type, colors);
  return Array.from({ length: 6 }, (_, i) => cycle[i % cycle.length]);
}

function pickDistractor(colors: PatternColor[]): PatternColor {
  const used = new Set(colors.map((c) => c.name));
  const pool = COLORS.filter((c) => !used.has(c.name));
  return pool[Math.floor(Math.random() * pool.length)];
}

/** The pattern row: colored boxes with one "?" slot. */
function PatternRow({ slots }: { slots: (PatternColor | null)[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      {slots.map((slot, i) => (
        <span
          key={i}
          className={`flex size-10 items-center justify-center border-[3px] border-ink sm:size-12 ${
            slot ? "bg-white" : "bg-sun text-2xl font-bold sm:text-3xl"
          }`}
        >
          {slot ? (
            <span className="text-2xl leading-none sm:text-3xl">
              {slot.emoji}
            </span>
          ) : (
            "?"
          )}
        </span>
      ))}
    </div>
  );
}

/**
 * Rounds alternate between "what comes next?" (hole at the end) and "what is
 * missing?" (hole in the middle). Options are the pattern's own colors plus
 * one decoy, shuffled.
 */
function buildPatternRound(type: PatternType, isNext: boolean): Round {
  const itemCount = type.id === "abc" ? 3 : 2;
  const colors = shuffle(COLORS).slice(0, itemCount);
  const cycle = buildCycle(type, colors);
  const visible = buildVisible(type, colors);

  const slots: (PatternColor | null)[] = isNext
    ? [...visible, null]
    : visible.map((c, i) => (i === 2 ? null : c));
  // "Next": the hole sits after the six visible items, so the answer is the
  // first item of the next cycle (position 6), NOT the last visible item.
  // "Missing": the hole replaces position 2 of the cycle.
  const answer = isNext ? cycle[6 % cycle.length] : cycle[2 % cycle.length];
  const visibleForSpeech = slots.filter(
    (c): c is PatternColor => c !== null,
  );

  const optionColors =
    type.id === "abc"
      ? [...colors]
      : [colors[0], colors[1], pickDistractor(colors)];

  return {
    itemKey: type.id,
    praiseWord: answer.name,
    prompt: isNext ? "What comes next?" : "What is missing?",
    spoken: `${isNext ? "What comes next" : "What is missing"}? ${visibleForSpeech
      .map((c) => c.name)
      .join(", ")}.`,
    display: <PatternRow slots={slots} />,
    options: shuffle(optionColors).map((c) => ({
      key: c.emoji,
      node: <span className="text-5xl leading-none sm:text-6xl">{c.emoji}</span>,
    })),
    targetKey: answer.emoji,
  };
}

function buildRounds(progress: ProgressMap): Round[] {
  const targets = pickTargets(
    PATTERN_TYPES,
    progress,
    (t) => t.id,
    SESSION_LENGTH,
  );
  return targets.map((type, i) => buildPatternRound(type, i % 2 === 0));
}

export const PATTERNS_MODULE: ModuleConfig = {
  id: "patterns",
  title: "Pattern Path",
  headline: ["PATTERN", "PATH!"],
  headlineColor: "text-grass",
  tagline: "Spot what comes next in the pattern. Every win gets a star!",
  mascot: "🦖",
  cardEmoji: "🧩",
  cardBg: "bg-grass",
  cardText: "text-ink",
  accent: "bg-grass",
  accentText: "text-ink",
  countEmoji: "🧩",
  countLabel: "patterns mastered",
  unitLabel: "patterns",
  startHint: "Tap PLAY and spot the pattern with Rex! 👂",
  buildRounds,
};
