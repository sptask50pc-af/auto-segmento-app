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
  { id: "1", label: "Peças", icon: "🔧" },
  { id: "2", label: "Lubrificantes", icon: "🛢️" },
  { id: "3", label: "Acessórios", icon: "🎯" },
  { id: "4", label: "Cuidado e Detalhe", icon: "✨" },
  { id: "5", label: "Desempenho e Upgrade", icon: "⚡" },
  { id: "6", label: "Elétrica", icon: "🔌" },
  { id: "7", label: "Universal", icon: "🔩" },
  { id: "8", label: "Sinalética e Segurança", icon: "⚠️" },
];

export const pecasSubCategories: Category[] = [
  { id: "p1", label: "Carroçaria", icon: "🚗" },
  { id: "p2", label: "Travagem", icon: "🛞" },
  { id: "p3", label: "Filtros", icon: "🛢️" },
  { id: "p4", label: "Suspensão e Direção", icon: "⚙️" },
  { id: "p5", label: "Motor", icon: "🔩" },
  { id: "p6", label: "Sistema de Escape", icon: "💨" },
];

export const carrocariaSubSubCategories: Category[] = [
  { id: "car1", label: "Revestimentos Interiores", icon: "🪑" },
  { id: "car2", label: "Faróis & Farolins", icon: "💡" },
  { id: "car3", label: "Retrovisores", icon: "🪞" },
  { id: "car4", label: "Fechos & Dobradiças", icon: "🔐" },
  { id: "car5", label: "Para-choques", icon: "🛡️" },
  { id: "car6", label: "Grelhas", icon: "▦" },
  { id: "car7", label: "Guarda-lamas & Extensões", icon: "🚗" },
  { id: "car8", label: "Capôs & Tampas", icon: "📦" },
  { id: "car9", label: "Portas & Painéis Laterais", icon: "🚪" },
  { id: "car10", label: "Frisos & Molduras", icon: "➖" },
  { id: "car11", label: "Suportes & Estruturas", icon: "🔩" },
];

export const travagemSubSubCategories: Category[] = [
  { id: "trav1", label: "Discos", icon: "⚫" },
  { id: "trav2", label: "Pastilhas de Travão", icon: "🔲" },
  { id: "trav3", label: "Maxilas / Calços de Tambor", icon: "🔧" },
  { id: "trav4", label: "Tambores de Travão", icon: "🥁" },
  { id: "trav5", label: "Pinças de Travão & Reparações", icon: "🔩" },
  { id: "trav6", label: "Bombas de Travão", icon: "💧" },
  { id: "trav7", label: "Servofreio (Hidrovácuo)", icon: "⚙️" },
  { id: "trav8", label: "Bombitos / Cilindros de Roda", icon: "🔘" },
  { id: "trav9", label: "Sensores ABS / Velocidade", icon: "📡" },
  { id: "trav10", label: "Tubos & Mangueiras de Travão", icon: "🔌" },
  { id: "trav11", label: "Óleo / Líquido de Travões", icon: "🛢️" },
  { id: "trav12", label: "Chapas de Proteção / Deflectores", icon: "🛡️" },
  { id: "trav13", label: "Parafusos & Acessórios", icon: "🔩" },
  { id: "trav14", label: "Kits de Travagem", icon: "📦" },
];

export const filtrosSubSubCategories: Category[] = [
  { id: "filt1", label: "Filtros de Óleo", icon: "🛢️" },
  { id: "filt2", label: "Filtros de Ar", icon: "💨" },
  { id: "filt3", label: "Filtros de Habitáculo (Pólen)", icon: "🌸" },
  { id: "filt4", label: "Filtros de Combustível", icon: "⛽" },
  { id: "filt5", label: "Filtros de Caixa de Velocidades", icon: "⚙️" },
  { id: "filt6", label: "Filtros Hidráulicos", icon: "💧" },
  { id: "filt7", label: "Filtros de Partículas (DPF/FAP)", icon: "🔘" },
  { id: "filt8", label: "Filtros de Transmissão / Diferencial", icon: "🔧" },
];

