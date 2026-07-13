// DeepL supported languages with Portuguese display names.

export interface Language {
  code: string; // DeepL target_lang code
  name: string; // Portuguese display name
}

// Target languages supported by Targama (DeepL codes -> Portuguese names).
export const TARGET_LANGUAGES: Language[] = [
  { code: "PT-BR", name: "Português (Brasil)" },
  { code: "PT-PT", name: "Português (Portugal)" },
  { code: "EN-US", name: "Inglês (EUA)" },
  { code: "EN-GB", name: "Inglês (Reino Unido)" },
  { code: "ES", name: "Espanhol" },
  { code: "FR", name: "Francês" },
  { code: "DE", name: "Alemão" },
  { code: "IT", name: "Italiano" },
  { code: "NL", name: "Holandês" },
  { code: "PL", name: "Polonês" },
  { code: "RU", name: "Russo" },
  { code: "JA", name: "Japonês" },
  { code: "ZH", name: "Chinês" },
  { code: "KO", name: "Coreano" },
  { code: "AR", name: "Árabe" },
  { code: "CS", name: "Checo" },
  { code: "DA", name: "Dinamarquês" },
  { code: "FI", name: "Finlandês" },
  { code: "EL", name: "Grego" },
  { code: "HU", name: "Húngaro" },
  { code: "NB", name: "Norueguês" },
  { code: "RO", name: "Romeno" },
  { code: "SK", name: "Eslovaco" },
  { code: "SL", name: "Esloveno" },
  { code: "SV", name: "Sueco" },
  { code: "TR", name: "Turco" },
  { code: "UK", name: "Ucraniano" },
  { code: "BG", name: "Búlgaro" },
  { code: "ET", name: "Estoniano" },
  { code: "LV", name: "Letão" },
  { code: "LT", name: "Lituano" },
  { code: "ID", name: "Indonésio" },
];

// Detected source languages come back as 2-letter ISO codes (e.g. "PT", "EN").
const SOURCE_NAMES: Record<string, string> = {
  PT: "Português",
  EN: "Inglês",
  ES: "Espanhol",
  FR: "Francês",
  DE: "Alemão",
  IT: "Italiano",
  NL: "Holandês",
  PL: "Polonês",
  RU: "Russo",
  JA: "Japonês",
  ZH: "Chinês",
  KO: "Coreano",
  AR: "Árabe",
  CS: "Checo",
  DA: "Dinamarquês",
  FI: "Finlandês",
  EL: "Grego",
  HU: "Húngaro",
  NB: "Norueguês",
  RO: "Romeno",
  SK: "Eslovaco",
  SL: "Esloveno",
  SV: "Sueco",
  TR: "Turco",
  UK: "Ucraniano",
  BG: "Búlgaro",
  ET: "Estoniano",
  LV: "Letão",
  LT: "Lituano",
  ID: "Indonésio",
  NN: "Norueguês (Nynorsk)",
};

export function sourceLanguageName(code: string | null | undefined): string {
  if (!code) return "—";
  const base = code.split("-")[0].toUpperCase();
  return SOURCE_NAMES[base] ?? code.toUpperCase();
}

export function targetLanguageName(code: string): string {
  return TARGET_LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

// Map a detected source ISO code to the closest selectable target code (for swap).
export function toTargetCode(sourceCode: string | null | undefined): string | null {
  if (!sourceCode) return null;
  const base = sourceCode.split("-")[0].toUpperCase();
  if (base === "PT") return "PT-BR";
  if (base === "EN") return "EN-US";
  const match = TARGET_LANGUAGES.find((l) => l.code.split("-")[0] === base);
  return match?.code ?? null;
}
