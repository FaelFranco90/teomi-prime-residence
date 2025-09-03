
-- 1) Promover Fabio (se existir em auth.users) a admin/active no profiles
WITH usr AS (
  SELECT id FROM auth.users WHERE email = 'fabio.reis@teomiimoveis.com.br' LIMIT 1
)
INSERT INTO public.profiles (id, role, status)
SELECT id, 'admin'::app_role, 'active' FROM usr
ON CONFLICT (id) DO UPDATE
  SET role = EXCLUDED.role,
      status = EXCLUDED.status;

-- 2) Atualizar RLS dos leads
-- Remover políticas antigas baseadas em e-mail fixo
DROP POLICY IF EXISTS "Admin can view leads" ON public.leads;
DROP POLICY IF EXISTS "Admin can update leads" ON public.leads;
DROP POLICY IF EXISTS "Admin can delete leads" ON public.leads;

-- Criar políticas para admin/editor (mantendo compatibilidade com o e-mail do Rafael)
CREATE POLICY "Admins/editors can view leads"
  ON public.leads
  FOR SELECT
  USING (public.is_admin_or_editor_active() OR auth.email() = 'rafael.cunha@teomiimoveis.com.br');

CREATE POLICY "Admins/editors can update leads"
  ON public.leads
  FOR UPDATE
  USING (public.is_admin_or_editor_active() OR auth.email() = 'rafael.cunha@teomiimoveis.com.br')
  WITH CHECK (public.is_admin_or_editor_active() OR auth.email() = 'rafael.cunha@teomiimoveis.com.br');

CREATE POLICY "Admins/editors can delete leads"
  ON public.leads
  FOR DELETE
  USING (public.is_admin_or_editor_active() OR auth.email() = 'rafael.cunha@teomiimoveis.com.br');

-- Importante: Mantemos a política de INSERT já existente ("Anyone can create leads")

-- 3) Atualizar RLS de property_code_sequences
-- Remover políticas antigas baseadas em e-mail fixo
DROP POLICY IF EXISTS "Admin can select property_code_sequences" ON public.property_code_sequences;
DROP POLICY IF EXISTS "Admin can insert property_code_sequences" ON public.property_code_sequences;
DROP POLICY IF EXISTS "Admin can update property_code_sequences" ON public.property_code_sequences;
DROP POLICY IF EXISTS "Admin can delete property_code_sequences" ON public.property_code_sequences;

-- Criar políticas para admin/editor (mantendo compatibilidade com o e-mail do Rafael)
CREATE POLICY "Admins/editors can select property_code_sequences"
  ON public.property_code_sequences
  FOR SELECT
  USING (public.is_admin_or_editor_active() OR auth.email() = 'rafael.cunha@teomiimoveis.com.br');

CREATE POLICY "Admins/editors can insert property_code_sequences"
  ON public.property_code_sequences
  FOR INSERT
  WITH CHECK (public.is_admin_or_editor_active() OR auth.email() = 'rafael.cunha@teomiimoveis.com.br');

CREATE POLICY "Admins/editors can update property_code_sequences"
  ON public.property_code_sequences
  FOR UPDATE
  USING (public.is_admin_or_editor_active() OR auth.email() = 'rafael.cunha@teomiimoveis.com.br');

CREATE POLICY "Admins/editors can delete property_code_sequences"
  ON public.property_code_sequences
  FOR DELETE
  USING (public.is_admin_or_editor_active() OR auth.email() = 'rafael.cunha@teomiimoveis.com.br');

-- 4) owners_stats: permitir leitura para usuários autenticados (necessário no Admin > Proprietários)
REVOKE ALL ON public.owners_stats FROM PUBLIC;
GRANT SELECT ON public.owners_stats TO authenticated;
