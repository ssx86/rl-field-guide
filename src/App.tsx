import { useState } from "react";
import { HomeScreen } from "@/components/home-screen";
import { LessonScreen } from "@/components/lesson-screen";
import { useTheme } from "@/hooks/use-theme";

export function App() {
  const [screen, setScreen] = useState<"home" | "lesson">("home");
  const { theme, toggleTheme } = useTheme();

  if (screen === "lesson") {
    return <LessonScreen theme={theme} onToggleTheme={toggleTheme} onOpenHome={() => setScreen("home")} />;
  }

  return <HomeScreen theme={theme} onToggleTheme={toggleTheme} onBegin={() => setScreen("lesson")} />;
}
