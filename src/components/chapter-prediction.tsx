import { CheckCircle, Question } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { Chapter } from "@/content/chapter-types";

interface ChapterPredictionProps {
  readonly chapter: Chapter;
  readonly selected?: number;
  readonly locked: boolean;
  readonly onSelect: (index: number) => void;
  readonly onLock: () => void;
}

export function ChapterPrediction({ chapter, selected, locked, onSelect, onLock }: ChapterPredictionProps) {
  return (
    <section className="prediction-panel" aria-labelledby="chapter-prediction-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-control bg-accent text-primary"><Question size={17} /></span>
          <div><p className="text-xs font-semibold text-primary">Predict before reading</p><h2 id="chapter-prediction-title" className="mt-1 text-base font-bold">{chapter.openingQuestion}</h2></div>
        </div>
        {locked ? <span className="status-label"><CheckCircle size={14} /> Prediction locked</span> : null}
      </div>
      <div className="mt-4 grid gap-2" role="radiogroup" aria-label={`${chapter.section} prediction choices`}>
        {chapter.predictionChoices.map((choice, index) => (
          <label key={choice} className="prediction-choice">
            <input type="radio" name={`${chapter.id}-prediction`} checked={selected === index} disabled={locked} onChange={() => onSelect(index)} />
            <span>{choice}</span>
          </label>
        ))}
      </div>
      {!locked ? <Button className="mt-4" size="sm" disabled={selected === undefined} onClick={onLock}>Lock prediction</Button> : (
        <p className={selected === chapter.predictionAnswer ? "chapter-answer text-success" : "chapter-answer text-danger"}>
          {selected === chapter.predictionAnswer ? "Your prediction matches the chapter claim." : `Compare your choice with: ${chapter.predictionChoices[chapter.predictionAnswer]}.`}
        </p>
      )}
    </section>
  );
}
