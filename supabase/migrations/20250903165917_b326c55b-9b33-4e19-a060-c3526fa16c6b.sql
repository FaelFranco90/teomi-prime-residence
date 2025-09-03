
-- 1) PROPERTIES: substituir RLS para usar is_admin_or_editor_active()

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Admin can update properties" ON public.properties;
DROP POLICY IF EXISTS "Admin can delete properties" ON public.properties;

-- Mantém a policy pública de SELECT já existente ("Properties are viewable by everyone")

CREATE POLICY "properties_insert_admin_editor"
  ON public.properties
  FOR INSERT
  WITH CHECK (public.is_admin_or_editor_active());

CREATE POLICY "properties_update_admin_editor"
  ON public.properties
  FOR UPDATE
  USING (public.is_admin_or_editor_active());

CREATE POLICY "properties_delete_admin_editor"
  ON public.properties
  FOR DELETE
  USING (public.is_admin_or_editor_active());

-- 2) PROPERTY_IMAGES: substituir RLS para usar is_admin_or_editor_active()

ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can insert property images" ON public.property_images;
DROP POLICY IF EXISTS "Admin can update property images" ON public.property_images;
DROP POLICY IF EXISTS "Admin can delete property images" ON public.property_images;

-- Mantém a policy pública de SELECT já existente ("Property images are viewable by everyone")

CREATE POLICY "property_images_insert_admin_editor"
  ON public.property_images
  FOR INSERT
  WITH CHECK (public.is_admin_or_editor_active());

CREATE POLICY "property_images_update_admin_editor"
  ON public.property_images
  FOR UPDATE
  USING (public.is_admin_or_editor_active());

CREATE POLICY "property_images_delete_admin_editor"
  ON public.property_images
  FOR DELETE
  USING (public.is_admin_or_editor_active());

-- 3) PROPERTY_TYPES: alinhar RLS

ALTER TABLE public.property_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can insert property types" ON public.property_types;
DROP POLICY IF EXISTS "Admin can update property types" ON public.property_types;
DROP POLICY IF EXISTS "Admin can delete property types" ON public.property_types;

-- Mantém a policy pública de SELECT já existente ("Property types are viewable by everyone")

CREATE POLICY "property_types_insert_admin_editor"
  ON public.property_types
  FOR INSERT
  WITH CHECK (public.is_admin_or_editor_active());

CREATE POLICY "property_types_update_admin_editor"
  ON public.property_types
  FOR UPDATE
  USING (public.is_admin_or_editor_active());

CREATE POLICY "property_types_delete_admin_editor"
  ON public.property_types
  FOR DELETE
  USING (public.is_admin_or_editor_active());

-- 4) STORAGE: permitir upload/delete no bucket 'property-images' para admin/editor autenticados

-- Observação: políticas no schema storage se aplicam à tabela storage.objects.
-- Usamos a função public.is_admin_or_editor_active() explicitamente qualificada.

CREATE POLICY "storage_insert_property_images_admin_editor"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND public.is_admin_or_editor_active()
  );

CREATE POLICY "storage_delete_property_images_admin_editor"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND public.is_admin_or_editor_active()
  );

-- 5) TRIGGERS em properties

DROP TRIGGER IF EXISTS properties_set_code_before_insert ON public.properties;
CREATE TRIGGER properties_set_code_before_insert
  BEFORE INSERT ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.properties_set_code_on_insert();

DROP TRIGGER IF EXISTS properties_sync_is_published_before_ins_upd ON public.properties;
CREATE TRIGGER properties_sync_is_published_before_ins_upd
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.properties_sync_is_published_on_status();

-- 6) Backfill is_published conforme status atual (opcional, mas recomendado)
UPDATE public.properties
SET is_published = CASE WHEN status = 'active' THEN true ELSE false END;
