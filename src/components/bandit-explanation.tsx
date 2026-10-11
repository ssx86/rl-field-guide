import * as Tabs from "@radix-ui/react-tabs";
import { Formula } from "@/components/formula";
import type { BanditDecisionTrace } from "@/domain/bandits";

interface BanditExplanationProps {
  readonly trace?: BanditDecisionTrace;
}

export function BanditExplanation({ trace }: BanditExplanationProps) {
  return (
    <section className="explanation-lens" aria-labelledby="bandit-explanation-title">
      <Tabs.Root defaultValue="numbers">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-semibold text-primary">Explanation lens</p><h2 id="bandit-explanation-title" className="mt-1 text-lg font-bold">What did the new reward change?</h2></div>
          <Tabs.List className="lens-tabs" aria-label="Bandit explanation format">
            <Tabs.Trigger value="numbers">Numbers</Tabs.Trigger>
            <Tabs.Trigger value="symbols">Symbols</Tabs.Trigger>
            <Tabs.Trigger value="plain">Plain English</Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="numbers" forceMount className="lens-panel mt-5 min-h-24">
          {trace ? (
            <div className="space-y-2 font-mono text-sm">
              <p className="text-xs text-muted-foreground">sample-average update</p>
              <p className="border-l-3 border-primary px-4 py-3 text-base font-bold">{trace.oldEstimate} + ({trace.reward} - {trace.oldEstimate}) / {trace.newPulls} = {trace.newEstimate}</p>
            </div>
          ) : <QuietEvidence />}
        </Tabs.Content>
        <Tabs.Content value="symbols" forceMount className="lens-panel mt-5 min-h-24">
          {trace ? (
            <div className="grid gap-3 lg:grid-cols-2">
              <Formula expression="Q_{n+1}(a) \leftarrow Q_n(a) + \frac{R_n-Q_n(a)}{N_{n+1}(a)}" label="Incremental sample-average action-value update" />
              <Formula expression="\operatorname{UCB}(a)=Q(a)+c\sqrt{\frac{\ln t}{N(a)}}" label="Upper confidence bound action score" />
            </div>
          ) : <QuietEvidence />}
        </Tabs.Content>
        <Tabs.Content value="plain" forceMount className="lens-panel mt-5 min-h-24">
          {trace ? <p className="max-w-[68ch] text-sm leading-7 text-muted-foreground">One surprising reward should move an estimate, not replace the history. UCB also asks how much evidence supports each estimate, so a high number based on one pull does not end the investigation.</p> : <QuietEvidence />}
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}

function QuietEvidence() {
  return <p className="text-sm leading-6 text-muted-foreground">The update stays hidden until a strategy produces one new observation.</p>;
}
