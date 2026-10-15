import type { Language } from "@/content/bilingual-course";

export const READING_MODES = ["en", "zh", "bilingual"] as const;
export type ReadingMode = (typeof READING_MODES)[number];

export const isLanguage = (mode: ReadingMode): mode is Language => mode !== "bilingual";

export function modePath(mode: ReadingMode, slug?: string): string {
  return slug ? `/${mode}/learn/${slug}/` : `/${mode}/`;
}

export function languageDestinations(slug?: string) {
  return READING_MODES.map((mode) => ({ mode, path: modePath(mode, slug) }));
}
