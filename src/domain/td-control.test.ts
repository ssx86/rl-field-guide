import { describe, expect, it } from "vitest";
import { controlUpdate, type ControlMethod } from "@/domain/td-control";

describe("tabular TD control updates", () => {
  const expected = {
    sarsa: { bootstrap: 4, target: 2.6, newValue: 2.3, policy: "on-policy" },
    "expected-sarsa": { bootstrap: 6.7, target: 5.03, newValue: 3.52, policy: "on-policy" },
    "q-learning": { bootstrap: 7, target: 5.3, newValue: 3.65, policy: "off-policy" },
    "double-q": { bootstrap: 3, target: 1.7, newValue: 1.85, policy: "off-policy" },
  } as const satisfies Record<ControlMethod, object>;

  for (const method of Object.keys(expected) as ControlMethod[]) {
    it(`calculates the displayed ${method} target from its stated policy`, () => {
      expect(controlUpdate(method)).toMatchObject(expected[method]);
    });
  }

  it("uses reward alone for terminal control updates", () => {
    const trace = controlUpdate("q-learning", { terminal: true, reward: -100 });
    expect(trace.target).toBe(-100);
    expect(trace.bootstrap).toBe(0);
  });
});
