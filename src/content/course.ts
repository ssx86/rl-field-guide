import type { LessonId } from "@/domain/course-progress";

export interface CourseTopic {
  readonly title: string;
  readonly status: "available" | "planned";
  readonly lessonId?: LessonId;
}

export interface CourseGroup {
  readonly label: string;
  readonly topics: readonly CourseTopic[];
}

export const COURSE_GROUPS: readonly CourseGroup[] = [
  {
    label: "Foundations",
    topics: [
      { title: "Start Here", status: "available" },
      { title: "Decisions Under Uncertainty", status: "available", lessonId: "bandits" },
      { title: "When the Model Is Known", status: "available", lessonId: "planning" },
    ],
  },
  {
    label: "Learning from experience",
    topics: [
      { title: "Complete Returns", status: "planned", lessonId: "returns" },
      { title: "TD Learning", status: "planned", lessonId: "td-control" },
      { title: "Deep Value Methods", status: "planned" },
    ],
  },
  {
    label: "Learning behavior",
    topics: [
      { title: "Policy Learning", status: "planned" },
      { title: "Continuous Control", status: "planned" },
      { title: "Model-Based RL", status: "planned" },
    ],
  },
  {
    label: "Practice",
    topics: [
      { title: "Modern Practice", status: "planned" },
      { title: "Challenge Lab", status: "planned" },
      { title: "Formula Atlas", status: "planned" },
    ],
  },
] as const;

export const LEARNING_STAGES = [
  { label: "See a problem", note: "Begin with a situation that can fail." },
  { label: "Make a prediction", note: "Commit before the system reveals the result." },
  { label: "Run one step", note: "Change one thing and keep the evidence visible." },
  { label: "Explain the evidence", note: "Name the idea only after observing it." },
] as const;
