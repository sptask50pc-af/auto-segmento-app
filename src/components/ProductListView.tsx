import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { Product } from "@/types/product";
import { ChevronLeft } from "lucide-react";

interface ProductListViewProps {
  categoryName: string;
  products: Product[];
  backPath: string;
}

export function ProductListView({ categoryName, products, backPath }: ProductListViewProps) {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Reset filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={categoryName} />

      <main className="container px-4 py-6 space-y-6">
        {/* Back button and filters */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
          
          {products.length > 0 && (
            <ProductFilters 
              products={products} 
              onFilterChange={setFilteredProducts} 
            />
          )}
        </div>

        {/* Results count */}
        {products.length > 0 && filteredProducts.length !== products.length && (
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} de {products.length} produtos
          </p>
        )}

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                delay={i * 50}
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto corresponde aos filtros selecionados.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
            <p className="text-sm text-muted-foreground mt-2">Use o botão "Update" na página Admin para importar produtos.</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
