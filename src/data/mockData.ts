import { Product, Brand, Category } from "@/types/product";

export const carBrands: Brand[] = [
  { id: "1", name: "Audi", logo: "🚗" },
  { id: "2", name: "BMW", logo: "🏎️" },
  { id: "3", name: "Mercedes", logo: "⭐" },
  { id: "4", name: "Volkswagen", logo: "🔵" },
  { id: "5", name: "Porsche", logo: "🏁" },
  { id: "6", name: "Toyota", logo: "🔴" },
  { id: "7", name: "Honda", logo: "🔷" },
  { id: "8", name: "Ford", logo: "🔶" },
];

export const partBrands: Brand[] = [
  { id: "1", name: "FAST", logo: "⚡" },
  { id: "2", name: "Febi", logo: "🔧" },
  { id: "3", name: "UFI", logo: "🛠️" },
  { id: "4", name: "Valvoline", logo: "🛢️" },
];

export const categories: Category[] = [
  { id: "1", label: "Peças mais vendidas", icon: "🔧" },
  { id: "2", label: "Óleos e filtros", icon: "🛢️" },
  { id: "3", label: "Limpeza & Detalhe", icon: "✨" },
  { id: "4", label: "Segurança & Sinalização", icon: "⚠️" },
];

export const mainCategories: Category[] = [
  { id: "1", label: "Peças", icon: "wrench" },
  { id: "2", label: "Lubrificantes", icon: "droplets" },
  { id: "3", label: "Acessórios", icon: "car" },
  { id: "4", label: "Cuidado e Detalhe", icon: "sparkles" },
  { id: "5", label: "Desempenho e Upgrade", icon: "gauge" },
  { id: "6", label: "Elétrica", icon: "zap" },
  { id: "7", label: "Universal", icon: "settings" },
  { id: "8", label: "Sinalética e Segurança", icon: "shield-alert" },
];

export const pecasSubCategories: Category[] = [
  { id: "p1", label: "Carroçaria", icon: "car" },
  { id: "p2", label: "Travagem", icon: "circle-dot" },
  { id: "p3", label: "Filtros", icon: "filter" },
  { id: "p4", label: "Suspensão e Direção", icon: "cog" },
  { id: "p5", label: "Motor", icon: "settings" },
  { id: "p6", label: "Sistema de Escape", icon: "wind" },
];

export const carrocariaSubSubCategories: Category[] = [
  { id: "car1", label: "Revestimentos Interiores", icon: "armchair" },
  { id: "car2", label: "Faróis & Farolins", icon: "lightbulb" },
  { id: "car3", label: "Retrovisores", icon: "panel-top" },
  { id: "car4", label: "Fechos & Dobradiças", icon: "lock" },
  { id: "car5", label: "Para-choques", icon: "shield" },
  { id: "car6", label: "Grelhas", icon: "grid-3x3" },
  { id: "car7", label: "Guarda-lamas & Extensões", icon: "car" },
  { id: "car8", label: "Capôs & Tampas", icon: "package" },
  { id: "car9", label: "Portas & Painéis Laterais", icon: "door-open" },
  { id: "car10", label: "Frisos & Molduras", icon: "minus" },
  { id: "car11", label: "Suportes & Estruturas", icon: "nut" },
];

export const travagemSubSubCategories: Category[] = [
  { id: "trav1", label: "Discos", icon: "disc" },
  { id: "trav2", label: "Pastilhas de Travão", icon: "square" },
  { id: "trav3", label: "Maxilas / Calços de Tambor", icon: "wrench" },
  { id: "trav4", label: "Tambores de Travão", icon: "drum" },
  { id: "trav5", label: "Pinças de Travão & Reparações", icon: "settings" },
  { id: "trav6", label: "Bombas de Travão", icon: "droplet" },
  { id: "trav7", label: "Servofreio (Hidrovácuo)", icon: "cog" },
  { id: "trav8", label: "Bombitos / Cilindros de Roda", icon: "circle-dot" },
  { id: "trav9", label: "Sensores ABS / Velocidade", icon: "radio" },
  { id: "trav10", label: "Tubos & Mangueiras de Travão", icon: "plug" },
  { id: "trav11", label: "Óleo / Líquido de Travões", icon: "droplets" },
  { id: "trav12", label: "Chapas de Proteção / Deflectores", icon: "shield-check" },
  { id: "trav13", label: "Parafusos & Acessórios", icon: "nut" },
  { id: "trav14", label: "Kits de Travagem", icon: "package" },
];

