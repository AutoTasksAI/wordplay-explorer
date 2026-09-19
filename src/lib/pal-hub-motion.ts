import type { CelebrationStyle, MilestoneCreature } from "@/lib/milestones";

type Ease = "easeInOut" | "easeOut" | "linear";

export interface PalTapMotion {
  animate: {
    x?: number | number[];
    y?: number | number[];
    rotate?: number | number[];
    scale?: number | number[];
  };
  transition: {
    duration: number;
    ease?: Ease;
    times?: number[];
  };
}

/** Desktop hover — subtle, loops only where it reads as a “hello” wiggle. */
export function palHoverProps(creature: MilestoneCreature) {
  const style = creature.style ?? "bounce";
  if (style === "custom") {
    return customHover(creature.kind);
  }
  const base = { scale: 1.1, y: -3 };
  switch (style) {
    case "wiggle":
    case "shake":
      return { ...base, rotate: [0, -10, 10, -6, 6, 0] };
    case "spin":
    case "orbit":
      return { scale: 1.12, rotate: [0, 8, -8, 0] };
    case "float":
      return { scale: 1.1, y: [-4, -8, -4] };
    case "slide":
    case "zoom":
      return { scale: 1.12, x: [0, 4, -4, 0] };
    case "pop":
      return { scale: [1, 1.14, 1.08] };
    case "rain":
      return { scale: 1.1, y: [0, -2, 0] };
    case "bounce":
    default:
      return { scale: 1.12, y: -5 };
  }
}

export function palHoverTransition(creature: MilestoneCreature) {
  const style = creature.style ?? "bounce";
  const wiggle =
    style === "wiggle" ||
    style === "shake" ||
    (style === "custom" &&
      (creature.kind === "spider" || creature.kind === "bat"));
  return {
    duration: wiggle ? 0.45 : 0.22,
    repeat: wiggle ? Infinity : 0,
    ease: "easeInOut" as const,
  };
}

/** whileHover target plus transition for the hub tile emoji. */
export function palWhileHover(creature: MilestoneCreature) {
  return {
    ...palHoverProps(creature),
    transition: palHoverTransition(creature),
  };
}

/** One-shot tap / click celebration snippet (matches milestone party vibe). */
export function palTapMotion(creature: MilestoneCreature): PalTapMotion {
  const style = creature.style ?? "bounce";
  if (style === "custom") {
    return customTap(creature.kind);
  }
  return styleTap(style);
}

function styleTap(style: CelebrationStyle): PalTapMotion {
  switch (style) {
    case "bounce":
      return {
        animate: { y: [0, -14, 0, -8, 0], scale: [1, 1.12, 1] },
        transition: { duration: 0.55, ease: "easeOut", times: [0, 0.35, 0.55, 0.75, 1] },
      };
    case "spin":
      return {
        animate: { rotate: [0, 360], scale: [1, 1.15, 1] },
        transition: { duration: 0.65, ease: "easeInOut" },
      };
    case "slide":
      return {
        animate: { x: [0, 18, -12, 0], rotate: [0, -8, 8, 0] },
        transition: { duration: 0.5, ease: "easeInOut" },
      };
    case "float":
      return {
        animate: { y: [0, -12, 4, -6, 0], x: [0, 6, -6, 0] },
        transition: { duration: 0.7, ease: "easeInOut" },
      };
    case "shake":
      return {
        animate: { x: [0, -10, 10, -8, 8, 0], rotate: [0, -6, 6, 0] },
        transition: { duration: 0.45, ease: "easeInOut" },
      };
    case "pop":
      return {
        animate: { scale: [1, 1.35, 0.92, 1.15, 1] },
        transition: { duration: 0.5, ease: "easeOut" },
      };
    case "zoom":
      return {
        animate: { scale: [1, 1.3, 1], y: [0, -8, 0] },
        transition: { duration: 0.45, ease: "easeOut" },
      };
    case "wiggle":
      return {
        animate: { rotate: [0, -16, 16, -12, 12, 0], scale: [1, 1.1, 1] },
        transition: { duration: 0.5, ease: "easeInOut" },
      };
    case "orbit":
      return {
        animate: { rotate: [0, 180, 360], scale: [1, 1.08, 1] },
        transition: { duration: 0.75, ease: "linear" },
      };
    case "rain":
      return {
        animate: { y: [0, 10, -6, 4, 0], scale: [1, 0.95, 1.05, 1] },
        transition: { duration: 0.55, ease: "easeInOut" },
      };
    default:
      return {
        animate: { scale: [1, 1.2, 1], y: [0, -6, 0] },
        transition: { duration: 0.4, ease: "easeOut" },
      };
  }
}

