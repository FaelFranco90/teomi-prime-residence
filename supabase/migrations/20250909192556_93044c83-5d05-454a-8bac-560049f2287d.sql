-- Create function to check property images limit (100 images per property)
CREATE OR REPLACE FUNCTION public.property_images_limit_per_property()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Count existing images for this property
  SELECT COUNT(*) INTO current_count
  FROM public.property_images
  WHERE property_id = NEW.property_id;
  
  -- Check if adding this image would exceed 100 images
  IF current_count >= 100 THEN
    RAISE EXCEPTION 'Limite de 100 imagens por imóvel atingido. Remova algumas imagens antes de adicionar novas.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to enforce the 100 images limit
CREATE TRIGGER property_images_limit_check
  BEFORE INSERT ON public.property_images
  FOR EACH ROW
  EXECUTE FUNCTION public.property_images_limit_per_property();