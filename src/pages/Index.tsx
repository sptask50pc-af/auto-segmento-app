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
          <div className="grid grid-cols-4 gap-4">
            {mainCategories.map((category, i) => (
              <div
                key={category.id}
                className="flex flex-col items-center gap-2 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-2xl hover:border-primary/50 transition-colors">
                  {category.icon}
                </div>
                <span className="text-xs text-center text-muted-foreground">{category.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
