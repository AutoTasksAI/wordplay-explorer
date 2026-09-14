import type { CelebrationStyle } from "@/lib/milestones";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

const BG_TINT: Partial<Record<CelebrationStyle, string>> = {
  bounce: "bg-grass/15",
  spin: "bg-sky/20",
  slide: "bg-sun/20",
  float: "bg-bubblegum/15",
  shake: "bg-tomato/10",
  pop: "bg-grass/20",
  zoom: "bg-sun/25",
  wiggle: "bg-bubblegum/20",
  orbit: "bg-sky/15",
  rain: "bg-sun/15",
};

interface SimplePalCelebrationProps {
  milestone: number;
  emoji: string;
  style: CelebrationStyle;
}

/**
 * Lightweight milestone overlay for pals 12–50. Each style uses a distinct
 * motion pattern so every unlock still feels different.
 */
export function SimplePalCelebration({
  milestone,
  emoji,
  style,
}: SimplePalCelebrationProps) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const confetti = useMemo(
    () =>
      Array.from({ length: style === "rain" ? 18 : 10 }, (_, i) => ({
        id: i,
        x: seededRandom(milestone + i * 19) * 100,
        delay: seededRandom(milestone + i * 23) * 0.6,
        emoji: ["⭐", "✨", "🎉", "💛", "🎈"][i % 5],
      })),
    [milestone, style],
  );

  const motionProps = useMemo(() => {
    switch (style) {
      case "bounce":
        return {
          animate: { y: [0, -40, 0, -24, 0], scale: [1, 1.08, 1] },
          transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const },
        };
      case "spin":
        return {
          animate: { rotate: [0, 360], scale: [1, 1.15, 1] },
          transition: { duration: 2.4, repeat: Infinity, ease: "linear" as const },
        };
      case "slide":
        return {
          animate: { x: [-80, 80, -40, 0], rotate: [0, -6, 6, 0] },
          transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const },
        };
      case "float":
        return {
          animate: { y: [0, -28, 0], x: [0, 12, -12, 0] },
          transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
        };
      case "shake":
        return {
          animate: { x: [0, -12, 12, -8, 8, 0], rotate: [0, -4, 4, 0] },
          transition: { duration: 0.55, repeat: Infinity, ease: "easeInOut" as const },
        };
      case "pop":
        return {
          animate: { scale: [1, 1.35, 0.95, 1.2, 1] },
          transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" as const },
        };
      case "zoom":
        return {
          animate: { scale: [0.85, 1.25, 1], y: [20, -10, 0] },
          transition: { duration: 1.8, repeat: Infinity, ease: "easeOut" as const },
        };
      case "wiggle":
        return {
          animate: { rotate: [0, -12, 12, -8, 8, 0] },
          transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" as const },
        };
      case "orbit":
        return {
          animate: { rotate: [0, 360] },
          transition: { duration: 3.5, repeat: Infinity, ease: "linear" as const },
        };
      case "rain":
      default:
        return {
          animate: { y: [0, -16, 0], scale: [1, 1.05, 1] },
          transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const },
        };
    }
  }, [style]);

  if (!size) return null;

  const cx = size.w / 2;
  const cy = size.h * 0.42;

  return (
    <motion.div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden ${BG_TINT[style] ?? ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          className="absolute text-2xl"
          style={{ left: `${c.x}%`, top: style === "rain" ? "-8%" : "12%" }}
          animate={
            style === "rain"
              ? { y: ["0vh", "110vh"], rotate: 360 }
              : { y: [0, 8, 0], opacity: [0.6, 1, 0.6] }
          }
          transition={{
            duration: style === "rain" ? 2.4 + c.delay : 1.8,
            delay: c.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {c.emoji}
        </motion.span>
      ))}

      <motion.div
        className="absolute"
        style={{ left: cx - 56, top: cy - 56 }}
        {...motionProps}
      >
        <div className="flex size-28 items-center justify-center border-[3px] border-ink bg-white nb-shadow sm:size-32">
          <span className="text-6xl leading-none sm:text-7xl">{emoji}</span>
        </div>
      </motion.div>

      {style === "orbit" &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute text-3xl"
            style={{ left: cx - 12, top: cy - 12 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2 + i * 0.4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translate(${60 + i * 22}px, ${-20 + i * 14}px)`,
              }}
            >
              ✨
            </span>
          </motion.span>
        ))}

      <motion.div
        initial={{ y: -36, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute left-1/2 top-8 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-sun px-5 py-2 nb-shadow"
      >
        <span className="text-2xl">{emoji}</span>
        <span className="text-xl font-bold">{milestone} STARS!</span>
        <span className="text-2xl">🎉</span>
      </motion.div>
    </motion.div>
  );
}
