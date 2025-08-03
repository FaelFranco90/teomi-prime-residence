
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchForm from "@/components/SearchForm";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";
import { allProperties } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import { ArrowRight, Shield, Eye, Users, Award, Home as HomeIcon, Building2, Crown, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-luxury-home.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const featuredProperties = [
  {
    id: "1",
    code: "TP001",
    title: "Penthouse Exclusivo Vista Panorâmica",
    location: "Alphaville, São José dos Campos",
    price: "R$ 2.800.000",
    area: "280m²",
    bedrooms: 4,
    bathrooms: 5,
    suites: 3,
    parking: 3,
    images: [property1, property2, property3],
    featured: true,
    exclusive: true,
    virtualTour: true,
    gatedCommunity: true,
    isNew: false,
  },
  {
    id: "2", 
    code: "TP002",
    title: "Casa Moderna com Piscina Infinita",
    location: "Campos do Conde, Tremembé",
    price: "R$ 1.950.000",
    area: "350m²",
    bedrooms: 5,
    bathrooms: 6,
    suites: 2,
    parking: 4,
    images: [property2, property1, property3],
    featured: true,
    virtualTour: true,
    gatedCommunity: true,
    isNew: true,
  },
  {
    id: "3",
    code: "TP003",
    title: "Apartamento de Luxo no Centro",
    location: "Centro, São José dos Campos", 
    price: "R$ 1.200.000",
    area: "180m²",
    bedrooms: 3,
    bathrooms: 3,
    suites: 1,
    parking: 2,
    images: [property3, property1, property2],
    featured: true,
    virtualTour: false,
    gatedCommunity: false,
    isNew: false,
  },
];

const neighborhoods = [
  { name: "Alphaville", count: "25 imóveis", image: property1 },
  { name: "Campos do Conde", count: "18 imóveis", image: property2 },
  { name: "Altos da Serra", count: "12 imóveis", image: property3 },
  { name: "Vila Adyanna", count: "8 imóveis", image: property1 },
];

const propertyTypes = [
  { name: "Casas de Luxo", icon: HomeIcon, description: "Residências exclusivas com arquitetura sofisticada" },
  { name: "Apartamentos", icon: Building2, description: "Unidades em condomínios de alto padrão" },
  { name: "Coberturas", icon: Crown, description: "Penthouses com vistas privilegiadas" },
  { name: "Terrenos", icon: MapPin, description: "Lotes em localizações nobres" },
];

export default function Home() {
  const navigate = useNavigate();
  const { 
    filters, 
    updateFilter, 
    clearFilters, 
    hasActiveFilters 
  } = usePropertyFilters(allProperties);

  const handleSearch = () => {
    navigate('/imoveis');
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Luxury Home Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Exclusividade <span className="text-accent">Absoluta</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            Imóveis de altíssimo padrão com atendimento consultivo, discrição e segurança total
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="gold" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/imoveis')}
            >
              Explorar Imóveis
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50"
              onClick={() => navigate('/contato')}
            >
              Agendar Atendimento
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Encontre seu Imóvel Ideal
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Use nossos filtros avançados para descobrir propriedades que atendem exatamente às suas necessidades
            </p>
          </div>
          <SearchForm 
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
            onSearch={handleSearch}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Descubra seu Tipo de Imóvel
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada propriedade é cuidadosamente selecionada para atender aos mais altos padrões de qualidade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Card key={index} className="text-center hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      <IconComponent className="h-12 w-12 text-accent" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-3">{type.name}</h3>
                    <p className="text-muted-foreground text-sm">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Imóveis em Destaque
              </h2>
              <p className="text-muted-foreground">
                Propriedades exclusivas selecionadas especialmente para você
              </p>
            </div>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate('/imoveis')}
            >
              Ver Todos <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} viewMode="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Bem-vindo à <span className="text-accent">Teomi Prime</span>
              </h2>
              <p className="text-lg mb-6 text-foreground">
                Exclusividade, Confiança e Discrição no Mercado de Altíssimo Padrão
              </p>
              <p className="mb-6 text-muted-foreground">
                Na Teomi Prime, acreditamos que negócios extraordinários exigem mais do que competência: 
                exigem discrição absoluta, atendimento personalizado e total segurança para todas as partes envolvidas.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-accent" />
                  <span className="text-sm">Confidencialidade Total</span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-accent" />
                  <span className="text-sm">Atendimento Reservado</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-accent" />
                  <span className="text-sm">Equipe Especializada</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-accent" />
                  <span className="text-sm">Segurança Jurídica</span>
                </div>
              </div>
              <Button 
                variant="gold" 
                size="lg" 
                className="gap-2"
                onClick={() => navigate('/sobre')}
              >
                Conheça Mais <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Luxury Interior"
                className="rounded-lg shadow-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Regiões Exclusivas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra as localizações mais privilegiadas da região
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {neighborhoods.map((neighborhood, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="relative aspect-[4/3]">
                  <img 
                    src={neighborhood.image} 
                    alt={neighborhood.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-serif text-lg font-semibold">{neighborhood.name}</h3>
                    <p className="text-sm text-white/90">{neighborhood.count}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
