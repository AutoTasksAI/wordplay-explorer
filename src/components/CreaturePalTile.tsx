import type { MilestoneCreature } from "@/lib/milestones";
import {
  palAriaLabel,
  palTapMotion,
  palWhileHover,
} from "@/lib/pal-hub-motion";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

interface CreaturePalTileProps {
  creature: MilestoneCreature;
  earned: boolean;
  index: number;
  starsAt: number;
  lockedHint: string;
}

/**
 * One creature pal on the Game Hub roster — hover react on desktop, tap to
 * trigger a short party motion matched to the pal’s milestone style.
 */
export function CreaturePalTile({
  creature,
  earned,
  index,
  starsAt,
  lockedHint,
}: CreaturePalTileProps) {
  const [tapPlaying, setTapPlaying] = useState(false);
  const tap = palTapMotion(creature);

  const onActivate = useCallback(() => {
    if (!earned || tapPlaying) return;
    setTapPlaying(true);
  }, [earned, tapPlaying]);

  const tileClass = `flex size-12 items-center justify-center border-[3px] border-ink nb-shadow-xs sm:size-14 ${
    earned ? "bg-white cursor-pointer" : "bg-paper opacity-45"
  }`;

  if (!earned) {
    return (
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 12,
        }}
        title={lockedHint}
        className={tileClass}
      >
        <span className="text-xs font-bold">?</span>
      </motion.span>
    );
  }

  return (
    <motion.button
      type="button"
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        delay: 0.05 * index,
        type: "spring",
        stiffness: 300,
        damping: 12,
      }}
      title={`${starsAt} stars!`}
      aria-label={palAriaLabel(creature, starsAt)}
      className={`${tileClass} touch-manipulation select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
      onClick={onActivate}
    >
      <motion.span
        className="pointer-events-none block text-3xl leading-none"
        initial={false}
        animate={
          tapPlaying
            ? tap.animate
            : { x: 0, y: 0, rotate: 0, scale: 1 }
        }
        transition={tap.transition}
        onAnimationComplete={() => {
          if (tapPlaying) setTapPlaying(false);
        }}
        whileHover={tapPlaying ? undefined : palWhileHover(creature)}
      >
        {creature.emoji}
      </motion.span>
    </motion.button>
  );
}
