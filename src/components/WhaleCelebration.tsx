import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/**
 * Milestone celebration (140 stars...): a whale glides along the bottom of
 * the screen, blasting a big water spout on every pass while bubbles and
 * fish drift up all around.
 */
export function WhaleCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: 4 + ((i * 53) % 92),
        delay: ((i * 31) % 90) / 10,
        duration: 2.8 + ((i * 11) % 20) / 10,
        scale: 0.7 + ((i * 7) % 10) / 10,
      })),
    [],
  );

  const spouts = useMemo(
    () => [
      { id: 0, at: size ? size.w * 0.3 : 0, delay: 1.6 },
      { id: 1, at: size ? size.w * 0.62 : 0, delay: 5.4 },
      { id: 2, at: size ? size.w * 0.85 : 0, delay: 9.2 },
    ],
    [size],
  );

  if (!size) return null;

  const SWIM_SECONDS = 13;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* gentle sea band along the bottom */}
      <motion.div
        className="absolute inset-x-0 bottom-0 border-t-[3px] border-ink bg-sky/30"
        style={{ height: size.h * 0.22 }}
        initial={{ y: size.h * 0.22 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {/* milestone badge */}
      <motion.div
        initial={{ y: -40, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 14 }}
        className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-sky px-5 py-2 nb-shadow"
        style={{ top: size.h * 0.12 }}
      >
        <span className="text-2xl leading-none">🐳</span>
        <span className="text-xl font-bold tracking-tight text-white">
          {milestone} STARS!
        </span>
        <span className="text-2xl leading-none">💦</span>
      </motion.div>

      {/* rising bubbles */}
      {bubbles.map((b) => (
        <motion.span
          key={b.id}
          className="absolute text-2xl"
          style={{ left: `${b.x}%`, top: size.h - 20 }}
          initial={{ opacity: 0, y: 0, scale: b.scale }}
          animate={{ opacity: [0, 1, 1, 0], y: -size.h * 0.85 }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: "easeIn",
          }}
        >
          🫧
        </motion.span>
      ))}

      {/* water spouts as the whale passes */}
      {spouts.map((s) => (
        <motion.div
          key={s.id}
          className="absolute flex flex-col items-center"
          style={{ left: s.at, top: size.h * 0.52 }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scaleY: [0, 1.15, 1, 0.4] }}
          transition={{ duration: 2.2, delay: s.delay, ease: "easeOut" }}
        >
          <span className="text-5xl leading-none">💦</span>
          <span className="-mt-2 text-3xl leading-none">💧</span>
        </motion.div>
      ))}

      {/* the whale: glides in from the left, backs up, then exits right */}
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        initial={{ x: -220, y: size.h * 0.68 }}
        animate={{
          x: [
            -220,
            size.w * 0.25,
            size.w * 0.55,
            size.w * 0.35,
            size.w * 0.7,
            size.w + 240,
          ],
          y: [
            size.h * 0.68,
            size.h * 0.64,
            size.h * 0.66,
            size.h * 0.63,
            size.h * 0.66,
            size.h * 0.68,
          ],
        }}
        transition={{ duration: SWIM_SECONDS, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ rotate: [0, 3, -3, 0], y: [0, -8, 8, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-40 items-center justify-center border-[3px] border-ink bg-sky nb-shadow sm:size-44"
        >
          <span className="text-8xl leading-none sm:text-9xl">🐳</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
