-- Recreate owners_stats view - views inherit RLS from underlying tables
DROP VIEW IF EXISTS public.owners_stats;

CREATE VIEW public.owners_stats AS
SELECT 
  o.id,
  o.full_name,
  o.email,
  o.phone,
  o.document,
  o.notes,
  o.created_at,
  o.updated_at,
  COALESCE(stats.total_properties, 0) as total_properties,
  COALESCE(stats.active_properties, 0) as active_properties,
  COALESCE(stats.sold_properties, 0) as sold_properties,
  COALESCE(stats.inactive_properties, 0) as inactive_properties,
  stats.last_property_created_at
FROM public.owners o
LEFT JOIN (
  SELECT 
    po.owner_id,
    COUNT(*) as total_properties,
    COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_properties,
    COUNT(CASE WHEN p.status = 'sold' THEN 1 END) as sold_properties,
    COUNT(CASE WHEN p.status = 'inactive' THEN 1 END) as inactive_properties,
    MAX(p.created_at) as last_property_created_at
  FROM public.property_owners po
  JOIN public.properties p ON p.id = po.property_id
  GROUP BY po.owner_id
) stats ON stats.owner_id = o.id;