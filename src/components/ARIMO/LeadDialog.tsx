import { useState, type ReactNode } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z
    .string()
    .trim()
    .min(10, "Informe um telefone válido com DDD")
    .max(20)
    .regex(/^[0-9()+\-\s]+$/, "Use apenas números e (), +, -"),
  instagram: z
    .string()
    .trim()
    .max(40)
    .transform((value) => value || "Não informado"),
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  situacao_profissional: z.string().min(1, "Selecione seu momento profissional"),
  empresa: z.string().trim().max(120),
  cargo: z.string().trim().max(100),
  segmento: z.string().min(1, "Selecione um segmento"),
  faturamento_aproximado: z.string().min(1, "Selecione uma faixa"),
  cidade: z.string().trim().min(2, "Informe sua cidade").max(100),
  motivacao: z.string().trim().min(10, "Conte um pouco mais sobre sua motivação").max(1000),
});

type ApplicationData = z.infer<typeof schema>;
type Errors = Partial<Record<keyof ApplicationData, string>>;

const field =
  "w-full border-b border-current/30 bg-transparent py-3 text-sm font-light outline-none placeholder:text-current/35 focus:border-current";
const label = "text-[0.625rem] font-light uppercase tracking-[0.28em] opacity-60";

const fields: Array<{
  name: keyof ApplicationData;
  label: string;
  placeholder?: string;
  type?: string;
}> = [
  { name: "nome", label: "Nome", placeholder: "Seu nome", type: "text" },
  { name: "telefone", label: "WhatsApp", placeholder: "(11) 99999-9999", type: "tel" },
  {
    name: "instagram",
    label: "Instagram",
    placeholder: "@seuperfil ou deixe em branco",
    type: "text",
  },
  { name: "email", label: "E-mail", placeholder: "voce@email.com", type: "email" },
  {
    name: "empresa",
    label: "Empresa",
    placeholder: "Se ainda não tiver, deixe em branco",
    type: "text",
  },
  { name: "cargo", label: "Cargo", placeholder: "Sua função atual", type: "text" },
  { name: "cidade", label: "Cidade", placeholder: "Cidade / Estado", type: "text" },
];

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-xs text-ink-foreground/70">{message}</p> : null;
}

export function LeadDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ApplicationData;
        if (!next[key]) next[key] = issue.message;
      });
      setErrors(next);
      return;
    }

    setErrors({});
    setFailed(false);
    setSending(true);
    const { error } = await supabase.from("lead_applications").insert(parsed.data);
    setSending(false);
    if (error) return setFailed(true);
    setDone(true);
  }

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setDone(false);
      setFailed(false);
      setErrors({});
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-line-dark bg-ink text-ink-foreground sm:max-w-2xl">
        {done ? (
          <div className="py-10 text-center">
            <DialogHeader>
              <DialogTitle className="font-display text-4xl font-light">
                Candidatura recebida.
              </DialogTitle>
              <DialogDescription className="text-ink-foreground/60">
                Todas as candidaturas passam por análise. Entraremos em contato pelos dados
                informados.
              </DialogDescription>
            </DialogHeader>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-10 border border-ink-foreground/50 px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-ink-foreground hover:text-ink"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <p className={label}>ARIMO CLUB / APPLICATION</p>
              <DialogTitle className="font-display text-4xl font-light">Candidatura</DialogTitle>
              <DialogDescription className="text-ink-foreground/55">
                Você não precisa já ter uma empresa ou faturamento. Queremos entender seu momento,
                sua ambição e o que você busca construir.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={onSubmit}
              className="mt-6 grid gap-x-8 gap-y-7 md:grid-cols-2"
              noValidate
            >
              {fields.map((item) => (
                <div key={item.name}>
                  <label className={label} htmlFor={item.name}>
                    {item.label}
                  </label>
                  <input
                    id={item.name}
                    name={item.name}
                    type={item.type}
                    placeholder={item.placeholder}
                    className={field}
                  />
                  <FieldError message={errors[item.name]} />
                </div>
              ))}

              <div>
                <label className={label} htmlFor="situacao_profissional">
                  Seu momento
                </label>
                <select
                  id="situacao_profissional"
                  name="situacao_profissional"
                  defaultValue=""
                  className={field}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option>Tenho uma empresa</option>
                  <option>Estou começando e ainda não tenho empresa</option>
                  <option>Sou autônomo ou prestador de serviço</option>
                  <option>Trabalho em uma empresa</option>
                  <option>Estou validando uma ideia</option>
                </select>
                <FieldError message={errors.situacao_profissional} />
              </div>

              <div>
                <label className={label} htmlFor="segmento">
                  Segmento
                </label>
                <select id="segmento" name="segmento" defaultValue="" className={field}>
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option>Comércio</option>
                  <option>Serviços</option>
                  <option>Tecnologia</option>
                  <option>Indústria</option>
                  <option>Mercado financeiro</option>
                  <option>Imobiliário</option>
                  <option>Saúde</option>
                  <option>Educação</option>
                  <option>Ainda não definido</option>
                  <option>Outro</option>
                </select>
                <FieldError message={errors.segmento} />
              </div>

              <div className="md:col-span-2">
                <label className={label} htmlFor="faturamento_aproximado">
                  Faturamento aproximado
                </label>
                <select
                  id="faturamento_aproximado"
                  name="faturamento_aproximado"
                  defaultValue=""
                  className={field}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option>Ainda não faturo</option>
                  <option>Até R$ 10 mil por mês</option>
                  <option>R$ 10 mil a R$ 50 mil por mês</option>
                  <option>R$ 50 mil a R$ 200 mil por mês</option>
                  <option>R$ 200 mil a R$ 1 milhão por mês</option>
                  <option>Acima de R$ 1 milhão por mês</option>
                  <option>Prefiro não informar</option>
                </select>
                <FieldError message={errors.faturamento_aproximado} />
              </div>

              <div className="md:col-span-2">
                <label className={label} htmlFor="motivacao">
                  Por que você quer fazer parte do ARIMO CLUB?
                </label>
                <textarea
                  id="motivacao"
                  name="motivacao"
                  rows={4}
                  placeholder="Conte o que você está construindo e que tipo de relação ou oportunidade busca."
                  className={`${field} resize-none`}
                />
                <FieldError message={errors.motivacao} />
              </div>

              {failed && (
                <p className="text-sm text-ink-foreground/70 md:col-span-2">
                  Não foi possível enviar. A estrutura nova precisa estar aplicada no Supabase.
                </p>
              )}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full border border-ink-foreground/50 px-8 py-5 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-ink-foreground hover:text-ink disabled:opacity-50"
                >
                  {sending ? "Enviando..." : "Enviar candidatura →"}
                </button>
                <p className="mt-4 text-center text-xs text-ink-foreground/45">
                  Todas as candidaturas passam por análise.
                </p>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
