import { ShoppingBag, Lock, Search, X, User, LogOut, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/CartButton";
import logo from "@/assets/logo.png";
import { useState, useMemo, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Início" }: HeaderProps) {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

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
    ).slice(0, 8);
  }, [products, searchQuery]);


  const handleProductClick = (productId: string) => {
    setShowSearch(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-sm">
        <div className="container flex h-14 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Link to="/" className="group flex items-center gap-2">
              <img src={logo} alt="Segmento Positivo" className="h-9 w-9 rounded-lg object-contain transition-transform duration-200 group-hover:scale-105" />
              <AnimatePresence>
                {!showSearch && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-lg font-bold tracking-tight text-foreground overflow-hidden whitespace-nowrap"
                  >
                    {title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Netflix-style search + action buttons */}
          <div className="flex items-center gap-1">
            {/* Netflix Search */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center border border-border bg-background/80 backdrop-blur-md rounded-sm">
                      <Search className="h-4 w-4 text-muted-foreground ml-2.5 shrink-0" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Títulos, referências, marcas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground px-2 py-2 outline-none"
                      />
                      <button
                        onClick={closeSearch}
                        className="p-1.5 mr-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showSearch && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearch && searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-1.5 w-[320px] bg-popover border border-border rounded-lg shadow-2xl overflow-hidden z-50"
                  >
                    <ScrollArea className="max-h-[360px]">
                      {searchResults.length === 0 ? (
                        <div className="p-8 text-center">
                          <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Nenhum resultado para "{searchQuery}"</p>
                        </div>
                      ) : (
                        <div className="py-1">
                          {searchResults.map((product, i) => (
                            <motion.button
                              key={product.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                              onClick={() => handleProductClick(product.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent/10 transition-colors text-left group"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-11 h-11 rounded-md object-cover bg-muted ring-1 ring-border/50"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{product.brand || product.category}</p>
                              </div>
                              <span className="text-xs font-semibold text-primary shrink-0">
                                €{product.price.toFixed(2)}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </Button>

            {/* Shop */}
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors">
                <ShoppingBag className="h-[18px] w-[18px]" />
              </Button>
            </Link>

            {/* Cart */}
            <CartButton />

            {/* Auth */}
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary hover:bg-primary/10 transition-colors"
                onClick={handleSignOut}
                title="Sair"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors" title="Entrar">
                  <User className="h-[18px] w-[18px]" />
                </Button>
              </Link>
            )}

            {/* Control Panel */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => navigate('/control-panel')}
            >
              <Lock className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Overlay backdrop */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={closeSearch}
          />
        )}
      </AnimatePresence>
    </>
  );
}
