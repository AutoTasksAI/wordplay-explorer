import type { MilestoneCreature } from "@/lib/milestones";
import { palAriaLabel, palEmojiVariants } from "@/lib/pal-hub-motion";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

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
  const emojiVariants = useMemo(
    () => palEmojiVariants(creature),
    [creature],
  );

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
      className={`${tileClass} touch-manipulation select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink [@media(hover:hover)]:hover:shadow-[4px_4px_0_0_#141414]`}
      onClick={onActivate}
      onTap={onActivate}
    >
      <motion.span
        className="block text-3xl leading-none"
        variants={emojiVariants}
        initial="idle"
        animate={tapPlaying ? "tap" : "idle"}
        whileHover={tapPlaying ? undefined : "hover"}
        onAnimationComplete={() => {
          if (tapPlaying) setTapPlaying(false);
        }}
      >
        {creature.emoji}
      </motion.span>
    </motion.button>
  );
}
