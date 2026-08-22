import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PlatformShell } from "@/components/platform/PlatformShell";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [{ title: "Meu perfil · ARIMO CLUB" }, { name: "robots", content: "noindex" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { platform, isAdmin } = Route.useRouteContext();
  const profile = platform.profile;

  return (
    <PlatformShell name={profile?.full_name || "Membro ARIMO"} isAdmin={isAdmin} section="PERFIL">
      <main className="mx-auto max-w-[76rem] px-5 pb-32 pt-10 md:px-8 md:pt-14 lg:px-12 lg:pb-20">
        <section className="border-b border-white/[0.1] pb-10 md:flex md:items-end md:justify-between md:gap-8 md:pb-14">
          <div className="flex items-start gap-5 md:gap-7">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.04] text-2xl uppercase text-white/72 md:h-28 md:w-28 md:text-3xl">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`Foto de ${profile.full_name || "membro ARIMO"}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile?.full_name?.slice(0, 1)
              )}
            </div>
            <div>
              <p className="text-[0.625rem] uppercase tracking-[0.24em] text-white/34">
                {profile?.current_rank} · {profile?.reputation_points} RP
              </p>
              <h1 className="mt-3 text-3xl font-medium tracking-normal md:text-5xl">
                {profile?.full_name}
              </h1>
              <p className="mt-3 text-sm text-white/52 md:text-base">
                {[profile?.job_title, profile?.company].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/36">
                <MapPin className="h-3.5 w-3.5" />
                {[profile?.city, profile?.state, profile?.country].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
          <Link
            to="/onboarding"
            className="mt-8 inline-flex items-center gap-2 border border-white/25 px-5 py-3 text-[0.625rem] uppercase tracking-[0.18em] text-white/65 transition-colors hover:border-white/60 hover:text-white md:mt-0"
          >
            Editar perfil <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        <section className="grid gap-10 py-10 md:grid-cols-[0.75fr_1.25fr] md:py-14">
          <div>
            <p className="text-[0.625rem] uppercase tracking-[0.24em] text-white/34">ATUAÇÃO</p>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-white/32">Mercado</dt>
                <dd className="mt-1 text-white/72">{profile?.industry || "Não informado"}</dd>
              </div>
              <div>
                <dt className="text-white/32">Empresa</dt>
                <dd className="mt-1 text-white/72">{profile?.company || "Não informada"}</dd>
              </div>
              <div>
                <dt className="text-white/32">Porte</dt>
                <dd className="mt-1 text-white/72">{profile?.company_size || "Não informado"}</dd>
              </div>
            </dl>
          </div>
          <div className="border-t border-white/[0.1] pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <p className="text-[0.625rem] uppercase tracking-[0.24em] text-white/34">SOBRE</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68 md:text-lg">
              {profile?.bio || "Conte à rede o que você está construindo."}
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-sm font-medium text-white/82">O que procuro</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/45">
                  {profile?.looking_for?.join(" · ") || "Não informado"}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-white/82">Como posso contribuir</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/45">
                  {profile?.can_help_with || "Não informado"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PlatformShell>
  );
}
