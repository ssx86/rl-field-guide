import { CheckCircle, Question } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const CHOICES = [
  "Pull the arm with estimate 6",
  "Try the untested arm",
  "Choose at random",
] as const;

interface BanditPredictionProps {
  readonly choice?: string;
  readonly locked: boolean;
  readonly onChoose: (choice: string) => void;
  readonly onLock: () => void;
}

export function BanditPrediction({ choice, locked, onChoose, onLock }: BanditPredictionProps) {
  return (
    <section className="prediction-panel" aria-labelledby="bandit-prediction-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-control bg-accent text-primary"><Question size={17} /></span>
          <div>
            <p className="text-xs font-semibold text-primary">Make a prediction</p>
            <h2 id="bandit-prediction-title" className="mt-1 text-base font-bold">One arm looks best. Which arm should be pulled next?</h2>
          </div>
        </div>
        {locked ? <span className="status-label"><CheckCircle size={14} /> Prediction locked</span> : null}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Bandit prediction choices">
        {CHOICES.map((option) => (
          <label key={option} className="prediction-choice">
            <input type="radio" name="bandit-prediction" value={option} checked={choice === option} disabled={locked} onChange={() => onChoose(option)} />
            <span>{option}</span>
          </label>
        ))}
      </div>

      {!locked ? <Button className="mt-4" size="sm" disabled={!choice} onClick={onLock}>Lock prediction</Button> : null}
    </section>
  );
}
