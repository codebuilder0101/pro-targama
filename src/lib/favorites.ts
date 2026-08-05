import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import {
  addFavorite as addFavoriteFn,
  listFavorites as listFavoritesFn,
  removeFavorite as removeFavoriteFn,
  type Favorite,
} from "@/lib/favorites.functions";

export type { Favorite };

// Anonymous per-device identifier so each browser sees only its own favorites
// (the app has no user accounts). Stored locally; the row data lives in Supabase.
const CLIENT_ID_KEY = "targama_client_id";

function readOrCreateClientId(): string {
  const existing = window.localStorage.getItem(CLIENT_ID_KEY);
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `c_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(CLIENT_ID_KEY, id);
  return id;
}

// Resolves after mount (localStorage is client-only); null during SSR.
function useClientId(): string | null {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    setId(readOrCreateClientId());
  }, []);
  return id;
}

export function useFavorites() {
  const queryClient = useQueryClient();
  const clientId = useClientId();
  const listFn = useServerFn(listFavoritesFn);
  const addFn = useServerFn(addFavoriteFn);
  const removeFn = useServerFn(removeFavoriteFn);

  const query = useQuery({
    queryKey: ["favorites", clientId],
    queryFn: () => listFn({ data: { clientId: clientId as string } }),
    enabled: !!clientId,
    // Fail fast on a hard error (e.g. backend misconfig) instead of spinning
    // through retries; the page then shows the empty state.
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: (fav: Omit<Favorite, "id" | "createdAt">) =>
      addFn({ data: { clientId: clientId as string, ...fav } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites", clientId] }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeFn({ data: { clientId: clientId as string, id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites", clientId] }),
  });

  return {
    favorites: query.data ?? [],
    isLoading: !!clientId && query.isLoading,
    isSaving: addMutation.isPending,
    addFavorite: addMutation.mutateAsync,
    removeFavorite: removeMutation.mutateAsync,
  };
}
