
-- 1) Nova coluna para visibilidade pública/privada das imagens
alter table public.property_images
add column if not exists is_public boolean not null default true;

-- 2) Trigger para garantir apenas 1 imagem principal por imóvel
create or replace function public.property_images_single_primary_tg()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $function$
begin
  if new.is_primary is true then
    if tg_op = 'INSERT' then
      update public.property_images
         set is_primary = false
       where property_id = new.property_id;
    else
      update public.property_images
         set is_primary = false
       where property_id = new.property_id
         and id <> new.id;
    end if;
  end if;
  return new;
end;
$function$;

drop trigger if exists property_images_single_primary on public.property_images;

create trigger property_images_single_primary
before insert or update of is_primary on public.property_images
for each row
execute function public.property_images_single_primary_tg();

-- 3) Índice único parcial para reforçar a unicidade da imagem principal
create unique index if not exists property_images_unique_primary
  on public.property_images (property_id)
  where is_primary = true;
