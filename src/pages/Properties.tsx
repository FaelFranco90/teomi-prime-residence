import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/SearchForm";
import PropertyCard from "@/components/PropertyCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SlidersHorizontal, MessageCircle, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
const allProperties = [{
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
  isNew: false
}, {
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
  isNew: true
}, {
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
  isNew: false
}, {
  id: "4",
  code: "TP004",
  title: "Cobertura Duplex com Vista Serra",
  location: "Vila Adyanna, São José dos Campos",
  price: "R$ 3.200.000",
  area: "400m²",
  bedrooms: 5,
  bathrooms: 7,
  suites: 4,
  parking: 4,
  images: [property1, property3, property2],
  exclusive: true,
  virtualTour: true,
  gatedCommunity: true,
  isNew: true
}, {
  id: "5",
  code: "TP005",
  title: "Casa Térrea em Condomínio Fechado",
  location: "Altos da Serra, Caçapava",
  price: "R$ 1.650.000",
  area: "320m²",
  bedrooms: 4,
  bathrooms: 5,
  suites: 2,
  parking: 3,
  images: [property2, property3, property1],
  virtualTour: false,
  gatedCommunity: true,
  isNew: false
}, {
  id: "6",
  code: "TP006",
  title: "Loft Moderno Centro Histórico",
  location: "Centro Histórico, São José dos Campos",
  price: "R$ 890.000",
  area: "120m²",
  bedrooms: 2,
  bathrooms: 2,
  suites: 1,
  parking: 1,
  images: [property3, property2, property1],
  virtualTour: true,
  gatedCommunity: false,
  isNew: false
}, {
  id: "7",
  code: "TP007",
  title: "Mansão Colonial Renovada",
  location: "Jardim das Colinas, São José dos Campos",
  price: "R$ 4.200.000",
  area: "520m²",
  bedrooms: 6,
  bathrooms: 8,
  suites: 4,
  parking: 6,
  images: [property1, property2, property3],
  exclusive: true,
  virtualTour: true,
  gatedCommunity: true,
  isNew: true
}, {
  id: "8",
  code: "TP008",
  title: "Casa de Campo Premium",
  location: "Vale dos Cristais, Caçapava",
  price: "Sob Consulta",
  area: "450m²",
  bedrooms: 4,
  bathrooms: 6,
  suites: 3,
  parking: 5,
  images: [property2, property1, property3],
  featured: true,
  exclusive: true,
  virtualTour: true,
  gatedCommunity: true,
  isNew: false
}];
export default function Properties() {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const itemsPerPage = 12;
  const totalPages = Math.ceil(allProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = allProperties.slice(startIndex, endIndex);
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-luxury-dark text-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-white">
            Imóveis de <span className="text-accent">Altíssimo Padrão</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto text-white">
            Encontre residências, coberturas e empreendimentos exclusivos disponíveis para venda
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                {allProperties.length} imóveis encontrados
              </h2>
              <p className="text-muted-foreground text-sm">
                Página {currentPage} de {totalPages} - Propriedades selecionadas especialmente para você
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Sorting */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais Recentes</SelectItem>
                    <SelectItem value="price-high">Maior Valor</SelectItem>
                    <SelectItem value="price-low">Menor Valor</SelectItem>
                    <SelectItem value="area-high">Maior Área</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-4">
            {currentProperties.map(property => <PropertyCard key={property.id} {...property} viewMode="list" />)}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col items-center gap-6">
            <p className="text-muted-foreground text-center">
              Exibindo {startIndex + 1} - {Math.min(endIndex, allProperties.length)} de {allProperties.length} imóveis
            </p>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={e => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
                </PaginationItem>
                
                {Array.from({
                length: totalPages
              }, (_, i) => i + 1).map(page => <PaginationItem key={page}>
                    <PaginationLink href="#" onClick={e => {
                  e.preventDefault();
                  setCurrentPage(page);
                }} isActive={currentPage === page}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>)}
                
                <PaginationItem>
                  <PaginationNext href="#" onClick={e => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      
    </div>;
}