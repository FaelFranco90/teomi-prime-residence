
-- 1) Tabela de leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Dados do contato
  name text not null,
  email text,
  phone text,
  message text,

  -- Contexto/origem
  source text not null default 'contact_page', -- ex.: 'contact_page', 'property_detail'
  property_id uuid references public.properties(id) on delete set null,

  -- Acompanhamento
  status text not null default 'new', -- ex.: 'new', 'in_progress', 'won', 'lost'
  is_read boolean not null default false,
  admin_notes text,

  -- Atribuição/telemetria
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  origin_path text,     -- caminho da página (ex.: /imovel/xyz)
  ip_address text,
  user_agent text
);

-- 2) RLS
alter table public.leads enable row level security;

-- Qualquer visitante (anon ou authenticated) pode criar leads
create policy "Anyone can create leads"
on public.leads
for insert
to anon, authenticated
with check (true);

-- Apenas o admin pode visualizar
create policy "Admin can view leads"
on public.leads
for select
using (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

-- Apenas o admin pode atualizar
create policy "Admin can update leads"
on public.leads
for update
using (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

-- Apenas o admin pode deletar
create policy "Admin can delete leads"
on public.leads
for delete
using (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

-- 3) Trigger para updated_at
drop trigger if exists set_updated_at_on_leads on public.leads;
create trigger set_updated_at_on_leads
before update on public.leads
for each row
execute procedure public.update_updated_at_column();

-- 4) Índices úteis (opcionais)
create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_property_id on public.leads (property_id);
create index if not exists idx_leads_status on public.leads (status);
