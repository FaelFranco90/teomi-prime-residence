
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function SearchForm() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-luxury">
      <CardContent className="p-6">
        {/* Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Imóvel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="cobertura">Cobertura</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
              <SelectItem value="mansao">Mansão</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Bairro / Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphaville">Alphaville</SelectItem>
              <SelectItem value="campos-do-conde">Campos do Conde</SelectItem>
              <SelectItem value="altos-da-serra">Altos da Serra</SelectItem>
              <SelectItem value="vila-adyanna">Vila Adyanna</SelectItem>
              <SelectItem value="jardim-das-colinas">Jardim das Colinas</SelectItem>
              <SelectItem value="vale-dos-cristais">Vale dos Cristais</SelectItem>
              <SelectItem value="centro">Centro</SelectItem>
              <SelectItem value="centro-historico">Centro Histórico</SelectItem>
            </SelectContent>
          </Select>

          <Select>
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

          <Select>
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

          <Select>
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
              <Input type="text" placeholder="Área mín. (m²)" />
              <Input type="text" placeholder="Área máx. (m²)" />
            </div>
            
            <div className="flex gap-2">
              <Input type="text" placeholder="Valor mín." />
              <Input type="text" placeholder="Valor máx." />
            </div>

            <Input type="text" placeholder="Código do Imóvel" />
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
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
          
          <Button variant="luxury" className="flex-1 gap-2">
            <Search className="h-4 w-4" />
            Buscar Imóveis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
