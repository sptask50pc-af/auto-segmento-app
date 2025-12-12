import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { mainCategories } from "@/data/mockData";
import { ChevronRight, Sparkles } from "lucide-react";

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
        {/* Hero Welcome Section */}
        <section className="animate-fade-in relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card p-6 border border-primary/20">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Peças Premium</span>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">
              Bem-vindo ao Segmento Positivo
            </h1>
            <p className="text-muted-foreground text-sm">
              Explore as melhores peças automotivas
            </p>
          </div>
        </section>

        {/* Principais categorias */}
        <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Principais categorias
            </h2>
          </div>
          
          {/* Grid of main categories */}
          <div className="grid grid-cols-4 gap-4">
            {mainCategories.map((category, index) => {
              const hasSubCategories = true;
              
              return (
                <div
                  key={category.id}
                  onClick={() => hasSubCategories && handleCategoryClick(category.label)}
                  className="group flex flex-col items-center gap-2 cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-card to-secondary border border-border flex items-center justify-center text-3xl transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-105 group-active:scale-95">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 transition-transform group-hover:scale-110">
                      {category.icon}
                    </span>
                  </div>
                  <span className="text-xs text-center text-muted-foreground leading-tight group-hover:text-foreground transition-colors font-medium">
                    {category.label}
                  </span>
                  {hasSubCategories && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground -mt-1 group-hover:text-primary transition-colors" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="animate-slide-up grid grid-cols-3 gap-3" style={{ animationDelay: "200ms" }}>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-primary">500+</p>
            <p className="text-xs text-muted-foreground">Produtos</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-foreground">24h</p>
            <p className="text-xs text-muted-foreground">Entrega</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Original</p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
