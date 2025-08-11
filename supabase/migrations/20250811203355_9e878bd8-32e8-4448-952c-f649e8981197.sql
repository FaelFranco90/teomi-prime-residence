-- Inserir perfil para o usuário fabio.reis@teomiimoveis.com.br
INSERT INTO public.profiles (id, role, status, first_name, last_name)
VALUES (
  '2da02736-5ebe-4a9a-b243-d29a544ec0eb',
  'admin',
  'active',
  'Fabio',
  'Reis'
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
  last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
  updated_at = now();