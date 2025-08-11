
-- Extensions (safe idempotent)
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- 0) Roles enum for profiles
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role' and typnamespace = 'public'::regnamespace) then
    create type public.app_role as enum ('admin','editor','viewer');
  end if;
end$$;

-- 1) Profiles table (for role+status based RLS checks)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'viewer',
  status text not null default 'inactive',
  first_name text,
  last_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at support (idempotent)
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- Auto-insert profile on user sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $fn$
begin
  insert into public.profiles (id, role, status, first_name, last_name)
  values (new.id, 'viewer', 'inactive', new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name')
  on conflict (id) do nothing;
  return new;
end;
$fn$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Seed: grant admin role to the known admin email and activate
insert into public.profiles (id, role, status)
select u.id, 'admin'::public.app_role, 'active'
from auth.users u
where u.email = 'rafael.cunha@teomiimoveis.com.br'
on conflict (id) do update set role=excluded.role, status=excluded.status;

-- 2) SECURITY DEFINER helper for RLS checks
create or replace function public.is_admin_or_editor_active()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin','editor')
  );
$$;

-- 3) Owners (private/internal only)
create table if not exists public.owners (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  document text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4) Property-Owners junction (N:N)
create table if not exists public.property_owners (
  property_id uuid not null references public.properties(id) on delete cascade,
  owner_id uuid not null references public.owners(id) on delete cascade,
  ownership_percent numeric(5,2),
  primary key (property_id, owner_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5) Indexes for owners search
create index if not exists idx_owners_full_name on public.owners using gin (full_name gin_trgm_ops);
create index if not exists idx_owners_email on public.owners (lower(email));
create index if not exists idx_owners_phone on public.owners (phone);

-- 6) updated_at triggers for owners and property_owners
drop trigger if exists trg_owners_updated_at on public.owners;
create trigger trg_owners_updated_at
before update on public.owners
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_property_owners_updated_at on public.property_owners;
create trigger trg_property_owners_updated_at
before update on public.property_owners
for each row execute function public.update_updated_at_column();

-- 7) RLS: only active admin/editor can read and write; anon gets nothing
alter table public.owners enable row level security;
alter table public.property_owners enable row level security;

-- Owners policies
drop policy if exists owners_select on public.owners;
create policy owners_select on public.owners
  for select using (public.is_admin_or_editor_active());

drop policy if exists owners_insert on public.owners;
create policy owners_insert on public.owners
  for insert with check (public.is_admin_or_editor_active());

drop policy if exists owners_update on public.owners;
create policy owners_update on public.owners
  for update using (public.is_admin_or_editor_active())
  with check (public.is_admin_or_editor_active());

drop policy if exists owners_delete on public.owners;
create policy owners_delete on public.owners
  for delete using (public.is_admin_or_editor_active());

-- Property_owners policies
drop policy if exists property_owners_select on public.property_owners;
create policy property_owners_select on public.property_owners
  for select using (public.is_admin_or_editor_active());

drop policy if exists property_owners_insert on public.property_owners;
create policy property_owners_insert on public.property_owners
  for insert with check (public.is_admin_or_editor_active());

drop policy if exists property_owners_update on public.property_owners;
create policy property_owners_update on public.property_owners
  for update using (public.is_admin_or_editor_active())
  with check (public.is_admin_or_editor_active());

drop policy if exists property_owners_delete on public.property_owners;
create policy property_owners_delete on public.property_owners
  for delete using (public.is_admin_or_editor_active());

-- 8) Ensure anon has no privileges
revoke all on public.owners from anon;
revoke all on public.property_owners from anon;
