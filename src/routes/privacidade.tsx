import { createFileRoute, Link } from "@tanstack/react-router";
import { Cloud, Lock, Sparkles, Trash2 } from "lucide-react";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Targama" },
      {
        name: "description",
        content: "Como o Targama trata seus dados: favoritos, tradução por IA e seus direitos.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última atualização: agosto de 2025. Este é um resumo claro, sujeito a revisão jurídica.
      </p>

      <Section icon={<Sparkles className="h-5 w-5" />} title="O que fazemos com seu texto">
        O texto que você digita para traduzir é enviado com segurança aos modelos de inteligência
        artificial da OpenAI, com a única finalidade de gerar a tradução. Não usamos seu texto para
        anúncios e não o vendemos a terceiros.
      </Section>

      <Section icon={<Cloud className="h-5 w-5" />} title="Favoritos e como são guardados">
        Quando você salva uma tradução nos favoritos, ela fica armazenada no nosso banco de dados
        (Supabase) para que você possa acessá-la depois. Os favoritos são associados a um
        identificador anônimo do seu dispositivo. Não pedimos nome nem exigimos cadastro para usar o
        tradutor.
      </Section>

      <Section icon={<Trash2 className="h-5 w-5" />} title="Seus direitos">
        Você pode remover qualquer favorito quando quiser, direto na página de favoritos. A remoção
        apaga o item do banco de dados. Se quiser, pode nos contatar para solicitar a exclusão de
        todos os seus dados, conforme a LGPD.
      </Section>

      <Section icon={<Lock className="h-5 w-5" />} title="Segurança">
        As chaves de acesso aos serviços de tradução e ao banco de dados ficam somente no servidor,
        nunca no seu navegador. A comunicação com o app acontece por conexão criptografada.
      </Section>

      <p className="mt-8 text-sm text-muted-foreground">
        Dúvidas sobre privacidade? Consulte também os{" "}
        <Link to="/termos" className="text-accent underline underline-offset-2">
          Termos de Uso
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
