import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useFavorites } from "@/lib/favorites";
import { sourceLanguageName, targetLanguageName } from "@/lib/languages";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Targama" },
      {
        name: "description",
        content: "Suas traduções favoritas, salvas apenas no seu navegador.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  const handleRemove = (id: string) => {
    try {
      removeFavorite(id);
      toast.success("Removido dos favoritos!");
    } catch {
      toast.error("Erro ao remover");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Favoritos</h1>

      {favorites.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </span>
          <p className="mt-4 text-lg font-medium text-foreground">
            Nenhum favorito ainda
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Traduza um texto na página inicial e toque na estrela para salvá-lo aqui.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <article
              key={fav.id}
              className="flex flex-col rounded-lg border border-border bg-primary/90 p-5 shadow-card"
            >
              <p className="text-lg font-bold leading-snug text-white">{fav.translatedText}</p>
              <p className="mt-2 text-sm text-slate-200">{fav.sourceText}</p>
              <p className="mt-2 text-xs text-slate-300">
                {sourceLanguageName(fav.sourceLang)} → {targetLanguageName(fav.targetLang)}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemove(fav.id)}
                  className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
