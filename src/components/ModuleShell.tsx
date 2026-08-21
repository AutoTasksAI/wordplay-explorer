import { useAuth } from "@/hooks/use-auth";
import {
  MASTERY_COUNT,
  SESSION_LENGTH,
  computeLevel,
  type LevelInfo,
  type ModuleConfig,
  type ProgressMap,
  type Round,
} from "@/lib/game-core";
import {
  playBoing,
  playCorrect,
  playFanfare,
  playStar,
  playWrong,
  randomPraise,
  speak,
  warmUpAudio,
  warmUpSpeech,
} from "@/lib/speech";
import { MODULE_IDS } from "@/lib/modules";
import { creatureForMilestone, MILESTONE_STEP } from "@/lib/milestones";
import { BatCelebration } from "./BatCelebration";
import { DragonCelebration } from "./DragonCelebration";
import { LizardCelebration } from "./LizardCelebration";
import { OctopusCelebration } from "./OctopusCelebration";
import { RexPartyCelebration } from "./RexPartyCelebration";
import { SpiderCelebration } from "./SpiderCelebration";
import { UnicornCelebration } from "./UnicornCelebration";
import { WhaleCelebration } from "./WhaleCelebration";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, LogOut, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

type Phase = "start" | "round" | "celebrate";
type RoundStatus = "pending" | "correct";

interface Burst {
  x: number;
  y: number;
  id: number;
}

