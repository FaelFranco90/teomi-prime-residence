/**
 * Utilitários para formatação de moeda brasileira (BRL)
 */

/**
 * Formata um número para o formato de moeda brasileira
 * Ex: 5000000 -> "R$ 5.000.000"
 */
export const formatBRL = (value: number): string => {
  if (value === 0) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Extrai o valor numérico de uma string de preço
 * Ex: "R$ 5.000.000" -> 5000000
 */
export const parseBRL = (value: string): number => {
  if (!value || value.toLowerCase() === 'sob consulta') return 0;
  return parseInt(value.replace(/\D/g, '')) || 0;
};

/**
 * Formata input de preço enquanto o usuário digita
 * Permite "Sob Consulta" ou formata como moeda brasileira
 */
export const formatPriceInput = (value: string): string => {
  // Permite campo vazio
  if (!value) return '';
  
  // Permite "Sob Consulta" (case insensitive)
  if (value.toLowerCase().includes('sob') || value.toLowerCase() === 's') {
    return value;
  }
  
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  
  // Formata como moeda brasileira
  return formatBRL(parseInt(numbers));
};

/**
 * Valida se o preço está no formato correto
 */
export const isValidPrice = (value: string): boolean => {
  if (!value) return false;
  return value.toLowerCase() === 'sob consulta' || value.startsWith('R$');
};
