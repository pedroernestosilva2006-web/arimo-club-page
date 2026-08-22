create extension if not exists pgcrypto with schema extensions;

do $$
begin
  create type public.application_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end
$$;

alter table public.lead_applications
  add column if not exists status public.application_status not null default 'pending',
  add column if not exists pais text,
  add column if not exists estado text,
  add column if not exists linkedin text,
  add column if not exists site text,
  add column if not exists tamanho_empresa text,
  add column if not exists objetivos text[] not null default '{}',
  add column if not exists origem text not null default 'website',
  add column if not exists utms jsonb not null default '{}',
  add column if not exists lookup_token_hash text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists rejection_reason text,
  add column if not exists invited_user_id uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists lead_applications_status_created_idx
  on public.lead_applications (status, created_at desc);
create index if not exists lead_applications_email_idx
  on public.lead_applications (lower(email));
create unique index if not exists lead_applications_lookup_token_idx
  on public.lead_applications (lookup_token_hash)
  where lookup_token_hash is not null;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  username text,
  full_name text,
  avatar_url text,
  cover_url text,
  birth_date date,
  city text,
  state text,
  country text,
  profession text,
  job_title text,
  company text,
  industry text,
  bio text,
  website text,
  portfolio_url text,
  linkedin_url text,
  instagram_url text,
  skills text[] not null default '{}',
  interests text[] not null default '{}',
  looking_for text[] not null default '{}',
  can_help_with text,
  company_size text,
  employee_count integer check (employee_count is null or employee_count >= 0),
  markets text[] not null default '{}',
  business_model text,
  arimo_goal text,
  onboarding_completed boolean not null default false,
  profile_completion smallint not null default 0 check (profile_completion between 0 and 100),
  reputation_points integer not null default 0 check (reputation_points >= 0),
  current_rank text not null default 'Membro',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username))
  where username is not null;
create index if not exists profiles_location_idx on public.profiles (country, state, city);
create index if not exists profiles_industry_idx on public.profiles (industry);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lead_applications_updated_at on public.lead_applications;
create trigger set_lead_applications_updated_at
before update on public.lead_applications
for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.has_current_role(allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = any(allowed_roles)
  );
$$;

revoke all on function public.has_current_role(public.app_role[]) from public, anon;
grant execute on function public.has_current_role(public.app_role[]) to authenticated;

create or replace function public.is_platform_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_current_role(
    array['super_admin', 'admin', 'moderator', 'mentor', 'member']::public.app_role[]
  );
$$;

revoke all on function public.is_platform_member() from public, anon;
grant execute on function public.is_platform_member() to authenticated;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_current_role(
    array['super_admin', 'admin']::public.app_role[]
  );
$$;

revoke all on function public.is_platform_admin() from public, anon;
grant execute on function public.is_platform_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Members can view profiles" on public.profiles;
create policy "Members can view profiles"
on public.profiles for select to authenticated
using (auth.uid() = user_id or public.is_platform_member());

drop policy if exists "Users can create their profile" on public.profiles;
create policy "Users can create their profile"
on public.profiles for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
on public.profiles for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Super admins can read audit logs" on public.audit_logs;
create policy "Super admins can read audit logs"
on public.audit_logs for select to authenticated
using (public.has_current_role(array['super_admin']::public.app_role[]));

drop policy if exists "Users can view their own roles" on public.user_roles;
create policy "Users and admins can view roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id or public.is_platform_admin());

drop policy if exists "Super admins can manage roles" on public.user_roles;
create policy "Super admins can manage roles"
on public.user_roles for all to authenticated
using (public.has_current_role(array['super_admin']::public.app_role[]))
with check (public.has_current_role(array['super_admin']::public.app_role[]));

drop policy if exists "Anyone can submit an application" on public.lead_applications;
drop policy if exists "Admins can view applications" on public.lead_applications;
drop policy if exists "Admins can update applications" on public.lead_applications;

create policy "Admins can view applications"
on public.lead_applications for select to authenticated
using (public.is_platform_admin());

create policy "Admins can update applications"
on public.lead_applications for update to authenticated
using (public.is_platform_admin())
with check (public.is_platform_admin());

revoke insert on public.lead_applications from anon, authenticated;
grant select, update on public.lead_applications to authenticated;
grant all on public.profiles, public.audit_logs to service_role;
grant select, insert, update on public.profiles to authenticated;
grant select on public.audit_logs to authenticated;

drop view if exists public.applications;
create view public.applications
with (security_invoker = true)
as select * from public.lead_applications;
grant select on public.applications to authenticated;
revoke all on public.applications from anon;

