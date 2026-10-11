import { Compass, Warning } from "@phosphor-icons/react";
import { FOUNDATIONAL_EXTENSIONS } from "@/content/foundational-extensions";

export function FoundationalExtensions({ route }: { readonly route: keyof typeof FOUNDATIONAL_EXTENSIONS }) {
  const content = FOUNDATIONAL_EXTENSIONS[route];
  return (
    <section className="chapter-section" aria-labelledby={`${route}-extensions-title`}>
      <p className="text-xs font-semibold text-primary">{content.eyebrow}</p>
      <h2 id={`${route}-extensions-title`} className="mt-1 text-xl font-bold">{content.title}</h2>
      <p className="mt-2 max-w-[74ch] text-sm leading-7 text-muted-foreground">{content.intro}</p>
      <div className="extension-grid">
        {content.concepts.map((concept) => <article key={concept.title}>
          <Compass size={18} className="text-primary" />
          <h3>{concept.title}</h3>
          <p>{concept.summary}</p>
          <dl><div><dt>Use when</dt><dd>{concept.useWhen}</dd></div><div><dt><Warning size={13} /> Boundary</dt><dd>{concept.boundary}</dd></div></dl>
        </article>)}
      </div>
    </section>
  );
}
