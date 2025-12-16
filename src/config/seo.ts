/**
 * SEO Configuration for Teomi Prime
 * Centralized SEO settings and metadata
 */

export const SEO_CONFIG = {
  siteName: "Teomi Prime",
  siteUrl: "https://prime.teomiimoveis.com.br",
  description: "Teomi Prime - Imóveis de Altíssimo Padrão com Exclusividade e Discrição. Luxuosas residências e propriedades premium.",
  keywords: "imóveis de luxo, casas de luxo, apartamentos premium, coberturas, propriedades exclusivas, mercado imobiliário de alto padrão",
  author: "Teomi Prime",
  language: "pt-BR",
  
  // Social Media
  social: {
    twitter: "@teomi.imoveis",
    instagram: "@teomi.imoveis",
    facebook: "teomi.imoveis",
  },

  // Contact Information (for LocalBusiness Schema)
  contact: {
    phone: "+55 (12) 99680-8136", // Update with actual phone
    email: "contatoprime@teomiimoveis.com.br",
    address: "Taubaté, SP, Brasil",
  },

  // Open Graph Defaults
  ogImage: {
    url: "https://prime.teomiimoveis.com.br/og-image.jpg",
    width: 1200,
    height: 630,
    type: "image/jpeg",
  },

  // Twitter Card Defaults
  twitterHandle: "@teomiprime",

  // Regions and Cities served
  serviceRegions: ["São Paulo", "Região Metropolitana de SP"],

  // Property Types
  propertyTypes: ["Casa", "Apartamento", "Cobertura", "Terreno", "Mansão", "Penthouse"],
};

/**
 * Page Metadata Configuration
 */
export const PAGE_METADATA = {
  home: {
    title: "Teomi Prime - Imóveis de Luxo e Exclusividade",
    description: "Descubra as mais exclusivas propriedades de alto padrão com Teomi Prime. Casas de luxo, apartamentos premium e terrenos nobres.",
    keywords: "imóveis luxo, casas de luxo São Paulo, apartamentos premium, propriedades exclusivas",
  },
  properties: {
    title: "Imóveis - Teomi Prime | Catálogo de Propriedades de Luxo",
    description: "Explore nosso portfólio completo de imóveis de luxo e exclusivos. Encontre sua próxima propriedade premium.",
    keywords: "imóveis de luxo, propriedades premium, busca imobiliária, casas e apartamentos exclusivos",
  },
  about: {
    title: "Sobre Teomi Prime - Especialista em Imóveis Premium",
    description: "Conheça a Teomi Prime, especialista em negociação de imóveis de altíssimo padrão com exclusividade e discrição.",
    keywords: "teomi prime, sobre, imobiliária de luxo, especialista em propriedades premium",
  },
  contact: {
    title: "Contato - Teomi Prime | Entre em Contato Conosco",
    description: "Entre em contato com Teomi Prime para mais informações sobre nossas propriedades exclusivas.",
    keywords: "contato teomi prime, fale conosco, informações, propriedades de luxo",
  },
};

/**
 * Generate full URL
 */
export const getFullUrl = (path: string = ""): string => {
  return `${SEO_CONFIG.siteUrl}${path}`;
};

/**
 * Generate structured data for Organization
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SEO_CONFIG.siteName,
  url: SEO_CONFIG.siteUrl,
  logo: `${SEO_CONFIG.siteUrl}/logo.png`,
  description: SEO_CONFIG.description,
  sameAs: [
    `https://twitter.com/${SEO_CONFIG.social.twitter}`,
    `https://instagram.com/${SEO_CONFIG.social.instagram}`,
    `https://facebook.com/${SEO_CONFIG.social.facebook}`,
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    telephone: SEO_CONFIG.contact.phone,
    email: SEO_CONFIG.contact.email,
  },
});

/**
 * Generate structured data for LocalBusiness
 */
export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SEO_CONFIG.siteName,
  description: SEO_CONFIG.description,
  url: SEO_CONFIG.siteUrl,
  telephone: SEO_CONFIG.contact.phone,
  email: SEO_CONFIG.contact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  areaServed: SEO_CONFIG.serviceRegions,
  priceRange: "$$$$",
  image: SEO_CONFIG.ogImage.url,
});

/**
 * Generate structured data for Property
 */
export const getPropertySchema = (property: any) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: property.title || SEO_CONFIG.siteName,
  description: property.description,
  image: property.image,
  url: `${SEO_CONFIG.siteUrl}/imovel/${property.code}`,
  priceCurrency: "BRL",
  price: property.price,
  address: {
    "@type": "PostalAddress",
    addressLocality: property.city,
    addressRegion: property.state || "SP",
    addressCountry: "BR",
  },
  ...(property.bedrooms && { numberOfBedrooms: property.bedrooms }),
  ...(property.bathrooms && { numberOfBathroms: property.bathrooms }),
  ...(property.area && { floorSize: property.area }),
});
