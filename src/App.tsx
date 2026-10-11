import { lazy, Suspense, useState } from "react";
import { HomeScreen } from "@/components/home-screen";
import { useTheme } from "@/hooks/use-theme";

const LessonScreen = lazy(() =>
  import("@/components/lesson-screen").then((module) => ({ default: module.LessonScreen })),
);

export function App() {
  const [screen, setScreen] = useState<"home" | "lesson">("home");
  const [progress, setProgress] = useState({ prediction: false, numericEvidence: false });
  const { theme, toggleTheme } = useTheme();

  if (screen === "lesson") {
    return (
      <Suspense fallback={<LessonLoading />}>
        <LessonScreen
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenHome={() => setScreen("home")}
          onPredictionLocked={() => setProgress((current) => ({ ...current, prediction: true }))}
          onEvidenceCreated={() => setProgress((current) => ({ ...current, numericEvidence: true }))}
        />
      </Suspense>
    );
  }

  return <HomeScreen theme={theme} progress={progress} onToggleTheme={toggleTheme} onBegin={() => setScreen("lesson")} />;
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
