import { MILESTONE_CREATURES } from "@/lib/milestones";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { playBoing, playFanfare } from "@/lib/speech";

/** Non-animal pals we skip for the finale dance crew. */
const NON_ANIMAL_KINDS = new Set([
  "monster-truck",
  "theater-curtains",
  "rocket",
  "rain",
  "starfish",
]);

type MotionKind = "bounce" | "wiggle" | "hop" | "float" | "shake";

interface DancingPal {
  id: string;
  emoji: string;
  xPct: number;
  yPct: number;
  size: string;
  delay: number;
  motion: MotionKind;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 8888) * 10000;
  return x - Math.floor(x);
}

function motionForKind(kind: MotionKind) {
  switch (kind) {
    case "bounce":
      return {
        animate: { y: [0, -36, 0, -18, 0], rotate: [0, -4, 4, 0] },
        transition: { duration: 0.72, repeat: Infinity, ease: "easeInOut" as const },
      };
    case "wiggle":
      return {
        animate: { rotate: [0, -14, 14, -10, 10, 0], scale: [1, 1.06, 1] },
        transition: { duration: 0.85, repeat: Infinity, ease: "easeInOut" as const },
      };
    case "hop":
      return {
        animate: { y: [0, -48, 0], scale: [1, 1.12, 1] },
        transition: { duration: 0.55, repeat: Infinity, ease: "easeOut" as const },
      };
    case "float":
      return {
        animate: { y: [0, -22, 0], x: [0, 10, -10, 0] },
        transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" as const },
      };
    case "shake":
      return {
        animate: { x: [0, -10, 10, -6, 6, 0] },
        transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const },
      };
  }
}

const MOTIONS: MotionKind[] = ["bounce", "wiggle", "hop", "float", "shake"];
const SIZES = ["text-3xl", "text-4xl", "text-5xl", "text-6xl"];

/**
 * Finale celebration (1000 stars): the whole roster jumps and dances
 * together in a downpour. Rain everywhere, animals everywhere, zero rainbow.
 */
export function RainFinaleCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const timers = [
      window.setTimeout(playFanfare, 400),
      window.setTimeout(playBoing, 1200),
      window.setTimeout(playBoing, 2000),
      window.setTimeout(playFanfare, 7000),
      window.setTimeout(playBoing, 9000),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const dancingPals = useMemo((): DancingPal[] => {
    const animals = MILESTONE_CREATURES.filter((c) => !NON_ANIMAL_KINDS.has(c.kind));
    return animals.map((creature, i) => {
      const r1 = seededRandom(i + 1);
      const r2 = seededRandom(i + 17);
      const r3 = seededRandom(i + 31);
      const r4 = seededRandom(i + 47);
      return {
        id: creature.kind,
        emoji: creature.emoji,
        xPct: 6 + r1 * 82,
        yPct: 38 + r2 * 52,
        size: SIZES[Math.floor(r3 * SIZES.length)]!,
        delay: 0.15 + (i % 12) * 0.12 + r4 * 0.4,
        motion: MOTIONS[i % MOTIONS.length]!,
      };
    });
  }, []);

  const raindrops = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 3) * 100,
        delay: seededRandom(i * 7) * 1.2,
        duration: 1.2 + seededRandom(i * 11) * 1.2,
        emoji: i % 5 === 0 ? "🌧️" : "💧",
        size: i % 4 === 0 ? "text-3xl" : "text-xl",
      })),
    [],
  );

  const splashes = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 29 + 200) * 90 + 5,
        delay: 0.8 + seededRandom(i * 37 + 200) * 3,
      })),
    [],
  );

  if (!size) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-sky/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* overcast sky — cool blues and grays only */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(100,116,139,0.45) 0%, rgba(148,163,184,0.25) 45%, rgba(191,219,254,0.2) 100%)",
        }}
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* heavy rain */}
      <div className="absolute inset-0 overflow-hidden">
        {raindrops.map((drop) => (
          <motion.span
            key={drop.id}
            className={`absolute ${drop.size} opacity-85`}
            style={{ left: `${drop.x}%`, top: "-6%" }}
            animate={{ y: "112vh" }}
            transition={{
              duration: drop.duration,
              delay: drop.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {drop.emoji}
          </motion.span>
        ))}
      </div>

      {/* puddle splashes at the bottom */}
      {splashes.map((s) => (
        <motion.span
          key={s.id}
          className="absolute text-2xl"
          style={{ left: `${s.x}%`, bottom: "4%" }}
          animate={{ scale: [0.4, 1.2, 0.4], opacity: [0, 0.8, 0] }}
          transition={{
            duration: 0.9,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          💦
        </motion.span>
      ))}

      {/* milestone badge */}
      <motion.div
        initial={{ scale: 0, y: -40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
        className="absolute left-1/2 top-[6%] flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-sky px-6 py-3 nb-shadow"
      >
        <span className="text-3xl leading-none">🌧️</span>
        <span className="text-2xl font-bold tracking-tight text-white">
          RAIN DANCE! {milestone} STARS!
        </span>
        <span className="text-3xl leading-none">💧</span>
      </motion.div>

      {/* big rain cloud centerpiece */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: size.h * 0.14 }}
        initial={{ scale: 0, opacity: 0, y: -30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.35 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-44 items-center justify-center border-[3px] border-ink bg-white/90 nb-shadow sm:size-52"
        >
          <span className="text-[5.5rem] leading-none sm:text-[7rem]">🌧️</span>
        </motion.div>
      </motion.div>

      {/* full roster dance crew — curtain-call extravaganza */}
      {dancingPals.map((pal) => {
        const motionProps = motionForKind(pal.motion);
        return (
          <motion.div
            key={pal.id}
            className="absolute"
            style={{
              left: `${pal.xPct}%`,
              top: `${pal.yPct}%`,
            }}
            initial={{ scale: 0, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              delay: pal.delay,
              type: "spring",
              stiffness: 220,
              damping: 14,
            }}
          >
            <motion.span
              className={`${pal.size} inline-block leading-none drop-shadow-sm`}
              {...motionProps}
              transition={{
                ...motionProps.transition,
                delay: pal.delay,
              }}
            >
              {pal.emoji}
            </motion.span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
