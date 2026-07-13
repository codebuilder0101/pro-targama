import { Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TARGET_LANGUAGES, targetLanguageName } from "@/lib/languages";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (code: string) => void;
}

export function LanguageSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TARGET_LANGUAGES;
    return TARGET_LANGUAGES.filter((l) => l.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {targetLanguageName(value)}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[260px] border-border bg-popover p-0">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar idioma..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul className="max-h-64 overflow-y-auto py-1">
          {filtered.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                onClick={() => {
                  onChange(l.code);
                  setOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary",
                  l.code === value && "text-foreground",
                )}
              >
                {l.name}
                {l.code === value && <Check className="h-4 w-4 text-accent" />}
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-4 text-center text-sm text-muted-foreground">
              Nenhum idioma encontrado
            </li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
