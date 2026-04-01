import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { mainCategories } from "@/data/mockData";
import { ChevronRight, MapPin, Phone, Clock, Star, Shield, Truck } from "lucide-react";
import liquiMolyBanner from "@/assets/liqui-moly-banner.png";
import logo from "@/assets/logo.png";

// Category images
import pecasImg from "@/assets/categories/pecas.png";
import lubrificantesImg from "@/assets/categories/lubrificantes.png";
import acessoriosImg from "@/assets/categories/acessorios.png";
import cuidadoDetalheImg from "@/assets/categories/cuidado-detalhe.png";
import desempenhoUpgradeImg from "@/assets/categories/desempenho-upgrade.png";
import eletricaImg from "@/assets/categories/eletrica.png";
import universalImg from "@/assets/categories/universal.png";
import sinaleticaSegurancaImg from "@/assets/categories/sinaletica-seguranca.png";

const categoryImages: Record<string, string> = {
  Peças: pecasImg,
  Lubrificantes: lubrificantesImg,
  Acessórios: acessoriosImg,
  "Cuidado e Detalhe": cuidadoDetalheImg,
  "Desempenho e Upgrade": desempenhoUpgradeImg,
  Elétrica: eletricaImg,
  Universal: universalImg,
  "Sinalética e Segurança": sinaleticaSegurancaImg,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 28,
      stiffness: 350,
    },
  },
};

const Index = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
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
    <div className="min-h-screen bg-background pb-36 relative">
      {/* Background watermark logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src="/icon.png" 
          alt="" 
          className="w-[70%] max-w-[400px] opacity-[0.03] watermark-logo"
        />
      </div>
      <Header title="Início" />

      <motion.main 
        className="container px-4 py-5 space-y-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Hero Carousel Section */}
        <motion.section 
          className="relative h-[220px] overflow-hidden rounded-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
        >
          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {[0, 1].map((index) => (
              <motion.button
                key={index}
                onClick={() => setActiveSlide(index)}
                whileTap={{ scale: 0.9 }}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeSlide === index 
                    ? "w-8 bg-primary shadow-lg shadow-primary/40" 
                    : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSlide === 0 && (
              <motion.div
                key="slide-0"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-card to-card border border-border/40">
                  {/* Refined background effects */}
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
                  <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-64 rounded-full bg-primary/5 blur-3xl" />
                  
                  <div className="relative flex items-center h-full gap-6 px-8">
                    {/* Logo */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="flex-shrink-0"
                    >
                      <div className="relative">
                        <img 
                          src={logo} 
                          alt="Segmento Positivo" 
                          className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                      </div>
                    </motion.div>
                    
                    {/* Text content */}
                    <div className="flex flex-col justify-center">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <p className="text-[10px] uppercase tracking-[0.3em] text-primary/80 font-semibold mb-1">Peças Automotivas</p>
                      </motion.div>
                      <motion.h1 
                        className="text-2xl md:text-3xl font-extrabold tracking-tight leading-none"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-foreground">SEGMENTO</span>
                        <br />
                        <span className="text-primary">POSITIVO</span>
                      </motion.h1>
                      <motion.div 
                        className="flex items-center gap-2 mt-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        {["Mercedes", "BMW", "Audi", "VW"].map((brand, i) => (
                          <span key={brand} className="text-[10px] text-muted-foreground font-medium px-2 py-0.5 rounded-full bg-secondary/80 border border-border/50">
                            {brand}
                          </span>
                        ))}
                        <span className="text-[10px] text-primary font-semibold">+ Mais</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSlide === 1 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="h-full relative overflow-hidden rounded-2xl">
                  <img
                    src={liquiMolyBanner}
                    alt="Liqui Moly - German Premium Motor Oil"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <motion.div 
                    className="absolute bottom-5 left-5"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 bg-[#e31e24] px-4 py-2 rounded-lg shadow-xl shadow-red-500/30">
                      <span className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">Distribuidor Oficial</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Trust Badges */}
        <motion.section 
          className="grid grid-cols-3 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: Truck, value: "Entrega", label: "Rápida", color: "text-blue-400" },
            { icon: Shield, value: "100%", label: "Original", color: "text-emerald-400" },
            { icon: Star, value: "500+", label: "Produtos", color: "text-amber-400" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="relative bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border/30 text-center overflow-hidden group hover:border-primary/20 transition-all duration-300"
            >
              <stat.icon className={`w-4 h-4 mx-auto mb-1.5 ${stat.color}`} />
              <p className="text-sm font-bold text-foreground leading-none">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Categories Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", damping: 28 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
            <h2 className="text-lg font-bold text-foreground">Categorias</h2>
          </div>

          <motion.div 
            className="grid grid-cols-4 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {mainCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleCategoryClick(category.label)}
                className="group flex flex-col items-center gap-2 cursor-pointer"
              >
                <motion.div 
                  className="relative w-[72px] h-[72px] rounded-2xl bg-card border border-border/50 shadow-sm flex items-center justify-center overflow-hidden p-2.5 group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/10 transition-all duration-300"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/8 group-hover:to-primary/3 transition-all duration-300" />
                  <img
                    src={categoryImages[category.label]}
                    alt={category.label}
                    className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                </motion.div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-center text-foreground/90 leading-tight font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {category.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Store Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: "spring", damping: 28 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
            <h2 className="text-lg font-bold text-foreground">Visite-nos</h2>
          </div>

          <motion.div 
            className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/40 overflow-hidden"
            whileTap={{ scale: 0.995 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="p-5 space-y-4">
              {/* Address */}
              <motion.a
                href="https://maps.google.com/?q=Rotunda Armindo Lousada n-º4C, 3400-076 Oliveira do Hospital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 group/item"
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary/20 transition-colors">
                  <MapPin className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">Morada</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Rotunda Armindo Lousada n-º4C,<br />3400-076 Oliveira do Hospital
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 ml-auto mt-2 group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all" />
              </motion.a>

              <div className="h-px bg-border/40 ml-14" />

              {/* Phone */}
              <motion.a 
                href="tel:238094280" 
                className="flex items-center gap-3.5 group/item"
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary/20 transition-colors">
                  <Phone className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">Telefone</p>
                  <p className="text-xs text-muted-foreground mt-0.5">238 094 280</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 ml-auto group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all" />
              </motion.a>

              <div className="h-px bg-border/40 ml-14" />

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-2">Horário</p>
                  <div className="space-y-1">
                    {[
                      { day: "Seg - Sex", time: "9h — 19h" },
                      { day: "Sábado", time: "9h — 13h" },
                      { day: "Domingo", time: "Fechado", closed: true },
                    ].map((schedule) => (
                      <div key={schedule.day} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{schedule.day}</span>
                        <span className={schedule.closed ? "text-primary font-medium" : "text-foreground font-medium"}>
                          {schedule.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </motion.main>

      <BottomNav />
    </div>
  );
};

export default Index;
