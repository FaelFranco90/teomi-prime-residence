import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/SearchForm";
import PropertyCard from "@/components/PropertyCard";
import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const allProperties = [
  {
    id: "1",
    title: "Penthouse Exclusivo Vista Panorâmica",
    location: "Alphaville, São José dos Campos",
    price: "R$ 2.800.000",
    area: "280m²",
    bedrooms: 4,
    bathrooms: 5,
    parking: 3,
    image: property1,
    featured: true,
    exclusive: true,
  },
  {
    id: "2", 
    title: "Casa Moderna com Piscina Infinita",
    location: "Campos do Conde, Tremembé",
    price: "R$ 1.950.000",
    area: "350m²",
    bedrooms: 5,
    bathrooms: 6,
    parking: 4,
    image: property2,
    featured: true,
  },
  {
    id: "3",
    title: "Apartamento de Luxo no Centro",
    location: "Centro, São José dos Campos", 
    price: "R$ 1.200.000",
    area: "180m²",
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    image: property3,
    featured: true,
  },
  {
    id: "4",
    title: "Cobertura Duplex com Vista Serra",
    location: "Vila Adyanna, São José dos Campos",
    price: "R$ 3.200.000",
    area: "400m²",
    bedrooms: 5,
    bathrooms: 7,
    parking: 4,
    image: property1,
    exclusive: true,
  },
  {
    id: "5",
    title: "Casa Térrea em Condomínio Fechado",
    location: "Altos da Serra, Caçapava",
    price: "R$ 1.650.000",
    area: "320m²",
    bedrooms: 4,
    bathrooms: 5,
    parking: 3,
    image: property2,
  },
  {
    id: "6",
    title: "Loft Moderno Centro Histórico",
    location: "Centro Histórico, São José dos Campos",
    price: "R$ 890.000",
    area: "120m²",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    image: property3,
  },
];

export default function Properties() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-luxury-dark text-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Nossos <span className="text-accent">Imóveis</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Propriedades exclusivas de altíssimo padrão
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
                {allProperties.length} imóveis encontrados
              </h2>
              <p className="text-muted-foreground text-sm">
                Propriedades selecionadas especialmente para você
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
              {allProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {allProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Load More */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-muted-foreground mb-6">
            Exibindo {allProperties.length} de {allProperties.length} imóveis
          </p>
          <Button variant="outline" size="lg">
            Carregar Mais Imóveis
          </Button>
        </div>
      </section>
    </div>
  );
}