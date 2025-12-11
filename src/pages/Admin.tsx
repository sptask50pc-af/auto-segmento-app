import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Package, RefreshCw } from "lucide-react";
import { Product } from "@/types/product";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso.",
    });
  };

  const handleSubmit = (productData: Omit<Product, "id">) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas.",
      });
    } else {
      addProduct(productData);
      toast({
        title: "Produto adicionado",
        description: "O novo produto foi adicionado ao catálogo.",
      });
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleUpdateFromWebsite = async () => {
    setIsUpdating(true);
    toast({
      title: "A atualizar...",
      description: "A verificar produtos em segmentopositivo.pt",
    });

    try {
      const { data, error } = await supabase.functions.invoke('scrape-products');
      
      if (error) {
        throw error;
      }

      if (data?.success && data.products?.length > 0) {
        let newCount = 0;
        let updatedCount = 0;

        for (const scrapedProduct of data.products) {
          // Check if product already exists (by name)
          const existingProduct = products.find(
            p => p.name.toLowerCase() === scrapedProduct.name.toLowerCase()
          );

          if (existingProduct) {
            // Check if price, name, or category changed
            if (existingProduct.price !== scrapedProduct.price || 
                existingProduct.name !== scrapedProduct.name ||
                existingProduct.category !== scrapedProduct.category) {
              updateProduct(existingProduct.id, {
                price: scrapedProduct.price,
                name: scrapedProduct.name,
                category: scrapedProduct.category,
                inStock: scrapedProduct.inStock,
              });
              updatedCount++;
            }
          } else {
            // Add new product
            addProduct({
              name: scrapedProduct.name,
              brand: scrapedProduct.brand,
              category: scrapedProduct.category,
              price: scrapedProduct.price,
              image: scrapedProduct.image,
              inStock: scrapedProduct.inStock,
              description: '',
            });
            newCount++;
          }
        }

        toast({
          title: "Atualização concluída",
          description: `${newCount} novos produtos, ${updatedCount} atualizados.`,
        });
      } else {
        toast({
          title: "Sem novos produtos",
          description: "Não foram encontrados produtos novos.",
        });
      }
    } catch (error) {
      console.error('Error updating from website:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar produtos do website.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Admin" />

      <main className="container px-4 py-6 space-y-6">
        {/* Stats Banner */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs text-muted-foreground">Produtos</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                ✓
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {products.filter((p) => p.inStock).length}
                </p>
                <p className="text-xs text-muted-foreground">Em estoque</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleAddNew} className="flex-1 gap-2">
            <Plus className="h-5 w-5" />
            Adicionar
          </Button>
          <Button 
            onClick={handleUpdateFromWebsite} 
            variant="secondary"
            className="flex-1 gap-2"
            disabled={isUpdating}
          >
            <RefreshCw className={`h-5 w-5 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'A atualizar...' : 'Update'}
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              showActions
              onEdit={handleEdit}
              onDelete={handleDelete}
              delay={i * 50}
            />
          ))}
        </div>
      </main>

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Admin;
