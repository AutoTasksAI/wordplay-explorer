import type { ReactNode } from "react";

export type ModuleId = "words" | "numbers" | "patterns";

/** Rounds per session — sized for a 5-year-old's attention span. */
export const SESSION_LENGTH = 8;

/** How many correct answers mark an item as "known". */
export const MASTERY_COUNT = 3;

export interface ProgressEntry {
  correct: number;
  wrong: number;
  lastPlayedAt: number;
}

/** Per-item mastery, keyed by the item's stable id (e.g. "cat", "3", "ab"). */
export interface ProgressMap {
  [key: string]: ProgressEntry;
}

export interface RoundOption {
  key: string;
  node: ReactNode;
}

/** One round of any module: what to show, what to say, what to pick. */
export interface Round {
  /** Stable id recorded in Convex for adaptive tracking. */
  itemKey: string;
  /** Word spoken in praise after a correct tap (e.g. "cat", "three", "red"). */
  praiseWord: string;
  /** Short banner text above the display. */
  prompt: string;
  /** Exact text spoken (also the TTS cache key). */
  spoken: string;
  /** The big thing in the middle of the screen. */
  display: ReactNode;
  /** Tap targets, one of which matches `targetKey`. */
  options: RoundOption[];
  targetKey: string;
}

/** Everything a module needs: branding, colors, and how to build its rounds. */
export interface ModuleConfig {
  id: ModuleId;
  title: string;
  /** Big start-screen title, split so the second part can be colored. */
  headline: [string, string];
  headlineColor: string;
  tagline: string;
  mascot: string;
  cardEmoji: string;
  cardBg: string;
  cardText: string;
  accent: string;
  accentText: string;
  countEmoji: string;
  countLabel: string;
  /** Used in the celebration line, e.g. "8 words explored!". */
  unitLabel: string;
  startHint: string;
  buildRounds: (progress: ProgressMap) => Round[];
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
 * Pick the next session's targets: least-mastered first (ties random), so
 * items the child misses come back and mastered items make way for new ones.
 * If the pool is smaller than `count`, it cycles through the pool.
 */
export function pickTargets<T>(
  pool: T[],
  progress: ProgressMap,
  keyOf: (item: T) => string,
  count: number,
): T[] {
  const scored = pool.map((item) => ({
    item,
    correct: progress[keyOf(item)]?.correct ?? 0,
  }));
  scored.sort((a, b) => {
    const diff = a.correct - b.correct;
    return diff !== 0 ? diff : Math.random() - 0.5;
  });

  const result: T[] = [];
  while (result.length < count) {
    for (const s of scored) {
      result.push(s.item);
      if (result.length >= count) break;
    }
  }
  return result;
}

/**
 * Build the 3 options for a round: the target plus two random distractors
 * from the pool, shuffled so the target isn't always first.
 */
export function pickOptions<T>(
  target: T,
  pool: T[],
  keyOf: (item: T) => string,
  count = 3,
): T[] {
  const distractors = shuffle(pool.filter((x) => keyOf(x) !== keyOf(target)));
  return shuffle([target, ...distractors.slice(0, count - 1)]);
}

/** Build a ProgressMap for one module from the shared player-state rows. */
export function buildProgressMap(
  rows: {
    module: ModuleId;
    item: string;
    correct: number;
    wrong: number;
    lastPlayedAt: number;
  }[],
  moduleId: ModuleId,
): ProgressMap {
  const map: ProgressMap = {};
  for (const row of rows) {
    if (row.module === moduleId) {
      map[row.item] = {
        correct: row.correct,
        wrong: row.wrong,
        lastPlayedAt: row.lastPlayedAt,
      };
    }
  }
  return map;
}
