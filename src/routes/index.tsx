import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeftRight, Check, Languages, Loader2, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { LanguageSelect } from "@/components/language-select";
import { useDailyLimit } from "@/lib/daily-limit";
import { useFavorites } from "@/lib/favorites";
import { sourceLanguageName, toTargetCode } from "@/lib/languages";
import { translateText } from "@/lib/translate.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: TranslatorPage,
});

function TranslatorPage() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("CS");
  const [detected, setDetected] = useState<string | null>(null);

  const { addFavorite, isSaving } = useFavorites();
  const { remaining, reachedLimit, increment, isBlocked, limit } = useDailyLimit();
  const translateFn = useServerFn(translateText);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mutation = useMutation({
    mutationFn: (vars: { text: string; targetLang: string }) => translateFn({ data: vars }),
    onSuccess: (res) => {
      setTranslatedText(res.translatedText);
      setDetected(res.detectedSourceLanguage);
      // Count one free translation against the visitor's daily quota.
      increment();
    },
    onError: (err: Error) => {
      setTranslatedText("");
      setDetected(null);
      if (err.message.includes("MISSING_KEY")) {
        toast.error("Chave da API OpenAI não configurada.");
      } else if (err.message.includes("OPENAI_401")) {
        toast.error("Chave da API OpenAI inválida.");
      } else if (err.message.includes("OPENAI_429")) {
        toast.error("Limite de uso da OpenAI atingido.");
      } else {
        toast.error("Erro ao traduzir");
      }
    },
  });

  const runTranslate = useCallback(
    (text: string, lang: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        setTranslatedText("");
        setDetected(null);
        return;
      }
      // Visitors get a limited number of free translations per day.
      if (isBlocked()) {
        setTranslatedText("");
        return;
      }
      mutation.mutate({ text: trimmed, targetLang: lang });
    },
    [mutation, isBlocked],
  );

  // Debounced auto-translate while typing / changing target language.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!sourceText.trim()) {
      setTranslatedText("");
      setDetected(null);
      return;
    }
    debounceRef.current = setTimeout(() => runTranslate(sourceText, targetLang), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceText, targetLang]);

  // Swap: use the current translation as the new input and translate it back
  // to the previously detected source language. The debounced effect below
  // picks up the state change and re-translates automatically.
  const handleSwap = () => {
    const newSource = translatedText.trim();
    const newTarget = toTargetCode(detected);
    if (!newSource || !newTarget) {
      toast.error("Traduza um texto antes de inverter.");
      return;
    }
    setSourceText(newSource);
    setTargetLang(newTarget);
    setTranslatedText("");
    setDetected(null);
  };

  const handleFavorite = async () => {
    if (!sourceText.trim() || !translatedText.trim()) {
      toast.error("Nada para favoritar. Traduza um texto primeiro.");
      return;
    }
    try {
      await addFavorite({
        sourceText: sourceText.trim(),
        translatedText: translatedText.trim(),
        sourceLang: detected ?? "auto",
        targetLang,
      });
      toast.success("Adicionado aos favoritos com sucesso!");
    } catch {
      toast.error("Erro ao salvar o favorito.");
    }
  };

  const isLoading = mutation.isPending;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Source column */}
          <div>
            <div className="mb-3 flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Idioma detectado</span>
              <span className="font-semibold text-foreground">
                {detected ? sourceLanguageName(detected) : "—"}
              </span>
            </div>
            <label className="mb-2 block text-sm font-medium text-foreground">Texto</label>
            <div className="relative">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Digite o texto para traduzir..."
                rows={8}
                className="w-full resize-none rounded-lg bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {detected && !isLoading && (
                <span className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>

          {/* Target column */}
          <div>
            <div className="mb-3">
              <LanguageSelect value={targetLang} onChange={setTargetLang} />
            </div>
            <label className="mb-2 block text-sm font-medium text-foreground">Tradução</label>
            <div className="relative">
              <textarea
                value={translatedText}
                readOnly
                placeholder="A tradução aparecerá aqui..."
                rows={8}
                className="w-full resize-none rounded-lg bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              />
              {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/40">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Daily free quota for visitors */}
        {reachedLimit ? (
          <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-center text-sm">
            <p className="text-foreground">
              Você atingiu o limite de {limit} traduções gratuitas hoje.
            </p>
            <Link
              to="/cadastro"
              className="mt-1 inline-block font-medium text-accent underline underline-offset-2"
            >
              Crie uma conta para traduzir sem limite
            </Link>
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Faltam {remaining} de {limit} traduções gratuitas hoje.
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <ActionButton
            label="Traduzir"
            onClick={() => runTranslate(sourceText, targetLang)}
            disabled={isLoading || !sourceText.trim() || reachedLimit}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Languages className="h-5 w-5" />
            )}
          </ActionButton>
          <ActionButton
            label="Favoritar"
            onClick={handleFavorite}
            disabled={isSaving || !translatedText.trim()}
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Star className="h-5 w-5" />}
          </ActionButton>
          <ActionButton
            label="Inverter idiomas"
            onClick={handleSwap}
            disabled={!translatedText.trim()}
          >
            <ArrowLeftRight className="h-5 w-5" />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground shadow transition-colors",
        "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      {children}
    </button>
  );
}
