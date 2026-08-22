import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Logo } from "@/components/ARIMO/Logo";
import { AvatarUpload } from "@/components/platform/AvatarUpload";
import { completeOnboarding } from "@/features/platform/server-functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [{ title: "Seu perfil · ARIMO CLUB" }, { name: "robots", content: "noindex" }],
  }),
  component: OnboardingPage,
});

const inputClass =
  "h-12 w-full border border-white/15 bg-white/[0.035] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/26 focus:border-white/55";
const textareaClass = `${inputClass} h-auto resize-none py-4 leading-relaxed`;
const labelClass = "mb-2 block text-[0.5625rem] uppercase tracking-[0.22em] text-white/40";
const goals = [
  "Clientes",
  "Networking",
  "Sócios",
  "Fornecedores",
  "Investimento",
  "Mentoria",
  "Contratações",
  "Parcerias",
  "Aprendizado",
];

type FormData = {
  fullName: string;
  username: string;
  avatarUrl: string;
  jobTitle: string;
  company: string;
  city: string;
  state: string;
  country: string;
  industry: string;
  website: string;
  companySize: string;
  bio: string;
  lookingFor: string[];
  canHelpWith: string;
  arimoGoal: string;
};

function OnboardingPage() {
  const { user, platform, isAdmin } = Route.useRouteContext();
  const navigate = useNavigate();
  const saveProfile = useServerFn(completeOnboarding);
  const profile = platform.profile;
  const editing = Boolean(profile?.onboarding_completed);
  const [step, setStep] = useState(editing ? 1 : 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FormData>({
    fullName: profile?.full_name || "",
    username: profile?.username || "",
    avatarUrl: profile?.avatar_url || "",
    jobTitle: profile?.job_title || "",
    company: profile?.company || "",
    city: profile?.city || "",
    state: profile?.state || "",
    country: profile?.country || "Brasil",
    industry: profile?.industry || "",
    website: profile?.website || "",
    companySize: profile?.company_size || "",
    bio: profile?.bio || "",
    lookingFor: profile?.looking_for || [],
    canHelpWith: profile?.can_help_with || "",
    arimoGoal: profile?.arimo_goal || "",
  });

  const progress = useMemo(() => Math.max(0, ((step - 1) / 4) * 100), [step]);

  function update<Key extends keyof FormData>(key: Key, value: FormData[Key]) {
    setData((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  function validateCurrentStep() {
    if (
      step === 1 &&
      (!data.fullName.trim() ||
        !data.username.trim() ||
        !data.jobTitle.trim() ||
        !data.city.trim() ||
        !data.country.trim())
    ) {
      setError("Preencha os campos essenciais para continuar.");
      return false;
    }
    if (
      step === 2 &&
      (!data.company.trim() || !data.industry.trim() || data.bio.trim().length < 20)
    ) {
      setError("Informe sua empresa, mercado e uma descrição com pelo menos 20 caracteres.");
      return false;
    }
    if (step === 3 && data.lookingFor.length === 0) {
      setError("Escolha pelo menos um objetivo dentro da ARIMO.");
      return false;
    }
    if (step === 4 && data.canHelpWith.trim().length < 10) {
      setError("Explique brevemente como você pode contribuir com a rede.");
      return false;
    }
    if (step === 5 && data.arimoGoal.trim().length < 10) {
      setError("Conte o que você pretende construir a partir da rede.");
      return false;
    }
    return true;
  }

  function next() {
    if (!validateCurrentStep()) return;
    setStep((current) => Math.min(5, current + 1));
  }

  async function finish() {
    if (!validateCurrentStep()) return;
    setBusy(true);
    setError(null);
    try {
      await saveProfile({ data });
      await navigate({ to: isAdmin ? "/admin/applications" : "/club" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar seu perfil.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] font-sans text-[#f5f5f3]">
      <div className="fixed inset-x-0 top-0 z-20 h-1 bg-white/[0.07]">
        <div
          className="h-full bg-white/75 transition-[width] duration-500"
          style={{ width: `${editing ? Math.max(20, progress) : progress}%` }}
        />
      </div>
      <header className="flex h-20 items-center justify-between border-b border-white/[0.08] px-6 md:px-10">
        <Logo className="w-14" />
        <span className="text-[0.5625rem] uppercase tracking-[0.22em] text-white/34">
          {step === 0 ? "BEM-VINDO" : `${step} / 5`}
        </span>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[74rem] items-center px-6 py-12 md:px-10">
        <div key={step} className="arimo-quiz-in w-full">
          {step === 0 && (
            <section className="max-w-3xl">
              <p className="text-[0.625rem] uppercase tracking-[0.28em] text-white/38">
                ACESSO CONFIRMADO
              </p>
              <h1 className="mt-6 text-[clamp(3rem,7vw,6.75rem)] font-medium leading-[0.93] tracking-normal">
                Bem-vindo à ARIMO.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/52 md:text-xl">
                Você agora faz parte de uma rede privada de empresários, operadores e líderes.
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="group mt-10 inline-flex h-13 items-center gap-12 bg-white px-6 text-xs font-medium uppercase tracking-[0.2em] text-black"
              >
                Entrar no Club
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </section>
          )}

          {step === 1 && (
            <OnboardingSection
              eyebrow={editing ? "ATUALIZAR PERFIL" : "PRIMEIRO, PRECISAMOS CONHECER VOCÊ"}
              title="Quem é você dentro do negócio?"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Nome completo">
                  <input
                    className={inputClass}
                    value={data.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </Field>
                <Field label="Username">
                  <input
                    className={inputClass}
                    value={data.username}
                    onChange={(e) => update("username", e.target.value)}
                    placeholder="pedro.silva"
                  />
                </Field>
                <Field label="Cargo">
                  <input
                    className={inputClass}
                    value={data.jobTitle}
                    onChange={(e) => update("jobTitle", e.target.value)}
                    placeholder="Founder, CEO, Diretor..."
                  />
                </Field>
                <Field label="Foto de perfil — opcional">
                  <AvatarUpload
                    userId={user.id}
                    value={data.avatarUrl}
                    name={data.fullName}
                    onChange={(value) => update("avatarUrl", value)}
                  />
                </Field>
                <Field label="Cidade">
                  <input
                    className={inputClass}
                    value={data.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Estado">
                    <input
                      className={inputClass}
                      value={data.state}
                      onChange={(e) => update("state", e.target.value)}
                    />
                  </Field>
                  <Field label="País">
                    <input
                      className={inputClass}
                      value={data.country}
                      onChange={(e) => update("country", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </OnboardingSection>
          )}

          {step === 2 && (
            <OnboardingSection
              eyebrow="O QUE VOCÊ ESTÁ CONSTRUINDO"
              title="Dê contexto ao seu negócio."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Empresa">
                  <input
                    className={inputClass}
                    value={data.company}
                    onChange={(e) => update("company", e.target.value)}
                  />
                </Field>
                <Field label="Mercado / segmento">
                  <input
                    className={inputClass}
                    value={data.industry}
                    onChange={(e) => update("industry", e.target.value)}
                  />
                </Field>
                <Field label="Site — opcional">
                  <input
                    className={inputClass}
                    value={data.website}
                    onChange={(e) => update("website", e.target.value)}
                    placeholder="https://"
                  />
                </Field>
                <Field label="Tamanho da empresa — opcional">
                  <select
                    className={inputClass}
                    value={data.companySize}
                    onChange={(e) => update("companySize", e.target.value)}
                  >
                    <option value="" className="bg-[#090909]">
                      Prefiro não informar
                    </option>
                    <option value="Sócio operador" className="bg-[#090909]">
                      Sócio operador
                    </option>
                    <option value="2–10 pessoas" className="bg-[#090909]">
                      2–10 pessoas
                    </option>
                    <option value="11–50 pessoas" className="bg-[#090909]">
                      11–50 pessoas
                    </option>
                    <option value="51–200 pessoas" className="bg-[#090909]">
                      51–200 pessoas
                    </option>
                    <option value="Mais de 200 pessoas" className="bg-[#090909]">
                      Mais de 200 pessoas
                    </option>
                  </select>
                </Field>
                <Field label="O que a empresa faz?" className="md:col-span-2">
                  <textarea
                    className={textareaClass}
                    rows={4}
                    value={data.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    placeholder="Descreva com clareza o que você vende, para quem e em qual mercado."
                  />
                </Field>
              </div>
            </OnboardingSection>
          )}

          {step === 3 && (
            <OnboardingSection eyebrow="SEU OBJETIVO" title="O que você procura dentro da ARIMO?">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => {
                  const active = data.lookingFor.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() =>
                        update(
                          "lookingFor",
                          active
                            ? data.lookingFor.filter((item) => item !== goal)
                            : [...data.lookingFor, goal],
                        )
                      }
                      className={cn(
                        "flex min-h-14 items-center justify-between border px-4 text-left text-sm transition-colors",
                        active
                          ? "border-white bg-white text-black"
                          : "border-white/15 text-white/58 hover:border-white/45 hover:text-white",
                      )}
                    >
                      {goal}
                      <Check className={cn("h-4 w-4", !active && "opacity-0")} />
                    </button>
                  );
                })}
              </div>
            </OnboardingSection>
          )}

          {step === 4 && (
            <OnboardingSection
              eyebrow="RECIPROCIDADE"
              title="Como você pode ajudar outros membros?"
            >
              <Field label="O que você oferece para a rede?">
                <textarea
                  className={textareaClass}
                  rows={6}
                  value={data.canHelpWith}
                  onChange={(e) => update("canHelpWith", e.target.value)}
                  placeholder="Experiência, mercado, contatos, conhecimento ou capacidade de execução."
                />
              </Field>
            </OnboardingSection>
          )}

          {step === 5 && (
            <OnboardingSection
              eyebrow="SUA INTENÇÃO"
              title="O que precisa acontecer para essa entrada valer a pena?"
            >
              <Field label="Objetivo dentro da ARIMO">
                <textarea
                  className={textareaClass}
                  rows={6}
                  value={data.arimoGoal}
                  onChange={(e) => update("arimoGoal", e.target.value)}
                  placeholder="Seja direto sobre o que você quer construir a partir daqui."
                />
              </Field>
            </OnboardingSection>
          )}

          {step > 0 && (
            <div className="mt-8 flex items-center gap-3 border-t border-white/[0.1] pt-6">
              <button
                type="button"
                onClick={() =>
                  editing && step === 1
                    ? navigate({ to: "/profile" })
                    : setStep((current) => Math.max(0, current - 1))
                }
                aria-label="Voltar"
                className="flex h-12 w-12 items-center justify-center border border-white/15 text-white/52 hover:border-white/45 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={step === 5 ? finish : next}
                disabled={busy}
                className="flex h-12 flex-1 items-center justify-between bg-white px-5 text-xs font-medium uppercase tracking-[0.18em] text-black disabled:opacity-55 sm:max-w-xs"
              >
                {busy
                  ? "Salvando"
                  : step === 5
                    ? editing
                      ? "Salvar alterações"
                      : "Concluir perfil"
                    : "Continuar"}
                {busy ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
          {error && <p className="mt-4 text-sm text-white/68">{error}</p>}
        </div>
      </div>
    </main>
  );
}

function OnboardingSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full max-w-4xl">
      <p className="text-[0.625rem] uppercase tracking-[0.26em] text-white/38">{eyebrow}</p>
      <h1 className="mt-5 max-w-3xl text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-[0.98] tracking-normal">
        {title}
      </h1>
      <div className="mt-9">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}
