export const CORRIDOR_STATE_COUNT = 7;
export const TERMINAL_STATE = CORRIDOR_STATE_COUNT - 1;
export const DEFAULT_GAMMA = 0.9;

export interface PlanningResult {
  readonly values: number[];
  readonly changedStates: number[];
  readonly backups: number;
}

export interface QLearningOptions {
  readonly alpha: number;
  readonly gamma: number;
}

export function createInitialValues(): number[] {
  return Array.from({ length: CORRIDOR_STATE_COUNT }, () => 0);
}

function transitionReward(state: number): number {
  return state + 1 === TERMINAL_STATE ? 10 : -1;
}

function roundForDisplay(value: number): number {
  return Number(value.toFixed(2));
}

function bellmanBackup(state: number, source: readonly number[], gamma: number): number {
  const nextState = state + 1;
  const reward = transitionReward(state);
  return roundForDisplay(nextState === TERMINAL_STATE ? reward : reward + gamma * source[nextState]);
}

export function synchronousBellmanSweep(
  currentValues: readonly number[],
  gamma = DEFAULT_GAMMA,
): PlanningResult {
  const values = [...currentValues];
  const changedStates: number[] = [];

  for (let state = 0; state < TERMINAL_STATE; state += 1) {
    const nextValue = bellmanBackup(state, currentValues, gamma);
    values[state] = nextValue;
    if (nextValue !== currentValues[state]) changedStates.push(state);
  }

  values[TERMINAL_STATE] = 0;
  return { values, changedStates, backups: TERMINAL_STATE };
}

export function orderedBackwardPass(
  currentValues: readonly number[],
  gamma = DEFAULT_GAMMA,
): PlanningResult {
  const values = [...currentValues];
  const changedStates: number[] = [];

  for (let state = TERMINAL_STATE - 1; state >= 0; state -= 1) {
    const nextValue = bellmanBackup(state, values, gamma);
    values[state] = nextValue;
    if (nextValue !== currentValues[state]) changedStates.push(state);
  }

  values[TERMINAL_STATE] = 0;
  return { values, changedStates, backups: TERMINAL_STATE };
}

export function qLearningEpisode(
  currentValues: readonly number[],
  options: QLearningOptions,
): PlanningResult {
  const values = [...currentValues];
  const changedStates: number[] = [];

  for (let state = 0; state < TERMINAL_STATE; state += 1) {
    const nextState = state + 1;
    const reward = transitionReward(state);
    const target = nextState === TERMINAL_STATE ? reward : reward + options.gamma * values[nextState];
    const nextValue = roundForDisplay(values[state] + options.alpha * (target - values[state]));
    values[state] = nextValue;
    if (nextValue !== currentValues[state]) changedStates.push(state);
  }

  values[TERMINAL_STATE] = 0;
  return { values, changedStates, backups: TERMINAL_STATE };
}

export function valueForState(values: readonly number[], state: number): number {
  if (!Number.isInteger(state) || state < 0 || state >= values.length) {
    throw new RangeError(`State ${state} is outside the corridor.`);
  }
  return values[state];
}
