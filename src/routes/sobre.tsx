import { createFileRoute } from "@tanstack/react-router";
import { Cloud, Languages, Smartphone, Sparkles, Star, Wand2 } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Targama" },
      {
        name: "description",
        content:
          "Sobre o Targama: um tradutor web minimalista com IA (OpenAI), detecção automática de idioma e favoritos sincronizados.",
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
        O Targama é um tradutor web minimalista com tema escuro. Digite um texto, o idioma de origem
        é detectado automaticamente, escolha o idioma de destino e receba uma tradução rápida e
        natural — gerada por inteligência artificial com os modelos da OpenAI. A tradução acontece
        enquanto você digita, e você pode salvar as mais úteis nos favoritos.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Feature icon={<Wand2 className="h-5 w-5" />} title="Tradução com IA">
          As traduções são geradas pelos modelos de linguagem da OpenAI, priorizando fluência e
          preservando a formatação do texto original.
        </Feature>
        <Feature icon={<Languages className="h-5 w-5" />} title="Detecção automática">
          O idioma de origem é identificado automaticamente, com suporte a mais de 30 idiomas de
          destino.
        </Feature>
        <Feature icon={<Star className="h-5 w-5" />} title="Favoritos sincronizados">
          Salve traduções úteis com um toque na estrela e reveja todas na página de favoritos.
        </Feature>
        <Feature icon={<Cloud className="h-5 w-5" />} title="Na nuvem, por dispositivo">
          Seus favoritos ficam guardados no banco de dados (Supabase) e associados apenas ao seu
          dispositivo — sem necessidade de criar conta.
        </Feature>
        <Feature icon={<Smartphone className="h-5 w-5" />} title="Instalável (PWA)">
          Instale o Targama como um app direto pelo navegador, no desktop ou no celular.
        </Feature>
        <Feature icon={<Sparkles className="h-5 w-5" />} title="Rápido e minimalista">
          Interface limpa, sem distrações, com tradução em tempo real enquanto você escreve.
        </Feature>
      </div>

      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Cloud className="h-5 w-5 text-accent" />
          Como seus dados são tratados
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          O texto que você digita é enviado com segurança aos modelos da OpenAI apenas para gerar a
          tradução. As traduções que você marca como favoritas são armazenadas no banco de dados
          (Supabase) e vinculadas a um identificador anônimo do seu dispositivo — nenhum dado
          pessoal ou login é solicitado. Você pode remover qualquer favorito a qualquer momento.
        </p>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Tecnologias</h2>
        <ul className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
          <li>• React 19 + TypeScript</li>
          <li>• TanStack Start (SSR) + Router</li>
          <li>• TanStack Query</li>
          <li>• Tailwind CSS + Radix UI</li>
          <li>• Lucide (ícones)</li>
          <li>• OpenAI (tradução por IA)</li>
          <li>• Supabase (favoritos)</li>
        </ul>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        Traduções geradas por modelos de inteligência artificial da OpenAI. OpenAI é uma marca de
        sua respectiva detentora.
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
