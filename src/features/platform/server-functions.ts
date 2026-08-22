import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { AppRole, Database, TablesUpdate } from "@/integrations/supabase/types";

const adminRoles = new Set<AppRole>(["super_admin", "admin"]);
const platformRoles = new Set<AppRole>(["super_admin", "admin", "moderator", "mentor", "member"]);

const applicationFilterSchema = z.object({
  status: z.enum(["all", "pending", "approved", "rejected"]).default("pending"),
});

const reviewApplicationSchema = z.discriminatedUnion("decision", [
  z.object({
    applicationId: z.string().uuid(),
    decision: z.literal("approve"),
  }),
  z.object({
    applicationId: z.string().uuid(),
    decision: z.literal("reject"),
    reason: z.string().trim().max(500).default(""),
  }),
]);

const onboardingSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9._-]+$/, "Use apenas letras, números, ponto, hífen ou sublinhado"),
  avatarUrl: z.union([z.string().url(), z.literal("")]).default(""),
  jobTitle: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  city: z.string().trim().min(2).max(120),
  state: z.string().trim().max(120).default(""),
  country: z.string().trim().min(2).max(120),
  industry: z.string().trim().min(2).max(120),
  website: z.union([z.string().url(), z.literal("")]).default(""),
  companySize: z.string().trim().max(80).default(""),
  bio: z.string().trim().min(20).max(500),
  lookingFor: z.array(z.string().trim().min(2).max(80)).min(1).max(9),
  canHelpWith: z.string().trim().min(10).max(500),
  arimoGoal: z.string().trim().min(10).max(500),
});

async function readRoles(supabase: SupabaseClient<Database>, userId: string) {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw new Error("Não foi possível validar suas permissões.");
  return (data ?? []).map(({ role }) => role);
}

function requireAdmin(roles: AppRole[]) {
  if (!roles.some((role) => adminRoles.has(role))) {
    throw new Error("Acesso permitido apenas para administradores.");
  }
}

function getApplicationUrl() {
  const configured = process.env["APP_URL"];
  if (configured?.startsWith("https://") || configured?.startsWith("http://")) {
    return configured.replace(/\/$/, "");
  }

  const vercelProductionUrl = process.env["VERCEL_PROJECT_PRODUCTION_URL"];
  if (vercelProductionUrl) return `https://${vercelProductionUrl}`;

  return "http://localhost:5173";
}

export const getPlatformContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [rolesResult, profileResult] = await Promise.all([
      context.supabase.from("user_roles").select("role").eq("user_id", context.userId),
      context.supabase.from("profiles").select("*").eq("user_id", context.userId).maybeSingle(),
    ]);

    if (rolesResult.error) throw new Error("Não foi possível carregar suas permissões.");
    if (profileResult.error) throw new Error("Não foi possível carregar seu perfil.");

    return {
      userId: context.userId,
      roles: (rolesResult.data ?? []).map(({ role }) => role),
      profile: profileResult.data,
    };
  });

