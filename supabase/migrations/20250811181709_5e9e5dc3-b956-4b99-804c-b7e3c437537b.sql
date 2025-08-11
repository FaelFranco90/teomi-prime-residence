
-- 1) Garantir unicidade do código dos imóveis
CREATE UNIQUE INDEX IF NOT EXISTS properties_code_key ON public.properties (code);

-- 2) Garantir unicidade da chave de sequência por prefixo
CREATE UNIQUE INDEX IF NOT EXISTS property_code_sequences_prefix_key ON public.property_code_sequences (prefix);

-- 3) Adicionar o tipo "mansao" caso não exista, com prefixo 'MA'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.property_types WHERE key = 'mansao') THEN
    INSERT INTO public.property_types (key, label, prefix, active, order_index)
    VALUES ('mansao', 'Mansão', 'MA', true, 6);
  END IF;
END$$;

-- 4) Triggers de atualização de updated_at (boas práticas)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_properties') THEN
    CREATE TRIGGER set_updated_at_properties
      BEFORE UPDATE ON public.properties
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_property_types') THEN
    CREATE TRIGGER set_updated_at_property_types
      BEFORE UPDATE ON public.property_types
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_property_code_sequences') THEN
    CREATE TRIGGER set_updated_at_property_code_sequences
      BEFORE UPDATE ON public.property_code_sequences
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

-- 5) Trigger para gerar código automaticamente ao inserir um novo imóvel
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'properties_set_code_on_insert_trigger') THEN
    CREATE TRIGGER properties_set_code_on_insert_trigger
      BEFORE INSERT ON public.properties
      FOR EACH ROW
      EXECUTE FUNCTION public.properties_set_code_on_insert();
  END IF;
END$$;

-- 6) Sincronizar as sequências com base nos códigos existentes por prefixo
-- Se não houver códigos com determinado prefixo, last_value ficará 0.
INSERT INTO public.property_code_sequences (prefix, last_value)
SELECT pt.prefix,
       COALESCE(MAX((SUBSTRING(p.code, LENGTH(pt.prefix)+1))::int), 0) AS last_value
FROM public.property_types pt
LEFT JOIN public.properties p
  ON p.code LIKE pt.prefix || '%'
GROUP BY pt.prefix
ON CONFLICT (prefix) DO UPDATE
SET last_value = GREATEST(public.property_code_sequences.last_value, EXCLUDED.last_value);
