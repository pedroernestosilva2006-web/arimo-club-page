import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { AuthFrame, authFieldClass, authLabelClass } from "@/components/platform/AuthFrame";
import { getPlatformContext } from "@/features/platform/server-functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entre na sua rede · ARIMO CLUB" },
      { name: "description", content: "Acesso privado para membros do ARIMO CLUB." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (result.error) {
      setBusy(false);
      setMessage("E-mail ou senha incorretos.");
      return;
    }

    try {
      const platform = await getPlatformContext();
      const isAdmin = platform.roles.some((role) => role === "super_admin" || role === "admin");
      const hasAccess = platform.roles.some((role) => role !== "user");
      if (!hasAccess) throw new Error("Membership not approved");
      await navigate({
        to: isAdmin
          ? "/admin/applications"
          : platform.profile?.onboarding_completed
            ? "/club"
            : "/onboarding",
      });
    } catch {
      await supabase.auth.signOut();
      setMessage("Esta conta ainda não possui acesso ativo ao ARIMO CLUB.");
    } finally {
      setBusy(false);
    }
  }

  async function requestReset() {
    if (!email.trim()) {
      setMessage("Informe seu e-mail para recuperar a senha.");
      return;
    }
    setBusy(true);
    setMessage(null);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    setResetSent(true);
  }

  return (
    <AuthFrame>
      <p className="mt-12 text-[0.625rem] uppercase tracking-[0.32em] text-white/42">
        ACESSO PRIVADO
      </p>
      <h1 className="mt-4 text-4xl font-medium leading-tight tracking-normal sm:text-5xl">
        Entre na sua rede.
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/52">
        O acesso é reservado a membros aprovados.
      </p>

      <form onSubmit={signIn} className="mt-10 space-y-5">
        <label className="block">
          <span className={authLabelClass}>E-mail</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={authFieldClass}
            placeholder="voce@empresa.com"
          />
        </label>
        <label className="block">
          <span className={authLabelClass}>Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={authFieldClass}
            placeholder="Sua senha"
          />
        </label>

        {message && <p className="text-sm leading-relaxed text-white/68">{message}</p>}
        {resetSent && (
          <p className="text-sm leading-relaxed text-white/68">
            Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="group flex h-13 w-full items-center justify-between bg-[#f5f5f3] px-5 text-xs font-medium uppercase tracking-[0.2em] text-[#080808] transition-colors duration-200 hover:bg-[#d8d8d5] disabled:cursor-wait disabled:opacity-55"
        >
          <span>{busy ? "Entrando" : "Entrar"}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-4 text-xs text-white/55">
        <button
          type="button"
          onClick={requestReset}
          disabled={busy}
          className="flex min-h-11 items-center text-left hover:text-white"
        >
          Esqueci minha senha
        </button>
        <a
          href="/#candidatura"
          className="flex min-h-11 items-center justify-end text-right hover:text-white"
        >
          Ainda não é membro? Solicitar acesso
        </a>
      </div>
    </AuthFrame>
  );
}
