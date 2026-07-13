import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TranslateInput = z.object({
  text: z.string().min(1).max(5000),
  targetLang: z.string().min(2).max(10),
  sourceLang: z.string().min(2).max(10).optional(),
});

export interface TranslateResult {
  translatedText: string;
  detectedSourceLanguage: string;
}

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data }): Promise<TranslateResult> => {
    const key = process.env.DEEPL_API_KEY;
    if (!key) {
      throw new Error("MISSING_KEY");
    }

    // Free-tier keys end with ":fx" and use the free host.
    const host = key.trim().endsWith(":fx")
      ? "https://api-free.deepl.com"
      : "https://api.deepl.com";

    const body: Record<string, unknown> = {
      text: [data.text],
      target_lang: data.targetLang,
    };
    // Omit source_lang to trigger auto-detection.
    if (data.sourceLang) body.source_lang = data.sourceLang;

    const res = await fetch(`${host}/v2/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("DeepL error", res.status, detail);
      throw new Error(`DEEPL_${res.status}`);
    }

    const json = (await res.json()) as {
      translations?: { detected_source_language: string; text: string }[];
    };
    const first = json.translations?.[0];
    if (!first) throw new Error("DEEPL_EMPTY");

    return {
      translatedText: first.text,
      detectedSourceLanguage: first.detected_source_language,
    };
  });
