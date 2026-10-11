import { CheckCircle, Eye, WarningCircle } from "@phosphor-icons/react";
import type { BackupTrace } from "@/domain/planning";

interface EvidencePanelProps {
  readonly trace?: BackupTrace;
  readonly pass: number;
}

export function EvidencePanel({ trace, pass }: EvidencePanelProps) {
  return (
    <aside className="evidence-panel" aria-label="Evidence inspector">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-xs font-semibold text-primary">Evidence</p><h2 className="mt-1 text-base font-bold">One visible backup</h2></div>
        <Eye size={21} className="text-muted-foreground" />
      </div>

      {trace ? (
        <>
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 text-xs">
            <EvidenceRow label="State" value={`S${trace.state}`} />
            <EvidenceRow label="Next state" value={`S${trace.nextState}`} />
            <EvidenceRow label="Old value" value={trace.oldValue} />
            <EvidenceRow label="Reward" value={trace.reward} />
            <EvidenceRow label="Next value" value={trace.nextValue} />
            <EvidenceRow label="Target" value={trace.target} />
            <EvidenceRow label="New value" value={trace.newValue} emphasis />
            <EvidenceRow label="Pass" value={pass} />
          </dl>
          <div className="mt-6 rounded-control border border-amber-border bg-accent p-3 text-xs leading-5">
            {trace.terminal ? (
              <p className="flex gap-2"><CheckCircle className="mt-0.5 shrink-0 text-success" size={16} weight="fill" /><span>Terminal transitions stop here. No bootstrap is added.</span></p>
            ) : (
              <p className="flex gap-2"><WarningCircle className="mt-0.5 shrink-0 text-primary" size={16} weight="fill" /><span>This backup reads the next state's value from the selected method's source table.</span></p>
            )}
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-panel border border-dashed border-border p-5 text-sm leading-6 text-muted-foreground">
          Run the experiment, then select a state to inspect the exact numbers used by its backup.
        </div>
      )}
    </aside>
  );
}

function EvidenceRow({ label, value, emphasis }: { readonly label: string; readonly value: string | number; readonly emphasis?: boolean }) {
  return <div><dt className="text-muted-foreground">{label}</dt><dd className={emphasis ? "mt-1 font-mono text-base font-bold text-primary" : "mt-1 font-mono text-sm font-bold"}>{value}</dd></div>;
}
