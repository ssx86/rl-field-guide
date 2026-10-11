import { useState } from "react";
import { ArrowLeft, Compass } from "@phosphor-icons/react";
import { AppHeader } from "@/components/app-header";
import { BanditBoard } from "@/components/bandit-board";
import { BanditCheckpoints } from "@/components/bandit-checkpoints";
import { BanditEvidence } from "@/components/bandit-evidence";
import { BanditExplanation } from "@/components/bandit-explanation";
import { BanditPrediction } from "@/components/bandit-prediction";
import { BanditRoute } from "@/components/bandit-route";
import { FoundationalExtensions } from "@/components/foundational-extensions";
import { Button } from "@/components/ui/button";
import { runBanditDecision, type BanditDecisionTrace, type BanditStrategy } from "@/domain/bandits";
import type { EvidenceKind } from "@/domain/course-progress";
import type { Theme } from "@/hooks/use-theme";

interface BanditScreenProps {
  readonly theme: Theme;
  readonly progress: readonly EvidenceKind[];
  readonly onToggleTheme: () => void;
  readonly onOpenHome: () => void;
  readonly onRecordEvidence: (kind: EvidenceKind) => void;
}

export function BanditScreen({ theme, progress, onToggleTheme, onOpenHome, onRecordEvidence }: BanditScreenProps) {
  const [prediction, setPrediction] = useState<string>();
  const [predictionLocked, setPredictionLocked] = useState(false);
  const [strategy, setStrategy] = useState<BanditStrategy>("epsilon-greedy");
  const [trace, setTrace] = useState<BanditDecisionTrace>();
  const [comparisonVisible, setComparisonVisible] = useState(false);

  const lockPrediction = () => {
    if (!prediction) return;
    setPredictionLocked(true);
    onRecordEvidence("prediction");
  };

  const run = () => {
    setTrace(runBanditDecision(strategy));
    onRecordEvidence("experiment");
    onRecordEvidence("numeric");
  };

  const changeStrategy = (next: BanditStrategy) => {
    setStrategy(next);
    setTrace(undefined);
  };

  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <AppHeader theme={theme} onToggleTheme={onToggleTheme} onOpenHome={onOpenHome} context="Decisions Under Uncertainty" />
      <div className="mx-auto max-w-[1680px]">
        <div className="lesson-heading">
          <Button variant="ghost" size="sm" onClick={onOpenHome}><ArrowLeft size={16} /> Learn map</Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-[-0.025em] sm:text-3xl">The Best-Looking Arm Can Be a Trap</h1>
              <span className="rounded-control bg-accent px-2.5 py-1 text-[11px] font-semibold text-primary">Bandit route · complete</span>
            </div>
            <p className="mt-2 max-w-[72ch] text-sm leading-6 text-muted-foreground"><span className="mr-1 font-semibold text-foreground">One estimate is high after one lucky reward.</span> Decide whether to exploit it or buy more information.</p>
          </div>
        </div>

        <div className="lesson-layout">
          <BanditRoute progress={progress} />
          <div className="min-w-0 space-y-4 px-4 py-5 sm:px-6 lg:px-8">
            <BanditPrediction choice={prediction} locked={predictionLocked} onChoose={setPrediction} onLock={lockPrediction} />
            <BanditBoard
              strategy={strategy}
              trace={trace}
              predictionLocked={predictionLocked}
              comparisonVisible={comparisonVisible}
              onChangeStrategy={changeStrategy}
              onRun={run}
              onCompare={() => setComparisonVisible(true)}
            />
            <section className="insight-strip">
              <Compass size={20} className="shrink-0 text-primary" />
              <div><h2 className="text-sm font-bold">Exploration has a price and a purpose</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Instant regret measures the reward you give up now. Better information can reduce future regret.</p></div>
            </section>
            <BanditExplanation trace={trace} />
            <FoundationalExtensions route="bandits" />
            <BanditCheckpoints onTransferPassed={() => onRecordEvidence("transfer")} onReflectionSaved={() => onRecordEvidence("reflection")} />
          </div>
          <BanditEvidence trace={trace} progress={progress} />
        </div>
      </div>
    </main>
  );
}
