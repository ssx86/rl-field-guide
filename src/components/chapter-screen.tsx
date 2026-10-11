import { useState } from "react";
import { ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { AppHeader } from "@/components/app-header";
import { ChapterCheckpoint } from "@/components/chapter-checkpoint";
import { ChapterContent } from "@/components/chapter-content";
import { ChapterPrediction } from "@/components/chapter-prediction";
import { ChapterSidebar } from "@/components/chapter-sidebar";
import { ControlUpdateLab } from "@/components/control-update-lab";
import { MechanicsWorkbench } from "@/components/mechanics-workbench";
import { ReturnLab } from "@/components/return-lab";
import { Button } from "@/components/ui/button";
import type { Chapter } from "@/content/chapter-types";
import { hasMechanicsLab, MECHANICS_LABS } from "@/content/mechanics-labs";
import type { EvidenceKind } from "@/domain/course-progress";
import type { Theme } from "@/hooks/use-theme";

interface ChapterScreenProps {
  readonly chapter: Chapter;
  readonly theme: Theme;
  readonly progress: readonly EvidenceKind[];
  readonly onToggleTheme: () => void;
  readonly onOpenHome: () => void;
  readonly onRecordEvidence: (kind: EvidenceKind) => void;
}

export function ChapterScreen({ chapter, theme, progress, onToggleTheme, onOpenHome, onRecordEvidence }: ChapterScreenProps) {
  const [prediction, setPrediction] = useState<number>();
  const [predictionLocked, setPredictionLocked] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);

  const lockPrediction = () => {
    if (prediction === undefined) return;
    setPredictionLocked(true);
    onRecordEvidence("prediction");
  };

  const openExamples = () => {
    setExamplesOpen(true);
    onRecordEvidence("experiment");
    onRecordEvidence("numeric");
  };

  const recordNumericExperiment = () => {
    onRecordEvidence("experiment");
    onRecordEvidence("numeric");
  };

  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <AppHeader theme={theme} onToggleTheme={onToggleTheme} onOpenHome={onOpenHome} context={chapter.section} />
      <div className="mx-auto max-w-[1680px]">
        <div className="lesson-heading">
          <Button variant="ghost" size="sm" onClick={onOpenHome}><ArrowLeft size={16} /> Learn map</Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold tracking-[-0.025em] sm:text-3xl">{chapter.title}</h1><span className="rounded-control bg-accent px-2.5 py-1 text-[11px] font-semibold text-primary">Complete route</span></div>
            <p className="mt-2 max-w-[76ch] text-sm leading-6 text-muted-foreground"><span className="mr-1 font-semibold text-foreground">{chapter.eyebrow}.</span>{chapter.claim}</p>
          </div>
        </div>

        <div className="chapter-layout">
          <nav className="chapter-toc" aria-label={`${chapter.section} contents`}>
            <p className="mb-3 text-xs font-semibold text-muted-foreground">In this chapter</p>
            {chapter.concepts.map((concept, index) => <a key={concept.title} href={`#concept-${chapter.id}-${index}`}>{String(index + 1).padStart(2, "0")} {concept.title}</a>)}
            <a href="#worked-examples-title">Examples</a>
            <a href="#comparison-title">Compare methods</a>
            <div className="mt-6 rounded-panel border border-amber-border bg-accent p-4"><CheckCircle size={18} className="text-primary" /><p className="mt-2 text-xs font-semibold leading-5">Full route: causal workbench, concepts, examples, failure case, comparison, and transfer.</p></div>
          </nav>

          <div className="min-w-0 space-y-4 px-4 py-5 sm:px-6 lg:px-8">
            <ChapterPrediction chapter={chapter} selected={prediction} locked={predictionLocked} onSelect={setPrediction} onLock={lockPrediction} />
            {chapter.id === "returns" ? <ReturnLab onEvidence={recordNumericExperiment} /> : null}
            {chapter.id === "td-control" ? <ControlUpdateLab onEvidence={recordNumericExperiment} /> : null}
            {hasMechanicsLab(chapter.id) ? <MechanicsWorkbench lab={MECHANICS_LABS[chapter.id]} onEvidence={recordNumericExperiment} /> : null}
            <ChapterContent chapter={chapter} examplesOpen={examplesOpen} onOpenExamples={openExamples} />
            <ChapterCheckpoint chapter={chapter} onPassed={() => onRecordEvidence("transfer")} onReflected={() => onRecordEvidence("reflection")} />
          </div>

          <ChapterSidebar chapter={chapter} progress={progress} />
        </div>
      </div>
    </main>
  );
}