export const filtrosSubSubCategories: Category[] = [
  { id: "filt1", label: "Filtros de Óleo", icon: "droplets" },
  { id: "filt2", label: "Filtros de Ar", icon: "wind" },
  { id: "filt3", label: "Filtros de Habitáculo (Pólen)", icon: "flower-2" },
  { id: "filt4", label: "Filtros de Combustível", icon: "fuel" },
  { id: "filt5", label: "Filtros de Caixa de Velocidades", icon: "cog" },
  { id: "filt6", label: "Filtros Hidráulicos", icon: "droplet" },
  { id: "filt7", label: "Filtros de Partículas (DPF/FAP)", icon: "circle-dashed" },
  { id: "filt8", label: "Filtros de Transmissão / Diferencial", icon: "settings" },
];

export const suspensaoDirecaoSubSubCategories: Category[] = [
  { id: "susp1", label: "Amortecedores", icon: "settings" },
  { id: "susp2", label: "Molas de Suspensão", icon: "refresh-cw" },
  { id: "susp3", label: "Topos de Amortecedor & Rolamentos", icon: "cog" },
  { id: "susp4", label: "Braços de Suspensão", icon: "minus" },
  { id: "susp5", label: "Rótulas de Suspensão", icon: "circle-dot" },
  { id: "susp6", label: "Barras Estabilizadoras & Tirantes", icon: "minus" },
  { id: "susp7", label: "Casquilhos de Suspensão", icon: "wrench" },
  { id: "susp8", label: "Colunas de Direção", icon: "plug" },
  { id: "susp9", label: "Caixas de Direção", icon: "package" },
  { id: "susp10", label: "Bombas de Direção Assistida", icon: "droplet" },
  { id: "susp11", label: "Rótulas de Direção / Terminais", icon: "circle-dot" },
  { id: "susp12", label: "Volantes de Direção", icon: "gauge" },
  { id: "susp13", label: "Servodireção Elétrica / Motores EPS", icon: "zap" },
  { id: "susp14", label: "Kits de Suspensão & Direção", icon: "package" },
];

export const motorSubSubCategories: Category[] = [
  { id: "mot1", label: "Correias", icon: "refresh-cw" },
  { id: "mot2", label: "Tensores & Rolamentos", icon: "cog" },
  { id: "mot3", label: "Bombas de Água", icon: "droplet" },
  { id: "mot4", label: "Termóstatos", icon: "thermometer" },
  { id: "mot5", label: "Juntas & Vedantes", icon: "square" },
  { id: "mot6", label: "Válvulas", icon: "wrench" },
  { id: "mot7", label: "Pistões & Segmentos", icon: "circle-dot" },
  { id: "mot8", label: "Árvore de Cames", icon: "settings" },
];

export const sistemaEscapeSubSubCategories: Category[] = [
  { id: "esc1", label: "Flexível de Escape", icon: "plug" },
  { id: "esc2", label: "Uniões de Escape", icon: "link" },
  { id: "esc3", label: "Braçadeiras de Escape", icon: "wrench" },
];

// spraysManutencaoSubSubCategories removed - now shows products directly

// Lubrificantes subcategories now show products directly - no sub-subcategories needed

