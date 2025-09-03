-- Fix existing properties with empty codes
UPDATE properties 
SET code = CASE 
  WHEN property_type IS NOT NULL THEN 
    (SELECT prefix FROM property_types WHERE key = properties.property_type LIMIT 1) || 
    LPAD((
      SELECT COALESCE(MAX(CAST(REGEXP_REPLACE(code, '^[A-Z]+', '') AS INTEGER)), 0) + 1 
      FROM properties 
      WHERE code ~ ('^' || (SELECT prefix FROM property_types WHERE key = properties.property_type LIMIT 1) || '[0-9]+$')
    )::text, 4, '0')
  ELSE 'IMG' || LPAD((SELECT COALESCE(MAX(CAST(REGEXP_REPLACE(code, '^[A-Z]+', '') AS INTEGER)), 0) + 1 FROM properties WHERE code ~ '^IMG[0-9]+$')::text, 4, '0')
END
WHERE code = '' OR code IS NULL;