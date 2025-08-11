-- Ensure unique index on properties.code
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i'
      AND c.relname = 'idx_properties_code_unique'
      AND n.nspname = 'public'
  ) THEN
    CREATE UNIQUE INDEX idx_properties_code_unique ON public.properties (code);
  END IF;
END$$;

-- Create trigger for auto-generating code on insert
DROP TRIGGER IF EXISTS set_code_before_insert ON public.properties;
CREATE TRIGGER set_code_before_insert
BEFORE INSERT ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.properties_set_code_on_insert();

-- Create trigger to sync sequences when property_types.prefix changes
DROP TRIGGER IF EXISTS trg_sync_sequence_on_prefix_change ON public.property_types;
CREATE TRIGGER trg_sync_sequence_on_prefix_change
BEFORE UPDATE OF prefix ON public.property_types
FOR EACH ROW
WHEN (NEW.prefix IS DISTINCT FROM OLD.prefix)
EXECUTE FUNCTION public.sync_sequence_on_prefix_change();

-- Helpful indexes for sorting/filtering
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i' AND c.relname = 'idx_properties_created_at' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_properties_created_at ON public.properties (created_at DESC);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i' AND c.relname = 'idx_properties_price_number' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_properties_price_number ON public.properties (price_number);
  END IF;
END$$;