export const lubrificantesSubCategories: Category[] = [
  { id: "l1", label: "Óleos de Motor", icon: "droplets" },
  { id: "l2", label: "Óleos de Transmissão & Diferencial", icon: "cog" },
  { id: "l3", label: "Óleos Hidráulicos & Direção Assistida", icon: "droplet" },
  { id: "l4", label: "Líquidos de Travões", icon: "circle-dot" },
  { id: "l5", label: "Líquidos de Arrefecimento", icon: "snowflake" },
  { id: "l6", label: "Aditivos de Combustível", icon: "fuel" },
  { id: "l7", label: "Aditivos de Óleo", icon: "flask-conical" },
  { id: "l8", label: "Sprays & Manutenção", icon: "spray" },
  { id: "l9", label: "Óleos Especiais", icon: "sparkles" },
];

// Cuidado e Detalhe sub-subcategories
export const shampoosLimpezaSubSubCategories: Category[] = [
  { id: "sh1", label: "Shampoo Concentrado", icon: "droplet" },
  { id: "sh2", label: "Shampoo com Cera", icon: "sparkles" },
  { id: "sh3", label: "Desengorduante", icon: "spray" },
  { id: "sh4", label: "Limpa Jantes", icon: "cog" },
];

export const cerasSelantesSubSubCategories: Category[] = [
  { id: "cs1", label: "Cera Líquida", icon: "droplet" },
  { id: "cs2", label: "Cera em Pasta", icon: "package" },
  { id: "cs3", label: "Selante Sintético", icon: "shield" },
  { id: "cs4", label: "Coating Cerâmico", icon: "sparkles" },
];

export const polimentoCorrecaoSubSubCategories: Category[] = [
  { id: "pc1", label: "Polimento Fino", icon: "sparkles" },
  { id: "pc2", label: "Composto de Corte", icon: "wrench" },
  { id: "pc3", label: "Removedor Riscos", icon: "search" },
  { id: "pc4", label: "Boinas & Discos", icon: "disc" },
];

export const exteriorSubSubCategories: Category[] = [
  { id: "ext1", label: "Limpa Pneus", icon: "circle-dot" },
  { id: "ext2", label: "Restaurador Plásticos", icon: "wrench" },
  { id: "ext3", label: "Limpa Motor", icon: "settings" },
  { id: "ext4", label: "Removedor Insetos", icon: "bug" },
];

export const interioresSubSubCategories: Category[] = [
  { id: "int1", label: "Limpa Estofos", icon: "sofa" },
  { id: "int2", label: "Limpa Pele", icon: "sparkles" },
  { id: "int3", label: "Limpa Tablier", icon: "monitor-smartphone" },
  { id: "int4", label: "Limpa Tapetes", icon: "brush" },
];

export const vidrosEspelhosSubSubCategories: Category[] = [
  { id: "ve1", label: "Limpa Vidros", icon: "glass-water" },
  { id: "ve2", label: "Anti-Embaciante", icon: "wind" },
  { id: "ve3", label: "Repelente Água", icon: "droplet" },
  { id: "ve4", label: "Removedor Película", icon: "search" },
];

export const panosAcessoriosSubSubCategories: Category[] = [
  { id: "pa1", label: "Panos Microfibra", icon: "sponge" },
  { id: "pa2", label: "Esponjas", icon: "bath" },
  { id: "pa3", label: "Luvas de Lavagem", icon: "hand" },
  { id: "pa4", label: "Aplicadores", icon: "brush" },
];

export const odorizantesSubSubCategories: Category[] = [
  { id: "od1", label: "Ambientadores", icon: "flower-2" },
  { id: "od2", label: "Eliminador Odores", icon: "wind" },
  { id: "od3", label: "Fragrâncias Auto", icon: "car" },
];

export const acessoriosSubCategories: Category[] = [
  { id: "a1", label: "Interior", icon: "armchair" },
  { id: "a2", label: "Exterior", icon: "car" },
  { id: "a3", label: "Multimédia & Eletrónica", icon: "smartphone" },
  { id: "a4", label: "Conforto & Utilitários", icon: "sofa" },
];

