-- Ensure RLS enabled on profiles
alter table public.profiles enable row level security;

-- Create SELECT policies if missing
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='profiles' and policyname='profiles_self_select'
  ) then
    create policy "profiles_self_select" on public.profiles
      for select using (id = auth.uid());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='profiles' and policyname='profiles_admin_select'
  ) then
    create policy "profiles_admin_select" on public.profiles
      for select using (
        exists (
          select 1 from public.profiles p
          where p.id = auth.uid() and p.role='admin' and p.status='active'
        )
      );
  end if;
end $$;

-- Upsert admin profiles for specified emails if users exist
with u as (
  select id, email from auth.users 
  where email in ('rafael.cunha@teomiimoveis.com.br','fabio.reis@teomiimoveis.com.br')
)
insert into public.profiles (id, role, status, first_name, last_name)
select 
  u.id,
  'admin' as role,
  'active' as status,
  split_part(u.email, '@', 1) as first_name,
  null as last_name
from u
on conflict (id) do update
  set role = excluded.role,
      status = excluded.status,
      updated_at = now();