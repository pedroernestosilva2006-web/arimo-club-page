import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso restrito · ARIMO CLUB" },
      { name: "description", content: "Área restrita para gestão das candidaturas do ARIMO CLUB." },
      { property: "og:title", content: "Acesso restrito · ARIMO CLUB" },
      { property: "og:description", content: "Área restrita para gestão das candidaturas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const field =
  "w-full border-b border-ink-foreground/30 bg-transparent py-3 text-sm font-light tracking-wide outline-none placeholder:text-ink-foreground/35 focus:border-ink-foreground";
const label = "text-[0.625rem] font-light uppercase tracking-[0.35em] opacity-60";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/leads` },
          });
    setBusy(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    if (result.data.session) {
      navigate({ to: "/leads" });
    } else {
      setMessage("Conta criada. Confirme seu e-mail para entrar.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-24 font-sans font-light text-ink-foreground">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-light tracking-[-0.01em]">
          {mode === "signin" ? "Acesso restrito." : "Criar acesso."}
        </h1>
        <p className="mt-3 text-sm text-ink-foreground/55">
          Área de gestão das candidaturas do ARIMO CLUB.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-7">
          <div>
            <label className={label} htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              placeholder="voce@empresa.com"
            />
          </div>
          <div>
            <label className={label} htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              placeholder="••••••"
            />
          </div>

          {message && <p className="text-xs text-ink-foreground/70">{message}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full border border-ink-foreground/50 px-8 py-4 text-[0.6875rem] font-light tracking-[0.3em] uppercase transition-colors duration-300 hover:bg-ink-foreground hover:text-ink disabled:opacity-50"
          >
            {busy ? "Aguarde…" : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-8 text-[0.625rem] uppercase tracking-[0.35em] text-ink-foreground/50 hover:text-ink-foreground"
        >
          {mode === "signin" ? "Criar acesso" : "Já tenho acesso"}
        </button>
      </div>
    </main>
  );
}
