import { ArrowRight, Flask, Warning } from "@phosphor-icons/react";
import { Formula } from "@/components/formula";
import { Button } from "@/components/ui/button";
import type { Chapter } from "@/content/chapter-types";

interface ChapterContentProps {
  readonly chapter: Chapter;
  readonly examplesOpen: boolean;
  readonly onOpenExamples: () => void;
}

export function ChapterContent({ chapter, examplesOpen, onOpenExamples }: ChapterContentProps) {
  return (
    <>
      <section className="chapter-map" aria-labelledby="chapter-map-title">
        <div><p className="text-xs font-semibold text-primary">Concept path</p><h2 id="chapter-map-title" className="mt-1 text-lg font-bold">Follow the causal chain</h2></div>
        <div className="chapter-map-flow">
          {chapter.concepts.map((concept, index) => (
            <div key={concept.title} className="contents">
              <a href={`#concept-${chapter.id}-${index}`}>{concept.title}</a>
              {index < chapter.concepts.length - 1 ? <ArrowRight size={15} aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-label={`${chapter.section} concepts`}>
        {chapter.concepts.map((concept, index) => (
          <article key={concept.title} id={`concept-${chapter.id}-${index}`} className="chapter-concept scroll-mt-4">
            <div className="chapter-concept-index">{String(index + 1).padStart(2, "0")}</div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-primary">{concept.question}</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">{concept.title}</h2>
              <p className="mt-3 max-w-[76ch] text-sm leading-7 text-muted-foreground">{concept.explanation}</p>
              <ul className="chapter-mechanics">
                {concept.mechanics.map((item) => <li key={item}>{item}</li>)}
              </ul>
              {concept.formula ? <div className="chapter-formula"><Formula expression={concept.formula} label={concept.formulaLabel ?? concept.title} /></div> : null}
              <p className="chapter-boundary"><Warning size={16} /><span><strong>Boundary:</strong> {concept.boundary}</span></p>
            </div>
          </article>
        ))}
      </section>

      <section className="chapter-section" aria-labelledby="worked-examples-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-semibold text-primary">Evidence before abstraction</p><h2 id="worked-examples-title" className="mt-1 text-xl font-bold">Worked examples</h2></div>
          {!examplesOpen ? <Button size="sm" onClick={onOpenExamples}><Flask size={16} /> Inspect worked evidence</Button> : null}
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {chapter.examples.map((example) => (
            <article key={example.title} className="worked-example">
              <h3>{example.title}</h3>
              <p>{example.situation}</p>
              {examplesOpen ? <ol>{example.walkthrough.map((step) => <li key={step}>{step}</li>)}</ol> : <p className="example-locked">Open the evidence to reveal the causal steps.</p>}
              {examplesOpen ? <strong>{example.result}</strong> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="chapter-counterexample" aria-labelledby="counterexample-title">
        <Warning size={22} className="shrink-0 text-danger" />
        <div><p className="text-xs font-semibold text-danger">Break the assumption</p><h2 id="counterexample-title" className="mt-1 text-lg font-bold">Counterexample</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">{chapter.counterexample}</p></div>
      </section>

      <section className="chapter-section" aria-labelledby="comparison-title">
        <p className="text-xs font-semibold text-primary">Comparison mode</p><h2 id="comparison-title" className="mt-1 text-xl font-bold">Methods on the same axes</h2>
        <div className="mt-5 overflow-x-auto"><table className="chapter-comparison"><thead><tr><th>Method</th><th>Learns from</th><th>Strength</th><th>Watch for</th></tr></thead><tbody>{chapter.comparison.map((row) => <tr key={row.method}><th scope="row">{row.method}</th><td>{row.learnsFrom}</td><td>{row.strength}</td><td>{row.watchFor}</td></tr>)}</tbody></table></div>
      </section>
    </>
  );
}
