import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Website = () => {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products by search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group products by category
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Outros";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  const categories = Object.keys(productsByCategory).sort();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Produtos" />

      <main className="container px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products count */}
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
        </p>

        {/* Products by category */}
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category} className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">{category}</h2>
              <div className="grid grid-cols-2 gap-4">
                {productsByCategory[category].map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    delay={i * 50}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado.</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Website;
