function round(value: number): number {
  return Number(value.toFixed(2));
}

function validateRate(value: number, name: string): void {
  if (value < 0 || value > 1) throw new RangeError(`${name} must be between zero and one`);
}

export function discountedReturn(rewards: readonly number[], gamma: number): number {
  validateRate(gamma, "gamma");
  return round(rewards.reduce((total, reward, index) => total + gamma ** index * reward, 0));
}

export interface MonteCarloTrace {
  readonly oldValue: number;
  readonly observedReturn: number;
  readonly error: number;
  readonly newValue: number;
}

export function monteCarloUpdate(oldValue: number, observedReturn: number, alpha: number): MonteCarloTrace {
  validateRate(alpha, "alpha");
  const error = round(observedReturn - oldValue);
  return { oldValue, observedReturn, error, newValue: round(oldValue + alpha * error) };
}

export interface TdZeroInput {
  readonly oldValue: number;
  readonly reward: number;
  readonly nextValue: number;
  readonly gamma: number;
  readonly alpha: number;
  readonly terminal?: boolean;
}

export interface TdZeroTrace extends Omit<TdZeroInput, "terminal"> {
  readonly target: number;
  readonly error: number;
  readonly newValue: number;
  readonly terminal: boolean;
}

export function tdZeroUpdate(input: TdZeroInput): TdZeroTrace {
  validateRate(input.gamma, "gamma");
  validateRate(input.alpha, "alpha");
  const terminal = input.terminal ?? false;
  const target = round(input.reward + (terminal ? 0 : input.gamma * input.nextValue));
  const error = round(target - input.oldValue);
  return { ...input, terminal, target, error, newValue: round(input.oldValue + input.alpha * error) };
}

export function nStepReturn(rewards: readonly number[], bootstrapValue: number, gamma: number): number {
  validateRate(gamma, "gamma");
  return round(discountedReturn(rewards, gamma) + gamma ** rewards.length * bootstrapValue);
}

export function importanceSamplingWeight(
  targetProbabilities: readonly number[],
  behaviorProbabilities: readonly number[],
): number {
  if (targetProbabilities.length === 0 || targetProbabilities.length !== behaviorProbabilities.length) {
    throw new RangeError("Target and behavior probability sequences must have the same non-zero length");
  }
  const weight = targetProbabilities.reduce((product, target, index) => {
    const behavior = behaviorProbabilities[index];
    if (target < 0 || target > 1 || behavior <= 0 || behavior > 1) throw new RangeError("Probabilities are outside their valid range");
    return product * (target / behavior);
  }, 1);
  return round(weight);
}
