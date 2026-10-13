import type { Language } from "@/content/bilingual-course";
import { PANORAMA_EN } from "@/content/panorama/en";
import { PANORAMA_ZH } from "@/content/panorama/zh";
import type { PanoramaArticle } from "@/content/panorama/types";

export const PANORAMA_ARTICLES: Readonly<Record<Language, PanoramaArticle>> = {
  en: PANORAMA_EN,
  zh: PANORAMA_ZH,
};

export function getPanoramaArticle(language: Language): PanoramaArticle {
  return PANORAMA_ARTICLES[language];
}
