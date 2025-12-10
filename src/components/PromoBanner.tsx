import { ChevronRight, Percent } from "lucide-react";
import { Link } from "react-router-dom";

export function PromoBanner() {
  return (
    <Link to="/promotions">
      <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-card to-secondary p-5 transition-all hover:scale-[1.02] active:scale-[0.98]">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/5 blur-xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Percent className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Promoções</h3>
              <p className="text-sm text-muted-foreground">Ofertas imperdíveis</p>
            </div>
          </div>
          <ChevronRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
