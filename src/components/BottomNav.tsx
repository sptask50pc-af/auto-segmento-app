import * as React from "react";
import { motion } from "framer-motion";
import { Home, Package, User, LogOut, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface BottomNavProps extends React.HTMLAttributes<HTMLDivElement> {
  onAIClick?: () => void;
}

const BottomNav = React.forwardRef<HTMLDivElement, BottomNavProps>(
  ({ className, onAIClick, ...props }, ref) => {
    const location = useLocation();
    const { user, signOut } = useAuth() as { user: any; signOut: () => Promise<void> };
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
      { icon: Package, label: "Produtos", path: "/admin" },
    ];

    const authActive = location.pathname === "/auth";

    return (
      <motion.div
        ref={ref}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        className={cn(
          "fixed bottom-4 left-4 right-4 z-50 md:hidden rounded-2xl mx-auto max-w-sm",
          className
        )}
        role="navigation"
        {...(props as any)}
      >
        <div className="relative border border-border/30 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-lg shadow-black/20 rounded-2xl pb-[env(safe-area-inset-bottom)]">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

          <div className="grid grid-cols-4 h-[68px] items-center px-2">
            {/* Nav items on left */}
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-3 px-1 transition-all duration-200 active:scale-90 rounded-lg",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                      "p-2 rounded-xl relative transition-colors duration-200",
                      isActive && "bg-primary/12"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="bottomnav-indicator"
                        className="absolute inset-0 bg-primary/12 rounded-xl"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <item.icon className={cn(
                      "h-[21px] w-[21px] relative z-10 transition-all duration-200",
                      isActive && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]"
                    )} />
                  </motion.div>
                  <span className={cn(
                    "text-[10px] leading-tight transition-all duration-200",
                    isActive ? "font-semibold" : "font-medium opacity-60"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Auth button */}
            {user ? (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleSignOut}
                className="flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-200 text-primary active:scale-90"
              >
                <div className="p-1.5 rounded-xl">
                  <LogOut className="h-[21px] w-[21px]" />
                </div>
                <span className="text-[10px] leading-tight font-medium">Sair</span>
              </motion.button>
            ) : (
              <Link
                to="/auth"
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-200 active:scale-90",
                  authActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    "p-1.5 rounded-xl relative",
                    authActive && "bg-primary/12"
                  )}
                >
                  {authActive && (
                    <motion.div
                      layoutId="bottomnav-indicator"
                      className="absolute inset-0 bg-primary/12 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <User className={cn(
                    "h-[21px] w-[21px] relative z-10",
                    authActive && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]"
                  )} />
                </motion.div>
                <span className={cn(
                  "text-[10px] leading-tight transition-all duration-200",
                  authActive ? "font-semibold" : "font-medium opacity-60"
                )}>
                  Conta
                </span>
              </Link>
            )}

            {/* AI Button - right side, slightly elevated */}
            <div className="flex flex-col items-center justify-center pb-1">
              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.05 }}
                onClick={onAIClick}
                className="relative flex items-center justify-center h-11 w-11 -mt-3 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground shadow-md shadow-primary/25 transition-shadow duration-200 active:shadow-primary/40"
                aria-label="Abrir assistente AI"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/10" />
                <Sparkles className="h-[18px] w-[18px] relative z-10" />
              </motion.button>
              <span className="text-[9px] font-bold text-primary mt-1 tracking-wide">AI</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

BottomNav.displayName = "BottomNav";

export { BottomNav };