export const suspensaoDirecaoSubSubCategories: Category[] = [
  { id: "susp1", label: "Amortecedores", icon: "🔩" },
  { id: "susp2", label: "Molas de Suspensão", icon: "🌀" },
  { id: "susp3", label: "Topos de Amortecedor & Rolamentos", icon: "⚙️" },
  { id: "susp4", label: "Braços de Suspensão", icon: "🦾" },
  { id: "susp5", label: "Rótulas de Suspensão", icon: "🔘" },
  { id: "susp6", label: "Barras Estabilizadoras & Tirantes", icon: "➖" },
  { id: "susp7", label: "Casquilhos de Suspensão", icon: "🔧" },
  { id: "susp8", label: "Colunas de Direção", icon: "🔌" },
  { id: "susp9", label: "Caixas de Direção", icon: "📦" },
  { id: "susp10", label: "Bombas de Direção Assistida", icon: "💧" },
  { id: "susp11", label: "Rótulas de Direção / Terminais", icon: "🔘" },
  { id: "susp12", label: "Volantes de Direção", icon: "🎡" },
  { id: "susp13", label: "Servodireção Elétrica / Motores EPS", icon: "⚡" },
  { id: "susp14", label: "Kits de Suspensão & Direção", icon: "📦" },
];

export const motorSubSubCategories: Category[] = [
  { id: "mot1", label: "Correias", icon: "🔄" },
  { id: "mot2", label: "Tensores & Rolamentos", icon: "⚙️" },
  { id: "mot3", label: "Bombas de Água", icon: "💧" },
  { id: "mot4", label: "Termóstatos", icon: "🌡️" },
  { id: "mot5", label: "Juntas & Vedantes", icon: "🔲" },
  { id: "mot6", label: "Válvulas", icon: "🔧" },
  { id: "mot7", label: "Pistões & Segmentos", icon: "🔘" },
  { id: "mot8", label: "Árvore de Cames", icon: "🔩" },
];

export const sistemaEscapeSubSubCategories: Category[] = [
  { id: "esc1", label: "Flexível de Escape", icon: "🔌" },
  { id: "esc2", label: "Uniões de Escape", icon: "🔗" },
  { id: "esc3", label: "Braçadeiras de Escape", icon: "🔧" },
];

export const spraysManutencaoSubSubCategories: Category[] = [
  { id: "spray1", label: "Colas & Selantes", icon: "🧴" },
  { id: "spray2", label: "Sprays", icon: "💨" },
  { id: "spray3", label: "Massas/Pastas", icon: "🧈" },
];

export const liquidosArrefecimentoSubSubCategories: Category[] = [
  { id: "arr1", label: "Anticongelantes", icon: "❄️" },
  { id: "arr2", label: "Líquido de Radiador", icon: "💧" },
  { id: "arr3", label: "Concentrado", icon: "🧪" },
  { id: "arr4", label: "Diluído / Pronto a Usar", icon: "✅" },
  { id: "arr5", label: "Aditivos de Arrefecimento", icon: "🔧" },
];

export const oleosMotorSubSubCategories: Category[] = [
  { id: "om1", label: "5W-30", icon: "🛢️" },
  { id: "om2", label: "5W-40", icon: "🛢️" },
  { id: "om3", label: "10W-40", icon: "🛢️" },
  { id: "om4", label: "0W-20", icon: "🛢️" },
  { id: "om5", label: "0W-30", icon: "🛢️" },
  { id: "om6", label: "15W-40", icon: "🛢️" },
  { id: "om7", label: "Óleos Diesel", icon: "⛽" },
  { id: "om8", label: "Óleos Moto", icon: "🏍️" },
];

export const oleosTransmissaoSubSubCategories: Category[] = [
  { id: "ot1", label: "ATF (Automático)", icon: "⚙️" },
  { id: "ot2", label: "MTF (Manual)", icon: "🔧" },
  { id: "ot3", label: "Diferencial", icon: "🔩" },
  { id: "ot4", label: "CVT", icon: "⚡" },
  { id: "ot5", label: "DSG/PDK", icon: "🏎️" },
];

export const aditivosCombustivelSubSubCategories: Category[] = [
  { id: "ac1", label: "Limpeza Injetores Gasolina", icon: "⛽" },
  { id: "ac2", label: "Limpeza Injetores Diesel", icon: "🛢️" },
  { id: "ac3", label: "Estabilizador Combustível", icon: "🧪" },
  { id: "ac4", label: "Aditivo Anti-Gelo", icon: "❄️" },
  { id: "ac5", label: "Catalisador", icon: "🔧" },
];

export const aditivosOleoSubSubCategories: Category[] = [
  { id: "ao1", label: "Tapa Fugas", icon: "🔧" },
  { id: "ao2", label: "Anti-Desgaste", icon: "🛡️" },
  { id: "ao3", label: "Limpeza Motor", icon: "✨" },
  { id: "ao4", label: "Estabilizador Óleo", icon: "🧪" },
];

