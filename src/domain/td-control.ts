export type ControlMethod = "sarsa" | "expected-sarsa" | "q-learning" | "double-q";

export interface ControlUpdateOptions {
  readonly oldValue?: number;
  readonly reward?: number;
  readonly gamma?: number;
  readonly alpha?: number;
  readonly nextActionValues?: readonly [number, number];
  readonly epsilon?: number;
  readonly doubleEvaluatorValues?: readonly [number, number];
  readonly terminal?: boolean;
}

export interface ControlUpdateTrace {
  readonly method: ControlMethod;
  readonly policy: "on-policy" | "off-policy";
  readonly oldValue: number;
  readonly reward: number;
  readonly gamma: number;
  readonly alpha: number;
  readonly bootstrap: number;
  readonly target: number;
  readonly error: number;
  readonly newValue: number;
  readonly terminal: boolean;
  readonly targetMeaning: string;
}

function round(value: number): number {
  return Math.round((value + 1e-10) * 100) / 100;
}

function argmax(values: readonly number[]): number {
  return values.indexOf(Math.max(...values));
}

export function controlUpdate(method: ControlMethod, options: ControlUpdateOptions = {}): ControlUpdateTrace {
  const oldValue = options.oldValue ?? 2;
  const reward = options.reward ?? -1;
  const gamma = options.gamma ?? 0.9;
  const alpha = options.alpha ?? 0.5;
  const nextValues = options.nextActionValues ?? [4, 7];
  const epsilon = options.epsilon ?? 0.2;
  const evaluatorValues = options.doubleEvaluatorValues ?? [5, 3];
  const terminal = options.terminal ?? false;

  let bootstrap: number;
  let targetMeaning: string;
  let policy: "on-policy" | "off-policy";

  if (terminal) {
    bootstrap = 0;
    targetMeaning = "The transition terminates, so no next-action value is added.";
    policy = method === "sarsa" || method === "expected-sarsa" ? "on-policy" : "off-policy";
  } else if (method === "sarsa") {
    bootstrap = nextValues[0];
    targetMeaning = "Use the value of the next action the exploratory behavior actually selected.";
    policy = "on-policy";
  } else if (method === "expected-sarsa") {
    const greedy = argmax(nextValues);
    const exploratoryShare = epsilon / nextValues.length;
    bootstrap = round(nextValues.reduce((sum, value, index) => sum + value * (exploratoryShare + (index === greedy ? 1 - epsilon : 0)), 0));
    targetMeaning = "Average next-action values under the current epsilon-greedy behavior policy.";
    policy = "on-policy";
  } else if (method === "q-learning") {
    bootstrap = Math.max(...nextValues);
    targetMeaning = "Use the greedy next-action value even though behavior may still explore.";
    policy = "off-policy";
  } else {
    const selectedAction = argmax(nextValues);
    bootstrap = evaluatorValues[selectedAction];
    targetMeaning = "One table selects the action; the other evaluates it to reduce maximization bias.";
    policy = "off-policy";
  }

  const target = round(reward + gamma * bootstrap);
  const error = round(target - oldValue);
  const newValue = round(oldValue + alpha * error);

  return { method, policy, oldValue, reward, gamma, alpha, bootstrap, target, error, newValue, terminal, targetMeaning };
}
