import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getPlatformContext } from "@/features/platform/server-functions";

const adminRoles = new Set(["super_admin", "admin"]);
const platformRoles = new Set(["super_admin", "admin", "moderator", "mentor", "member"]);

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });

    const platform = await getPlatformContext();
    if (!platform.roles.some((role) => platformRoles.has(role))) {
      throw redirect({ to: "/application-status", search: { token: "" } });
    }

    const isAdmin = platform.roles.some((role) => adminRoles.has(role));
    if (location.pathname.startsWith("/admin") && !isAdmin) {
      throw redirect({ to: "/club" });
    }

    const canOpenAdminWithoutOnboarding = isAdmin && location.pathname.startsWith("/admin");
    if (
      !platform.profile?.onboarding_completed &&
      location.pathname !== "/onboarding" &&
      !canOpenAdminWithoutOnboarding
    ) {
      throw redirect({ to: "/onboarding" });
    }

    return { user: data.user, platform, isAdmin };
  },
  component: () => <Outlet />,
});
