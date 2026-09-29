import type { MilestoneCreature } from "@/lib/milestones";
import { palAriaLabel, palEmojiVariants } from "@/lib/pal-hub-motion";
import { useHoverCapable } from "@/hooks/use-hover-capable";
import {
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";

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
  const emojiControls = useAnimationControls();
  const hoverCapable = useHoverCapable();
  const reduceMotion = useReducedMotion();
  const tapLock = useRef(false);
  const [tapPlaying, setTapPlaying] = useState(false);
  const emojiVariants = useMemo(
    () => palEmojiVariants(creature),
    [creature],
  );

  const playTapMotion = useCallback(async () => {
    if (!earned || tapLock.current) return;
    tapLock.current = true;
    setTapPlaying(true);
    try {
      if (reduceMotion) {
        await emojiControls.start({
          scale: [1, 1.08, 1],
          transition: { duration: 0.2 },
        });
        return;
      }
      await emojiControls.start("tap");
      await emojiControls.start("idle");
    } finally {
      tapLock.current = false;
      setTapPlaying(false);
    }
  }, [earned, emojiControls, reduceMotion]);

  const onActivate = useCallback(() => {
    void playTapMotion();
  }, [playTapMotion]);

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
      className={`${tileClass} touch-manipulation select-none [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink [@media(hover:hover)]:hover:shadow-[4px_4px_0_0_#141414]`}
      onTap={onActivate}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
    >
      <motion.span
        className="pointer-events-none block text-3xl leading-none"
        variants={emojiVariants}
        initial="idle"
        animate={emojiControls}
        whileHover={
          hoverCapable && !reduceMotion && !tapPlaying ? "hover" : undefined
        }
      >
        {creature.emoji}
      </motion.span>
    </motion.button>
  );
}