/** Deterministic pseudo-random value in [0, 1) seeded by an integer. */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function getRectCenter(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/** Little emoji explosion that pops out of the tapped tile on a correct answer. */
function ConfettiBurst({ burst }: { burst: Burst | null }) {
  const pieces = useMemo(() => {
    if (!burst) return [];
    const emojis = ["⭐", "✨", "🎉", "💛", "🌟"];
    return emojis.map((emoji, i) => {
      const seed = burst.id + i * 41;
      const angle = (i / emojis.length) * Math.PI * 2 + seededRandom(seed) * 0.6;
      const dist = 70 + seededRandom(seed + 1) * 70;
      return {
        emoji,
        key: `${burst.id}-${i}`,
        angle,
        dist,
        rotate: seededRandom(seed + 2) * 200 - 100,
      };
    });
  }, [burst]);

  if (!burst) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {pieces.map((p) => (
        <motion.span
          key={p.key}
          className="absolute text-2xl"
          initial={{ x: burst.x, y: burst.y, opacity: 1, scale: 1 }}
          animate={{
            x: burst.x + Math.cos(p.angle) * p.dist,
            y: burst.y + Math.sin(p.angle) * p.dist - 40,
            opacity: 0,
            scale: 1.5,
            rotate: p.rotate,
          }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

/** Slow emoji rain for the celebration screen. */
function RainConfetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 13) * 100,
        delay: seededRandom(i * 17) * 1.4,
        duration: 2.6 + seededRandom(i * 19) * 1.6,
        emoji: ["⭐", "✨", "🎉", "💛", "🎈", "🌟"][i % 6],
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute text-2xl"
          style={{ left: `${p.x}%`, top: "-6%" }}
          animate={{ y: "112vh", rotate: 360 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

function StarDots({ done }: { done: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: SESSION_LENGTH }).map((_, i) => (
        <span
          key={i}
          className={`size-4 border-[3px] border-ink ${
            i < done ? "bg-grass" : i === done ? "bg-sun" : "bg-white"
          }`}
        />
      ))}
    </div>
  );
}

interface ModuleShellProps {
  meta: ModuleConfig;
  progressMap: ProgressMap;
  stars: number;
  onRecord: (item: string, correct: boolean) => void;
  onComplete: (stars: number) => void;
}

export function ModuleShell({
  meta,
  progressMap,
  stars,
  onRecord,
  onComplete,
}: ModuleShellProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("start");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [roundStatus, setRoundStatus] = useState<RoundStatus>("pending");
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [burst, setBurst] = useState<Burst | null>(null);

  const starsRef = useRef(0);
  const wrongTriedRef = useRef(false);
  const spokenRoundRef = useRef<number | null>(null);
  const sessionPraiseRef = useRef("Great job!");
  const burstIdRef = useRef(0);

  // Star milestones: when the lifetime total crosses a 20-star boundary, a
  // creature celebration plays on the next session end. Each creature in the
  // roster throws a bigger party than the last (spider → bat → octopus →
  // lizard → dragon → unicorn → whale → Rex's own party), then the ladder
  // repeats so there is always another friend to meet.
  const [celebration, setCelebration] = useState<{
    kind: string;
    value: number;
  } | null>(null);
  const lastStarsRef = useRef<number | null>(null);
  const celebrationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (lastStarsRef.current === null) {
      lastStarsRef.current = stars;
      return;
    }
    const prev = lastStarsRef.current;
    if (
      stars > prev &&
      Math.floor(stars / MILESTONE_STEP) >
        Math.floor(prev / MILESTONE_STEP)
    ) {
      if (celebration === null) {
        const hit = Math.floor(stars / MILESTONE_STEP) * MILESTONE_STEP;
        const creature = creatureForMilestone(hit / MILESTONE_STEP - 1);
        // Defer the state update so it doesn't happen synchronously inside
        // the effect body (avoids a cascading render warning).
        const startTimer = window.setTimeout(() => {
          setCelebration({ kind: creature.kind, value: hit });
          playBoing();
          celebrationTimeoutRef.current = window.setTimeout(
            () => setCelebration(null),
            creature.durationMs,
          );
        }, 0);
        return () => window.clearTimeout(startTimer);
      }
    }
    lastStarsRef.current = stars;
  }, [stars, celebration]);

  // Mirror the phase so late callbacks (like the octopus ink handoff, which
  // fires seconds after it was created) can tell whether we're still on the
  // celebration screen before navigating away.
  const phaseRef = useRef<Phase>("start");
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(
    () => () => {
      if (celebrationTimeoutRef.current !== null) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }
    },
    [],
  );

  const knownCount = useMemo(
    () =>
      Object.values(progressMap).filter((p) => p.correct >= MASTERY_COUNT)
        .length,
    [progressMap],
  );

  // Curriculum level for this module (null when the module has no levels).
  const level: LevelInfo | null = useMemo(
    () => (meta.level ? computeLevel(progressMap, meta.level) : null),
    [meta, progressMap],
  );

  // Announce a fresh unlock with a fanfare the first time the new level is
  // seen (progress refetches right after a session ends).
  const lastLevelTierRef = useRef<number | null>(null);
  useEffect(() => {
    if (!level) return;
    if (lastLevelTierRef.current === null) {
      lastLevelTierRef.current = level.tier;
      return;
    }
    if (level.tier > lastLevelTierRef.current) {
      lastLevelTierRef.current = level.tier;
      playFanfare();
      speak(`Wow! You unlocked ${level.name}!`);
    } else {
      lastLevelTierRef.current = level.tier;
    }
  }, [level]);

  const currentRound = roundIndex < rounds.length ? rounds[roundIndex] : null;

  // Speak the prompt for each new round so a non-reader always knows what to do.
  useEffect(() => {
    if (phase !== "round" || !currentRound) return;
    if (spokenRoundRef.current === roundIndex) return;
    spokenRoundRef.current = roundIndex;
    speak(currentRound.spoken);
  }, [phase, roundIndex, currentRound]);

  const handleSignOut = async () => {
    speak("Bye bye!");
    await signOut();
    navigate("/");
  };

  const startSession = () => {
    warmUpAudio();
    sessionPraiseRef.current = randomPraise();
    wrongTriedRef.current = false;
    starsRef.current = 0;
    setStarsEarned(0);
    setRoundIndex(0);
    setRoundStatus("pending");
    setWrongKey(null);
    const nextRounds = meta.buildRounds(progressMap);
    setRounds(nextRounds);
    spokenRoundRef.current = null;
    // Pre-generate this session's phrases in the background so rounds play
    // with zero lag once the cartoon voice is configured.
    const praise = sessionPraiseRef.current;
    warmUpSpeech(
      nextRounds.flatMap((r) => [r.spoken, `${praise} ${r.praiseWord}.`]),
    );
    speak("Let's play!");
    setPhase("round");
  };

  const handleReplay = () => {
    if (!currentRound) return;
    speak(currentRound.spoken);
  };

  const handleTap = (
    option: { key: string },
    el: HTMLElement,
  ) => {
    if (phase !== "round" || roundStatus !== "pending" || !currentRound) return;
    const correct = option.key === currentRound.targetKey;

    if (!correct) {
      wrongTriedRef.current = true;
      setWrongKey(option.key);
      playWrong();
      speak("Try again!");
      window.setTimeout(() => setWrongKey(null), 650);
      return;
    }

    const firstTry = !wrongTriedRef.current;
    setRoundStatus("correct");
    playCorrect();
    if (firstTry) {
      starsRef.current += 1;
      setStarsEarned(starsRef.current);
      window.setTimeout(playStar, 120);
    }
    burstIdRef.current += 1;
    setBurst({ ...getRectCenter(el), id: burstIdRef.current });
    window.setTimeout(() => setBurst(null), 900);
    onRecord(currentRound.itemKey, firstTry);

    // Wait for the praise to finish speaking before moving on, so it never
    // gets cut off by the next round's prompt.
    const praiseText = `${sessionPraiseRef.current} ${currentRound.praiseWord}!`;
    void speak(praiseText).then(() => {
      window.setTimeout(goNext, 450);
    });
  };

  const goNext = () => {
    if (!currentRound) return;
    setWrongKey(null);
    setRoundStatus("pending");
    wrongTriedRef.current = false;

    const next = roundIndex + 1;
    if (next >= rounds.length) {
      setPhase("celebrate");
      playFanfare();
      speak(
        "Amazing! You finished! You earned " + starsRef.current + " stars!",
      );
      onComplete(starsRef.current);
      return;
    }
    setRoundIndex(next);
  };

  const handlePlayAgain = () => {
    warmUpAudio();
    setPhase("start");
    // back to start, next PLAY builds a fresh session from updated progress
  };

  // The octopus celebration ends with an ink cover; when it's done, glide the
  // player over to the next module in the rotation (words → numbers → patterns).
  const handleOctopusDone = () => {
    if (phaseRef.current !== "celebrate") return;
    const idx = MODULE_IDS.indexOf(meta.id);
    const next = MODULE_IDS[(idx + 1) % MODULE_IDS.length];
    navigate(`/game/${next}`);
  };

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
        {phase === "start" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/game")}
              className="nb-btn flex items-center gap-1.5 bg-white px-3 py-2 text-sm font-semibold"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Games</span>
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="nb-btn flex items-center gap-1.5 bg-white px-3 py-2 text-sm font-semibold"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Bye!</span>
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {phase === "start" && (
          <motion.section
            key="start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-10 text-center"
          >
            <div className="flex flex-col items-center">
              <motion.span
                className="text-8xl leading-none"
                animate={{ y: [0, -10, 0], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                {meta.mascot}
              </motion.span>
              <p className="mt-4 mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {user?.name ? `Hi ${user.name}!` : "Hi! Ready to explore?"}
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                {meta.headline[0]}{" "}
                <span className={meta.headlineColor}>{meta.headline[1]}</span>
              </h1>
              <p className="mx-auto mt-3 max-w-md text-lg text-muted-foreground">
                {meta.tagline}
              </p>
            </div>

            <div className="flex items-center gap-3 border-[3px] border-ink bg-white px-5 py-3 nb-shadow-sm">
              <span className="text-3xl">⭐</span>
              <span className="text-3xl font-bold">{stars}</span>
              {knownCount > 0 && (
                <span className="text-sm font-semibold text-muted-foreground">
                  · {meta.countEmoji} {knownCount} {meta.countLabel}
                </span>
              )}
            </div>

            {level && (
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-2 border-[3px] border-ink bg-sun px-4 py-1.5 nb-shadow-xs">
                  <span className="text-xl leading-none">{level.emoji}</span>
                  <span className="text-sm font-bold uppercase tracking-wide">
                    Level {level.tier} · {level.name}
                  </span>
                </div>
                {level.remainingToNext !== null ? (
                  <p className="text-sm font-semibold text-muted-foreground">
                    {level.remainingToNext} more to unlock{" "}
                    <span className="text-ink">{level.nextName}</span>!
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-muted-foreground">
                    Every level unlocked. Rex is amazed! 🏆
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={startSession}
              className={`nb-btn ${meta.accent} px-14 py-6 text-3xl font-bold ${meta.accentText} sm:text-4xl`}
            >
              ▶ PLAY
            </button>
            <p className="text-sm font-medium text-muted-foreground">
              {meta.startHint}
            </p>
          </motion.section>
        )}

        {phase === "round" && currentRound && (
          <motion.section
            key={`round-${roundIndex}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-6"
          >
            <div className="flex items-center justify-between gap-3">
              <StarDots done={roundIndex} />
              <div className="flex items-center gap-1.5 border-[3px] border-ink bg-sun px-3 py-1 nb-shadow-xs">
                <span className="text-xl leading-none">⭐</span>
                <span className="text-lg font-bold leading-none">
                  {starsEarned}
                </span>
              </div>
            </div>

            {/* prompt */}
            <div className="relative flex flex-col items-center gap-4">
              <span className="border-[3px] border-ink bg-sky px-4 py-1 text-sm font-bold uppercase tracking-widest text-white nb-shadow-xs">
                {currentRound.prompt}
              </span>
              <div className="relative flex w-full items-center justify-center border-[3px] border-ink bg-white px-6 py-10 nb-shadow sm:py-14">
                <motion.div
                  key={roundIndex}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center"
                >
                  {currentRound.display}
                </motion.div>
                <button
                  type="button"
                  onClick={handleReplay}
                  aria-label="Hear it again"
                  className="nb-btn absolute bottom-3 right-3 flex size-12 items-center justify-center bg-sun"
                >
                  <Volume2 className="size-6" />
                </button>
              </div>
            </div>

            {/* options */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {currentRound.options.map((option) => {
                const isWrongFlash = wrongKey === option.key;
                const isCorrect =
                  roundStatus === "correct" && option.key === currentRound.targetKey;
                return (
                  <motion.button
                    key={option.key}
                    type="button"
                    onClick={(e) => handleTap(option, e.currentTarget)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.94 }}
                    animate={
                      isWrongFlash
                        ? { x: [0, -10, 10, -7, 7, 0] }
                        : isCorrect
                          ? { scale: [1, 1.12, 1] }
                          : { x: 0 }
                    }
                    transition={{ duration: isWrongFlash ? 0.4 : 0.3 }}
                    className={`relative flex aspect-square w-full items-center justify-center overflow-hidden border-[3px] border-ink p-1.5 nb-shadow-sm ${
                      isCorrect
                        ? "bg-grass"
                        : isWrongFlash
                          ? "bg-tomato"
                          : "bg-white"
                    }`}
                  >
                    {option.node}
                    {isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-1 right-1.5 text-xl text-white"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <p className="text-center text-sm font-semibold text-muted-foreground">
              Round {roundIndex + 1} of {SESSION_LENGTH}
            </p>
          </motion.section>
        )}

        {phase === "celebrate" && (
          <motion.section
            key="celebrate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center"
          >
            <RainConfetti />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 12,
                  delay: 0.1,
                }}
              >
                <span className="inline-block text-8xl">{meta.mascot}</span>
              </motion.div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                  YOU DID IT!
                </h1>
                <p className="mt-2 text-xl font-medium text-muted-foreground">
                  {SESSION_LENGTH} {meta.unitLabel} explored!
                </p>
              </div>
              <div className="flex items-center gap-2 border-[3px] border-ink bg-sun px-6 py-3 nb-shadow">
                {Array.from({ length: SESSION_LENGTH }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.12,
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                    }}
                    className={`text-4xl ${
                      i < starsEarned ? "" : "opacity-25 grayscale"
                    }`}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <p className="text-2xl font-bold">
                {starsEarned} of {SESSION_LENGTH} stars!
              </p>
              <p className="text-lg font-medium text-muted-foreground">
                Rex is so proud of you! 🦖
              </p>
              <button
                type="button"
                onClick={handlePlayAgain}
                className={`nb-btn ${meta.accent} px-10 py-5 text-2xl font-bold ${meta.accentText}`}
              >
                ▶ PLAY AGAIN
              </button>
              <button
                type="button"
                onClick={() => navigate("/game")}
                className="nb-btn flex items-center gap-1.5 bg-white px-6 py-3 text-sm font-semibold"
              >
                <ArrowLeft className="size-4" />
                All games
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <ConfettiBurst burst={burst} />
      <AnimatePresence>
        {celebration?.kind === "spider" && (
          <SpiderCelebration key="spider" milestone={celebration.value} />
        )}
        {celebration?.kind === "bat" && (
          <BatCelebration key="bat" milestone={celebration.value} />
        )}
        {celebration?.kind === "octopus" && (
          <OctopusCelebration
            key="octopus"
            milestone={celebration.value}
            onDone={handleOctopusDone}
          />
        )}
        {celebration?.kind === "lizard" && (
          <LizardCelebration key="lizard" milestone={celebration.value} />
        )}
        {celebration?.kind === "dragon" && (
          <DragonCelebration key="dragon" milestone={celebration.value} />
        )}
        {celebration?.kind === "unicorn" && (
          <UnicornCelebration key="unicorn" milestone={celebration.value} />
        )}
        {celebration?.kind === "whale" && (
          <WhaleCelebration key="whale" milestone={celebration.value} />
        )}
        {celebration?.kind === "rex" && (
          <RexPartyCelebration key="rex" milestone={celebration.value} />
        )}
      </AnimatePresence>
    </main>
  );
}