export const liquidosTravaoSubSubCategories: Category[] = [
  { id: "lt1", label: "DOT 4", icon: "🛞" },
  { id: "lt2", label: "DOT 5.1", icon: "🏎️" },
  { id: "lt3", label: "DOT 3", icon: "🔧" },
];

export const oleosHidraulicosSubSubCategories: Category[] = [
  { id: "oh1", label: "Direção Assistida", icon: "💧" },
  { id: "oh2", label: "Hidráulico Industrial", icon: "🔧" },
  { id: "oh3", label: "Suspensão Hidráulica", icon: "⚙️" },
];

export const oleosEspeciaisSubSubCategories: Category[] = [
  { id: "oe1", label: "Ar Condicionado", icon: "❄️" },
  { id: "oe2", label: "Compressores", icon: "💨" },
  { id: "oe3", label: "Correntes", icon: "🔗" },
  { id: "oe4", label: "Náuticos", icon: "⚓" },
];

export const lubrificantesSubCategories: Category[] = [
  { id: "l1", label: "Óleos de Motor", icon: "🛢️" },
  { id: "l2", label: "Óleos de Transmissão & Diferencial", icon: "⚙️" },
  { id: "l3", label: "Óleos Hidráulicos & Direção Assistida", icon: "💧" },
  { id: "l4", label: "Líquidos de Travões", icon: "🛞" },
  { id: "l5", label: "Líquidos de Arrefecimento", icon: "❄️" },
  { id: "l6", label: "Aditivos de Combustível", icon: "⛽" },
  { id: "l7", label: "Aditivos de Óleo", icon: "🔧" },
  { id: "l8", label: "Sprays & Manutenção", icon: "💨" },
  { id: "l9", label: "Óleos Especiais", icon: "✨" },
];

// Cuidado e Detalhe sub-subcategories
export const shampoosLimpezaSubSubCategories: Category[] = [
  { id: "sh1", label: "Shampoo Concentrado", icon: "🧴" },
  { id: "sh2", label: "Shampoo com Cera", icon: "✨" },
  { id: "sh3", label: "Desengorduante", icon: "💪" },
  { id: "sh4", label: "Limpa Jantes", icon: "⚙️" },
];

export const cerasSelantesSubSubCategories: Category[] = [
  { id: "cs1", label: "Cera Líquida", icon: "💧" },
  { id: "cs2", label: "Cera em Pasta", icon: "🧈" },
  { id: "cs3", label: "Selante Sintético", icon: "🛡️" },
  { id: "cs4", label: "Coating Cerâmico", icon: "✨" },
];

export const polimentoCorrecaoSubSubCategories: Category[] = [
  { id: "pc1", label: "Polimento Fino", icon: "✨" },
  { id: "pc2", label: "Composto de Corte", icon: "🔧" },
  { id: "pc3", label: "Removedor Riscos", icon: "🔍" },
  { id: "pc4", label: "Boinas & Discos", icon: "⚙️" },
];

export const exteriorSubSubCategories: Category[] = [
  { id: "ext1", label: "Limpa Pneus", icon: "🛞" },
  { id: "ext2", label: "Restaurador Plásticos", icon: "🔧" },
  { id: "ext3", label: "Limpa Motor", icon: "⚙️" },
  { id: "ext4", label: "Removedor Insetos", icon: "🦟" },
];

export const interioresSubSubCategories: Category[] = [
  { id: "int1", label: "Limpa Estofos", icon: "🪑" },
  { id: "int2", label: "Limpa Pele", icon: "✨" },
  { id: "int3", label: "Limpa Tablier", icon: "📱" },
  { id: "int4", label: "Limpa Tapetes", icon: "🧹" },
];

export const vidrosEspelhosSubSubCategories: Category[] = [
  { id: "ve1", label: "Limpa Vidros", icon: "🪟" },
  { id: "ve2", label: "Anti-Embaciante", icon: "💨" },
  { id: "ve3", label: "Repelente Água", icon: "💧" },
  { id: "ve4", label: "Removedor Película", icon: "🔍" },
];

export const panosAcessoriosSubSubCategories: Category[] = [
  { id: "pa1", label: "Panos Microfibra", icon: "🧽" },
  { id: "pa2", label: "Esponjas", icon: "🧼" },
  { id: "pa3", label: "Luvas de Lavagem", icon: "🧤" },
  { id: "pa4", label: "Aplicadores", icon: "🔧" },
];

