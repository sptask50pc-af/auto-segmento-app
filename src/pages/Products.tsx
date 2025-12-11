import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import {
  mainCategories,
  pecasSubCategories,
  lubrificantesSubCategories,
  acessoriosSubCategories,
  cuidadoDetalheSubCategories,
  desempenhoUpgradeSubCategories,
  eletricaSubCategories,
  universalSubCategories,
  sinaleticaSegurancaSubCategories,
  carrocariaSubSubCategories,
  travagemSubSubCategories,
  filtrosSubSubCategories,
  suspensaoDirecaoSubSubCategories,
  motorSubSubCategories,
  sistemaEscapeSubSubCategories,
  multimediaEletronicaSubSubCategories,
} from "@/data/mockData";
import { Category } from "@/types/product";

// Combine all categories with their paths
const allCategories: (Category & { path: string; type: string })[] = [
  // Main categories
  ...mainCategories.map((c) => ({
    ...c,
    path: `/subcategories/${c.label.toLowerCase().replace(/ /g, "-")}`,
    type: "Categoria",
  })),
  // Peças subcategories
  ...pecasSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/peças/${c.label.toLowerCase().replace(/ /g, "-")}`,
    type: "Peças",
  })),
  // Lubrificantes subcategories
  ...lubrificantesSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/lubrificantes/${c.label.toLowerCase().replace(/ /g, "-")}`,
    type: "Lubrificantes",
  })),
  // Acessórios subcategories
  ...acessoriosSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/acessórios/${c.label.toLowerCase().replace(/ /g, "-")}`,
    type: "Acessórios",
  })),
  // Cuidado e Detalhe subcategories
  ...cuidadoDetalheSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/cuidado-e-detalhe`,
    type: "Cuidado e Detalhe",
  })),
  // Desempenho e Upgrade subcategories
  ...desempenhoUpgradeSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/desempenho-e-upgrade`,
    type: "Desempenho e Upgrade",
  })),
  // Elétrica subcategories
  ...eletricaSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/elétrica`,
    type: "Elétrica",
  })),
  // Universal subcategories
  ...universalSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/universal`,
    type: "Universal",
  })),
  // Sinalética e Segurança subcategories
  ...sinaleticaSegurancaSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/sinalética-e-segurança`,
    type: "Sinalética e Segurança",
  })),
  // Sub-subcategories
  ...carrocariaSubSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/peças/carroçaria`,
    type: "Carroçaria",
  })),
  ...travagemSubSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/peças/travagem`,
    type: "Travagem",
  })),
  ...filtrosSubSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/peças/filtros`,
    type: "Filtros",
  })),
  ...suspensaoDirecaoSubSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/peças/suspensão-e-direção`,
    type: "Suspensão e Direção",
  })),
  ...motorSubSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/peças/motor`,
    type: "Motor",
  })),
  ...sistemaEscapeSubSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/peças/sistema-de-escape`,
    type: "Sistema de Escape",
  })),
  ...multimediaEletronicaSubSubCategories.map((c) => ({
    ...c,
    path: `/subcategories/acessórios/multimédia-&-eletrónica`,
    type: "Multimédia & Eletrónica",
  })),
];

const Products = () => {
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const searchLower = search.toLowerCase();

  const filteredCategories = search
    ? allCategories.filter((c) => c.label.toLowerCase().includes(searchLower))
    : [];

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower)
  );

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Produtos" />

      <main className="container px-4 py-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos, categorias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Categories Results */}
        {filteredCategories.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Categorias</h3>
            <div className="space-y-2">
              {filteredCategories.slice(0, 6).map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.path)}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border cursor-pointer hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{category.label}</p>
                      <p className="text-xs text-muted-foreground">{category.type}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Results */}
        {(filteredProducts.length > 0 || !search) && (
          <div className="space-y-3">
            {search && filteredCategories.length > 0 && (
              <h3 className="text-sm font-medium text-muted-foreground">Produtos</h3>
            )}
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} delay={i * 50} />
              ))}
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && filteredCategories.length === 0 && search && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-muted-foreground">Nenhum resultado encontrado</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Products;
