import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { pecasSubCategories, lubrificantesSubCategories } from "@/data/mockData";
import { Home } from "lucide-react";

const SubCategories = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const getSubCategories = () => {
    if (category === "pecas") return { name: "Peças", items: pecasSubCategories };
    if (category === "lubrificantes") return { name: "Lubrificantes", items: lubrificantesSubCategories };
    return null;
  };

  const data = getSubCategories();

  if (!data) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header title="Sub-categorias" />
        <main className="container px-4 py-6">
          <p className="text-muted-foreground">Categoria não encontrada</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={data.name} />

      <main className="container px-4 py-6 space-y-6">
        {/* Back to home button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Voltar às categorias</span>
        </button>

        {/* Sub-categories grid */}
        <div className="grid grid-cols-3 gap-4">
          {data.items.map((item, i) => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-2 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-2xl hover:border-primary/50 transition-colors">
                {item.icon}
              </div>
              <span className="text-xs text-center text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SubCategories;
