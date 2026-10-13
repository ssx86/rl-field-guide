// Design-debt notice (2026-10-13 audit): this interactive SPA layer predates the
// reading-first course and is NOT part of the shipped site — no .astro page mounts it
// and verify-static.mjs forbids astro-islands in dist/. It stays test-covered only.
// The live content lives in src/pages/ + src/content/curriculum.ts + chapters/part-*.ts.
// Retiring or extracting this layer requires an explicit product decision.
import { useState } from "react";
import { BanditScreen } from "@/components/bandit-screen";
import { ChapterScreen } from "@/components/chapter-screen";
import { HomeScreen } from "@/components/home-screen";
import { LessonScreen } from "@/components/lesson-screen";
import { CHAPTERS, isChapterId } from "@/content/chapters";
import type { EvidenceKind, LessonId } from "@/domain/course-progress";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { useTheme } from "@/hooks/use-theme";

export function App() {
  const [screen, setScreen] = useState<"home" | LessonId>("home");
  const { progress, addEvidence } = useCourseProgress();
  const { theme, toggleTheme } = useTheme();

  if (screen === "planning") {
    return (
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
    );
  }

  if (screen === "bandits") {
    return (
      <BanditScreen
        theme={theme}
        progress={progress.bandits}
        onToggleTheme={toggleTheme}
        onOpenHome={() => setScreen("home")}
        onRecordEvidence={(kind: EvidenceKind) => addEvidence("bandits", kind)}
      />
    );
  }

  if (isChapterId(screen)) {
    return (
      <ChapterScreen
        chapter={CHAPTERS[screen]}
        theme={theme}
        progress={progress[screen]}
        onToggleTheme={toggleTheme}
        onOpenHome={() => setScreen("home")}
        onRecordEvidence={(kind: EvidenceKind) => addEvidence(screen, kind)}
      />
    );
  }

  return <HomeScreen theme={theme} progress={progress} onToggleTheme={toggleTheme} onOpenLesson={setScreen} />;
}
