import { useState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface BanditCheckpointsProps {
  readonly onTransferPassed: () => void;
  readonly onReflectionSaved: () => void;
}

export function BanditCheckpoints({ onTransferPassed, onReflectionSaved }: BanditCheckpointsProps) {
  const [transfer, setTransfer] = useState<string>();
  const [transferResult, setTransferResult] = useState<"passed" | "retry">();
  const [reflection, setReflection] = useState<string>();
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [reflectionNeedsRetry, setReflectionNeedsRetry] = useState(false);

  const checkTransfer = () => {
    const passed = transfer === "ucb";
    setTransferResult(passed ? "passed" : "retry");
    if (passed) onTransferPassed();
  };

  const saveReflection = () => {
    if (!reflection) return;
    if (reflection !== "uncertainty") {
      setReflectionNeedsRetry(true);
      return;
    }
    setReflectionNeedsRetry(false);
    setReflectionSaved(true);
    onReflectionSaved();
  };

  return (
    <section className="checkpoint-grid" aria-label="Bandit transfer and reflection">
      <div className="checkpoint-panel">
        <p className="text-xs font-semibold text-primary">Transfer</p>
        <h2 className="mt-1 text-base font-bold">A fourth arm has never been tried. Which statement identifies the method?</h2>
        <div className="mt-4 space-y-2" role="radiogroup" aria-label="Transfer choices">
          <CheckpointChoice name="transfer" label="ε-greedy always selects the least-tested arm" checked={transfer === "epsilon"} onChange={() => setTransfer("epsilon")} />
          <CheckpointChoice name="transfer" label="UCB adds an explicit uncertainty bonus" checked={transfer === "ucb"} onChange={() => setTransfer("ucb")} />
        </div>
        <Button className="mt-4" size="sm" disabled={!transfer} onClick={checkTransfer}>Check transfer</Button>
        {transferResult === "passed" ? <p className="checkpoint-result text-success"><CheckCircle size={16} /> Transfer passed</p> : null}
        {transferResult === "retry" ? <p className="checkpoint-result text-danger"><WarningCircle size={16} /> Not yet. Random exploration and an uncertainty bonus are different mechanisms.</p> : null}
      </div>

      <div className="checkpoint-panel">
        <p className="text-xs font-semibold text-primary">Reflection</p>
        <h2 className="mt-1 text-base font-bold">Complete the idea in plain English.</h2>
        <p className="mt-2 text-sm text-muted-foreground">Exploration can be useful because…</p>
        <div className="mt-4 space-y-2" role="radiogroup" aria-label="Reflection choices">
          <CheckpointChoice name="reflection" label="it reduces uncertainty that could hide a better action" checked={reflection === "uncertainty"} onChange={() => setReflection("uncertainty")} />
          <CheckpointChoice name="reflection" label="it guarantees the next reward will be larger" checked={reflection === "guarantee"} onChange={() => setReflection("guarantee")} />
        </div>
        <Button className="mt-4" size="sm" variant="secondary" disabled={!reflection || reflectionSaved} onClick={saveReflection}>{reflectionSaved ? "Reflection saved" : "Save reflection"}</Button>
        {reflectionNeedsRetry ? <p className="checkpoint-result text-danger"><WarningCircle size={16} /> Try again: exploration buys information, not a guaranteed reward.</p> : null}
      </div>
    </section>
  );
}

function CheckpointChoice({ name, label, checked, onChange }: { readonly name: string; readonly label: string; readonly checked: boolean; readonly onChange: () => void }) {
  return <label className="checkpoint-choice"><input type="radio" name={name} checked={checked} onChange={onChange} /><span>{label}</span></label>;
}
