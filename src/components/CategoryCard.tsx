import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface CategoryCardProps {
  label: string;
  icon: string;
  href?: string;
  delay?: number;
}

export function CategoryCard({ label, icon, href = "/products", delay = 0 }: CategoryCardProps) {
  return (
    <Link to={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          delay: delay * 0.001 
        }}
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -2 }}
        className="group relative flex items-center justify-between rounded-xl bg-card border border-border/50 p-4 transition-colors hover:border-primary/40 overflow-hidden"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-center gap-3">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-muted text-xl transition-all duration-300 group-hover:from-primary/20 group-hover:to-primary/10"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {icon}
          </motion.div>
          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{label}</span>
        </div>
        <motion.div
          animate={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <ChevronRight className="relative h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </motion.div>
      </motion.div>
    </Link>
  );
}
