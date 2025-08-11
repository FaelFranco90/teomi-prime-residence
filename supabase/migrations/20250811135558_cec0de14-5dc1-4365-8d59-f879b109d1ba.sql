
-- 1) Tipos de imóvel
create table if not exists public.property_types (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,                       -- chave canonical: "casa", "apartamento"
  label text not null unique,                     -- rótulo exibido: "Casa", "Apartamento"
  prefix text not null unique,                    -- "CA", "AP", etc.
  active boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_types_key_lower check (key = lower(key)),
  constraint property_types_prefix_format check (prefix = upper(prefix) and char_length(prefix) = 2)
);

-- gatilho de updated_at
drop trigger if exists set_property_types_updated_at on public.property_types;
create trigger set_property_types_updated_at
before update on public.property_types
for each row
execute function public.update_updated_at_column();

-- RLS
alter table public.property_types enable row level security;

-- políticas
drop policy if exists "Property types are viewable by everyone" on public.property_types;
create policy "Property types are viewable by everyone"
on public.property_types for select
using (true);

drop policy if exists "Admin can insert property types" on public.property_types;
create policy "Admin can insert property types"
on public.property_types for insert
with check (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

drop policy if exists "Admin can update property types" on public.property_types;
create policy "Admin can update property types"
on public.property_types for update
using (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

drop policy if exists "Admin can delete property types" on public.property_types;
create policy "Admin can delete property types"
on public.property_types for delete
using (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

-- seed/atualização dos tipos padrão
insert into public.property_types (key, label, prefix, order_index, active)
values
  ('casa',         'Casa',         'CA', 1, true),
  ('apartamento',  'Apartamento',  'AP', 2, true),
  ('cobertura',    'Cobertura',    'CO', 3, true),
  ('penthouse',    'Penthouse',    'PH', 4, true),
  ('terreno',      'Terreno',      'TE', 5, true)
on conflict (key) do update
  set label = excluded.label,
      prefix = excluded.prefix,
      order_index = excluded.order_index,
      active = excluded.active;

-- 2) Tabela de sequências por prefixo (concorrência segura via UPSERT/UPDATE)
create table if not exists public.property_code_sequences (
  prefix text primary key,
  last_value integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_property_code_sequences_updated_at on public.property_code_sequences;
create trigger set_property_code_sequences_updated_at
before update on public.property_code_sequences
for each row
execute function public.update_updated_at_column();

alter table public.property_code_sequences enable row level security;

-- Apenas admin pode ler e alterar esta tabela
drop policy if exists "Admin can select property_code_sequences" on public.property_code_sequences;
create policy "Admin can select property_code_sequences"
on public.property_code_sequences for select
using (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

drop policy if exists "Admin can insert property_code_sequences" on public.property_code_sequences;
create policy "Admin can insert property_code_sequences"
on public.property_code_sequences for insert
with check (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

drop policy if exists "Admin can update property_code_sequences" on public.property_code_sequences;
create policy "Admin can update property_code_sequences"
on public.property_code_sequences for update
using (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

drop policy if exists "Admin can delete property_code_sequences" on public.property_code_sequences;
create policy "Admin can delete property_code_sequences"
on public.property_code_sequences for delete
using (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

-- 3) Função para gerar próximo código (incrementa a sequência)
create or replace function public.next_property_code(_property_type text)
returns text
language plpgsql
security definer
set search_path to ''
as $$
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
$$;

-- 4) Função para pré-visualizar (NÃO incrementa a sequência)
create or replace function public.preview_next_property_code(_property_type text)
returns text
language sql
security definer
set search_path to ''
stable
as $$
  select
    pt.prefix || lpad(((coalesce(seq.last_value, 0) + 1))::text, 4, '0') as next_code
  from public.property_types pt
  left join public.property_code_sequences seq
    on seq.prefix = pt.prefix
  where lower(pt.key) = lower(_property_type)
     or lower(pt.label) = lower(_property_type)
  limit 1;
$$;

-- 5) Trigger para preencher o code automaticamente no INSERT
create or replace function public.properties_set_code_on_insert()
returns trigger
language plpgsql
security definer
set search_path to ''
as $$
begin
  if NEW.code is null or btrim(NEW.code) = '' then
    NEW.code := public.next_property_code(NEW.property_type);
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_properties_set_code on public.properties;
create trigger trg_properties_set_code
before insert on public.properties
for each row
execute function public.properties_set_code_on_insert();

-- 6) Índice único em properties.code para evitar duplicação (pode falhar se já existir duplicado)
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public' and indexname = 'idx_properties_code_unique'
  ) then
    create unique index idx_properties_code_unique on public.properties (code);
  end if;
end$$;

-- 7) Backfill das sequências com base nos códigos existentes (formatados como PREFIX + 4 dígitos)
insert into public.property_code_sequences(prefix, last_value)
select
  pt.prefix,
  coalesce(max((regexp_match(p.code, ('^' || pt.prefix || '([0-9]{4})$')))[1]::int), 0) as max_num
from public.property_types pt
left join public.properties p
  on p.code ~ ('^' || pt.prefix || '[0-9]{4}$')
group by pt.prefix
on conflict (prefix) do update
  set last_value = greatest(public.property_code_sequences.last_value, excluded.last_value);

-- 8) Sincronizar sequências se o prefixo do tipo for alterado (gatilho pós-update)
create or replace function public.sync_sequence_on_prefix_change()
returns trigger
language plpgsql
security definer
set search_path to ''
as $$
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
$$;

drop trigger if exists trg_sync_seq_on_prefix_change on public.property_types;
create trigger trg_sync_seq_on_prefix_change
after update of prefix on public.property_types
for each row
execute function public.sync_sequence_on_prefix_change();
