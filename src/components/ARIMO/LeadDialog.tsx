import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
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
    .min(10, "Informe um WhatsApp válido com DDD")
    .max(20)
    .regex(/^[0-9()+\-\s]+$/, "Use apenas números e (), +, -"),
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  situacao_profissional: z.string().min(1, "Escolha a opção que melhor descreve você"),
  segmento: z.string().min(1, "Escolha sua área de atuação"),
  faturamento_aproximado: z.string().min(1, "Escolha o estágio atual"),
  motivacao: z.string().trim().min(8, "Conte brevemente o que você busca").max(500),
});

type QuizData = z.infer<typeof schema>;
type QuizKey = keyof QuizData;

const initialData: QuizData = {
  nome: "",
  telefone: "",
  email: "",
  situacao_profissional: "",
  segmento: "",
  faturamento_aproximado: "",
  motivacao: "",
};
const moments = [
  "Tenho uma empresa",
  "Sou autônomo ou prestador",
  "Trabalho em uma empresa",
  "Estou começando ou validando uma ideia",
];
const segments = [
  "Serviços",
  "Tecnologia",
  "Comércio",
  "Mercado financeiro",
  "Imobiliário",
  "Saúde ou educação",
  "Outro / ainda não definido",
];
const revenues = [
  "Ainda não faturo",
  "Até R$ 10 mil por mês",
  "R$ 10 mil a R$ 50 mil por mês",
  "R$ 50 mil a R$ 200 mil por mês",
  "Acima de R$ 200 mil por mês",
];
const stepFields: QuizKey[][] = [
  ["nome", "telefone", "email"],
  ["situacao_profissional"],
  ["segmento", "faturamento_aproximado"],
  ["motivacao"],
];
const field =
  "w-full border-b border-current/25 bg-transparent py-3 text-base font-light outline-none transition-colors placeholder:text-current/30 focus:border-current";
const label = "text-[0.625rem] font-light uppercase tracking-[0.28em] opacity-55";

function Choice({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-12 w-full items-center justify-between border px-4 py-3 text-left text-sm transition-all duration-300 sm:min-h-14 sm:px-5 ${active ? "border-[#d6d6d6] bg-[#d6d6d6] text-[#101010]" : "border-white/15 text-white/65 hover:border-white/45 hover:text-white"}`}
    >
      <span>{children}</span>
      <Check
        className={`h-4 w-4 shrink-0 transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
      />
    </button>
  );
}

