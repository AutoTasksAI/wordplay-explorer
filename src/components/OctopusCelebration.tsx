import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface Swimmer {
  id: number;
  emoji: string;
  textClass: string;
  x: number[];
  y: number[];
  duration: number;
  delay: number;
  pulse: number;
}

const BUBBLES = [0.08, 0.3, 0.55, 0.78, 0.92];

/**
 * Milestone celebration (60 stars, 120 stars...): the octopus and her babies
 * swim loops all around the screen, then she squirts a big purple ink cloud
 * that covers everything for a few seconds before `onDone` hands off so the
 * app can transition to the next module.
 */
export function OctopusCelebration({
  milestone,
  onDone,
}: {
  milestone: number;
  onDone: () => void;
}) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [ink, setInk] = useState(false);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // After the family has swum for a bit, the octopus squirts the ink.
  useEffect(() => {
    const t = window.setTimeout(() => setInk(true), 6000);
    return () => window.clearTimeout(t);
  }, []);

  // Let the ink cover the screen for a moment, then hand off to the shell so
  // it can transition to the next module.
  useEffect(() => {
    if (!ink) return;
    const t = window.setTimeout(onDone, 3200);
    return () => window.clearTimeout(t);
  }, [ink, onDone]);

  // Closed-loop swim paths (first point == last point) so the repeat loops
  // seamlessly. Mom patrols the big rectangle; babies swim inner bands.
  const swimmers = useMemo<Swimmer[]>(() => {
    if (!size) return [];
    const { w, h } = size;
    const loop = (x0: number, y0: number, x1: number, y1: number) =>
      [
        [x0 * w, y0 * h],
        [x1 * w, y0 * h],
        [x1 * w, y1 * h],
        [x0 * w, y1 * h],
        [x0 * w, y0 * h],
      ] as const;
    const toXY = (pts: readonly (readonly [number, number])[]) => ({
      x: pts.map((p) => p[0]),
      y: pts.map((p) => p[1]),
    });

    return [
      {
        id: 0,
        emoji: "🐙",
        textClass: "text-8xl sm:text-9xl",
        ...toXY(loop(0.12, 0.16, 0.88, 0.74)),
        duration: 10,
        delay: 0,
        pulse: 1.08,
      },
      {
        id: 1,
        emoji: "🐙",
        textClass: "text-4xl sm:text-5xl",
        ...toXY(loop(0.28, 0.3, 0.72, 0.62)),
        duration: 6,
        delay: 0.2,
        pulse: 1.16,
      },
      {
        id: 2,
        emoji: "🐙",
        textClass: "text-4xl sm:text-5xl",
        ...toXY(loop(0.16, 0.6, 0.84, 0.32)),
        duration: 7,
        delay: 0.6,
        pulse: 1.16,
      },
      {
        id: 3,
        emoji: "🐙",
        textClass: "text-4xl sm:text-5xl",
        ...toXY(loop(0.32, 0.14, 0.7, 0.86)),
        duration: 6.5,
        delay: 1,
        pulse: 1.16,
      },
      {
        id: 4,
        emoji: "🐙",
        textClass: "text-3xl sm:text-4xl",
        ...toXY(loop(0.5, 0.45, 0.92, 0.88)),
        duration: 5,
        delay: 1.4,
        pulse: 1.2,
      },
    ];
  }, [size]);

  if (!size) return null;

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
        <span className="text-2xl leading-none">🐙</span>
        <span className="text-xl font-bold tracking-tight text-paper">
          {milestone} STARS!
        </span>
        <span className="text-2xl leading-none">🫧</span>
      </motion.div>

      {/* rising bubbles */}
      {BUBBLES.map((fx, i) => (
        <motion.span
          key={`b${i}`}
          className="absolute text-2xl sm:text-3xl"
          style={{ left: `${fx * 100}%` }}
          initial={{ y: size.h * 0.95, opacity: 0 }}
          animate={{
            y: size.h * 0.05,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4.5 + (i % 3),
            repeat: Infinity,
            delay: i * 0.7,
            ease: "linear",
          }}
        >
          🫧
        </motion.span>
      ))}

      {/* the octopus family swimming around */}
      {swimmers.map((s) => (
        <motion.div
          key={s.id}
          className="absolute left-0 top-0 will-change-transform"
          initial={{ x: s.x[0], y: s.y[0], scale: 1, rotate: 0 }}
          animate={{
            x: s.x,
            y: s.y,
            scale: [1, s.pulse, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            x: {
              duration: s.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            },
            y: {
              duration: s.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            },
            scale: {
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            },
            rotate: {
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            },
          }}
        >
          <span className={`block leading-none ${s.textClass}`}>{s.emoji}</span>
        </motion.div>
      ))}

      {/* the squirt: ink droplets + a big purple cloud that covers the screen */}
      {ink && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={`d${i}`}
              className="absolute rounded-full bg-[#6d28d9]"
              style={{
                width: 16 + i * 10,
                height: 16 + i * 10,
                left: "50%",
                top: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
              animate={{
                x: (i - 1) * 130,
                y: (i % 2 === 0 ? 1 : -1) * 100,
                opacity: 0,
                scale: 1.8,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 90 }}
            transition={{ duration: 1.2, ease: "easeIn" }}
          >
            <div className="size-[28vmin] rounded-full bg-[radial-gradient(circle_at_35%_30%,#a78bfa_0%,#7c3aed_50%,#4c1d95_100%)]" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
