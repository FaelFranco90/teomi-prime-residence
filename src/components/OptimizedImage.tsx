import { useState, ImgHTMLAttributes } from 'react';
import { getOptimizedImageUrl, getImageSrcSet, ImageSize } from '@/lib/imageOptimizer';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | null | undefined;
  alt: string;
  size?: ImageSize;
  lazy?: boolean;
  blur?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  size = 'medium',
  lazy = true,
  blur = true,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(src, size);
  const blurSrc = blur ? getOptimizedImageUrl(src, 'tiny') : undefined;
  const srcSet = getImageSrcSet(src);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Use placeholder if error or no src
  const finalSrc = hasError ? '/placeholder.svg' : optimizedSrc;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      {blur && blurSrc && !isLoaded && (
        <img
          src={blurSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
        />
      )}

      {/* Main image */}
      <img
        src={finalSrc}
        srcSet={srcSet || undefined}
        sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  );
}
