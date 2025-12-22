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
          "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:hidden",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_8px_hsl(var(--primary))]")} />
                <span className="text-xs font-medium">{item.label}</span>
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
