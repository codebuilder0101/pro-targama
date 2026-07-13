import { Link } from "@tanstack/react-router";
import { Home, BookOpen, Info, Languages, Menu, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Início", icon: Home },
  { to: "/favoritos", label: "Favoritos", icon: BookOpen },
  { to: "/sobre", label: "Sobre", icon: Info },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gradient-header sticky top-0 z-30 border-b border-white/5 shadow-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/25 ring-1 ring-white/15">
            <Languages className="h-5 w-5 text-white" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold text-white">Targama</span>
            <span className="block text-xs text-slate-300">Tradutor com base em DeepL</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white [&.active]:bg-white/10 [&.active]:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 md:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <nav className={cn("border-t border-white/5 px-4 pb-3 md:hidden", open ? "block" : "hidden")}>
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white [&.active]:bg-white/10 [&.active]:text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
