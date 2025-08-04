-- Clear existing data and insert the correct property data from the static file
DELETE FROM public.property_images;
DELETE FROM public.properties;

-- Insert the actual properties from the static file with correct data
INSERT INTO public.properties (
  code, title, location, price, price_number, area, area_number, 
  bedrooms, bathrooms, suites, parking, property_type, 
  is_featured, is_exclusive, has_virtual_tour, is_gated_community, is_new
) VALUES
('TP001', 'Penthouse Exclusivo Vista Panorâmica', 'Alphaville, São José dos Campos', 'R$ 2.800.000', 2800000, '280m²', 280, 4, 5, 3, 3, 'penthouse', true, true, true, true, false),
('TP002', 'Casa Moderna com Piscina Infinita', 'Campos do Conde, Tremembé', 'R$ 1.950.000', 1950000, '350m²', 350, 5, 6, 2, 4, 'casa', true, false, true, true, true),
('TP003', 'Apartamento de Luxo no Centro', 'Centro, São José dos Campos', 'R$ 1.200.000', 1200000, '180m²', 180, 3, 3, 1, 2, 'apartamento', true, false, false, false, false),
('TP004', 'Cobertura Duplex com Vista Serra', 'Vila Adyanna, São José dos Campos', 'R$ 3.200.000', 3200000, '400m²', 400, 5, 7, 4, 4, 'cobertura', false, true, true, true, true),
('TP005', 'Casa Térrea em Condomínio Fechado', 'Altos da Serra, Caçapava', 'R$ 1.650.000', 1650000, '320m²', 320, 4, 5, 2, 3, 'casa', false, false, false, true, false),
('TP006', 'Loft Moderno Centro Histórico', 'Centro Histórico, São José dos Campos', 'R$ 890.000', 890000, '120m²', 120, 2, 2, 1, 1, 'apartamento', false, false, true, false, false),
('TP007', 'Mansão Colonial Renovada', 'Jardim das Colinas, São José dos Campos', 'R$ 4.200.000', 4200000, '520m²', 520, 6, 8, 4, 6, 'mansao', false, true, true, true, true),
('TP008', 'Casa de Campo Premium', 'Vale dos Cristais, Caçapava', 'Sob Consulta', 0, '450m²', 450, 4, 6, 3, 5, 'casa', true, true, true, true, false),
('TP009', 'Apartamento Studio Vila Adyanna', 'Vila Adyanna, São José dos Campos', 'R$ 650.000', 650000, '85m²', 85, 1, 1, 1, 1, 'apartamento', false, false, false, true, true),
('TP010', 'Cobertura Jardim das Colinas', 'Jardim das Colinas, São José dos Campos', 'R$ 2.200.000', 2200000, '300m²', 300, 3, 4, 2, 3, 'cobertura', true, false, true, true, false),
('TP011', 'Casa Familiar Alphaville', 'Alphaville, São José dos Campos', 'R$ 1.750.000', 1750000, '280m²', 280, 4, 4, 2, 2, 'casa', false, false, false, true, false),
('TP012', 'Terreno Premium Vale dos Cristais', 'Vale dos Cristais, Caçapava', 'R$ 850.000', 850000, '1200m²', 1200, 0, 0, 0, 0, 'terreno', false, true, false, true, true),
('TP013', 'Apartamento Compacto Centro', 'Centro, São José dos Campos', 'R$ 580.000', 580000, '75m²', 75, 2, 2, 0, 1, 'apartamento', false, false, true, false, false),
('TP014', 'Casa Luxuosa Campos do Conde', 'Campos do Conde, Tremembé', 'R$ 3.500.000', 3500000, '480m²', 480, 5, 7, 3, 4, 'casa', true, true, true, true, true),
('TP015', 'Penthouse Altos da Serra', 'Altos da Serra, Caçapava', 'R$ 2.950.000', 2950000, '380m²', 380, 4, 6, 3, 3, 'penthouse', false, true, true, true, false);