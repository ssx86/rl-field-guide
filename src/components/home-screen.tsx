import {
  ArrowRight,
  CheckCircle,
  CirclesThreePlus,
  CompassTool,
  Function as FunctionIcon,
  Path,
} from "@phosphor-icons/react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { COURSE_GROUPS, LEARNING_STAGES } from "@/content/course";
import type { Theme } from "@/hooks/use-theme";

interface HomeScreenProps {
  readonly theme: Theme;
  readonly progress: { readonly prediction: boolean; readonly numericEvidence: boolean };
  readonly onToggleTheme: () => void;
  readonly onBegin: () => void;
}

export function HomeScreen({ theme, progress, onToggleTheme, onBegin }: HomeScreenProps) {
  const progressCount = Number(progress.prediction) + Number(progress.numericEvidence);
  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <AppHeader theme={theme} onToggleTheme={onToggleTheme} onOpenHome={() => undefined} />

      <div className="mx-auto grid max-w-[1680px] lg:grid-cols-[240px_minmax(0,1fr)_300px]">
        <aside className="hidden border-r border-border px-5 py-8 lg:block" aria-label="Course route">
          <p className="mb-6 text-xs font-semibold text-muted-foreground">Your route</p>
          <nav className="space-y-6">
            {COURSE_GROUPS.map((group) => (
              <section key={group.label}>
                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{group.label}</h2>
                <div className="space-y-1">
                  {group.topics.map((topic) => topic.title === "Start Here" ? (
                    <div key={topic.title} aria-current="page" className="flex w-full items-center justify-between rounded-control bg-card px-2.5 py-2 text-xs font-semibold text-foreground">
                      <span>{topic.title}</span><span className="text-primary">Here</span>
                    </div>
                  ) : (
                    <button key={topic.title} disabled={topic.status === "planned"} onClick={topic.title === "When the Model Is Known" ? onBegin : undefined} className="flex w-full items-center justify-between rounded-control px-2.5 py-2 text-left text-xs font-medium text-muted-foreground transition-colors enabled:hover:bg-accent enabled:hover:text-foreground disabled:opacity-55">
                      <span>{topic.title}</span>{topic.status === "available" ? <span className="text-primary">Open</span> : null}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 px-4 py-10 sm:px-8 lg:px-10 lg:py-12">
          <div className="max-w-[760px]">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">
              <CompassTool size={17} aria-hidden="true" />
              An interactive learning atlas
            </p>
            <h1 className="max-w-[680px] text-4xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Learn reinforcement learning by making it change.
            </h1>
            <p className="mt-5 max-w-[58ch] text-base leading-7 text-muted-foreground">
              Predict first. Run the system. Inspect what changed. Use the formula only when the evidence needs a name.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={onBegin}>
                Begin the experiment <ArrowRight size={17} weight="bold" />
              </Button>
              <Button variant="secondary" onClick={() => document.getElementById("learning-loop")?.scrollIntoView()}>
                See the learning loop
              </Button>
            </div>
          </div>

          <section className="mt-12 overflow-hidden rounded-panel border border-border bg-card shadow-main">
            <div className="grid gap-px bg-border md:grid-cols-[1.2fr_0.8fr]">
              <div className="bg-card p-5 sm:p-7">
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">What information do you already have?</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">That answer decides whether you should plan, estimate, or learn from samples.</p>
                  </div>
                  <CirclesThreePlus className="shrink-0 text-primary" size={28} />
                </div>
                <div className="concept-map" aria-label="Method selection map">
                  <div className="concept-node concept-root">Environment</div>
                  <div className="concept-branch" aria-hidden="true" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="concept-node concept-active"><CheckCircle size={16} /> Full model known</div>
                    <div className="concept-node"><Path size={16} /> Samples only</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="concept-result">Plan with Bellman backups</div>
                    <div className="concept-result">Learn from experience</div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-subtle p-5 sm:p-7">
                <FunctionIcon className="text-primary" size={24} />
                <h2 className="mt-5 text-lg font-bold">Recommended next</h2>
                <p className="mt-2 text-2xl font-bold leading-tight tracking-tight">Planning Is Not Training</p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">Use one known corridor to compare an ordered calculation, parallel sweeps, and sampled Q-learning.</p>
                <Button className="mt-6 w-full" variant="secondary" onClick={onBegin}>Open lesson</Button>
              </div>
            </div>
          </section>

          <section id="learning-loop" className="mt-12 scroll-mt-6">
            <h2 className="text-2xl font-bold tracking-tight">A lesson is a causal loop</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {LEARNING_STAGES.map((stage, index) => (
                <article key={stage.label} className="learning-stage">
                  <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3 className="font-bold">{stage.label}</h3><p>{stage.note}</p></div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="border-t border-border bg-surface-subtle px-5 py-8 lg:border-l lg:border-t-0" aria-label="Evidence notebook">
          <div className="sticky top-6">
            <div className="flex items-center justify-between"><h2 className="text-sm font-bold">Evidence notebook</h2><span className="font-mono text-xs text-muted-foreground">{progressCount} / 4</span></div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Progress records explanations and transfer, not scrolling.</p>
            <div className="mt-6 space-y-4">
              <NotebookRow label="Predictions checked" value={progress.prediction ? "1" : "0"} />
              <NotebookRow label="Misconceptions corrected" value="0" />
              <NotebookRow label="Formulas used with numbers" value={progress.numericEvidence ? "1" : "0"} />
              <NotebookRow label="Transfer challenges passed" value="0" />
            </div>
            <div className="mt-8 rounded-panel border border-amber-border bg-accent p-4">
              <p className="text-xs font-bold text-primary">First question</p>
              <p className="mt-2 text-sm font-semibold leading-6">If every transition is known, what is left to learn?</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function NotebookRow({ label, value }: { readonly label: string; readonly value: string }) {
  return <div className="flex items-center justify-between gap-4 text-xs"><span className="text-muted-foreground">{label}</span><span className="font-mono font-bold">{value}</span></div>;
}
