import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/leads")({
  head: () => ({
    meta: [
      { title: "Candidaturas · ARIMO CLUB" },
      { name: "description", content: "Lista das candidaturas recebidas pelo formulário do ARIMO CLUB." },
      { property: "og:title", content: "Candidaturas · ARIMO CLUB" },
      { property: "og:description", content: "Lista das candidaturas recebidas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LeadsPage,
});

type Lead = {
  id: string;
  telefone: string;
  instagram: string;
  email: string;
  created_at: string;
};

const eyebrow = "text-[0.625rem] font-light uppercase tracking-[0.45em]";

function LeadsPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("lead_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setError(error.message);
        setLeads((data as Lead[] | null) ?? []);
      });
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <main className="min-h-screen bg-ink px-6 py-20 font-sans font-light text-ink-foreground">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-baseline justify-between gap-6">
          <div>
            <p className={`${eyebrow} text-ink-foreground/45`}>ARIMO CLUB</p>
            <h1 className="mt-4 font-display text-4xl font-light tracking-[-0.01em]">
              Candidaturas
            </h1>
          </div>
          <button
            type="button"
            onClick={signOut}
            className={`${eyebrow} text-ink-foreground/50 hover:text-ink-foreground`}
          >
            Sair
          </button>
        </div>

        {error && (
          <p className="mt-12 text-sm text-ink-foreground/70">
            Não foi possível carregar as candidaturas. Verifique se sua conta tem permissão de
            administrador.
          </p>
        )}

        {!error && leads === null && (
          <p className="mt-12 text-sm text-ink-foreground/55">Carregando…</p>
        )}

        {!error && leads?.length === 0 && (
          <p className="mt-12 text-sm text-ink-foreground/55">Nenhuma candidatura ainda.</p>
        )}

        {!!leads?.length && (
          <div className="mt-14 border-t border-line-dark">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="grid gap-2 border-b border-line-dark py-6 md:grid-cols-4 md:items-baseline"
              >
                <span className="text-sm">{lead.telefone}</span>
                <span className="text-sm text-ink-foreground/75">{lead.instagram}</span>
                <span className="text-sm break-all text-ink-foreground/75">{lead.email}</span>
                <span className={`${eyebrow} text-ink-foreground/40 md:text-right`}>
                  {new Date(lead.created_at).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
