import { Eye, Lightbulb } from "@phosphor-icons/react";
import type { BanditDecisionTrace } from "@/domain/bandits";
import type { EvidenceKind } from "@/domain/course-progress";

interface BanditEvidenceProps {
  readonly trace?: BanditDecisionTrace;
  readonly progress: readonly EvidenceKind[];
}

export function BanditEvidence({ trace, progress }: BanditEvidenceProps) {
  return (
    <aside className="evidence-panel" aria-label="Bandit evidence inspector">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-xs font-semibold text-primary">Evidence</p><h2 className="mt-1 text-base font-bold">One visible decision</h2></div>
        <Eye size={21} className="text-muted-foreground" />
      </div>

      {trace ? (
        <>
          <p className="mt-6 text-sm font-bold">{trace.chosenArm.name} was selected</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-xs">
            <EvidenceRow label="Decision" value={trace.decisionMode} />
            <EvidenceRow label="Reward" value={trace.reward} />
            <EvidenceRow label="Old estimate" value={trace.oldEstimate} />
            <EvidenceRow label="New estimate" value={trace.newEstimate} emphasis />
            <EvidenceRow label="Pull count" value={`${trace.previousPulls} → ${trace.newPulls}`} />
            <EvidenceRow label="Instant regret" value={trace.instantRegret} />
          </dl>
          <div className="mt-6 rounded-control border border-amber-border bg-accent p-3 text-xs leading-5">
            <p className="flex gap-2"><Lightbulb className="mt-0.5 shrink-0 text-primary" size={16} /><span>{trace.reason}</span></p>
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-panel border border-dashed border-border p-5 text-sm leading-6 text-muted-foreground">
          Commit to a prediction, run one strategy, and inspect the exact evidence behind its choice.
        </div>
      )}

      <div className="mt-8 border-t border-border pt-5">
        <p className="text-xs font-bold">Lesson evidence</p>
        <p className="mt-2 font-mono text-2xl font-bold">{progress.length} / 5</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Prediction, experiment, numeric update, transfer, reflection.</p>
      </div>
    </aside>
  );
}

function EvidenceRow({ label, value, emphasis }: { readonly label: string; readonly value: string | number; readonly emphasis?: boolean }) {
  return <div><dt className="text-muted-foreground">{label}</dt><dd className={emphasis ? "mt-1 font-mono text-base font-bold text-primary" : "mt-1 font-mono text-sm font-bold"}>{value}</dd></div>;
}
