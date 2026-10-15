import { ArrowRight, BookOpenText, Graph } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  getKnowledgeConnections,
  KNOWLEDGE_TERMS_BY_ID,
  knowledgeTermHref,
  type KnowledgeTerm,
} from "@/content/knowledge-graph";
import type { ReadingMode } from "@/content/reading-mode";

interface Props {
  readonly mode: ReadingMode;
  readonly currentSlug: string;
  readonly base: string;
}

interface AnchorRect {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

const COPY = {
  en: {
    why: "Why it matters here",
    same: "This is one of this chapter's organizing ideas. The mechanism section makes its assumptions and limits explicit.",
    other: "This term connects the current argument to a chapter that works through its mechanism and limits.",
    before: "Builds on",
    after: "Leads to",
    open: "Open the full chapter",
    close: "Close definition",
  },
  zh: {
    why: "为什么这里需要它",
    same: "这是本章的主线概念，后面的机制部分会继续拆开它的前提与边界。",
    other: "这个术语把当前论述连接到对应章节，那里会继续讲清它的机制与局限。",
    before: "前置概念",
    after: "继续通向",
    open: "打开完整章节",
    close: "关闭名词解释",
  },
} as const;

function TermName({ term, mode }: { readonly term: KnowledgeTerm; readonly mode: ReadingMode }) {
  if (mode === "en") return <><strong>{term.en}</strong>{term.acronym ? <small>{term.acronym}</small> : null}</>;
  if (mode === "zh") return <><strong lang="zh-CN">{term.zh}</strong><small>{term.en}{term.acronym ? `, ${term.acronym}` : ""}</small></>;
  return <><strong>{term.en}</strong><small lang="zh-CN">{term.zh}{term.acronym ? ` · ${term.acronym}` : ""}</small></>;
}

function RelationLinks({
  label,
  terms,
  mode,
  base,
}: {
  readonly label: string;
  readonly terms: readonly KnowledgeTerm[];
  readonly mode: ReadingMode;
  readonly base: string;
}) {
  if (!terms.length) return null;
  return (
    <div className="knowledge-card-relations">
      <span>{label}</span>
      <div>{terms.slice(0, 3).map((term) => <a key={term.id} href={knowledgeTermHref(base, mode, term)}>{mode === "zh" ? term.zh : term.en}</a>)}</div>
    </div>
  );
}

function KnowledgeCard({
  term,
  mode,
  currentSlug,
  base,
}: {
  readonly term: KnowledgeTerm;
  readonly mode: ReadingMode;
  readonly currentSlug: string;
  readonly base: string;
}) {
  const connections = getKnowledgeConnections(term.slug);
  const en = COPY.en;
  const zh = COPY.zh;
  const sameChapter = currentSlug === term.slug;
  const openLabel = mode === "en" ? en.open : mode === "zh" ? zh.open : `${en.open} / ${zh.open}`;

  return (
    <article className="knowledge-card">
      <header><BookOpenText size={18} weight="regular" aria-hidden="true" /><div><TermName term={term} mode={mode} /></div></header>
      <div className="knowledge-card-definition">
        {mode !== "zh" ? <p lang="en">{term.definition.en}</p> : null}
        {mode !== "en" ? <p lang="zh-CN">{term.definition.zh}</p> : null}
      </div>
      <div className="knowledge-card-why">
        <span>{mode === "en" ? en.why : mode === "zh" ? zh.why : `${en.why} / ${zh.why}`}</span>
        {mode !== "zh" ? <p lang="en">{sameChapter ? en.same : en.other}</p> : null}
        {mode !== "en" ? <p lang="zh-CN">{sameChapter ? zh.same : zh.other}</p> : null}
      </div>
      <div className="knowledge-card-graph">
        <Graph size={16} weight="regular" aria-hidden="true" />
        <div>
          <RelationLinks label={mode === "en" ? en.before : mode === "zh" ? zh.before : `${en.before} / ${zh.before}`} terms={connections.prerequisites} mode={mode} base={base} />
          <RelationLinks label={mode === "en" ? en.after : mode === "zh" ? zh.after : `${en.after} / ${zh.after}`} terms={connections.leadsTo} mode={mode} base={base} />
        </div>
      </div>
      <a className="knowledge-card-open" href={knowledgeTermHref(base, mode, term)}>{openLabel}<ArrowRight size={15} weight="bold" aria-hidden="true" /></a>
    </article>
  );
}

export function KnowledgeLayer({ mode, currentSlug, base }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [anchorRect, setAnchorRect] = useState<AnchorRect | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const activeTerm = activeId ? KNOWLEDGE_TERMS_BY_ID[activeId] : undefined;

  const clearTimers = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  }, []);

  const activate = useCallback((element: HTMLElement, immediate = false) => {
    const termId = element.dataset.knowledgeTerm;
    if (!termId || !KNOWLEDGE_TERMS_BY_ID[termId]) return;
    window.clearTimeout(closeTimer.current);
    const open = () => {
      const rect = element.getBoundingClientRect();
      setAnchorRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
      setActiveId(termId);
    };
    window.clearTimeout(openTimer.current);
    if (immediate) open();
    else openTimer.current = window.setTimeout(open, 180);
  }, []);

  const scheduleClose = useCallback(() => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => {
      if (!mobileOpen) {
        setActiveId(null);
        setAnchorRect(null);
      }
    }, 160);
  }, [mobileOpen]);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const updatePointerMode = () => setCoarsePointer(pointerQuery.matches);
    updatePointerMode();
    pointerQuery.addEventListener("change", updatePointerMode);
    return () => pointerQuery.removeEventListener("change", updatePointerMode);
  }, []);

  useEffect(() => {
    const findTrigger = (target: EventTarget | null) => target instanceof Element
      ? target.closest<HTMLElement>("[data-knowledge-term]")
      : null;
    const isCoarse = () => window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const onPointerOver = (event: PointerEvent) => {
      if (isCoarse()) return;
      const trigger = findTrigger(event.target);
      if (trigger) activate(trigger);
    };
    const onPointerOut = (event: PointerEvent) => {
      if (isCoarse()) return;
      const trigger = findTrigger(event.target);
      const destination = findTrigger(event.relatedTarget);
      if (trigger && trigger !== destination) scheduleClose();
    };
    const onFocusIn = (event: FocusEvent) => {
      const trigger = findTrigger(event.target);
      if (trigger) activate(trigger, true);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (findTrigger(event.target)) scheduleClose();
    };
    const onClick = (event: MouseEvent) => {
      const trigger = findTrigger(event.target);
      if (!trigger || !isCoarse()) return;
      event.preventDefault();
      activate(trigger, true);
      setMobileOpen(true);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setActiveId(null);
      setAnchorRect(null);
      setMobileOpen(false);
    };
    const onViewportChange = () => {
      if (!mobileOpen) {
        setActiveId(null);
        setAnchorRect(null);
      }
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("resize", onViewportChange);
    return () => {
      clearTimers();
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [activate, clearTimers, mobileOpen, scheduleClose]);

  const anchorStyle = useMemo(() => anchorRect ? {
    position: "fixed" as const,
    top: anchorRect.top,
    left: anchorRect.left,
    width: Math.max(anchorRect.width, 1),
    height: Math.max(anchorRect.height, 1),
    pointerEvents: "none" as const,
  } : undefined, [anchorRect]);

  const card = activeTerm ? <KnowledgeCard term={activeTerm} mode={mode} currentSlug={currentSlug} base={base} /> : null;
  const closeLabel = mode === "en" ? COPY.en.close : mode === "zh" ? COPY.zh.close : `${COPY.en.close} / ${COPY.zh.close}`;

  return (
    <>
      {!coarsePointer ? (
        <HoverCard open={Boolean(activeTerm && anchorRect && !mobileOpen)}>
          <HoverCardTrigger asChild><span aria-hidden="true" style={anchorStyle} /></HoverCardTrigger>
          <HoverCardContent side="top" align="start" collisionPadding={16} onMouseEnter={clearTimers} onMouseLeave={scheduleClose}>
            {card}
          </HoverCardContent>
        </HoverCard>
      ) : null}
      <Sheet open={mobileOpen && Boolean(activeTerm)} onOpenChange={setMobileOpen}>
        <SheetContent side="bottom" className="knowledge-sheet-content" aria-label={closeLabel}>
          <SheetHeader className="sr-only">
            <SheetTitle>{activeTerm ? (mode === "zh" ? activeTerm.zh : activeTerm.en) : closeLabel}</SheetTitle>
            <SheetDescription>{closeLabel}</SheetDescription>
          </SheetHeader>
          {card}
        </SheetContent>
      </Sheet>
    </>
  );
}
