import { useState } from "react";
import { ArrowCounterClockwise, ArrowLeft, Play, Sparkle } from "@phosphor-icons/react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { CorridorExperiment } from "@/components/corridor-experiment";
import { EvidencePanel } from "@/components/evidence-panel";
import { ExplanationLens } from "@/components/explanation-lens";
import { LessonRoute } from "@/components/lesson-route";
import { MethodTabs, type LessonMethod } from "@/components/method-tabs";
import { PredictionPanel } from "@/components/prediction-panel";
import {
  createInitialValues,
  orderedBackwardPass,
  qLearningEpisode,
  synchronousBellmanSweep,
  type PlanningResult,
} from "@/domain/planning";
import type { Theme } from "@/hooks/use-theme";

interface LessonScreenProps {
  readonly theme: Theme;
  readonly onToggleTheme: () => void;
  readonly onOpenHome: () => void;
}

const METHOD_COPY: Record<LessonMethod, { readonly action: string; readonly summary: string }> = {
  synchronous: {
    action: "Run one sweep",
    summary: "All states read the same old table, so new information moves one dependency per sweep.",
  },
  ordered: {
    action: "Solve in one pass",
    summary: "The acyclic dependency order lets each backup use the value calculated immediately before it.",
  },
  sampled: {
    action: "Run one episode",
    summary: "The agent follows the corridor and updates from sampled transitions instead of using the full model.",
  },
};

export function LessonScreen({ theme, onToggleTheme, onOpenHome }: LessonScreenProps) {
  const [method, setMethod] = useState<LessonMethod>("synchronous");
  const [values, setValues] = useState(createInitialValues);
  const [pass, setPass] = useState(0);
  const [lastResult, setLastResult] = useState<PlanningResult>();
  const [selectedState, setSelectedState] = useState(5);
  const [prediction, setPrediction] = useState<string>();
  const [predictionLocked, setPredictionLocked] = useState(false);

  const changeMethod = (nextMethod: LessonMethod) => {
    setMethod(nextMethod);
    setValues(createInitialValues());
    setPass(0);
    setLastResult(undefined);
    setSelectedState(5);
  };

  const run = () => {
    const result = method === "synchronous"
      ? synchronousBellmanSweep(values)
      : method === "ordered"
        ? orderedBackwardPass(values)
        : qLearningEpisode(values, { alpha: 1, gamma: 0.9 });
    setValues(result.values);
    setLastResult(result);
    setPass((current) => current + 1);
    setSelectedState(method === "ordered" ? 0 : 5);
  };

  const reset = () => {
    setValues(createInitialValues());
    setPass(0);
    setLastResult(undefined);
    setSelectedState(5);
  };

  const selectedTrace = lastResult?.traces[selectedState];
  const resultStatement = method === "ordered" && pass > 0
    ? "One dependency-ordered pass solved all six non-terminal states."
    : method === "synchronous" && pass > 0
      ? "The goal reward moves through one additional predecessor on each synchronous sweep."
      : method === "sampled" && pass > 0
        ? "One sampled episode updated each visited state once. Earlier states need later episodes to inherit the goal reward."
        : METHOD_COPY[method].summary;

  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <AppHeader theme={theme} onToggleTheme={onToggleTheme} onOpenHome={onOpenHome} context="When the Model Is Known" />

      <div className="mx-auto max-w-[1680px]">
        <div className="lesson-heading">
          <Button variant="ghost" size="sm" onClick={onOpenHome}><ArrowLeft size={16} /> Learn map</Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-[-0.025em] sm:text-3xl">Planning Is Not Training</h1>
              <span className="rounded-control bg-accent px-2.5 py-1 text-[11px] font-semibold text-primary">Lesson 1 of 8</span>
            </div>
            <p className="mt-2 max-w-[72ch] text-sm leading-6 text-muted-foreground">
              <span className="mr-1 font-semibold text-foreground">A reward appears at the goal.</span>
              <span>Predict how it travels, then compare three ways to use the same environment.</span>
            </p>
          </div>
        </div>

        <div className="lesson-layout">
          <LessonRoute />

          <div className="min-w-0 space-y-4 px-4 py-5 sm:px-6 lg:px-8">
            <PredictionPanel choice={prediction} locked={predictionLocked} onChoose={setPrediction} onLock={() => setPredictionLocked(true)} />

            <section className="experiment-panel" aria-labelledby="experiment-title">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
                <div><p className="text-xs font-semibold text-primary">Known deterministic corridor</p><h2 id="experiment-title" className="mt-1 text-lg font-bold">Watch value move backward</h2></div>
                <span className="pass-label">{pass === 0 ? "Ready" : `Pass ${pass}`}</span>
              </div>
              <div className="p-4 sm:p-5">
                <MethodTabs value={method} onChange={changeMethod} />
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{METHOD_COPY[method].summary}</p>
                <CorridorExperiment values={values} changedStates={lastResult?.changedStates ?? []} selectedState={selectedState} onSelectState={setSelectedState} />
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                  <Button disabled={!predictionLocked} onClick={run}><Play size={16} weight="fill" />{METHOD_COPY[method].action}</Button>
                  <Button variant="secondary" onClick={reset}><ArrowCounterClockwise size={16} />Reset values</Button>
                  <p className="min-w-[220px] flex-1 text-xs leading-5 text-muted-foreground" aria-live="polite">{resultStatement}</p>
                </div>
              </div>
            </section>

            <section className="insight-strip">
              <Sparkle size={20} weight="fill" className="shrink-0 text-primary" />
              <div><h2 className="text-sm font-bold">The distinction to keep</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Planning uses transitions you already know. Model-free learning estimates from transitions you had to experience.</p></div>
            </section>

            <ExplanationLens trace={selectedTrace} gamma={0.9} />
          </div>

          <EvidencePanel trace={selectedTrace} pass={pass} />
        </div>
      </div>
    </main>
  );
}
