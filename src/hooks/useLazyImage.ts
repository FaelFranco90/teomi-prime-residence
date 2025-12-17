import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for lazy loading images with IntersectionObserver
 * Efficient alternative to native loading="lazy" with better performance
 */
export function useLazyImage() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsLoaded(true);
      return;
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement;
            
            // Load the actual image src from data-src
            if (image.dataset.src) {
              image.src = image.dataset.src;
              setIsLoaded(true);
              observer.unobserve(image);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
        threshold: 0,
      }
    );

    observer.observe(img);

    return () => {
      if (img) observer.unobserve(img);
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
  };

  return {
    imageRef,
    isLoaded,
    hasError,
    handlers: {
      onLoad: handleImageLoad,
      onError: handleImageError,
    },
  };
}

/**
 * Alternative hook that works with srcset and sizes attributes
 */
export function useLazyImageAdvanced(srcSet?: string, sizes?: string) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    if (!('IntersectionObserver' in window)) {
      setIsLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement;
            
            // Load src from data-src
            if (image.dataset.src) {
              image.src = image.dataset.src;
            }
            
            // Load srcset from data-srcset if provided
            if (image.dataset.srcset) {
              image.setAttribute('srcset', image.dataset.srcset);
            }
            
            // Set sizes if provided
            if (image.dataset.sizes) {
              image.sizes = image.dataset.sizes;
            }
            
            setIsLoaded(true);
            observer.unobserve(image);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0,
      }
    );

    observer.observe(img);

    return () => {
      if (img) observer.unobserve(img);
    };
  }, []);

  return {
    imageRef,
    isLoaded,
    hasError,
    handlers: {
      onLoad: () => setIsLoaded(true),
      onError: () => setHasError(true),
    },
  };
}
