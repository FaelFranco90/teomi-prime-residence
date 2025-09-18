-- Fix RLS for owners_stats view to make it properly secure
DROP VIEW IF EXISTS public.owners_stats;

-- Create a more secure view that respects proper access control
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

-- Enable RLS on the owners_stats view
ALTER VIEW public.owners_stats ENABLE ROW LEVEL SECURITY;

-- Add proper RLS policies for the owners_stats view
CREATE POLICY "owners_stats_select" ON public.owners_stats 
FOR SELECT 
USING (is_admin_or_editor_active());