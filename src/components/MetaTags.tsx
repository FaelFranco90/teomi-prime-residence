import { useEffect } from "react";
import { SEO_CONFIG, getFullUrl, getOrganizationSchema } from "@/config/seo";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  robots?: string;
  canonical?: string;
  ogType?: string;
  twitterCard?: string;
  schema?: any;
}

/**
 * Component to manage Meta Tags for SEO
 * Updates document head with title, description, and other meta tags
 */
export const useMetaTags = (props: MetaTagsProps) => {
  const {
    title = SEO_CONFIG.description,
    description = SEO_CONFIG.description,
    keywords = SEO_CONFIG.keywords,
    image = SEO_CONFIG.ogImage.url,
    url = SEO_CONFIG.siteUrl,
    type = "website",
    author = SEO_CONFIG.author,
    robots = "index, follow",
    canonical = url,
    ogType = "website",
    twitterCard = "summary_large_image",
    schema = getOrganizationSchema(),
  } = props;

  useEffect(() => {
    // Update title
    document.title = title;

    // Helper function to add or update meta tag
    const setMeta = (name: string, content: string, property?: boolean) => {
      let element = document.querySelector(
        property
          ? `meta[property="${name}"]`
          : `meta[name="${name}"]`
      ) as HTMLMetaElement;

      if (!element) {
        element = document.createElement("meta");
        if (property) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        document.head.appendChild(element);
      }

      element.content = content;
    };

    // Basic Meta Tags
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("author", author);
    setMeta("robots", robots);
    setMeta("viewport", "width=device-width, initial-scale=1.0");
    setMeta("theme-color", "#000000");
    setMeta("charset", "UTF-8");

    // Open Graph Meta Tags
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", image, true);
    setMeta("og:url", url, true);
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", SEO_CONFIG.siteName, true);

    // Twitter Card Meta Tags
    setMeta("twitter:card", twitterCard);
    setMeta("twitter:site", SEO_CONFIG.social.twitter);
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    // Canonical URL
    let canonicalElement = document.querySelector(
      "link[rel='canonical']"
    ) as HTMLLinkElement;
    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = canonical;

    // Add structured data (Schema.org)
    if (schema) {
      let scriptElement = document.querySelector(
        'script[type="application/ld+json"]'
      ) as HTMLScriptElement;
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.type = "application/ld+json";
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schema);
    }

    // Language
    document.documentElement.lang = SEO_CONFIG.language;

    return () => {
      // Cleanup if needed
    };
  }, [title, description, keywords, image, url, type, author, robots, canonical, ogType, twitterCard, schema]);
};

/**
 * Component wrapper for Meta Tags
 */
export function MetaTags(props: MetaTagsProps) {
  useMetaTags(props);
  return null;
}

export default MetaTags;
