import { useState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function PlanningCheckpoint({ onTransferPassed, onReflectionSaved }: { readonly onTransferPassed: () => void; readonly onReflectionSaved: () => void }) {
  const [choice, setChoice] = useState<string>();
  const [result, setResult] = useState<"passed" | "retry">();
  const [reflected, setReflected] = useState(false);
  const check = () => {
    const passed = choice === "policy-iteration";
    setResult(passed ? "passed" : "retry");
    if (passed) onTransferPassed();
  };
  return (
    <section className="chapter-section" aria-labelledby="planning-transfer-title">
      <p className="text-xs font-semibold text-primary">Transfer challenge</p>
      <h2 id="planning-transfer-title" className="mt-1 text-xl font-bold">Which method alternates evaluation of a fixed policy with greedy improvement?</h2>
      <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Planning transfer choices">
        <Choice label="Value iteration" value="value-iteration" choice={choice} onChange={setChoice} />
        <Choice label="Policy iteration" value="policy-iteration" choice={choice} onChange={setChoice} />
        <Choice label="Q-learning" value="q-learning" choice={choice} onChange={setChoice} />
      </div>
      <Button className="mt-4" size="sm" disabled={!choice} onClick={check}>Check planning transfer</Button>
      {result ? <p className={result === "passed" ? "checkpoint-result text-success" : "checkpoint-result text-danger"}>{result === "passed" ? <CheckCircle size={16} /> : <WarningCircle size={16} />}<span>{result === "passed" ? "Policy iteration evaluates the current policy, then improves it with one-step lookahead." : "Separate a fixed-policy evaluation phase from the improvement phase."}</span></p> : null}
      {result === "passed" ? <div className="mt-5 border-t border-border pt-4"><p className="text-sm font-semibold">Can you explain why known dynamics make this planning rather than model-free learning?</p><Button className="mt-3" size="sm" variant="secondary" disabled={reflected} onClick={() => { setReflected(true); onReflectionSaved(); }}>{reflected ? "Reflection saved" : "I can explain planning plainly"}</Button></div> : null}
    </section>
  );
}

function Choice({ label, value, choice, onChange }: { readonly label: string; readonly value: string; readonly choice?: string; readonly onChange: (value: string) => void }) {
  return <label className="checkpoint-choice"><input type="radio" name="planning-transfer" checked={choice === value} onChange={() => onChange(value)} /><span>{label}</span></label>;
}
