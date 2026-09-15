import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

/**
 * Red monster truck drives around, gets closer, spins and spits mud;
 * brown splats cover the screen, then wipe away.
 */
export function MonsterTruckCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [mudSpray, setMudSpray] = useState(false);
  const [mudCover, setMudCover] = useState(false);
  const [mudClear, setMudClear] = useState(false);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    // Truck finishes its spin at ~4.1s (82% of 5s path) — rear mud flaps blast first.
    const spray = window.setTimeout(() => setMudSpray(true), 4100);
    const cover = window.setTimeout(() => setMudCover(true), 5200);
    const clear = window.setTimeout(() => setMudClear(true), 8200);
    return () => {
      window.clearTimeout(spray);
      window.clearTimeout(cover);
      window.clearTimeout(clear);
    };
  }, []);

  const rearSpray = useMemo(() => {
    if (!size) return [];
    return Array.from({ length: 10 }, (_, i) => {
      const angle = seededRandom(milestone + i * 11) * Math.PI - Math.PI / 2;
      const dist = 28 + seededRandom(milestone + i * 23) * 52;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        scale: 0.5 + seededRandom(milestone + i * 37) * 0.7,
        delay: seededRandom(milestone + i * 53) * 0.25,
      };
    });
  }, [milestone, size]);

  const splats = useMemo(() => {
    if (!size) return [];
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: seededRandom(milestone + i * 17) * 100,
      y: seededRandom(milestone + i * 31) * 100,
      scale: 0.6 + seededRandom(milestone + i * 43) * 1.4,
      rotate: seededRandom(milestone + i * 59) * 360,
      // Delays are relative to mudCover mount — not absolute from t=0.
      delay: seededRandom(milestone + i * 71) * 0.8,
    }));
  }, [milestone, size]);

  if (!size) return null;

  const { w, h } = size;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* driving path: far → closer loops → face the kid → mud blast */}
      <motion.div
        className="absolute z-10 flex items-center justify-center"
        initial={{ x: -120, y: h * 0.55, scale: 0.45, rotate: 0 }}
        animate={{
          x: [w * 0.1, w * 0.75, w * 0.35, w * 0.5, w * 0.5],
          y: [h * 0.55, h * 0.35, h * 0.5, h * 0.42, h * 0.42],
          scale: [0.45, 0.7, 0.85, 1.15, 1.15],
          rotate: [0, 8, -12, 180, 180],
        }}
        transition={{
          duration: 5,
          times: [0, 0.35, 0.6, 0.82, 1],
          ease: "easeInOut",
        }}
      >
        <div className="relative flex size-28 items-center justify-center border-[4px] border-ink bg-[#e6392f] nb-shadow sm:size-32">
          <span className="text-5xl leading-none sm:text-6xl">🛻</span>
          {/* mud flaps at the rear wheels */}
          <span
            className="absolute -left-1 bottom-3 h-5 w-6 border-[2px] border-ink bg-[#2a2a2a]"
            aria-hidden
          />
          <span
            className="absolute -left-1 top-3 h-5 w-6 border-[2px] border-ink bg-[#2a2a2a]"
            aria-hidden
          />
          <motion.span
            className="absolute -bottom-2 text-xs font-black tracking-widest text-white"
            animate={{ rotate: [0, -8, 12, -180, -180] }}
            transition={{
              duration: 5,
              times: [0, 0.35, 0.6, 0.82, 1],
              ease: "easeInOut",
            }}
          >
            VROOM
          </motion.span>

          {/* mud kicked up from the rear mud flaps when the truck spins */}
          {mudSpray &&
            rearSpray.map((drop) => (
              <motion.span
                key={drop.id}
                className="absolute text-2xl sm:text-3xl"
                style={{ left: "50%", top: "50%" }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x: drop.x,
                  y: drop.y,
                  scale: drop.scale,
                  opacity: [0, 1, 0.7],
                }}
                transition={{ delay: drop.delay, duration: 0.55, ease: "easeOut" }}
                aria-hidden
              >
                🟤
              </motion.span>
            ))}
        </div>
      </motion.div>

      {/* brown tint sits below splats so blobs stay visible */}
      {mudCover && !mudClear && (
        <motion.div
          className="absolute inset-0 z-[15] bg-[#6b4423]/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* full-screen mud splats */}
      {mudCover &&
        splats.map((s) => (
          <motion.span
            key={s.id}
            className="absolute z-20 text-4xl sm:text-5xl"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{
              scale: mudClear ? 0 : s.scale,
              opacity: mudClear ? 0 : 0.92,
              rotate: s.rotate,
            }}
            transition={{ delay: mudClear ? 0 : s.delay, duration: 0.35 }}
          >
            🟤
          </motion.span>
        ))}

      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, type: "spring" }}
        className="absolute left-1/2 top-8 z-30 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-sun px-5 py-2 nb-shadow"
      >
        <span className="text-2xl">🛻</span>
        <span className="text-xl font-bold">{milestone} STARS!</span>
        <span className="text-2xl">💨</span>
      </motion.div>
    </motion.div>
  );
}
