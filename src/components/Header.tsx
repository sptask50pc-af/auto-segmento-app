import { ShoppingBag, Lock, Search, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/CartButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HeaderProps {
  title?: string;
}

const CONTROL_PANEL_PASSWORD = "SP0050PC";

export function Header({ title = "Início" }: HeaderProps) {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { user, signOut } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sessão terminada",
      description: "Até breve!",
    });
  };

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
      <header className="sticky top-0 z-50 w-full border-b border-primary/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-lg shadow-primary/5">
        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="group flex items-center gap-2">
              <div className="relative">
                <img src={logo} alt="Segmento Positivo" className="h-10 w-10 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 rounded-xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
              </div>
              <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{title}</span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {/* Search Popover */}
            <Popover open={showSearch} onOpenChange={setShowSearch}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="end" 
                className="w-80 p-0"
                sideOffset={8}
              >
                <div className="flex items-center gap-2 p-3 border-b border-border">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Pesquisar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-sm"
                    autoFocus
                  />
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <ScrollArea className="max-h-[300px]">
                  {searchQuery.trim() && searchResults.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground text-sm">
                      Nenhum produto encontrado
                    </div>
                  )}
                  
                  {searchResults.length > 0 && (
                    <div className="py-1">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-accent/50 transition-colors text-left"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-muted"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                          <span className="text-xs font-semibold text-primary">
                            €{product.price.toFixed(2)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {!searchQuery.trim() && (
                    <div className="p-6 text-center text-muted-foreground text-sm">
                      Digite para pesquisar
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <Link to="/admin">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/50">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </Link>
            
            <CartButton />

            {/* User Account Button */}
            {user ? (
              <Button
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-primary hover:text-primary hover:bg-primary/10"
                onClick={handleSignOut}
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  title="Entrar"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Button
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/50"
              onClick={() => setShowPasswordDialog(true)}
            >
              <Lock className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

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
