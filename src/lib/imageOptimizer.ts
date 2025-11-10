// Supabase Image Transformation Utility
// Uses Supabase Storage's built-in image transformation API

const SUPABASE_PROJECT_ID = 'ytjkxwaikvzkttgreedq';
const SUPABASE_STORAGE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1`;

export type ImageSize = 'tiny' | 'small' | 'medium' | 'large' | 'original';

interface TransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'origin';
}

const SIZE_CONFIGS: Record<ImageSize, TransformOptions> = {
  tiny: { width: 20, height: 15, quality: 60 }, // Blur placeholder
  small: { width: 400, height: 300, quality: 75 }, // Thumbnails
  medium: { width: 800, height: 600, quality: 80 }, // Cards
  large: { width: 1200, height: 900, quality: 85 }, // Lightbox
  original: {} // No transformation
};

/**
 * Check if URL is a Supabase Storage URL
 */
export function isSupabaseStorageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('.supabase.co/storage/v1/object/public/');
}

/**
 * Extract bucket and path from Supabase Storage URL
 */
function parseSupabaseUrl(url: string): { bucket: string; path: string } | null {
  try {
    const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
    if (!match) return null;
    return { bucket: match[1], path: match[2] };
  } catch {
    return null;
  }
}

/**
 * Get optimized image URL with Supabase transformations
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  size: ImageSize = 'medium'
): string {
  if (!url || typeof url !== 'string') {
    return '/placeholder.svg';
  }

  // If not a Supabase URL, return as-is
  if (!isSupabaseStorageUrl(url)) {
    return url;
  }

  // For original size, return as-is
  if (size === 'original') {
    return url;
  }

  // Parse Supabase URL
  const parsed = parseSupabaseUrl(url);
  if (!parsed) return url;

  const { bucket, path } = parsed;
  const config = SIZE_CONFIGS[size];

  // Build transformation URL
  const params = new URLSearchParams();
  if (config.width) params.set('width', config.width.toString());
  if (config.height) params.set('height', config.height.toString());
  if (config.quality) params.set('quality', config.quality.toString());

  // Use render/image endpoint for transformations
  const transformUrl = `${SUPABASE_STORAGE_URL}/render/image/public/${bucket}/${path}?${params.toString()}`;
  
  return transformUrl;
}

/**
 * Get srcset for responsive images
 */
export function getImageSrcSet(url: string | null | undefined): string {
  if (!url || !isSupabaseStorageUrl(url)) return '';

  return [
    `${getOptimizedImageUrl(url, 'small')} 400w`,
    `${getOptimizedImageUrl(url, 'medium')} 800w`,
    `${getOptimizedImageUrl(url, 'large')} 1200w`,
  ].join(', ');
}

/**
 * Preload critical images
 */
export function preloadImage(url: string, size: ImageSize = 'medium'): void {
  if (!url || typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = getOptimizedImageUrl(url, size);
  
  document.head.appendChild(link);
}

/**
 * Prefetch image on hover (for better navigation UX)
 */
export function prefetchOnHover(url: string, size: ImageSize = 'medium'): () => void {
  let prefetched = false;
  
  return () => {
    if (prefetched) return;
    prefetched = true;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = getOptimizedImageUrl(url, size);
    
    document.head.appendChild(link);
  };
}
