/**
 * Star milestone celebrations. Every 20 lifetime stars a creature friend
 * throws a party, and each new creature in the roster throws a bigger one
 * than the last. After the full roster the ladder repeats, so there is
 * always another friend to meet.
 */
export const MILESTONE_STEP = 20;

export interface MilestoneCreature {
  kind: string;
  emoji: string;
  /** Celebration length in ms; later creatures party longer. */
  durationMs: number;
}

export const MILESTONE_CREATURES: MilestoneCreature[] = [
  { kind: "spider", emoji: "🕷️", durationMs: 9000 },
  { kind: "bat", emoji: "🦇", durationMs: 13500 },
  { kind: "octopus", emoji: "🐙", durationMs: 11000 },
  { kind: "lizard", emoji: "🦎", durationMs: 14500 },
  { kind: "dragon", emoji: "🐉", durationMs: 16000 },
  { kind: "unicorn", emoji: "🦄", durationMs: 14000 },
  { kind: "whale", emoji: "🐳", durationMs: 15000 },
  { kind: "rex", emoji: "🦖", durationMs: 18000 },
];

export function creatureForMilestone(index: number): MilestoneCreature {
  const n = MILESTONE_CREATURES.length;
  return MILESTONE_CREATURES[((index % n) + n) % n];
}
