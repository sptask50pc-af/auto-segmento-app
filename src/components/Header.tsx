import { ShoppingBag, Menu, Lock, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartButton } from "@/components/CartButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/context/ProductContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HeaderProps {
  title?: string;
}

const CONTROL_PANEL_PASSWORD = "SP0050PC";

export function Header({ title = "Início" }: HeaderProps) {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.reference?.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [products, searchQuery]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CONTROL_PANEL_PASSWORD) {
      setShowPasswordDialog(false);
      setPassword("");
      navigate('/control-panel');
      toast({
        title: "Acesso concedido",
        description: "Bem-vindo ao Painel de Controlo",
      });
    } else {
      toast({
        title: "Palavra-passe incorreta",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  const handleProductClick = (productId: string) => {
    setShowSearch(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-primary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Segmento Positivo" className="h-10 w-10 rounded-lg object-contain" />
              <span className="text-xl font-bold tracking-tight">{title}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setShowPasswordDialog(true)}
            >
              <Lock className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </Link>
            <CartButton />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card border-border">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">
                    Início
                  </Link>
                  <Link to="/admin" className="text-lg font-medium hover:text-primary transition-colors">
                    Loja
                  </Link>
                  <button 
                    onClick={() => setShowPasswordDialog(true)}
                    className="text-lg font-medium hover:text-primary transition-colors text-left"
                  >
                    Painel de Controlo
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="sm:max-w-lg p-0 gap-0">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-base"
              autoFocus
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <ScrollArea className="max-h-[60vh]">
            {searchQuery.trim() && searchResults.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum produto encontrado
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="py-2">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors text-left"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      €{product.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            )}
            
            {!searchQuery.trim() && (
              <div className="p-8 text-center text-muted-foreground">
                Digite para pesquisar produtos
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Painel de Controlo
            </DialogTitle>
            <DialogDescription>
              Introduza a palavra-passe para aceder ao Painel de Controlo
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Entrar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
