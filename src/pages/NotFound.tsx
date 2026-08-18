import { motion } from "framer-motion";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-paper text-ink"
    >
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          className="text-8xl"
        >
          🦖
        </motion.span>
        <h1 className="mt-6 text-6xl font-bold tracking-tight">
          4<span className="bg-tomato px-2 text-white">0</span>4
        </h1>
        <p className="mt-3 text-xl font-medium text-muted-foreground">
          Oops! Rex lost this page.
        </p>
        <Link
          to="/"
          className="nb-btn mt-8 bg-sun px-8 py-4 text-xl font-bold"
        >
          ← Back to Read with Rex
        </Link>
      </main>
    </motion.div>
  );
}
