import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { AuthShell, Field, PasswordInput } from "@/components/auth-form";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — Targama" },
      { name: "description", content: "Crie uma nova senha para sua conta." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: typeof errors = {};
    if (password.length < 8) e.password = "A senha precisa de ao menos 8 caracteres.";
    if (confirm !== password) e.confirm = "As senhas não conferem.";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    // TODO(next step): Supabase updateUser with the recovery token.
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 500);
  };

  if (done) {
    return (
      <AuthShell title="Senha redefinida" subtitle="Tudo certo, sua nova senha já pode ser usada.">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-accent">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <p className="text-sm text-muted-foreground">
            Sua senha foi atualizada. Agora é só entrar com a nova senha.
          </p>
        </div>
        <Link
          to="/entrar"
          className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-accent"
        >
          Ir para entrar
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Redefinir senha" subtitle="Escolha uma nova senha para a sua conta.">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Field label="Nova senha" error={errors.password}>
          <PasswordInput
            value={password}
            onChange={setPassword}
            show={show}
            toggle={() => setShow((v) => !v)}
            placeholder="Mínimo de 8 caracteres"
            invalid={!!errors.password}
          />
        </Field>
        <Field label="Confirmar nova senha" error={errors.confirm}>
          <PasswordInput
            value={confirm}
            onChange={setConfirm}
            show={show}
            toggle={() => setShow((v) => !v)}
            placeholder="Repita a nova senha"
            invalid={!!errors.confirm}
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ShieldCheck className="h-5 w-5" />
          )}
          Salvar nova senha
        </button>
      </form>
    </AuthShell>
  );
}