export function LeadDialog({
  children,
  initialOpen = false,
}: {
  children: ReactNode;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [data, setData] = useState<QuizData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<QuizKey, string>>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  function update(key: QuizKey, value: string) {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validateStep() {
    const result = schema.safeParse(data);
    const nextErrors: Partial<Record<QuizKey, string>> = {};
    if (!result.success)
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as QuizKey;
        if (stepFields[step].includes(key) && !nextErrors[key]) nextErrors[key] = issue.message;
      });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    setDirection("next");
    setStep((current) => Math.min(current + 1, stepFields.length - 1));
  }

  function back() {
    setErrors({});
    setDirection("back");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submit() {
    if (!validateStep()) return;
    setFailed(false);
    setSending(true);
    const { error } = await supabase.from("lead_applications").insert({
      ...data,
      instagram: "Não informado",
      empresa: "",
      cargo: "",
      cidade: "Não informada",
    });
    setSending(false);
    if (error) return setFailed(true);
    setDone(true);
  }

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next)
      window.setTimeout(() => {
        setStep(0);
        setData(initialData);
        setErrors({});
        setDone(false);
        setFailed(false);
      }, 200);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[94vh] overflow-y-auto border-white/15 bg-[#101010] p-0 text-white sm:max-w-xl sm:rounded-none">
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-white to-[#8a8a8a] transition-[width] duration-700 ease-out"
            style={{ width: done ? "100%" : `${((step + 1) / stepFields.length) * 100}%` }}
          />
        </div>
        {done ? (
          <div className="arimo-quiz-in px-7 py-16 text-center sm:px-12 sm:py-20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-white/55 text-white">
              <Check className="h-5 w-5" />
            </div>
            <DialogHeader className="mt-8 text-center sm:text-center">
              <DialogTitle className="font-display text-4xl font-light">
                Candidatura recebida.
              </DialogTitle>
              <DialogDescription className="mx-auto mt-3 max-w-sm text-white/55">
                Nossa equipe vai analisar seu perfil e entrar em contato pelos dados informados.
              </DialogDescription>
            </DialogHeader>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-10 border border-white/35 px-8 py-4 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-white hover:text-black"
            >
              Concluir
            </button>
          </div>
        ) : (
          <div className="px-6 pb-7 pt-6 sm:px-10 sm:pb-10 sm:pt-8">
            <div className="flex items-center justify-between pr-9">
              <p className={label}>ARIMO CLUB / CANDIDATURA</p>
              <span className="text-[0.625rem] tracking-[0.2em] text-white/40">
                {step + 1} de {stepFields.length}
              </span>
            </div>
            <div key={step} className={direction === "next" ? "arimo-quiz-in" : "arimo-quiz-back"}>
              {step === 0 && (
                <section className="mt-9">
                  <h2 className="font-display text-4xl font-light sm:text-5xl">Vamos começar.</h2>
                  <p className="mt-3 text-sm text-white/50">Leva menos de dois minutos.</p>
                  <div className="mt-9 space-y-6">
                    {(
                      [
                        ["nome", "Seu nome", "Como podemos chamar você?", "text"],
                        ["telefone", "WhatsApp", "(11) 99999-9999", "tel"],
                        ["email", "E-mail", "voce@email.com", "email"],
                      ] as const
                    ).map(([name, title, placeholder, type]) => (
                      <div key={name}>
                        <label className={label} htmlFor={`quiz-${name}`}>
                          {title}
                        </label>
                        <input
                          id={`quiz-${name}`}
                          type={type}
                          value={data[name]}
                          onChange={(event) => update(name, event.target.value)}
                          placeholder={placeholder}
                          className={field}
                          autoFocus={name === "nome"}
                        />
                        {errors[name] && (
                          <p className="mt-2 text-xs text-white/65">{errors[name]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {step === 1 && (
                <section className="mt-9">
                  <p className={label}>SEU MOMENTO</p>
                  <h2 className="mt-4 font-display text-4xl font-light sm:text-5xl">
                    Onde você está agora?
                  </h2>
                  <div className="mt-8 grid gap-3">
                    {moments.map((option) => (
                      <Choice
                        key={option}
                        active={data.situacao_profissional === option}
                        onClick={() => update("situacao_profissional", option)}
                      >
                        {option}
                      </Choice>
                    ))}
                  </div>
                  {errors.situacao_profissional && (
                    <p className="mt-3 text-xs text-white/65">{errors.situacao_profissional}</p>
                  )}
                </section>
              )}
              {step === 2 && (
                <section className="mt-9">
                  <p className={label}>SEU NEGÓCIO</p>
                  <h2 className="mt-4 font-display text-4xl font-light sm:text-5xl">
                    Qual é o seu cenário?
                  </h2>
                  <p className="mt-7 text-xs uppercase tracking-[0.22em] text-white/45">
                    Área de atuação
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {segments.map((option) => (
                      <Choice
                        key={option}
                        active={data.segmento === option}
                        onClick={() => update("segmento", option)}
                      >
                        {option}
                      </Choice>
                    ))}
                  </div>
                  {errors.segmento && (
                    <p className="mt-3 text-xs text-white/65">{errors.segmento}</p>
                  )}
                  <p className="mt-7 text-xs uppercase tracking-[0.22em] text-white/45">
                    Estágio atual
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {revenues.map((option) => (
                      <Choice
                        key={option}
                        active={data.faturamento_aproximado === option}
                        onClick={() => update("faturamento_aproximado", option)}
                      >
                        {option}
                      </Choice>
                    ))}
                  </div>
                  {errors.faturamento_aproximado && (
                    <p className="mt-3 text-xs text-white/65">{errors.faturamento_aproximado}</p>
                  )}
                </section>
              )}
              {step === 3 && (
                <section className="mt-9">
                  <p className={label}>ÚLTIMA PERGUNTA</p>
                  <h2 className="mt-4 font-display text-4xl font-light sm:text-5xl">
                    O que você busca no ARIMO?
                  </h2>
                  <textarea
                    value={data.motivacao}
                    onChange={(event) => update("motivacao", event.target.value)}
                    rows={5}
                    autoFocus
                    maxLength={500}
                    placeholder="Conexões, repertório, oportunidades..."
                    className={`${field} mt-10 resize-none border border-white/20 p-4 focus:border-white/60`}
                  />
                  <div className="mt-2 flex justify-between text-xs text-white/50">
                    <span>{errors.motivacao}</span>
                    <span>{data.motivacao.length}/500</span>
                  </div>
                  {failed && (
                    <p className="mt-5 text-sm text-white/65">
                      Não foi possível enviar agora. Tente novamente.
                    </p>
                  )}
                </section>
              )}
            </div>
            <div className="mt-9 flex items-center gap-3 border-t border-white/10 pt-6">
              {step > 0 && (
                <button
                  type="button"
                  onClick={back}
                  aria-label="Voltar"
                  className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/20 text-white/60 transition-colors hover:border-white/60 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={step === stepFields.length - 1 ? submit : next}
                disabled={sending}
                className="flex h-12 flex-1 items-center justify-between bg-white px-5 text-xs uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#c8c8c8] disabled:opacity-50"
              >
                <span>
                  {sending
                    ? "Enviando"
                    : step === stepFields.length - 1
                      ? "Enviar candidatura"
                      : "Continuar"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
