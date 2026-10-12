import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface EvidenceStepperProps {
  readonly title: string;
  readonly setup: string;
  readonly steps: readonly string[];
  readonly result: string;
  readonly stepLabel: string;
  readonly resetLabel: string;
  readonly resultLabel: string;
}

export function EvidenceStepper({ title, setup, steps, result, stepLabel, resetLabel, resultLabel }: EvidenceStepperProps) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const complete = visibleSteps === steps.length;

  return (
    <section className="evidence-stepper" aria-live="polite">
      <div className="evidence-stepper-head">
        <div>
          <p className="instrument-label">Interactive evidence</p>
          <h3>{title}</h3>
        </div>
        <span className="evidence-counter">{visibleSteps} / {steps.length}</span>
      </div>
      <p className="evidence-setup">{setup}</p>
      <ol className="evidence-track">
        {steps.map((step, index) => (
          <li key={step} data-visible={index < visibleSteps}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{index < visibleSteps ? step : "••••••••••••"}</p>
          </li>
        ))}
      </ol>
      {complete ? (
        <div className="evidence-result"><CheckCircle size={19} weight="regular" /><p><strong>{resultLabel}</strong> {result}</p></div>
      ) : null}
      <div className="evidence-actions">
        <Button type="button" onClick={() => setVisibleSteps((current) => Math.min(current + 1, steps.length))} disabled={complete}>
          {stepLabel} <ArrowRight size={16} weight="bold" />
        </Button>
        <Button type="button" variant="ghost" onClick={() => setVisibleSteps(0)} disabled={visibleSteps === 0}>
          <ArrowCounterClockwise size={16} /> {resetLabel}
        </Button>
      </div>
    </section>
  );
}
