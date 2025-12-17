/**
 * Image Optimization Utility
 * Generates optimized image URLs with Supabase transformations
 * Supports resizing, format conversion (WebP), and quality adjustment
 */

export interface OptimizedImageUrls {
  tiny: string;      // 300px - thumbnails
  small: string;     // 640px - mobile
  medium: string;    // 1024px - tablet
  large: string;     // 1920px - desktop
  full: string;      // original
}

/**
 * Adds transformation parameters directly to object/public URLs
 * Supabase supports transformations on /object/public/ endpoint
 */
const addTransformParams = (
  url: string,
  width: number,
  quality: number = 80,
  resize: 'cover' | 'contain' | 'fill' = 'cover'
): string => {
  // Se não é URL Supabase Storage, retorna original
  if (!url.includes('/storage/v1/object/public/')) {
    return url;
  }
  
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}width=${width}&quality=${quality}&resize=${resize}`;
};

/**
 * Generates optimized image URLs with multiple sizes for responsive loading
 * Uses Supabase Storage transformations with /object/public/ endpoint
 */
export function generateOptimizedImageUrls(originalUrl: string): OptimizedImageUrls {
  if (!originalUrl || typeof originalUrl !== 'string') {
    const p = '/placeholder.svg';
    return { tiny: p, small: p, medium: p, large: p, full: p };
  }

  // Detect Supabase Storage URLs
  const isSupabaseStorage = originalUrl.includes('/storage/v1/object/public/');

  if (!isSupabaseStorage) {
    // For non-Supabase URLs, return the original
    return {
      tiny: originalUrl,
      small: originalUrl,
      medium: originalUrl,
      large: originalUrl,
      full: originalUrl,
    };
  }

  // Generate multiple sizes using Supabase transformations
  return {
    tiny: addTransformParams(originalUrl, 320, 70, 'cover'),      // Thumbnails - lower quality, smaller
    small: addTransformParams(originalUrl, 640, 80, 'cover'),     // Mobile - standard quality
    medium: addTransformParams(originalUrl, 1024, 85, 'cover'),   // Tablet - good quality
    large: addTransformParams(originalUrl, 1600, 90, 'cover'),    // Desktop - high quality (1600px sufficient)
    full: originalUrl,                                             // Original - full quality
  };
}

/**
 * Generates a srcset string for responsive images
 * Example output: "url-640w.webp 640w, url-1024w.webp 1024w, url-1920w.webp 1920w"
 */
export function generateSrcset(optimizedUrls: OptimizedImageUrls): string {
  return `${optimizedUrls.small} 640w, ${optimizedUrls.medium} 1024w, ${optimizedUrls.large} 1920w`;
}

/**
 * Generates sizes attribute for responsive images
 * Tells browser which image to load based on viewport width
 */
export function generateSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw';
}

/**
 * Generates optimized thumbnail URL for gallery previews
 */
export function getOptimizedThumbnail(originalUrl: string): string {
  if (!originalUrl) return '/placeholder.svg';
  
  const urls = generateOptimizedImageUrls(originalUrl);
  return urls.tiny;
}

/**
 * Generates optimized URL for card display (smaller preview)
 */
export function getOptimizedCardImage(originalUrl: string): string {
  if (!originalUrl) return '/placeholder.svg';
  
  const urls = generateOptimizedImageUrls(originalUrl);
  return urls.small;
}

/**
 * Generates optimized URL for full-size gallery/lightbox
 */
export function getOptimizedFullImage(originalUrl: string): string {
  if (!originalUrl) return '/placeholder.svg';
  
  const urls = generateOptimizedImageUrls(originalUrl);
  return urls.large;
}

/**
 * Adds lazy loading attribute and error handling
 */
export function getImageProps(
  originalUrl: string,
  alt: string,
  useOptimization: boolean = true,
  context: 'thumbnail' | 'card' | 'full' = 'full'
) {
  const url = useOptimization 
    ? context === 'thumbnail' 
      ? getOptimizedThumbnail(originalUrl)
      : context === 'card'
      ? getOptimizedCardImage(originalUrl)
      : getOptimizedFullImage(originalUrl)
    : originalUrl;

  const optimizedUrls = generateOptimizedImageUrls(originalUrl);
  
  return {
    src: url,
    srcSet: context === 'full' ? generateSrcset(optimizedUrls) : undefined,
    sizes: context === 'full' ? generateSizes() : undefined,
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
}