export const getAdminApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => applicationFilterSchema.parse(input))
  .handler(async ({ context, data }) => {
    const roles = await readRoles(context.supabase, context.userId);
    requireAdmin(roles);

    let query = context.supabase
      .from("lead_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (data.status !== "all") query = query.eq("status", data.status);
    const result = await query;
    if (result.error) throw new Error("Não foi possível carregar as candidaturas.");

    return result.data;
  });

export const reviewApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => reviewApplicationSchema.parse(input))
  .handler(async ({ context, data }) => {
    const roles = await readRoles(context.supabase, context.userId);
    requireAdmin(roles);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const applicationResult = await supabaseAdmin
      .from("lead_applications")
      .select("*")
      .eq("id", data.applicationId)
      .single();

    if (applicationResult.error || !applicationResult.data) {
      throw new Error("Candidatura não encontrada.");
    }

    const application = applicationResult.data;
    const reviewedAt = new Date().toISOString();

    if (application.status !== "pending") {
      if (application.status === "approved" && application.invited_user_id) {
        return { status: "approved" as const, userId: application.invited_user_id };
      }
      throw new Error("Esta candidatura já foi analisada por outro administrador.");
    }

    if (data.decision === "reject") {
      const updateResult = await supabaseAdmin
        .from("lead_applications")
        .update({
          status: "rejected",
          rejection_reason: data.reason || null,
          reviewed_at: reviewedAt,
          reviewed_by: context.userId,
        })
        .eq("id", application.id)
        .eq("status", "pending")
        .select("id")
        .maybeSingle();

      if (updateResult.error) throw new Error("Não foi possível recusar a candidatura.");
      if (!updateResult.data) {
        throw new Error("Esta candidatura já foi analisada por outro administrador.");
      }

      await supabaseAdmin.from("audit_logs").insert({
        actor_id: context.userId,
        action: "application.rejected",
        entity_type: "application",
        entity_id: application.id,
        metadata: { reason: data.reason || null },
      });

      return { status: "rejected" as const };
    }

    const approvalResult = await supabaseAdmin
      .from("lead_applications")
      .update({
        status: "approved",
        rejection_reason: null,
        reviewed_at: reviewedAt,
        reviewed_by: context.userId,
      })
      .eq("id", application.id)
      .eq("status", "pending")
      .is("invited_user_id", null)
      .select("id")
      .maybeSingle();

    if (approvalResult.error) throw new Error("Não foi possível aprovar a candidatura.");
    if (!approvalResult.data) {
      throw new Error("Esta candidatura já está sendo analisada por outro administrador.");
    }

    const inviteResult = await supabaseAdmin.auth.admin.inviteUserByEmail(application.email, {
      data: {
        application_id: application.id,
        full_name: application.nome,
        invited_by_admin: true,
      },
      redirectTo: `${getApplicationUrl()}/activate`,
    });

    if (inviteResult.error || !inviteResult.data.user) {
      await supabaseAdmin
        .from("lead_applications")
        .update({ status: "pending", reviewed_at: null, reviewed_by: null })
        .eq("id", application.id)
        .eq("status", "approved")
        .is("invited_user_id", null)
        .eq("reviewed_by", context.userId);
      throw new Error(
        inviteResult.error?.message ||
          "A aprovação foi revertida porque o convite não foi enviado.",
      );
    }

    await supabaseAdmin
      .from("lead_applications")
      .update({ invited_user_id: inviteResult.data.user.id })
      .eq("id", application.id);

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "application.approved",
      entity_type: "application",
      entity_id: application.id,
      metadata: { invited_user_id: inviteResult.data.user.id },
    });

    return { status: "approved" as const, userId: inviteResult.data.user.id };
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => onboardingSchema.parse(input))
  .handler(async ({ context, data }) => {
    const roles = await readRoles(context.supabase, context.userId);
    if (!roles.some((role) => platformRoles.has(role))) {
      throw new Error("Sua conta ainda não possui acesso de membro.");
    }

    const profile: TablesUpdate<"profiles"> = {
      full_name: data.fullName,
      username: data.username,
      avatar_url: data.avatarUrl || null,
      job_title: data.jobTitle,
      company: data.company,
      city: data.city,
      state: data.state || null,
      country: data.country,
      industry: data.industry,
      website: data.website || null,
      company_size: data.companySize || null,
      bio: data.bio,
      looking_for: data.lookingFor,
      can_help_with: data.canHelpWith,
      arimo_goal: data.arimoGoal,
      onboarding_completed: true,
      profile_completion: 100,
    };

    const result = await context.supabase
      .from("profiles")
      .update(profile)
      .eq("user_id", context.userId)
      .select("*")
      .single();

    if (result.error) {
      if (result.error.code === "23505") throw new Error("Esse nome de usuário já está em uso.");
      throw new Error("Não foi possível concluir seu perfil.");
    }

    return result.data;
  });
