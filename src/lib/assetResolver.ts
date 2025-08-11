// Utility to resolve image URLs from various sources (Supabase HTTP URLs, local assets, or invalid strings)
// - If it's an absolute URL (http/https/data/blob), return as is
// - If it looks like a local asset path or filename (e.g., "property-1.jpg" or "src/assets/property-1.jpg"),
//   resolve it to the Vite asset URL using import.meta.glob
// - Otherwise, return a placeholder

const PLACEHOLDER = "/placeholder.svg";

// Eagerly import all assets under src/assets as URLs
const assetModules = import.meta.glob('/src/assets/*', { eager: true, as: 'url' }) as Record<string, string>;
const assetsByBasename = new Map<string, string>();
for (const [fullPath, url] of Object.entries(assetModules)) {
  const base = fullPath.split('/').pop()?.toLowerCase();
  if (base) assetsByBasename.set(base, url);
}

export function resolveImageUrl(input?: string | null): string {
  if (!input) return PLACEHOLDER;
  const url = input.trim();
  const lower = url.toLowerCase();

  // Absolute or runtime URLs
  if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('data:') || lower.startsWith('blob:')) {
    return url;
  }

  // Try by basename against imported assets
  const basename = lower.split('/').pop();
  if (basename && assetsByBasename.has(basename)) {
    return assetsByBasename.get(basename)!;
  }

  // Try loose match (if input contains an asset filename)
  for (const [base, assetUrl] of assetsByBasename.entries()) {
    if (lower.includes(base)) return assetUrl;
  }

  return PLACEHOLDER;
}

export function resolveImageUrls(inputs: (string | null | undefined)[] | null | undefined): string[] {
  if (!inputs || !Array.isArray(inputs)) return [];
  return inputs.map((u) => resolveImageUrl(u));
}
