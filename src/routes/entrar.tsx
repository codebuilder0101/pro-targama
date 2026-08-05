import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
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

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Targama" },
      { name: "description", content: "Entre na sua conta do Targama." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!EMAIL_RE.test(email)) e.email = "Digite um email válido.";
    if (!password) e.password = "Digite sua senha.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO(next step): connect to Supabase Auth (signInWithPassword + sessão).
    setTimeout(() => {
      setLoading(false);
      toast.success("Dados validados. O login será ativado com o Supabase na próxima etapa.");
    }, 500);
  };

  return (
    <AuthShell title="Entrar" subtitle="Acesse sua conta para ver seus favoritos sincronizados.">
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
            placeholder="Sua senha"
            invalid={!!errors.password}
          />
        </Field>

        <div className="text-right">
          <Link
            to="/recuperar-senha"
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Esqueci minha senha
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
          Entrar
        </button>
      </form>

      <OrDivider />
      <GoogleButton label="Continuar com Google" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link to="/cadastro" className="font-medium text-accent underline underline-offset-2">
          Criar conta
        </Link>
      </p>
    </AuthShell>
  );
}
