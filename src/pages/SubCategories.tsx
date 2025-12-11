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
  liquidosArrefecimentoSubSubCategories,
  oleosMotorSubSubCategories,
  oleosTransmissaoSubSubCategories,
  aditivosCombustivelSubSubCategories,
  aditivosOleoSubSubCategories,
  liquidosTravaoSubSubCategories,
  oleosHidraulicosSubSubCategories,
  oleosEspeciaisSubSubCategories,
  shampoosLimpezaSubSubCategories,
  cerasSelantesSubSubCategories,
  polimentoCorrecaoSubSubCategories,
  exteriorSubSubCategories,
  interioresSubSubCategories,
  vidrosEspelhosSubSubCategories,
  panosAcessoriosSubSubCategories,
  odorizantesSubSubCategories,
  bateriasSubSubCategories,
  iluminacaoLampadasSubSubCategories,
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
      if (subcategory === "oleos-motor") return { name: "Óleos de Motor", items: oleosMotorSubSubCategories, parent: "lubrificantes" };
      if (subcategory === "oleos-transmissao") return { name: "Óleos de Transmissão & Diferencial", items: oleosTransmissaoSubSubCategories, parent: "lubrificantes" };
      if (subcategory === "oleos-hidraulicos") return { name: "Óleos Hidráulicos & Direção Assistida", items: oleosHidraulicosSubSubCategories, parent: "lubrificantes" };
      if (subcategory === "liquidos-travao") return { name: "Líquidos de Travões", items: liquidosTravaoSubSubCategories, parent: "lubrificantes" };
      if (subcategory === "liquidos-arrefecimento") return { name: "Líquidos de Arrefecimento", items: liquidosArrefecimentoSubSubCategories, parent: "lubrificantes" };
      if (subcategory === "aditivos-combustivel") return { name: "Aditivos de Combustível", items: aditivosCombustivelSubSubCategories, parent: "lubrificantes" };
      if (subcategory === "aditivos-oleo") return { name: "Aditivos de Óleo", items: aditivosOleoSubSubCategories, parent: "lubrificantes" };
      if (subcategory === "sprays-manutencao") return { name: "Sprays & Manutenção", items: spraysManutencaoSubSubCategories, parent: "lubrificantes" };
      if (subcategory === "oleos-especiais") return { name: "Óleos Especiais", items: oleosEspeciaisSubSubCategories, parent: "lubrificantes" };
      
      // Cuidado e Detalhe sub-subcategories
      if (subcategory === "shampoos-limpeza") return { name: "Shampoos & Limpeza", items: shampoosLimpezaSubSubCategories, parent: "cuidado-detalhe" };
      if (subcategory === "ceras-selantes") return { name: "Ceras & Selantes", items: cerasSelantesSubSubCategories, parent: "cuidado-detalhe" };
      if (subcategory === "polimento-correcao") return { name: "Polimento & Correção", items: polimentoCorrecaoSubSubCategories, parent: "cuidado-detalhe" };
      if (subcategory === "exterior") return { name: "Exterior", items: exteriorSubSubCategories, parent: "cuidado-detalhe" };
      if (subcategory === "interiores") return { name: "Interiores", items: interioresSubSubCategories, parent: "cuidado-detalhe" };
      if (subcategory === "vidros-espelhos") return { name: "Vidros & Espelhos", items: vidrosEspelhosSubSubCategories, parent: "cuidado-detalhe" };
      if (subcategory === "panos-acessorios") return { name: "Panos & Acessórios", items: panosAcessoriosSubSubCategories, parent: "cuidado-detalhe" };
      if (subcategory === "odorizantes") return { name: "Odorizantes", items: odorizantesSubSubCategories, parent: "cuidado-detalhe" };
      
      // Elétrica sub-subcategories
      if (subcategory === "baterias") return { name: "Baterias", items: bateriasSubSubCategories, parent: "eletrica" };
      if (subcategory === "iluminacao-lampadas") return { name: "Iluminação & Lâmpadas", items: iluminacaoLampadasSubSubCategories, parent: "eletrica" };
      
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
    // Peças subcategories
    if (category === "pecas" && !subcategory) {
      if (label === "Carroçaria") navigate("/subcategories/pecas/carrocaria");
      else if (label === "Travagem") navigate("/subcategories/pecas/travagem");
      else if (label === "Filtros") navigate("/subcategories/pecas/filtros");
      else if (label === "Suspensão e Direção") navigate("/subcategories/pecas/suspensao-direcao");
      else if (label === "Motor") navigate("/subcategories/pecas/motor");
      else if (label === "Sistema de Escape") navigate("/subcategories/pecas/sistema-escape");
    }
    
    // Lubrificantes subcategories
    if (category === "lubrificantes" && !subcategory) {
      if (label === "Óleos de Motor") navigate("/subcategories/lubrificantes/oleos-motor");
      else if (label === "Óleos de Transmissão & Diferencial") navigate("/subcategories/lubrificantes/oleos-transmissao");
      else if (label === "Óleos Hidráulicos & Direção Assistida") navigate("/subcategories/lubrificantes/oleos-hidraulicos");
      else if (label === "Líquidos de Travões") navigate("/subcategories/lubrificantes/liquidos-travao");
      else if (label === "Líquidos de Arrefecimento") navigate("/subcategories/lubrificantes/liquidos-arrefecimento");
      else if (label === "Aditivos de Combustível") navigate("/subcategories/lubrificantes/aditivos-combustivel");
      else if (label === "Aditivos de Óleo") navigate("/subcategories/lubrificantes/aditivos-oleo");
      else if (label === "Sprays & Manutenção") navigate("/subcategories/lubrificantes/sprays-manutencao");
      else if (label === "Óleos Especiais") navigate("/subcategories/lubrificantes/oleos-especiais");
    }
    
    // Cuidado e Detalhe subcategories
    if (category === "cuidado-detalhe" && !subcategory) {
      if (label === "Shampoos & Limpeza") navigate("/subcategories/cuidado-detalhe/shampoos-limpeza");
      else if (label === "Ceras & Selantes") navigate("/subcategories/cuidado-detalhe/ceras-selantes");
      else if (label === "Polimento & Correção") navigate("/subcategories/cuidado-detalhe/polimento-correcao");
      else if (label === "Exterior") navigate("/subcategories/cuidado-detalhe/exterior");
      else if (label === "Interiores") navigate("/subcategories/cuidado-detalhe/interiores");
      else if (label === "Vidros & Espelhos") navigate("/subcategories/cuidado-detalhe/vidros-espelhos");
      else if (label === "Panos & Acessórios") navigate("/subcategories/cuidado-detalhe/panos-acessorios");
      else if (label === "Odorizantes") navigate("/subcategories/cuidado-detalhe/odorizantes");
    }
    
    // Elétrica subcategories
    if (category === "eletrica" && !subcategory) {
      if (label === "Baterias") navigate("/subcategories/eletrica/baterias");
      else if (label === "Iluminação & Lâmpadas") navigate("/subcategories/eletrica/iluminacao-lampadas");
    }
    
    // Acessórios subcategories
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
  
  // Check which categories have clickable items
  const hasClickableItems = !subcategory && (
    category === "pecas" ||
    category === "lubrificantes" ||
    category === "cuidado-detalhe" ||
    category === "eletrica" ||
    category === "acessorios"
  );

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