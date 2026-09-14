import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Red stage curtains sweep closed across the screen, hold briefly, then open.
 */
export function TheaterCurtainsCelebration({ milestone }: { milestone: number }) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 5500);
    return () => window.clearTimeout(t);
  }, []);

  if (!size) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* left curtain */}
      <motion.div
        className="absolute left-0 top-0 h-full w-1/2 origin-left border-r-[6px] border-[#5c0a0a] bg-[#b91c1c]"
        initial={{ x: "-100%" }}
        animate={{ x: open ? "-100%" : "0%" }}
        transition={{ duration: open ? 1.1 : 1.4, ease: "easeInOut" }}
      >
        <div className="absolute inset-y-0 right-0 w-8 bg-[#991b1b]/80" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-full border-t-[3px] border-[#7f1d1d]"
            style={{ height: `${(i + 1) * 14}%` }}
          />
        ))}
      </motion.div>

      {/* right curtain */}
      <motion.div
        className="absolute right-0 top-0 h-full w-1/2 origin-right border-l-[6px] border-[#5c0a0a] bg-[#b91c1c]"
        initial={{ x: "100%" }}
        animate={{ x: open ? "100%" : "0%" }}
        transition={{ duration: open ? 1.1 : 1.4, ease: "easeInOut" }}
      >
        <div className="absolute inset-y-0 left-0 w-8 bg-[#991b1b]/80" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-full border-t-[3px] border-[#7f1d1d]"
            style={{ height: `${(i + 1) * 14}%` }}
          />
        ))}
      </motion.div>

      {/* center message while curtains are closed */}
      {!open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 border-[3px] border-ink bg-sun px-6 py-4 nb-shadow"
        >
          <span className="text-4xl">🎭</span>
          <span className="text-2xl font-bold">{milestone} STARS!</span>
          <span className="text-sm font-semibold">Take a bow!</span>
        </motion.div>
      )}
    </motion.div>
  );
}
