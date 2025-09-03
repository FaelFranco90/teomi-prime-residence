-- Add area_usable column to properties table
ALTER TABLE public.properties 
ADD COLUMN area_usable integer DEFAULT 0 NOT NULL;

-- Add area_usable_number for consistency (though we'll use area_usable directly)
-- Update: Let's keep it simple and just use area_usable as integer