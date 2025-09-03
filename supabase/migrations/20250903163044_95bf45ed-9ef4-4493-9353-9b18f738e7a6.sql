
-- 1) Enum de status do imóvel
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
    CREATE TYPE public.property_status AS ENUM ('active','sold','inactive');
  END IF;
END$$;

-- 2) Coluna status na tabela properties
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS status public.property_status NOT NULL DEFAULT 'active';

-- 3) Função para sincronizar publicação conforme status
CREATE OR REPLACE FUNCTION public.properties_sync_is_published_on_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS NULL THEN
    NEW.status := 'active';
  END IF;

  -- active => publicado; sold/inactive => não publicado
  IF NEW.status = 'active' THEN
    NEW.is_published := true;
  ELSE
    NEW.is_published := false;
  END IF;

  RETURN NEW;
END;
$$;

-- 4) Triggers: em INSERT e ao atualizar apenas o campo status
DROP TRIGGER IF EXISTS trg_properties_sync_published_insert ON public.properties;
CREATE TRIGGER trg_properties_sync_published_insert
BEFORE INSERT ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.properties_sync_is_published_on_status();

DROP TRIGGER IF EXISTS trg_properties_sync_published_status_update ON public.properties;
CREATE TRIGGER trg_properties_sync_published_status_update
BEFORE UPDATE OF status ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.properties_sync_is_published_on_status();

-- 5) Backfill: ajustar status de acordo com publicação atual
UPDATE public.properties
SET status = CASE
  WHEN is_published THEN 'active'::public.property_status
  ELSE 'inactive'::public.property_status
END
WHERE status IS DISTINCT FROM CASE
  WHEN is_published THEN 'active'::public.property_status
  ELSE 'inactive'::public.property_status
END;

-- 6) View de estatísticas dos proprietários
CREATE OR REPLACE VIEW public.owners_stats AS
SELECT
  o.id,
  o.full_name,
  o.email,
  o.phone,
  o.document,
  o.notes,
  o.created_at,
  o.updated_at,
  COALESCE(COUNT(DISTINCT po.property_id), 0) AS total_properties,
  COALESCE(COUNT(DISTINCT CASE WHEN p.status = 'active' THEN po.property_id END), 0) AS active_properties,
  COALESCE(COUNT(DISTINCT CASE WHEN p.status = 'sold' THEN po.property_id END), 0) AS sold_properties,
  COALESCE(COUNT(DISTINCT CASE WHEN p.status = 'inactive' THEN po.property_id END), 0) AS inactive_properties,
  MAX(p.created_at) AS last_property_created_at
FROM public.owners o
LEFT JOIN public.property_owners po ON po.owner_id = o.id
LEFT JOIN public.properties p ON p.id = po.property_id
GROUP BY o.id;
