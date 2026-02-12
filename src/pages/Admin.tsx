import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Input } from "@/components/ui/input";
import { Package, Search, CheckCircle, Eye } from "lucide-react";

const Admin = () => {
  const { products, loading, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.reference?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Loja" />

      <main className="container px-4 py-6 space-y-6">
        {/* Hero Admin Banner */}
        <section className="relative h-[140px] overflow-hidden rounded-2xl animate-fade-in">
          <div className="h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card p-6 border border-primary/20">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex items-center justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Visualização</span>
                </div>
                <h1 className="text-xl font-bold text-foreground mb-1">
                  Catálogo de Produtos
                </h1>
                <p className="text-muted-foreground text-sm">
                  Explore todos os produtos disponíveis
                </p>
              </div>
              <img 
                src="/icon.png" 
                alt="Segmento Positivo" 
                className="w-16 h-16 rounded-xl shadow-lg shadow-primary/20"
              />
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="rounded-xl bg-card/80 backdrop-blur p-4 border border-border hover:border-primary/40 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{products.length}</p>
                <p className="text-xs text-muted-foreground">Produtos</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card/80 backdrop-blur p-4 border border-border hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {products.filter((p) => p.inStock).length}
                </p>
                <p className="text-xs text-muted-foreground">Em estoque</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative animate-slide-up" style={{ animationDelay: "150ms" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar por nome, marca, categoria ou referência..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/80 backdrop-blur border-border focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Products Section Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Catálogo
          </h2>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} de {products.length}
            </p>
          )}
        </div>

        {/* Products Grid - No edit/delete actions for customers */}
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              showActions={false}
              onDelete={(id) => deleteProduct(id)}
              delay={i * 50}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Admin;
