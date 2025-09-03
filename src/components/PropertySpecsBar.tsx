import { Bed, Bath, Car, Square, Calculator } from "lucide-react";

interface PropertySpecsBarProps {
  area?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  price?: string;
}

export function PropertySpecsBar({ 
  area, 
  bedrooms, 
  bathrooms, 
  parking, 
  price 
}: PropertySpecsBarProps) {
  // Calculate price per m² if both area and price are available
  const calculatePricePerM2 = () => {
    if (!area || !price) return null;
    
    const areaNumber = parseFloat(area.replace(/\D/g, ''));
    const priceNumber = parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.'));
    
    if (areaNumber && priceNumber) {
      const pricePerM2 = priceNumber / areaNumber;
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
      }).format(pricePerM2);
    }
    return null;
  };

  const pricePerM2 = calculatePricePerM2();

  const specs = [
    {
      icon: Square,
      value: area || '—',
      label: 'Área total'
    },
    {
      icon: Bed,
      value: bedrooms?.toString() || '0',
      label: bedrooms === 1 ? 'Quarto' : 'Quartos'
    },
    {
      icon: Bath,
      value: bathrooms?.toString() || '0',
      label: bathrooms === 1 ? 'Banheiro' : 'Banheiros'
    },
    {
      icon: Car,
      value: parking?.toString() || '0',
      label: parking === 1 ? 'Vaga' : 'Vagas'
    }
  ];

  // Add price per m² if available
  if (pricePerM2) {
    specs.push({
      icon: Calculator,
      value: pricePerM2,
      label: 'por m²'
    });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between gap-4 overflow-x-auto">
        {specs.map((spec, index) => (
          <div key={index} className="flex items-center gap-3 min-w-0 flex-shrink-0">
            <div className="p-2 bg-accent/10 rounded-lg">
              <spec.icon className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm whitespace-nowrap">{spec.value}</p>
              <p className="text-xs text-muted-foreground whitespace-nowrap">{spec.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}