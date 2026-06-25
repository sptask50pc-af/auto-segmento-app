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
import { Plus, Package, RefreshCw, Search, CheckCircle, AlertCircle, XCircle, Shield, DollarSign } from "lucide-react";
import { Product } from "@/types/product";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScrapeSummary {
  total: number;
  inserted: number;
  updated: number;
  failed: number;
}

interface PriceSyncSummary {
  total: number;
  updated: number;
  unchanged: number;
  notFound: number;
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

const ControlPanel = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct, deleteAllProducts, refetch } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSyncingPrices, setIsSyncingPrices] = useState(false);
  const [updateProgress, setUpdateProgress] = useState({ current: 0, total: 0, status: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [scrapeSummary, setScrapeSummary] = useState<ScrapeSummary>({ total: 0, inserted: 0, updated: 0, failed: 0 });
  const [showPriceSummary, setShowPriceSummary] = useState(false);
  const [priceSyncSummary, setPriceSyncSummary] = useState<PriceSyncSummary>({ total: 0, updated: 0, unchanged: 0, notFound: 0 });
  const [showReferenceDialog, setShowReferenceDialog] = useState(false);
  const [priceReference, setPriceReference] = useState('');

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

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteProduct(deleteConfirmId);
    setDeleteConfirmId(null);
    toast({
      title: "Product Removed",
      description: "The product was successfully removed.",
    });
  };

  const handleSubmit = async (productData: Omit<Product, "id">) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
      toast({
        title: "Product Updated",
        description: "Changes have been saved.",
      });
    } else {
      await addProduct(productData);
      toast({
        title: "Product Added",
        description: "The new product has been added to the catalog.",
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
    setUpdateProgress({ current: 0, total: 5, status: 'Loading categories...' });
    const summary: ScrapeSummary = { total: 0, inserted: 0, updated: 0, failed: 0 };

    const getInvokeErrorMessage = (error: unknown, data: unknown) => {
      // If the function returned JSON but the client still treated it as an error, prefer that message.
      const dataMessage = (data as any)?.error;
      if (typeof dataMessage === 'string' && dataMessage.trim()) return dataMessage;

      // Supabase Functions errors usually contain context with the raw body.
      const anyErr = error as any;
      const rawBody = anyErr?.context?.body;
      if (typeof rawBody === 'string' && rawBody.trim()) {
        try {
          const parsed = JSON.parse(rawBody);
          if (typeof parsed?.error === 'string' && parsed.error.trim()) return parsed.error;
        } catch {
          // ignore
        }
      }

      const status = anyErr?.context?.status;
      if (status === 503) return 'O website está em manutenção ou bloqueou o acesso. Tente novamente mais tarde.';

      return anyErr?.message || 'Falha ao atualizar produtos.';
    };

    try {
      const { data, error } = await supabase.functions.invoke('scrape-products');

      if (error || !data?.success) {
        const message = getInvokeErrorMessage(error, data);
        toast({
          title: "Erro ao atualizar",
          description: message,
          variant: "destructive",
        });
        return;
      }

      setUpdateProgress({ current: 3, total: 5, status: 'Processing products...' });

      if (data.products?.length > 0) {
        summary.total = data.products.length;

        for (let i = 0; i < data.products.length; i++) {
          const scrapedProduct = data.products[i];
          const normalizedCategory = normalizeCategory(scrapedProduct.category);

          if (i % 10 === 0) {
            setUpdateProgress({
              current: 3 + Math.floor((i / summary.total) * 2),
              total: 5,
              status: `Processing ${i + 1}/${summary.total} products...`,
            });
          }

          try {
            const existingProduct = products.find(
              (p) =>
                (p.sourceUrl && p.sourceUrl === scrapedProduct.sourceUrl) ||
                p.name.toLowerCase().trim() === scrapedProduct.name.toLowerCase().trim(),
            );

            if (existingProduct) {
              const hasChanges =
                existingProduct.price !== scrapedProduct.price ||
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

        setUpdateProgress({ current: 5, total: 5, status: 'Complete!' });
        await refetch();
      } else {
        toast({
          title: "No Products",
          description: data?.error || "No products found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating from website:', error);
      const message = error instanceof Error ? error.message : 'Failed to update products from website.';
      toast({
        title: "Error",
        description: message,
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

  const handleOpenPriceDialog = () => {
    setPriceReference('');
    setShowReferenceDialog(true);
  };

  const handleSyncPriceByReference = async () => {
    if (!priceReference.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reference number.",
        variant: "destructive",
      });
      return;
    }

    setShowReferenceDialog(false);
    setIsSyncingPrices(true);
    setUpdateProgress({ current: 0, total: 3, status: `Searching for reference ${priceReference}...` });

    try {
      const { data, error } = await supabase.functions.invoke('scrape-prices', {
        body: { reference: priceReference.trim() }
      });

      if (error || !data?.success) {
        const anyErr = error as any;
        let message = (data as any)?.error || anyErr?.message || 'Failed to sync prices.';

        const rawBody = anyErr?.context?.body;
        if (typeof rawBody === 'string' && rawBody.trim()) {
          try {
            const parsed = JSON.parse(rawBody);
            if (typeof parsed?.error === 'string' && parsed.error.trim()) message = parsed.error;
          } catch {
            // ignore
          }
        }

        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        return;
      }

      const { summary } = data;
      await refetch();

      setPriceSyncSummary({
        total: summary?.total || 0,
        updated: summary?.updated || 0,
        unchanged: summary?.unchanged || 0,
        notFound: summary?.notFound || 0,
      });
      setShowPriceSummary(true);

      toast({
        title: "Prices Synced",
        description: `${summary?.updated || 0} prices updated out of ${summary?.total || 0} products.`,
      });
    } catch (error) {
      console.error('Error syncing prices:', error);
      const message = error instanceof Error ? error.message : 'Failed to sync prices.';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSyncingPrices(false);
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
      <Header title="Control Panel" />

      <main className="container px-4 py-6 space-y-6">
        {/* Hero Admin Banner */}
        <section className="relative h-[140px] overflow-hidden rounded-2xl animate-fade-in">
          <div className="h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card p-6 border border-primary/20">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex items-center justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Control Panel</span>
                </div>
                <h1 className="text-xl font-bold text-foreground mb-1">
                  Product Management
                </h1>
                <p className="text-muted-foreground text-sm">
                  Add, edit and sync products
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
                <p className="text-xs text-muted-foreground">Products</p>
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
                <p className="text-xs text-muted-foreground">In Stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative animate-slide-up" style={{ animationDelay: "150ms" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, brand, category or reference..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/80 backdrop-blur border-border focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Button 
            onClick={handleAddNew} 
            className="flex-1 min-w-[100px] gap-2 bg-primary/10 backdrop-blur border border-primary/30 hover:border-primary/60 text-primary shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Add
          </Button>
          <Button 
            onClick={handleUpdateFromWebsite} 
            variant="secondary"
            className="flex-1 min-w-[100px] gap-2 bg-blue-500/10 backdrop-blur border border-blue-500/30 hover:border-blue-500/60 text-blue-400 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
            disabled={isUpdating || isSyncingPrices}
            title="Update products from website"
          >
            <RefreshCw className={`h-5 w-5 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
          <Button 
            onClick={handleOpenPriceDialog} 
            variant="secondary"
            className="flex-1 min-w-[120px] gap-2 bg-green-500/10 backdrop-blur border border-green-500/30 hover:border-green-500/60 text-green-400 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300"
            disabled={isUpdating || isSyncingPrices}
            title="Sync price by reference from segmentopositivo.pt"
          >
            <DollarSign className={`h-5 w-5 ${isSyncingPrices ? 'animate-pulse' : ''}`} />
            {isSyncingPrices ? 'Syncing...' : 'Sync Price'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="gap-2 bg-destructive/10 backdrop-blur border border-destructive/30 hover:border-destructive/60 text-destructive shadow-lg shadow-destructive/10 hover:shadow-destructive/20 transition-all duration-300"
              >
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently remove all {products.length} products from the database. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-muted/50 backdrop-blur border border-border hover:border-muted-foreground/40 text-muted-foreground shadow-lg shadow-muted/10 hover:shadow-muted/20 transition-all duration-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deleteAllProducts();
                    toast({
                      title: "Reset Complete",
                      description: "All products have been removed.",
                    });
                  }}
                  className="bg-destructive/10 backdrop-blur border border-destructive/30 hover:border-destructive/60 text-destructive shadow-lg shadow-destructive/10 hover:shadow-destructive/20 transition-all duration-300"
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Products Section Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "250ms" }}>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Catalog
          </h2>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} of {products.length}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted/50 backdrop-blur border border-border hover:border-muted-foreground/40 text-muted-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive/10 backdrop-blur border border-destructive/30 hover:border-destructive/60 text-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Progress Dialog */}
      <Dialog open={isUpdating || isSyncingPrices} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              {isSyncingPrices ? 'Syncing Prices' : 'Updating Products'}
            </DialogTitle>
            <DialogDescription>
              Please wait while the data is being synchronized...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{updateProgress.status}</span>
              <span className="font-medium">{updateProgress.current}/{updateProgress.total}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${updateProgress.total > 0 ? (updateProgress.current / updateProgress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Update Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Update Complete
            </DialogTitle>
            <DialogDescription>
              Product synchronization summary
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-lg font-bold">{scrapeSummary.total}</p>
                <p className="text-xs text-muted-foreground">Total Found</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-lg font-bold text-green-500">{scrapeSummary.inserted}</p>
                <p className="text-xs text-muted-foreground">Inserted</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-lg font-bold text-blue-500">{scrapeSummary.updated}</p>
                <p className="text-xs text-muted-foreground">Updated</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-lg font-bold text-destructive">{scrapeSummary.failed}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowSummary(false)} 
              className="w-full bg-primary/10 backdrop-blur border border-primary/30 hover:border-primary/60 text-primary shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price Sync Summary Dialog */}
      <Dialog open={showPriceSummary} onOpenChange={setShowPriceSummary}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Price Sync Complete
            </DialogTitle>
            <DialogDescription>
              Price synchronization results
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-lg font-bold">{priceSyncSummary.total}</p>
                <p className="text-xs text-muted-foreground">Products Checked</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-lg font-bold text-green-500">{priceSyncSummary.updated}</p>
                <p className="text-xs text-muted-foreground">Prices Updated</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-lg font-bold text-blue-500">{priceSyncSummary.unchanged}</p>
                <p className="text-xs text-muted-foreground">Unchanged</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10">
              <XCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-lg font-bold text-yellow-500">{priceSyncSummary.notFound}</p>
                <p className="text-xs text-muted-foreground">Not Found</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowPriceSummary(false)} 
              className="w-full bg-primary/10 backdrop-blur border border-primary/30 hover:border-primary/60 text-primary shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reference Input Dialog for Price Sync */}
      <Dialog open={showReferenceDialog} onOpenChange={setShowReferenceDialog}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Sync Price by Reference
            </DialogTitle>
            <DialogDescription>
              Enter the product reference number to sync its price from the website.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter reference (e.g., 9511)"
              value={priceReference}
              onChange={(e) => setPriceReference(e.target.value)}
              className="bg-background border-border"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSyncPriceByReference();
                }
              }}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline"
              onClick={() => setShowReferenceDialog(false)}
              className="bg-muted/50 backdrop-blur border border-border hover:border-muted-foreground/40 text-muted-foreground"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSyncPriceByReference}
              className="bg-green-500/10 backdrop-blur border border-green-500/30 hover:border-green-500/60 text-green-400"
            >
              Sync Price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add Product"}
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

export default ControlPanel;
