import { ModuleShell } from "@/components/ModuleShell";
import { api } from "@/convex/_generated/api";
import { buildProgressMap, type ModuleId } from "@/lib/game-core";
import { MODULES, isModuleId } from "@/lib/modules";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Navigate, useParams } from "react-router";

export default function ModulePage() {
  const { module: moduleParam } = useParams();
  const moduleId = isModuleId(moduleParam) ? (moduleParam as ModuleId) : null;

  const playerState = useQuery(api.game.getPlayerState);
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
