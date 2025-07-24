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

  return (
    <Card className="group overflow-hidden hover:shadow-luxury transition-all duration-200 border border-border/50">
      <div className="flex gap-6 p-6">
        {/* Left Side - Main Image */}
        <div className="flex-shrink-0">
          <div className="relative w-80 h-60 rounded-lg overflow-hidden">
            <img 
              src={images[currentImageIndex]} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
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
              {images.slice(0, 6).map((image, index) => (
                <div
                  key={index}
                  className={`relative w-15 h-12 rounded cursor-pointer overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-border'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`${title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 6 && index === 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">+{images.length - 6}</span>
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
                    onClick={() => console.log('Open virtual tour')}
                  >
                    <Play className="h-4 w-4" />
                    Tour Virtual
                  </Button>
                )}
                <Button 
                  variant="default" 
                  size="default"
                  className="px-6"
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