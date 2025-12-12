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

// Map scraped category names to app category names (case-insensitive matching)
const CATEGORY_MAPPING: Record<string, string> = {
  // Óleos de Motor
  "oleos de motor": "Óleos de Motor",
  "óleos de motor": "Óleos de Motor",
  
  // Óleos de Transmissão & Diferencial
  "oleos de transmissao diferencial": "Óleos de Transmissão & Diferencial",
  "óleos de transmissão & diferencial": "Óleos de Transmissão & Diferencial",
  "oleos de transmissao & diferencial": "Óleos de Transmissão & Diferencial",
  
  // Óleos Hidráulicos & Direção Assistida
  "oleos hidraulicos direcao assistida": "Óleos Hidráulicos & Direção Assistida",
  "óleos hidráulicos & direção assistida": "Óleos Hidráulicos & Direção Assistida",
  "oleos hidraulicos & direcao assistida": "Óleos Hidráulicos & Direção Assistida",
  
  // Óleos Especiais
  "oleos especiais outros": "Óleos Especiais",
  "óleos especiais": "Óleos Especiais",
  "oleos especiais": "Óleos Especiais",
  
  // Líquidos de Travões
  "liquidos de travoes": "Líquidos de Travões",
  "líquidos de travões": "Líquidos de Travões",
  
  // Líquidos de Arrefecimento
  "liquidos de arrefecimento anticongelante": "Líquidos de Arrefecimento",
  "líquidos de arrefecimento": "Líquidos de Arrefecimento",
  "liquidos de arrefecimento": "Líquidos de Arrefecimento",
  
  // Aditivos
  "aditivos de oleo": "Aditivos de Óleo",
  "aditivos de óleo": "Aditivos de Óleo",
  "aditivos de combustivel": "Aditivos de Combustível",
  "aditivos de combustível": "Aditivos de Combustível",
  
  // Cuidado e Detalhe
  "shampoos & limpeza": "Shampoos & Limpeza",
  "shampoos limpeza": "Shampoos & Limpeza",
  "ceras & selantes": "Ceras & Selantes",
  "ceras selantes": "Ceras & Selantes",
  "polimento & correção": "Polimento & Correção",
  "polimento correcao": "Polimento & Correção",
  "polimento & correcao": "Polimento & Correção",
  "exterior": "Exterior",
  "exterior ": "Exterior",
  "interiores": "Interiores",
  "vidros & espelhos": "Vidros & Espelhos",
  "vidros espelhos": "Vidros & Espelhos",
  "panos & acessórios": "Panos & Acessórios",
  "panos acessorios": "Panos & Acessórios",
  "panos & acessorios": "Panos & Acessórios",
  "odorizantes": "Odorizantes",
  "cuidado e detalhe": "Cuidado e Detalhe",
  
  // Outros
  "colas & selantes": "Colas & Selantes",
  "colas selantes": "Colas & Selantes",
  "sprays": "Sprays & Manutenção",
  "sprays & manutenção": "Sprays & Manutenção",
  "sprays manutencao": "Sprays & Manutenção",
  "sprays & manutencao": "Sprays & Manutenção",
  "baterias": "Baterias",
  "universal": "Universal",
  "iluminação & lâmpadas": "Iluminação & Lâmpadas",
  "iluminacao lampadas": "Iluminação & Lâmpadas",
  "iluminacao & lampadas": "Iluminação & Lâmpadas",
};

function normalizeCategory(scrapedCategory: string): string {
  const normalized = scrapedCategory.toLowerCase().trim();
  return CATEGORY_MAPPING[normalized] || scrapedCategory;
}

const Admin = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct, deleteAllProducts } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState({ current: 0, total: 0, status: '' });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso.",
    });
  };

  const handleSubmit = async (productData: Omit<Product, "id">) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas.",
      });
    } else {
      await addProduct(productData);
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
    setUpdateProgress({ current: 0, total: 5, status: 'A carregar categorias...' });

    try {
      const { data, error } = await supabase.functions.invoke('scrape-products');
      
      if (error) {
        throw error;
      }

      setUpdateProgress({ current: 3, total: 5, status: 'A processar produtos...' });

      if (data?.success && data.products?.length > 0) {
        let newCount = 0;
        let updatedCount = 0;
        const totalProducts = data.products.length;

        for (let i = 0; i < data.products.length; i++) {
          const scrapedProduct = data.products[i];
          const normalizedCategory = normalizeCategory(scrapedProduct.category);
          
          if (i % 10 === 0) {
            setUpdateProgress({ 
              current: 3 + Math.floor((i / totalProducts) * 2), 
              total: 5, 
              status: `A processar ${i + 1}/${totalProducts} produtos...` 
            });
          }
          
          const existingProduct = products.find(
            p => (p.sourceUrl && p.sourceUrl === scrapedProduct.sourceUrl) ||
                 p.name.toLowerCase().trim() === scrapedProduct.name.toLowerCase().trim()
          );

          if (existingProduct) {
            const hasChanges = existingProduct.price !== scrapedProduct.price || 
                existingProduct.name !== scrapedProduct.name ||
                existingProduct.category !== normalizedCategory ||
                existingProduct.image !== scrapedProduct.image;
            
            if (hasChanges) {
              updateProduct(existingProduct.id, {
                price: scrapedProduct.price,
                name: scrapedProduct.name,
                category: normalizedCategory,
                image: scrapedProduct.image,
                inStock: scrapedProduct.inStock,
                sourceUrl: scrapedProduct.sourceUrl,
              });
              updatedCount++;
            }
          } else {
            addProduct({
              name: scrapedProduct.name,
              brand: scrapedProduct.brand,
              category: normalizedCategory,
              price: scrapedProduct.price,
              image: scrapedProduct.image,
              inStock: scrapedProduct.inStock,
              sourceUrl: scrapedProduct.sourceUrl,
              description: '',
            });
            newCount++;
          }
        }

        setUpdateProgress({ current: 5, total: 5, status: 'Concluído!' });
        toast({
          title: "Atualização concluída",
          description: `${newCount} novos produtos, ${updatedCount} atualizados de ${totalProducts} encontrados.`,
        });
      } else {
        toast({
          title: "Sem produtos",
          description: data?.error || "Não foram encontrados produtos.",
          variant: "destructive",
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
      setTimeout(() => setUpdateProgress({ current: 0, total: 0, status: '' }), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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

        {/* Progress Indicator */}
        {isUpdating && updateProgress.total > 0 && (
          <div className="rounded-xl bg-card p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{updateProgress.status}</span>
              <span className="font-medium">{updateProgress.current}/{updateProgress.total}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(updateProgress.current / updateProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

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
          <Button 
            onClick={async () => {
              await deleteAllProducts();
              toast({
                title: "Reset concluído",
                description: "Todos os produtos foram removidos.",
              });
            }} 
            variant="destructive"
            className="gap-2"
          >
            Reset
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
