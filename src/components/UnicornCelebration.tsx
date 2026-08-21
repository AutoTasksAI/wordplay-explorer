import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/**
 * Milestone celebration (120 stars...): a rainbow draws itself across the
 * sky while a unicorn prances along underneath it, tossing hearts and
 * sparkles into the air with every hop.
 */
export function UnicornCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const hearts = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 6 + ((i * 41) % 88),
        delay: 1 + ((i * 29) % 70) / 10,
        drift: -30 + ((i * 17) % 60),
        emoji: i % 3 === 0 ? "💖" : i % 3 === 1 ? "✨" : "🌟",
      })),
    [],
  );

  if (!size) return null;

  const PRANCE_SECONDS = 13;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* the rainbow draws itself in, arc by arc */}
      <svg
        className="absolute inset-x-0"
        style={{ top: size.h * 0.08 }}
        width={size.w}
        height={size.h * 0.5}
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
      >
        {["#ff4d4d", "#ff8c1a", "#ffd60a", "#2fbf71", "#2e6bff", "#ff6bd6"].map(
          (color, i) => (
            <motion.path
              key={color}
              d={`M ${4 + i * 2.4} 48 A ${46 - i * 2.4} ${44 - i * 2.2} 0 0 1 ${
                96 - i * 2.4
              } 48`}
              fill="none"
              stroke={color}
              strokeWidth={2.2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{
                duration: 1.1,
                delay: 0.3 + i * 0.28,
                ease: "easeInOut",
              }}
            />
          ),
        )}
      </svg>

      {/* milestone badge */}
      <motion.div
        initial={{ y: -40, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 14 }}
        className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-bubblegum px-5 py-2 nb-shadow"
        style={{ top: size.h * 0.16 }}
      >
        <span className="text-2xl leading-none">🦄</span>
        <span className="text-xl font-bold tracking-tight text-white">
          {milestone} STARS!
        </span>
        <span className="text-2xl leading-none">💖</span>
      </motion.div>

      {/* floating hearts and sparkles */}
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute text-3xl"
          style={{ left: `${h.x}%`, top: `${size.h * 0.7}px` }}
          initial={{ opacity: 0, y: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: -size.h * 0.45,
            x: h.drift,
            scale: [0.4, 1.2, 1, 0.7],
            rotate: [0, 12, -12, 0],
          }}
          transition={{ duration: 3.2, delay: h.delay, ease: "easeOut" }}
        >
          {h.emoji}
        </motion.span>
      ))}

      {/* the unicorn prances across the meadow, hopping the whole way */}
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        initial={{ x: -140, y: size.h * 0.62 }}
        animate={{
          x: [-140, size.w * 0.18, size.w * 0.42, size.w * 0.66, size.w * 0.9, size.w + 160],
          y: [
            size.h * 0.62,
            size.h * 0.56,
            size.h * 0.62,
            size.h * 0.55,
            size.h * 0.62,
            size.h * 0.58,
          ],
          rotate: [0, -6, 6, -6, 6, 0],
        }}
        transition={{ duration: PRANCE_SECONDS, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ y: [0, -26, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.62, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-36 items-center justify-center border-[3px] border-ink bg-white nb-shadow sm:size-40"
        >
          <span className="text-8xl leading-none sm:text-9xl">🦄</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
