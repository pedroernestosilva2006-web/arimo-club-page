import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthFrame, authFieldClass, authLabelClass } from "@/components/platform/AuthFrame";
import { supabase } from "@/integrations/supabase/client";

export function PasswordSetup({ mode }: { mode: "invite" | "recovery" }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setReady(Boolean(data.session));
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setReady(Boolean(session));
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    if (password.length < 8) {
      setMessage("Use uma senha com pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setMessage("As senhas não coincidem.");
      return;
    }

    setBusy(true);
    const result = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (result.error) {
      setMessage("O link expirou ou não pôde ser validado. Solicite um novo acesso.");
      return;
    }
    setDone(true);
  }

  return (
    <AuthFrame>
      <p className="mt-12 text-[0.625rem] uppercase tracking-[0.32em] text-white/42">
        {mode === "invite" ? "ATIVAÇÃO DE ACESSO" : "SEGURANÇA"}
      </p>
      <h1 className="mt-4 text-4xl font-medium leading-tight sm:text-5xl">
        {done
          ? "Acesso protegido."
          : mode === "invite"
            ? "Crie sua senha."
            : "Defina uma nova senha."}
      </h1>

      {done ? (
        <div className="mt-10 border-t border-white/15 pt-8">
          <Check className="h-6 w-6 text-white/75" />
          <p className="mt-5 text-sm leading-relaxed text-white/58">
            {mode === "invite"
              ? "Sua senha foi salva. Continue para completar seu perfil dentro da ARIMO."
              : "Sua senha foi atualizada. Você já pode voltar para a sua rede."}
          </p>
          <a
            href={mode === "invite" ? "/onboarding" : "/club"}
            className="mt-8 flex h-13 items-center justify-between bg-white px-5 text-xs font-medium uppercase tracking-[0.2em] text-black"
          >
            Continuar <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      ) : ready ? (
        <form onSubmit={savePassword} className="mt-10 space-y-5">
          <label className="block">
            <span className={authLabelClass}>Nova senha</span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={authFieldClass}
              required
              minLength={8}
            />
          </label>
          <label className="block">
            <span className={authLabelClass}>Confirmar senha</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              className={authFieldClass}
              required
              minLength={8}
            />
          </label>
          {message && <p className="text-sm text-white/68">{message}</p>}
          <button
            type="submit"
            disabled={busy}
            className="flex h-13 w-full items-center justify-between bg-white px-5 text-xs font-medium uppercase tracking-[0.2em] text-black disabled:opacity-55"
          >
            {busy ? "Salvando" : "Salvar senha"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <div className="mt-10 border-t border-white/15 pt-8">
          <p className="text-sm leading-relaxed text-white/58">
            Este link não está mais válido. Volte ao login para solicitar um novo.
          </p>
          <a
            href="/login"
            className="mt-7 inline-flex text-xs uppercase tracking-[0.2em] text-white"
          >
            Voltar ao login
          </a>
        </div>
      )}
    </AuthFrame>
  );
}
