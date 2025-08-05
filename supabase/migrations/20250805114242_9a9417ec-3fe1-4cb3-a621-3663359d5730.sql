-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Create storage policies for property images
CREATE POLICY "Admin can upload property images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.email() = 'rafael.cunha@teomiimoveis.com.br'
);

CREATE POLICY "Property images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Admin can update property images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'property-images' 
  AND auth.email() = 'rafael.cunha@teomiimoveis.com.br'
);

CREATE POLICY "Admin can delete property images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'property-images' 
  AND auth.email() = 'rafael.cunha@teomiimoveis.com.br'
);

-- Update RLS policies for properties table to allow admin to manage
CREATE POLICY "Admin can insert properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

CREATE POLICY "Admin can update properties" 
ON public.properties 
FOR UPDATE 
USING (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

CREATE POLICY "Admin can delete properties" 
ON public.properties 
FOR DELETE 
USING (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

-- Update RLS policies for property_images table to allow admin to manage
CREATE POLICY "Admin can insert property images" 
ON public.property_images 
FOR INSERT 
WITH CHECK (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

CREATE POLICY "Admin can update property images" 
ON public.property_images 
FOR UPDATE 
USING (auth.email() = 'rafael.cunha@teomiimoveis.com.br');

CREATE POLICY "Admin can delete property images" 
ON public.property_images 
FOR DELETE 
USING (auth.email() = 'rafael.cunha@teomiimoveis.com.br');