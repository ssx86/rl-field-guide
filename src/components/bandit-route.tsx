import { CheckCircle, Circle, Lock } from "@phosphor-icons/react";
import type { EvidenceKind } from "@/domain/course-progress";

const STEPS = [
  { label: "Read the estimates", evidence: undefined },
  { label: "Commit a prediction", evidence: "prediction" },
  { label: "Run one decision", evidence: "experiment" },
  { label: "Inspect the update", evidence: "numeric" },
  { label: "Transfer the idea", evidence: "transfer" },
  { label: "Explain it plainly", evidence: "reflection" },
] as const;

export function BanditRoute({ progress }: { readonly progress: readonly EvidenceKind[] }) {
  const completed = progress.length;
  return (
    <aside className="lesson-route" aria-label="Bandit lesson route">
      <p className="mb-4 text-xs font-semibold text-muted-foreground">Lesson route</p>
      <ol className="space-y-1">
        {STEPS.map((step, index) => {
          const done = !step.evidence || progress.includes(step.evidence);
          const current = index === Math.min(completed + 1, STEPS.length - 1);
          const state = done ? "done" : current ? "current" : "locked";
          return (
            <li key={step.label} className="lesson-step" data-state={state}>
              {done ? <CheckCircle size={16} /> : current ? <Circle size={16} /> : <Lock size={15} />}
              <span>{step.label}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-8 rounded-panel border border-border bg-card p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary">Key question</p>
        <p className="mt-2 text-sm font-semibold leading-6">Is the largest estimate also the best-informed choice?</p>
      </div>
    </aside>
  );
}
