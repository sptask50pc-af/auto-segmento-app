import {
  Wrench,
  Droplets,
  Car,
  Sparkles,
  Gauge,
  Zap,
  Settings,
  ShieldAlert,
  CircleDot,
  Filter,
  Cog,
  Wind,
  Lightbulb,
  Lock,
  Shield,
  Grid3X3,
  Package,
  DoorOpen,
  Minus,
  Disc,
  Square,
  Drum,
  Droplet,
  Radio,
  Plug,
  ShieldCheck,
  Fuel,
  Flower2,
  CircleDashed,
  RefreshCw,
  Thermometer,
  Link,
  Smartphone,
  Armchair,
  PanelTop,
  Brush,
  Search,
  Bug,
  Sofa,
  MonitorSmartphone,
  Bath,
  Hand,
  SprayCan,
  CircleEllipsis,
  GlassWater,
  Volume2,
  Flag,
  Battery,
  ToggleLeft,
  Cable,
  Hammer,
  Nut,
  FlaskConical,
  BoxIcon,
  AlertTriangle,
  Siren,
  Shirt,
  Triangle,
  FlameKindling,
  Camera,
  Snowflake,
  LucideIcon,
} from "lucide-react";

// Map icon names to Lucide components
const iconComponents: Record<string, LucideIcon> = {
  // Main categories
  wrench: Wrench,
  droplets: Droplets,
  car: Car,
  sparkles: Sparkles,
  gauge: Gauge,
  zap: Zap,
  settings: Settings,
  "shield-alert": ShieldAlert,
  
  // Peças subcategories
  "circle-dot": CircleDot,
  filter: Filter,
  cog: Cog,
  wind: Wind,
  
  // Carroçaria
  armchair: Armchair,
  lightbulb: Lightbulb,
  "panel-top": PanelTop,
  lock: Lock,
  shield: Shield,
  "grid-3x3": Grid3X3,
  package: Package,
  "door-open": DoorOpen,
  minus: Minus,
  nut: Nut,
  
  // Travagem
  disc: Disc,
  square: Square,
  drum: Drum,
  droplet: Droplet,
  radio: Radio,
  plug: Plug,
  "shield-check": ShieldCheck,
  
  // Filtros
  fuel: Fuel,
  "flower-2": Flower2,
  "circle-dashed": CircleDashed,
  
  // Motor
  "refresh-cw": RefreshCw,
  thermometer: Thermometer,
  link: Link,
  
  // Lubrificantes
  snowflake: Snowflake,
  "flask-conical": FlaskConical,
  
  // Cuidado e Detalhe
  spray: SprayCan,
  brush: Brush,
  search: Search,
  bug: Bug,
  sofa: Sofa,
  "monitor-smartphone": MonitorSmartphone,
  bath: Bath,
  hand: Hand,
  sponge: CircleEllipsis,
  "glass-water": GlassWater,
  
  // Acessórios
  smartphone: Smartphone,
  
  // Desempenho
  "volume-2": Volume2,
  flag: Flag,
  
  // Elétrica
  battery: Battery,
  "toggle-left": ToggleLeft,
  cable: Cable,
  
  // Universal
  hammer: Hammer,
  "box-icon": BoxIcon,
  
  // Sinalética
  "alert-triangle": AlertTriangle,
  siren: Siren,
  shirt: Shirt,
  triangle: Triangle,
  "flame-kindling": FlameKindling,
  
  // Multimédia
  camera: Camera,
};

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export function CategoryIcon({ icon, className = "w-7 h-7" }: CategoryIconProps) {
  const IconComponent = iconComponents[icon];
  
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  
  // Fallback to emoji if no icon mapping found
  return <span className="text-2xl">{icon}</span>;
}

export default CategoryIcon;
