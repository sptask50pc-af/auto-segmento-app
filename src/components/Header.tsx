import { Settings, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartButton } from "@/components/CartButton";
import logo from "@/assets/logo.png";
import { useRef } from "react";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Início" }: HeaderProps) {
  const navigate = useNavigate();
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    clickCount.current += 1;
    
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }
    
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 500);
    
    // Triple click to access Control Panel
    if (clickCount.current >= 3) {
      e.preventDefault();
      clickCount.current = 0;
      navigate('/control-panel');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2" onClick={handleLogoClick}>
            <img src={logo} alt="Segmento Positivo" className="h-10 w-10 rounded-lg object-contain" />
            <span className="text-xl font-bold tracking-tight">{title}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
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
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
