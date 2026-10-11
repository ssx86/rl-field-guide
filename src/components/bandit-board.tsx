import * as Tabs from "@radix-ui/react-tabs";
import { ArrowsLeftRight, Play } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  INITIAL_BANDIT_ARMS,
  runBanditDecision,
  ucbScore,
  type BanditDecisionTrace,
  type BanditStrategy,
} from "@/domain/bandits";

interface BanditBoardProps {
  readonly strategy: BanditStrategy;
  readonly trace?: BanditDecisionTrace;
  readonly predictionLocked: boolean;
  readonly comparisonVisible: boolean;
  readonly onChangeStrategy: (strategy: BanditStrategy) => void;
  readonly onRun: () => void;
  readonly onCompare: () => void;
}

export function BanditBoard({ strategy, trace, predictionLocked, comparisonVisible, onChangeStrategy, onRun, onCompare }: BanditBoardProps) {
  const totalPulls = INITIAL_BANDIT_ARMS.reduce((sum, arm) => sum + arm.pulls, 0);
  const epsilonTrace = runBanditDecision("epsilon-greedy");
  const ucbTrace = runBanditDecision("ucb");
  const displayedArms = trace?.updatedArms ?? INITIAL_BANDIT_ARMS;

  return (
    <section className="experiment-panel" aria-labelledby="bandit-board-title">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
        <div><p className="text-xs font-semibold text-primary">Three treatment arms</p><h2 id="bandit-board-title" className="mt-1 text-lg font-bold">Make uncertainty visible</h2></div>
        <span className="pass-label">{trace ? "1 new observation" : "5 observations so far"}</span>
      </div>

      <div className="p-4 sm:p-5">
        <Tabs.Root value={strategy} onValueChange={(value) => onChangeStrategy(value as BanditStrategy)}>
          <Tabs.List className="bandit-strategy-tabs" aria-label="Bandit strategy">
            <Tabs.Trigger value="epsilon-greedy">ε-greedy</Tabs.Trigger>
            <Tabs.Trigger value="ucb">UCB</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="epsilon-greedy" forceMount className="method-summary mt-3 text-xs leading-5 text-muted-foreground">
            With ε = 0.10 and a fixed roll of 0.42, this step exploits the largest current estimate.
          </Tabs.Content>
          <Tabs.Content value="ucb" forceMount className="method-summary mt-3 text-xs leading-5 text-muted-foreground">
            UCB adds an uncertainty bonus. An untried arm receives priority before estimates are compared fairly.
          </Tabs.Content>
        </Tabs.Root>

        <div className="mt-5 overflow-x-auto">
          <table className="bandit-table">
            <caption className="sr-only">Observed reward estimates for three treatment arms</caption>
            <thead><tr><th>Arm</th><th>Pulls</th><th>Estimate</th><th>{strategy === "ucb" ? "UCB score" : "Greedy score"}</th><th>Evidence</th></tr></thead>
            <tbody>
              {displayedArms.map((arm, index) => {
                const chosen = trace?.chosenArm.name === arm.name;
                const estimate = arm.estimate;
                const score = strategy === "ucb"
                  ? trace?.updatedScores[index] ?? ucbScore(arm.estimate, totalPulls, arm.pulls)
                  : arm.estimate;
                return (
                  <tr key={arm.name} data-chosen={chosen}>
                    <th scope="row">{arm.name}</th>
                    <td>{arm.pulls}</td>
                    <td className="font-mono font-bold">{estimate}</td>
                    <td className="font-mono">{Number.isFinite(score) ? score : "∞"}</td>
                    <td>
                      <div className="arm-meter" aria-label={`${arm.name} estimate ${estimate}`}><span data-level={String(Math.round(estimate))} /></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {comparisonVisible ? (
          <div className="bandit-comparison" aria-live="polite">
            <div><span>ε-greedy</span><strong>{epsilonTrace.chosenArm.name}</strong><small>current estimate wins</small></div>
            <ArrowsLeftRight size={20} aria-hidden="true" />
            <div><span>UCB</span><strong>{ucbTrace.chosenArm.name}</strong><small>uncertainty is investigated</small></div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4">
          <Button disabled={!predictionLocked} onClick={onRun}><Play size={16} weight="fill" /> Run one decision</Button>
          <Button variant="secondary" onClick={onCompare}><ArrowsLeftRight size={16} /> Compare decisions</Button>
        </div>
      </div>
    </section>
  );
}
