import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { mainCategories } from "@/data/mockData";
import { ChevronRight, MapPin, Phone, Clock, Sparkles } from "lucide-react";
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
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
    },
  },
};

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
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Background watermark logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src="/icon.png" 
          alt="" 
          className="w-[70%] max-w-[400px] opacity-[0.03]"
        />
      </div>
      <Header title="Início" />

      <motion.main 
        className="container px-4 py-6 space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hero Carousel Section */}
        <motion.section 
          className="relative h-[200px] overflow-hidden rounded-2xl shadow-2xl shadow-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {[0, 1].map((index) => (
              <motion.button
                key={index}
                onClick={() => setActiveSlide(index)}
                whileTap={{ scale: 0.9 }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeSlide === index ? "w-8 bg-primary shadow-lg shadow-primary/50" : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSlide === 0 && (
              <motion.div
                key="slide-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute inset-0"
              >
                <div className="h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card p-6 border border-primary/30">
                  {/* Background glow effects */}
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/25 blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/15 blur-xl" />
                  
                  <div className="relative flex items-center h-full gap-5">
                    {/* Logo */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="flex-shrink-0"
                    >
                      <img 
                        src={logo} 
                        alt="Segmento Positivo" 
                        className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-lg"
                      />
                    </motion.div>
                    
                    {/* Text content */}
                    <div className="flex flex-col justify-center">
                      <motion.h1 
                        className="text-xl md:text-2xl font-bold tracking-tight"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-foreground">SEGMENTO</span>{" "}
                        <span className="text-primary">POSITIVO</span>
                      </motion.h1>
                      <motion.p 
                        className="text-sm text-muted-foreground mt-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Peças Automotivas Premium
                      </motion.p>
                      <motion.p 
                        className="text-xs text-muted-foreground/70 mt-2 tracking-wide"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <span className="text-foreground/70 font-medium">Mercedes</span>
                        <span className="mx-1.5 text-primary">•</span>
                        <span className="text-foreground/70 font-medium">BMW</span>
                        <span className="mx-1.5 text-primary">•</span>
                        <span className="text-foreground/70 font-medium">Audi</span>
                        <span className="mx-1.5 text-primary">•</span>
                        <span className="text-foreground/70 font-medium">VW</span>
                        <span className="mx-1.5 text-primary">•</span>
                        <span className="text-foreground/70 font-medium">+ Mais</span>
                      </motion.p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSlide === 1 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute inset-0"
              >
                <div className="h-full relative overflow-hidden rounded-2xl">
                  <img
                    src={liquiMolyBanner}
                    alt="Liqui Moly - German Premium Motor Oil"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                  <motion.div 
                    className="absolute bottom-4 left-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 bg-[#e31e24] px-4 py-2 rounded-full shadow-xl shadow-red-500/30">
                      <span className="text-xs font-bold text-white tracking-wider uppercase">Distribuidor Oficial</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Principais categorias */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", damping: 25 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
              <span className="w-1.5 h-7 bg-gradient-to-b from-primary to-primary/50 rounded-full shadow-lg shadow-primary/30" />
              Principais categorias
            </h2>
          </div>

          <motion.div 
            className="grid grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {mainCategories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(category.label)}
                className="group flex flex-col items-center gap-2.5 cursor-pointer"
              >
                <motion.div 
                  className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-secondary backdrop-blur border-2 border-border/60 shadow-lg shadow-background/50 flex items-center justify-center overflow-hidden p-2"
                  whileHover={{ scale: 1.05, borderColor: "hsl(var(--primary) / 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.img
                    src={categoryImages[category.label]}
                    alt={category.label}
                    className="w-full h-full object-contain relative z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  />
                </motion.div>
                <span className="text-xs text-center text-foreground leading-tight group-hover:text-primary transition-colors font-bold">
                  {category.label}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground -mt-1 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section 
          className="grid grid-cols-3 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { value: "500+", label: "Produtos", highlight: true },
            { value: "24h", label: "Entrega", highlight: false },
            { value: "100%", label: "Original", highlight: false },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileTap={{ scale: 0.97 }}
              className="relative bg-card/90 backdrop-blur rounded-2xl p-4 border border-border/50 text-center overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className={`text-2xl font-bold relative ${stat.highlight ? "text-primary" : "text-foreground"}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground relative">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Store Details Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", damping: 25 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
              <span className="w-1.5 h-7 bg-gradient-to-b from-primary to-primary/50 rounded-full shadow-lg shadow-primary/30" />
              Visite-nos
            </h2>
          </div>

          <motion.div 
            className="relative bg-card/90 backdrop-blur rounded-2xl border border-border/50 overflow-hidden"
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
            
            <div className="relative p-6 space-y-5">
              {/* Address */}
              <motion.a
                href="https://maps.google.com/?q=Rotunda Armindo Lousada n-º4C, 3400-076 Oliveira do Hospital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group/item"
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <MapPin className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">
                    Morada
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Rotunda Armindo Lousada n-º4C,
                    <br />
                    3400-076 Oliveira do Hospital
                  </p>
                </div>
              </motion.a>

              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Phone */}
              <motion.a 
                href="tel:238094280" 
                className="flex items-center gap-4 group/item"
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Phone className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">
                    Telefone
                  </p>
                  <p className="text-sm text-muted-foreground">238 094 280</p>
                </div>
              </motion.a>

              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-2">Horário</p>
                  <motion.div 
                    className="space-y-1.5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[
                      { day: "Segunda a Sexta:", time: "9h às 19h" },
                      { day: "Sábado:", time: "9h às 13h" },
                      { day: "Domingo:", time: "Fechado", closed: true },
                    ].map((schedule, index) => (
                      <motion.p 
                        key={schedule.day}
                        variants={itemVariants}
                        className="text-sm text-muted-foreground"
                      >
                        <span className="text-foreground font-medium">{schedule.day}</span>{" "}
                        <span className={schedule.closed ? "text-primary font-medium" : ""}>{schedule.time}</span>
                      </motion.p>
                    ))}
                  </motion.div>
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
