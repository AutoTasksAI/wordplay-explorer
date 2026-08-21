import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { playFanfare, playLizard } from "@/lib/speech";

/**
 * Milestone celebration (160 stars...): the biggest party of all. Rex
 * himself shows up with a whole dance crew of mini Rexes, confetti storms
 * from every corner, and a double fanfare plays while everyone bounces.
 */
export function RexPartyCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Double fanfare plus a chirp bridge, so it feels like a real party.
  useEffect(() => {
    const timers = [
      window.setTimeout(playFanfare, 300),
      window.setTimeout(playLizard, 1600),
      window.setTimeout(playLizard, 2400),
      window.setTimeout(playFanfare, 8200),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const crew = useMemo(
    () => [
      { id: 0, from: "-12%", side: "left", delay: 0.5, size: "text-7xl" },
      { id: 1, from: "112%", side: "right", delay: 1.1, size: "text-6xl" },
      { id: 2, from: "-14%", side: "left", delay: 1.7, size: "text-5xl" },
      { id: 3, from: "114%", side: "right", delay: 2.3, size: "text-4xl" },
    ],
    [],
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: ((i * 29) % 100),
        delay: ((i * 13) % 30) / 10,
        duration: 2 + ((i * 7) % 18) / 10,
        emoji: ["⭐", "✨", "🎉", "💛", "🎈", "🌟", "🦖"][i % 7],
      })),
    [],
  );

  if (!size) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* confetti storm */}
      <div className="absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <motion.span
            key={c.id}
            className="absolute text-2xl"
            style={{ left: `${c.x}%`, top: "-8%" }}
            animate={{ y: "115vh", rotate: 360 }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {c.emoji}
          </motion.span>
        ))}
      </div>

      {/* milestone badge */}
      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: [-3, 3, -3] }}
        transition={{
          scale: { type: "spring", stiffness: 260, damping: 11 },
          rotate: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-tomato px-6 py-3 nb-shadow"
        style={{ top: size.h * 0.1 }}
      >
        <span className="text-3xl leading-none">🦖</span>
        <span className="text-2xl font-bold tracking-tight text-white">
          REX PARTY! {milestone} STARS!
        </span>
        <span className="text-3xl leading-none">🎉</span>
      </motion.div>

      {/* big Rex front and center */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: size.h * 0.28 }}
        initial={{ scale: 0, y: 120 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
      >
        <motion.div
          animate={{
            y: [0, -34, 0],
            rotate: [0, -6, 6, -6, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{ duration: 0.72, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-48 items-center justify-center border-[3px] border-ink bg-grass nb-shadow sm:size-56"
        >
          <span className="text-[7rem] leading-none sm:text-[9rem]">🦖</span>
        </motion.div>
      </motion.div>

      {/* the mini-Rex dance crew sliding in from both edges */}
      {crew.map((m) => (
        <motion.div
          key={m.id}
          className="absolute"
          style={{
            top:
              m.size === "text-7xl"
                ? size.h * 0.62
                : m.size === "text-6xl"
                  ? size.h * 0.68
                  : m.size === "text-5xl"
                    ? size.h * 0.74
                    : size.h * 0.78,
            [m.side]: m.from,
          }}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: m.delay, type: "spring", stiffness: 160, damping: 16 }}
        >
          <motion.span
            className={`${m.size} inline-block leading-none`}
            animate={{
              y: [0, -22, 0],
              rotate: [0, m.side === "left" ? -10 : 10, 0],
            }}
            transition={{
              duration: 0.58 + m.delay * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🦖
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}
