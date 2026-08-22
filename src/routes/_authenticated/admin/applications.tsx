import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsAdmin } from "@/components/platform/ApplicationsAdmin";
import { PlatformShell } from "@/components/platform/PlatformShell";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  head: () => ({
    meta: [{ title: "Candidaturas · Administração ARIMO" }, { name: "robots", content: "noindex" }],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { platform } = Route.useRouteContext();
  return (
    <PlatformShell
      name={platform.profile?.full_name || "Administrador ARIMO"}
      isAdmin
      section="ADMINISTRAÇÃO"
    >
      <ApplicationsAdmin />
    </PlatformShell>
  );
}
