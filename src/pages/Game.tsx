import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import {
  MASTERY_COUNT,
  SESSION_LENGTH,
  WORDS,
  pickOptions,
  pickTargets,
  type ProgressMap,
  type Word,
} from "@/lib/words";
import {
  playCorrect,
  playFanfare,
  playStar,
  playWrong,
  randomPraise,
  speak,
  warmUpAudio,
} from "@/lib/speech";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";

type Phase = "start" | "round" | "celebrate";
type RoundStatus = "pending" | "correct";

interface Burst {
  x: number;
  y: number;
  id: number;
}

function getRectCenter(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/** Little emoji explosion that pops out of the tapped tile on a correct answer. */
function ConfettiBurst({ burst }: { burst: Burst | null }) {
  if (!burst) return null;
  const pieces = ["⭐", "✨", "🎉", "💛", "🌟"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {pieces.map((p, i) => {
        const angle = (i / pieces.length) * Math.PI * 2 + Math.random() * 0.6;
        const dist = 70 + Math.random() * 70;
        return (
          <motion.span
            key={`${burst.id}-${i}`}
            className="absolute text-2xl"
            initial={{ x: burst.x, y: burst.y, opacity: 1, scale: 1 }}
            animate={{
              x: burst.x + Math.cos(angle) * dist,
              y: burst.y + Math.sin(angle) * dist - 40,
              opacity: 0,
              scale: 1.5,
              rotate: Math.random() * 200 - 100,
            }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            {p}
          </motion.span>
        );
      })}
    </div>
  );
}

/** Slow emoji rain for the celebration screen. */
function RainConfetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.4,
        duration: 2.6 + Math.random() * 1.6,
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
            i < done
              ? "bg-grass"
              : i === done
                ? "bg-sun"
                : "bg-white"
          }`}
        />
      ))}
    </div>
  );
}

export default function Game() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const playerState = useQuery(api.game.getPlayerState);
  const recordAnswer = useMutation(api.game.recordAnswer);
  const completeSession = useMutation(api.game.completeSession);

  const [phase, setPhase] = useState<Phase>("start");
  const [targets, setTargets] = useState<Word[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [roundStatus, setRoundStatus] = useState<RoundStatus>("pending");
  const [wrongWord, setWrongWord] = useState<string | null>(null);
  const [burst, setBurst] = useState<Burst | null>(null);

  const starsRef = useRef(0);
  const wrongTriedRef = useRef(false);
  const spokenRoundRef = useRef<number | null>(null);

  const progressMap = useMemo<ProgressMap>(() => {
    const map: ProgressMap = {};
    for (const row of playerState?.words ?? []) {
      map[row.word] = row;
    }
    return map;
  }, [playerState]);

  const knownCount = useMemo(
    () =>
      Object.values(progressMap).filter((p) => p.correct >= MASTERY_COUNT)
        .length,
    [progressMap],
  );

  const currentRound = roundIndex < targets.length ? targets[roundIndex] : null;
  // "picture" rounds show the printed word and ask for the picture;
  // "word" rounds show the picture and ask for the printed word.
  const roundType = roundIndex % 2 === 0 ? "picture" : "word";

  const options = useMemo<Word[]>(
    () => (currentRound ? pickOptions(currentRound, WORDS) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRound],
  );

  // Speak the prompt for each new round so a non-reader always knows what to do.
  useEffect(() => {
    if (phase !== "round" || !currentRound) return;
    if (spokenRoundRef.current === roundIndex) return;
    spokenRoundRef.current = roundIndex;
    const prompt =
      roundType === "word"
        ? `Find the word. ${currentRound.word}.`
        : `Find the picture. ${currentRound.word}.`;
    speak(prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundIndex, currentRound]);

  const handleSignOut = async () => {
    speak("Bye bye!");
    await signOut();
    navigate("/");
  };

  const startSession = () => {
    warmUpAudio();
    wrongTriedRef.current = false;
    starsRef.current = 0;
    setStarsEarned(0);
    setRoundIndex(0);
    setRoundStatus("pending");
    setWrongWord(null);
    setTargets(pickTargets(progressMap, SESSION_LENGTH));
    spokenRoundRef.current = null;
    speak("Let's play!");
    setPhase("round");
  };

  const handleReplay = () => {
    if (!currentRound) return;
    const prompt =
      roundType === "word"
        ? `Find the word. ${currentRound.word}.`
        : `Find the picture. ${currentRound.word}.`;
    speak(prompt);
  };

  const handleTap = (option: Word, el: HTMLElement) => {
    if (phase !== "round" || roundStatus !== "pending" || !currentRound) return;
    const correct = option.word === currentRound.word;

    if (!correct) {
      wrongTriedRef.current = true;
      setWrongWord(option.word);
      playWrong();
      speak("Try again!");
      window.setTimeout(() => setWrongWord(null), 650);
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
    setBurst({ ...getRectCenter(el), id: Date.now() });
    window.setTimeout(() => setBurst(null), 900);
    speak(`${randomPraise()} ${currentRound.word}!`);
    void recordAnswer({ word: currentRound.word, correct: firstTry });

    window.setTimeout(goNext, 1600);
  };

  const goNext = () => {
    if (!currentRound) return;
    setWrongWord(null);
    setRoundStatus("pending");
    wrongTriedRef.current = false;

    const next = roundIndex + 1;
    if (next >= targets.length) {
      setPhase("celebrate");
      playFanfare();
      speak("Amazing! You finished! You earned " + starsRef.current + " stars!");
      void completeSession({ stars: starsRef.current });
      return;
    }
    setRoundIndex(next);
  };

  const handlePlayAgain = () => {
    warmUpAudio();
    setPhase("start");
    // back to start, next PLAY builds a fresh session from updated progress
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
          <span className="flex size-9 items-center justify-center border-[3px] border-ink bg-sun text-lg font-bold text-ink shadow-[3px_3px_0_0_#141414]">
            WP
          </span>
          <span className="text-xl font-bold tracking-tight">WordPop!</span>
        </div>
        {phase === "start" && (
          <button
            type="button"
            onClick={handleSignOut}
            className="nb-btn flex items-center gap-1.5 bg-white px-3 py-2 text-sm font-semibold"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Bye!</span>
          </button>
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
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {user?.name ? `Hi ${user.name}!` : "Hi! Ready to read?"}
              </p>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                WORD
                <span className="text-tomato">POP</span>!
              </h1>
              <p className="mx-auto mt-3 max-w-md text-lg text-muted-foreground">
                Tap the right word or picture. Every win gets a star!
              </p>
            </div>

            <div className="flex items-center gap-3 border-[3px] border-ink bg-white px-5 py-3 nb-shadow-sm">
              <span className="text-3xl">⭐</span>
              <span className="text-3xl font-bold">{playerState?.stars ?? 0}</span>
              {knownCount > 0 && (
                <span className="text-sm font-semibold text-muted-foreground">
                  · {knownCount} words known
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={startSession}
              className="nb-btn bg-tomato px-14 py-6 text-3xl font-bold text-white sm:text-4xl"
            >
              ▶ PLAY
            </button>
            <p className="text-sm font-medium text-muted-foreground">
              Tap PLAY and listen! 👂
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
                {roundType === "word" ? "Find the word" : "Find the picture"}
              </span>
              <div className="relative flex w-full items-center justify-center border-[3px] border-ink bg-white px-6 py-10 nb-shadow sm:py-14">
                {roundType === "word" ? (
                  <motion.span
                    key={currentRound.word}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="text-8xl leading-none sm:text-9xl"
                  >
                    {currentRound.emoji}
                  </motion.span>
                ) : (
                  <motion.span
                    key={currentRound.word}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="text-6xl font-bold tracking-wide sm:text-8xl"
                  >
                    {currentRound.word}
                  </motion.span>
                )}
                <button
                  type="button"
                  onClick={handleReplay}
                  aria-label="Hear the word again"
                  className="nb-btn absolute bottom-3 right-3 flex size-12 items-center justify-center bg-sun"
                >
                  <Volume2 className="size-6" />
                </button>
              </div>
            </div>

            {/* options */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {options.map((option) => {
                const isWrongFlash = wrongWord === option.word;
                const isCorrect = roundStatus === "correct" && option.word === currentRound.word;
                return (
                  <motion.button
                    key={option.word}
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
                    className={`flex aspect-square w-full flex-col items-center justify-center gap-2 border-[3px] border-ink nb-shadow-sm ${
                      isCorrect
                        ? "bg-grass"
                        : isWrongFlash
                          ? "bg-tomato"
                          : "bg-white"
                    }`}
                  >
                    {roundType === "word" ? (
                      <span
                        className={`text-3xl font-bold sm:text-5xl ${isCorrect || isWrongFlash ? "text-white" : ""}`}
                      >
                        {option.word}
                      </span>
                    ) : (
                      <span className="text-6xl leading-none sm:text-8xl">
                        {option.emoji}
                      </span>
                    )}
                    {isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-2xl text-white"
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
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.1 }}
              >
                <span className="text-8xl">🎉</span>
              </motion.div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                  YOU DID IT!
                </h1>
                <p className="mt-2 text-xl font-medium text-muted-foreground">
                  {SESSION_LENGTH} words read!
                </p>
              </div>
              <div className="flex items-center gap-2 border-[3px] border-ink bg-sun px-6 py-3 nb-shadow">
                {Array.from({ length: SESSION_LENGTH }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 300, damping: 10 }}
                    className={`text-4xl ${i < starsEarned ? "" : "opacity-25 grayscale"}`}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <p className="text-2xl font-bold">
                {starsEarned} of {SESSION_LENGTH} stars!
              </p>
              <button
                type="button"
                onClick={handlePlayAgain}
                className="nb-btn bg-sky px-10 py-5 text-2xl font-bold text-white"
              >
                ▶ PLAY AGAIN
              </button>
              <button
                type="button"
                onClick={() => {
                  speak("See you soon! Bye bye!");
                  navigate("/");
                }}
                className="nb-btn bg-white px-6 py-3 text-sm font-semibold"
              >
                Go home
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <ConfettiBurst burst={burst} />
    </main>
  );
}
