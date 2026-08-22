export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AppRole = "super_admin" | "admin" | "moderator" | "mentor" | "member" | "user";

export type ApplicationStatus = "pending" | "approved" | "rejected";

type ApplicationRow = {
  cargo: string | null;
  cidade: string | null;
  created_at: string;
  email: string;
  empresa: string | null;
  estado: string | null;
  faturamento_aproximado: string | null;
  id: string;
  instagram: string;
  invited_user_id: string | null;
  linkedin: string | null;
  lookup_token_hash: string | null;
  motivacao: string | null;
  nome: string | null;
  objetivos: string[];
  origem: string;
  pais: string | null;
  rejection_reason: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  segmento: string | null;
  site: string | null;
  situacao_profissional: string | null;
  status: ApplicationStatus;
  tamanho_empresa: string | null;
  telefone: string;
  updated_at: string;
  utms: Json;
};

type ApplicationInsert = {
  cargo?: string | null;
  cidade?: string | null;
  created_at?: string;
  email: string;
  empresa?: string | null;
  estado?: string | null;
  faturamento_aproximado?: string | null;
  id?: string;
  instagram: string;
  invited_user_id?: string | null;
  linkedin?: string | null;
  lookup_token_hash?: string | null;
  motivacao?: string | null;
  nome?: string | null;
  objetivos?: string[];
  origem?: string;
  pais?: string | null;
  rejection_reason?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  segmento?: string | null;
  site?: string | null;
  situacao_profissional?: string | null;
  status?: ApplicationStatus;
  tamanho_empresa?: string | null;
  telefone: string;
  updated_at?: string;
  utms?: Json;
};

type ApplicationUpdate = Partial<ApplicationInsert>;

type ProfileRow = {
  arimo_goal: string | null;
  avatar_url: string | null;
  bio: string | null;
  birth_date: string | null;
  business_model: string | null;
  can_help_with: string | null;
  city: string | null;
  company: string | null;
  company_size: string | null;
  country: string | null;
  cover_url: string | null;
  created_at: string;
  current_rank: string;
  employee_count: number | null;
  full_name: string | null;
  id: string;
  industry: string | null;
  instagram_url: string | null;
  interests: string[];
  job_title: string | null;
  linkedin_url: string | null;
  looking_for: string[];
  markets: string[];
  onboarding_completed: boolean;
  portfolio_url: string | null;
  profession: string | null;
  profile_completion: number;
  reputation_points: number;
  skills: string[];
  state: string | null;
  updated_at: string;
  user_id: string;
  username: string | null;
  website: string | null;
};

type ProfileInsert = {
  arimo_goal?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  birth_date?: string | null;
  business_model?: string | null;
  can_help_with?: string | null;
  city?: string | null;
  company?: string | null;
  company_size?: string | null;
  country?: string | null;
  cover_url?: string | null;
  created_at?: string;
  current_rank?: string;
  employee_count?: number | null;
  full_name?: string | null;
  id?: string;
  industry?: string | null;
  instagram_url?: string | null;
  interests?: string[];
  job_title?: string | null;
  linkedin_url?: string | null;
  looking_for?: string[];
  markets?: string[];
  onboarding_completed?: boolean;
  portfolio_url?: string | null;
  profession?: string | null;
  profile_completion?: number;
  reputation_points?: number;
  skills?: string[];
  state?: string | null;
  updated_at?: string;
  user_id: string;
  username?: string | null;
  website?: string | null;
};

type ProfileUpdate = Partial<ProfileInsert>;

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: string;
          metadata: Json;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          metadata?: Json;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: string;
          metadata?: Json;
        };
        Relationships: [];
      };
      lead_applications: {
        Row: ApplicationRow;
        Insert: ApplicationInsert;
        Update: ApplicationUpdate;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: AppRole;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: AppRole;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: AppRole;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      applications: {
        Row: ApplicationRow;
        Relationships: [];
      };
    };
    Functions: {
      get_application_status: {
        Args: { p_token: string };
        Returns: {
          status: ApplicationStatus;
          submitted_at: string;
          updated_at: string;
        }[];
      };
      has_current_role: {
        Args: { allowed_roles: AppRole[] };
        Returns: boolean;
      };
      has_role: {
        Args: { _role: AppRole; _user_id: string };
        Returns: boolean;
      };
      is_platform_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_platform_member: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      submit_application: {
        Args: {
          p_cargo: string;
          p_cidade: string;
          p_email: string;
          p_empresa: string;
          p_faturamento_aproximado: string;
          p_instagram: string;
          p_linkedin: string;
          p_motivacao: string;
          p_nome: string;
          p_objetivos: string[];
          p_origem: string;
          p_pais: string;
          p_segmento: string;
          p_site: string;
          p_situacao_profissional: string;
          p_telefone: string;
          p_utms: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      app_role: AppRole;
      application_status: ApplicationStatus;
    };
    CompositeTypes: Record<PropertyKey, never>;
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals["public"];

export type Tables<Name extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])> =
  (DefaultSchema["Tables"] & DefaultSchema["Views"])[Name]["Row"];

export type TablesInsert<Name extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][Name]["Insert"];

export type TablesUpdate<Name extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][Name]["Update"];

export type Enums<Name extends keyof DefaultSchema["Enums"]> = DefaultSchema["Enums"][Name];

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "moderator", "mentor", "member", "user"],
      application_status: ["pending", "approved", "rejected"],
    },
  },
} as const;
