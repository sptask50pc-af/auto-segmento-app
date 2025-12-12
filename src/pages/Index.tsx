import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { mainCategories } from "@/data/mockData";
import { CategoryIcon } from "@/components/CategoryIcon";
import { 
  ChevronRight, 
  MapPin, 
  Phone, 
  Clock,
  Sparkles
} from "lucide-react";
import liquiMolyLogo from "@/assets/liqui-moly-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-rotate slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (label: string) => {
    if (label === "Peças") navigate("/subcategories/pecas");
    else if (label === "Lubrificantes") navigate("/subcategories/lubrificantes");
    else if (label === "Acessórios") navigate("/subcategories/acessorios");
    else if (label === "Cuidado e Detalhe") navigate("/subcategories/cuidado-detalhe");
    else if (label === "Desempenho e Upgrade") navigate("/subcategories/desempenho-upgrade");
    else if (label === "Elétrica") navigate("/subcategories/eletrica");
    else if (label === "Universal") navigate("/subcategories/universal");
    else if (label === "Sinalética e Segurança") navigate("/subcategories/sinaletica-seguranca");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Início" />

      <main className="container px-4 py-6 space-y-8">
        {/* Hero Carousel Section */}
        <section className="relative h-[180px] overflow-hidden rounded-2xl">
          {/* Slide Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {[0, 1].map((index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === index ? "w-6 bg-primary" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Slide 1: Welcome */}
          <div
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              activeSlide === 0
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full"
            }`}
          >
            <div className="h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card p-6 border border-primary/20">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Peças Premium</span>
                </div>
                <h1 className="text-xl font-bold text-foreground mb-1">
                  Bem-vindo ao Segmento Positivo
                </h1>
                <p className="text-muted-foreground text-sm">
                  Explore as melhores peças automotivas
                </p>
              </div>
            </div>
          </div>

          {/* Slide 2: Liqui Moly Advertisement */}
          <div
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              activeSlide === 1
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div className="h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-6 border border-[#e31e24]/30 shadow-2xl shadow-[#e31e24]/10">
              {/* Premium glow effects */}
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#e31e24]/30 blur-3xl animate-pulse" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#e31e24]/20 blur-2xl" />
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#e31e24]/5 to-transparent" />
              
              <div className="relative flex items-center justify-between h-full">
                <div className="flex-1">
                  {/* Liqui Moly Badge */}
                  <div className="inline-flex items-center gap-2 mb-2 bg-[#e31e24] px-3 py-1 rounded-full">
                    <span className="text-[10px] font-bold text-white tracking-wider uppercase">Distribuidor Oficial</span>
                  </div>
                  
                  {/* Tagline */}
                  <p className="text-white text-sm font-semibold mb-2">
                    Tecnologia Alemã Premium
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-semibold text-[#e31e24] bg-[#e31e24]/10 px-2 py-1 rounded-md border border-[#e31e24]/20">
                      🇩🇪 Made in Germany
                    </span>
                    <span className="text-[10px] font-semibold text-white/70 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                      Óleos Premium
                    </span>
                  </div>
                </div>
                
                {/* Liqui Moly Logo */}
                <div className="flex-shrink-0 ml-4">
                  <img 
                    src={liquiMolyLogo} 
                    alt="Liqui Moly" 
                    className="w-24 h-auto rounded-lg shadow-lg shadow-[#e31e24]/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Principais categorias */}
        <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Principais categorias
            </h2>
          </div>
          
          {/* Grid of main categories */}
          <div className="grid grid-cols-4 gap-4">
            {mainCategories.map((category, index) => {
              const hasSubCategories = true;
              
              return (
                <div
                  key={category.id}
                  onClick={() => hasSubCategories && handleCategoryClick(category.label)}
                  className="group flex flex-col items-center gap-2 cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-card via-secondary to-card border border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-xl group-hover:shadow-primary/25 group-hover:scale-105 group-active:scale-95 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 text-primary/80 group-hover:text-primary transition-colors duration-300 group-hover:scale-110 transform">
                      <CategoryIcon icon={category.icon} />
                    </div>
                  </div>
                  <span className="text-xs text-center text-muted-foreground leading-tight group-hover:text-foreground transition-colors font-medium">
                    {category.label}
                  </span>
                  {hasSubCategories && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground -mt-1 group-hover:text-primary transition-colors" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="animate-slide-up grid grid-cols-3 gap-3" style={{ animationDelay: "200ms" }}>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-primary">500+</p>
            <p className="text-xs text-muted-foreground">Produtos</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-foreground">24h</p>
            <p className="text-xs text-muted-foreground">Entrega</p>
          </div>
          <div className="bg-card/80 backdrop-blur rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Original</p>
          </div>
        </section>

        {/* Store Details Section */}
        <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Visite-nos
            </h2>
          </div>
          
          <div className="bg-card/80 backdrop-blur rounded-2xl border border-border overflow-hidden">
            <div className="p-5 space-y-4">
              {/* Address */}
              <a 
                href="https://maps.google.com/?q=Rotunda Armindo Lousada n-º4C, 3400-076 Oliveira do Hospital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Morada</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Rotunda Armindo Lousada n-º4C,<br />
                    3400-076 Oliveira do Hospital
                  </p>
                </div>
              </a>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Phone */}
              <a 
                href="tel:238094280"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Telefone</p>
                  <p className="text-sm text-muted-foreground">238 094 280</p>
                </div>
              </a>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Hours */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Horário</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary font-medium">Fechado</span> · Abre às 9h Sábado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
