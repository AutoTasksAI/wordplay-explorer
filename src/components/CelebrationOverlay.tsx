import {
  creatureForMilestone,
  MILESTONE_CREATURES,
  type MilestoneCreature,
} from "@/lib/milestones";
import { BatCelebration } from "./BatCelebration";
import { DragonCelebration } from "./DragonCelebration";
import { GigaLizardCelebration } from "./GigaLizardCelebration";
import { LizardCelebration } from "./LizardCelebration";
import { MonsterTruckCelebration } from "./MonsterTruckCelebration";
import { OctopusCelebration } from "./OctopusCelebration";
import { RexPartyCelebration } from "./RexPartyCelebration";
import { SimplePalCelebration } from "./SimplePalCelebration";
import { SpiderCelebration } from "./SpiderCelebration";
import { TheaterCurtainsCelebration } from "./TheaterCurtainsCelebration";
import { BlackStallionCelebration } from "./BlackStallionCelebration";
import { RainFinaleCelebration } from "./RainFinaleCelebration";
import { WhaleCelebration } from "./WhaleCelebration";

interface CelebrationOverlayProps {
  kind: string;
  milestone: number;
  onOctopusDone: () => void;
}

function findCreature(kind: string): MilestoneCreature | undefined {
  return MILESTONE_CREATURES.find((c) => c.kind === kind);
}

export function CelebrationOverlay({
  kind,
  milestone,
  onOctopusDone,
}: CelebrationOverlayProps) {
  switch (kind) {
    case "spider":
      return <SpiderCelebration milestone={milestone} />;
    case "bat":
      return <BatCelebration milestone={milestone} />;
    case "octopus":
      return (
        <OctopusCelebration milestone={milestone} onDone={onOctopusDone} />
      );
    case "lizard":
      return <LizardCelebration milestone={milestone} />;
    case "dragon":
      return <DragonCelebration milestone={milestone} />;
    case "black-stallion":
      return <BlackStallionCelebration milestone={milestone} />;
    case "whale":
      return <WhaleCelebration milestone={milestone} />;
    case "rex":
      return <RexPartyCelebration milestone={milestone} />;
    case "monster-truck":
      return <MonsterTruckCelebration milestone={milestone} />;
    case "giga-lizard":
      return <GigaLizardCelebration milestone={milestone} />;
    case "theater-curtains":
      return <TheaterCurtainsCelebration milestone={milestone} />;
    case "rain":
      return <RainFinaleCelebration milestone={milestone} />;
    default: {
      const creature = findCreature(kind);
      if (creature?.style && creature.style !== "custom") {
        return (
          <SimplePalCelebration
            milestone={milestone}
            emoji={creature.emoji}
            style={creature.style}
          />
        );
      }
      const fallback = creatureForMilestone(0);
      return (
        <SimplePalCelebration
          milestone={milestone}
          emoji={creature?.emoji ?? fallback.emoji}
          style="bounce"
        />
      );
    }
  }
}
