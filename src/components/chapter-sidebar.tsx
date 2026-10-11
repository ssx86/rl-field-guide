import { BookOpen, CheckCircle, Circle, Compass, Function as FunctionIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { Chapter } from "@/content/chapter-types";
import type { EvidenceKind } from "@/domain/course-progress";

export function ChapterSidebar({ chapter, progress }: { readonly chapter: Chapter; readonly progress: readonly EvidenceKind[] }) {
  return (
    <aside className="chapter-sidebar" aria-label={`${chapter.section} chapter guide`}>
      <div className="sticky top-5 space-y-6">
        <section>
          <p className="text-xs font-semibold text-primary">Method passport</p>
          <dl className="mt-4 space-y-4 text-xs">
            <PassportRow icon={<BookOpen size={16} />} label="Assumes" value={chapter.passport.assumes} />
            <PassportRow icon={<FunctionIcon size={16} />} label="Updates" value={chapter.passport.updates} />
            <PassportRow icon={<Compass size={16} />} label="Best for" value={chapter.passport.bestFor} />
            <PassportRow icon={<Circle size={16} />} label="Breaks when" value={chapter.passport.breaksWhen} />
          </dl>
        </section>
        <section className="border-t border-border pt-5">
          <div className="flex items-center justify-between"><p className="text-xs font-bold">Evidence progress</p><span className="font-mono text-xs">{progress.length} / 5</span></div>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
            {(["prediction", "experiment", "numeric", "transfer", "reflection"] as const).map((kind) => <li key={kind} className="flex items-center gap-2">{progress.includes(kind) ? <CheckCircle size={15} className="text-success" /> : <Circle size={15} />}<span className="capitalize">{kind}</span></li>)}
          </ul>
        </section>
      </div>
    </aside>
  );
}

function PassportRow({ icon, label, value }: { readonly icon: ReactNode; readonly label: string; readonly value: string }) {
  return <div><dt className="flex items-center gap-2 font-bold text-foreground">{icon}{label}</dt><dd className="mt-1.5 leading-5 text-muted-foreground">{value}</dd></div>;
}
