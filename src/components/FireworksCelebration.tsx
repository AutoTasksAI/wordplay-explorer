import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

/** Big festive fireworks after the frog pal — kid-safe party, no scary effects. */
export function FireworksCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFlash((f) => (f + 1) % 4);
    }, 900);
    return () => window.clearInterval(id);
  }, []);

  const bursts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: 8 + seededRandom(milestone + i * 7) * 84,
        y: 12 + seededRandom(milestone + i * 11) * 55,
        delay: seededRandom(milestone + i * 13) * 2.2,
        hue: i % 3,
        size: 0.7 + seededRandom(milestone + i * 17) * 0.6,
      })),
    [milestone],
  );

  const sparks = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: seededRandom(milestone + i * 29) * 100,
        bottom: 4 + seededRandom(milestone + i * 31) * 18,
        delay: seededRandom(milestone + i * 37) * 1.8,
        emoji: ["🕯️", "✨", "🎇", "⭐"][i % 4],
      })),
    [milestone],
  );

  if (!size) return null;

  const flashOpacity = [0.08, 0.14, 0.06, 0.12][flash];

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-gradient-to-b from-indigo-950/75 via-purple-900/40 to-paper/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-sun"
        animate={{ opacity: flashOpacity }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      {bursts.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: 48 * b.size,
            height: 48 * b.size,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.4, 1],
            opacity: [0, 1, 0.85],
          }}
          transition={{
            duration: 1.1,
            delay: b.delay,
            repeat: Infinity,
            repeatDelay: 1.4 + b.delay * 0.3,
            ease: "easeOut",
          }}
        >
          <span className="absolute inset-0 text-4xl sm:text-5xl">🎆</span>
          {Array.from({ length: 8 }).map((_, j) => (
            <motion.span
              key={j}
              className="absolute left-1/2 top-1/2 text-lg sm:text-xl"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((j / 8) * Math.PI * 2) * (36 + b.size * 20),
                y: Math.sin((j / 8) * Math.PI * 2) * (36 + b.size * 20),
                opacity: [1, 0],
              }}
              transition={{
                duration: 0.85,
                delay: b.delay + 0.15,
                repeat: Infinity,
                repeatDelay: 1.4 + b.delay * 0.3,
                ease: "easeOut",
              }}
            >
              {b.hue === 0 ? "✨" : b.hue === 1 ? "💛" : "💖"}
            </motion.span>
          ))}
        </motion.div>
      ))}

      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute text-2xl sm:text-3xl"
          style={{ left: `${s.x}%`, bottom: `${s.bottom}%` }}
          animate={{
            y: [0, -28, -8, -22, 0],
            scale: [1, 1.2, 0.95, 1.15, 1],
            opacity: [0.7, 1, 0.8, 1, 0.7],
          }}
          transition={{
            duration: 1.6,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {s.emoji}
        </motion.span>
      ))}

      <motion.div
        className="absolute left-1/2 top-[38%] w-[min(92vw,36rem)] -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.35 }}
      >
        <p className="text-4xl font-black uppercase tracking-tight text-white drop-shadow-[3px_3px_0_#141414] sm:text-6xl">
          You&apos;re awesome!
        </p>
        <p className="mt-3 text-lg font-bold text-sun sm:text-2xl">
          {milestone} stars — what a party!
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-[18%] left-1/2 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-white px-5 py-3 nb-shadow sm:gap-3 sm:px-7 sm:py-4"
      >
        <span className="text-4xl sm:text-5xl">🎆</span>
        <span className="text-base font-bold sm:text-xl">Firework show!</span>
        <span className="text-4xl sm:text-5xl">🎇</span>
      </motion.div>
    </motion.div>
  );
}
