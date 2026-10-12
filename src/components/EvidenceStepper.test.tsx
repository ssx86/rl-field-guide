import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EvidenceStepper } from "@/components/EvidenceStepper";

describe("EvidenceStepper", () => {
  it("reveals one causal step at a time and can reset", async () => {
    const user = userEvent.setup();
    render(
      <EvidenceStepper
        title="Preference pair"
        setup="Compare two answers"
        steps={["Score A", "Score B"]}
        result="A becomes more likely"
        stepLabel="Run the next step"
        resetLabel="Reset"
        resultLabel="Result:"
      />,
    );

    expect(screen.queryByText("Score A")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /run the next step/i }));
    expect(screen.getByText("Score A")).toBeInTheDocument();
    expect(screen.queryByText("Score B")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /run the next step/i }));
    expect(screen.getByText("Score B")).toBeInTheDocument();
    expect(screen.getByText("A becomes more likely")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(screen.queryByText("Score A")).not.toBeInTheDocument();
  });
});
