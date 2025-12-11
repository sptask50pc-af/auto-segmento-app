import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { mainCategories, pecasSubCategories, lubrificantesSubCategories } from "@/data/mockData";
import { ChevronDown } from "lucide-react";

const Index = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (label: string) => {
    setExpandedCategory(expandedCategory === label ? null : label);
  };

  const getSubCategories = (label: string) => {
    if (label === "Peças") return pecasSubCategories;
    if (label === "Lubrificantes") return lubrificantesSubCategories;
    return null;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Início" />

      <main className="container px-4 py-6 space-y-8">
        {/* Principais categorias */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Principais categorias</h2>
          
          {/* Grid of main categories */}
          <div className="grid grid-cols-4 gap-4">
            {mainCategories.map((category) => {
              const hasSubCategories = category.label === "Peças" || category.label === "Lubrificantes";
              const isExpanded = expandedCategory === category.label;
              
              return (
                <div
                  key={category.id}
                  onClick={() => hasSubCategories && toggleCategory(category.label)}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-full bg-card border flex items-center justify-center text-2xl transition-colors ${isExpanded ? 'border-primary' : 'border-border hover:border-primary/50'}`}>
                    {category.icon}
                  </div>
                  <span className="text-xs text-center text-muted-foreground leading-tight">{category.label}</span>
                  {hasSubCategories && (
                    <ChevronDown 
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 -mt-1 ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Sub-categories - separate section */}
          {expandedCategory && getSubCategories(expandedCategory) && (
            <div className="mt-6 p-4 bg-card rounded-lg border border-border animate-fade-in">
              <h3 className="text-sm font-medium text-foreground mb-4">{expandedCategory}</h3>
              <div className="grid grid-cols-3 gap-4">
                {getSubCategories(expandedCategory)!.map((category, i) => (
                  <div
                    key={category.id}
                    className="flex flex-col items-center gap-2 cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center text-xl hover:border-primary/50 transition-colors">
                      {category.icon}
                    </div>
                    <span className="text-xs text-center text-muted-foreground">{category.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
