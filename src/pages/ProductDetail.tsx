import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, ShoppingCart, Plus, Minus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, refetch } = useProducts();
  const { addToCart } = useCart();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSyncingPrice, setIsSyncingPrice] = useState(false);
  const { toast } = useToast();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-semibold mb-2">Produto não encontrado</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Find similar products (same category, excluding current product)
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 10);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Adicionado ao carrinho",
      description: `${quantity}x ${product.name}`,
    });
    setQuantity(1);
  };

  const handleSyncPrice = async () => {
    if (!product.reference) {
      toast({
        title: "Sem referência",
        description: "Este produto não tem referência para sincronizar.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncingPrice(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-prices', {
        body: { reference: product.reference }
      });

      if (error || !data?.success) {
        const msg = data?.error || 'Falha ao sincronizar preço.';
        toast({ title: "Erro", description: msg, variant: "destructive" });
        return;
      }

      await refetch();
      
      if (data.product?.priceChanged) {
        toast({
          title: "Preço atualizado",
          description: `${data.product.oldPrice.toFixed(2)}€ → ${data.product.newPrice.toFixed(2)}€`,
        });
      } else {
        toast({
          title: "Preço atual",
          description: "O preço já está atualizado.",
        });
      }
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao sincronizar preço.", variant: "destructive" });
    } finally {
      setIsSyncingPrice(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-primary/30">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold truncate">Detalhes do Produto</h1>
        </div>
      </header>

      {/* Product Image */}
      <div className="relative bg-secondary/30 flex items-center justify-center p-8 min-h-[300px]">
        {hasDiscount && (
          <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground text-lg px-3 py-1">
            -{discountPercent}%
          </Badge>
        )}
        {product.image && product.image !== '/placeholder.svg' ? (
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[280px] max-w-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <Package className="h-32 w-32 text-muted-foreground" />
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-6">
        {/* Category Badge */}
        <Badge variant="secondary" className="text-sm">
          {product.category}
        </Badge>

        {/* Name, Brand & Reference */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
          <h2 className="text-2xl font-bold leading-tight">{product.name}</h2>

          {product.reference && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Referência:</span>
              <span className="font-medium text-foreground">{product.reference}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">
            €{product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xl text-muted-foreground line-through">
              €{product.originalPrice!.toFixed(2)}
            </span>
          )}
          {product.reference && (
            <Button
              size="sm"
              variant="outline"
              className="ml-auto"
              disabled={isSyncingPrice}
              onClick={handleSyncPrice}
            >
              <RefreshCw className={cn("h-4 w-4 mr-1", isSyncingPrice && "animate-spin")} />
              {isSyncingPrice ? "A sincronizar..." : "Atualizar Preço"}
            </Button>
          )}
        </div>

        {/* Stock Status */}
        <Badge
          variant={product.inStock ? "default" : "secondary"}
          className={cn(
            "text-sm px-4 py-1",
            product.inStock
              ? "bg-green-500/20 text-green-400"
              : "bg-muted text-muted-foreground"
          )}
        >
          {product.inStock ? "Em estoque" : "Indisponível"}
        </Badge>

        {/* Add to Cart */}
        {product.inStock && (
          <div className="pt-4 border-t border-border space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantidade:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Adicionar ao Carrinho
            </Button>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="pt-4 border-t border-border">
            <h3 className="font-semibold mb-2">Descrição</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
        )}
      </div>

      {/* Similar Products Slider */}
      {similarProducts.length > 0 && (
        <div className="px-6 pb-8">
          <h3 className="text-lg font-semibold mb-4">Produtos Similares</h3>
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {similarProducts.map((similarProduct, index) => (
              <div
                key={similarProduct.id}
                className="min-w-[200px] max-w-[200px] snap-start"
              >
                <ProductCard product={similarProduct} delay={index * 50} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
