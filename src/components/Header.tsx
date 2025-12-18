import { ShoppingBag, Lock, Search, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/CartButton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { useState, useMemo } from "react";
import { useProducts } from "@/context/ProductContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Início" }: HeaderProps) {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
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

  const handleAdminClick = () => {
    if (user && isAdmin) {
      navigate('/control-panel');
    } else {
      navigate('/auth');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sessão terminada",
      description: "Até breve!",
    });
    navigate('/');
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

            {user ? (
              <Button
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                onClick={handleSignOut}
                title="Terminar sessão"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : null}

            <Button
              variant="ghost" 
              size="icon" 
              className={`h-9 w-9 hover:bg-accent/50 ${isAdmin ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={handleAdminClick}
              title={isAdmin ? "Painel de Controlo" : "Iniciar sessão"}
            >
              <Lock className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}