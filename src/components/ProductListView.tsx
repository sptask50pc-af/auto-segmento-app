import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { Product } from "@/types/product";
import { useProducts } from "@/context/ProductContext";
import { ChevronLeft } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface ProductListViewProps {
  categoryName: string;
  products: Product[];
  backPath: string;
}

export function ProductListView({ categoryName, products, backPath }: ProductListViewProps) {
  const navigate = useNavigate();
  const { deleteProduct } = useProducts();
  const { toast } = useToast();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteProduct(deleteConfirmId);
    setDeleteConfirmId(null);
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso.",
    });
  };

  // Reset filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={categoryName} />

      <main className="container px-4 py-6 space-y-6">
        {/* Hero Section */}
        <section className="relative h-[100px] overflow-hidden rounded-2xl animate-fade-in">
          <div className="h-full relative overflow-hidden rounded-2xl p-4 border bg-gradient-to-br from-primary/20 via-card to-card border-primary/20">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl bg-primary/20" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full blur-2xl bg-primary/10" />
            <div className="relative flex items-center justify-between h-full">
              <div>
                <h1 className="text-xl font-bold mb-1 text-foreground">{categoryName}</h1>
                <p className="text-xs text-muted-foreground">
                  {products.length} {products.length === 1 ? 'produto' : 'produtos'}
                </p>
              </div>
              <img 
                src="/icon.png" 
                alt="Segmento Positivo" 
                className="w-14 h-14 rounded-xl shadow-lg shadow-primary/20"
              />
            </div>
          </div>
        </section>

        {/* Back button and filters */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl bg-muted/50 border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all duration-300 min-h-[48px] active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          
          {products.length > 0 && (
            <ProductFilters 
              products={products} 
              onFilterChange={setFilteredProducts} 
            />
          )}
        </div>

        {/* Results count */}
        {products.length > 0 && filteredProducts.length !== products.length && (
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} de {products.length} produtos
          </p>
        )}

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                delay={i * 50}
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto corresponde aos filtros selecionados.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
            <p className="text-sm text-muted-foreground mt-2">Use o botão "Update" na página Admin para importar produtos.</p>
          </div>
        )}
      </main>

      <BottomNav />

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja remover este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted/50 border border-border text-muted-foreground">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive/10 border border-destructive/30 hover:border-destructive/60 text-destructive"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
