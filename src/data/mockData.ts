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
  { id: "2", label: "Carroçaria", icon: "🚗" },
  { id: "3", label: "Travagem", icon: "🛞" },
  { id: "4", label: "Filtros", icon: "🛢️" },
  { id: "5", label: "Suspensão e Direção", icon: "⚙️" },
  { id: "6", label: "Motor", icon: "🔩" },
  { id: "7", label: "Sistema de Escape", icon: "💨" },
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
