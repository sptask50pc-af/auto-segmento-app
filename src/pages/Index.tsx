import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { PromoBanner } from "@/components/PromoBanner";
import { BrandCard } from "@/components/BrandCard";
import { CategoryCard } from "@/components/CategoryCard";
import { carBrands, partBrands, categories } from "@/data/mockData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Início" />

      <main className="container px-4 py-6 space-y-8">
        {/* Promo Banner */}
        <section className="animate-fade-in">
          <PromoBanner />
        </section>

        {/* Novidades - Part Brands */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Novidades</h2>
          <div className="grid grid-cols-4 gap-4">
            {partBrands.map((brand, i) => (
              <BrandCard
                key={brand.id}
                name={brand.name}
                logo={brand.logo}
                variant="square"
                delay={i * 50}
              />
            ))}
          </div>
        </section>

        {/* Main Car Brands */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Marcas principais</h2>
          <div className="grid grid-cols-4 gap-4">
            {carBrands.slice(0, 8).map((brand, i) => (
              <BrandCard
                key={brand.id}
                name={brand.name}
                logo={brand.logo}
                variant="circle"
                delay={i * 50}
              />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Categorias</h2>
          <div className="space-y-3">
            {categories.map((category, i) => (
              <CategoryCard
                key={category.id}
                label={category.label}
                icon={category.icon}
                delay={i * 75}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
