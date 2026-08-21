import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { playLizard } from "@/lib/speech";

/**
 * Milestone celebration (100 stars...): a giant dragon swoops across the
 * sky breathing a trail of fire, with flame bursts popping along the way
 * and a low rumble of cartoon roars. Bigger than the lizard.
 */
export function DragonCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Flight path: dive in from the top-left → loop the whole sky → hover
  // center for a triple roar → spiral off the top-right.
  const path = useMemo(() => {
    if (!size) return null;
    const { w, h } = size;
    return {
      x: [
        -160,
        w * 0.25,
        w * 0.8,
        w * 0.15,
        w * 0.85,
        w * 0.5,
        w * 0.5,
        w * 0.5,
        w * 1.25,
      ],
      y: [
        -120,
        h * 0.22,
        h * 0.18,
        h * 0.55,
        h * 0.6,
        h * 0.35,
        h * 0.35,
        h * 0.35,
        -140,
      ],
    };
  }, [size]);

  // Roar along the flight, three in a row while hovering center.
  useEffect(() => {
    const times = [0.5, 7.4, 8.4, 9.4];
    const timers = times.map((t) => window.setTimeout(playLizard, t * 1000));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  // Fire puffs that drop behind the dragon and drift upward.
  const flames = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        delay: 0.8 + i * 0.9,
        x: 20 + ((i * 37) % 60),
        size: 1.4 + ((i * 13) % 10) / 10,
      })),
    [],
  );

  if (!size || !path) return null;

  const FLIGHT_SECONDS = 15;
  const times = [0, 0.14, 0.28, 0.42, 0.56, 0.64, 0.72, 0.8, 1];

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* warm glow that pulses while the dragon is airborne */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(255,140,26,0.28), transparent 65%)",
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />

      {/* milestone badge */}
      <motion.div
        initial={{ y: -40, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 14 }}
        className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-tangerine px-5 py-2 nb-shadow"
        style={{ top: size.h * 0.12 }}
      >
        <span className="text-2xl leading-none">🐉</span>
        <span className="text-xl font-bold tracking-tight text-white">
          {milestone} STARS!
        </span>
        <span className="text-2xl leading-none">🔥</span>
      </motion.div>

      {/* rising fire trail */}
      {flames.map((f) => (
        <motion.span
          key={f.id}
          className="absolute text-3xl"
          style={{ left: `${f.x}%`, top: `${size.h * 0.75}px` }}
          initial={{ opacity: 0, y: 60, scale: 0.4 }}
          animate={{ opacity: [0, 1, 1, 0], y: -size.h * 0.55, scale: f.size }}
          transition={{ duration: 2.6, delay: f.delay, ease: "easeOut" }}
        >
          🔥
        </motion.span>
      ))}

      {/* the dragon */}
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        initial={{ x: path.x[0], y: path.y[0], scale: 0.4, opacity: 0 }}
        animate={{
          x: path.x,
          y: path.y,
          scale: [0.4, 1.15, 1.15, 1.15, 1.15, 1.5, 1.5, 1.5, 0.5],
          opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0],
          rotate: [0, 6, -6, 8, -8, 0, 4, -4, -20],
        }}
        transition={{ duration: FLIGHT_SECONDS, times, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ rotate: [0, -7, 7, -7, 0], y: [0, -8, 8, -8, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-40 items-center justify-center border-[3px] border-ink bg-tangerine nb-shadow sm:size-48"
        >
          <span className="text-8xl leading-none sm:text-9xl">🐉</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
