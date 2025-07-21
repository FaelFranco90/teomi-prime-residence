import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Car, Square, MapPin } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  image: string;
  featured?: boolean;
  exclusive?: boolean;
}

export default function PropertyCard({ 
  id, 
  title, 
  location, 
  price, 
  area, 
  bedrooms, 
  bathrooms, 
  parking, 
  image, 
  featured = false,
  exclusive = false 
}: PropertyCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-[1.02]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
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
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">{location}</p>
            </div>
          </div>

          {/* Property specs */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{area}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{parking}</span>
            </div>
          </div>

          <Button 
            variant="elegant" 
            className="w-full"
            onClick={() => window.location.href = `/imovel/${id}`}
          >
            Ver Imóvel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}