export const multimediaEletronicaSubSubCategories: Category[] = [
  { id: "mult1", label: "Pilhas", icon: "battery" },
  { id: "mult2", label: "Carregadores", icon: "plug" },
  { id: "mult3", label: "Suportes Telemóvel", icon: "smartphone" },
  { id: "mult4", label: "Câmaras", icon: "camera" },
];

export const cuidadoDetalheSubCategories: Category[] = [
  { id: "c1", label: "Shampoos & Limpeza", icon: "droplet" },
  { id: "c2", label: "Ceras & Selantes", icon: "sparkles" },
  { id: "c3", label: "Polimento & Correção", icon: "disc" },
  { id: "c4", label: "Exterior", icon: "car" },
  { id: "c5", label: "Interiores", icon: "armchair" },
  { id: "c6", label: "Vidros & Espelhos", icon: "glass-water" },
  { id: "c7", label: "Panos & Acessórios", icon: "sponge" },
  { id: "c8", label: "Odorizantes", icon: "flower-2" },
];

export const desempenhoUpgradeSubCategories: Category[] = [
  { id: "d1", label: "Filtros de Ar Desportivos", icon: "wind" },
  { id: "d2", label: "Escapes & Silenciosos", icon: "volume-2" },
  { id: "d3", label: "Suspensões & Molas", icon: "settings" },
  { id: "d4", label: "Travagem Performance", icon: "circle-dot" },
  { id: "d5", label: "Jantes & Acessórios", icon: "cog" },
  { id: "d6", label: "Iluminação Upgrade", icon: "lightbulb" },
  { id: "d7", label: "Eletrónica & Chip Tuning", icon: "plug" },
  { id: "d8", label: "Acessórios Desportivos", icon: "flag" },
];

export const bateriasSubSubCategories: Category[] = [
  { id: "bat1", label: "Baterias Auto", icon: "battery" },
  { id: "bat2", label: "Baterias Moto", icon: "gauge" },
  { id: "bat3", label: "Baterias AGM", icon: "zap" },
  { id: "bat4", label: "Carregadores", icon: "plug" },
];

export const iluminacaoLampadasSubSubCategories: Category[] = [
  { id: "il1", label: "Lâmpadas H7", icon: "lightbulb" },
  { id: "il2", label: "Lâmpadas H4", icon: "lightbulb" },
  { id: "il3", label: "LED", icon: "zap" },
  { id: "il4", label: "Xenon", icon: "sparkles" },
  { id: "il5", label: "Lanternas", icon: "lightbulb" },
];

export const eletricaSubCategories: Category[] = [
  { id: "e1", label: "Baterias", icon: "battery" },
  { id: "e2", label: "Interruptores", icon: "toggle-left" },
  { id: "e3", label: "Iluminação & Lâmpadas", icon: "lightbulb" },
  { id: "e4", label: "Fusíveis & Relés", icon: "zap" },
  { id: "e5", label: "Cablagens & Conectores", icon: "cable" },
];

export const universalSubCategories: Category[] = [
  { id: "u1", label: "Ferramentas", icon: "hammer" },
  { id: "u2", label: "Fixações", icon: "nut" },
  { id: "u3", label: "Adesivos", icon: "flask-conical" },
  { id: "u4", label: "Diversos", icon: "box-icon" },
];

