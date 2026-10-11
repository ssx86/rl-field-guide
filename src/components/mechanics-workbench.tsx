import { useState } from "react";
import { ArrowRight, CheckCircle, Flask } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { MechanicsLab } from "@/content/mechanics-labs";

export function MechanicsWorkbench({ lab, onEvidence }: { readonly lab: MechanicsLab; readonly onEvidence: () => void }) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = lab.cases[caseIndex];
  const chooseCase = (index: number) => { setCaseIndex(index); setRevealed(false); };
  const run = () => { setRevealed(true); onEvidence(); };

  return (
    <section className="learning-lab" aria-labelledby="mechanics-lab-title">
      <div className="learning-lab-heading">
        <div><p>Interactive depth</p><h2 id="mechanics-lab-title">{lab.title}</h2></div>
        <span>{lab.cases.length} causal experiments</span>
      </div>
      <p className="learning-lab-intro">{lab.intro}</p>
      <div className="learning-lab-tabs" role="tablist" aria-label={`${lab.title} cases`}>
        {lab.cases.map((item, index) => <button key={item.title} type="button" role="tab" aria-selected={caseIndex === index} onClick={() => chooseCase(index)}>{item.title}</button>)}
      </div>
      <div className="learning-lab-canvas mechanics-canvas" role="tabpanel">
        <p className="mechanics-question">{current.prompt}</p>
        <div className="mechanics-givens">
          {current.givens.map((given) => <span key={given}>{given}</span>)}
        </div>
        {revealed ? <div className="mechanics-trace">
          <div><small>Execute</small><p>{current.operation}</p></div>
          <ArrowRight aria-hidden="true" />
          <div className="mechanics-result"><small>Evidence</small><strong>{current.result}</strong></div>
          <ArrowRight aria-hidden="true" />
          <div><small>Meaning</small><p>{current.interpretation}</p></div>
        </div> : <div className="learning-lab-prompt"><Flask size={22} /><p>Commit to a result, then run the causal trace.</p></div>}
      </div>
      <Button size="sm" onClick={run}>{revealed ? <><CheckCircle size={16} /> Evidence revealed</> : "Run causal trace"}</Button>
    </section>
  );
}
