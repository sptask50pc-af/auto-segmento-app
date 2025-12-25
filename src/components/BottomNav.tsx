import * as React from "react";
import { Home, Settings, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BottomNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { toast } = useToast();

    const handleSignOut = async () => {
      await signOut();
      toast({
        title: "Sessão terminada",
        description: "Até breve!",
      });
    };

    const navItems = [
      { icon: Home, label: "Início", path: "/" },
      { icon: Settings, label: "Admin", path: "/admin" },
    ];

    return (
      <nav
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/85 md:hidden shadow-xl shadow-black/20",
          className
        )}
        {...props}
      >
        {/* Decorative top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all duration-300 rounded-xl",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-300",
                  isActive && "bg-primary/20"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive && "icon-glow"
                  )} />
                </div>
                <span className={cn(
                  "text-xs transition-all duration-300",
                  isActive ? "font-semibold" : "font-medium"
                )}>{item.label}</span>
              </Link>
            );
          })}
          
          {/* Auth button */}
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors text-primary"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs font-medium">Sair</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors",
                location.pathname === "/auth" ? "text-primary" : "text-muted-foreground"
              )}
            >
              <User className={cn("h-5 w-5", location.pathname === "/auth" && "drop-shadow-[0_0_8px_hsl(var(--primary))]")} />
              <span className="text-xs font-medium">Conta</span>
            </Link>
          )}
        </div>
      </nav>
    );
  }
);

BottomNav.displayName = "BottomNav";

export { BottomNav };
