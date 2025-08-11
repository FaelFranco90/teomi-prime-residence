-- Add is_published column to properties table
ALTER TABLE public.properties 
ADD COLUMN is_published boolean NOT NULL DEFAULT true;

-- Create index for better performance on published status queries
CREATE INDEX idx_properties_is_published ON public.properties(is_published);

-- Update existing properties to be published by default (this is redundant due to DEFAULT true, but good to be explicit)
UPDATE public.properties SET is_published = true WHERE is_published IS NULL;