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
        className="animate-slide-up group flex items-center justify-between rounded-xl bg-card p-4 transition-all hover:bg-secondary active:scale-[0.98]"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-xl group-hover:bg-muted">
            {icon}
          </div>
          <span className="font-medium">{label}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
