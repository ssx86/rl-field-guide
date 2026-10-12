import type { ChapterArticle } from "@/content/chapter-article";
import { PART_ONE_ARTICLES } from "@/content/chapters/part-1";
import { PART_TWO_ARTICLES } from "@/content/chapters/part-2";
import { PART_THREE_ARTICLES } from "@/content/chapters/part-3";
import { PART_FOUR_ARTICLES } from "@/content/chapters/part-4";
import { PART_FIVE_ARTICLES } from "@/content/chapters/part-5";
import { PART_SIX_ARTICLES } from "@/content/chapters/part-6";
import { PART_SEVEN_ARTICLES } from "@/content/chapters/part-7";
import { PART_EIGHT_ARTICLES } from "@/content/chapters/part-8";
import { PART_NINE_ARTICLES } from "@/content/chapters/part-9";

export const CHAPTER_ARTICLES: readonly ChapterArticle[] = [
  ...PART_ONE_ARTICLES,
  ...PART_TWO_ARTICLES,
  ...PART_THREE_ARTICLES,
  ...PART_FOUR_ARTICLES,
  ...PART_FIVE_ARTICLES,
  ...PART_SIX_ARTICLES,
  ...PART_SEVEN_ARTICLES,
  ...PART_EIGHT_ARTICLES,
  ...PART_NINE_ARTICLES,
];

const bySlug = new Map(CHAPTER_ARTICLES.map((chapter) => [chapter.slug, chapter]));

export function getChapterArticle(slug: string): ChapterArticle {
  const article = bySlug.get(slug);
  if (!article) throw new Error(`Missing chapter article: ${slug}`);
  return article;
}
