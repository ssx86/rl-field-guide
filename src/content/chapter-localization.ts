import type { ChapterArticle } from "@/content/chapter-article";
import { CHAPTER_ARTICLES } from "@/content/chapter-articles";
import { CURRICULUM } from "@/content/curriculum";
import type { Language } from "@/content/bilingual-course";
import { PART_ONE_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/part-1";
import { PART_TWO_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/part-2";
import { PART_THREE_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/part-3";
import { PART_FOUR_FIVE_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/part-4-5";
import { PART_SIX_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/part-6";
import { PART_SEVEN_EIGHT_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/part-7-8";
import { PART_NINE_CHINESE_MANUSCRIPTS } from "@/content/zh-manuscripts/part-9";
import { applyChineseManuscript, type ChineseManuscript } from "@/content/zh-manuscripts/types";

const AUTHORED_MANUSCRIPTS: Readonly<Record<string, ChineseManuscript>> = {
  ...PART_ONE_CHINESE_MANUSCRIPTS,
  ...PART_TWO_CHINESE_MANUSCRIPTS,
  ...PART_THREE_CHINESE_MANUSCRIPTS,
  ...PART_FOUR_FIVE_CHINESE_MANUSCRIPTS,
  ...PART_SIX_CHINESE_MANUSCRIPTS,
  ...PART_SEVEN_EIGHT_CHINESE_MANUSCRIPTS,
  ...PART_NINE_CHINESE_MANUSCRIPTS,
};

export const AUTHORED_CHINESE_SLUGS = Object.keys(AUTHORED_MANUSCRIPTS);

export const ZH_CHAPTER_ARTICLES: readonly ChapterArticle[] = CHAPTER_ARTICLES.map((english) => {
  const manuscript = AUTHORED_MANUSCRIPTS[english.slug];
  if (!manuscript) throw new Error(`Missing authored Chinese manuscript: ${english.slug}`);
  return applyChineseManuscript(english, manuscript);
});

const enBySlug = new Map(CHAPTER_ARTICLES.map((chapter) => [chapter.slug, chapter]));
const zhBySlug = new Map(ZH_CHAPTER_ARTICLES.map((chapter) => [chapter.slug, chapter]));

export function getLocalizedChapterArticle(language: Language, slug: string): ChapterArticle {
  const article = (language === "zh" ? zhBySlug : enBySlug).get(slug);
  if (!article) throw new Error(`Missing ${language} chapter article: ${slug}`);
  return article;
}

export function getChineseBrief(slug: string): { title: string; focus: string; situation: string; boundary: string } {
  const article = zhBySlug.get(slug);
  if (!article) throw new Error(`Missing Chinese chapter article: ${slug}`);
  return {
    title: article.title,
    focus: article.deck,
    situation: article.situation.paragraphs[0],
    boundary: article.boundary.paragraphs[0],
  };
}

if (AUTHORED_CHINESE_SLUGS.length !== CURRICULUM.length) {
  throw new Error(`Expected ${CURRICULUM.length} authored Chinese manuscripts, received ${AUTHORED_CHINESE_SLUGS.length}`);
}
