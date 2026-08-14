import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface WebLine {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

interface WebSpot {
  id: number;
  x: number;
  y: number;
  delay: number;
  scale: number;
  rotate: number;
}

/**
 * Milestone celebration: a spider drops in near the top of the screen, shoots
 * webs to every edge, and bounces up and down while cobwebs pop in around it.
 */
export function SpiderCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const spiderX = size ? size.w / 2 : 0;
  const spiderY = size ? size.h * 0.22 : 0;

  const lines = useMemo<WebLine[]>(() => {
    if (!size) return [];
    const { w, h } = size;
    const targets: [number, number][] = [
      [0, 0],
      [w / 2, 0],
      [w, 0],
      [0, h * 0.45],
      [w, h * 0.45],
      [0, h],
      [w / 2, h],
      [w, h],
    ];
    return targets.map(([x, y], i) => ({
      id: i,
      x1: w / 2,
      y1: h * 0.22,
      x2: x,
      y2: y,
      delay: 0.15 + i * 0.1,
    }));
  }, [size]);

  const webs = useMemo<WebSpot[]>(() => {
    if (!size) return [];
    const { w, h } = size;
    const spots: [number, number][] = [
      [0.08, 0.45],
      [0.92, 0.35],
      [0.16, 0.82],
      [0.84, 0.78],
      [0.05, 0.12],
      [0.95, 0.12],
      [0.5, 0.86],
    ];
    return spots.map(([fx, fy], i) => ({
      id: i,
      x: w * fx,
      y: h * fy,
      delay: 0.55 + i * 0.16,
      scale: 0.8 + Math.random() * 0.7,
      rotate: Math.random() * 40 - 20,
    }));
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
      {/* web strands: ink underlay + white thread, drawn outward */}
      <svg className="absolute inset-0 h-full w-full">
        {lines.map((l) => (
          <g key={l.id}>
            <motion.path
              d={`M ${l.x1} ${l.y1} L ${l.x2} ${l.y2}`}
              fill="none"
              stroke="rgba(20,20,20,0.35)"
              strokeWidth={5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: l.delay, ease: "easeOut" }}
            />
            <motion.path
              d={`M ${l.x1} ${l.y1} L ${l.x2} ${l.y2}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={1.6}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: l.delay, ease: "easeOut" }}
            />
          </g>
        ))}
      </svg>

      {/* cobwebs popping in around the screen */}
      {webs.map((spot) => (
        <motion.span
          key={spot.id}
          className="absolute text-4xl sm:text-5xl"
          style={{ left: spot.x, top: spot.y, rotate: spot.rotate }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: spot.scale, opacity: 1 }}
          transition={{
            delay: spot.delay,
            type: "spring",
            stiffness: 260,
            damping: 14,
          }}
        >
          🕸️
        </motion.span>
      ))}

      {/* milestone badge */}
      <motion.div
        initial={{ y: -40, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 14 }}
        className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-sun px-5 py-2 nb-shadow"
        style={{ top: spiderY + 78 }}
      >
        <span className="text-2xl leading-none">🕸️</span>
        <span className="text-xl font-bold tracking-tight">
          {milestone} STARS!
        </span>
        <span className="text-2xl leading-none">🎉</span>
      </motion.div>

      {/* the spider: drops in, then bounces forever */}
      <motion.div
        className="absolute"
        style={{ left: spiderX - 48, top: spiderY - 48 }}
        initial={{ y: -180, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 13 }}
      >
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-24 items-center justify-center border-[3px] border-ink bg-white nb-shadow"
        >
          <span className="text-6xl leading-none">🕷️</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
