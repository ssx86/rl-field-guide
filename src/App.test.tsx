import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";

async function openAndUnlockLesson() {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Begin the experiment" }));
  await screen.findByRole("heading", { name: "Planning Is Not Training" });
  await user.click(screen.getByRole("radio", { name: "Only its immediate predecessor" }));
  await user.click(screen.getByRole("button", { name: "Lock prediction" }));
  return user;
}

describe("RL Field Guide", () => {
  beforeEach(() => localStorage.clear());

  it("moves from the learning map into an evidence-first lesson", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "Learn reinforcement learning by making it change." })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Begin the experiment" }));

    expect(await screen.findByRole("heading", { name: "Planning Is Not Training" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run one sweep" })).toBeDisabled();
    expect(screen.getByText("A reward appears at the goal.")).toBeInTheDocument();
  });

  it("requires a prediction before revealing one synchronous Bellman sweep", async () => {
    const user = await openAndUnlockLesson();

    expect(screen.getByText("Prediction locked")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Run one sweep" }));

    expect(screen.getByText("Pass 1")).toBeInTheDocument();
    const goalSignalState = screen.getByRole("button", { name: "State S5, value 10" });
    const stepCostOnlyState = screen.getByRole("button", { name: "State S4, value -1" });
    expect(goalSignalState).toHaveAttribute("data-signal", "true");
    expect(stepCostOnlyState).toHaveAttribute("data-signal", "false");
    expect(screen.getByText("Terminal transitions stop here. No bootstrap is added.")).toBeInTheDocument();
  });

  it("connects every solution and explanation tab to a real tab panel", async () => {
    const user = await openAndUnlockLesson();

    const orderedTab = screen.getByRole("tab", { name: "Ordered backward pass" });
    expect(document.getElementById(orderedTab.getAttribute("aria-controls") ?? "")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Run one sweep" }));
    const symbolsTab = screen.getByRole("tab", { name: "Symbols" });
    expect(document.getElementById(symbolsTab.getAttribute("aria-controls") ?? "")).toBeInTheDocument();
  });

  it("shows that dependency order can solve the acyclic known model in one pass", async () => {
    const user = await openAndUnlockLesson();

    await user.click(screen.getByRole("tab", { name: "Ordered backward pass" }));
    await user.click(screen.getByRole("button", { name: "Solve in one pass" }));

    expect(screen.getByRole("button", { name: "State S0, value 1.81" })).toBeInTheDocument();
    expect(screen.getByText("One dependency-ordered pass solved all six non-terminal states.")).toBeInTheDocument();
  });

  it("carries completed evidence back to the learning map", async () => {
    const user = await openAndUnlockLesson();

    await user.click(screen.getByRole("button", { name: "Run one sweep" }));
    await user.click(screen.getByRole("button", { name: /RL Field Guide/ }));

    const notebook = screen.getByRole("complementary", { name: "Evidence notebook" });
    expect(within(notebook).getByText("3 / 5")).toBeInTheDocument();
    expect(within(notebook).getByText("Predictions checked").nextSibling).toHaveTextContent("1");
    expect(within(notebook).getByText("Formulas used with numbers").nextSibling).toHaveTextContent("1");
  });

  it("turns an uncertain bandit choice into numeric evidence and a transfer check", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Decisions Under Uncertainty" }));
    expect(await screen.findByRole("heading", { name: "The Best-Looking Arm Can Be a Trap" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run one decision" })).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "Try the untested arm" }));
    await user.click(screen.getByRole("button", { name: "Lock prediction" }));
    await user.click(screen.getByRole("tab", { name: "UCB" }));
    await user.click(screen.getByRole("button", { name: "Run one decision" }));

    expect(screen.getByText("Untried C was selected")).toBeInTheDocument();
    expect(screen.getByText("0 + (4 - 0) / 1 = 4")).toBeInTheDocument();
    expect(screen.getByText("Instant regret").nextSibling).toHaveTextContent("0");
    expect(within(screen.getByRole("row", { name: /Untried C/ })).getByText("6.68")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "UCB adds an explicit uncertainty bonus" }));
    await user.click(screen.getByRole("button", { name: "Check transfer" }));
    expect(screen.getByText("Transfer passed")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "it guarantees the next reward will be larger" }));
    await user.click(screen.getByRole("button", { name: "Save reflection" }));
    expect(screen.getByText("Try again: exploration buys information, not a guaranteed reward.")).toBeInTheDocument();
  });

  it("opens the breadth-first deep value chapter from the complete learning map", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "Complete course map" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /from course map$/ })).toHaveLength(12);
    await user.click(screen.getByRole("button", { name: "Open Deep Value Methods from course map" }));
    expect(await screen.findByRole("heading", { name: "When a Table Stops Fitting" })).toBeInTheDocument();
    expect(screen.getByText("DQN stabilizes a moving regression problem with replay and a target network.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Worked examples" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Counterexample" })).toBeInTheDocument();
  });
});
