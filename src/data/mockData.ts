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
  { id: "car1", label: "Discos", icon: "⚫" },
  { id: "car2", label: "Pastilhas de Travão", icon: "🔲" },
  { id: "car3", label: "Maxilas / Calços de Tambor", icon: "🔧" },
  { id: "car4", label: "Tambores de Travão", icon: "🥁" },
  { id: "car5", label: "Pinças de Travão & Reparações", icon: "🔩" },
  { id: "car6", label: "Bombas de Travão", icon: "💧" },
  { id: "car7", label: "Servofreio (Hidrovácuo)", icon: "⚙️" },
  { id: "car8", label: "Bombitos / Cilindros de Roda", icon: "🔘" },
  { id: "car9", label: "Sensores ABS / Velocidade", icon: "📡" },
  { id: "car10", label: "Tubos & Mangueiras de Travão", icon: "🔌" },
  { id: "car11", label: "Óleo / Líquido de Travões", icon: "🛢️" },
  { id: "car12", label: "Chapas de Proteção / Deflectores", icon: "🛡️" },
  { id: "car13", label: "Parafusos & Acessórios", icon: "🔩" },
  { id: "car14", label: "Kits de Travagem", icon: "📦" },
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

export const acessoriosSubCategories: Category[] = [
  { id: "a1", label: "Interior", icon: "🚗" },
  { id: "a2", label: "Exterior", icon: "🚙" },
  { id: "a3", label: "Multimédia & Eletrónica", icon: "📱" },
  { id: "a4", label: "Conforto & Utilitários", icon: "💺" },
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

export const eletricaSubCategories: Category[] = [
  { id: "e1", label: "Baterias", icon: "🔋" },
  { id: "e2", label: "Interruptores", icon: "🔘" },
  { id: "e3", label: "Iluminação & Lâmpadas", icon: "💡" },
  { id: "e4", label: "Fusíveis & Relés", icon: "⚡" },
  { id: "e5", label: "Cablagens & Conectores", icon: "🔌" },
];

export const universalSubCategories: Category[] = [
  { id: "u1", label: "Relas", icon: "🔩" },
];

export const sinaleticaSegurancaSubCategories: Category[] = [
  { id: "s1", label: "Sinalética Interior & Exterior", icon: "⚠️" },
  { id: "s2", label: "Kits de Emergência", icon: "🚨" },
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
];
