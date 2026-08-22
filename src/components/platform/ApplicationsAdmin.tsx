import { Search, Send, UserCheck, UserX, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAdminApplications, reviewApplication } from "@/features/platform/server-functions";
import type { ApplicationStatus, Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type Application = Tables<"lead_applications">;
type Filter = ApplicationStatus | "all";

const filters: { value: Filter; label: string }[] = [
  { value: "pending", label: "Pendentes" },
  { value: "approved", label: "Aprovados" },
  { value: "rejected", label: "Reprovados" },
  { value: "all", label: "Todos" },
];

const statusLabel: Record<ApplicationStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Reprovado",
};

export function ApplicationsAdmin() {
  const fetchApplications = useServerFn(getAdminApplications);
  const review = useServerFn(reviewApplication);
  const [filter, setFilter] = useState<Filter>("pending");
  const [query, setQuery] = useState("");
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [selected, setSelected] = useState<Application | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setApplications(null);
    setError(null);
    try {
      const rows = await fetchApplications({ data: { status: filter } });
      setApplications(rows);
      setSelected((current) => rows.find((row) => row.id === current?.id) ?? rows[0] ?? null);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Não foi possível carregar as candidaturas.",
      );
      setApplications([]);
    }
  }, [fetchApplications, filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleApplications = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    if (!term) return applications ?? [];
    return (applications ?? []).filter((application) =>
      [
        application.nome,
        application.email,
        application.empresa,
        application.cargo,
        application.cidade,
      ]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase("pt-BR").includes(term)),
    );
  }, [applications, query]);

  async function submitDecision() {
    if (!selected || !action) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (action === "approve") {
        await review({ data: { applicationId: selected.id, decision: "approve" } });
        setNotice("Candidatura aprovada e convite de ativação enviado.");
      } else {
        await review({
          data: { applicationId: selected.id, decision: "reject", reason: reason.trim() },
        });
        setNotice("Candidatura reprovada.");
      }
      setAction(null);
      setReason("");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível concluir a ação.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-[92rem] px-5 pb-32 pt-8 md:px-8 lg:px-10 lg:pb-16">
      <header className="border-b border-white/[0.1] pb-8 md:flex md:items-end md:justify-between md:gap-8">
        <div>
          <p className="text-[0.5625rem] uppercase tracking-[0.24em] text-white/34">
            COMUNIDADE / ENTRADAS
          </p>
          <h1 className="mt-4 text-3xl font-medium tracking-normal md:text-5xl">Candidaturas</h1>
          <p className="mt-3 text-sm text-white/42">
            Analise contexto, aprove o perfil e envie o acesso em uma única ação.
          </p>
        </div>
        <label className="relative mt-6 block w-full md:mt-0 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full border border-white/12 bg-white/[0.025] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/28 focus:border-white/40"
            placeholder="Nome, empresa ou cidade"
          />
        </label>
      </header>

      <div className="flex gap-6 overflow-x-auto border-b border-white/[0.1] py-5">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setFilter(item.value);
              setAction(null);
            }}
            className={cn(
              "shrink-0 border-b pb-2 text-[0.625rem] uppercase tracking-[0.18em] transition-colors",
              filter === item.value
                ? "border-white text-white"
                : "border-transparent text-white/35 hover:text-white/70",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="mt-6 flex items-center justify-between border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white/68">
          {notice}
          <button type="button" onClick={() => setNotice(null)} aria-label="Fechar aviso">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {error && <p className="mt-6 border-l border-white/30 pl-4 text-sm text-white/65">{error}</p>}

      <div className="grid min-h-[34rem] lg:grid-cols-[minmax(20rem,0.78fr)_minmax(28rem,1.22fr)]">
        <section className="border-white/[0.1] lg:border-r">
          {applications === null ? (
            <div className="space-y-px pt-5">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse border-b border-white/[0.08] bg-white/[0.025]"
                />
              ))}
            </div>
          ) : visibleApplications.length === 0 ? (
            <div className="py-20 pr-6">
              <p className="text-xl font-medium text-white/78">Nenhuma candidatura aqui.</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/38">
                Novas entradas aparecerão assim que o formulário público for enviado.
              </p>
            </div>
          ) : (
            <div>
              {visibleApplications.map((application) => (
                <button
                  key={application.id}
                  type="button"
                  onClick={() => {
                    setSelected(application);
                    setAction(null);
                  }}
                  className={cn(
                    "w-full border-b border-white/[0.08] py-5 pr-5 text-left transition-colors hover:bg-white/[0.025] lg:px-5",
                    selected?.id === application.id && "bg-white/[0.045]",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium text-white/86">
                        {application.nome || "Nome não informado"}
                      </p>
                      <p className="mt-1 truncate text-sm text-white/40">
                        {[application.cargo, application.empresa].filter(Boolean).join(" · ") ||
                          application.situacao_profissional}
                      </p>
                    </div>
                    <span className="shrink-0 text-[0.5rem] uppercase tracking-[0.16em] text-white/30">
                      {new Date(application.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/34">
                      {application.cidade || "Local não informado"}
                    </span>
                    <Status status={application.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="min-w-0 py-8 lg:px-10 lg:py-10">
          {selected ? (
            <ApplicationDetail
              application={selected}
              action={action}
              reason={reason}
              busy={busy}
              onAction={setAction}
              onReason={setReason}
              onSubmit={submitDecision}
            />
          ) : (
            <div className="flex min-h-64 items-center justify-center text-sm text-white/30">
              Selecione uma candidatura para analisar.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Status({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "border px-2 py-1 text-[0.5rem] uppercase tracking-[0.16em]",
        status === "approved" && "border-white/30 text-white/66",
        status === "pending" && "border-white/15 text-white/42",
        status === "rejected" && "border-white/10 text-white/28",
      )}
    >
      {statusLabel[status]}
    </span>
  );
}

function ApplicationDetail({
  application,
  action,
  reason,
  busy,
  onAction,
  onReason,
  onSubmit,
}: {
  application: Application;
  action: "approve" | "reject" | null;
  reason: string;
  busy: boolean;
  onAction: (action: "approve" | "reject" | null) => void;
  onReason: (reason: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="arimo-quiz-in">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/[0.1] pb-7">
        <div>
          <p className="text-[0.5625rem] uppercase tracking-[0.22em] text-white/32">
            APLICAÇÃO · {new Date(application.created_at).toLocaleDateString("pt-BR")}
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-normal text-white/92">
            {application.nome || "Candidatura"}
          </h2>
          <p className="mt-2 text-sm text-white/42">{application.email}</p>
        </div>
        <Status status={application.status} />
      </div>

      <dl className="grid gap-x-8 gap-y-6 border-b border-white/[0.1] py-8 sm:grid-cols-2">
        <Detail label="Momento" value={application.situacao_profissional} />
        <Detail label="Empresa" value={application.empresa || "Sem empresa informada"} />
        <Detail label="Cargo" value={application.cargo} />
        <Detail label="Segmento" value={application.segmento} />
        <Detail
          label="Cidade / País"
          value={[application.cidade, application.pais].filter(Boolean).join(", ")}
        />
        <Detail label="Estágio" value={application.faturamento_aproximado} />
        <Detail label="WhatsApp" value={application.telefone} />
        <Detail label="Origem" value={application.origem} />
      </dl>

      <div className="border-b border-white/[0.1] py-8">
        <p className="text-[0.5625rem] uppercase tracking-[0.22em] text-white/32">
          POR QUE QUER ENTRAR
        </p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/65">
          {application.motivacao || "Motivação não informada."}
        </p>
      </div>

      {application.status === "pending" && (
        <div className="pt-8">
          {action === null ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onAction("approve")}
                className="flex h-12 items-center justify-center gap-3 bg-white px-6 text-xs font-medium uppercase tracking-[0.18em] text-black hover:bg-white/85"
              >
                <UserCheck className="h-4 w-4" /> Aprovar
              </button>
              <button
                type="button"
                onClick={() => onAction("reject")}
                className="flex h-12 items-center justify-center gap-3 border border-white/15 px-6 text-xs uppercase tracking-[0.18em] text-white/50 hover:border-white/40 hover:text-white"
              >
                <UserX className="h-4 w-4" /> Recusar
              </button>
            </div>
          ) : (
            <div className="max-w-xl border border-white/15 bg-white/[0.025] p-5">
              <p className="text-sm font-medium text-white/82">
                {action === "approve"
                  ? "Aprovar e enviar o convite de ativação?"
                  : "Registrar a recusa desta candidatura?"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/42">
                {action === "approve"
                  ? "O membro receberá um e-mail para criar a própria senha. Nenhuma senha será criada pelo administrador."
                  : "O motivo é opcional e ficará restrito ao histórico administrativo."}
              </p>
              {action === "reject" && (
                <textarea
                  value={reason}
                  onChange={(event) => onReason(event.target.value)}
                  rows={3}
                  maxLength={500}
                  className="mt-5 w-full resize-none border border-white/15 bg-black/20 p-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40"
                  placeholder="Motivo interno — opcional"
                />
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={busy}
                  className="flex h-11 items-center gap-3 bg-white px-5 text-xs uppercase tracking-[0.16em] text-black disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" /> {busy ? "Processando" : "Confirmar"}
                </button>
                <button
                  type="button"
                  onClick={() => onAction(null)}
                  disabled={busy}
                  className="h-11 px-4 text-xs uppercase tracking-[0.16em] text-white/42 hover:text-white"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-[0.5625rem] uppercase tracking-[0.2em] text-white/30">{label}</dt>
      <dd className="mt-2 text-sm text-white/68">{value || "Não informado"}</dd>
    </div>
  );
}
