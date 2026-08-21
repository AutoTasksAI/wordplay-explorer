import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { MASTERY_COUNT, type ModuleId } from "@/lib/game-core";
import {
  creatureForMilestone,
  MILESTONE_STEP,
} from "@/lib/milestones";
import { MODULES } from "@/lib/modules";
import { speak, warmUpAudio } from "@/lib/speech";
import { SaveProgressDialog } from "@/components/SaveProgressDialog";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { LogOut, Volume2 } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

const CARD_STAGGER = [0, 0.08, 0.16];

export default function GameHub() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const playerState = useQuery(api.game.getPlayerState);

  const counts = useMemo(() => {
    const c: Record<ModuleId, number> = { words: 0, numbers: 0, patterns: 0 };
    for (const row of playerState?.items ?? []) {
      if (row.correct >= MASTERY_COUNT) c[row.module] += 1;
    }
    return c;
  }, [playerState]);

  // Creature pals: one collected per 20 lifetime stars. Kids can see their
  // collection grow, which makes the long-term reward easy to understand.
  const lifetimeStars = playerState?.stars ?? 0;
  const creaturesEarned = Math.floor(lifetimeStars / MILESTONE_STEP);
  const nextCreatureAt =
    (creaturesEarned + 1) * MILESTONE_STEP - lifetimeStars;

  const handleSignOut = async () => {
    speak("Bye bye!");
    await signOut();
    navigate("/");
  };

  const hearChoices = () => {
    warmUpAudio();
    speak(
      "Pick an adventure! Word Safari. Number Jungle. Pattern Path. Which one will you explore?",
    );
  };

  const startModule = (id: ModuleId) => {
    warmUpAudio();
    speak(`Let's go! ${MODULES[id].title}!`);
    navigate(`/game/${id}`);
  };

  if (playerState === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <motion.span
          className="text-6xl"
          animate={{ scale: [1, 1.25, 1], rotate: [0, 12, -12, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          ⭐
        </motion.span>
      </main>
    );
  }

  return (
    <main className="kid-ui flex min-h-screen flex-col bg-paper">
      {/* top bar */}
      <header className="flex items-center justify-between border-b-[3px] border-ink px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center border-[3px] border-ink bg-sun text-base leading-none shadow-[3px_3px_0_0_#141414]">
            🦖
          </span>
          <span className="text-xl font-bold tracking-tight">
            Read with Rex
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SaveProgressDialog />
          <button
            type="button"
            onClick={handleSignOut}
            className="nb-btn flex items-center gap-1.5 bg-white px-3 py-2 text-sm font-semibold"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Bye!</span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-8 px-4 py-10">
        <div className="flex flex-col items-center text-center">
          <motion.span
            className="text-8xl leading-none"
            animate={{ y: [0, -10, 0], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            🦖
          </motion.span>
          <p className="mt-4 mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {user?.name ? `Hi ${user.name}!` : "Hi! Ready to explore?"}
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Which adventure{" "}
            <span className="text-tomato">today?</span>
          </h1>
          <div className="mt-4 flex items-center gap-3 border-[3px] border-ink bg-white px-5 py-3 nb-shadow-sm">
            <span className="text-3xl">⭐</span>
            <span className="text-3xl font-bold">{playerState?.stars ?? 0}</span>
            {playerState && playerState.sessionsCompleted > 0 && (
              <span className="text-sm font-semibold text-muted-foreground">
                · {playerState.sessionsCompleted}{" "}
                {playerState.sessionsCompleted === 1 ? "adventure" : "adventures"}{" "}
                done
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={hearChoices}
            className="nb-btn mt-5 flex items-center gap-2 bg-sun px-4 py-2 text-sm font-bold"
          >
            <Volume2 className="size-4" />
            Hear the choices
          </button>
        </div>

        {/* creature pals: a new friend joins the crew every 20 stars */}
        <div className="flex w-full max-w-2xl flex-col items-center gap-3">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            My creature pals
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {Array.from({ length: creaturesEarned + 1 }).map((_, i) => {
              const earned = i < creaturesEarned;
              const creature = creatureForMilestone(i);
              return (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: earned ? 0.05 * i : 0,
                    type: "spring",
                    stiffness: 300,
                    damping: 12,
                  }}
                  title={
                    earned
                      ? `${(i + 1) * MILESTONE_STEP} stars!`
                      : `${nextCreatureAt} more stars!`
                  }
                  className={`flex size-12 items-center justify-center border-[3px] border-ink nb-shadow-xs sm:size-14 ${
                    earned ? "bg-white text-3xl" : "bg-paper opacity-45"
                  }`}
                >
                  {earned ? (
                    creature.emoji
                  ) : (
                    <span className="text-xs font-bold">?</span>
                  )}
                </motion.span>
              );
            })}
          </div>
          <p className="text-xs font-semibold text-muted-foreground">
            {creaturesEarned === 0
              ? `Earn ${nextCreatureAt} stars to meet your first pal!`
              : `${nextCreatureAt} more stars until a new pal arrives!`}
          </p>
        </div>

        <div className="grid w-full gap-5 sm:grid-cols-3">
          {(Object.keys(MODULES) as ModuleId[]).map((id, i) => {
            const m = MODULES[id];
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => startModule(id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: CARD_STAGGER[i] }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.96 }}
                className={`flex flex-col items-center gap-4 border-[3px] border-ink p-7 nb-shadow transition-shadow hover:shadow-[8px_8px_0_0_#141414] ${m.cardBg} ${m.cardText}`}
              >
                <span className="text-7xl leading-none">{m.cardEmoji}</span>
                <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {m.title}
                </span>
                <span className="text-center text-sm font-medium opacity-90">
                  {m.tagline}
                </span>
                <span className="border-[3px] border-ink bg-white px-4 py-1.5 text-sm font-bold text-ink nb-shadow-xs">
                  {m.countEmoji} {counts[id]} {m.countLabel}
                </span>
                <span className="text-3xl leading-none">▶</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
