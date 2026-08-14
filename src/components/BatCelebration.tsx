import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/**
 * Milestone celebration (40 stars, 80 stars...): a bat flies in from the
 * corner, loops all around the screen, swoops close (large), shrinks back,
 * then flies off into the opposite corner. Wings flap the whole way.
 */
export function BatCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Flight path: bottom-left corner in → loop around the screen → swoop to
  // center (close, big) → drift smaller → fly off into the top-right corner.
  const path = useMemo(() => {
    if (!size) return null;
    const { w, h } = size;
    return {
      x: [
        -90,
        w * 0.25,
        w * 0.78,
        w * 0.85,
        w * 0.15,
        w * 0.5,
        w * 0.55,
        w * 1.15,
      ],
      y: [
        h + 50,
        h * 0.22,
        h * 0.18,
        h * 0.68,
        h * 0.7,
        h * 0.42,
        h * 0.3,
        -h * 0.25,
      ],
    };
  }, [size]);

  if (!size || !path) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* milestone badge */}
      <motion.div
        initial={{ y: -40, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 14 }}
        className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-ink px-5 py-2 nb-shadow"
        style={{ top: size.h * 0.14 }}
      >
        <span className="text-2xl leading-none">🦇</span>
        <span className="text-xl font-bold tracking-tight text-paper">
          {milestone} STARS!
        </span>
        <span className="text-2xl leading-none">🌙</span>
      </motion.div>

      {/* the bat: positioned by transform so the whole path animates as one */}
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        initial={{
          x: path.x[0],
          y: path.y[0],
          scale: 0.4,
          opacity: 0,
          rotate: 8,
        }}
        animate={{
          x: path.x,
          y: path.y,
          scale: [0.4, 1, 1, 1, 1, 2.4, 1.1, 0.3],
          opacity: [0, 1, 1, 1, 1, 1, 1, 0],
          rotate: [8, -6, 6, -6, 0, 0, -4, 15],
        }}
        transition={{
          duration: 13,
          times: [0, 0.15, 0.3, 0.42, 0.5, 0.7, 0.85, 1],
          ease: "easeInOut",
        }}
      >
        {/* wing flap: quick horizontal squish that never stops */}
        <motion.div
          animate={{ scaleX: [1, 0.55, 1] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex size-28 items-center justify-center sm:size-32"
        >
          <span className="text-7xl leading-none sm:text-8xl">🦇</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
