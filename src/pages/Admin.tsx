import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Package, RefreshCw, Search, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Product } from "@/types/product";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScrapeSummary {
  total: number;
  inserted: number;
  updated: number;
  failed: number;
}

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
  const { products, loading, addProduct, updateProduct, deleteProduct, deleteAllProducts, refetch } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState({ current: 0, total: 0, status: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [scrapeSummary, setScrapeSummary] = useState<ScrapeSummary>({ total: 0, inserted: 0, updated: 0, failed: 0 });

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.reference?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);
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
    const summary: ScrapeSummary = { total: 0, inserted: 0, updated: 0, failed: 0 };

    try {
      const { data, error } = await supabase.functions.invoke('scrape-products');
      
      if (error) {
        throw error;
      }

      setUpdateProgress({ current: 3, total: 5, status: 'A processar produtos...' });

      if (data?.success && data.products?.length > 0) {
        summary.total = data.products.length;

        for (let i = 0; i < data.products.length; i++) {
          const scrapedProduct = data.products[i];
          const normalizedCategory = normalizeCategory(scrapedProduct.category);
          
          if (i % 10 === 0) {
            setUpdateProgress({ 
              current: 3 + Math.floor((i / summary.total) * 2), 
              total: 5, 
              status: `A processar ${i + 1}/${summary.total} produtos...` 
            });
          }
          
          try {
            const existingProduct = products.find(
              p => (p.sourceUrl && p.sourceUrl === scrapedProduct.sourceUrl) ||
                   p.name.toLowerCase().trim() === scrapedProduct.name.toLowerCase().trim()
            );

            if (existingProduct) {
              const hasChanges = existingProduct.price !== scrapedProduct.price || 
                  existingProduct.name !== scrapedProduct.name ||
                  existingProduct.category !== normalizedCategory ||
                  existingProduct.image !== scrapedProduct.image ||
                  existingProduct.reference !== scrapedProduct.reference;
              
              if (hasChanges) {
                await updateProduct(existingProduct.id, {
                  price: scrapedProduct.price,
                  name: scrapedProduct.name,
                  category: normalizedCategory,
                  image: scrapedProduct.image,
                  inStock: scrapedProduct.inStock,
                  sourceUrl: scrapedProduct.sourceUrl,
                  reference: scrapedProduct.reference,
                });
                summary.updated++;
              }
            } else {
              await addProduct({
                name: scrapedProduct.name,
                brand: scrapedProduct.brand,
                category: normalizedCategory,
                price: scrapedProduct.price,
                image: scrapedProduct.image,
                inStock: scrapedProduct.inStock,
                sourceUrl: scrapedProduct.sourceUrl,
                reference: scrapedProduct.reference,
                description: '',
              });
              summary.inserted++;
            }
          } catch (productError) {
            console.error('Error processing product:', productError);
            summary.failed++;
          }
        }

        setUpdateProgress({ current: 5, total: 5, status: 'Concluído!' });
        await refetch();
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
      setScrapeSummary(summary);
      if (summary.total > 0) {
        setShowSummary(true);
      }
      setUpdateProgress({ current: 0, total: 0, status: '' });
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
        {/* Hero Admin Banner */}
        <section className="relative h-[140px] overflow-hidden rounded-2xl animate-fade-in">
          <div className="h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card p-6 border border-primary/20">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex items-center justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Painel de Controlo</span>
                </div>
                <h1 className="text-xl font-bold text-foreground mb-1">
                  Gestão de Produtos
                </h1>
                <p className="text-muted-foreground text-sm">
                  Adicione, edite e sincronize produtos
                </p>
              </div>
              <img 
                src="/icon.png" 
                alt="Segmento Positivo" 
                className="w-16 h-16 rounded-xl shadow-lg shadow-primary/20"
              />
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="rounded-xl bg-card/80 backdrop-blur p-4 border border-border hover:border-primary/40 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{products.length}</p>
                <p className="text-xs text-muted-foreground">Produtos</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-card/80 backdrop-blur p-4 border border-border hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {products.filter((p) => p.inStock).length}
                </p>
                <p className="text-xs text-muted-foreground">Em estoque</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative animate-slide-up" style={{ animationDelay: "150ms" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar por nome, marca, categoria ou referência..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/80 backdrop-blur border-border focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Button onClick={handleAddNew} className="flex-1 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
            <Plus className="h-5 w-5" />
            Adicionar
          </Button>
          <Button 
            onClick={handleUpdateFromWebsite} 
            variant="secondary"
            className="flex-1 gap-2 bg-card/80 backdrop-blur border border-border hover:border-primary/40"
            disabled={isUpdating}
          >
            <RefreshCw className={`h-5 w-5 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'A atualizar...' : 'Update'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="gap-2 shadow-lg shadow-destructive/20"
              >
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá remover permanentemente todos os {products.length} produtos da base de dados. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deleteAllProducts();
                    toast({
                      title: "Reset concluído",
                      description: "Todos os produtos foram removidos.",
                    });
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Eliminar Tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Products Section Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "250ms" }}>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Catálogo
          </h2>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} de {products.length}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product, i) => (
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

      {/* Progress Dialog */}
      <Dialog open={isUpdating} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              A atualizar produtos
            </DialogTitle>
            <DialogDescription>
              Por favor aguarde enquanto os produtos são sincronizados...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{updateProgress.status}</span>
              <span className="font-medium">{updateProgress.current}/{updateProgress.total}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${updateProgress.total > 0 ? (updateProgress.current / updateProgress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Scrape Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Atualização Concluída
            </DialogTitle>
            <DialogDescription>
              Resumo da sincronização de produtos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-2xl font-bold">{scrapeSummary.total}</p>
                <p className="text-xs text-muted-foreground">Total Encontrados</p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="text-2xl font-bold text-green-500">{scrapeSummary.inserted}</p>
                </div>
                <p className="text-xs text-muted-foreground">Novos</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <RefreshCw className="h-4 w-4 text-blue-500" />
                  <p className="text-2xl font-bold text-blue-500">{scrapeSummary.updated}</p>
                </div>
                <p className="text-xs text-muted-foreground">Atualizados</p>
              </div>
              <div className="rounded-lg bg-red-500/10 p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <p className="text-2xl font-bold text-red-500">{scrapeSummary.failed}</p>
                </div>
                <p className="text-xs text-muted-foreground">Falhas</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSummary(false)} className="w-full">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Admin;
