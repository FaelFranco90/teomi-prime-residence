-- Insert property images for the existing properties
INSERT INTO public.property_images (property_id, image_url, is_primary, order_index)
SELECT 
  p.id,
  '/src/assets/property-1.jpg' as image_url,
  true as is_primary,
  0 as order_index
FROM public.properties p;

-- Add secondary images
INSERT INTO public.property_images (property_id, image_url, is_primary, order_index)
SELECT 
  p.id,
  '/src/assets/property-2.jpg' as image_url,
  false as is_primary,
  1 as order_index
FROM public.properties p;

-- Add third images
INSERT INTO public.property_images (property_id, image_url, is_primary, order_index)
SELECT 
  p.id,
  '/src/assets/property-3.jpg' as image_url,
  false as is_primary,
  2 as order_index
FROM public.properties p;