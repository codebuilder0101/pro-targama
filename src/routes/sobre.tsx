import { createFileRoute } from "@tanstack/react-router";
import { Languages, Lock, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Targama" },
      {
        name: "description",
        content:
          "Sobre o Targama: um tradutor web minimalista com DeepL, favoritos locais e foco em privacidade.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Sobre o Targama</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        O Targama é um tradutor web minimalista com tema escuro. Digite um texto, o idioma de
        origem é detectado automaticamente, escolha o idioma de destino e receba uma tradução
        rápida e limpa — feita com a API do DeepL.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Feature icon={<Languages className="h-5 w-5" />} title="Detecção automática">
          O idioma de origem é identificado automaticamente pela DeepL, com suporte a dezenas de
          idiomas.
        </Feature>
        <Feature icon={<Star className="h-5 w-5" />} title="Favoritos">
          Salve traduções úteis e gerencie tudo na página de favoritos.
        </Feature>
        <Feature icon={<Sparkles className="h-5 w-5" />} title="Instalável (PWA)">
          Instale o Targama como um app direto pelo navegador, no desktop ou no celular.
        </Feature>
        <Feature icon={<Lock className="h-5 w-5" />} title="Privacidade">
          Seus favoritos ficam só no seu navegador.
        </Feature>
      </div>

      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Lock className="h-5 w-5 text-accent" />
          Nota de privacidade
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Os favoritos são armazenados exclusivamente no seu navegador, via{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">
            localStorage
          </code>
          . Nada é enviado para servidores externos, exceto o próprio texto a ser traduzido, que é
          processado pela API do DeepL apenas para gerar a tradução.
        </p>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Tecnologias</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>• React + TypeScript</li>
          <li>• Tailwind CSS</li>
          <li>• Lucide (ícones)</li>
          <li>• API de tradução DeepL</li>
        </ul>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        Traduções fornecidas por DeepL. DeepL é uma marca registrada da DeepL SE.
      </p>
    </div>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-foreground">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/20 text-accent">
          {icon}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
