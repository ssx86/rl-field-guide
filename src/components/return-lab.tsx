import { useState } from "react";
import { ArrowRight, Flask } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  discountedReturn,
  importanceSamplingWeight,
  monteCarloUpdate,
  nStepReturn,
} from "@/domain/returns";

type ReturnView = "episode" | "mc" | "n-step" | "importance";

const VIEWS: readonly { id: ReturnView; label: string }[] = [
  { id: "episode", label: "Complete return" },
  { id: "mc", label: "Monte Carlo update" },
  { id: "n-step", label: "n-step bridge" },
  { id: "importance", label: "Importance sampling" },
];

export function ReturnLab({ onEvidence }: { readonly onEvidence: () => void }) {
  const [view, setView] = useState<ReturnView>("episode");
  const [hasRun, setHasRun] = useState(false);
  const episodeReturn = discountedReturn([0, 0, 1], 0.9);
  const mc = monteCarloUpdate(0.2, episodeReturn, 0.5);
  const twoStep = nStepReturn([0, 0], 0.8, 0.9);
  const weight = importanceSamplingWeight([0.8, 0.6], [0.5, 0.4]);

  const run = () => {
    setHasRun(true);
    onEvidence();
  };

  return (
    <section className="learning-lab" aria-labelledby="return-lab-title">
      <div className="learning-lab-heading">
        <div><p>Interactive depth</p><h2 id="return-lab-title">Episode evidence microscope</h2></div>
        <span>Rewards: 0 → 0 → 1 · γ = 0.9</span>
      </div>
      <p className="learning-lab-intro">Use one short episode to see exactly where Monte Carlo, n-step learning, and off-policy correction get their evidence.</p>
      <div className="learning-lab-tabs" role="tablist" aria-label="Return calculation views">
        {VIEWS.map((item) => <button key={item.id} type="button" role="tab" aria-selected={view === item.id} onClick={() => setView(item.id)}>{item.label}</button>)}
      </div>
      <div className="learning-lab-canvas" role="tabpanel">
        <ReturnTrack />
        {!hasRun ? <div className="learning-lab-prompt"><Flask size={22} /><p>Run the fixed episode before reading the numeric evidence.</p></div> : <ReturnEvidence view={view} episodeReturn={episodeReturn} mc={mc} twoStep={twoStep} weight={weight} />}
      </div>
      <Button size="sm" onClick={run}>{hasRun ? "Run episode calculation again" : "Run episode calculation"}</Button>
    </section>
  );
}

function ReturnTrack() {
  return <div className="return-track" aria-label="Three step reward sequence"><span>S0<small>r = 0</small></span><ArrowRight /><span>S1<small>r = 0</small></span><ArrowRight /><span>S2<small>r = 1</small></span><ArrowRight /><span className="terminal-node">T<small>terminal</small></span></div>;
}

interface ReturnEvidenceProps {
  readonly view: ReturnView;
  readonly episodeReturn: number;
  readonly mc: ReturnType<typeof monteCarloUpdate>;
  readonly twoStep: number;
  readonly weight: number;
}

function ReturnEvidence({ view, episodeReturn, mc, twoStep, weight }: ReturnEvidenceProps) {
  if (view === "importance") return <div className="lab-result-grid"><Metric label="Target likelihood" value="0.8 × 0.6" /><Metric label="Behavior likelihood" value="0.5 × 0.4" /><Metric label="Trajectory weight" value={weight.toFixed(2)} emphasis /><p className="lab-result-note">The episode counts 2.4 times because the target policy makes its actions more likely. Zero behavior support would make this correction impossible.</p></div>;
  if (view === "n-step") return <div className="lab-result-grid"><Metric label="Observed rewards" value="0 + 0" /><Metric label="Bootstrap" value="0.9² × 0.8" /><Metric label="2-step target" value={twoStep.toFixed(2)} emphasis /><p className="lab-result-note">The target waits for two real rewards, then borrows the value estimate at the boundary.</p></div>;
  if (view === "mc") return <div className="lab-result-grid"><Metric label="Old value" value={mc.oldValue.toFixed(2)} /><Metric label="Observed return" value={mc.observedReturn.toFixed(2)} /><Metric label="MC error" value={mc.error.toFixed(2)} /><Metric label="New value" value={mc.newValue.toFixed(2)} emphasis /><p className="lab-result-note">V ← 0.20 + 0.5 × (0.81 − 0.20). The target contains no estimated successor value.</p></div>;
  return <div className="lab-result-grid"><Metric label="Immediate rewards" value="0, 0, 1" /><Metric label="Discount weights" value="1, 0.9, 0.81" /><Metric label="Complete return" value={episodeReturn.toFixed(2)} emphasis /><p className="lab-result-note">Only the final reward is nonzero, so two steps of discounting make the starting return 0.81.</p></div>;
}

function Metric({ label, value, emphasis = false }: { readonly label: string; readonly value: string; readonly emphasis?: boolean }) {
  return <div className={emphasis ? "lab-metric lab-metric-emphasis" : "lab-metric"}><span>{label}</span><strong>{value}</strong></div>;
}
