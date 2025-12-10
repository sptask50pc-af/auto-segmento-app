import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BrandCardProps {
  name: string;
  logo: string;
  variant?: "square" | "circle";
  href?: string;
  delay?: number;
}

export function BrandCard({ name, logo, variant = "circle", href = "#", delay = 0 }: BrandCardProps) {
  const content = (
    <div
      className="animate-scale-in flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          "flex items-center justify-center text-2xl transition-all",
          variant === "circle"
            ? "h-16 w-16 rounded-full bg-secondary hover:bg-muted"
            : "h-16 w-16 rounded-xl bg-secondary hover:bg-muted"
        )}
      >
        {logo}
      </div>
      <span className="text-sm font-medium text-muted-foreground">{name}</span>
    </div>
  );

  if (href && href !== "#") {
    return <Link to={href}>{content}</Link>;
  }

  return content;
}
