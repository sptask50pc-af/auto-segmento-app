import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { 
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
  spraysManutencaoSubSubCategories,
  multimediaEletronicaSubSubCategories,
  liquidosArrefecimentoSubSubCategories
} from "@/data/mockData";
import { Home, ChevronLeft } from "lucide-react";

const SubCategories = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const navigate = useNavigate();

  const getSubCategories = () => {
    // Handle sub-subcategories (third level)
    if (subcategory) {
      // Peças sub-subcategories
      if (subcategory === "carrocaria") return { name: "Carroçaria", items: carrocariaSubSubCategories, parent: "pecas" };
      if (subcategory === "travagem") return { name: "Travagem", items: travagemSubSubCategories, parent: "pecas" };
      if (subcategory === "filtros") return { name: "Filtros", items: filtrosSubSubCategories, parent: "pecas" };
      if (subcategory === "suspensao-direcao") return { name: "Suspensão e Direção", items: suspensaoDirecaoSubSubCategories, parent: "pecas" };
      if (subcategory === "motor") return { name: "Motor", items: motorSubSubCategories, parent: "pecas" };
      if (subcategory === "sistema-escape") return { name: "Sistema de Escape", items: sistemaEscapeSubSubCategories, parent: "pecas" };
      // Lubrificantes sub-subcategories
      if (subcategory === "sprays-manutencao") return { name: "Sprays & Manutenção", items: spraysManutencaoSubSubCategories, parent: "lubrificantes" };
      if (subcategory === "liquidos-arrefecimento") return { name: "Líquidos de Arrefecimento", items: liquidosArrefecimentoSubSubCategories, parent: "lubrificantes" };
      // Acessórios sub-subcategories
      if (subcategory === "multimedia-eletronica") return { name: "Multimédia & Eletrónica", items: multimediaEletronicaSubSubCategories, parent: "acessorios" };
      return null;
    }

    // Handle main subcategories (second level)
    if (category === "pecas") return { name: "Peças", items: pecasSubCategories };
    if (category === "lubrificantes") return { name: "Lubrificantes", items: lubrificantesSubCategories };
    if (category === "acessorios") return { name: "Acessórios", items: acessoriosSubCategories };
    if (category === "cuidado-detalhe") return { name: "Cuidado e Detalhe", items: cuidadoDetalheSubCategories };
    if (category === "desempenho-upgrade") return { name: "Desempenho e Upgrade", items: desempenhoUpgradeSubCategories };
    if (category === "eletrica") return { name: "Elétrica", items: eletricaSubCategories };
    if (category === "universal") return { name: "Universal", items: universalSubCategories };
    if (category === "sinaletica-seguranca") return { name: "Sinalética e Segurança", items: sinaleticaSegurancaSubCategories };
    return null;
  };

  const handleSubCategoryClick = (label: string) => {
    if (category === "pecas" && !subcategory) {
      if (label === "Carroçaria") navigate("/subcategories/pecas/carrocaria");
      else if (label === "Travagem") navigate("/subcategories/pecas/travagem");
      else if (label === "Filtros") navigate("/subcategories/pecas/filtros");
      else if (label === "Suspensão e Direção") navigate("/subcategories/pecas/suspensao-direcao");
      else if (label === "Motor") navigate("/subcategories/pecas/motor");
      else if (label === "Sistema de Escape") navigate("/subcategories/pecas/sistema-escape");
    }
    if (category === "lubrificantes" && !subcategory) {
      if (label === "Sprays & Manutenção") navigate("/subcategories/lubrificantes/sprays-manutencao");
      if (label === "Líquidos de Arrefecimento") navigate("/subcategories/lubrificantes/liquidos-arrefecimento");
    }
    if (category === "acessorios" && !subcategory) {
      if (label === "Multimédia & Eletrónica") navigate("/subcategories/acessorios/multimedia-eletronica");
    }
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

  const isThirdLevel = !!subcategory;
  const isPecasSecondLevel = category === "pecas" && !subcategory;
  const isLubrificantesSecondLevel = category === "lubrificantes" && !subcategory;
  const isAcessoriosSecondLevel = category === "acessorios" && !subcategory;
  const hasClickableItems = isPecasSecondLevel || isLubrificantesSecondLevel || isAcessoriosSecondLevel;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={data.name} />

      <main className="container px-4 py-6 space-y-6">
        {/* Back button */}
        <button
          onClick={() => {
            if (isThirdLevel && 'parent' in data) {
              navigate(`/subcategories/${data.parent}`);
            } else {
              navigate("/");
            }
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isThirdLevel ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </>
          ) : (
            <>
              <Home className="w-4 h-4" />
              <span>Voltar às categorias</span>
            </>
          )}
        </button>

        {/* Sub-categories grid */}
        <div className="grid grid-cols-3 gap-4">
          {data.items.map((item, i) => (
            <div
              key={item.id}
              onClick={() => handleSubCategoryClick(item.label)}
              className={`flex flex-col items-center gap-2 animate-fade-in ${hasClickableItems ? 'cursor-pointer' : ''}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-2xl transition-colors ${hasClickableItems ? 'hover:border-primary/50' : ''}`}>
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
