import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Package } from "lucide-react";
import { Product } from "@/types/product";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

        {/* Add Button */}
        <Button onClick={handleAddNew} className="w-full gap-2">
          <Plus className="h-5 w-5" />
          Adicionar Produto
        </Button>

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
