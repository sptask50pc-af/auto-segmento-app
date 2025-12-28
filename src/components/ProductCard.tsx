import { Edit2, Trash2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        damping: 25, 
        stiffness: 300,
        delay: delay * 0.001 
      }}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card border border-border/50 p-4 transition-colors hover:border-primary/40",
        !showActions && "cursor-pointer"
      )}
      onClick={handleClick}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {hasDiscount && (
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, delay: delay * 0.001 + 0.1 }}
        >
          <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground z-10 shadow-lg shadow-primary/30">
            -{discountPercent}%
          </Badge>
        </motion.div>
      )}

      <motion.div 
        className="relative mb-3 flex h-24 w-full items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-muted/50 overflow-hidden border border-border/30 group-hover:border-primary/20 transition-colors"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {product.image && product.image !== '/placeholder.svg' ? (
          <motion.img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-contain p-2"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </motion.div>

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

        {/* Quick Add to Cart */}
        {!showActions && product.inStock && (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              className="w-full mt-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Adicionar
            </Button>
          </motion.div>
        )}
      </div>

      {showActions && (
        <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => onEdit?.(product)}
            >
              <Edit2 className="mr-1 h-4 w-4" />
              Editar
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete?.(product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
