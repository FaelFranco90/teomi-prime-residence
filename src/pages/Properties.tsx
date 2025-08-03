import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/SearchForm";
import PropertyCard from "@/components/PropertyCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";
import { allProperties } from "@/data/properties";
export default function Properties() {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  
  const { 
    filters, 
    filteredProperties, 
    updateFilter, 
    clearFilters, 
    hasActiveFilters 
  } = usePropertyFilters(allProperties);

  // Sort filtered properties
  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    switch (sortBy) {
      case 'price-high':
        return sorted.sort((a, b) => (b.priceNumber || 0) - (a.priceNumber || 0));
      case 'price-low':
        return sorted.sort((a, b) => (a.priceNumber || 0) - (b.priceNumber || 0));
      case 'area-high':
        return sorted.sort((a, b) => (b.areaNumber || 0) - (a.areaNumber || 0));
      case 'recent':
      default:
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
  }, [filteredProperties, sortBy]);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = sortedProperties.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (key: any, value: string) => {
    updateFilter(key, value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };
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
          <SearchForm 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </section>

      {/* Results Header */}
      <section className="py-6 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                {sortedProperties.length} imóveis encontrados
                {hasActiveFilters && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    (filtrados de {allProperties.length} imóveis)
                  </span>
                )}
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
              Exibindo {startIndex + 1} - {Math.min(endIndex, sortedProperties.length)} de {sortedProperties.length} imóveis
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