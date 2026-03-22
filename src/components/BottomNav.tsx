import * as React from "react";
import { motion } from "framer-motion";
import { Home, Settings, User, LogOut, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BottomNav = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const location = useLocation();
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
      <motion.div
        ref={ref}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/85 md:hidden shadow-xl shadow-black/20",
          className
        )}
        role="navigation"
        {...(props as any)}
      >
        {/* Decorative top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="flex items-center justify-around h-16">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors rounded-xl relative",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 400 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "p-1.5 rounded-lg relative",
                    isActive && "bg-primary/20"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-primary/20 rounded-lg"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn(
                    "h-5 w-5 relative z-10",
                    isActive && "icon-glow"
                  )} />
                </motion.div>
                <motion.span 
                  className={cn(
                    "text-xs",
                    isActive ? "font-semibold" : "font-medium"
                  )}
                  animate={{ 
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
          
          {/* Auth button */}
          {user ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSignOut}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors text-primary"
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                className="p-1.5"
              >
                <LogOut className="h-5 w-5" />
              </motion.div>
              <span className="text-xs font-medium">Sair</span>
            </motion.button>
          ) : (
            <Link
              to="/auth"
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors",
                location.pathname === "/auth" ? "text-primary" : "text-muted-foreground"
              )}
            >
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className="p-1.5"
              >
                <User className={cn("h-5 w-5", location.pathname === "/auth" && "drop-shadow-[0_0_8px_hsl(var(--primary))]")} />
              </motion.div>
              <span className="text-xs font-medium">Conta</span>
            </Link>
          )}
        </div>
      </motion.div>
    );
  }
);

BottomNav.displayName = "BottomNav";

export { BottomNav };
