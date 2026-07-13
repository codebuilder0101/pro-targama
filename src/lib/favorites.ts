import { useCallback, useEffect, useState } from "react";

export interface Favorite {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  createdAt: number;
}

const STORAGE_KEY = "targama_favorites";

function readFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Favorite[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavorites(items: Favorite[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Cross-component sync within the same tab.
const EVENT = "targama:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    setFavorites(readFavorites());
    const sync = () => setFavorites(readFavorites());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addFavorite = useCallback(
    (fav: Omit<Favorite, "id" | "createdAt">): Favorite => {
      const item: Favorite = {
        ...fav,
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
        createdAt: Date.now(),
      };
      const next = [item, ...readFavorites()];
      writeFavorites(next);
      window.dispatchEvent(new Event(EVENT));
      return item;
    },
    [],
  );

  const removeFavorite = useCallback((id: string) => {
    const next = readFavorites().filter((f) => f.id !== id);
    writeFavorites(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { favorites, addFavorite, removeFavorite };
}
