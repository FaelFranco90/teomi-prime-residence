-- Corrigir formato de preço: $ -> R$
UPDATE properties 
SET price = REPLACE(price, '$ ', 'R$ ')
WHERE price LIKE '$ %';