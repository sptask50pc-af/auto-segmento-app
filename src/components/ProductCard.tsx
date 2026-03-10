import { Edit2, Trash2, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  delay?: number;
}

export function ProductCard({ product, onEdit, onDelete, showActions = false, delay = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleClick = () => {
    if (!showActions) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast({
      title: "Adicionado ao carrinho",
      description: product.name,
    });
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card border border-border/40 p-3.5 transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] animate-fade-in",
        !showActions && "cursor-pointer"
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
    >
      {hasDiscount && (
        <Badge className="absolute right-2.5 top-2.5 bg-primary text-primary-foreground z-10 text-[10px] font-bold px-1.5 py-0.5 animate-scale-in">
          -{discountPercent}%
        </Badge>
      )}

      <div className="relative mb-3 flex h-24 w-full items-center justify-center rounded-lg bg-secondary/50 overflow-hidden border border-border/20 group-hover:border-primary/15 transition-all duration-300">
        {product.image && product.image !== '/placeholder.svg' ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-contain p-2 transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{product.brand}</p>
            {product.reference && (
              <p className="text-xs font-mono text-primary/70">R: {product.reference}</p>
            )}
          </div>
          <h3 className="font-semibold leading-tight line-clamp-2">{product.name}</h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            €{product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              €{product.originalPrice!.toFixed(2)}
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

        {/* Quick Add to Cart & Delete */}
        {!showActions && (
          <div className="flex gap-2 mt-2">
            {product.inStock && (
              <Button
                size="sm"
                className="flex-1 active:scale-95 transition-transform"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              className="active:scale-95 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(product.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {showActions && (
        <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 active:scale-95 transition-transform"
            onClick={() => onEdit?.(product)}
          >
            <Edit2 className="mr-1 h-4 w-4" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="active:scale-95 transition-transform"
            onClick={() => onDelete?.(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
