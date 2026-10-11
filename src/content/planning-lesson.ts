export type LessonMethod = "synchronous" | "ordered" | "sampled";

export const METHOD_SUMMARIES: Record<LessonMethod, string> = {
  synchronous: "All states read the same old table, so new information moves one dependency per sweep.",
  ordered: "The acyclic dependency order lets each backup use the value calculated immediately before it.",
  sampled: "The agent follows the corridor and updates from sampled transitions instead of using the full model.",
};