function customHover(kind: string) {
  switch (kind) {
    case "spider":
      return { scale: 1.1, rotate: [0, -6, 6, 0] };
    case "bat":
      return { scale: 1.1, y: [-2, -6, -2] };
    case "rex":
    case "giga-lizard":
      return { scale: 1.12, y: -4 };
    case "monster-truck":
      return { scale: 1.1, x: [0, 2, -2, 0] };
    default:
      return { scale: 1.1, y: -3 };
  }
}

function customTap(kind: string): PalTapMotion {
  switch (kind) {
    case "spider":
      return {
        animate: { x: [0, 10, -10, 8, -6, 0], rotate: [0, 4, -4, 0] },
        transition: { duration: 0.45, ease: "easeInOut" },
      };
    case "bat":
      return {
        animate: { y: [0, -10, 0, -6, 0], rotate: [0, -12, 12, 0] },
        transition: { duration: 0.55, ease: "easeInOut" },
      };
    case "octopus":
      return {
        animate: { rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.12, 1] },
        transition: { duration: 0.55, ease: "easeInOut" },
      };
    case "lizard":
      return {
        animate: { x: [0, 16, -8, 0], y: [0, -4, 0] },
        transition: { duration: 0.45, ease: "easeOut" },
      };
    case "dragon":
      return {
        animate: { scale: [1, 1.25, 1.05, 1], y: [0, -10, 0] },
        transition: { duration: 0.55, ease: "easeOut" },
      };
    case "black-stallion":
      return {
        animate: { y: [0, -12, 0, -8, 0], rotate: [0, -4, 4, 0] },
        transition: { duration: 0.6, ease: "easeOut" },
      };
    case "whale":
      return {
        animate: { y: [0, -8, 6, -4, 0], scale: [1, 1.08, 1] },
        transition: { duration: 0.75, ease: "easeInOut" },
      };
    case "rex":
      return {
        animate: { y: [0, 4, -2, 6, 0], scale: [1, 1.15, 1.05, 1.12, 1] },
        transition: { duration: 0.55, ease: "easeOut", times: [0, 0.2, 0.4, 0.65, 1] },
      };
    case "monster-truck":
      return {
        animate: { x: [0, -6, 6, -4, 4, 0], rotate: [0, -3, 3, 0] },
        transition: { duration: 0.5, ease: "easeInOut" },
      };
    case "giga-lizard":
      return {
        animate: { y: [0, -6, 0], scale: [1, 1.05, 1.12, 1], rotate: [0, -5, 5, 0] },
        transition: { duration: 0.7, ease: "easeInOut" },
      };
    case "theater-curtains":
      return {
        animate: { scale: [1, 0.85, 1.2, 1], rotate: [0, -6, 6, 0] },
        transition: { duration: 0.55, ease: "easeOut" },
      };
    case "rain":
      return {
        animate: { y: [0, 8, -4, 6, 0], scale: [1, 0.92, 1.05, 1] },
        transition: { duration: 0.6, ease: "easeInOut" },
      };
    default:
      return styleTap("bounce");
  }
}

/** Human label for screen readers (kind slug → words). */
export function palAriaLabel(creature: MilestoneCreature, starsAt: number): string {
  const name = creature.kind.replace(/-/g, " ");
  return `${name} pal, earned at ${starsAt} stars. Tap to play.`;
}
