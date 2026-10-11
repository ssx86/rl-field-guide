import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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
    expect(screen.getByRole("button", { name: "State S5, value 10" })).toBeInTheDocument();
    expect(screen.getByText("Terminal transitions stop here. No bootstrap is added.")).toBeInTheDocument();
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
    expect(within(notebook).getByText("2 / 4")).toBeInTheDocument();
    expect(within(notebook).getByText("Predictions checked").nextSibling).toHaveTextContent("1");
    expect(within(notebook).getByText("Formulas used with numbers").nextSibling).toHaveTextContent("1");
  });
});
