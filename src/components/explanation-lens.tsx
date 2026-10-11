import { useState } from "react";
import { Formula } from "@/components/formula";
import type { BackupTrace } from "@/domain/planning";

type Lens = "numbers" | "symbols" | "plain";

interface ExplanationLensProps {
  readonly trace?: BackupTrace;
  readonly gamma: number;
}

export function ExplanationLens({ trace, gamma }: ExplanationLensProps) {
  const [lens, setLens] = useState<Lens>("numbers");

  return (
    <section className="explanation-lens" aria-labelledby="explanation-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-semibold text-primary">Explanation lens</p><h2 id="explanation-title" className="mt-1 text-lg font-bold">What changed, and why?</h2></div>
        <div className="lens-tabs" role="tablist" aria-label="Explanation format">
          {(["numbers", "symbols", "plain"] as const).map((item) => (
            <button key={item} role="tab" aria-selected={lens === item} onClick={() => setLens(item)}>
              {item === "plain" ? "Plain English" : item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 min-h-24">
        {!trace ? <p className="text-sm leading-6 text-muted-foreground">The equation stays quiet until the experiment produces evidence.</p> : null}
        {trace && lens === "numbers" ? (
          <div className="numeric-equation">
            <span>{trace.terminal ? `${trace.reward}` : `${trace.reward} + ${gamma} x ${trace.nextValue}`}</span>
            <span className="text-muted-foreground">target</span>
            <span>=</span>
            <strong>{trace.target}</strong>
          </div>
        ) : null}
        {trace && lens === "symbols" ? (
          <Formula
            expression={trace.terminal ? "V(s) \\leftarrow r" : "V_{k+1}(s) \\leftarrow r + \\gamma V_k(s')"}
            label={trace.terminal ? "At a terminal transition, value receives only the reward" : "Value equals reward plus discounted next-state value"}
          />
        ) : null}
        {trace && lens === "plain" ? (
          <p className="max-w-[68ch] text-sm leading-7 text-muted-foreground">
            {trace.terminal
              ? "The next state ends the task, so there is no future value to estimate. The reward is the entire target."
              : "This state inherits a discounted part of what its successor is worth, after paying the immediate step cost."}
          </p>
        ) : null}
      </div>
    </section>
  );
}
