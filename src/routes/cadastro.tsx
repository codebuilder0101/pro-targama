import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AuthShell,
  EMAIL_RE,
  Field,
  GoogleButton,
  OrDivider,
  PasswordInput,
  inputClass,
} from "@/components/auth-form";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Targama" },
      { name: "description", content: "Crie sua conta no Targama para salvar favoritos." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!EMAIL_RE.test(email)) e.email = "Digite um email válido.";
    if (password.length < 8) e.password = "A senha precisa de ao menos 8 caracteres.";
    if (confirm !== password) e.confirm = "As senhas não conferem.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO(next step): connect to Supabase Auth (signUp + email de confirmação).
    setTimeout(() => {
      setLoading(false);
      toast.success("Dados validados. O cadastro será ativado com o Supabase na próxima etapa.");
    }, 500);
  };

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Crie uma conta para salvar seus favoritos e acessá-los em qualquer aparelho."
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className={inputClass(!!errors.email)}
          />
        </Field>

        <Field label="Senha" error={errors.password}>
          <PasswordInput
            value={password}
            onChange={setPassword}
            show={show}
            toggle={() => setShow((v) => !v)}
            placeholder="Mínimo de 8 caracteres"
            invalid={!!errors.password}
          />
        </Field>

        <Field label="Confirmar senha" error={errors.confirm}>
          <PasswordInput
            value={confirm}
            onChange={setConfirm}
            show={show}
            toggle={() => setShow((v) => !v)}
            placeholder="Repita a senha"
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
            <UserPlus className="h-5 w-5" />
          )}
          Criar conta
        </button>
      </form>

      <OrDivider />
      <GoogleButton label="Continuar com Google" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link to="/entrar" className="font-medium text-accent underline underline-offset-2">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
