import { Edit2, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  delay?: number;
}

export function ProductCard({ product, onEdit, onDelete, showActions = false, delay = 0 }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div
      className="animate-slide-up group relative overflow-hidden rounded-xl bg-card p-4 transition-all hover:bg-secondary/50"
      style={{ animationDelay: `${delay}ms` }}
    >
      {hasDiscount && (
        <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground">
          -{discountPercent}%
        </Badge>
      )}

      <div className="mb-3 flex h-20 w-full items-center justify-center rounded-lg bg-secondary text-4xl">
        {product.image}
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="font-semibold leading-tight line-clamp-2">{product.name}</h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {product.originalPrice!.toFixed(2)}
            </span>
          )}
        </div>

        <Badge
          variant={product.inStock ? "default" : "secondary"}
          className={cn(
            "text-xs",
            product.inStock
              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              : "bg-muted text-muted-foreground"
          )}
        >
          {product.inStock ? "Em estoque" : "Indisponível"}
        </Badge>
      </div>

      {showActions && (
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            onClick={() => onEdit?.(product)}
          >
            <Edit2 className="mr-1 h-4 w-4" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete?.(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
