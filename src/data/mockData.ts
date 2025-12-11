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