export const sinaleticaSegurancaSubCategories: Category[] = [
  { id: "s1", label: "Sinalética Interior & Exterior", icon: "alert-triangle" },
  { id: "s2", label: "Kits de Emergência", icon: "siren" },
  { id: "s3", label: "Coletes Refletores", icon: "shirt" },
  { id: "s4", label: "Triângulos", icon: "triangle" },
  { id: "s5", label: "Extintores", icon: "flame-kindling" },
];

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Filtro de Óleo Premium",
    brand: "FAST",
    category: "Óleos e filtros",
    price: 45.99,
    originalPrice: 59.99,
    image: "🛢️",
    inStock: true,
    description: "Filtro de óleo de alta performance para motores a gasolina e diesel.",
  },
  {
    id: "2",
    name: "Pastilha de Freio Cerâmica",
    brand: "Febi",
    category: "Peças mais vendidas",
    price: 189.99,
    image: "🔧",
    inStock: true,
    description: "Pastilhas de freio cerâmicas com baixo ruído e poeira.",
  },
  {
    id: "3",
    name: "Óleo Sintético 5W-30",
    brand: "Valvoline",
    category: "Óleos e filtros",
    price: 129.99,
    originalPrice: 149.99,
    image: "🛢️",
    inStock: true,
    description: "Óleo 100% sintético para máxima proteção do motor.",
  },
  {
    id: "4",
    name: "Kit Limpeza Profissional",
    brand: "UFI",
    category: "Limpeza & Detalhe",
    price: 89.99,
    image: "✨",
    inStock: false,
    description: "Kit completo para limpeza e detalhamento automotivo.",
  },
  {
    id: "5",
    name: "Triângulo de Sinalização",
    brand: "FAST",
    category: "Segurança & Sinalização",
    price: 34.99,
    image: "⚠️",
    inStock: true,
    description: "Triângulo refletivo homologado pelo INMETRO.",
  },
  {
    id: "6",
    name: "Correia Dentada",
    brand: "Febi",
    category: "Peças mais vendidas",
    price: 259.99,
    originalPrice: 299.99,
    image: "🔧",
    inStock: true,
    description: "Correia dentada de alta durabilidade para motores VW/Audi.",
  },
  {
    id: "7",
    name: "Amortecedor Dianteiro",
    brand: "FAST",
    category: "Suspensão e Direção",
    price: 320.00,
    originalPrice: 380.00,
    image: "🔩",
    inStock: true,
    description: "Amortecedor dianteiro de alta qualidade para conforto e segurança.",
  },
  {
    id: "8",
    name: "Disco de Travão Ventilado",
    brand: "Febi",
    category: "Travagem",
    price: 145.99,
    image: "⚫",
    inStock: true,
    description: "Disco de travão ventilado para melhor dissipação de calor.",
  },
  {
    id: "9",
    name: "Bateria 60Ah",
    brand: "FAST",
    category: "Elétrica",
    price: 289.99,
    originalPrice: 350.00,
    image: "🔋",
    inStock: true,
    description: "Bateria de alta capacidade com garantia de 2 anos.",
  },
  {
    id: "10",
    name: "Líquido de Arrefecimento",
    brand: "Valvoline",
    category: "Lubrificantes",
    price: 35.99,
    image: "❄️",
    inStock: true,
    description: "Líquido anticongelante para proteção do motor.",
  },
  {
    id: "11",
    name: "Filtro de Ar",
    brand: "UFI",
    category: "Filtros",
    price: 28.99,
    originalPrice: 35.00,
    image: "💨",
    inStock: true,
    description: "Filtro de ar de alta eficiência para melhor performance.",
  },
  {
    id: "12",
    name: "Bomba de Água",
    brand: "Febi",
    category: "Motor",
    price: 189.00,
    image: "💧",
    inStock: true,
    description: "Bomba de água para sistema de arrefecimento do motor.",
  },
  {
    id: "13",
    name: "Velas de Ignição NGK",
    brand: "FAST",
    category: "Motor",
    price: 45.00,
    image: "⚡",
    inStock: true,
    description: "Velas de ignição de alto desempenho para combustão eficiente.",
  },
  {
    id: "14",
    name: "Spray Multiusos WD-40",
    brand: "UFI",
    category: "Sprays & Manutenção",
    price: 15.99,
    image: "💨",
    inStock: true,
    description: "Spray lubrificante multiusos para diversas aplicações.",
  },
  {
    id: "15",
    name: "Cola Selante Silicone",
    brand: "FAST",
    category: "Sprays & Manutenção",
    price: 12.50,
    image: "🧴",
    inStock: true,
    description: "Selante de silicone resistente a altas temperaturas.",
  },
  {
    id: "16",
    name: "Pilhas AA Duracell",
    brand: "Duracell",
    category: "Multimédia & Eletrónica",
    price: 8.99,
    image: "🔋",
    inStock: true,
    description: "Pack de 4 pilhas alcalinas de longa duração.",
  },
  {
    id: "17",
    name: "Farol LED Dianteiro",
    brand: "Febi",
    category: "Carroçaria",
    price: 450.00,
    originalPrice: 520.00,
    image: "💡",
    inStock: true,
    description: "Farol LED de alta luminosidade com longa vida útil.",
  },
  {
    id: "18",
    name: "Retrovisor Elétrico",
    brand: "FAST",
    category: "Carroçaria",
    price: 185.00,
    image: "🪞",
    inStock: false,
    description: "Retrovisor elétrico com aquecimento integrado.",
  },
  {
    id: "19",
    name: "Kit de Emergência",
    brand: "UFI",
    category: "Sinalética e Segurança",
    price: 75.00,
    image: "🚨",
    inStock: true,
    description: "Kit completo com triângulo, colete e lanterna.",
  },
  {
    id: "20",
    name: "Shampoo Auto Brilho",
    brand: "Valvoline",
    category: "Cuidado e Detalhe",
    price: 18.99,
    image: "🧴",
    inStock: true,
    description: "Shampoo concentrado para lavagem automóvel.",
  },
  // Liqui Moly Products - Óleos de Motor
  {
    id: "lm1",
    name: "Liqui Moly Top Tec 4200 5W-30",
    brand: "Liqui Moly",
    category: "Óleos de Motor",
    price: 45.99,
    image: "🛢️",
    inStock: true,
    description: "Óleo sintético de alta tecnologia para motores modernos.",
  },
  {
    id: "lm2",
    name: "Liqui Moly Leichtlauf HC7 5W-40",
    brand: "Liqui Moly",
    category: "Óleos de Motor",
    price: 38.99,
    image: "🛢️",
    inStock: true,
    description: "Óleo de motor sintético para alta performance.",
  },
  {
    id: "lm3",
    name: "Liqui Moly MoS2 Leichtlauf 10W-40",
    brand: "Liqui Moly",
    category: "Óleos de Motor",
    price: 32.50,
    image: "🛢️",
    inStock: true,
    description: "Óleo com bissulfeto de molibdênio para proteção extra.",
  },
  {
    id: "lm4",
    name: "Liqui Moly Special Tec AA 0W-20",
    brand: "Liqui Moly",
    category: "Óleos de Motor",
    price: 52.99,
    originalPrice: 59.99,
    image: "🛢️",
    inStock: true,
    description: "Óleo especial para veículos asiáticos e americanos.",
  },
  // Liqui Moly - Líquidos de Arrefecimento
  {
    id: "lm5",
    name: "Liqui Moly Kühlerfrostschutz KFS 12++",
    brand: "Liqui Moly",
    category: "Líquidos de Arrefecimento",
    price: 18.99,
    image: "❄️",
    inStock: true,
    description: "Anticongelante concentrado de longa duração.",
  },
  {
    id: "lm6",
    name: "Liqui Moly Radiator Cleaner",
    brand: "Liqui Moly",
    category: "Líquidos de Arrefecimento",
    price: 12.50,
    image: "💧",
    inStock: true,
    description: "Limpa radiador para sistema de arrefecimento.",
  },
  {
    id: "lm7",
    name: "Liqui Moly Kühlerdichter",
    brand: "Liqui Moly",
    category: "Líquidos de Arrefecimento",
    price: 15.99,
    image: "🔧",
    inStock: true,
    description: "Vedante para radiador e sistema de arrefecimento.",
  },
  // Liqui Moly - Aditivos de Combustível
  {
    id: "lm8",
    name: "Liqui Moly Injection Cleaner",
    brand: "Liqui Moly",
    category: "Aditivos de Combustível",
    price: 14.99,
    image: "⛽",
    inStock: true,
    description: "Limpa injetores para motores a gasolina.",
  },
  {
    id: "lm9",
    name: "Liqui Moly Diesel Purge",
    brand: "Liqui Moly",
    category: "Aditivos de Combustível",
    price: 22.50,
    image: "🛢️",
    inStock: true,
    description: "Aditivo de limpeza profunda para diesel.",
  },
  {
    id: "lm10",
    name: "Liqui Moly Super Diesel Additiv",
    brand: "Liqui Moly",
    category: "Aditivos de Combustível",
    price: 11.99,
    image: "⛽",
    inStock: true,
    description: "Aditivo para melhoria de combustão diesel.",
  },
  // Liqui Moly - Aditivos de Óleo
  {
    id: "lm11",
    name: "Liqui Moly Oil Additiv",
    brand: "Liqui Moly",
    category: "Aditivos de Óleo",
    price: 19.99,
    image: "🔧",
    inStock: true,
    description: "Aditivo com MoS2 para redução de atrito.",
  },
  {
    id: "lm12",
    name: "Liqui Moly Motor Protect",
    brand: "Liqui Moly",
    category: "Aditivos de Óleo",
    price: 28.99,
    image: "🛡️",
    inStock: true,
    description: "Proteção anti-desgaste para motor.",
  },
  {
    id: "lm13",
    name: "Liqui Moly Engine Flush",
    brand: "Liqui Moly",
    category: "Aditivos de Óleo",
    price: 12.99,
    image: "✨",
    inStock: true,
    description: "Limpeza interna do motor antes da troca de óleo.",
  },
  // Liqui Moly - Líquidos de Travões
  {
    id: "lm14",
    name: "Liqui Moly Bremsflüssigkeit DOT 4",
    brand: "Liqui Moly",
    category: "Líquidos de Travões",
    price: 14.50,
    image: "🛞",
    inStock: true,
    description: "Líquido de travões DOT 4 de alta qualidade.",
  },
  {
    id: "lm15",
    name: "Liqui Moly Bremsflüssigkeit DOT 5.1",
    brand: "Liqui Moly",
    category: "Líquidos de Travões",
    price: 18.99,
    image: "🏎️",
    inStock: true,
    description: "Líquido de travões para alta performance.",
  },
  // Liqui Moly - Óleos de Transmissão
  {
    id: "lm16",
    name: "Liqui Moly Top Tec ATF 1100",
    brand: "Liqui Moly",
    category: "Óleos de Transmissão",
    price: 24.99,
    image: "⚙️",
    inStock: true,
    description: "Óleo para transmissões automáticas.",
  },
  {
    id: "lm17",
    name: "Liqui Moly Gear Oil GL4+ 75W-90",
    brand: "Liqui Moly",
    category: "Óleos de Transmissão",
    price: 28.50,
    image: "🔧",
    inStock: true,
    description: "Óleo para caixas manuais e diferenciais.",
  },
  // Liqui Moly - Sprays & Manutenção
  {
    id: "lm18",
    name: "Liqui Moly Multi-Spray Plus 7",
    brand: "Liqui Moly",
    category: "Sprays & Manutenção",
    price: 9.99,
    image: "💨",
    inStock: true,
    description: "Spray multiusos 7 funções em 1.",
  },
  {
    id: "lm19",
    name: "Liqui Moly Silicon-Spray",
    brand: "Liqui Moly",
    category: "Sprays & Manutenção",
    price: 11.50,
    image: "💨",
    inStock: true,
    description: "Spray de silicone para borrachas e plásticos.",
  },
  {
    id: "lm20",
    name: "Liqui Moly Kupfer-Spray",
    brand: "Liqui Moly",
    category: "Sprays & Manutenção",
    price: 13.99,
    image: "🔧",
    inStock: true,
    description: "Spray de cobre anti-gripagem.",
  },
];
