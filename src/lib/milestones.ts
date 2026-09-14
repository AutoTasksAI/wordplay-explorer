/**
 * Star milestone celebrations. Every 20 lifetime stars a creature friend
 * throws a party. The roster has 50 unique pals; the ladder only repeats
 * after every friend has been met once.
 */
export const MILESTONE_STEP = 20;

export const MILESTONE_ROSTER_SIZE = 50;

export type CelebrationStyle =
  | "custom"
  | "bounce"
  | "spin"
  | "slide"
  | "float"
  | "shake"
  | "pop"
  | "zoom"
  | "wiggle"
  | "orbit"
  | "rain";

export interface MilestoneCreature {
  kind: string;
  emoji: string;
  /** Celebration length in ms; later creatures party longer. */
  durationMs: number;
  /** Simple pals use a shared overlay with distinct motion. */
  style?: CelebrationStyle;
}

export const MILESTONE_CREATURES: MilestoneCreature[] = [
  { kind: "spider", emoji: "🕷️", durationMs: 9000, style: "custom" },
  { kind: "bat", emoji: "🦇", durationMs: 13500, style: "custom" },
  { kind: "octopus", emoji: "🐙", durationMs: 11000, style: "custom" },
  { kind: "lizard", emoji: "🦎", durationMs: 14500, style: "custom" },
  { kind: "dragon", emoji: "🐉", durationMs: 16000, style: "custom" },
  { kind: "black-stallion", emoji: "🐴", durationMs: 14000, style: "custom" },
  { kind: "whale", emoji: "🐳", durationMs: 15000, style: "custom" },
  { kind: "rex", emoji: "🦖", durationMs: 18000, style: "custom" },
  { kind: "monster-truck", emoji: "🛻", durationMs: 12000, style: "custom" },
  { kind: "giga-lizard", emoji: "🦕", durationMs: 13000, style: "custom" },
  { kind: "theater-curtains", emoji: "🎭", durationMs: 10000, style: "custom" },
  { kind: "penguin", emoji: "🐧", durationMs: 8500, style: "wiggle" },
  { kind: "bunny", emoji: "🐰", durationMs: 8500, style: "bounce" },
  { kind: "frog", emoji: "🐸", durationMs: 8500, style: "pop" },
  { kind: "owl", emoji: "🦉", durationMs: 9000, style: "float" },
  { kind: "bee", emoji: "🐝", durationMs: 8500, style: "orbit" },
  { kind: "butterfly", emoji: "🦋", durationMs: 9000, style: "float" },
  { kind: "crab", emoji: "🦀", durationMs: 8500, style: "slide" },
  { kind: "jellyfish", emoji: "🪼", durationMs: 9000, style: "float" },
  { kind: "turtle", emoji: "🐢", durationMs: 9500, style: "spin" },
  { kind: "flamingo", emoji: "🦩", durationMs: 8500, style: "wiggle" },
  { kind: "koala", emoji: "🐨", durationMs: 9000, style: "shake" },
  { kind: "panda", emoji: "🐼", durationMs: 9000, style: "bounce" },
  { kind: "sloth", emoji: "🦥", durationMs: 10000, style: "float" },
  { kind: "hedgehog", emoji: "🦔", durationMs: 8500, style: "pop" },
  { kind: "snail", emoji: "🐌", durationMs: 9500, style: "slide" },
  { kind: "ladybug", emoji: "🐞", durationMs: 8000, style: "orbit" },
  { kind: "caterpillar", emoji: "🐛", durationMs: 9000, style: "slide" },
  { kind: "squirrel", emoji: "🐿️", durationMs: 8500, style: "zoom" },
  { kind: "raccoon", emoji: "🦝", durationMs: 8500, style: "shake" },
  { kind: "fox", emoji: "🦊", durationMs: 8500, style: "slide" },
  { kind: "wolf", emoji: "🐺", durationMs: 9000, style: "zoom" },
  { kind: "moose", emoji: "🫎", durationMs: 9000, style: "shake" },
  { kind: "giraffe", emoji: "🦒", durationMs: 9500, style: "wiggle" },
  { kind: "elephant", emoji: "🐘", durationMs: 9500, style: "bounce" },
  { kind: "hippo", emoji: "🦛", durationMs: 9000, style: "pop" },
  { kind: "zebra", emoji: "🦓", durationMs: 8500, style: "slide" },
  { kind: "lion", emoji: "🦁", durationMs: 9000, style: "zoom" },
  { kind: "tiger", emoji: "🐯", durationMs: 9000, style: "slide" },
  { kind: "camel", emoji: "🐫", durationMs: 9000, style: "float" },
  { kind: "parrot", emoji: "🦜", durationMs: 8500, style: "orbit" },
  { kind: "toucan", emoji: "🦤", durationMs: 8500, style: "bounce" },
  { kind: "peacock", emoji: "🦚", durationMs: 9500, style: "rain" },
  { kind: "seal", emoji: "🦭", durationMs: 8500, style: "wiggle" },
  { kind: "otter", emoji: "🦦", durationMs: 9000, style: "slide" },
  { kind: "dolphin", emoji: "🐬", durationMs: 9000, style: "zoom" },
  { kind: "shark", emoji: "🦈", durationMs: 9000, style: "orbit" },
  { kind: "starfish", emoji: "⭐", durationMs: 8500, style: "spin" },
  { kind: "rocket", emoji: "🚀", durationMs: 9500, style: "zoom" },
  { kind: "rain", emoji: "🌧️", durationMs: 14000, style: "custom" },
];

/** Stars needed to unlock every pal in the roster (50 × 20). */
export const FULL_ROSTER_STARS =
  MILESTONE_ROSTER_SIZE * MILESTONE_STEP;

/**
 * Returns the creature for milestone index `index` (0 = first pal at 20 stars).
 * Indices 0–49 are unique; after the full roster the ladder repeats.
 */
export function creatureForMilestone(index: number): MilestoneCreature {
  const n = MILESTONE_CREATURES.length;
  return MILESTONE_CREATURES[((index % n) + n) % n];
}
