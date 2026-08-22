import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock3, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthFrame } from "@/components/platform/AuthFrame";
import { supabase } from "@/integrations/supabase/client";
import type { ApplicationStatus } from "@/integrations/supabase/types";

export const Route = createFileRoute("/application-status")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search["token"] === "string" ? search["token"] : "",
  }),
  head: () => ({
    meta: [{ title: "Status da candidatura · ARIMO CLUB" }, { name: "robots", content: "noindex" }],
  }),
  component: ApplicationStatusPage,
});

const statusCopy = {
  pending: {
    title: "Sua candidatura está em análise.",
    body: "Analisamos pessoalmente cada nova entrada para preservar a qualidade da rede.",
    icon: Clock3,
  },
  approved: {
    title: "Sua entrada foi aprovada.",
    body: "Enviamos o convite de ativação para o e-mail informado na candidatura.",
    icon: Check,
  },
  rejected: {
    title: "Sua candidatura não avançou.",
    body: "Neste momento, seu perfil não foi selecionado para esta fase do ARIMO CLUB.",
    icon: X,
  },
} satisfies Record<ApplicationStatus, { title: string; body: string; icon: typeof Check }>;

function ApplicationStatusPage() {
  const { token: searchToken } = Route.useSearch();
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchToken || window.localStorage.getItem("arimo_application_token") || "";
    if (!token) {
      setLoading(false);
      return;
    }
    supabase.rpc("get_application_status", { p_token: token }).then(({ data }) => {
      setStatus(data?.[0]?.status ?? null);
      setLoading(false);
    });
  }, [searchToken]);

  const copy = statusCopy[status ?? "pending"];
  const Icon = status ? copy.icon : Clock3;

  return (
    <AuthFrame>
      <div className="mt-14 border-t border-white/15 pt-10">
        <Icon className="h-6 w-6 text-white/72" strokeWidth={1.5} />
        <p className="mt-8 text-[0.625rem] uppercase tracking-[0.3em] text-white/40">
          CANDIDATURA ARIMO
        </p>
        <h1 className="mt-4 max-w-full break-words text-[clamp(2rem,9vw,3rem)] font-medium leading-[1.08] [overflow-wrap:anywhere]">
          {loading ? "Consultando candidatura." : status ? copy.title : "Protocolo não encontrado."}
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
          {loading
            ? "Aguarde enquanto validamos seu acesso."
            : status
              ? copy.body
              : "Não encontramos um protocolo neste dispositivo. O status também será comunicado pelo e-mail informado."}
        </p>
        <a
          href={status === "approved" ? "/login" : "/"}
          className="mt-10 inline-flex border-b border-white/35 pb-2 text-xs uppercase tracking-[0.2em] text-white/72 hover:text-white"
        >
          {status === "approved" ? "Entrar na ARIMO" : "Voltar ao site"}
        </a>
      </div>
    </AuthFrame>
  );
}
