import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { PlatformShell } from "@/components/platform/PlatformShell";

export const Route = createFileRoute("/_authenticated/club")({
  head: () => ({
    meta: [{ title: "Início · ARIMO CLUB" }, { name: "robots", content: "noindex" }],
  }),
  component: ClubHome,
});

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function ClubHome() {
  const { platform, isAdmin } = Route.useRouteContext();
  const profile = platform.profile;
  const name = profile?.full_name?.split(" ")[0] || "membro";

  return (
    <PlatformShell name={profile?.full_name || "Membro ARIMO"} isAdmin={isAdmin} section="INÍCIO">
      <main className="mx-auto max-w-[76rem] px-5 pb-32 pt-10 md:px-8 md:pt-14 lg:px-12 lg:pb-20">
        <header className="border-b border-white/[0.1] pb-10 md:pb-14">
          <p className="text-[0.625rem] uppercase tracking-[0.25em] text-white/36">
            {getGreeting()}, {name}.
          </p>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.5rem,5vw,5.25rem)] font-medium leading-[0.98] tracking-normal">
            Sua entrada começa com contexto.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/52 md:text-lg">
            Seu perfil define quem deve encontrar você e quais conversas podem abrir a próxima
            porta.
          </p>
        </header>

        <section className="grid gap-10 py-10 md:grid-cols-[1fr_0.8fr] md:py-14">
          <div>
            <p className="text-[0.625rem] uppercase tracking-[0.24em] text-white/34">SEU ACESSO</p>
            <div className="mt-6 flex items-start gap-4 border-l border-white/20 pl-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white/65" strokeWidth={1.4} />
              <div>
                <h2 className="text-xl font-medium text-white/88">Perfil validado na rede</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/48">
                  Seus dados profissionais estão protegidos pelas regras de acesso da ARIMO e podem
                  ser atualizados a qualquer momento.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.1] pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <p className="text-[0.625rem] uppercase tracking-[0.24em] text-white/34">IDENTIDADE</p>
            <p className="mt-5 text-2xl font-medium text-white/90">{profile?.full_name}</p>
            <p className="mt-2 text-sm text-white/48">
              {[profile?.job_title, profile?.company].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-1 text-sm text-white/38">
              {[profile?.city, profile?.country].filter(Boolean).join(", ")}
            </p>
            <Link
              to="/profile"
              className="mt-7 inline-flex items-center gap-2 border-b border-white/30 pb-2 text-[0.625rem] uppercase tracking-[0.2em] text-white/62 transition-colors hover:text-white"
            >
              Ver meu perfil <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </PlatformShell>
  );
}