create or replace function public.submit_application(
  p_nome text,
  p_telefone text,
  p_email text,
  p_situacao_profissional text,
  p_segmento text,
  p_faturamento_aproximado text,
  p_motivacao text,
  p_empresa text,
  p_cargo text,
  p_cidade text,
  p_pais text,
  p_instagram text,
  p_linkedin text,
  p_site text,
  p_objetivos text[],
  p_origem text,
  p_utms jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  application_id uuid;
  lookup_token text;
  token_hash text;
begin
  if length(btrim(coalesce(p_nome, ''))) < 2 then
    raise exception 'Nome inválido';
  end if;
  if length(btrim(coalesce(p_telefone, ''))) < 10 then
    raise exception 'Telefone inválido';
  end if;
  if btrim(coalesce(p_email, '')) !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
    raise exception 'E-mail inválido';
  end if;

  lookup_token := encode(gen_random_bytes(24), 'hex');
  token_hash := encode(digest(lookup_token, 'sha256'), 'hex');

  select id into application_id
  from public.lead_applications
  where lower(email) = lower(btrim(p_email))
    and status = 'pending'
    and created_at > now() - interval '10 minutes'
  order by created_at desc
  limit 1;

  if application_id is not null then
    update public.lead_applications
    set lookup_token_hash = token_hash,
        updated_at = now()
    where id = application_id;
  else
    insert into public.lead_applications (
      nome,
      telefone,
      email,
      instagram,
      situacao_profissional,
      empresa,
      cargo,
      segmento,
      faturamento_aproximado,
      cidade,
      pais,
      linkedin,
      site,
      objetivos,
      motivacao,
      origem,
      utms,
      lookup_token_hash
    ) values (
      left(btrim(p_nome), 100),
      left(btrim(p_telefone), 30),
      lower(left(btrim(p_email), 255)),
      left(btrim(coalesce(p_instagram, 'Não informado')), 255),
      left(btrim(p_situacao_profissional), 120),
      nullif(left(btrim(coalesce(p_empresa, '')), 160), ''),
      nullif(left(btrim(coalesce(p_cargo, '')), 160), ''),
      left(btrim(p_segmento), 120),
      left(btrim(p_faturamento_aproximado), 120),
      nullif(left(btrim(coalesce(p_cidade, '')), 120), ''),
      nullif(left(btrim(coalesce(p_pais, '')), 120), ''),
      nullif(left(btrim(coalesce(p_linkedin, '')), 255), ''),
      nullif(left(btrim(coalesce(p_site, '')), 255), ''),
      coalesce(p_objetivos, '{}'),
      left(btrim(p_motivacao), 1000),
      left(coalesce(nullif(btrim(p_origem), ''), 'website'), 120),
      coalesce(p_utms, '{}'),
      token_hash
    ) returning id into application_id;
  end if;

  return jsonb_build_object(
    'id', application_id,
    'status', 'pending',
    'token', lookup_token
  );
end;
$$;

revoke all on function public.submit_application(
  text, text, text, text, text, text, text, text, text,
  text, text, text, text, text, text[], text, jsonb
) from public;
grant execute on function public.submit_application(
  text, text, text, text, text, text, text, text, text,
  text, text, text, text, text, text[], text, jsonb
) to anon, authenticated;

create or replace function public.get_application_status(p_token text)
returns table (
  status public.application_status,
  submitted_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select application.status, application.created_at, application.updated_at
  from public.lead_applications application
  where application.lookup_token_hash = encode(digest(p_token, 'sha256'), 'hex')
  limit 1;
$$;

revoke all on function public.get_application_status(text) from public;
grant execute on function public.get_application_status(text) to anon, authenticated;

drop trigger if exists on_auth_user_created_role on auth.users;
drop function if exists public.handle_new_user_role();

create or replace function public.handle_new_platform_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  application_id uuid;
  application_record public.lead_applications%rowtype;
begin
  insert into public.profiles (user_id, full_name, avatar_url)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (user_id) do nothing;

  begin
    application_id := nullif(new.raw_user_meta_data ->> 'application_id', '')::uuid;
  exception
    when invalid_text_representation then application_id := null;
  end;

  if application_id is not null then
    select * into application_record
    from public.lead_applications
    where id = application_id
      and status = 'approved'
      and lower(email) = lower(coalesce(new.email, ''));

    if found then
      insert into public.user_roles (user_id, role)
      values (new.id, 'member')
      on conflict (user_id, role) do nothing;

      update public.profiles
      set full_name = coalesce(application_record.nome, full_name),
          city = coalesce(application_record.cidade, city),
          country = coalesce(application_record.pais, country),
          job_title = coalesce(application_record.cargo, job_title),
          company = coalesce(application_record.empresa, company),
          industry = coalesce(application_record.segmento, industry),
          website = coalesce(application_record.site, website),
          linkedin_url = coalesce(application_record.linkedin, linkedin_url),
          instagram_url = coalesce(application_record.instagram, instagram_url),
          looking_for = coalesce(application_record.objetivos, looking_for),
          arimo_goal = coalesce(application_record.motivacao, arimo_goal)
      where user_id = new.id;

      update public.lead_applications
      set invited_user_id = new.id
      where id = application_id;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.handle_new_platform_user() from public, anon, authenticated;

create trigger on_auth_user_created_platform
after insert on auth.users
for each row execute function public.handle_new_platform_user();

insert into public.profiles (user_id, full_name, avatar_url)
select
  auth_user.id,
  nullif(auth_user.raw_user_meta_data ->> 'full_name', ''),
  nullif(auth_user.raw_user_meta_data ->> 'avatar_url', '')
from auth.users auth_user
on conflict (user_id) do nothing;

insert into public.user_roles (user_id, role)
select user_id, 'super_admin'::public.app_role
from public.user_roles
where role = 'admin'
order by created_at
limit 1
on conflict (user_id, role) do nothing;
