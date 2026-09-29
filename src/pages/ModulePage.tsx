import { ModuleShell } from "@/components/ModuleShell";
import { api } from "@/convex/_generated/api";
import { buildProgressMap, type ModuleId } from "@/lib/game-core";
import { MODULES, isModuleId } from "@/lib/modules";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { GameEscapeHeader } from "@/components/GameEscapeHeader";
import { useLoadingTimeout } from "@/hooks/use-loading-timeout";
import { useMemo } from "react";
import { Navigate, useParams } from "react-router";

export default function ModulePage() {
  const { module: moduleParam } = useParams();
  const moduleId = isModuleId(moduleParam) ? (moduleParam as ModuleId) : null;

  const playerState = useQuery(api.game.getPlayerState);
  const loadTimedOut = useLoadingTimeout(playerState, 8000);
  const recordAnswer = useMutation(api.game.recordAnswer);
  const completeSession = useMutation(api.game.completeSession);

  const progressMap = useMemo(
    () =>
      moduleId
        ? buildProgressMap(playerState?.items ?? [], moduleId)
        : {},
    [playerState, moduleId],
  );

  if (!moduleId) {
    return <Navigate to="/game" replace />;
  }

  const meta = MODULES[moduleId];

  if (playerState === undefined && !loadTimedOut) {
    return (
      <main className="kid-ui flex min-h-screen flex-col bg-paper">
        <GameEscapeHeader />
        <div className="flex flex-1 items-center justify-center">
          <motion.span
            className="text-6xl"
            animate={{ scale: [1, 1.25, 1], rotate: [0, 12, -12, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            ⭐
          </motion.span>
        </div>
      </main>
    );
  }

  return (
    <ModuleShell
      meta={meta}
      progressMap={progressMap}
      stars={playerState?.stars ?? 0}
      onRecord={(item, correct) => {
        void recordAnswer({ module: moduleId, item, correct });
      }}
      onComplete={(s) => {
        void completeSession({ stars: s });
      }}
    />
  );
}
