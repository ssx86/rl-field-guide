import { useState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { controlUpdate, type ControlMethod, type ControlUpdateTrace } from "@/domain/td-control";

const METHODS: readonly { id: ControlMethod; label: string }[] = [
  { id: "sarsa", label: "SARSA" },
  { id: "expected-sarsa", label: "Expected SARSA" },
  { id: "q-learning", label: "Q-learning" },
  { id: "double-q", label: "Double Q" },
];

export function ControlUpdateLab({ onEvidence }: { readonly onEvidence: () => void }) {
  const [method, setMethod] = useState<ControlMethod>("sarsa");
  const [terminal, setTerminal] = useState(false);
  const [trace, setTrace] = useState<ControlUpdateTrace>();
  const chooseMethod = (next: ControlMethod) => { setMethod(next); setTrace(undefined); };
  const toggleTerminal = () => { setTerminal((value) => !value); setTrace(undefined); };
  const run = () => { setTrace(controlUpdate(method, { terminal })); onEvidence(); };

  return (
    <section className="learning-lab" aria-labelledby="control-lab-title">
      <div className="learning-lab-heading"><div><p>Interactive depth</p><h2 id="control-lab-title">One transition, four targets</h2></div><span>Q = 2 · r = −1 · γ = 0.9 · α = 0.5</span></div>
      <p className="learning-lab-intro">Keep the transition fixed and change only the bootstrap rule. That one choice separates on-policy, off-policy, expected, and double estimators.</p>
      <div className="learning-lab-tabs" role="tablist" aria-label="TD control methods">
        {METHODS.map((item) => <button key={item.id} type="button" role="tab" aria-selected={method === item.id} onClick={() => chooseMethod(item.id)}>{item.label}</button>)}
      </div>
      <label className="terminal-toggle"><input type="checkbox" checked={terminal} onChange={toggleTerminal} /><span>Terminal transition</span><small>{terminal ? "Reward is the whole target" : "Bootstrap from next action values 4 and 7"}</small></label>
      <div className="learning-lab-canvas">
        {trace ? <ControlEvidence trace={trace} /> : <div className="learning-lab-prompt"><ArrowsClockwise size={22} /><p>Run the selected update to expose its target, TD error, and new value.</p></div>}
      </div>
      <Button size="sm" onClick={run}>Run control update</Button>
    </section>
  );
}

function ControlEvidence({ trace }: { readonly trace: ControlUpdateTrace }) {
  return <><div className="lab-result-grid"><Metric label="Policy relation" value={trace.policy} /><Metric label="Bootstrap" value={trace.bootstrap.toFixed(2)} emphasis={trace.terminal} /><Metric label="Target" value={trace.target.toFixed(2)} emphasis /><Metric label="TD error" value={trace.error.toFixed(2)} /><Metric label="New Q" value={trace.newValue.toFixed(2)} /></div><p className="lab-result-note">{trace.targetMeaning}</p></>;
}

function Metric({ label, value, emphasis = false }: { readonly label: string; readonly value: string; readonly emphasis?: boolean }) {
  return <div className={emphasis ? "lab-metric lab-metric-emphasis" : "lab-metric"}><span>{label}</span><strong>{value}</strong></div>;
}
