-- Add new structured location columns
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS neighborhood TEXT,
  ADD COLUMN IF NOT EXISTS condo_name TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS cep TEXT;

-- Create indexes for efficient filtering and search
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties (lower(city));
CREATE INDEX IF NOT EXISTS idx_properties_neighborhood ON public.properties (lower(neighborhood));
CREATE INDEX IF NOT EXISTS idx_properties_condo ON public.properties (lower(condo_name));
CREATE INDEX IF NOT EXISTS idx_properties_state ON public.properties (lower(state));

-- Update existing location data to maintain compatibility
UPDATE public.properties
SET location = TRIM(
  CONCAT_WS(', ',
    NULLIF(condo_name, ''),
    NULLIF(neighborhood, ''),
    NULLIF(city, '')
  )
)
WHERE city IS NOT NULL OR neighborhood IS NOT NULL OR condo_name IS NOT NULL;

-- Create public view WITHOUT address field for security
CREATE OR REPLACE VIEW public.properties_public AS
SELECT
  id, code, title, description,
  price, price_number, area, area_number,
  bedrooms, bathrooms, suites, parking,
  city, neighborhood, condo_name, state, cep,
  -- Composite location field for compatibility
  TRIM(CONCAT_WS(', ', NULLIF(condo_name,''), NULLIF(neighborhood,''), NULLIF(city,''))) as location,
  property_type, is_featured, is_exclusive, has_virtual_tour, 
  is_gated_community, is_new, is_published,
  youtube_video_url,
  created_at, updated_at
FROM public.properties
WHERE is_published = true;

-- Grant permissions on the public view
GRANT SELECT ON public.properties_public TO anon, authenticated;