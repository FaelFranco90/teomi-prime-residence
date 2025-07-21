import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/SearchForm";
import PropertyCard from "@/components/PropertyCard";
import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const rentalProperties = [
  {
    id: "r1",
    title: "Penthouse Mobiliado Vista Panorâmica",
    location: "Alphaville, São José dos Campos",
    price: "R$ 12.000/mês",
    area: "280m²",
    bedrooms: 4,
    bathrooms: 5,
    parking: 3,
    image: property1,
    featured: true,
    exclusive: true,
  },
  {
    id: "r2", 
    title: "Casa Completa com Piscina",
    location: "Campos do Conde, Tremembé",
    price: "R$ 8.500/mês",
    area: "350m²",
    bedrooms: 5,
    bathrooms: 6,
    parking: 4,
    image: property2,
    featured: true,
  },
  {
    id: "r3",
    title: "Apartamento Corporativo Centro",
    location: "Centro, São José dos Campos", 
    price: "R$ 6.200/mês",
    area: "180m²",
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    image: property3,
  },
  {
    id: "r4",
    title: "Cobertura Duplex Mobiliada",
    location: "Vila Adyanna, São José dos Campos",
    price: "R$ 15.000/mês",
    area: "400m²",
    bedrooms: 5,
    bathrooms: 7,
    parking: 4,
    image: property1,
    exclusive: true,
  },
];

export default function Rentals() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-luxury-dark text-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Imóveis para <span className="text-accent">Locação</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Residências de luxo para locação temporária ou permanente
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <SearchForm />
        </div>
      </section>

      {/* Results Header */}
      <section className="py-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {rentalProperties.length} imóveis para locação
              </h2>
              <p className="text-muted-foreground text-sm">
                Opções exclusivas com total flexibilidade
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </Button>
              
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rentalProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {rentalProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">
            Locação de Imóveis de Luxo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Temporada</h3>
              <p className="text-muted-foreground text-sm">
                Estadias de curta duração com máximo conforto
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Corporativo</h3>
              <p className="text-muted-foreground text-sm">
                Soluções para executivos e empresas
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Residencial</h3>
              <p className="text-muted-foreground text-sm">
                Contratos de longa duração com flexibilidade
              </p>
            </div>
          </div>
          <Button variant="luxury" size="lg">
            Consultar Disponibilidade
          </Button>
        </div>
      </section>
    </div>
  );
}