import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const brands = ["Mercedes", "BMW", "Audi", "VW", "+ Mais"];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Animated background layers */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Primary glow */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/12 blur-[80px]"
            />
            {/* Secondary glow orbit */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/8 blur-[60px]"
            />
            {/* Radial lines */}
            <motion.div
              initial={{ opacity: 0, rotate: -30 }}
              animate={{ opacity: 0.04, rotate: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-conic-gradient(from 0deg, transparent 0deg, transparent 8deg, hsl(var(--primary)) 8deg, hsl(var(--primary)) 8.5deg)`,
              }}
            />
          </div>

          {/* Logo with ring animation */}
          <div className="relative z-10">
            {/* Outer ring */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -inset-5 rounded-full border border-primary/20"
            />
            {/* Inner ring with pulse */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -inset-3 rounded-full border border-primary/10 animate-pulse-glow"
            />
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={logo}
                alt="Segmento Positivo"
                className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              />
            </motion.div>
          </div>

          {/* Brand name with staggered letters */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-8 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="text-foreground">SEGMENTO</span>{" "}
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
              >
                POSITIVO
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-2.5 text-sm text-muted-foreground tracking-widest uppercase"
            >
              Peças Automotivas Premium
            </motion.p>
          </motion.div>

          {/* Car brands with stagger */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="relative z-10 mt-6 flex items-center gap-1"
          >
            {brands.map((brand, i) => (
              <motion.span
                key={brand}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + i * 0.08, ease: "easeOut" }}
                className="flex items-center"
              >
                {i > 0 && (
                  <span className="mx-2 text-primary text-xs">•</span>
                )}
                <span className="text-xs md:text-sm text-foreground/70 font-medium tracking-wide">
                  {brand}
                </span>
              </motion.span>
            ))}
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            className="relative z-10 mt-14 w-32"
          >
            <div className="h-[3px] w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
