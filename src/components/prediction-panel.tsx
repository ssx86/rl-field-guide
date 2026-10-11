import { CheckCircle, Question } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface PredictionPanelProps {
  readonly choice?: string;
  readonly locked: boolean;
  readonly onChoose: (choice: string) => void;
  readonly onLock: () => void;
}

const CHOICES = [
  "Every state at once",
  "Only its immediate predecessor",
  "No state until an episode finishes",
] as const;

export function PredictionPanel({ choice, locked, onChoose, onLock }: PredictionPanelProps) {
  return (
    <section className="prediction-panel" aria-labelledby="prediction-title">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-control bg-accent text-primary">
          {locked ? <CheckCircle size={18} weight="fill" /> : <Question size={18} weight="bold" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="text-xs font-semibold text-primary">Make a prediction</p><h2 id="prediction-title" className="mt-1 text-base font-bold">After one parallel sweep, how far does the goal reward travel?</h2></div>
            {locked ? <span className="status-label"><CheckCircle size={14} weight="fill" /> Prediction locked</span> : null}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Prediction choices">
            {CHOICES.map((option) => (
              <label key={option} className="prediction-choice">
                <input
                  type="radio"
                  name="prediction"
                  value={option}
                  checked={choice === option}
                  disabled={locked}
                  onChange={() => onChoose(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          {!locked ? <Button className="mt-4" size="sm" disabled={!choice} onClick={onLock}>Lock prediction</Button> : null}
        </div>
      </div>
    </section>
  );
}
