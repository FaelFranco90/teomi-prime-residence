import { useState, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Car, Square, MapPin, Play, Shield, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { withErrorBoundary } from "@/components/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import { useLazyImageAdvanced } from "@/hooks/useLazyImage";
import { generateOptimizedImageUrls, generateSrcset, generateSizes, getOptimizedCardImage } from "@/lib/imageOptimizer";

interface PropertyCardProps {
  id: string;
  code: string;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  suites: number;
  parking: number;
  images: string[];
  featured?: boolean;
  exclusive?: boolean;
  virtualTour?: boolean;
  gatedCommunity?: boolean;
  isNew?: boolean;
  viewMode?: 'grid' | 'list';
}

const PropertyCard = memo(function PropertyCard({ 
  id, 
  code = 'N/A',
  title = 'Imóvel sem título', 
  location = 'Localização não informada', 
  price = 'Preço sob consulta', 
  area = 'N/A', 
  bedrooms = 0, 
  bathrooms = 0, 
  suites = 0,
  parking = 0, 
  images = [], 
  featured = false,
  exclusive = false,
  virtualTour = false,
  gatedCommunity = false,
  isNew = false,
  viewMode = 'grid'
}: PropertyCardProps) {
  const navigate = useNavigate();
  // Defensive check for images array
  const safeImages = Array.isArray(images) ? images.filter(img => img && typeof img === 'string') : [];
  const hasImages = safeImages.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % safeImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    }
  };

  if (viewMode === 'grid') {
    // Optimize current image URL for card display
    const currentImage = safeImages[currentImageIndex] || '/placeholder.svg';
    const optimizedUrls = generateOptimizedImageUrls(currentImage);
    
    return (
      <Card className="group overflow-hidden hover:shadow-luxury transition-all duration-200 border border-border/50">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={getOptimizedCardImage(currentImage)}
            srcSet={generateSrcset(optimizedUrls)}
            sizes={generateSizes()}
            alt={title || 'Imóvel'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"

              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground h-8 w-8 p-0"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isNew && (
              <Badge variant="default" className="bg-green-600 text-white text-sm">
                NOVO
              </Badge>
            )}
            {featured && (
              <Badge variant="default" className="bg-accent text-accent-foreground text-sm">
                DESTAQUE
              </Badge>
            )}
            {exclusive && (
              <Badge variant="outline" className="bg-background/90 text-foreground border-accent text-sm">
                EXCLUSIVO
              </Badge>
            )}
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-serif text-xl font-bold drop-shadow-lg">
              {price}
            </p>
            <p className="text-white/90 text-xs font-medium drop-shadow">
              Cód: {code}
            </p>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Location */}
          <div className="mb-3">
            <h3 className="font-serif text-lg font-bold text-foreground line-clamp-2 mb-1">
              {title}
            </h3>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">{location}</p>
            </div>
          </div>

          {/* Property specs */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Square className="h-4 w-4 text-primary" />
              <span>{area}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bed className="h-4 w-4 text-primary" />
              <span>{bedrooms} quartos</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bath className="h-4 w-4 text-primary" />
              <span>{bathrooms} banheiros</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Car className="h-4 w-4 text-primary" />
              <span>{parking} vagas</span>
            </div>
          </div>

          {/* Suites and features */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              <Star className="h-3 w-3 mr-1" />
              {suites} Suítes
            </Badge>
            <div className="flex gap-1">
              {virtualTour && (
                <Badge variant="outline" className="text-xs gap-1 px-2 py-1">
                  <Play className="h-3 w-3" />
                  Tour
                </Badge>
              )}
              {gatedCommunity && (
                <Badge variant="outline" className="text-xs gap-1 px-2 py-1">
                  <Shield className="h-3 w-3" />
                  Seguro
                </Badge>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 text-xs"
              onClick={() => navigate(`/imovel/${code}`)}
            >
              Ver Detalhes
            </Button>
            {virtualTour && (
              <Button 
                variant="default" 
                size="sm"
                className="gap-1 text-xs"
                onClick={() => {/* Virtual tour handler */}}
              >
                <Play className="h-3 w-3" />
                Tour
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // List mode (original layout)
  const currentImageList = safeImages[currentImageIndex] || '/placeholder.svg';
  const optimizedUrlsList = generateOptimizedImageUrls(currentImageList);
  
  return (
    <Card className="group overflow-hidden hover:shadow-luxury transition-all duration-200 border border-border/50">
      <div className="flex gap-6 p-6">
        {/* Left Side - Main Image */}
        <div className="flex-shrink-0">
          <div className="relative w-80 h-60 rounded-lg overflow-hidden">
            <img 
              src={getOptimizedCardImage(currentImageList)}
              srcSet={generateSrcset(optimizedUrlsList)}
              sizes={generateSizes()}
              alt={title || 'Imóvel'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
            />
            
            {/* Navigation Arrows */}
            {safeImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground h-8 w-8 p-0"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground h-8 w-8 p-0"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {isNew && (
                <Badge variant="default" className="bg-green-600 text-white text-sm">
                  NOVO
                </Badge>
              )}
              {featured && (
                <Badge variant="default" className="bg-accent text-accent-foreground text-sm">
                  DESTAQUE
                </Badge>
              )}
              {exclusive && (
                <Badge variant="outline" className="bg-background/90 text-foreground border-accent text-sm">
                  EXCLUSIVO
                </Badge>
              )}
            </div>

            {/* Price overlay */}
            <div className="absolute bottom-3 left-3">
              <p className="text-background font-serif text-2xl font-bold drop-shadow-lg">
                {price}
              </p>
              <p className="text-background/90 text-sm font-medium drop-shadow">
                Cód: {code}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Thumbnails and Content */}
        <div className="flex-1 flex gap-6">
          {/* Thumbnails Column */}
          <div className="flex-shrink-0">
            <div className="grid grid-cols-2 gap-2 w-32">
              {safeImages.slice(0, 6).map((image, index) => (
                <div
                  key={index}
                  className={`relative w-15 h-12 rounded cursor-pointer overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-border'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={getOptimizedCardImage(image || '/placeholder.svg')}
                    alt={`${title || 'Imóvel'} ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                  {safeImages.length > 6 && index === 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">+{safeImages.length - 6}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 space-y-4">
            {/* Title and Location */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground line-clamp-2 mb-2">
                {title}
              </h3>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">{location}</p>
              </div>
            </div>

            {/* Property specs */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Square className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Área</p>
                  <p className="font-semibold">{area}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Bed className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Quartos</p>
                  <p className="font-semibold">{bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Bath className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Banheiros</p>
                  <p className="font-semibold">{bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Car className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Vagas</p>
                  <p className="font-semibold">{parking}</p>
                </div>
              </div>
            </div>

            {/* Suites info */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Star className="h-4 w-4 mr-1" />
                {suites} Suítes
              </Badge>
            </div>

            {/* Features and Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-2">
                {virtualTour && (
                  <Badge variant="outline" className="text-sm gap-2 px-3 py-2">
                    <Play className="h-4 w-4" />
                    Tour Virtual
                  </Badge>
                )}
                {gatedCommunity && (
                  <Badge variant="outline" className="text-sm gap-2 px-3 py-2">
                    <Shield className="h-4 w-4" />
                    Condomínio Fechado
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-3">
                {virtualTour && (
                  <Button 
                    variant="outline" 
                    size="default"
                    className="gap-2"
                    onClick={() => {/* Virtual tour handler */}}
                  >
                    <Play className="h-4 w-4" />
                    Tour Virtual
                  </Button>
                )}
                <Button 
                  variant="default" 
                  size="default"
                  className="px-6"
                  onClick={() => navigate(`/imovel/${code}`)}
                >
                  Ver Detalhes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

// Export the component wrapped with ErrorBoundary
export default withErrorBoundary(PropertyCard);