import katex from "katex";
import "katex/dist/katex.min.css";
import { useMemo } from "react";

interface FormulaProps {
  readonly expression: string;
  readonly label: string;
}

export function Formula({ expression, label }: FormulaProps) {
  const markup = useMemo(
    () => katex.renderToString(expression, { throwOnError: true, displayMode: true }),
    [expression],
  );

  return <div className="formula" role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: markup }} />;
}
