import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductListView } from "@/components/ProductListView";
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
import { CategoryIcon } from "@/components/CategoryIcon";

// Subcategory images - Peças
import carrocariaImg from "@/assets/subcategories/carrocaria.png";
import travagemImg from "@/assets/subcategories/travagem.png";
import filtrosImg from "@/assets/subcategories/filtros.png";
import suspensaoDirecaoImg from "@/assets/subcategories/suspensao-direcao.png";
import motorImg from "@/assets/subcategories/motor.png";
import sistemaEscapeImg from "@/assets/subcategories/sistema-escape.png";
import revestimentosInterioresImg from "@/assets/subcategories/revestimentos-interiores.png";
import faroisFarolinsImg from "@/assets/subcategories/farois-farolins.png";
import retrovisoresImg from "@/assets/subcategories/retrovisores.png";
import fechosDobradicasImg from "@/assets/subcategories/fechos-dobradicas.png";
import paraChoquesImg from "@/assets/subcategories/para-choques.png";
import grelhasImg from "@/assets/subcategories/grelhas.png";
import guardaLamasImg from "@/assets/subcategories/guarda-lamas.png";
import caposTampasImg from "@/assets/subcategories/capos-tampas.png";
import portasPaineisImg from "@/assets/subcategories/portas-paineis.png";
import frisosMoldurasImg from "@/assets/subcategories/frisos-molduras.png";
import suportesEstruturasImg from "@/assets/subcategories/suportes-estruturas.png";
import oleosMotorImg from "@/assets/subcategories/oleos-motor.png";
import oleosTransmissaoImg from "@/assets/subcategories/oleos-transmissao.png";
import liquidosTravoesImg from "@/assets/subcategories/liquidos-travoes.png";
import liquidosArrefecimentoImg from "@/assets/subcategories/liquidos-arrefecimento.png";
import aditivosCombustivelImg from "@/assets/subcategories/aditivos-combustivel.png";
import spraysManutencaoImg from "@/assets/subcategories/sprays-manutencao.png";
import shampoosLimpezaImg from "@/assets/subcategories/shampoos-limpeza.png";
import cerasSelantesImg from "@/assets/subcategories/ceras-selantes.png";
import polimentoCorrecaoImg from "@/assets/subcategories/polimento-correcao.png";
import interioresImg from "@/assets/subcategories/interiores.png";
import vidrosEspelhosImg from "@/assets/subcategories/vidros-espelhos.png";
import odorizantesImg from "@/assets/subcategories/odorizantes.png";
import panosAcessoriosImg from "@/assets/subcategories/panos-acessorios.png";
import exteriorImg from "@/assets/subcategories/exterior.png";
import filtrosArDesportivosImg from "@/assets/subcategories/filtros-ar-desportivos.png";
import escapesSilenciososImg from "@/assets/subcategories/escapes-silenciosos.png";
import suspensoesMolasImg from "@/assets/subcategories/suspensoes-molas.png";
import travagemPerformanceImg from "@/assets/subcategories/travagem-performance.png";
import jantesAcessoriosImg from "@/assets/subcategories/jantes-acessorios.png";
import iluminacaoUpgradeImg from "@/assets/subcategories/iluminacao-upgrade.png";
import eletronicaChipTuningImg from "@/assets/subcategories/eletronica-chip-tuning.png";
import acessoriosDesportivosImg from "@/assets/subcategories/acessorios-desportivos.png";
import bateriasImg from "@/assets/subcategories/baterias.png";
import iluminacaoLampadasImg from "@/assets/subcategories/iluminacao-lampadas.png";
import interruptoresImg from "@/assets/subcategories/interruptores.png";
import fusiveisRelesImg from "@/assets/subcategories/fusiveis-reles.png";
import cablagensConectoresImg from "@/assets/subcategories/cablagens-conectores.png";
import ferramentasImg from "@/assets/subcategories/ferramentas.png";
import fixacoesImg from "@/assets/subcategories/fixacoes.png";
import adesivosImg from "@/assets/subcategories/adesivos.png";
import diversosImg from "@/assets/subcategories/diversos.png";
import sinaleticaImg from "@/assets/subcategories/sinaletica.png";
import kitsEmergenciaImg from "@/assets/subcategories/kits-emergencia.png";
import coletesRefletoresImg from "@/assets/subcategories/coletes-refletores.png";
import triangulosImg from "@/assets/subcategories/triangulos.png";
import extintoresImg from "@/assets/subcategories/extintores.png";
import interiorImg from "@/assets/subcategories/interior.png";
import multimediaEletronicaImg from "@/assets/subcategories/multimedia-eletronica.png";
import confortoUtilitariosImg from "@/assets/subcategories/conforto-utilitarios.png";

