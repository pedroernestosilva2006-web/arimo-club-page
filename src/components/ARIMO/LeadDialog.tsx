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
  telefone: z
    .string()
    .trim()
    .min(10, { message: "Informe um telefone válido com DDD" })
    .max(20, { message: "Telefone muito longo" })
    .regex(/^[0-9()+\-\s]+$/, { message: "Use apenas números e (), +, -" }),
  instagram: z
    .string()
    .trim()
    .min(2, { message: "Informe seu @ do Instagram" })
    .max(40, { message: "Instagram muito longo" }),
  email: z
    .string()
    .trim()
    .email({ message: "Informe um e-mail válido" })
    .max(255, { message: "E-mail muito longo" }),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const field =
  "w-full border-b border-current/30 bg-transparent py-3 text-sm font-light tracking-wide outline-none placeholder:text-current/35 focus:border-current";
const label = "text-[0.625rem] font-light uppercase tracking-[0.35em] opacity-60";

export function LeadDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setFailed(false);
    setSending(true);
    const { error } = await supabase.from("lead_applications").insert(parsed.data);
    setSending(false);
    if (error) {
      setFailed(true);
      return;
    }
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
      <DialogContent className="border-line-dark bg-ink text-ink-foreground sm:max-w-md">
        {done ? (
          <div className="py-6 text-center">
            <DialogHeader>
              <DialogTitle className="font-display text-3xl font-light tracking-[-0.01em]">
                Candidatura recebida.
              </DialogTitle>
              <DialogDescription className="text-ink-foreground/60">
                Em breve entraremos em contato para avaliar seu perfil. Se aprovado, você será
                adicionado ao grupo do ARIMO CLUB.
              </DialogDescription>
            </DialogHeader>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-10 w-full border border-ink-foreground/50 px-8 py-4 text-[0.6875rem] font-light tracking-[0.3em] uppercase transition-colors duration-300 hover:bg-ink-foreground hover:text-ink"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-3xl font-light tracking-[-0.01em]">
                Entra pra mesa.
              </DialogTitle>
              <DialogDescription className="text-ink-foreground/55">
                Deixe seus contatos. Em breve entraremos em contato para ver se você foi aprovado e
                será adicionado ao grupo.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="mt-4 space-y-7" noValidate>
              <div>
                <label className={label} htmlFor="telefone">
                  Telefone
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  inputMode="tel"
                  maxLength={20}
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  className={field}
                />
                {errors.telefone && (
                  <p className="mt-2 text-xs text-ink-foreground/70">{errors.telefone}</p>
                )}
              </div>

              <div>
                <label className={label} htmlFor="instagram">
                  Instagram
                </label>
                <input
                  id="instagram"
                  name="instagram"
                  maxLength={40}
                  placeholder="@seuperfil"
                  className={field}
                />
                {errors.instagram && (
                  <p className="mt-2 text-xs text-ink-foreground/70">{errors.instagram}</p>
                )}
              </div>

              <div>
                <label className={label} htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={255}
                  autoComplete="email"
                  placeholder="voce@empresa.com"
                  className={field}
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-ink-foreground/70">{errors.email}</p>
                )}
              </div>

              {failed && (
                <p className="text-xs text-ink-foreground/70">
                  Não foi possível enviar agora. Tente novamente em instantes.
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full border border-ink-foreground/50 px-8 py-4 text-[0.6875rem] font-light tracking-[0.3em] uppercase transition-colors duration-300 hover:bg-ink-foreground hover:text-ink disabled:opacity-50"
              >
                {sending ? "Enviando…" : "Enviar candidatura"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

