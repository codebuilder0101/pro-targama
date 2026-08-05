import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, CircleSlash, Info, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Targama" },
      {
        name: "description",
        content: "Termos de uso do Targama: regras simples para usar o tradutor.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Termos de Uso</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última atualização: agosto de 2025. Ao usar o Targama, você concorda com os termos abaixo.
      </p>

      <Section icon={<Info className="h-5 w-5" />} title="O que é o Targama">
        O Targama é um tradutor web gratuito e minimalista. Ele detecta o idioma de origem, traduz
        para o idioma escolhido e permite salvar traduções nos favoritos.
      </Section>

      <Section icon={<CheckCircle2 className="h-5 w-5" />} title="Uso permitido">
        Você pode usar o Targama para traduzir textos pessoais e de trabalho. Pedimos bom senso no
        volume de uso, para manter o serviço rápido e gratuito para todo mundo.
      </Section>

      <Section icon={<CircleSlash className="h-5 w-5" />} title="Uso não permitido">
        Não use o serviço para conteúdo ilegal, para tentar sobrecarregar o sistema ou para acessar
        de forma automatizada e abusiva. Contas ou acessos que abusarem podem ser limitados.
      </Section>

      <Section icon={<RefreshCw className="h-5 w-5" />} title="Disponibilidade e mudanças">
        Fazemos o possível para manter o app no ar, mas ele é oferecido como está, sem garantia de
        disponibilidade contínua. Estes termos podem ser atualizados, e avisaremos quando houver
        mudanças importantes.
      </Section>

      <p className="mt-8 text-sm text-muted-foreground">
        Veja também nossa{" "}
        <Link to="/privacidade" className="text-accent underline underline-offset-2">
          Política de Privacidade
        </Link>
        .
      </p>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-lg border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <span className="text-accent">{icon}</span>
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
