import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Percent } from "lucide-react";

const Promotions = () => {
  const { products } = useProducts();

  const promoProducts = products.filter(
    (p) => p.originalPrice && p.originalPrice > p.price
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Promoções" />

      <main className="container px-4 py-6 space-y-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-card to-card p-6">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground animate-pulse-glow">
              <Percent className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ofertas Especiais</h1>
              <p className="text-muted-foreground">Aproveite os melhores preços</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {promoProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 50} />
          ))}
        </div>

        {promoProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-4xl mb-4">🏷️</p>
            <p className="text-muted-foreground">Nenhuma promoção no momento</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Promotions;
