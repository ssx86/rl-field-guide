import { useState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { Chapter } from "@/content/chapter-types";

interface ChapterCheckpointProps {
  readonly chapter: Chapter;
  readonly onPassed: () => void;
  readonly onReflected: () => void;
}

export function ChapterCheckpoint({ chapter, onPassed, onReflected }: ChapterCheckpointProps) {
  const [selected, setSelected] = useState<number>();
  const [result, setResult] = useState<"passed" | "retry">();
  const [reflected, setReflected] = useState(false);
  const check = () => {
    const passed = selected === chapter.checkpoint.answer;
    setResult(passed ? "passed" : "retry");
    if (passed) onPassed();
  };
  return (
    <section className="chapter-section" aria-labelledby="chapter-transfer-title">
      <p className="text-xs font-semibold text-primary">Transfer challenge</p><h2 id="chapter-transfer-title" className="mt-1 text-xl font-bold">{chapter.checkpoint.question}</h2>
      <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Transfer choices">
        {chapter.checkpoint.choices.map((choice, index) => <label key={choice} className="checkpoint-choice"><input type="radio" name={`${chapter.id}-transfer`} checked={selected === index} onChange={() => setSelected(index)} /><span>{choice}</span></label>)}
      </div>
      <Button className="mt-4" size="sm" disabled={selected === undefined} onClick={check}>Check transfer</Button>
      {result ? <p className={result === "passed" ? "checkpoint-result text-success" : "checkpoint-result text-danger"}>{result === "passed" ? <CheckCircle size={16} /> : <WarningCircle size={16} />}<span>{result === "passed" ? chapter.checkpoint.explanation : "Recheck the method assumptions and try again."}</span></p> : null}
      {result === "passed" ? <div className="mt-5 border-t border-border pt-4"><p className="text-sm font-semibold">Can you explain the choice without an algorithm name?</p><Button className="mt-3" size="sm" variant="secondary" disabled={reflected} onClick={() => { setReflected(true); onReflected(); }}>{reflected ? "Reflection saved" : "I can explain it plainly"}</Button></div> : null}
    </section>
  );
}
