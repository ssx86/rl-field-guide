import { CheckCircle, Circle, LockSimple } from "@phosphor-icons/react";

const STEPS = [
  { label: "What is known?", state: "done" },
  { label: "One Bellman backup", state: "current" },
  { label: "A complete sweep", state: "next" },
  { label: "Dependency order", state: "next" },
  { label: "Sampled learning", state: "locked" },
] as const;

export function LessonRoute() {
  return (
    <aside className="lesson-route" aria-label="Lesson route">
      <div className="sticky top-6">
        <p className="text-xs font-semibold text-muted-foreground">Lesson route</p>
        <ol className="mt-5 space-y-1">
          {STEPS.map((step) => (
            <li key={step.label} className="lesson-step" data-state={step.state}>
              {step.state === "done" ? <CheckCircle size={17} weight="fill" /> : step.state === "locked" ? <LockSimple size={16} /> : <Circle size={15} weight={step.state === "current" ? "fill" : "regular"} />}
              <span>{step.label}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-panel border border-border bg-card p-4">
          <p className="text-xs font-semibold text-primary">Key question</p>
          <p className="mt-2 text-sm font-bold leading-6">Can I calculate instead of train?</p>
        </div>
      </div>
    </aside>
  );
}
