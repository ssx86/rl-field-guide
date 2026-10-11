import { BookOpenText, Flask, Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/hooks/use-theme";

interface AppHeaderProps {
  readonly theme: Theme;
  readonly onToggleTheme: () => void;
  readonly onOpenHome: () => void;
  readonly context?: string;
}

export function AppHeader({ theme, onToggleTheme, onOpenHome, context }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-card/95">
      <div className="mx-auto flex h-[68px] max-w-[1680px] items-center justify-between gap-4 px-4 sm:px-6">
        <button className="group flex items-center gap-3 text-left" aria-label="RL Field Guide home" onClick={onOpenHome}>
          <span className="grid size-10 place-items-center rounded-control bg-accent text-primary">
            <Flask size={22} weight="fill" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-bold tracking-tight">RL Field Guide</span>
            <span className="block text-[11px] text-muted-foreground">Learn by evidence</span>
          </span>
        </button>

        {context ? (
          <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <BookOpenText size={16} aria-hidden="true" />
            <span>{context}</span>
          </div>
        ) : null}

        <Button
          variant="ghost"
          size="icon"
          aria-label={theme === "light" ? "Use dark theme" : "Use light theme"}
          onClick={onToggleTheme}
        >
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
        </Button>
      </div>
    </header>
  );
}
