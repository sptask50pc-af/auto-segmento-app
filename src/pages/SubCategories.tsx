import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
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
  multimediaEletronicaSubSubCategories,
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

// Map of category slugs to their display names for product matching
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  // Lubrificantes (slugs generated from lubrificantesSubCategories labels)
  "oleos-de-motor": "Óleos de Motor",
  "oleos-de-transmissao-diferencial": "Óleos de Transmissão & Diferencial",
  "oleos-hidraulicos-direcao-assistida": "Óleos Hidráulicos & Direção Assistida",
  "liquidos-de-travoes": "Líquidos de Travões",
  "liquidos-de-arrefecimento": "Líquidos de Arrefecimento",
  "aditivos-de-combustivel": "Aditivos de Combustível",
  "aditivos-de-oleo": "Aditivos de Óleo",
  "sprays-manutencao": "Sprays & Manutenção",
  "oleos-especiais": "Óleos Especiais",
  
  // Desempenho e Upgrade
  "filtros-ar-desportivos": "Filtros de Ar Desportivos",
  "escapes-silenciosos": "Escapes & Silenciosos",
  "suspensoes-molas": "Suspensões & Molas",
  "travagem-performance": "Travagem Performance",
  "jantes-acessorios": "Jantes & Acessórios",
  "iluminacao-upgrade": "Iluminação Upgrade",
  "eletronica-chip-tuning": "Eletrónica & Chip Tuning",
  "acessorios-desportivos": "Acessórios Desportivos",
  
  // Universal
  "ferramentas": "Ferramentas",
  "fixacoes": "Fixações",
  "adesivos": "Adesivos",
  "diversos": "Diversos",
  
  // Sinalética e Segurança
  "sinaletica-interior-exterior": "Sinalética Interior & Exterior",
  "kits-emergencia": "Kits de Emergência",
  "coletes-refletores": "Coletes Refletores",
  "triangulos": "Triângulos",
  "extintores": "Extintores",
  
  // Acessórios (leaf categories)
  "interior": "Interior",
  "exterior-acessorios": "Exterior",
  "conforto-utilitarios": "Conforto & Utilitários",
  
  // Elétrica (leaf categories)
  "interruptores": "Interruptores",
  "fusiveis-reles": "Fusíveis & Relés",
  "cablagens-conectores": "Cablagens & Conectores",
  
  // Carroçaria sub-subcategories
  "revestimentos-interiores": "Revestimentos Interiores",
  "farois-farolins": "Faróis & Farolins",
  "retrovisores": "Retrovisores",
  "fechos-dobradicas": "Fechos & Dobradiças",
  "para-choques": "Para-choques",
  "grelhas": "Grelhas",
  "guarda-lamas-extensoes": "Guarda-lamas & Extensões",
  "capos-tampas": "Capôs & Tampas",
  "portas-paineis-laterais": "Portas & Painéis Laterais",
  "frisos-molduras": "Frisos & Molduras",
  "suportes-estruturas": "Suportes & Estruturas",
  
  // Travagem sub-subcategories
  "discos": "Discos",
  "pastilhas-travao": "Pastilhas de Travão",
  "maxilas-calcos-tambor": "Maxilas / Calços de Tambor",
  "tambores-travao": "Tambores de Travão",
  "pincas-travao-reparacoes": "Pinças de Travão & Reparações",
  "bombas-travao": "Bombas de Travão",
  "servofreio": "Servofreio (Hidrovácuo)",
  "bombitos-cilindros-roda": "Bombitos / Cilindros de Roda",
  "sensores-abs-velocidade": "Sensores ABS / Velocidade",
  "tubos-mangueiras-travao": "Tubos & Mangueiras de Travão",
  "oleo-liquido-travoes": "Óleo / Líquido de Travões",
  "chapas-protecao-deflectores": "Chapas de Proteção / Deflectores",
  "parafusos-acessorios": "Parafusos & Acessórios",
  "kits-travagem": "Kits de Travagem",
  
  // Filtros sub-subcategories
  "filtros-oleo": "Filtros de Óleo",
  "filtros-ar": "Filtros de Ar",
  "filtros-habitaculo": "Filtros de Habitáculo (Pólen)",
  "filtros-combustivel": "Filtros de Combustível",
  "filtros-caixa-velocidades": "Filtros de Caixa de Velocidades",
  "filtros-hidraulicos": "Filtros Hidráulicos",
  "filtros-particulas": "Filtros de Partículas (DPF/FAP)",
  "filtros-transmissao-diferencial": "Filtros de Transmissão / Diferencial",
  
  // Suspensão e Direção sub-subcategories
  "amortecedores": "Amortecedores",
  "molas-suspensao": "Molas de Suspensão",
  "topos-amortecedor-rolamentos": "Topos de Amortecedor & Rolamentos",
  "bracos-suspensao": "Braços de Suspensão",
  "rotulas-suspensao": "Rótulas de Suspensão",
  "barras-estabilizadoras-tirantes": "Barras Estabilizadoras & Tirantes",
  "casquilhos-suspensao": "Casquilhos de Suspensão",
  "colunas-direcao": "Colunas de Direção",
  "caixas-direcao": "Caixas de Direção",
  "bombas-direcao-assistida": "Bombas de Direção Assistida",
  "rotulas-direcao-terminais": "Rótulas de Direção / Terminais",
  "volantes-direcao": "Volantes de Direção",
  "servodirecao-eletrica-motores-eps": "Servodireção Elétrica / Motores EPS",
  "kits-suspensao-direcao": "Kits de Suspensão & Direção",
  
  // Motor sub-subcategories
  "correias": "Correias",
  "tensores-rolamentos": "Tensores & Rolamentos",
  "bombas-agua": "Bombas de Água",
  "termostatos": "Termóstatos",
  "juntas-vedantes": "Juntas & Vedantes",
  "valvulas": "Válvulas",
  "pistoes-segmentos": "Pistões & Segmentos",
  "arvore-cames": "Árvore de Cames",
  
  // Sistema de Escape sub-subcategories
  "flexivel-escape": "Flexível de Escape",
  "unioes-escape": "Uniões de Escape",
  "bracadeiras-escape": "Braçadeiras de Escape",
  
  // Shampoos & Limpeza sub-subcategories
  "shampoo-concentrado": "Shampoo Concentrado",
  "shampoo-com-cera": "Shampoo com Cera",
  "desengorduante": "Desengorduante",
  "limpa-jantes": "Limpa Jantes",
  
  // Ceras & Selantes sub-subcategories
  "cera-liquida": "Cera Líquida",
  "cera-pasta": "Cera em Pasta",
  "selante-sintetico": "Selante Sintético",
  "coating-ceramico": "Coating Cerâmico",
  
  // Polimento & Correção sub-subcategories
  "polimento-fino": "Polimento Fino",
  "composto-corte": "Composto de Corte",
  "removedor-riscos": "Removedor Riscos",
  "boinas-discos": "Boinas & Discos",
  
  // Exterior sub-subcategories (Cuidado e Detalhe)
  "limpa-pneus": "Limpa Pneus",
  "restaurador-plasticos": "Restaurador Plásticos",
  "limpa-motor": "Limpa Motor",
  "removedor-insetos": "Removedor Insetos",
  
  // Interiores sub-subcategories
  "limpa-estofos": "Limpa Estofos",
  "limpa-pele": "Limpa Pele",
  "limpa-tablier": "Limpa Tablier",
  "limpa-tapetes": "Limpa Tapetes",
  
  // Vidros & Espelhos sub-subcategories
  "limpa-vidros": "Limpa Vidros",
  "anti-embaciante": "Anti-Embaciante",
  "repelente-agua": "Repelente Água",
  "removedor-pelicula": "Removedor Película",
  
  // Panos & Acessórios sub-subcategories
  "panos-microfibra": "Panos Microfibra",
  "esponjas": "Esponjas",
  "luvas-lavagem": "Luvas de Lavagem",
  "aplicadores": "Aplicadores",
  
  // Odorizantes sub-subcategories
  "ambientadores": "Ambientadores",
  "eliminador-odores": "Eliminador Odores",
  "fragrancias-auto": "Fragrâncias Auto",
  
  // Multimédia & Eletrónica sub-subcategories
  "pilhas": "Pilhas",
  "carregadores": "Carregadores",
  "suportes-telemovel": "Suportes Telemóvel",
  "camaras": "Câmaras",
  
  // Baterias sub-subcategories
  "baterias-auto": "Baterias Auto",
  "baterias-moto": "Baterias Moto",
  "baterias-agm": "Baterias AGM",
  "carregadores-baterias": "Carregadores",
  
  // Iluminação & Lâmpadas sub-subcategories
  "lampadas-h7": "Lâmpadas H7",
  "lampadas-h4": "Lâmpadas H4",
  "led": "LED",
  "xenon": "Xenon",
  "lanternas": "Lanternas",
};

