import * as React from "react";
import { motion } from "framer-motion";
import { Home, Settings, User, LogOut, Sparkles } from "lucide-react";
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

    const leftItems = [
      { icon: Home, label: "Início", path: "/" },
      { icon: Settings, label: "Admin", path: "/admin" },
    ];

    return (
      <motion.div
        ref={ref}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 md:hidden",
          className
        )}
        role="navigation"
        {...(props as any)}
      >
        {/* Main bar */}
        <div className="relative border-t border-border/40 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-[0_-4px_30px_-10px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom)]">
          {/* Decorative top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="flex h-[60px] items-center justify-around px-3">
            {/* Left nav items */}
            {leftItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 transition-all duration-200 rounded-xl active:scale-90",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                      "p-2 rounded-xl relative transition-colors duration-200",
                      isActive && "bg-primary/15"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-primary/15 rounded-xl"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <item.icon className={cn(
                      "h-[22px] w-[22px] relative z-10 transition-all duration-200",
                      isActive && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]"
                    )} />
                  </motion.div>
                  <span className={cn(
                    "text-[10px] transition-all duration-200",
                    isActive ? "font-semibold" : "font-medium opacity-70"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Center AI Button - elevated */}
            <div className="flex flex-col items-center justify-center -mt-5">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={onAIClick}
                className="relative flex items-center justify-center h-[52px] w-[52px] rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 active:shadow-primary/50"
                aria-label="Abrir assistente AI"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent" />
                <Sparkles className="h-[22px] w-[22px] relative z-10" />
              </motion.button>
              <span className="text-[10px] font-semibold text-primary mt-0.5">AI</span>
            </div>

            {/* Auth button */}
            {user ? (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleSignOut}
                className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 transition-all duration-200 text-primary active:scale-90"
              >
                <div className="p-2 rounded-xl">
                  <LogOut className="h-[22px] w-[22px]" />
                </div>
                <span className="text-[10px] font-medium">Sair</span>
              </motion.button>
            ) : (
              <Link
                to="/auth"
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 transition-all duration-200 active:scale-90",
                  location.pathname === "/auth" ? "text-primary" : "text-muted-foreground"
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    "p-2 rounded-xl relative",
                    location.pathname === "/auth" && "bg-primary/15"
                  )}
                >
                  {location.pathname === "/auth" && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-primary/15 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <User className={cn(
                    "h-[22px] w-[22px] relative z-10",
                    location.pathname === "/auth" && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]"
                  )} />
                </motion.div>
                <span className={cn(
                  "text-[10px] transition-all duration-200",
                  location.pathname === "/auth" ? "font-semibold" : "font-medium opacity-70"
                )}>
                  Conta
                </span>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

BottomNav.displayName = "BottomNav";

export { BottomNav };
