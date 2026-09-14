import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Black stallion gallops across the screen, rears up on its hind legs, then
 * runs off into the distance.
 */
export function BlackStallionCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!size) return null;

  const { w, h } = size;
  const groundY = h * 0.68;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-gradient-to-b from-sky-200/40 to-amber-100/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        initial={{ y: -36, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 280, damping: 16 }}
        className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-neutral-900 px-5 py-2 nb-shadow"
        style={{ top: h * 0.12 }}
      >
        <span className="text-2xl leading-none">🐴</span>
        <span className="text-xl font-bold tracking-tight text-white">
          {milestone} STARS!
        </span>
        <span className="text-2xl leading-none">✨</span>
      </motion.div>

      {/* gallop in → rear → gallop away */}
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        initial={{ x: -160, y: groundY, scaleX: 1 }}
        animate={{
          x: [
            -160,
            w * 0.22,
            w * 0.38,
            w * 0.5,
            w * 0.5,
            w * 0.62,
            w * 0.78,
            w + 180,
          ],
          y: [
            groundY,
            groundY - 18,
            groundY,
            groundY - 14,
            groundY - h * 0.22,
            groundY - 10,
            groundY,
            groundY - 12,
          ],
          rotate: [0, -4, 4, -3, -28, -28, 2, 0],
          scale: [0.85, 1, 1, 1, 1.15, 1.15, 1, 0.95],
        }}
        transition={{
          duration: 11,
          times: [0, 0.18, 0.32, 0.42, 0.52, 0.62, 0.78, 1],
          ease: "easeInOut",
        }}
      >
        <motion.div
          animate={{ y: [0, -10, 0, -8, 0] }}
          transition={{ duration: 0.45, repeat: 5, ease: "easeInOut" }}
          className="flex size-36 items-center justify-center border-[3px] border-ink bg-neutral-800 nb-shadow sm:size-44"
        >
          <span
            className="text-8xl leading-none sm:text-9xl"
            style={{ filter: "brightness(0.15) contrast(1.4)" }}
            aria-hidden
          >
            🐴
          </span>
        </motion.div>
      </motion.div>

      {/* dust puffs when it rears and when it bolts */}
      {[0.52, 0.78].map((t, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-900/25 blur-md"
          style={{
            left: i === 0 ? "48%" : "72%",
            top: groundY + 24,
            width: 120,
            height: 40,
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.85, 0], scale: [0.4, 1.4, 1.8] }}
          transition={{ duration: 1.1, delay: 11 * t, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}
