import { ArrowRight, FlagCheckered, MapPin } from "@phosphor-icons/react";

interface CorridorExperimentProps {
  readonly values: readonly number[];
  readonly changedStates: readonly number[];
  readonly signalStates: readonly number[];
  readonly selectedState: number;
  readonly onSelectState: (state: number) => void;
}

export function CorridorExperiment({ values, changedStates, signalStates, selectedState, onSelectState }: CorridorExperimentProps) {
  return (
    <figure className="corridor-figure" aria-labelledby="corridor-caption">
      <div className="corridor-grid">
        {values.map((value, state) => {
          const isGoal = state === values.length - 1;
          const changed = changedStates.includes(state);
          const receivedSignal = signalStates.includes(state);
          return (
            <div key={state} className="contents">
              <button
                className="corridor-cell"
                data-selected={selectedState === state}
                data-changed={changed}
                data-signal={receivedSignal}
                data-goal={isGoal}
                aria-pressed={selectedState === state}
                aria-label={`State S${state}, value ${value}`}
                onClick={() => onSelectState(state)}
              >
                <span className="corridor-state">S{state}</span>
                {state === 0 ? <MapPin size={18} weight="fill" aria-hidden="true" /> : null}
                {isGoal ? <FlagCheckered size={19} weight="fill" aria-hidden="true" /> : <span className="corridor-value">{value}</span>}
                <span className="corridor-note">{isGoal ? "goal" : receivedSignal ? "goal signal" : state === 0 ? "start" : changed ? "step cost" : "value"}</span>
              </button>
              {!isGoal ? <ArrowRight className="corridor-arrow" size={16} aria-hidden="true" /> : null}
            </div>
          );
        })}
      </div>
      <figcaption id="corridor-caption" className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>Every transition is deterministic and known.</span>
          <span className="corridor-legend"><i data-kind="cost" aria-hidden="true" /> updated by step cost</span>
          <span className="corridor-legend"><i data-kind="signal" aria-hidden="true" /> received goal signal</span>
        </span>
        <span className="font-mono">step -1 | goal +10 | gamma 0.9</span>
      </figcaption>
    </figure>
  );
}
