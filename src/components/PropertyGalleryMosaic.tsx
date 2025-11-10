import { ImageLightbox } from "./ImageLightbox";
import { Images } from "lucide-react";
import { OptimizedImage } from "./OptimizedImage";

interface PropertyGalleryMosaicProps {
  images: string[];
  title: string;
}

export function PropertyGalleryMosaic({ images, title }: PropertyGalleryMosaicProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80">
      {/* Main large image */}
      <div className="col-span-2 row-span-2">
        <ImageLightbox
          images={images}
          initialIndex={0}
          trigger={
            <div className="relative w-full h-full cursor-pointer overflow-hidden rounded-lg group">
              <OptimizedImage
                src={images[0]}
                alt={`${title} - Imagem principal`}
                size="large"
                lazy={false}
                blur={true}
                className="w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>
          }
        />
      </div>

      {/* Small images */}
      {images.slice(1, 5).map((image, index) => {
        const isLast = index === 3 || index === images.slice(1, 5).length - 1;
        const remainingCount = Math.max(0, images.length - 5);
        
        return (
          <div key={index} className="relative">
            <ImageLightbox
              images={images}
              initialIndex={index + 1}
              trigger={
                <div className="relative w-full h-full cursor-pointer overflow-hidden rounded-lg group">
                  <OptimizedImage
                    src={image}
                    alt={`${title} - Imagem ${index + 2}`}
                    size="medium"
                    lazy={true}
                    blur={true}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  {isLast && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-lg">
                      <div className="text-center">
                        <Images className="h-6 w-6 mx-auto mb-2" />
                        +{remainingCount}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
              }
            />
          </div>
        );
      })}
    </div>
  );
}