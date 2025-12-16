import { useEffect } from "react";
import { SEO_CONFIG } from "@/config/seo";

interface StructuredDataProps {
  schema: any;
}

/**
 * Component to inject structured data (JSON-LD) into the page
 * Supports Schema.org formats like Organization, LocalBusiness, Property, etc.
 */
export function StructuredData({ schema }: StructuredDataProps) {
  useEffect(() => {
    if (!schema) return;

    // Find or create script tag for structured data
    let scriptElement = document.querySelector(
      'script[type="application/ld+json"][data-structured-data="true"]'
    ) as HTMLScriptElement;

    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.type = "application/ld+json";
      scriptElement.setAttribute("data-structured-data", "true");
      document.head.appendChild(scriptElement);
    }

    scriptElement.textContent = JSON.stringify(schema);

    return () => {
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, [schema]);

  return null;
}

/**
 * Generate Organization Schema
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SEO_CONFIG.siteName,
  url: SEO_CONFIG.siteUrl,
  logo: `${SEO_CONFIG.siteUrl}/logo.png`,
  description: SEO_CONFIG.description,
  image: SEO_CONFIG.ogImage.url,
  sameAs: [
    `https://twitter.com/${SEO_CONFIG.social.twitter.replace("@", "")}`,
    `https://instagram.com/${SEO_CONFIG.social.instagram.replace("@", "")}`,
    `https://facebook.com/${SEO_CONFIG.social.facebook}`,
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    telephone: SEO_CONFIG.contact.phone,
    email: SEO_CONFIG.contact.email,
    areaServed: "BR",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    postalCode: "SP",
    addressCountry: "BR",
  },
});

/**
 * Generate LocalBusiness Schema
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
    postalCode: "SP",
    addressCountry: "BR",
  },
  areaServed: SEO_CONFIG.serviceRegions.map((region) => ({
    "@type": "City",
    name: region,
    addressCountry: "BR",
  })),
  priceRange: "$$$$",
  image: SEO_CONFIG.ogImage.url,
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-23.5505",
    longitude: "-46.6333",
  },
});

/**
 * Generate RealEstate Agent Schema
 */
export const getRealEstateAgentSchema = () => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SEO_CONFIG.siteName,
  description: SEO_CONFIG.description,
  url: SEO_CONFIG.siteUrl,
  telephone: SEO_CONFIG.contact.phone,
  email: SEO_CONFIG.contact.email,
  image: SEO_CONFIG.ogImage.url,
  areaServed: SEO_CONFIG.serviceRegions,
  knowsLanguage: ["pt-BR", "en", "es"],
});

/**
 * Generate Property Schema
 */
export const getPropertySchema = (property: {
  code?: string;
  title?: string;
  description?: string;
  price?: string;
  image?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  city?: string;
  state?: string;
  address?: string;
  createdAt?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: property.title || "Propriedade de Luxo",
  description: property.description || SEO_CONFIG.description,
  image: property.image || SEO_CONFIG.ogImage.url,
  url: `${SEO_CONFIG.siteUrl}/imovel/${property.code}`,
  priceCurrency: "BRL",
  price: property.price?.replace(/\D/g, "") || "",
  address: {
    "@type": "PostalAddress",
    streetAddress: property.address || "",
    addressLocality: property.city || "São Paulo",
    addressRegion: property.state || "SP",
    addressCountry: "BR",
  },
  ...(property.bedrooms && { numberOfBedrooms: property.bedrooms }),
  ...(property.bathrooms && { numberOfBathroms: property.bathrooms }),
  ...(property.area && { floorSize: property.area }),
  datePublished: property.createdAt || new Date().toISOString(),
});

/**
 * Generate BreadcrumbList Schema
 */
export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Generate FAQ Schema
 */
export const getFAQSchema = (
  items: { question: string; answer: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

/**
 * Generate ContactPoint Schema
 */
export const getContactPointSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ContactPoint",
  contactType: "Customer Service",
  telephone: SEO_CONFIG.contact.phone,
  email: SEO_CONFIG.contact.email,
  areaServed: "BR",
});