// Categories that have nested sub-subcategories
const CATEGORIES_WITH_SUBSUB: Record<string, string[]> = {
  "pecas": ["carrocaria", "travagem", "filtros", "suspensao-direcao", "motor", "sistema-escape"],
  "cuidado-detalhe": ["shampoos-limpeza", "ceras-selantes", "polimento-correcao", "exterior", "interiores", "vidros-espelhos", "panos-acessorios", "odorizantes"],
  "eletrica": ["baterias", "iluminacao-lampadas"],
  "acessorios": ["multimedia-eletronica"],
};

// Subcategories that have their own sub-subcategories (and thus shouldn't show products directly)
const hasSubSubCategories = (category: string, subcategory: string): boolean => {
  return CATEGORIES_WITH_SUBSUB[category]?.includes(subcategory) || false;
};

const SubCategories = () => {
  const { category, subcategory, subsubcategory } = useParams<{ 
    category: string; 
    subcategory?: string;
    subsubcategory?: string;
  }>();
  const navigate = useNavigate();
  const { getProductsByCategory } = useProducts();

  // Determine if we should show products
  const shouldShowProducts = (): boolean => {
    if (!category) return false;
    
    // If we have a sub-subcategory, always show products
    if (subsubcategory) return true;
    
    // If we have a subcategory but it doesn't have sub-subcategories, show products
    if (subcategory && !hasSubSubCategories(category, subcategory)) return true;
    
    return false;
  };

  const getDisplayName = (slug: string): string => {
    return CATEGORY_DISPLAY_NAMES[slug] || slug;
  };

  const getSubCategories = () => {
    // Handle sub-subcategories (third level)
    if (subcategory && hasSubSubCategories(category!, subcategory)) {
      // Peças sub-subcategories
      if (subcategory === "carrocaria") return { name: "Carroçaria", items: carrocariaSubSubCategories, parent: category };
      if (subcategory === "travagem") return { name: "Travagem", items: travagemSubSubCategories, parent: category };
      if (subcategory === "filtros") return { name: "Filtros", items: filtrosSubSubCategories, parent: category };
      if (subcategory === "suspensao-direcao") return { name: "Suspensão e Direção", items: suspensaoDirecaoSubSubCategories, parent: category };
      if (subcategory === "motor") return { name: "Motor", items: motorSubSubCategories, parent: category };
      if (subcategory === "sistema-escape") return { name: "Sistema de Escape", items: sistemaEscapeSubSubCategories, parent: category };
      
      // Cuidado e Detalhe sub-subcategories
      if (subcategory === "shampoos-limpeza") return { name: "Shampoos & Limpeza", items: shampoosLimpezaSubSubCategories, parent: category };
      if (subcategory === "ceras-selantes") return { name: "Ceras & Selantes", items: cerasSelantesSubSubCategories, parent: category };
      if (subcategory === "polimento-correcao") return { name: "Polimento & Correção", items: polimentoCorrecaoSubSubCategories, parent: category };
      if (subcategory === "exterior") return { name: "Exterior", items: exteriorSubSubCategories, parent: category };
      if (subcategory === "interiores") return { name: "Interiores", items: interioresSubSubCategories, parent: category };
      if (subcategory === "vidros-espelhos") return { name: "Vidros & Espelhos", items: vidrosEspelhosSubSubCategories, parent: category };
      if (subcategory === "panos-acessorios") return { name: "Panos & Acessórios", items: panosAcessoriosSubSubCategories, parent: category };
      if (subcategory === "odorizantes") return { name: "Odorizantes", items: odorizantesSubSubCategories, parent: category };
      
      // Elétrica sub-subcategories
      if (subcategory === "baterias") return { name: "Baterias", items: bateriasSubSubCategories, parent: category };
      if (subcategory === "iluminacao-lampadas") return { name: "Iluminação & Lâmpadas", items: iluminacaoLampadasSubSubCategories, parent: category };
      
      // Acessórios sub-subcategories
      if (subcategory === "multimedia-eletronica") return { name: "Multimédia & Eletrónica", items: multimediaEletronicaSubSubCategories, parent: category };
      
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

  const labelToSlug = (label: string): string => {
    return label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, "")
      .replace(/\//g, "-")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .replace(/[()]/g, "")
      .trim();
  };

  const handleItemClick = (label: string) => {
    const slug = labelToSlug(label);
    
    if (subcategory) {
      // We're viewing sub-subcategories, navigate to product page
      navigate(`/subcategories/${category}/${subcategory}/${slug}`);
    } else {
      // We're viewing subcategories
      navigate(`/subcategories/${category}/${slug}`);
    }
  };

  // If showing products for this category
  if (shouldShowProducts()) {
    const productSlug = subsubcategory || subcategory;
    const categoryName = getDisplayName(productSlug!);
    const categoryProducts = getProductsByCategory(categoryName);

    const getBackPath = () => {
      if (subsubcategory) {
        return `/subcategories/${category}/${subcategory}`;
      }
      return `/subcategories/${category}`;
    };

    return (
      <div className="min-h-screen bg-background pb-20">
        <Header title={categoryName} />

        <main className="container px-4 py-6 space-y-6">
          {/* Back button */}
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          {/* Products grid */}
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {categoryProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  delay={i * 50}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
              <p className="text-sm text-muted-foreground mt-2">Use o botão "Update" na página Admin para importar produtos.</p>
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    );
  }

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
              onClick={() => handleItemClick(item.label)}
              className="flex flex-col items-center gap-2 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-20 h-20 rounded-lg bg-card border border-border flex items-center justify-center text-3xl transition-colors hover:border-primary/50">
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