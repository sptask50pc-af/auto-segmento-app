import { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  brand: string | null;
  priceRange: [number, number];
  weight: string | null;
}

interface ProductFiltersProps {
  products: Product[];
  onFilterChange: (filtered: Product[]) => void;
}

// Extract weight from product name (e.g., "1L", "500ml", "5L", "300g")
function extractWeight(name: string): string | null {
  const match = name.match(/(\d+(?:[.,]\d+)?)\s*(ml|l|g|kg|L)/i);
  if (match) {
    const value = match[1].replace(',', '.');
    const unit = match[2].toLowerCase();
    return `${value}${unit === 'l' ? 'L' : unit}`;
  }
  return null;
}

// Normalize weight to ml for comparison
function normalizeWeightToMl(weight: string): number {
  const match = weight.match(/(\d+(?:\.\d+)?)\s*(ml|l|g|kg|L)/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  switch (unit) {
    case 'l':
      return value * 1000;
    case 'ml':
      return value;
    case 'kg':
      return value * 1000;
    case 'g':
      return value;
    default:
      return value;
  }
}

export function ProductFilters({ products, onFilterChange }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    brand: null,
    priceRange: [0, 1000],
    weight: null,
  });

  // Extract unique brands from products
  const brands = useMemo(() => {
    const uniqueBrands = new Set<string>();
    products.forEach(p => {
      if (p.brand) uniqueBrands.add(p.brand);
    });
    return Array.from(uniqueBrands).sort();
  }, [products]);

  // Extract unique weights from products
  const weights = useMemo(() => {
    const uniqueWeights = new Map<string, number>();
    products.forEach(p => {
      const weight = p.weight || extractWeight(p.name);
      if (weight) {
        uniqueWeights.set(weight, normalizeWeightToMl(weight));
      }
    });
    return Array.from(uniqueWeights.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([w]) => w);
  }, [products]);

  // Get price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Apply filters
  const applyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    let filtered = [...products];
    
    // Filter by brand
    if (newFilters.brand) {
      filtered = filtered.filter(p => p.brand === newFilters.brand);
    }
    
    // Filter by price range
    filtered = filtered.filter(p => 
      p.price >= newFilters.priceRange[0] && p.price <= newFilters.priceRange[1]
    );
    
    // Filter by weight
    if (newFilters.weight) {
      filtered = filtered.filter(p => {
        const productWeight = p.weight || extractWeight(p.name);
        return productWeight === newFilters.weight;
      });
    }
    
    onFilterChange(filtered);
  };

  const resetFilters = () => {
    const resetState: FilterState = {
      brand: null,
      priceRange: [priceRange.min, priceRange.max],
      weight: null,
    };
    applyFilters(resetState);
  };

  const hasActiveFilters = filters.brand || filters.weight || 
    filters.priceRange[0] > priceRange.min || filters.priceRange[1] < priceRange.max;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2", hasActiveFilters && "border-primary text-primary")}>
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              !
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] bg-card border-border">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Filtros</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Brand Filter */}
          <div className="space-y-3">
            <Label>Marca</Label>
            <Select 
              value={filters.brand || "all"} 
              onValueChange={(value) => applyFilters({ ...filters, brand: value === "all" ? null : value })}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Todas as marcas" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                <SelectItem value="all">Todas as marcas</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Preço</Label>
              <span className="text-sm text-muted-foreground">
                €{filters.priceRange[0]} - €{filters.priceRange[1]}
              </span>
            </div>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                min={priceRange.min}
                max={priceRange.max}
                step={1}
                onValueChange={(value) => applyFilters({ ...filters, priceRange: value as [number, number] })}
                className="[&_[role=slider]]:bg-primary"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>€{priceRange.min}</span>
              <span>€{priceRange.max}</span>
            </div>
          </div>

          {/* Weight Filter */}
          {weights.length > 0 && (
            <div className="space-y-3">
              <Label>Peso / Volume</Label>
              <Select 
                value={filters.weight || "all"} 
                onValueChange={(value) => applyFilters({ ...filters, weight: value === "all" ? null : value })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Todos os pesos" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="all">Todos os pesos</SelectItem>
                  {weights.map(weight => (
                    <SelectItem key={weight} value={weight}>{weight}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Button onClick={() => setIsOpen(false)} className="w-full">
            Ver Resultados
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
