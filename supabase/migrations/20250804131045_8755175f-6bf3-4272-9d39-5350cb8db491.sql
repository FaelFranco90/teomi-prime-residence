-- Insert properties data from the existing static file
INSERT INTO public.properties (
  code, title, location, price, price_number, area, area_number, 
  bedrooms, bathrooms, suites, parking, property_type, 
  is_featured, is_exclusive, has_virtual_tour, is_gated_community, is_new
) VALUES
('REF001', 'Casa Luxury no Alto Padrão', 'Alphaville, Barueri', 'R$ 2.500.000', 2500000, '450m²', 450, 5, 4, 3, 4, 'Casa', true, false, false, true, false),
('REF002', 'Apartamento Moderno Centro', 'Vila Olímpia, São Paulo', 'R$ 1.200.000', 1200000, '120m²', 120, 3, 2, 1, 2, 'Apartamento', false, true, true, false, true),
('REF003', 'Cobertura Vista Mar', 'Praia Grande, SP', 'R$ 3.800.000', 3800000, '280m²', 280, 4, 3, 2, 3, 'Cobertura', true, true, false, false, false),
('REF004', 'Casa Condomínio Fechado', 'Granja Viana, Cotia', 'R$ 1.800.000', 1800000, '320m²', 320, 4, 3, 2, 4, 'Casa', false, false, true, true, false),
('REF005', 'Loft Industrial Moderno', 'Vila Madalena, São Paulo', 'R$ 850.000', 850000, '85m²', 85, 1, 1, 0, 1, 'Loft', false, true, false, false, true),
('REF006', 'Mansão Alto Padrão', 'Morumbi, São Paulo', 'Sob Consulta', 0, '800m²', 800, 6, 5, 4, 6, 'Mansão', true, true, true, true, false),
('REF007', 'Apartamento Compacto', 'Liberdade, São Paulo', 'R$ 420.000', 420000, '45m²', 45, 1, 1, 0, 1, 'Apartamento', false, false, false, false, true),
('REF008', 'Casa Familiar Ampla', 'Santo André, SP', 'R$ 950.000', 950000, '200m²', 200, 3, 2, 1, 2, 'Casa', false, false, false, false, false),
('REF009', 'Cobertura Duplex Luxo', 'Brooklin, São Paulo', 'R$ 4.200.000', 4200000, '350m²', 350, 4, 4, 3, 4, 'Cobertura', true, false, true, false, false),
('REF010', 'Studio Bem Localizado', 'República, São Paulo', 'R$ 380.000', 380000, '35m²', 35, 1, 1, 0, 0, 'Studio', false, false, false, false, true),
('REF011', 'Casa Sobrado Moderno', 'Tatuapé, São Paulo', 'R$ 1.350.000', 1350000, '180m²', 180, 3, 3, 1, 2, 'Sobrado', false, false, false, false, false),
('REF012', 'Apartamento Alto Padrão', 'Jardins, São Paulo', 'R$ 2.800.000', 2800000, '160m²', 160, 3, 3, 2, 2, 'Apartamento', true, true, false, false, false),
('REF013', 'Casa Térrea Espaçosa', 'Campo Belo, São Paulo', 'R$ 1.650.000', 1650000, '250m²', 250, 4, 2, 1, 3, 'Casa', false, false, true, false, false),
('REF014', 'Flat Executivo Central', 'Bela Vista, São Paulo', 'R$ 550.000', 550000, '50m²', 50, 1, 1, 0, 1, 'Flat', false, false, false, false, false),
('REF015', 'Penthouses Exclusivo', 'Itaim Bibi, São Paulo', 'R$ 5.500.000', 5500000, '400m²', 400, 5, 4, 3, 4, 'Penthouse', true, true, true, false, false);