import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Car, Square, MapPin, Play, Shield, Star, ChevronLeft, ChevronRight } from "lucide-react";

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

export default function PropertyCard({ 
  id, 
  code,
  title, 
  location, 
  price, 
  area, 
  bedrooms, 
  bathrooms, 
  suites,
  parking, 
  images, 
  featured = false,
  exclusive = false,
  virtualTour = false,
  gatedCommunity = false,
  isNew = false,
  viewMode = 'grid'
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (viewMode === 'list') {
    return (
      <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 border border-border/50">
        <div className="flex gap-4 p-4">
          {/* Image Section */}
          <div className="flex-shrink-0">
            {/* Main Image */}
            <div className="relative w-48 h-32 rounded-lg overflow-hidden mb-2">
              <img 
                src={images[currentImageIndex]} 
                alt={title}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1">
                {isNew && (
                  <Badge variant="default" className="bg-green-600 text-white text-xs py-0 px-1.5 h-5">
                    NOVO
                  </Badge>
                )}
                {exclusive && (
                  <Badge variant="outline" className="bg-background/90 text-foreground border-accent text-xs py-0 px-1.5 h-5">
                    EXCLUSIVO
                  </Badge>
                )}
              </div>

              {/* Price overlay */}
              <div className="absolute bottom-2 left-2">
                <p className="text-background font-bold text-sm drop-shadow-sm">
                  {price}
                </p>
              </div>
            </div>
            
            {/* Image Thumbnails Grid */}
            <div className="grid grid-cols-3 gap-1">
              {images.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className={`relative w-15 h-10 rounded cursor-pointer overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`${title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 3 && index === 2 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">+{images.length - 3}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              {/* Title and Location */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                    {title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Cód:</span>
                    <span className="font-medium">{code}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm line-clamp-1">{location}</p>
                </div>
              </div>

              {/* Property specs in compact row */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Square className="h-3 w-3" />
                  <span className="font-medium">{area}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed className="h-3 w-3" />
                  <span>{bedrooms} dorms</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {suites} suítes
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-3 w-3" />
                  <span>{bathrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="h-3 w-3" />
                  <span>{parking}</span>
                </div>
              </div>

              {/* Features and Buttons Row */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  {virtualTour && (
                    <Badge variant="outline" className="text-xs gap-1 py-0 px-2 h-6">
                      <Play className="h-2 w-2" />
                      Tour Virtual
                    </Badge>
                  )}
                  {gatedCommunity && (
                    <Badge variant="outline" className="text-xs gap-1 py-0 px-2 h-6">
                      <Shield className="h-2 w-2" />
                      Condomínio
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {virtualTour && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-7 px-3"
                      onClick={() => console.log('Open virtual tour')}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Tour
                    </Button>
                  )}
                  <Button 
                    variant="default" 
                    size="sm"
                    className="text-xs h-7 px-4"
                    onClick={() => window.location.href = `/imovel/${id}`}
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
  }
  // Grid view (original layout)
  return (
    <Card className="group overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-[1.02]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={images[currentImageIndex]} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-background"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-background"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-2 right-2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-background' : 'bg-background/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <Badge variant="default" className="bg-green-600 text-white">
              Novo
            </Badge>
          )}
          {featured && (
            <Badge variant="default" className="bg-accent text-accent-foreground">
              Destaque
            </Badge>
          )}
          {exclusive && (
            <Badge variant="outline" className="bg-background/90 text-foreground border-accent">
              Exclusivo
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <p className="text-background font-serif text-lg font-semibold">
            {price}
          </p>
          <p className="text-background/80 text-sm font-medium">
            {code}
          </p>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">{location}</p>
            </div>
          </div>

          {/* Property specs */}
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{area}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                {suites} suítes
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms}</span>
            </div>
          </div>

          {/* Additional Features */}
          <div className="flex flex-wrap gap-1">
            {virtualTour && (
              <Badge variant="outline" className="text-xs gap-1">
                <Play className="h-3 w-3" />
                Tour
              </Badge>
            )}
            {gatedCommunity && (
              <Badge variant="outline" className="text-xs gap-1">
                <Shield className="h-3 w-3" />
                Condomínio
              </Badge>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Button 
              variant="elegant" 
              className="w-full"
              onClick={() => window.location.href = `/imovel/${id}`}
            >
              Ver Imóvel
            </Button>
            {virtualTour && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full gap-2"
                onClick={() => console.log('Open virtual tour')}
              >
                <Play className="h-4 w-4" />
                Tour Virtual
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}