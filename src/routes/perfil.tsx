import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Loader2, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, PasswordInput } from "@/components/auth-form";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Targama" },
      { name: "description", content: "Gerencie sua conta: troque a senha ou apague a conta." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Perfil</h1>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-accent">
            <UserRound className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Conta</p>
            <p className="font-medium text-foreground">voce@email.com</p>
          </div>
        </div>
      </section>

      <ChangePassword />
      <DangerZone />
    </div>
  );
}

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: typeof errors = {};
    if (password.length < 8) e.password = "A senha precisa de ao menos 8 caracteres.";
    if (confirm !== password) e.confirm = "As senhas não conferem.";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    // TODO(next step): Supabase updateUser.
    setTimeout(() => {
      setLoading(false);
      setPassword("");
      setConfirm("");
      toast.success("Senha validada. A troca será ativada com o login do Supabase.");
    }, 500);
  };

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <KeyRound className="h-5 w-5 text-accent" />
        Trocar senha
      </h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit} noValidate>
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
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          Salvar nova senha
        </button>
      </form>
    </section>
  );
}

function DangerZone() {
  return (
    <section className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Trash2 className="h-5 w-5 text-destructive" />
        Apagar conta
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Isso apaga sua conta e todos os favoritos ligados a ela. Esta ação não pode ser desfeita.
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-destructive px-5 py-3 font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Trash2 className="h-5 w-5" />
            Apagar minha conta
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que quer apagar a conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Sua conta e todos os favoritos serão removidos de forma permanente. Não dá para
              desfazer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                toast.success("Confirmado. A exclusão será ativada com o login do Supabase.")
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
