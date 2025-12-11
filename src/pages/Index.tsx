import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { mainCategories } from "@/data/mockData";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (label: string) => {
    if (label === "Peças") navigate("/subcategories/pecas");
    else if (label === "Lubrificantes") navigate("/subcategories/lubrificantes");
    else if (label === "Acessórios") navigate("/subcategories/acessorios");
    else if (label === "Cuidado e Detalhe") navigate("/subcategories/cuidado-detalhe");
    else if (label === "Desempenho e Upgrade") navigate("/subcategories/desempenho-upgrade");
    else if (label === "Elétrica") navigate("/subcategories/eletrica");
    else if (label === "Universal") navigate("/subcategories/universal");
    else if (label === "Sinalética e Segurança") navigate("/subcategories/sinaletica-seguranca");
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
              const hasSubCategories = true;
              
              return (
                <div
                  key={category.id}
                  onClick={() => hasSubCategories && handleCategoryClick(category.label)}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-2xl hover:border-primary/50 transition-colors">
                    {category.icon}
                  </div>
                  <span className="text-xs text-center text-muted-foreground leading-tight">{category.label}</span>
                  {hasSubCategories && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground -mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
