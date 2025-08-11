
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PropertyFilters } from "@/hooks/usePropertyFilters";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { supabase } from "@/integrations/supabase/client";

interface SearchFormProps {
  filters: PropertyFilters;
  onFilterChange: (key: keyof PropertyFilters, value: string) => void;
  onClearFilters: () => void;
  onSearch?: () => void;
  hasActiveFilters: boolean;
}

export default function SearchForm({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onSearch,
  hasActiveFilters 
}: SearchFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { types } = usePropertyTypes();
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('location');
      if (!error && data) {
        const unique = Array.from(new Set(data.map((d: any) => d.location).filter(Boolean)));
        unique.sort((a, b) => a.localeCompare(b));
        setLocations(unique);
      }
    };
    fetchLocations();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-luxury">
      <CardContent className="p-6">
        {/* Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <Select value={filters.propertyType} onValueChange={(value) => onFilterChange('propertyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Imóvel" />
            </SelectTrigger>
            <SelectContent>
              {types
                .filter((t) => t.active)
                .map((t) => (
                  <SelectItem key={t.id} value={t.key}>
                    {t.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={filters.location} onValueChange={(value) => onFilterChange('location', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Bairro / Cidade" />
            </SelectTrigger>
            <SelectContent>
              {locations.length > 0 ? (
                locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="">Carregando locais...</SelectItem>
              )}
            </SelectContent>
          </Select>

          <Select value={filters.bedrooms} onValueChange={(value) => onFilterChange('bedrooms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Dormitórios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Dormitório</SelectItem>
              <SelectItem value="2">2 Dormitórios</SelectItem>
              <SelectItem value="3">3 Dormitórios</SelectItem>
              <SelectItem value="4">4 Dormitórios</SelectItem>
              <SelectItem value="5">5+ Dormitórios</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.suites} onValueChange={(value) => onFilterChange('suites', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Suítes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Suíte</SelectItem>
              <SelectItem value="2">2 Suítes</SelectItem>
              <SelectItem value="3">3 Suítes</SelectItem>
              <SelectItem value="4">4+ Suítes</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.parking} onValueChange={(value) => onFilterChange('parking', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Vagas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Vaga</SelectItem>
              <SelectItem value="2">2 Vagas</SelectItem>
              <SelectItem value="3">3 Vagas</SelectItem>
              <SelectItem value="4">4 Vagas</SelectItem>
              <SelectItem value="5">5+ Vagas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pt-4 border-t border-border">
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Área mín. (m²)" 
                value={filters.minArea}
                onChange={(e) => onFilterChange('minArea', e.target.value)}
              />
              <Input 
                type="text" 
                placeholder="Área máx. (m²)" 
                value={filters.maxArea}
                onChange={(e) => onFilterChange('maxArea', e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Valor mín." 
                value={filters.minPrice}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
              />
              <Input 
                type="text" 
                placeholder="Valor máx." 
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              />
            </div>

            <Input 
              type="text" 
              placeholder="Código do Imóvel" 
              value={filters.code}
              onChange={(e) => onFilterChange('code', e.target.value)}
            />
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showAdvanced ? "Menos Filtros" : "Mais Filtros"}
          </Button>
          
          <Button 
            variant="luxury" 
            className="flex-1 gap-2"
            onClick={onSearch}
          >
            <Search className="h-4 w-4" />
            Buscar Imóveis
            {hasActiveFilters && (
              <span className="bg-background/20 px-2 py-1 rounded-full text-xs">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
