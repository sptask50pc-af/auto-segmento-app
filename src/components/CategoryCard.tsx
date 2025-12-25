import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  label: string;
  icon: string;
  href?: string;
  delay?: number;
}

export function CategoryCard({ label, icon, href = "/products", delay = 0 }: CategoryCardProps) {
  return (
    <Link to={href}>
      <div
        className="animate-slide-up group relative flex items-center justify-between rounded-xl bg-card border border-border/50 p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-muted text-xl transition-all duration-300 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:shadow-md group-hover:shadow-primary/20">
            {icon}
          </div>
          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{label}</span>
        </div>
        <ChevronRight className="relative h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
      </div>
    </Link>
  );
}
