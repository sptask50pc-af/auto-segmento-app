import { ChevronRight, Percent } from "lucide-react";
import { Link } from "react-router-dom";

export function PromoBanner() {
  return (
    <Link to="/promotions">
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-secondary border border-border/50 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20 active:scale-[0.98]">
        {/* Animated background glow */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-3xl transition-all duration-500 group-hover:bg-primary/25 group-hover:scale-125" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/20" />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary border border-primary/20 transition-all duration-300 group-hover:from-primary/40 group-hover:to-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30">
              <Percent className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary text-glow">Promoções</h3>
              <p className="text-sm text-muted-foreground">Ofertas imperdíveis</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 transition-all duration-300 group-hover:bg-primary/20">
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </div>
      </div>
    </Link>
  );
}
