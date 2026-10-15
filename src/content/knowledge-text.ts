import { KNOWLEDGE_TERMS, type KnowledgeLanguage, type KnowledgeTerm } from "@/content/knowledge-graph";

export type KnowledgeSegment =
  | { readonly kind: "text"; readonly text: string }
  | { readonly kind: "term"; readonly text: string; readonly termId: string }
  | { readonly kind: "chapter-link"; readonly text: string; readonly slug: string };

interface Match {
  readonly index: number;
  readonly alias: string;
  readonly term: KnowledgeTerm;
}

const CHAPTER_LINK_PATTERN = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;

function isAsciiWordCharacter(value: string | undefined): boolean {
  return Boolean(value && /[A-Za-z0-9]/.test(value));
}

function findAlias(source: string, alias: string, from: number): number {
  const lowerSource = source.toLocaleLowerCase("en");
  const lowerAlias = alias.toLocaleLowerCase("en");
  let cursor = from;
  while (cursor < source.length) {
    const index = lowerSource.indexOf(lowerAlias, cursor);
    if (index < 0) return -1;
    const startsWithWord = isAsciiWordCharacter(alias[0]);
    const endsWithWord = isAsciiWordCharacter(alias.at(-1));
    const beforeOkay = !startsWithWord || !isAsciiWordCharacter(source[index - 1]);
    const afterOkay = !endsWithWord || !isAsciiWordCharacter(source[index + alias.length]);
    if (beforeOkay && afterOkay) return index;
    cursor = index + Math.max(alias.length, 1);
  }
  return -1;
}

function candidatesFor(language: KnowledgeLanguage): readonly { readonly term: KnowledgeTerm; readonly alias: string }[] {
  return KNOWLEDGE_TERMS.flatMap((term) => term.aliases[language].map((alias) => ({ term, alias })))
    .sort((left, right) => right.alias.length - left.alias.length);
}

function annotatePlainText(
  text: string,
  language: KnowledgeLanguage,
  seen: Set<string>,
): KnowledgeSegment[] {
  const segments: KnowledgeSegment[] = [];
  const candidates = candidatesFor(language);
  let cursor = 0;

  while (cursor < text.length) {
    let next: Match | undefined;
    for (const candidate of candidates) {
      if (seen.has(candidate.term.id)) continue;
      const index = findAlias(text, candidate.alias, cursor);
      if (index < 0) continue;
      if (!next || index < next.index || (index === next.index && candidate.alias.length > next.alias.length)) {
        next = { index, alias: candidate.alias, term: candidate.term };
      }
    }

    if (!next) {
      segments.push({ kind: "text", text: text.slice(cursor) });
      break;
    }

    if (next.index > cursor) segments.push({ kind: "text", text: text.slice(cursor, next.index) });
    segments.push({ kind: "term", text: text.slice(next.index, next.index + next.alias.length), termId: next.term.id });
    seen.add(next.term.id);
    cursor = next.index + next.alias.length;
  }

  return segments.filter((segment) => segment.text.length > 0);
}

export function createKnowledgeAnnotator(language: KnowledgeLanguage) {
  const seenByScope = new Map<string, Set<string>>();

  return (text: string, scope = "article"): readonly KnowledgeSegment[] => {
    const seen = seenByScope.get(scope) ?? new Set<string>();
    seenByScope.set(scope, seen);
    const segments: KnowledgeSegment[] = [];
    let cursor = 0;

    for (const match of text.matchAll(CHAPTER_LINK_PATTERN)) {
      const index = match.index ?? 0;
      if (index > cursor) segments.push(...annotatePlainText(text.slice(cursor, index), language, seen));
      segments.push({ kind: "chapter-link", text: match[1], slug: match[2] });
      cursor = index + match[0].length;
    }

    if (cursor < text.length) segments.push(...annotatePlainText(text.slice(cursor), language, seen));
    return segments;
  };
}
