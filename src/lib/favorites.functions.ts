import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface Favorite {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  createdAt: number;
}

// Load .env into process.env when the platform hasn't provided it (e.g. `vite dev`).
function ensureEnvLoaded(): void {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    (process as { loadEnvFile?: (path?: string) => void }).loadEnvFile?.();
  } catch {
    // .env not found — fall through and report SUPABASE_NOT_CONFIGURED.
  }
}

function supabaseConfig(): { url: string; key: string } {
  ensureEnvLoaded();
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("SUPABASE_NOT_CONFIGURED");
  return { url, key };
}

interface Row {
  id: string;
  source_text: string;
  translated_text: string;
  source_lang: string;
  target_lang: string;
  created_at: string;
}

function toFavorite(row: Row): Favorite {
  return {
    id: row.id,
    sourceText: row.source_text,
    translatedText: row.translated_text,
    sourceLang: row.source_lang,
    targetLang: row.target_lang,
    createdAt: new Date(row.created_at).getTime(),
  };
}

// Thin PostgREST client. The service_role key stays server-side only.
async function sbFetch(path: string, init: RequestInit): Promise<Response> {
  const { url, key } = supabaseConfig();
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Supabase error", res.status, detail);
    throw new Error(`SUPABASE_${res.status}`);
  }
  return res;
}

const clientId = z.string().min(8).max(100);

export const listFavorites = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ clientId }).parse(input))
  .handler(async ({ data }): Promise<Favorite[]> => {
    const params = new URLSearchParams({
      client_id: `eq.${data.clientId}`,
      select: "*",
      order: "created_at.desc",
    });
    const res = await sbFetch(`favorites?${params.toString()}`, { method: "GET" });
    const rows = (await res.json()) as Row[];
    return rows.map(toFavorite);
  });

export const addFavorite = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        clientId,
        sourceText: z.string().min(1).max(5000),
        translatedText: z.string().min(1).max(5000),
        sourceLang: z.string().min(1).max(20),
        targetLang: z.string().min(1).max(20),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<Favorite> => {
    const res = await sbFetch("favorites", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        client_id: data.clientId,
        source_text: data.sourceText,
        translated_text: data.translatedText,
        source_lang: data.sourceLang,
        target_lang: data.targetLang,
      }),
    });
    const rows = (await res.json()) as Row[];
    return toFavorite(rows[0]);
  });

export const removeFavorite = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ clientId, id: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const params = new URLSearchParams({
      id: `eq.${data.id}`,
      client_id: `eq.${data.clientId}`,
    });
    await sbFetch(`favorites?${params.toString()}`, { method: "DELETE" });
    return { id: data.id };
  });
