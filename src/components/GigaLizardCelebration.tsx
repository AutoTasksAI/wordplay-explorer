import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

/**
 * Friendly giant lizard gets a silly surprise nip from behind, puffs cotton
 * from its back, gets startled, and rolls onto the ground. No gore.
 */
export function GigaLizardCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [phase, setPhase] = useState<"walk" | "nip" | "puff" | "roll">("walk");

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("nip"), 2200);
    const t2 = window.setTimeout(() => setPhase("puff"), 3200);
    const t3 = window.setTimeout(() => setPhase("roll"), 4800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  const cottonPuffs = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: seededRandom(milestone + i * 13) * 80 - 40,
        y: seededRandom(milestone + i * 29) * -60 - 10,
        delay: 3.2 + i * 0.08,
        scale: 0.5 + seededRandom(milestone + i * 41) * 0.8,
      })),
    [milestone],
  );

  if (!size) return null;

  const centerX = size.w / 2;
  const centerY = size.h * 0.45;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-sky/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* giant lizard */}
      <motion.div
        className="absolute"
        style={{ left: centerX - 72, top: centerY - 72 }}
        initial={{ x: -size.w * 0.3, opacity: 0 }}
        animate={{
          x: phase === "walk" ? 0 : 0,
          opacity: 1,
          rotate: phase === "roll" ? 90 : phase === "nip" ? -8 : 0,
          y: phase === "roll" ? 48 : phase === "nip" ? -12 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: phase === "roll" ? 120 : 200,
          damping: phase === "roll" ? 14 : 18,
        }}
      >
        <div className="flex size-36 flex-col items-center justify-center border-[4px] border-ink bg-[#7cb342] nb-shadow">
          <span className="text-7xl leading-none">🦕</span>
          {phase === "nip" && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-1 text-sm font-bold uppercase tracking-wide"
            >
              Eep!
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* silly chomp from behind (a goofy crab, not violent) */}
      {phase !== "walk" && (
        <motion.div
          className="absolute text-5xl"
          style={{ left: centerX - 120, top: centerY - 20 }}
          initial={{ x: 40, opacity: 0, scale: 0 }}
          animate={{ x: 0, opacity: 1, scale: [1, 1.2, 1] }}
          transition={{ duration: 0.35 }}
        >
          🦀
        </motion.div>
      )}

      {/* cotton puffs from the back */}
      {phase === "puff" || phase === "roll"
        ? cottonPuffs.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-3xl"
              style={{ left: centerX + p.x, top: centerY + p.y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: p.scale, opacity: [0, 1, 0.6] }}
              transition={{ delay: p.delay, duration: 1.2 }}
            >
              ☁️
            </motion.span>
          ))
        : null}

      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute left-1/2 top-8 flex -translate-x-1/2 items-center gap-2 border-[3px] border-ink bg-sun px-5 py-2 nb-shadow"
      >
        <span className="text-2xl">🦕</span>
        <span className="text-xl font-bold">{milestone} STARS!</span>
      </motion.div>
    </motion.div>
  );
}
