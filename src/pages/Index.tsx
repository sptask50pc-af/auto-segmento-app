import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { PromoBanner } from "@/components/PromoBanner";
import { CategoryCard } from "@/components/CategoryCard";
import { mainCategories, categories } from "@/data/mockData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Início" />

      <main className="container px-4 py-6 space-y-8">
        {/* Promo Banner */}
        <section className="animate-fade-in">
          <PromoBanner />
        </section>

        {/* Categorias principais */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Categorias principais</h2>
          <div className="space-y-3">
            {mainCategories.map((category, i) => (
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
