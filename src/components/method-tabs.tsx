import * as Tabs from "@radix-ui/react-tabs";
import { Calculator, Repeat, WaveSawtooth } from "@phosphor-icons/react";

export type LessonMethod = "synchronous" | "ordered" | "sampled";

interface MethodTabsProps {
  readonly value: LessonMethod;
  readonly onChange: (method: LessonMethod) => void;
}

const METHODS = [
  { id: "synchronous", label: "Synchronous sweeps", icon: Repeat },
  { id: "ordered", label: "Ordered backward pass", icon: Calculator },
  { id: "sampled", label: "Sampled Q-learning", icon: WaveSawtooth },
] as const;

export function MethodTabs({ value, onChange }: MethodTabsProps) {
  return (
    <Tabs.Root value={value} onValueChange={(next) => onChange(next as LessonMethod)}>
      <Tabs.List className="method-tabs" aria-label="Solution method">
        {METHODS.map((method) => {
          const Icon = method.icon;
          return (
            <Tabs.Trigger key={method.id} value={method.id} className="method-tab">
              <Icon size={16} aria-hidden="true" />
              {method.label}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
    </Tabs.Root>
  );
}
