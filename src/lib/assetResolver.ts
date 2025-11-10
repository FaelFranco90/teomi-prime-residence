// Utility to resolve image URLs from various sources (Supabase HTTP URLs, local assets, or invalid strings)
// - If it's an absolute URL (http/https/data/blob), return as is
// - If it looks like a local asset path or filename (e.g., "property-1.jpg" or "src/assets/property-1.jpg"),
//   resolve it to the Vite asset URL using import.meta.glob
// - Otherwise, return a placeholder

const PLACEHOLDER = "/placeholder.svg";
const SUPABASE_PROJECT_ID = 'ytjkxwaikvzkttgreedq';

// URL resolution cache for performance
const urlCache = new Map<string, string>();

// Eagerly import all assets under src/assets as URLs
const assetModules = import.meta.glob('/src/assets/*', { eager: true, as: 'url' }) as Record<string, string>;
const assetsByBasename = new Map<string, string>();
for (const [fullPath, url] of Object.entries(assetModules)) {
  const base = fullPath.split('/').pop()?.toLowerCase();
  if (base) assetsByBasename.set(base, url);
}

export function resolveImageUrl(input?: string | null): string {
  try {
    if (!input || typeof input !== 'string') return PLACEHOLDER;
    
    // Check cache first
    if (urlCache.has(input)) {
      return urlCache.get(input)!;
    }

    const url = input.trim();
    if (!url) return PLACEHOLDER;
    
    const lower = url.toLowerCase();

    // Absolute or runtime URLs - pass through directly
    if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('data:') || lower.startsWith('blob:')) {
      // Special handling for Supabase Storage URLs - ensure they're valid
      if (lower.includes('.supabase.co/storage/')) {
        urlCache.set(input, url);
        return url;
      }
      
      urlCache.set(input, url);
      return url;
    }

    // Try by basename against imported assets
    const basename = lower.split('/').pop();
    if (basename && assetsByBasename.has(basename)) {
      const resolved = assetsByBasename.get(basename)!;
      urlCache.set(input, resolved);
      return resolved;
    }

    // Try loose match (if input contains an asset filename)
    for (const [base, assetUrl] of assetsByBasename.entries()) {
      if (lower.includes(base)) {
        urlCache.set(input, assetUrl);
        return assetUrl;
      }
    }

    // If nothing matches, return placeholder
    urlCache.set(input, PLACEHOLDER);
    return PLACEHOLDER;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error resolving image URL:', error, 'input:', input);
    }
    return PLACEHOLDER;
  }
}

export function resolveImageUrls(inputs: (string | null | undefined)[] | null | undefined): string[] {
  if (!inputs || !Array.isArray(inputs)) return [];
  return inputs.map((u) => resolveImageUrl(u));
}
