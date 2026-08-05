import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, MailCheck, Send } from "lucide-react";
import { useState } from "react";

import { AuthShell, EMAIL_RE, Field, inputClass } from "@/components/auth-form";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — Targama" },
      { name: "description", content: "Receba um link para redefinir sua senha." },
    ],
  }),
  component: RecoverPage,
});

function RecoverPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Digite um email válido.");
      return;
    }
    setError(undefined);
    setLoading(true);
    // TODO(next step): Supabase resetPasswordForEmail.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 500);
  };

  if (sent) {
    return (
      <AuthShell
        title="Verifique seu email"
        subtitle="Se existir uma conta, o link já está a caminho."
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-accent">
            <MailCheck className="h-6 w-6" />
          </span>
          <p className="text-sm text-muted-foreground">
            Enviamos um link de recuperação para{" "}
            <strong className="text-foreground">{email}</strong>. Abra o email e siga as instruções
            para criar uma nova senha.
          </p>
        </div>
        <Link
          to="/entrar"
          className="mt-4 flex w-full items-center justify-center rounded-lg border border-border bg-background px-4 py-3 font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Voltar para entrar
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Digite seu email e enviaremos um link para você criar uma nova senha."
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Field label="Email" error={error}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className={inputClass(!!error)}
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          Enviar link de recuperação
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Lembrou a senha?{" "}
        <Link to="/entrar" className="font-medium text-accent underline underline-offset-2">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
