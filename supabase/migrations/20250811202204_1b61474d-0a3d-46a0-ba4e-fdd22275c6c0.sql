-- Security improvements to address linter warnings

-- 1. Add missing RLS policies for profiles table
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (
    -- Allow users to view their own profile
    auth.uid() = id 
    -- Or allow admin/editor to view all profiles
    or is_admin_or_editor_active()
  );

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (
    -- Allow users to update their own profile
    auth.uid() = id
    -- Or allow admin/editor to update any profile  
    or is_admin_or_editor_active()
  ) with check (
    -- Same conditions for the WITH CHECK
    auth.uid() = id
    or is_admin_or_editor_active()
  );

-- 2. Fix search_path for functions to make them secure
create or replace function public.is_admin_or_editor_active()
returns boolean 
language sql 
stable 
security definer
set search_path to ''
as $$
  select exists(
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.status = 'active'
      and p.role in ('admin','editor')
  );
$$;

-- 3. Move pg_trgm extension out of public schema to extensions schema
create schema if not exists extensions;
drop extension if exists pg_trgm cascade;
create extension if not exists pg_trgm with schema extensions;

-- Recreate the trigram indexes with proper schema reference
drop index if exists public.idx_owners_full_name;
create index if not exists idx_owners_full_name on public.owners 
using gin (full_name extensions.gin_trgm_ops);

-- 4. Update function search paths for property code functions
create or replace function public.next_property_code(_property_type text)
returns text
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_prefix text;
  v_next int;
begin
  if _property_type is null or btrim(_property_type) = '' then
    raise exception 'property_type is required to generate code';
  end if;

  select pt.prefix
    into v_prefix
  from public.property_types pt
  where lower(pt.key) = lower(_property_type)
     or lower(pt.label) = lower(_property_type)
  limit 1;

  if v_prefix is null then
    raise exception 'Unknown property_type: %', _property_type;
  end if;

  loop
    update public.property_code_sequences
       set last_value = last_value + 1
     where prefix = v_prefix
     returning last_value into v_next;

    if found then
      exit;
    end if;

    begin
      insert into public.property_code_sequences(prefix, last_value)
      values (v_prefix, 0);
    exception when unique_violation then
      -- outro processo inseriu; tenta novamente
    end;
  end loop;

  return v_prefix || lpad(v_next::text, 4, '0');
end;
$function$;

create or replace function public.preview_next_property_code(_property_type text)
returns text
language sql
stable 
security definer
set search_path to 'public'
as $function$
  select
    pt.prefix || lpad(((coalesce(seq.last_value, 0) + 1))::text, 4, '0') as next_code
  from public.property_types pt
  left join public.property_code_sequences seq
    on seq.prefix = pt.prefix
  where lower(pt.key) = lower(_property_type)
     or lower(pt.label) = lower(_property_type)
  limit 1;
$function$;

create or replace function public.properties_set_code_on_insert()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if NEW.code is null or btrim(NEW.code) = '' then
    NEW.code := public.next_property_code(NEW.property_type);
  end if;
  return NEW;
end;
$function$;

create or replace function public.sync_sequence_on_prefix_change()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_last int;
begin
  if NEW.prefix = OLD.prefix then
    return NEW;
  end if;

  select coalesce(last_value, 0) into v_last
  from public.property_code_sequences
  where prefix = OLD.prefix;

  insert into public.property_code_sequences(prefix, last_value)
  values (NEW.prefix, v_last)
  on conflict (prefix) do update
    set last_value = greatest(public.property_code_sequences.last_value, excluded.last_value);

  delete from public.property_code_sequences where prefix = OLD.prefix;

  return NEW;
end;
$function$;

-- Create trigger for properties code generation if it doesn't exist
drop trigger if exists properties_set_code_on_insert on public.properties;
create trigger properties_set_code_on_insert
  before insert on public.properties
  for each row
  execute function public.properties_set_code_on_insert();