import { lazy, Suspense, useState } from "react";
import { HomeScreen } from "@/components/home-screen";
import { CHAPTERS, isChapterId } from "@/content/chapters";
import type { EvidenceKind, LessonId } from "@/domain/course-progress";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { useTheme } from "@/hooks/use-theme";

const LessonScreen = lazy(() =>
  import("@/components/lesson-screen").then((module) => ({ default: module.LessonScreen })),
);
const BanditScreen = lazy(() =>
  import("@/components/bandit-screen").then((module) => ({ default: module.BanditScreen })),
);
const ChapterScreen = lazy(() =>
  import("@/components/chapter-screen").then((module) => ({ default: module.ChapterScreen })),
);

export function App() {
  const [screen, setScreen] = useState<"home" | LessonId>("home");
  const { progress, addEvidence } = useCourseProgress();
  const { theme, toggleTheme } = useTheme();

  if (screen === "planning") {
    return (
      <Suspense fallback={<LessonLoading />}>
        <LessonScreen
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenHome={() => setScreen("home")}
          onPredictionLocked={() => addEvidence("planning", "prediction")}
          onEvidenceCreated={() => {
            addEvidence("planning", "experiment");
            addEvidence("planning", "numeric");
          }}
          onTransferPassed={() => addEvidence("planning", "transfer")}
          onReflectionSaved={() => addEvidence("planning", "reflection")}
        />
      </Suspense>
    );
  }

  if (screen === "bandits") {
    return (
      <Suspense fallback={<LessonLoading />}>
        <BanditScreen
          theme={theme}
          progress={progress.bandits}
          onToggleTheme={toggleTheme}
          onOpenHome={() => setScreen("home")}
          onRecordEvidence={(kind: EvidenceKind) => addEvidence("bandits", kind)}
        />
      </Suspense>
    );
  }

  if (isChapterId(screen)) {
    return (
      <Suspense fallback={<LessonLoading />}>
        <ChapterScreen
          chapter={CHAPTERS[screen]}
          theme={theme}
          progress={progress[screen]}
          onToggleTheme={toggleTheme}
          onOpenHome={() => setScreen("home")}
          onRecordEvidence={(kind: EvidenceKind) => addEvidence(screen, kind)}
        />
      </Suspense>
    );
  }

  return <HomeScreen theme={theme} progress={progress} onToggleTheme={toggleTheme} onOpenLesson={setScreen} />;
}

function LessonLoading() {
  return (
    <main className="min-h-[100dvh] bg-background p-4 text-foreground" aria-busy="true" aria-label="Loading lesson">
      <div className="mx-auto max-w-[1100px] animate-pulse space-y-4 pt-20" role="status">
        <span className="sr-only">Loading lesson</span>
        <div className="h-9 w-72 rounded-control bg-surface-subtle" />
        <div className="h-28 rounded-panel bg-surface-subtle" />
        <div className="h-80 rounded-panel bg-surface-subtle" />
      </div>
    </main>
  );
}
