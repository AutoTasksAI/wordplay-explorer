import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { playLizard } from "@/lib/speech";

/**
 * Milestone celebration (80 stars, 160 stars...): the biggest one yet, a
 * giant neobrutalist lizard zips in from the left, swoops all over the
 * screen (with a sparkle trail and cartoon chirps along the way), then
 * rockets off the right edge.
 */
export function LizardCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Flight path: left edge in → sweep top-right → dive bottom-right →
  // cross bottom-left → big center swoop → hop back up → rocket off right.
  const path = useMemo(() => {
    if (!size) return null;
    const { w, h } = size;
    return {
      x: [
        -140,
        w * 0.2,
        w * 0.85,
        w * 0.75,
        w * 0.12,
        w * 0.5,
        w * 0.18,
        w * 0.72,
        w * 1.3,
      ],
      y: [
        h * 0.55,
        h * 0.18,
        h * 0.2,
        h * 0.72,
        h * 0.68,
        h * 0.38,
        h * 0.3,
        h * 0.35,
        h * 0.4,
      ],
    };
  }, [size]);

  // Chirp at intervals along the flight so it really sounds like a lizard
  // zipping around the screen.
  useEffect(() => {
    const times = [0.6, 2.8, 5.0, 7.2, 9.4, 11.6];
    const timers = times.map((t) => window.setTimeout(playLizard, t * 1000));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  if (!size || !path) return null;

  const FLIGHT_SECONDS = 14;
  const times = [0, 0.12, 0.26, 0.38, 0.5, 0.62, 0.74, 0.88, 1];

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
        <span className="text-2xl leading-none">🦎</span>
        <span className="text-xl font-bold tracking-tight text-paper">
          {milestone} STARS!
        </span>
        <span className="text-2xl leading-none">✨</span>
      </motion.div>

      {/* sparkle trail: streaks that follow the same path, slightly behind */}
      {[0.35, 0.7, 1.05, 1.4].map((delay) => (
        <motion.span
          key={delay}
          className="absolute left-0 top-0 text-2xl will-change-transform"
          initial={{ x: path.x[0], y: path.y[0], opacity: 0, scale: 0.4 }}
          animate={{
            x: path.x,
            y: path.y,
            opacity: [0, 0, 0.9, 0.9, 0, 0],
            scale: [0.4, 1, 1, 1, 0.6, 0.3],
          }}
          transition={{
            duration: FLIGHT_SECONDS - 0.5,
            times: [0, 0.08, 0.3, 0.7, 0.9, 1],
            delay,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.span>
      ))}

      {/* the lizard: a big neobrutalist tile, wiggling as it flies */}
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        initial={{
          x: path.x[0],
          y: path.y[0],
          scale: 0.5,
          opacity: 0,
          rotate: 10,
        }}
        animate={{
          x: path.x,
          y: path.y,
          scale: [0.5, 1, 1.1, 1.1, 1, 2.6, 1.5, 1.2, 0.4],
          opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0],
          rotate: [10, -8, 6, -4, 8, 0, -12, -6, 25],
        }}
        transition={{ duration: FLIGHT_SECONDS, times, ease: "easeInOut" }}
      >
        {/* flight wiggle: the lizard undulates through the air */}
        <motion.div
          animate={{ rotate: [0, -9, 9, -9, 0], y: [0, -6, 6, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-36 items-center justify-center border-[3px] border-ink bg-grass nb-shadow sm:size-44"
        >
          <span className="text-8xl leading-none sm:text-9xl">🦎</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
