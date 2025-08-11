-- Ensure only one primary image per property
create unique index if not exists property_images_one_primary_per_property
on public.property_images(property_id)
where is_primary = true;