const subcategoryImages: Record<string, string> = {
  "Carroçaria": carrocariaImg, "Travagem": travagemImg, "Filtros": filtrosImg,
  "Suspensão e Direção": suspensaoDirecaoImg, "Motor": motorImg, "Sistema de Escape": sistemaEscapeImg,
  "Revestimentos Interiores": revestimentosInterioresImg, "Faróis & Farolins": faroisFarolinsImg,
  "Retrovisores": retrovisoresImg, "Fechos & Dobradiças": fechosDobradicasImg,
  "Para-choques": paraChoquesImg, "Grelhas": grelhasImg, "Guarda-lamas & Extensões": guardaLamasImg,
  "Capôs & Tampas": caposTampasImg, "Portas & Painéis Laterais": portasPaineisImg,
  "Frisos & Molduras": frisosMoldurasImg, "Suportes & Estruturas": suportesEstruturasImg,
  "Óleos de Motor": oleosMotorImg, "Óleos de Transmissão & Diferencial": oleosTransmissaoImg,
  "Óleos Hidráulicos & Direção Assistida": oleosTransmissaoImg, "Líquidos de Travões": liquidosTravoesImg,
  "Líquidos de Arrefecimento": liquidosArrefecimentoImg, "Aditivos de Combustível": aditivosCombustivelImg,
  "Aditivos de Óleo": aditivosCombustivelImg, "Sprays & Manutenção": spraysManutencaoImg, "Óleos Especiais": oleosMotorImg,
  "Shampoos & Limpeza": shampoosLimpezaImg, "Ceras & Selantes": cerasSelantesImg, "Polimento & Correção": polimentoCorrecaoImg,
  "Exterior": exteriorImg, "Interiores": interioresImg, "Vidros & Espelhos": vidrosEspelhosImg,
  "Panos & Acessórios": panosAcessoriosImg, "Odorizantes": odorizantesImg,
  "Filtros de Ar Desportivos": filtrosArDesportivosImg, "Escapes & Silenciosos": escapesSilenciososImg,
  "Suspensões & Molas": suspensoesMolasImg, "Travagem Performance": travagemPerformanceImg,
  "Jantes & Acessórios": jantesAcessoriosImg, "Iluminação Upgrade": iluminacaoUpgradeImg,
  "Eletrónica & Chip Tuning": eletronicaChipTuningImg, "Acessórios Desportivos": acessoriosDesportivosImg,
  "Baterias": bateriasImg, "Iluminação & Lâmpadas": iluminacaoLampadasImg, "Interruptores": interruptoresImg,
  "Fusíveis & Relés": fusiveisRelesImg, "Cablagens & Conectores": cablagensConectoresImg,
  "Ferramentas": ferramentasImg, "Fixações": fixacoesImg, "Adesivos": adesivosImg, "Diversos": diversosImg,
  "Sinalética Interior & Exterior": sinaleticaImg, "Kits de Emergência": kitsEmergenciaImg,
  "Coletes Refletores": coletesRefletoresImg, "Triângulos": triangulosImg, "Extintores": extintoresImg,
  "Interior": interiorImg, "Multimédia & Eletrónica": multimediaEletronicaImg, "Conforto & Utilitários": confortoUtilitariosImg,
};

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
      <ProductListView 
        categoryName={categoryName}
        products={categoryProducts}
        backPath={getBackPath()}
      />
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
  const isPecasCategory = category === "pecas";

  return (
    <div className={`min-h-screen pb-20 relative ${isPecasCategory ? 'dark:bg-black bg-background' : 'bg-background'}`}>
      {/* Background Logo Watermark */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img 
          src="/icon.png" 
          alt="" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-w-[400px] opacity-[0.03]"
        />
      </div>
      <Header title={data.name} />

      <main className="container px-4 py-6 space-y-6">
        {/* Hero Section with Logo */}
        <section className="relative h-[100px] overflow-hidden rounded-2xl animate-fade-in">
          <div className={`h-full relative overflow-hidden rounded-2xl p-4 border ${isPecasCategory ? 'dark:bg-gradient-to-br dark:from-zinc-900 dark:via-black dark:to-zinc-900 dark:border-transparent bg-gradient-to-br from-primary/10 via-card to-card border-primary/20' : 'bg-gradient-to-br from-primary/20 via-card to-card border-primary/20'}`}>
            <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl ${isPecasCategory ? 'dark:bg-zinc-700/30 bg-primary/15' : 'bg-primary/20'}`} />
            <div className={`absolute -bottom-4 -left-4 h-20 w-20 rounded-full blur-2xl ${isPecasCategory ? 'dark:bg-zinc-700/20 bg-primary/10' : 'bg-primary/10'}`} />
            <div className="relative flex items-center justify-between h-full">
              <div>
                <h1 className={`text-xl font-bold mb-1 ${isPecasCategory ? 'dark:text-white text-foreground' : 'text-foreground'}`}>{data.name}</h1>
                <p className={`text-xs ${isPecasCategory ? 'dark:text-zinc-400 text-muted-foreground' : 'text-muted-foreground'}`}>
                  Selecione uma subcategoria
                </p>
              </div>
              <img 
                src="/icon.png" 
                alt="Segmento Positivo" 
                className="w-14 h-14 rounded-xl shadow-lg shadow-primary/20"
              />
            </div>
          </div>
        </section>

        {/* Back button */}
        <button
          onClick={() => {
            if (isThirdLevel && 'parent' in data) {
              navigate(`/subcategories/${data.parent}`);
            } else {
              navigate("/");
            }
          }}
          className={`flex items-center gap-3 text-sm px-5 py-3.5 rounded-xl backdrop-blur border shadow-lg transition-all duration-300 min-h-[52px] active:scale-95 ${
            isPecasCategory 
              ? 'dark:bg-zinc-900/80 dark:border-transparent dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 dark:shadow-black/20 bg-muted/50 border-border hover:border-primary/40 text-muted-foreground hover:text-foreground shadow-muted/10 hover:shadow-primary/10' 
              : 'bg-muted/50 border-border hover:border-primary/40 text-muted-foreground hover:text-foreground shadow-muted/10 hover:shadow-primary/10'
          }`}
        >
          {isThirdLevel ? (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </>
          ) : (
            <>
              <Home className="w-5 h-5" />
              <span className="font-medium">Voltar às categorias</span>
            </>
          )}
        </button>

        {/* Sub-categories grid */}
        <div className="grid grid-cols-3 gap-4">
          {data.items.map((item, i) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.label)}
              className="group flex flex-col items-center gap-2 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`relative w-20 h-20 rounded-2xl backdrop-blur border-2 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-active:scale-95 overflow-hidden p-2 ${
                isPecasCategory 
                  ? 'dark:bg-zinc-800 dark:border-zinc-700/50 dark:shadow-black/30 dark:group-hover:border-primary dark:group-hover:shadow-xl dark:group-hover:shadow-primary/40 bg-muted border-border/60 shadow-background/50 group-hover:border-primary/60 group-hover:shadow-xl group-hover:shadow-primary/25' 
                  : 'bg-muted border-border/60 shadow-background/50 group-hover:border-primary/60 group-hover:shadow-xl group-hover:shadow-primary/25'
              }`}>
                {subcategoryImages[item.label] ? (
                  <img 
                    src={subcategoryImages[item.label]} 
                    alt={item.label} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className={isPecasCategory ? 'dark:text-white text-primary' : 'text-primary'}>
                    <CategoryIcon icon={item.icon} />
                  </div>
                )}
              </div>
              <span className={`text-xs text-center leading-tight font-bold transition-colors ${
                isPecasCategory 
                  ? 'dark:text-zinc-300 dark:group-hover:text-white text-foreground group-hover:text-primary' 
                  : 'text-foreground group-hover:text-primary'
              }`}>{item.label}</span>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SubCategories;