
-- 1) Garantir o trigger que cria profiles ao criar usuários
-- Removemos se existir e recriamos para manter idempotência
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2) Backfill: criar perfis para usuários que ainda não têm registro em public.profiles
insert into public.profiles (id, role, status, first_name, last_name)
select u.id, 'viewer'::app_role, 'inactive', null, null
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 3) Promover administradores: definir role=admin e status=active
-- Ajuste a lista de e-mails conforme necessário
update public.profiles
set role = 'admin'::app_role,
    status = 'active'
where id in (
  select id from auth.users
  where email in (
    'rafael.cunha@teomiimoveis.com.br',
    'fabio.reis@teomiimoveis.com.br'
  )
);
