import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { PromoBanner } from "@/components/PromoBanner";
import { mainCategories, pecasSubCategories } from "@/data/mockData";
import { ChevronDown } from "lucide-react";

const Index = () => {
  const [pecasExpanded, setPecasExpanded] = useState(false);

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
          
          {/* Grid of main categories */}
          <div className="grid grid-cols-4 gap-4">
            {mainCategories.map((category, i) => (
              <div
                key={category.id}
                onClick={() => category.label === "Peças" && setPecasExpanded(!pecasExpanded)}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-2xl hover:border-primary/50 transition-colors">
                  {category.icon}
                </div>
                <span className="text-xs text-center text-muted-foreground leading-tight">{category.label}</span>
                {category.label === "Peças" && (
                  <ChevronDown 
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 -mt-1 ${pecasExpanded ? 'rotate-180' : ''}`} 
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Peças sub-categories */}
          {pecasExpanded && (
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-border animate-fade-in">
              <h3 className="col-span-3 text-sm font-medium text-muted-foreground mb-2">Sub-categorias de Peças</h3>
              {pecasSubCategories.map((category, i) => (
                <div
                  key={category.id}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center text-xl hover:border-primary/50 transition-colors">
                    {category.icon}
                  </div>
                  <span className="text-xs text-center text-muted-foreground">{category.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