export const odorizantesSubSubCategories: Category[] = [
  { id: "od1", label: "Ambientadores", icon: "🌸" },
  { id: "od2", label: "Eliminador Odores", icon: "💨" },
  { id: "od3", label: "Fragrâncias Auto", icon: "🚗" },
];

export const acessoriosSubCategories: Category[] = [
  { id: "a1", label: "Interior", icon: "🚗" },
  { id: "a2", label: "Exterior", icon: "🚙" },
  { id: "a3", label: "Multimédia & Eletrónica", icon: "📱" },
  { id: "a4", label: "Conforto & Utilitários", icon: "💺" },
];

export const multimediaEletronicaSubSubCategories: Category[] = [
  { id: "mult1", label: "Pilhas", icon: "🔋" },
  { id: "mult2", label: "Carregadores", icon: "🔌" },
  { id: "mult3", label: "Suportes Telemóvel", icon: "📱" },
  { id: "mult4", label: "Câmaras", icon: "📷" },
];

export const cuidadoDetalheSubCategories: Category[] = [
  { id: "c1", label: "Shampoos & Limpeza", icon: "🧴" },
  { id: "c2", label: "Ceras & Selantes", icon: "✨" },
  { id: "c3", label: "Polimento & Correção", icon: "🔧" },
  { id: "c4", label: "Exterior", icon: "🚙" },
  { id: "c5", label: "Interiores", icon: "🪑" },
  { id: "c6", label: "Vidros & Espelhos", icon: "🪟" },
  { id: "c7", label: "Panos & Acessórios", icon: "🧽" },
  { id: "c8", label: "Odorizantes", icon: "🌸" },
];

export const desempenhoUpgradeSubCategories: Category[] = [
  { id: "d1", label: "Filtros de Ar Desportivos", icon: "💨" },
  { id: "d2", label: "Escapes & Silenciosos", icon: "🔊" },
  { id: "d3", label: "Suspensões & Molas", icon: "🔩" },
  { id: "d4", label: "Travagem Performance", icon: "🛞" },
  { id: "d5", label: "Jantes & Acessórios", icon: "⚙️" },
  { id: "d6", label: "Iluminação Upgrade", icon: "💡" },
  { id: "d7", label: "Eletrónica & Chip Tuning", icon: "🔌" },
  { id: "d8", label: "Acessórios Desportivos", icon: "🏁" },
];

export const bateriasSubSubCategories: Category[] = [
  { id: "bat1", label: "Baterias Auto", icon: "🔋" },
  { id: "bat2", label: "Baterias Moto", icon: "🏍️" },
  { id: "bat3", label: "Baterias AGM", icon: "⚡" },
  { id: "bat4", label: "Carregadores", icon: "🔌" },
];

export const iluminacaoLampadasSubSubCategories: Category[] = [
  { id: "il1", label: "Lâmpadas H7", icon: "💡" },
  { id: "il2", label: "Lâmpadas H4", icon: "💡" },
  { id: "il3", label: "LED", icon: "⚡" },
  { id: "il4", label: "Xenon", icon: "✨" },
  { id: "il5", label: "Lanternas", icon: "🔦" },
];

export const eletricaSubCategories: Category[] = [
  { id: "e1", label: "Baterias", icon: "🔋" },
  { id: "e2", label: "Interruptores", icon: "🔘" },
  { id: "e3", label: "Iluminação & Lâmpadas", icon: "💡" },
  { id: "e4", label: "Fusíveis & Relés", icon: "⚡" },
  { id: "e5", label: "Cablagens & Conectores", icon: "🔌" },
];

export const universalSubCategories: Category[] = [
  { id: "u1", label: "Ferramentas", icon: "🔧" },
  { id: "u2", label: "Fixações", icon: "🔩" },
  { id: "u3", label: "Adesivos", icon: "🧴" },
  { id: "u4", label: "Diversos", icon: "📦" },
];

export const sinaleticaSegurancaSubCategories: Category[] = [
  { id: "s1", label: "Sinalética Interior & Exterior", icon: "⚠️" },
  { id: "s2", label: "Kits de Emergência", icon: "🚨" },
  { id: "s3", label: "Coletes Refletores", icon: "🦺" },
  { id: "s4", label: "Triângulos", icon: "🔺" },
  { id: "s5", label: "Extintores", icon: "🧯" },
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
];
