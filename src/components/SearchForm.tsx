import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchForm() {
  const [searchType, setSearchType] = useState("compra");
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-luxury">
      <CardContent className="p-6">
        {/* Search Type Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={searchType === "compra" ? "luxury" : "outline"}
            onClick={() => setSearchType("compra")}
            className="flex-1"
          >
            Compra
          </Button>
          <Button
            variant={searchType === "locacao" ? "luxury" : "outline"}
            onClick={() => setSearchType("locacao")}
            className="flex-1"
          >
            Locação
          </Button>
        </div>

        {/* Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Imóvel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="cobertura">Cobertura</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Localização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphaville">Alphaville</SelectItem>
              <SelectItem value="campos-do-conde">Campos do Conde</SelectItem>
              <SelectItem value="altos-da-serra">Altos da Serra</SelectItem>
              <SelectItem value="centro">Centro</SelectItem>
              <SelectItem value="vila-adyanna">Vila Adyanna</SelectItem>
            </SelectContent>
          </Select>

          <Input type="text" placeholder="Valor máximo" />

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Dormitórios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Dormitório</SelectItem>
              <SelectItem value="2">2 Dormitórios</SelectItem>
              <SelectItem value="3">3 Dormitórios</SelectItem>
              <SelectItem value="4">4+ Dormitórios</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-4 border-t border-border">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Suítes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Suíte</SelectItem>
                <SelectItem value="2">2 Suítes</SelectItem>
                <SelectItem value="3">3+ Suítes</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Vagas de Garagem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Vaga</SelectItem>
                <SelectItem value="2">2 Vagas</SelectItem>
                <SelectItem value="3">3+ Vagas</SelectItem>
              </SelectContent>
            </Select>

            <Input type="text" placeholder="Área mínima (m²)" />
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
          
          <Button variant="luxury" className="flex-1 gap-2">
            <Search className="h-4 w-4" />
            Buscar Imóveis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}